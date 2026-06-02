import { memo } from "react";
import heroImage from "@assets/DSC07140_1758564407964.jpg";
import heroWebp from "@assets/DSC07140_1758564407964.webp";
import heroWebp768 from "@assets/DSC07140_1758564407964-768w.webp";
import heroWebp1280 from "@assets/DSC07140_1758564407964-1280w.webp";
import heroHeadline from "@assets/hero-headline-en.svg";
import HeroReservationSlot from "./HeroReservationSlot";
import { useSiteLanguage } from "@/lib/language";

function HeroSectionInner() {
  const { lang } = useSiteLanguage();
  const headlineAlt =
    lang === "ID"
      ? "Modern & Autentik — Restoran Padang"
      : "Modern & Authentic Padang Restaurant";

  const webpSrcSet = `${heroWebp768} 768w, ${heroWebp1280} 1280w, ${heroWebp} 1920w`;

  return (
    <section className="relative bg-[#300505]">
      <div className="relative min-h-[100dvh] w-full overflow-hidden bg-[#300505] xl:max-h-[900px] xl:h-[min(100svh,900px)]">
        <div className="home-img-wrap absolute inset-0">
          <picture>
            <source
              type="image/webp"
              srcSet={webpSrcSet}
              sizes="100vw"
            />
            <img
              src={heroImage}
              alt="Suasana bersantap Gadang Barubah — rumah makan Padang mewah"
              className="h-full w-full object-cover object-center"
              loading="eager"
              fetchPriority="high"
              decoding="async"
              draggable={false}
            />
          </picture>
        </div>
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/40"
          aria-hidden
        />

        <div className="relative z-10 flex min-h-[100dvh] flex-col items-center justify-center gap-5 px-4 pb-8 pt-[calc(3rem+env(safe-area-inset-top))] sm:gap-6 sm:px-6 lg:px-10 xl:absolute xl:inset-0 xl:block xl:min-h-0 xl:p-0">
          <h1 className="w-full max-w-[min(92vw,340px)] shrink-0 sm:max-w-[420px] lg:max-w-[min(88vw,520px)] xl:pointer-events-none xl:absolute xl:left-1/2 xl:top-[335px] xl:max-w-[690px] xl:-translate-x-1/2">
            <img
              src={heroHeadline}
              alt={headlineAlt}
              className="mx-auto h-auto w-full"
              width={694}
              height={103}
              draggable={false}
            />
          </h1>

          <div className="w-full max-w-[min(100%,420px)] sm:max-w-[480px] lg:max-w-[min(100%,720px)] xl:absolute xl:inset-x-0 xl:bottom-[42px] xl:max-w-none xl:px-[clamp(2rem,6vw,115px)]">
            <HeroReservationSlot />
          </div>
        </div>
      </div>
    </section>
  );
}

export default memo(HeroSectionInner);
