import { memo } from "react";
import heroImage from "@assets/DSC07140_1758564407964.jpg";
import heroHeadline from "@assets/hero-headline-en.svg";
import QuickReservationBar from "./QuickReservationBar";
import { useSiteLanguage } from "@/lib/language";

function HeroSectionInner() {
  const { lang } = useSiteLanguage();
  const headlineAlt =
    lang === "ID"
      ? "Modern & Autentik — Restoran Padang"
      : "Modern & Authentic Padang Restaurant";

  return (
    <section className="relative bg-[#300505]">
      <div className="relative min-h-[100dvh] w-full overflow-hidden bg-[#300505] lg:max-h-[900px] lg:h-[min(100svh,900px)]">
        <div className="home-img-wrap absolute inset-0">
          <img
            src={heroImage}
            alt="Suasana bersantap Gadang Barubah — rumah makan Padang mewah"
            className="h-full w-full object-cover object-center"
            loading="eager"
            fetchPriority="high"
            decoding="sync"
            draggable={false}
          />
        </div>
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/40"
          aria-hidden
        />

        {/* Mobile: headline + reservasi di tengah layar. Desktop: posisi Figma absolut */}
        <div className="relative z-10 flex min-h-[100dvh] flex-col items-center justify-center gap-5 px-4 pb-8 pt-[calc(3rem+env(safe-area-inset-top))] sm:gap-6 sm:px-6 lg:absolute lg:inset-0 lg:block lg:min-h-0 lg:p-0">
          <h1 className="w-full max-w-[min(92vw,340px)] shrink-0 sm:max-w-[420px] lg:pointer-events-none lg:absolute lg:left-1/2 lg:top-[335px] lg:max-w-[690px] lg:-translate-x-1/2">
            <img
              src={heroHeadline}
              alt={headlineAlt}
              className="mx-auto h-auto w-full"
              width={694}
              height={103}
              draggable={false}
            />
          </h1>

          <div className="w-full max-w-[min(100%,420px)] sm:max-w-[480px] lg:absolute lg:inset-x-0 lg:bottom-[42px] lg:max-w-none lg:px-[115px]">
            <QuickReservationBar />
          </div>
        </div>
      </div>
    </section>
  );
}

export default memo(HeroSectionInner);
