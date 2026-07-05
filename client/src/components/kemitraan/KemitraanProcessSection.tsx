import { memo } from "react";
import { useSiteLanguage } from "@/lib/language";
import { KEMITRAAN_PROCESS } from "@/lib/kemitraanContent";

function KemitraanProcessSection() {
  const { lang } = useSiteLanguage();
  const copy = KEMITRAAN_PROCESS[lang];

  return (
    <section id="kemitraan-process-section" className="scroll-mt-20 border-y border-white/10 bg-[#250404] py-14 sm:scroll-mt-24 sm:py-16">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8 lg:px-12">
        <h2 className="mb-10 text-center font-heroCta text-figma-section-title text-white sm:mb-12">
          {copy.title}
        </h2>

        <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
          {copy.steps.map((step, index) => (
            <li key={step.title} className="relative flex flex-col">
              {index < copy.steps.length - 1 ? (
                <span
                  className="absolute left-[1.125rem] top-10 hidden h-px w-[calc(100%+1rem)] bg-white/20 lg:block"
                  aria-hidden
                />
              ) : null}
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/30 font-heroCta text-sm text-white/90">
                {index + 1}
              </span>
              <h3 className="mt-4 font-heroCta text-lg text-white">{step.title}</h3>
              <p className="mt-2 font-heroCta text-sm leading-relaxed text-white/65">{step.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default memo(KemitraanProcessSection);
