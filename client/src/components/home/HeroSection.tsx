import { memo } from "react";

import heroImage from "@assets/DSC07140_1758564407964.jpg";

import heroWebp from "@assets/DSC07140_1758564407964.webp";

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

            <source type="image/webp" srcSet={heroWebp} />

            <img

              src={heroImage}

              alt="Suasana bersantap Gadang Barubah — rumah makan Padang mewah"

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

