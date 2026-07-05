import { memo } from "react";
import { useSiteLanguage } from "@/lib/language";
import { KEMITRAAN_GALLERY } from "@/lib/kemitraanContent";
import { cn } from "@/lib/utils";

function KemitraanEventGallerySection() {
  const { lang } = useSiteLanguage();
  const copy = KEMITRAAN_GALLERY[lang];
  const [featured, ...rest] = copy.items;

  return (
    <section
      id="kemitraan-gallery-section"
      className="scroll-mt-20 bg-[#FFFCF8] py-14 sm:scroll-mt-24 sm:py-20"
    >
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8 lg:px-12">
        <header className="mb-10 max-w-2xl">
          <h2 className="font-heroCta text-figma-section-title text-[#3D0C0C]">{copy.title}</h2>
          <p className="mt-3 font-heroCta text-figma-body text-black/70">{copy.subtitle}</p>
        </header>

        {/* Bento grid — layout khusus portofolio event */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-12 lg:grid-rows-2 lg:gap-5">
          <figure
            className={cn(
              "group relative col-span-2 overflow-hidden rounded-lg sm:col-span-2 lg:col-span-7 lg:row-span-2",
              "min-h-[220px] sm:min-h-[280px] lg:min-h-[420px]",
            )}
          >
            <img
              src={featured.image}
              alt={featured.label}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              loading="lazy"
              decoding="async"
              draggable={false}
            />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 sm:p-6">
              <span className="font-heroCta text-lg text-white sm:text-xl">{featured.label}</span>
              <p className="mt-1 font-heroCta text-sm text-white/75">{featured.caption}</p>
            </figcaption>
          </figure>

          {rest.slice(0, 2).map((item) => (
            <figure
              key={item.id}
              className="group relative col-span-1 overflow-hidden rounded-lg lg:col-span-5 lg:min-h-[200px]"
            >
              <img
                src={item.image}
                alt={item.label}
                className="aspect-[4/3] h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03] lg:aspect-auto lg:min-h-[200px]"
                loading="lazy"
                decoding="async"
                draggable={false}
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-3 sm:p-4">
                <span className="font-heroCta text-sm text-white sm:text-base">{item.label}</span>
              </figcaption>
            </figure>
          ))}

          {rest.slice(2).map((item) => (
            <figure
              key={item.id}
              className="group relative col-span-1 overflow-hidden rounded-lg lg:col-span-4 lg:min-h-[180px]"
            >
              <img
                src={item.image}
                alt={item.label}
                className="aspect-square h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03] lg:aspect-auto"
                loading="lazy"
                decoding="async"
                draggable={false}
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-3">
                <span className="font-heroCta text-xs text-white sm:text-sm">{item.label}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export default memo(KemitraanEventGallerySection);
