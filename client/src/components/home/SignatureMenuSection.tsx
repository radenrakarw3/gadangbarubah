import { useLocation } from "wouter";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { memo, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSiteLanguage } from "@/lib/language";
import { cn } from "@/lib/utils";
import type { MenuItem } from "@shared/schema";

/** Ganti ke import asset saat file `attached_assets/signature-menu-bg.webp` sudah siap */
const SIGNATURE_MENU_BG_URL: string | undefined = undefined;

/** Ukuran foto kartu menu — dipakai item menu */
const MENU_CARD_IMAGE_CLASS =
  "aspect-[8/5] h-auto w-full max-h-[250px] sm:max-h-[220px] xl:max-h-[200px] 2xl:max-h-[250px]";

/** Tinggi tombol "Lihat Menu" — sama dengan foto (lebar tetap sempit) */
const VIEW_MENU_CARD_HEIGHT_CLASS = "h-[250px] sm:h-[220px] xl:h-[200px] 2xl:h-[250px]";

/** Inset horizontal seragam — judul & kartu carousel sejajar; xl = laptop/MacBook lebih mepet */
const SECTION_SCROLL_INSET =
  "pl-5 pr-4 scroll-ps-5 scroll-pe-4 sm:pl-6 sm:pr-6 sm:scroll-ps-6 sm:scroll-pe-6 lg:pl-8 lg:pr-8 lg:scroll-ps-8 lg:scroll-pe-8 xl:pl-8 xl:pr-6 xl:scroll-ps-8 xl:scroll-pe-6 2xl:pl-12 2xl:pr-8 2xl:scroll-ps-12 2xl:scroll-pe-8";

function CarouselNavButton({
  dir,
  onClick,
  label,
}: {
  dir: "left" | "right";
  onClick: () => void;
  label: string;
}) {
  const Icon = dir === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/35 text-white/90 transition-colors hover:border-white/60 hover:bg-white/10 hover:text-white"
      aria-label={label}
    >
      <Icon className="h-4 w-4" strokeWidth={1.5} />
    </button>
  );
}

function ViewFullMenuCard({ lang, onClick }: { lang: "ID" | "EN"; onClick: () => void }) {
  const label = lang === "ID" ? "Lihat Menu Selengkapnya" : "View Full Menu";

  return (
    <article className="flex w-[min(40vw,140px)] shrink-0 snap-start flex-col items-center sm:w-[150px] xl:w-[140px] 2xl:w-[160px]">
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "group flex flex-col items-center justify-center gap-2 rounded-sm border border-white/20 bg-[#3a0808]/60 px-2 py-4 backdrop-blur-[2px] transition-colors",
          "hover:border-white/35 hover:bg-[#450a0a]/75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50",
          "w-full max-w-[120px] sm:max-w-[130px]",
          VIEW_MENU_CARD_HEIGHT_CLASS,
        )}
        aria-label={label}
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/40 text-white/90 transition-colors group-hover:border-white/65 group-hover:bg-white/10 group-hover:text-white">
          <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
        </span>
        <span className="text-center font-heroCta text-[11px] font-normal leading-snug tracking-[0.02em] text-white/90 sm:text-xs">
          {label}
        </span>
      </button>
    </article>
  );
}

function SignatureMenuSection() {
  const [, navigate] = useLocation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { lang } = useSiteLanguage();

  const { data } = useQuery<{ success: boolean; items: MenuItem[] }>({
    queryKey: ["/api/menu/featured"],
  });

  const featuredItems = data?.items ?? [];

  const title =
    lang === "ID" ? "Signature Menu Gadang Barubah" : "Signature Menu Gadang Barubah";

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("article");
    const gap = parseInt(getComputedStyle(el).columnGap || getComputedStyle(el).gap || "16", 10) || 16;
    const step = card ? card.offsetWidth + gap : el.clientWidth * 0.75;
    el.scrollBy({
      left: dir === "left" ? -step : step,
      behavior: "smooth",
    });
  };

  if (featuredItems.length === 0) {
    return null;
  }

  return (
    <section
      id="menu-section"
      className="signature-menu-section home-section-fluid relative scroll-mt-16 overflow-x-clip py-10 sm:scroll-mt-24 sm:py-12 xl:min-h-[min(800px,85svh)] xl:py-0"
    >
      <div
        className={`signature-menu-section-bg${SIGNATURE_MENU_BG_URL ? " has-image" : ""}`}
        style={
          SIGNATURE_MENU_BG_URL
            ? {
                backgroundImage: `linear-gradient(180deg, rgba(48,5,5,0.72) 0%, rgba(48,5,5,0.88) 100%), url(${SIGNATURE_MENU_BG_URL})`,
              }
            : undefined
        }
        aria-hidden
      />

      <div
        className={cn(
          "relative w-full xl:pt-[clamp(5rem,12vh,160px)]",
          SECTION_SCROLL_INSET,
        )}
      >
        <div className="mb-6 flex flex-col items-start gap-4 sm:mb-6 sm:flex-row sm:items-start sm:justify-between xl:mb-8 2xl:mb-[clamp(2rem,4vh,64px)]">
          <h2 className="text-figma-section-title w-full max-w-[20rem] text-left text-white sm:max-w-[439px]">
            {title}
          </h2>

          <div className="hidden shrink-0 items-center gap-2 sm:flex">
            <CarouselNavButton
              dir="left"
              onClick={() => scroll("left")}
              label={lang === "ID" ? "Geser kiri" : "Scroll left"}
            />
            <CarouselNavButton
              dir="right"
              onClick={() => scroll("right")}
              label={lang === "ID" ? "Geser kanan" : "Scroll right"}
            />
          </div>
        </div>

        <div className="mb-4 flex justify-start gap-2 sm:hidden">
          <CarouselNavButton
            dir="left"
            onClick={() => scroll("left")}
            label={lang === "ID" ? "Geser kiri" : "Scroll left"}
          />
          <CarouselNavButton
            dir="right"
            onClick={() => scroll("right")}
            label={lang === "ID" ? "Geser kanan" : "Scroll right"}
          />
        </div>
      </div>

      <div className="relative w-full">
        <div
          ref={scrollRef}
          className={cn(
            "flex snap-x snap-mandatory items-start gap-4 overflow-x-auto scrollbar-hide pb-2 sm:gap-4 lg:gap-5 xl:gap-4 2xl:gap-8",
            SECTION_SCROLL_INSET,
          )}
        >
          {featuredItems.map((item) => {
            const label = lang === "ID" ? item.nameId : item.nameEn;
            return (
              <article
                key={item.id}
                className="flex w-[min(72vw,280px)] shrink-0 snap-start flex-col items-center sm:w-[min(70vw,360px)] xl:w-[min(26vw,300px)] 2xl:w-[min(32vw,400px)]"
              >
                <button
                  type="button"
                  onClick={() => navigate("/menu")}
                  className={cn(
                    "overflow-hidden bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50",
                    MENU_CARD_IMAGE_CLASS,
                  )}
                >
                  <img
                    src={item.imagePath}
                    alt={label}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                  />
                </button>
                <p className="mt-4 text-center font-heroCta text-base leading-tight text-white sm:mt-4 sm:text-lg xl:mt-3 xl:text-[clamp(0.9375rem,1vw,1.125rem)] xl:leading-snug 2xl:mt-6 2xl:text-[clamp(1rem,1.1vw,1.25rem)]">
                  {label}
                </p>
              </article>
            );
          })}

          <ViewFullMenuCard lang={lang} onClick={() => navigate("/menu")} />
        </div>
      </div>

      <div className="relative h-10 sm:h-14 xl:h-20" aria-hidden />
    </section>
  );
}

export default memo(SignatureMenuSection);
