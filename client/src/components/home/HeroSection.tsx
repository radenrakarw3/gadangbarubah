import { memo } from "react";

import heroImage from "@assets/hero-interior_DSC09800.jpg";
import heroImageMd from "@assets/hero-interior_DSC09800-1600.jpg";
import heroWebp from "@assets/hero-interior_DSC09800.webp";
import heroWebpMd from "@assets/hero-interior_DSC09800-1600.webp";

import heroHeadline from "@assets/hero-headline-en.svg";

import QuickReservationBar from "./QuickReservationBar";

import { useSiteLanguage } from "@/lib/language";



function HeroSectionInner() {

  const { lang } = useSiteLanguage();

  const headlineAlt =

    lang === "ID"

      ? "Modern & Autentik — Restoran Padang"

      : "Modern & Authentic Padang Restaurant";



  return (

    <section id="hero-section" className="relative bg-[#300505]">

      <div className="hero-stage relative">

        <div className="home-img-wrap absolute inset-0">

          <picture>

            <source
              type="image/webp"
              srcSet={`${heroWebpMd} 1600w, ${heroWebp} 2560w`}
              sizes="100vw"
            />

            <img

              src={heroImage}

              srcSet={`${heroImageMd} 1600w, ${heroImage} 2560w`}

              sizes="100vw"

              width={2560}

              height={1708}

              alt="Interior Gadang Barubah — ruang makan Padang modern dan autentik"

              className="h-full w-full object-cover object-center"

              loading="eager"

              fetchPriority="high"

              decoding="async"

              draggable={false}

            />

          </picture>

        </div>

        <div

          className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/40"

          aria-hidden

        />



        <div className="hero-overlay">

          <h1 className="hero-headline">

            <img

              src={heroHeadline}

              alt={headlineAlt}

              className="hero-headline-img"

              width={694}

              height={103}

              draggable={false}

            />

          </h1>



          <div className="hero-reservation-bar">

            <QuickReservationBar />

          </div>

        </div>

      </div>

    </section>

  );

}



export default memo(HeroSectionInner);

