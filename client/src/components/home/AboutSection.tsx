import { memo } from "react";
import { ChevronDown } from "lucide-react";
import aboutImage from "@assets/about-interior_1781246285353.jpg";
import aboutTitle from "@assets/about-title-gadang-barubah.svg";
import { useSiteText } from "@/lib/siteText";
import { useRevealOutlet, useOutletVisible } from "@/lib/outletReveal";

import { cn } from "@/lib/utils";

function AboutTitleGraphic({ className }: { className?: string }) {
  return (
    <img
      src={aboutTitle}
      alt="Gadang Barubah"
      className={cn("h-auto w-full max-w-[564px]", className)}
      width={562}
      height={74}
      draggable={false}
    />
  );
}

function AboutSection() {
  const { t } = useSiteText();
  const aboutCopy = t("home.about.body");
  const outletLabel = t("home.about.outletButton");
  const revealOutlet = useRevealOutlet();
  const outletVisible = useOutletVisible();

  return (
    <section
      id="about-section"
      className="relative scroll-mt-20 overflow-hidden bg-white sm:scroll-mt-24"
    >
      <div className="xl:hidden">
        <div className="relative h-[28vh] min-h-[180px] max-h-[240px] overflow-hidden sm:h-[36vh] sm:max-h-[320px] sm:min-h-[240px]">
          <img
            src={aboutImage}
            alt="Interior Gadang Barubah"
            className="absolute inset-0 h-[115%] w-full object-cover object-[center_30%] -top-[8%]"
            loading="lazy"
            decoding="async"
            draggable={false}
          />
          <div className="absolute inset-0 bg-black/[0.13]" aria-hidden />
        </div>
        <div className="bg-[#f5ebe6] px-4 py-10 sm:px-8 sm:py-14">
          <h2 className="mb-4 flex justify-center sm:mb-6">
            <AboutTitleGraphic className="max-w-[min(92vw,420px)]" />
          </h2>
          <p className="text-figma-body whitespace-pre-line text-justify text-black">
            {aboutCopy}
          </p>
          <button
            type="button"
            onClick={revealOutlet}
            aria-expanded={outletVisible}
            className="mt-8 ml-auto inline-flex h-11 min-w-[170px] items-center justify-between gap-3 rounded-lg bg-[#3F0000] px-5 font-heroCta text-base font-medium italic tracking-[0.03em] text-white hover:bg-[#520000] transition-colors sm:mt-10 sm:h-[52px]"
          >
            <span>{outletLabel}</span>
            <ChevronDown className="h-5 w-5 shrink-0" aria-hidden />
          </button>
        </div>
      </div>

      {/* Desktop — foto kiri, teks kanan vertikal center */}
      <div className="relative mx-auto hidden max-w-[1920px] xl:grid xl:min-h-[min(720px,88svh)] xl:grid-cols-[minmax(0,46%)_minmax(0,54%)] xl:items-stretch">
        <div className="relative min-h-[min(560px,72svh)] overflow-hidden xl:min-h-[min(640px,75svh)] 2xl:min-h-[min(720px,78svh)]">
          <img
            src={aboutImage}
            alt="Interior Gadang Barubah"
            className="absolute inset-0 h-full w-full object-cover object-[center_35%]"
            loading="lazy"
            decoding="async"
            draggable={false}
          />
        </div>

        <div className="flex flex-col justify-center px-[clamp(2rem,4vw,64px)] py-[clamp(3rem,6vh,5rem)] 2xl:px-[clamp(2.5rem,5vw,80px)]">
          <div className="mx-auto flex w-full max-w-[520px] flex-col items-stretch 2xl:max-w-[560px]">
            <h2 className="mb-[clamp(1.25rem,2.5vh,2rem)] w-full text-left">
              <AboutTitleGraphic className="max-w-[min(100%,340px)] 2xl:max-w-[380px]" />
            </h2>

            <p className="font-heroCta whitespace-pre-line text-justify text-base font-normal leading-snug tracking-[0.02em] text-black sm:text-lg xl:text-[clamp(1rem,1.1vw,1.25rem)] xl:leading-[1.45]">
              {aboutCopy}
            </p>

            <button
              type="button"
              onClick={revealOutlet}
              aria-expanded={outletVisible}
              className="mt-[clamp(1.75rem,3.5vh,2.5rem)] ml-auto inline-flex h-11 min-w-[170px] items-center justify-between gap-3 rounded-lg bg-[#3F0000] px-5 font-heroCta text-sm font-medium italic tracking-[0.03em] text-white hover:bg-[#520000] transition-colors 2xl:h-12 2xl:min-w-[190px] 2xl:px-6 2xl:text-[15px]"
            >
              <span>{outletLabel}</span>
              <ChevronDown className="h-5 w-5 shrink-0" aria-hidden />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default memo(AboutSection);
