import heroImage from "@assets/DSC07140_1758564407964.jpg";
import heroWebp from "@assets/DSC07140_1758564407964.webp";
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

export const HERO_IMAGE_URLS = [heroWebp, heroImage] as const;

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

/** Gambar bawah fold — tidak memblokir tampilan awal. */
export function preloadDeferredHomeImages(): void {
  if (deferredStarted) return;
  deferredStarted = true;

  const run = () => {
    for (const src of Array.from(new Set(DEFERRED_IMAGES))) {
      preloadImage(src);
    }
  };

  if (typeof window.requestIdleCallback === "function") {
    window.requestIdleCallback(run, { timeout: 4000 });
  } else {
    window.setTimeout(run, 800);
  }
}

/** Pemanasan non-blocking: hero preload + deferred saat browser idle. */
export function warmHomePage(): void {
  injectHeroPreload();
  preloadDeferredHomeImages();
}
