import { useLocation } from "wouter";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { memo, useRef } from "react";
import { useSiteLanguage } from "@/lib/language";
import rendangImg from "@assets/DSC02799_1758628102653.jpg";
import dendengImg from "@assets/DSC07168_1758564588951.jpg";
import gulaiImg from "@assets/DSC02371_1758564588950.jpg";
import ayamPopImg from "@assets/DSC02436_1758564588903.jpg";

/** Ganti ke import asset saat file `attached_assets/signature-menu-bg.webp` sudah siap */
const SIGNATURE_MENU_BG_URL: string | undefined = undefined;

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

function ViewFullMenuCard({ lang, onClick }: { lang: "ID" | "EN"; onClick: () => void }) {
  const label = lang === "ID" ? "Lihat Menu Selengkapnya" : "View Full Menu";

  return (
    <article className="flex w-[min(40vw,140px)] shrink-0 snap-center flex-col items-center justify-center sm:w-[150px] xl:w-[160px]">
      <button
        type="button"
        onClick={onClick}
        className="group flex h-[min(52vw,200px)] w-full max-w-[120px] flex-col items-center justify-center gap-4 rounded-sm border border-white/20 bg-[#3a0808]/60 px-3 py-6 backdrop-blur-[2px] transition-colors hover:border-white/35 hover:bg-[#450a0a]/75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50 sm:max-h-[250px] sm:max-w-[130px]"
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
      className="signature-menu-section home-section-fluid relative scroll-mt-16 overflow-hidden py-10 sm:scroll-mt-24 sm:py-12 xl:min-h-[min(800px,85svh)] xl:py-0"
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

      <div className="relative mx-auto w-full max-w-[1320px] px-4 sm:px-8 lg:px-10 xl:px-12 xl:pt-[clamp(5rem,12vh,160px)]">
        <div className="mb-6 flex flex-col items-center gap-4 sm:mb-8 sm:flex-row sm:items-start sm:justify-between xl:mb-[clamp(2rem,4vh,64px)]">
          <h2 className="text-figma-section-title max-w-[20rem] text-center text-white sm:max-w-[439px] sm:text-left">
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

        <div className="mb-4 flex justify-center gap-2 sm:hidden">
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

        <div className="relative overflow-hidden">
          <div
            ref={scrollRef}
            className="flex snap-x snap-mandatory items-start justify-center gap-4 overflow-x-auto scrollbar-hide pb-2 sm:gap-[clamp(1.5rem,4vw,75px)]"
          >
            {FIGMA_SIGNATURE_ITEMS.map((item) => {
              const label = lang === "ID" ? item.nameID : item.nameEN;
              return (
                <article
                  key={item.nameID}
                  className="flex w-[min(72vw,280px)] shrink-0 snap-center flex-col items-center sm:w-[min(70vw,360px)] sm:snap-start xl:w-[min(32vw,400px)]"
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
                  <p className="mt-4 text-center font-heroCta text-base leading-tight text-white sm:mt-5 sm:text-lg xl:mt-6 xl:text-[clamp(1rem,1.1vw,1.25rem)] xl:leading-snug">
                    {label}
                  </p>
                </article>
              );
            })}

            <ViewFullMenuCard lang={lang} onClick={() => navigate("/menu")} />
          </div>
        </div>
      </div>

      <div className="relative h-10 sm:h-14 xl:h-20" aria-hidden />
    </section>
  );
}

export default memo(SignatureMenuSection);
