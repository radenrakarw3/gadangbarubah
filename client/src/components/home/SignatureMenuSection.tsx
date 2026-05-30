import { useLocation } from "wouter";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import { memo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { SIGNATURE_MENU } from "@/lib/siteContent";
import rendangImg from "@assets/DSC02799_1758628102653.jpg";
import ayamPopImg from "@assets/DSC02436_1758564588903.jpg";
import gulaiImg from "@assets/DSC02371_1758564588950.jpg";
import dendengImg from "@assets/DSC07168_1758564588951.jpg";
import tumpengImg from "@assets/Nasi Tumpeng_1758628102631.webp";
import nasiBoxImg from "@assets/Nasi Box_1758628102653.jpg";

const MENU_IMAGES = [rendangImg, ayamPopImg, gulaiImg, dendengImg, tumpengImg, nasiBoxImg];

function SignatureMenuSection() {
  const [, navigate] = useLocation();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -320 : 320, behavior: "smooth" });
  };

  return (
    <section id="menu-section" className="py-16 sm:py-20 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-start justify-between gap-3 sm:gap-4 mb-10">
          <Button
            variant="outline"
            size="icon"
            className="hidden sm:inline-flex shrink-0 rounded-none border-border/60 bg-ivory/95 shadow-sm"
            onClick={() => scroll("left")}
            aria-label="Scroll kiri"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex-1 min-w-0">
            <h2 className="section-heading">Signature Menu</h2>
            <div className="section-divider mt-4 ml-0 mr-auto" />
          </div>

          <Button
            variant="outline"
            size="icon"
            className="hidden sm:inline-flex shrink-0 rounded-none border-border/60 bg-ivory/95 shadow-sm"
            onClick={() => scroll("right")}
            aria-label="Scroll kanan"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2 -mx-4 px-4 sm:mx-0 sm:px-0"
        >
          {SIGNATURE_MENU.map((item, i) => (
            <article
              key={item.name}
              className="luxury-card flex-shrink-0 w-[220px] sm:w-[260px] snap-start overflow-hidden group cursor-pointer"
              onClick={() => navigate("/menu")}
            >
              <div className="aspect-square home-img-wrap bg-muted">
                <img
                  src={MENU_IMAGES[i]}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  loading="eager"
                  decoding="async"
                  draggable={false}
                />
              </div>
              <div className="p-4 text-center border-t border-border/40">
                <p className="font-display text-lg text-foreground mb-1">{item.name}</p>
                <p className="text-gold font-medium text-sm tracking-wide">{item.price}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 sm:mt-16 flex flex-col items-center px-4">
          <div className="section-divider w-20 mb-6" />
          <p className="font-display italic text-muted-foreground text-base sm:text-lg mb-2 max-w-xl mx-auto leading-relaxed text-center">
            Lebih dari 50 hidangan autentik khas Minangkabau
          </p>
          <p className="text-muted-foreground/80 text-sm mb-8 max-w-md mx-auto text-center">
            Dari rendang legendaris hingga lauk pilihan harian — setiap hidangan disajikan dengan standar tertinggi.
          </p>
          <button
            type="button"
            className="btn-menu-luxury group"
            onClick={() => navigate("/menu")}
          >
            <span className="btn-menu-luxury-inner">
              <span className="btn-menu-luxury-label">Lihat Menu Lengkap</span>
              <ArrowUpRight className="relative h-5 w-5 text-gold/90 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-gold" />
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}

export default memo(SignatureMenuSection);
