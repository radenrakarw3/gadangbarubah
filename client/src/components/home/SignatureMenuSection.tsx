import { useLocation } from "wouter";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { memo, useRef } from "react";
import { useSiteLanguage } from "@/lib/language";
import rendangImg from "@assets/DSC02799_1758628102653.jpg";
import dendengImg from "@assets/DSC07168_1758564588951.jpg";
import gulaiImg from "@assets/DSC02371_1758564588950.jpg";
import ayamPopImg from "@assets/DSC02436_1758564588903.jpg";

const FIGMA_SIGNATURE_ITEMS = [
  { nameID: "Tunjang Hotplate", nameEN: "Tunjang Hotplate", image: gulaiImg },
  { nameID: "Dendeng Bakar", nameEN: "Grilled Dendeng", image: dendengImg },
  { nameID: "Rendang", nameEN: "Rendang", image: rendangImg },
  { nameID: "Es Tebak", nameEN: "Es Tebak", image: ayamPopImg },
] as const;

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

function SignatureMenuSection() {
  const [, navigate] = useLocation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { lang } = useSiteLanguage();

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

  return (
    <section
      id="menu-section"
      className="home-section-fluid relative overflow-hidden bg-[#300505] py-10 scroll-mt-16 sm:scroll-mt-24 sm:py-12 xl:min-h-[min(800px,85svh)] xl:py-0"
    >
      <div className="relative mx-auto max-w-[1690px] px-4 sm:px-8 lg:px-10 xl:px-[clamp(2rem,6vw,113px)] xl:pt-[clamp(5rem,12vh,160px)]">
        <div className="mb-6 flex items-center justify-between gap-4 sm:mb-10 xl:mb-[clamp(2rem,4vh,64px)]">
          <h2 className="text-figma-section-title max-w-[20rem] text-left text-white sm:max-w-[439px]">
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

        <div className="mb-3 flex justify-end gap-2 sm:hidden">
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

      {/* Full-bleed carousel — kartu sampai tepi monitor */}
      <div className="relative w-full overflow-hidden">
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2 pl-4 pr-4 sm:gap-[clamp(1.5rem,4vw,75px)] sm:pl-8 sm:pr-8 xl:pl-[clamp(2rem,6vw,113px)] xl:pr-[clamp(2rem,6vw,113px)]"
        >
          {FIGMA_SIGNATURE_ITEMS.map((item) => {
            const label = lang === "ID" ? item.nameID : item.nameEN;
            return (
              <article
                key={item.nameID}
                className="flex w-[min(72vw,280px)] shrink-0 snap-center flex-col items-center sm:w-[min(85vw,400px)] sm:snap-start xl:w-[min(28vw,400px)]"
              >
                <button
                  type="button"
                  onClick={() => navigate("/menu")}
                  className="aspect-[8/5] h-auto w-full max-h-[250px] overflow-hidden bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50 sm:max-h-[220px] xl:max-h-[250px]"
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
                <p className="mt-2 text-center font-heroCta text-base leading-tight text-white sm:mt-3 sm:text-lg xl:mt-4 xl:text-[clamp(1rem,1.1vw,1.25rem)] xl:leading-snug">
                  {label}
                </p>
              </article>
            );
          })}
        </div>
      </div>

      <div className="h-10 sm:h-14 xl:h-20" aria-hidden />
    </section>
  );
}

export default memo(SignatureMenuSection);
