import { useLocation } from "wouter";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { memo, useRef } from "react";
import { useSiteLanguage } from "@/lib/language";
import rendangImg from "@assets/DSC02799_1758628102653.jpg";
import dendengImg from "@assets/DSC07168_1758564588951.jpg";
import gulaiImg from "@assets/DSC02371_1758564588950.jpg";
import ayamPopImg from "@assets/DSC02436_1758564588903.jpg";

/** Empat andalan sesuai Figma Frame 4 (node 0-3) */
const FIGMA_SIGNATURE_ITEMS = [
  { nameID: "Tunjang Hotplate", nameEN: "Tunjang Hotplate", image: gulaiImg },
  { nameID: "Dendeng Bakar", nameEN: "Grilled Dendeng", image: dendengImg },
  { nameID: "Rendang", nameEN: "Rendang", image: rendangImg },
  { nameID: "Es Tebak", nameEN: "Es Tebak", image: ayamPopImg },
] as const;

const CARD_SCROLL_STEP = 475;

function SignatureMenuSection() {
  const [, navigate] = useLocation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { lang } = useSiteLanguage();

  const title =
    lang === "ID" ? "Signature Menu Gadang Barubah" : "Signature Menu Gadang Barubah";

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({
      left: dir === "left" ? -CARD_SCROLL_STEP : CARD_SCROLL_STEP,
      behavior: "smooth",
    });
  };

  return (
    <section
      id="menu-section"
      className="relative overflow-hidden bg-[#300505] py-10 scroll-mt-16 sm:scroll-mt-24 sm:py-12 xl:min-h-[800px] xl:py-0"
    >
      <div className="relative mx-auto max-w-[1690px] px-4 pb-10 sm:px-8 sm:pb-14 lg:px-10 lg:pb-14 lg:pt-12 xl:px-[113px] xl:pb-20 xl:pt-[160px]">
        {/* Header + garis dekor (Figma: Rubik 28px, garis 45×2px putih) */}
        <div className="mb-6 flex flex-col gap-3 sm:mb-10 sm:flex-row sm:items-start sm:justify-between sm:gap-4 xl:mb-[64px]">
          <h2 className="text-figma-section-title max-w-[20rem] text-left text-white sm:max-w-[439px]">
            {title}
          </h2>

          <div className="hidden sm:flex items-center gap-4 shrink-0 pt-2 xl:pt-[25px]">
            <span className="w-[45px] border-t-2 border-white" aria-hidden />
            <button
              type="button"
              onClick={() => scroll("left")}
              className="p-2 text-white/90 hover:text-white transition-colors"
              aria-label={lang === "ID" ? "Geser kiri" : "Scroll left"}
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              className="p-2 text-white/90 hover:text-white transition-colors"
              aria-label={lang === "ID" ? "Geser kanan" : "Scroll right"}
            >
              <ChevronRight className="h-6 w-6" />
            </button>
            <span className="w-[45px] border-t-2 border-white" aria-hidden />
          </div>
        </div>

        <div className="mb-3 flex justify-end gap-1 sm:hidden">
          <button
            type="button"
            onClick={() => scroll("left")}
            className="p-2 text-white/80 hover:text-white"
            aria-label={lang === "ID" ? "Geser kiri" : "Scroll left"}
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            className="p-2 text-white/80 hover:text-white"
            aria-label={lang === "ID" ? "Geser kanan" : "Scroll right"}
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>

        {/* Carousel: kartu 400×250 putih + label Rubik 20px */}
        <div
          ref={scrollRef}
          className="-mx-4 flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-4 pb-1 sm:mx-0 sm:gap-[75px] sm:px-0"
        >
          {FIGMA_SIGNATURE_ITEMS.map((item) => {
            const label = lang === "ID" ? item.nameID : item.nameEN;
            return (
              <article
                key={item.nameID}
                className="flex w-[min(72vw,280px)] shrink-0 snap-center flex-col items-center sm:w-[min(85vw,400px)] sm:snap-start"
              >
                <button
                  type="button"
                  onClick={() => navigate("/menu")}
                  className="h-[150px] w-full overflow-hidden bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50 sm:h-[220px] xl:h-[250px] xl:w-[400px]"
                >
                  <img
                    src={item.image}
                    alt={label}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                  />
                </button>
                <p className="mt-2 text-center font-heroCta text-base leading-tight text-white sm:mt-3 sm:text-lg xl:mt-4 xl:text-[20px] xl:leading-[50px]">
                  {label}
                </p>
              </article>
            );
          })}
        </div>

        <p className="mt-8 text-center">
          <button
            type="button"
            onClick={() => navigate("/menu")}
            className="font-heroCta text-sm italic text-white/70 underline-offset-4 hover:text-white hover:underline"
          >
            {lang === "ID" ? "Lihat menu lengkap →" : "View full menu →"}
          </button>
        </p>
      </div>
    </section>
  );
}

export default memo(SignatureMenuSection);
