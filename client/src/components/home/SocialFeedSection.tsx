import { memo } from "react";
import { SOCIAL_LINKS } from "@/lib/siteContent";
import feed1 from "@assets/DSC07130_1758564588953.jpg";
import feed2 from "@assets/DSC07152_1758564588952.jpg";
import feed3 from "@assets/DSC03147_1758567860387.jpg";
import feed4 from "@assets/DSC03388_1758567885565.jpg";

const FEED_IMAGES = [
  { src: feed1, alt: "Hidangan signature Gadang Barubah" },
  { src: feed2, alt: "Suasana bersantap di outlet" },
  { src: feed3, alt: "Presentasi masakan Padang" },
  { src: feed4, alt: "Catering event Gadang Barubah" },
];

function SocialFeedSection() {
  return (
    <section className="py-16 sm:py-20 border-t border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-gold text-xs uppercase tracking-[0.25em] mb-2 font-medium">
            @gadangbarubahindonesia
          </p>
          <h2 className="section-heading text-2xl sm:text-3xl">Follow Our Journey</h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {FEED_IMAGES.map((item, i) => (
            <a
              key={i}
              href={SOCIAL_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="luxury-card rounded-none aspect-square home-img-wrap"
            >
              <img
                src={item.src}
                alt={item.alt}
                className="w-full h-full object-cover"
                loading="eager"
                decoding="async"
                draggable={false}
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export default memo(SocialFeedSection);
