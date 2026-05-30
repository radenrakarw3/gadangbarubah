import { memo } from "react";
import heroImage from "@assets/DSC07140_1758564407964.jpg";
import QuickReservationBar from "./QuickReservationBar";

function HeroSectionInner() {
  return (
    <section className="relative mb-24 sm:mb-28 lg:mb-32">
      <div className="relative h-[50vh] sm:h-[58vh] lg:h-[62vh] min-h-[320px] overflow-visible">
        <div className="home-img-wrap absolute inset-0">
          <img
            src={heroImage}
            alt="Suasana bersantap Gadang Barubah — rumah makan Padang mewah"
            className="w-full h-full object-cover"
            loading="eager"
            fetchPriority="high"
            decoding="sync"
            draggable={false}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-maroon-deep/80 via-maroon-deep/25 to-transparent" />
        {/* Form di tengah-tengah batas hero — overlap foto & section bawah (wireframe) */}
        <div className="absolute inset-x-0 bottom-0 z-10 translate-y-1/2 px-4 sm:px-6 lg:px-8">
          <QuickReservationBar />
        </div>
      </div>
    </section>
  );
}

export default memo(HeroSectionInner);
