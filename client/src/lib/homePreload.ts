import heroWebp768 from "@assets/DSC07140_1758564407964-768w.webp";

/** Satu URL hero mobile — cukup untuk LCP, hindari 3× preload bersaing */
export const HERO_LCP_URL = heroWebp768;

let deferredStarted = false;

function preloadImage(src: string): void {
  const img = new Image();
  img.src = src;
}

export function injectHeroPreload(): void {
  if (typeof document === "undefined") return;
  const id = "preload-hero-lcp";
  if (document.getElementById(id)) return;
  const link = document.createElement("link");
  link.id = id;
  link.rel = "preload";
  link.as = "image";
  link.type = "image/webp";
  link.href = HERO_LCP_URL;
  document.head.appendChild(link);
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
