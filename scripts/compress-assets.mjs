/**
 * Kompres semua gambar di attached_assets (in-place).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ASSETS_DIR = path.resolve(__dirname, "..", "attached_assets");
const SKIP_EXT = new Set([".pdf"]);

const HERO_NAMES = new Set(["DSC07140_1758564407964.jpg"]);

const CARD_NAMES = new Set([
  "DSC02799_1758628102653.jpg",
  "DSC02436_1758564588903.jpg",
  "DSC02371_1758564588950.jpg",
  "DSC07168_1758564588951.jpg",
  "Nasi Box_1758628102653.jpg",
  "DSC07130_1758564588953.jpg",
  "DSC07152_1758564588952.jpg",
  "DSC03147_1758567860387.jpg",
  "DSC03388_1758567885565.jpg",
  "Nasi Tumpeng_1758628102631.png",
]);

const PNG_TO_WEBP = new Set(["Nasi Tumpeng_1758628102631.png"]);

function maxWidthFor(name) {
  if (HERO_NAMES.has(name)) return 1920;
  if (CARD_NAMES.has(name)) return 720;
  if (name.includes("logo")) return 512;
  if (name.endsWith(".png")) return 800;
  return 1400;
}

function safeReplace(tmp, dest) {
  try {
    fs.renameSync(tmp, dest);
  } catch {
    fs.copyFileSync(tmp, dest);
    fs.unlinkSync(tmp);
  }
}

function formatBytes(n) {
  if (n >= 1024 * 1024) return `${(n / (1024 * 1024)).toFixed(2)} MB`;
  return `${(n / 1024).toFixed(0)} KB`;
}

async function compressJpeg(filePath, name) {
  const before = fs.statSync(filePath).size;
  const maxW = maxWidthFor(name);
  const tmp = `${filePath}.tmp`;

  await sharp(filePath)
    .rotate()
    .resize({ width: maxW, withoutEnlargement: true })
    .jpeg({ quality: 78, mozjpeg: true })
    .toFile(tmp);

  safeReplace(tmp, filePath);
  const after = fs.statSync(filePath).size;
  return { before, after };
}

async function compressWebp(filePath, name) {
  const before = fs.statSync(filePath).size;
  const maxW = maxWidthFor(name);
  const tmp = `${filePath}.tmp`;

  await sharp(filePath)
    .rotate()
    .resize({ width: maxW, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(tmp);

  safeReplace(tmp, filePath);
  const after = fs.statSync(filePath).size;
  return { before, after };
}

async function pngToWebp(filePath) {
  const before = fs.statSync(filePath).size;
  const base = path.basename(filePath, ".png");
  const newPath = path.join(path.dirname(filePath), `${base}.webp`);
  const maxW = maxWidthFor(path.basename(filePath));

  await sharp(filePath)
    .rotate()
    .resize({ width: maxW, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(newPath);

  fs.unlinkSync(filePath);
  const after = fs.statSync(newPath).size;
  return { before, after, newName: `${base}.webp` };
}

async function compressPng(filePath, name) {
  const before = fs.statSync(filePath).size;
  const maxW = maxWidthFor(name);
  const tmp = `${filePath}.tmp`;

  await sharp(filePath)
    .rotate()
    .resize({ width: maxW, withoutEnlargement: true })
    .png({ compressionLevel: 9, palette: true })
    .toFile(tmp);

  safeReplace(tmp, filePath);
  const after = fs.statSync(filePath).size;
  return { before, after };
}

async function main() {
  const files = fs.readdirSync(ASSETS_DIR).filter((f) => {
    const ext = path.extname(f).toLowerCase();
    return !SKIP_EXT.has(ext);
  });

  let totalBefore = 0;
  let totalAfter = 0;
  const renames = [];

  for (const name of files) {
    const filePath = path.join(ASSETS_DIR, name);
    const ext = path.extname(name).toLowerCase();

    try {
      if (PNG_TO_WEBP.has(name)) {
        const r = await pngToWebp(filePath);
        totalBefore += r.before;
        totalAfter += r.after;
        renames.push(`${name} → ${r.newName}`);
        console.log(`✓ ${name} → ${r.newName}: ${formatBytes(r.before)} → ${formatBytes(r.after)}`);
        continue;
      }

      if (ext === ".jpg" || ext === ".jpeg") {
        const r = await compressJpeg(filePath, name);
        totalBefore += r.before;
        totalAfter += r.after;
        console.log(`✓ ${name}: ${formatBytes(r.before)} → ${formatBytes(r.after)}`);
      } else if (ext === ".webp") {
        const r = await compressWebp(filePath, name);
        totalBefore += r.before;
        totalAfter += r.after;
        console.log(`✓ ${name}: ${formatBytes(r.before)} → ${formatBytes(r.after)}`);
      } else if (ext === ".png") {
        const r = await compressPng(filePath, name);
        totalBefore += r.before;
        totalAfter += r.after;
        console.log(`✓ ${name}: ${formatBytes(r.before)} → ${formatBytes(r.after)}`);
      }
    } catch (err) {
      console.error(`✗ ${name}:`, err);
    }
  }

  console.log("\n---");
  console.log(
    `Total: ${formatBytes(totalBefore)} → ${formatBytes(totalAfter)} (−${Math.round((1 - totalAfter / totalBefore) * 100)}%)`,
  );
  if (renames.length) {
    console.log("\nRenamed (update imports):");
    renames.forEach((r) => console.log(`  ${r}`));
  }
}

main();
