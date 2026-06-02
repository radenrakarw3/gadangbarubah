import { memo, useRef } from "react";
import { useLocation } from "wouter";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSiteLanguage } from "@/lib/language";
import nasiBoxImg from "@assets/Nasi Box_1758628102653.jpg";
import snackImg from "@assets/DSC03165_1758567860370.jpg";
import buffetImg from "@assets/DSC07152_1758564588952.jpg";
import stallImg from "@assets/DSC05600_1758565473997.jpg";

/** Empat kartu catering — Figma Frame 6 (400×250, jarak 50px, margin 85px) */
const FIGMA_CATERING_ITEMS = [
  { id: "saji-gadang", nameID: "Saji Gadang", nameEN: "Saji Gadang", image: nasiBoxImg },
  { id: "snack-box", nameID: "Snack Box", nameEN: "Snack Box", image: snackImg },
  { id: "buffet", nameID: "Buffet", nameEN: "Buffet", image: buffetImg },
  { id: "stall", nameID: "Stall", nameEN: "Stall", image: stallImg },
] as const;

function CateringServiceSection() {
  const [, navigate] = useLocation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { lang } = useSiteLanguage();

  const title = lang === "ID" ? "Layanan Katering Kami" : "Our Catering Service";

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("button");
    const gap = 12;
    const step = card ? card.offsetWidth + gap : 300;
    el.scrollBy({
      left: dir === "left" ? -step : step,
      behavior: "smooth",
    });
  };

  return (
    <section
      id="catering-section"
      className="relative scroll-mt-16 overflow-hidden bg-[#300505] py-10 sm:scroll-mt-24 sm:py-12 xl:min-h-[800px] xl:py-0"
    >
      {/* Mobile / tablet */}
      <div className="xl:hidden">
        <h2 className="text-figma-section-title mb-4 px-4 text-center text-white sm:mb-6 sm:px-8">
          {title}
        </h2>

        <div className="mb-3 flex items-center justify-end gap-1 px-4 sm:px-8">
          <button
            type="button"
            onClick={() => scroll("left")}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-white/20 bg-black/25 text-white/90 transition-colors hover:bg-black/40 hover:text-white"
            aria-label={lang === "ID" ? "Geser kiri" : "Scroll left"}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-white/20 bg-black/25 text-white/90 transition-colors hover:bg-black/40 hover:text-white"
            aria-label={lang === "ID" ? "Geser kanan" : "Scroll right"}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-4 pb-2 sm:gap-4 sm:px-8"
        >
          {FIGMA_CATERING_ITEMS.map((item) => {
            const label = lang === "ID" ? item.nameID : item.nameEN;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => navigate("/catering")}
                className="h-[150px] w-[min(72vw,280px)] shrink-0 snap-center overflow-hidden bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40 sm:h-[180px] sm:w-[min(70vw,320px)]"
              >
                <img
                  src={item.image}
                  alt={label}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Desktop: layout Figma */}
      <div className="relative hidden min-h-[min(800px,85svh)] xl:block">
        <h2 className="absolute right-[85px] top-[209px] z-10 whitespace-nowrap text-right font-heroCta text-[28px] font-normal leading-[50px] tracking-[0.01em] text-white">
          {title}
        </h2>

        <div className="absolute inset-x-0 bottom-[258px] top-[292px] flex items-stretch">
          <div className="grid w-full grid-cols-4 gap-[50px] px-[85px]">
            {FIGMA_CATERING_ITEMS.map((item) => {
              const label = lang === "ID" ? item.nameID : item.nameEN;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => navigate("/catering")}
                  className="h-[250px] w-full overflow-hidden bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40"
                >
                  <img
                    src={item.image}
                    alt={label}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default memo(CateringServiceSection);
