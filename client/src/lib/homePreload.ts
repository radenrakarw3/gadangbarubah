import heroImage from "@assets/DSC07140_1758564407964.jpg";
import logoImage from "@assets/padang gadang barubah logo_1758561601552.webp";
import aboutImage from "@assets/DSC07220_1758565473982.jpg";
import cateringImage from "@assets/DSC07153_1758564588952.jpg";
import rendangImg from "@assets/DSC02799_1758628102653.jpg";
import ayamPopImg from "@assets/DSC02436_1758564588903.jpg";
import gulaiImg from "@assets/DSC02371_1758564588950.jpg";
import dendengImg from "@assets/DSC07168_1758564588951.jpg";
import tumpengImg from "@assets/Nasi Tumpeng_1758628102631.webp";
import nasiBoxImg from "@assets/Nasi Box_1758628102653.jpg";
import feed1 from "@assets/DSC07130_1758564588953.jpg";
import feed2 from "@assets/DSC07152_1758564588952.jpg";
import feed3 from "@assets/DSC03147_1758567860387.jpg";
import feed4 from "@assets/DSC03388_1758567885565.jpg";
import buffetImg from "@assets/DSC07152_1758564588952.jpg";
import stallImg from "@assets/DSC05600_1758565473997.jpg";
import snackImg from "@assets/DSC03165_1758567860370.jpg";

export type HomeBootPhase = "assets" | "render" | "ready";

const HOME_IMAGES = [
  heroImage,
  logoImage,
  aboutImage,
  cateringImage,
  rendangImg,
  ayamPopImg,
  gulaiImg,
  dendengImg,
  tumpengImg,
  nasiBoxImg,
  feed1,
  feed2,
  feed3,
  feed4,
  buffetImg,
  stallImg,
  snackImg,
];

const MIN_TOTAL_MS = 3800;
const MAX_WAIT_MS = 30000;
const WARM_SCROLL_STEPS = 12;

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

function forceLayout(root: HTMLElement): void {
  void root.offsetHeight;
  root.querySelectorAll("section, main, footer, header, article").forEach((el) => {
    void (el as HTMLElement).offsetHeight;
  });
  root.querySelectorAll("img").forEach((img) => {
    void img.getBoundingClientRect();
  });
}

/** Warm scroll pakai window — sama persis dengan scroll user setelah halaman tampil */
async function warmWindowScroll(root: HTMLElement): Promise<void> {
  const html = document.documentElement;
  const prevBodyOverflow = document.body.style.overflow;
  const prevHtmlOverflow = html.style.overflow;

  document.body.style.overflow = "auto";
  html.style.overflow = "auto";

  const maxScroll = Math.max(0, html.scrollHeight - window.innerHeight);

  for (let i = 0; i <= WARM_SCROLL_STEPS; i++) {
    window.scrollTo({ top: Math.round((maxScroll * i) / WARM_SCROLL_STEPS), left: 0 });
    forceLayout(root);
    await waitForHomePaint();
  }

  window.scrollTo({ top: 0, left: 0 });
  forceLayout(root);
  await waitForHomePaint();

  document.body.style.overflow = prevBodyOverflow;
  html.style.overflow = prevHtmlOverflow;
}

async function loadFonts(): Promise<void> {
  try {
    await Promise.all([
      document.fonts.load('400 1rem "Cormorant Garamond"'),
      document.fonts.load('600 1rem "Cormorant Garamond"'),
      document.fonts.load('400 1rem "Inter"'),
      document.fonts.load('500 1rem "Inter"'),
      document.fonts.ready,
    ]);
  } catch {
    /* ignore */
  }
}

export async function bootHomePage(
  root: HTMLElement,
  onProgress?: (percent: number, phase?: HomeBootPhase) => void,
): Promise<void> {
  const started = Date.now();
  const report = (percent: number, phase?: HomeBootPhase) =>
    onProgress?.(Math.min(100, percent), phase);

  report(3, "assets");
  await waitForHomePaint();

  const uniqueImages = Array.from(new Set(HOME_IMAGES));
  let loaded = 0;

  await Promise.race([
    (async () => {
      await Promise.all(
        uniqueImages.map(async (src) => {
          await preloadImageDecoded(src);
          loaded += 1;
          report(3 + Math.round((loaded / uniqueImages.length) * 47), "assets");
        }),
      );
    })(),
    sleep(MAX_WAIT_MS),
  ]);

  report(52, "render");
  await waitForHomePaint();

  await loadFonts();
  report(62, "render");

  await waitForDomImages(root);
  report(72, "render");

  forceLayout(root);
  await waitForHomePaint();
  report(78, "render");

  await warmWindowScroll(root);
  report(90, "render");

  await waitForDomImages(root);

  for (let i = 0; i < 5; i++) {
    forceLayout(root);
    await waitForHomePaint();
  }

  report(96, "render");

  const elapsed = Date.now() - started;
  if (elapsed < MIN_TOTAL_MS) {
    await sleep(MIN_TOTAL_MS - elapsed);
  }

  report(100, "ready");
}

/** Panggil sekali setelah reveal — pin bitmap gambar di memori GPU */
export async function pinHomeImages(root: HTMLElement): Promise<void> {
  const imgs = Array.from(root.querySelectorAll("img"));
  await Promise.all(
    imgs.map(async (img) => {
      if (img.naturalWidth === 0) return;
      try {
        await img.decode();
      } catch {
        /* ignore */
      }
    }),
  );
}
