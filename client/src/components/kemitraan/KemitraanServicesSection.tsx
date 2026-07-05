import { memo } from "react";
import { useSiteLanguage } from "@/lib/language";
import { KEMITRAAN_SERVICES } from "@/lib/kemitraanContent";
import {
  scrollToKemitraanInquiry,
  setPendingKemitraanService,
} from "@/lib/kemitraanSelection";

function KemitraanServicesSection() {
  const { lang } = useSiteLanguage();
  const sectionTitle = lang === "ID" ? "Layanan Kemitraan" : "Partnership Services";
  const sectionSubtitle =
    lang === "ID"
      ? "Lorem ipsum pilih bentuk kerja sama yang sesuai kebutuhan acara atau bisnis Anda."
      : "Lorem ipsum choose the collaboration format that fits your event or business needs.";

  const handleSelect = (cateringType: string) => {
    setPendingKemitraanService(cateringType);
    scrollToKemitraanInquiry(true);
  };

  return (
    <section id="kemitraan-services-section" className="scroll-mt-20 bg-[#300505] py-14 sm:scroll-mt-24 sm:py-20">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8 lg:px-12">
        <header className="mb-10 text-center lg:mb-12">
          <h2 className="font-heroCta text-figma-section-title text-white">{sectionTitle}</h2>
          <p className="mx-auto mt-3 max-w-xl font-heroCta text-figma-body text-white/70">{sectionSubtitle}</p>
        </header>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {KEMITRAAN_SERVICES.map((service) => {
            const name = lang === "ID" ? service.nameID : service.nameEN;
            const desc = lang === "ID" ? service.descID : service.descEN;
            return (
              <button
                key={service.id}
                type="button"
                onClick={() => handleSelect(service.cateringType)}
                className="group flex flex-col overflow-hidden rounded-lg border border-white/15 bg-[#3a0808]/50 text-left transition-colors hover:border-white/30 hover:bg-[#450a0a]/70"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={service.image}
                    alt={name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#300505]/60 to-transparent" aria-hidden />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-heroCta text-lg text-white">{name}</h3>
                  <p className="mt-2 flex-1 font-heroCta text-sm leading-relaxed text-white/65">{desc}</p>
                  <span className="mt-4 font-heroCta text-xs uppercase tracking-[0.15em] text-[#FFEEDD]/80 group-hover:text-[#FFEEDD]">
                    {lang === "ID" ? "Ajukan kemitraan →" : "Inquire →"}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default memo(KemitraanServicesSection);
