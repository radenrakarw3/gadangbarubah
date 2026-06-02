/**
 * Kompres gambar di attached_assets (in-place) + WebP untuk hero.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ASSETS_DIR = path.resolve(__dirname, "..", "attached_assets");
const SKIP_EXT = new Set([".pdf", ".svg"]);

const HERO_NAMES = new Set(["DSC07140_1758564407964.jpg"]);

const CARD_NAMES = new Set([
  "DSC02799_1758628102653.jpg",
  "DSC02436_1758564588903.jpg",
  "DSC02371_1758564588950.jpg",
  "DSC07168_1758564588951.jpg",
  "Nasi Box_1758628102653.jpg",
  "DSC07152_1758564588952.jpg",
  "DSC03147_1758567860387.jpg",
  "DSC03388_1758567885565.jpg",
  "DSC03165_1758567860370.jpg",
  "DSC05600_1758565473997.jpg",
]);

const SECTION_NAMES = new Set([
  "DSC07220_1758565473982.jpg",
  "DSC07153_1758564588952.jpg",
]);

function maxWidthFor(name) {
  if (HERO_NAMES.has(name)) return 1600;
  if (CARD_NAMES.has(name)) return 720;
  if (SECTION_NAMES.has(name)) return 1200;
  if (name.includes("logo")) return 512;
  if (name.endsWith(".png")) return 800;
  return 1280;
}

function jpegQualityFor(name) {
  if (HERO_NAMES.has(name)) return 76;
  if (CARD_NAMES.has(name)) return 74;
  return 78;
}

function tempPath(dest) {
  const base = path.basename(dest).replace(/[^\w.-]+/g, "_");
  return path.join(os.tmpdir(), `gadang-asset-${base}-${process.pid}.tmp`);
}

function safeReplace(tmp, dest) {
  try {
    fs.renameSync(tmp, dest);
    return;
  } catch {
    /* Windows: dest may be locked — overwrite in place */
  }
  try {
    const data = fs.readFileSync(tmp);
    fs.writeFileSync(dest, data);
    fs.unlinkSync(tmp);
    return;
  } catch {
    /* fallback: backup swap */
  }
  const backup = `${dest}.bak`;
  if (fs.existsSync(backup)) fs.unlinkSync(backup);
  if (fs.existsSync(dest)) fs.renameSync(dest, backup);
  try {
    fs.renameSync(tmp, dest);
  } catch {
    fs.copyFileSync(tmp, dest);
    fs.unlinkSync(tmp);
  }
  if (fs.existsSync(backup)) fs.unlinkSync(backup);
}

function formatBytes(n) {
  if (n >= 1024 * 1024) return `${(n / (1024 * 1024)).toFixed(2)} MB`;
  return `${(n / 1024).toFixed(0)} KB`;
}

async function compressJpeg(filePath, name) {
  const before = fs.statSync(filePath).size;
  const maxW = maxWidthFor(name);
  const quality = jpegQualityFor(name);
  const tmp = tempPath(filePath);

  await sharp(filePath)
    .rotate()
    .resize({ width: maxW, withoutEnlargement: true })
    .jpeg({ quality, mozjpeg: true })
    .toFile(tmp);

  safeReplace(tmp, filePath);
  const after = fs.statSync(filePath).size;
  return { before, after };
}

async function exportHeroWebpVariants(jpegPath) {
  const base = jpegPath.replace(/\.jpe?g$/i, "");
  const variants = [
    { width: 768, suffix: "-768w" },
    { width: 1280, suffix: "-1280w" },
    { width: 1920, suffix: "" },
  ];

  for (const { width, suffix } of variants) {
    const webpPath = `${base}${suffix}.webp`;
    const tmp = tempPath(webpPath);
    await sharp(jpegPath)
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 78, effort: 4 })
      .toFile(tmp);
    safeReplace(tmp, webpPath);
    console.log(`  ↳ ${path.basename(webpPath)}: ${formatBytes(fs.statSync(webpPath).size)}`);
  }
}

async function compressWebp(filePath, name) {
  const before = fs.statSync(filePath).size;
  const maxW = maxWidthFor(name);
  const tmp = tempPath(filePath);

  await sharp(filePath)
    .rotate()
    .resize({ width: maxW, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(tmp);

  safeReplace(tmp, filePath);
  const after = fs.statSync(filePath).size;
  return { before, after };
}

async function compressPng(filePath, name) {
  const before = fs.statSync(filePath).size;
  const maxW = maxWidthFor(name);
  const tmp = tempPath(filePath);

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

  for (const name of files) {
    const filePath = path.join(ASSETS_DIR, name);
    const ext = path.extname(name).toLowerCase();

    try {
      if (ext === ".jpg" || ext === ".jpeg") {
        const r = await compressJpeg(filePath, name);
        totalBefore += r.before;
        totalAfter += r.after;
        console.log(`✓ ${name}: ${formatBytes(r.before)} → ${formatBytes(r.after)}`);

        if (HERO_NAMES.has(name)) {
          await exportHeroWebpVariants(filePath);
        }
      } else if (ext === ".webp") {
        if (name.includes("DSC07140") && /-\d+w\.webp$/i.test(name)) {
          continue;
        }
        if (name.includes("DSC07140_1758564407964.webp")) {
          continue;
        }
        if (name.includes("logo") && name.endsWith(".webp")) {
          console.log(`⊘ ${name}: dilewati (tutup file di editor jika ingin dikompres)`);
          continue;
        }
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
  console.log(`Selesai. Perkiraan total setelah kompresi: ~${formatBytes(totalAfter)}`);
}

main();
