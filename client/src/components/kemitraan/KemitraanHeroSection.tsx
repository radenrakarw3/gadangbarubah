import { memo } from "react";
import heroFacade from "@assets/hero-facade_1781246285353.webp";
import { useSiteLanguage } from "@/lib/language";
import { KEMITRAAN_HERO } from "@/lib/kemitraanContent";
import { scrollToKemitraanInquiry } from "@/lib/kemitraanSelection";

function KemitraanHeroSection() {
  const { lang } = useSiteLanguage();
  const copy = KEMITRAAN_HERO[lang];

  const scrollToInquiry = () => {
    scrollToKemitraanInquiry();
  };

  return (
    <section id="hero-section" className="relative min-h-[min(72svh,640px)] overflow-hidden bg-[#300505] pt-[72px] xl:pt-[72px]">
      <div className="absolute inset-0">
        <img
          src={heroFacade}
          alt=""
          className="h-full w-full object-cover object-center opacity-40"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          draggable={false}
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-[#300505] via-[#300505]/85 to-[#300505]/40"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#300505] via-transparent to-black/30"
          aria-hidden
        />
      </div>

      <div className="relative mx-auto flex min-h-[min(72svh,640px)] max-w-[1200px] flex-col justify-end px-5 pb-12 pt-28 sm:px-8 sm:pb-16 sm:pt-32 lg:px-12 lg:pb-20">
        <p className="mb-3 font-heroCta text-xs uppercase tracking-[0.25em] text-[#FFEEDD]/80 sm:text-sm">
          {copy.eyebrow}
        </p>
        <h1 className="max-w-[16ch] font-heroCta text-[clamp(2rem,5vw,3.25rem)] font-normal leading-[1.15] tracking-[0.01em] text-white">
          {copy.headline}
        </h1>
        <p className="mt-5 max-w-[52ch] font-heroCta text-base leading-relaxed text-white/80 sm:text-lg">
          {copy.subheadline}
        </p>
        <button
          type="button"
          onClick={scrollToInquiry}
          className="mt-8 inline-flex w-fit items-center justify-center rounded-lg border border-white/25 bg-white/10 px-8 py-3.5 font-heroCta text-base font-medium italic tracking-[0.03em] text-white backdrop-blur-sm transition-colors hover:bg-[#3F0000] hover:border-[#3F0000]"
        >
          {copy.cta}
        </button>
      </div>
    </section>
  );
}

export default memo(KemitraanHeroSection);
