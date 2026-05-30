import { memo } from "react";
import { useLocation } from "wouter";
import { CATERING_CATEGORIES } from "@/lib/siteContent";
import nasiBoxImg from "@assets/Nasi Box_1758628102653.jpg";
import tumpengImg from "@assets/Nasi Tumpeng_1758628102631.webp";
import buffetImg from "@assets/DSC07152_1758564588952.jpg";
import stallImg from "@assets/DSC05600_1758565473997.jpg";
import snackImg from "@assets/DSC03165_1758567860370.jpg";

const CATEGORY_IMAGES = [nasiBoxImg, snackImg, buffetImg, stallImg, tumpengImg];

function CateringServiceSection() {
  const [, navigate] = useLocation();

  return (
    <section id="catering-section" className="py-16 sm:py-20 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="section-heading">Our Catering Service</h2>
          <div className="section-divider mt-4" />
          <p className="text-muted-foreground mt-6 max-w-2xl mx-auto">
            Layanan katering Padang autentik untuk pernikahan, corporate event, arisan, dan gathering.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
          {CATERING_CATEGORIES.map((cat, i) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => navigate("/catering")}
              className="luxury-card rounded-none overflow-hidden text-left"
            >
              <div className="aspect-square home-img-wrap bg-muted">
                <img
                  src={CATEGORY_IMAGES[i]}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                  loading="eager"
                  decoding="async"
                  draggable={false}
                />
              </div>
              <div className="p-3 sm:p-4 border-t border-border/40">
                <p className="font-display text-base sm:text-lg text-foreground text-center">
                  {cat.name}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default memo(CateringServiceSection);
