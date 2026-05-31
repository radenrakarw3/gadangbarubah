import { memo } from "react";
import heroImage from "@assets/DSC07140_1758564407964.jpg";
import QuickReservationBar from "./QuickReservationBar";

function HeroSectionInner() {
  return (
    <section className="relative mb-6 sm:mb-28 lg:mb-32">
      <div className="relative h-[38vh] min-h-[220px] sm:h-[58vh] sm:min-h-[320px] lg:h-[62vh] overflow-hidden sm:overflow-visible">
        <div className="home-img-wrap absolute inset-0">
          <img
            src={heroImage}
            alt="Suasana bersantap Gadang Barubah — rumah makan Padang mewah"
            className="w-full h-full object-cover object-center"
            loading="eager"
            fetchPriority="high"
            decoding="sync"
            draggable={false}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-maroon-deep/85 via-maroon-deep/30 to-transparent" />
      </div>
      {/* Mobile: form di bawah hero. Desktop: overlap tengah */}
      <div className="relative z-10 px-3 mt-3 sm:mt-0 sm:absolute sm:inset-x-0 sm:bottom-0 sm:translate-y-1/2 sm:px-6 lg:px-8">
        <QuickReservationBar />
      </div>
    </section>
  );
}

export default memo(HeroSectionInner);
