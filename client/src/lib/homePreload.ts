import heroImage from "@assets/DSC07140_1758564407964.jpg";
import heroWebp from "@assets/DSC07140_1758564407964.webp";

export const HERO_IMAGE_URLS = [heroWebp, heroImage] as const;

let deferredStarted = false;

function preloadImage(src: string): void {
  const img = new Image();
  img.src = src;
}

/** Prioritas hero — dipanggil segera saat homepage mount. */
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

/** Gambar bawah fold — chunk terpisah, tidak memblokir parse JS awal. */
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
      /* chunk gagal — hero tetap tampil */
    }
  };

  if (typeof window.requestIdleCallback === "function") {
    window.requestIdleCallback(() => void run(), { timeout: 5000 });
  } else {
    window.setTimeout(() => void run(), 1000);
  }
}

/** Pemanasan non-blocking. */
export function warmHomePage(): void {
  injectHeroPreload();
  void preloadDeferredHomeImages();
}
