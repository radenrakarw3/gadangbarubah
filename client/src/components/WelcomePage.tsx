import { useEffect, useState } from "react";
import SEOHead from "./SEOHead";
import SiteNav from "./SiteNav";
import SiteFooter from "./SiteFooter";
import HeroSection from "./home/HeroSection";
import HomePageLoader from "./home/HomePageLoader";
import SignatureMenuSection from "./home/SignatureMenuSection";
import AboutSection from "./home/AboutSection";
import CateringServiceSection from "./home/CateringServiceSection";
import CateringInquirySection from "./home/CateringInquirySection";
import ContactSection from "./home/ContactSection";
import SectionSeam from "./home/SectionSeam";
import CampaignPopup from "./CampaignPopup";
import {
  bootHomePage,
  injectHeroPreload,
  preloadDeferredHomeImages,
  type HomeBootPhase,
} from "@/lib/homePreload";

const SPLASH_MAX_MS = 2000;

export default function WelcomePage() {
  const [showSplash, setShowSplash] = useState(true);
  const [exiting, setExiting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<HomeBootPhase>("assets");

  useEffect(() => {
    injectHeroPreload();
    preloadDeferredHomeImages();

    let done = false;

    const hideSplash = () => {
      if (done) return;
      done = true;
      setExiting(true);
      window.setTimeout(() => setShowSplash(false), 200);
    };

    const capTimer = window.setTimeout(hideSplash, SPLASH_MAX_MS);

    void bootHomePage((pct, bootPhase) => {
      setProgress(pct);
      if (bootPhase) setPhase(bootPhase);
    }).finally(hideSplash);

    return () => {
      window.clearTimeout(capTimer);
    };
  }, []);

  useEffect(() => {
    if (!showSplash) {
      document.body.style.overflow = "";
      return;
    }
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showSplash]);

  return (
    <>
      <SEOHead pageKey="home" />

      {showSplash && (
        <HomePageLoader progress={progress} phase={phase} exiting={exiting} />
      )}

      {/* Konten selalu di DOM & terlihat — splash hanya overlay */}
      <div className="home-page-root min-h-[100svh] supports-[height:100dvh]:min-h-[100dvh] overflow-x-hidden bg-[#300505]">
        <div className="relative">
          <SiteNav variant="transparent" />
          <main className="home-scroll-content">
            <HeroSection />
            <SignatureMenuSection />
            <SectionSeam variant="maroon-to-cream" />
            <AboutSection />
            <SectionSeam variant="cream-to-maroon" />
            <CateringServiceSection />
            <SectionSeam variant="maroon-to-inquiry" />
            <CateringInquirySection />
            <SectionSeam variant="inquiry-to-contact" />
            <ContactSection />
          </main>
        </div>

        <SectionSeam variant="contact-to-footer" />
        <SiteFooter />

        {!showSplash && <CampaignPopup />}
      </div>
    </>
  );
}
