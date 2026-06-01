import heroImage from "@assets/DSC07140_1758564407964.jpg";
import heroHeadlineEn from "@assets/hero-headline-en.svg";
import aboutTitle from "@assets/about-title-gadang-barubah.svg";
import logoImage from "@assets/padang gadang barubah logo_1758561601552.webp";
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

/** Aset homepage saja — selaras dengan section yang dirender di WelcomePage. */
const HOME_IMAGES = [
  heroImage,
  heroHeadlineEn,
  aboutTitle,
  logoImage,
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
];

const MIN_TOTAL_MS = 700;
const MAX_WAIT_MS = 20000;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function preloadImageDecoded(src: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = async () => {
      try {
        await img.decode();
      } catch {
        /* ignore */
      }
      resolve();
    };
    img.onerror = () => resolve();
    img.src = src;
  });
}

export function waitForHomePaint(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve());
    });
  });
}

async function waitForDomImages(root: HTMLElement): Promise<void> {
  const imgs = Array.from(root.querySelectorAll("img"));

  await Promise.all(
    imgs.map(async (img) => {
      if (!img.complete) {
        await new Promise<void>((resolve) => {
          img.onload = () => resolve();
          img.onerror = () => resolve();
        });
      }
      if (img.naturalWidth === 0) return;
      try {
        await img.decode();
      } catch {
        /* ignore */
      }
    }),
  );
}

async function loadFonts(): Promise<void> {
  try {
    await Promise.all([
      document.fonts.load('400 1rem "Cormorant Garamond"'),
      document.fonts.load('600 1rem "Cormorant Garamond"'),
      document.fonts.load('400 1rem "Inter"'),
      document.fonts.load('500 1rem "Inter"'),
      document.fonts.load('400 1rem "Rubik"'),
      document.fonts.load('400 28px "Rubik"'),
      document.fonts.load('400 90px "Luxurious Script"'),
      document.fonts.load('500 42px "Spectral"'),
      document.fonts.ready,
    ]);
  } catch {
    /* ignore */
  }
}

let bootInFlight: Promise<void> | null = null;

export async function bootHomePage(
  root: HTMLElement,
  onProgress?: (percent: number, phase?: HomeBootPhase) => void,
): Promise<void> {
  if (bootInFlight) {
    await bootInFlight;
    onProgress?.(100, "ready");
    return;
  }

  bootInFlight = (async () => {
    const started = Date.now();
    const report = (percent: number, phase?: HomeBootPhase) =>
      onProgress?.(Math.min(100, percent), phase);

    const uniqueImages = Array.from(new Set(HOME_IMAGES));

    report(5, "assets");
    await waitForHomePaint();

    let loaded = 0;

    await Promise.race([
      (async () => {
        await Promise.all(
          uniqueImages.map(async (src) => {
            await preloadImageDecoded(src);
            loaded += 1;
            report(5 + Math.round((loaded / uniqueImages.length) * 55), "assets");
          }),
        );
      })(),
      sleep(MAX_WAIT_MS),
    ]);

    report(65, "render");
    await Promise.all([loadFonts(), waitForDomImages(root)]);

    report(90, "render");
    await waitForHomePaint();

    const elapsed = Date.now() - started;
    if (elapsed < MIN_TOTAL_MS) {
      await sleep(MIN_TOTAL_MS - elapsed);
    }

    report(100, "ready");
  })();

  try {
    await bootInFlight;
  } finally {
    bootInFlight = null;
  }
}
