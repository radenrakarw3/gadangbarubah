import heroImage from "@assets/DSC07140_1758564407964.jpg";
import heroWebp from "@assets/DSC07140_1758564407964.webp";
import heroHeadlineEn from "@assets/hero-headline-en.svg";
import logoImage from "@assets/padang gadang barubah logo_1758561601552.webp";
import aboutTitle from "@assets/about-title-gadang-barubah.svg";
import aboutImage from "@assets/DSC07220_1758565473982.jpg";
import cateringImage from "@assets/DSC07153_1758564588952.jpg";
import rendangImg from "@assets/DSC02799_1758628102653.jpg";
import ayamPopImg from "@assets/DSC02436_1758564588903.jpg";
import gulaiImg from "@assets/DSC02371_1758564588950.jpg";
import dendengImg from "@assets/DSC07168_1758564588951.jpg";
import nasiBoxImg from "@assets/Nasi Box_1758628102653.jpg";
import buffetImg from "@assets/DSC07152_1758564588952.jpg";
import stallImg from "@assets/DSC05600_1758565473997.jpg";
import snackImg from "@assets/DSC03165_1758567860370.jpg";

export type HomeBootPhase = "assets" | "render" | "ready";

export const HERO_IMAGE_URLS = [heroWebp, heroImage] as const;

/** Aset kritis above-the-fold — WebP hero diprioritaskan. */
const CRITICAL_IMAGES = [heroWebp, heroImage, heroHeadlineEn, logoImage] as const;

const DEFERRED_IMAGES = [
  aboutTitle,
  aboutImage,
  cateringImage,
  rendangImg,
  ayamPopImg,
  gulaiImg,
  dendengImg,
  nasiBoxImg,
  buffetImg,
  stallImg,
  snackImg,
] as const;

const BOOT_HARD_CAP_MS = 1800;
const IMAGE_TIMEOUT_MS = 1600;
const FONT_TIMEOUT_MS = 800;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function preloadImage(src: string, timeoutMs: number): Promise<void> {
  return new Promise((resolve) => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      resolve();
    };

    const timer = window.setTimeout(finish, timeoutMs);

    const img = new Image();
    img.onload = () => {
      window.clearTimeout(timer);
      finish();
    };
    img.onerror = () => {
      window.clearTimeout(timer);
      finish();
    };
    img.src = src;
  });
}

async function loadCriticalFonts(): Promise<void> {
  if (!document.fonts?.load) return;
  try {
    await Promise.race([
      Promise.all([
        document.fonts.load('400 1rem "Rubik"'),
        document.fonts.ready,
      ]),
      sleep(FONT_TIMEOUT_MS),
    ]);
  } catch {
    /* ignore */
  }
}

let deferredKickoff = false;

export function preloadDeferredHomeImages(): void {
  if (deferredKickoff) return;
  deferredKickoff = true;
  for (const src of Array.from(new Set(DEFERRED_IMAGES))) {
    void preloadImage(src, 12000);
  }
}

export function injectHeroPreload(): void {
  if (typeof document === "undefined") return;
  for (const href of HERO_IMAGE_URLS) {
    const id = `preload-hero-${href.slice(-24)}`;
    if (document.getElementById(id)) continue;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "preload";
    link.as = "image";
    link.href = href;
    document.head.appendChild(link);
  }
}

/** Boot ringan — tidak pernah menolak masuk; selalu selesai dalam BOOT_HARD_CAP_MS. */
export async function bootHomePage(
  onProgress?: (percent: number, phase?: HomeBootPhase) => void,
): Promise<void> {
  const report = (percent: number, phase?: HomeBootPhase) =>
    onProgress?.(Math.min(100, percent), phase);

  report(10, "assets");

  const critical = Array.from(new Set(CRITICAL_IMAGES));
  let loaded = 0;

  await Promise.race([
    (async () => {
      await Promise.all(
        critical.map(async (src) => {
          await preloadImage(src, IMAGE_TIMEOUT_MS);
          loaded += 1;
          report(10 + Math.round((loaded / critical.length) * 55), "assets");
        }),
      );
      report(75, "render");
      await loadCriticalFonts();
    })(),
    sleep(BOOT_HARD_CAP_MS),
  ]);

  report(100, "ready");
  preloadDeferredHomeImages();
}
