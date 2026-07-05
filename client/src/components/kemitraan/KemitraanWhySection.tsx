import { memo } from "react";
import { Check } from "lucide-react";
import { useSiteLanguage } from "@/lib/language";
import { KEMITRAAN_WHY } from "@/lib/kemitraanContent";

function KemitraanWhySection() {
  const { lang } = useSiteLanguage();
  const copy = KEMITRAAN_WHY[lang];

  return (
    <section id="kemitraan-why-section" className="scroll-mt-20 bg-[#f5ebe6] py-14 sm:scroll-mt-24 sm:py-20">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start lg:gap-16">
          <div>
            <h2 className="font-heroCta text-figma-section-title text-[#3D0C0C]">{copy.title}</h2>
            <p className="mt-4 font-heroCta text-figma-body text-justify text-black/80">{copy.intro}</p>

            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {copy.bullets.map((item) => (
                <li key={item} className="flex gap-2.5 font-heroCta text-sm text-black/85 sm:text-base">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#3F0000]" strokeWidth={2.5} aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {copy.highlights.map((item) => (
              <div
                key={item.label}
                className="flex flex-col items-center justify-center rounded-lg border border-[#3F0000]/10 bg-white/60 px-3 py-6 text-center sm:py-8"
              >
                <span className="font-heroCta text-2xl font-medium text-[#3F0000] sm:text-3xl">{item.value}</span>
                <span className="mt-2 font-heroCta text-xs leading-snug text-black/60 sm:text-sm">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default memo(KemitraanWhySection);
