import heroImage from "@assets/DSC07140_1758564407964.jpg";
import heroWebp768 from "@assets/DSC07140_1758564407964-768w.webp";
import heroWebp from "@assets/DSC07140_1758564407964.webp";

/** Mobile-first preload untuk LCP */
export const HERO_IMAGE_URLS = [heroWebp768, heroWebp, heroImage] as const;

let deferredStarted = false;

function preloadImage(src: string): void {
  const img = new Image();
  img.src = src;
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

export async function preloadDeferredHomeImages(): Promise<void> {
  if (deferredStarted) return;
  deferredStarted = true;

  const run = async () => {
    try {
      const { DEFERRED_IMAGES } = await import("./homeDeferredAssets");
      for (const src of Array.from(new Set(DEFERRED_IMAGES))) {
        preloadImage(src);
      }
    } catch {
      /* ignore */
    }
  };

  if (typeof window.requestIdleCallback === "function") {
    window.requestIdleCallback(() => void run(), { timeout: 5000 });
  } else {
    window.setTimeout(() => void run(), 1000);
  }
}

export function warmHomePage(): void {
  injectHeroPreload();
  void preloadDeferredHomeImages();
}
