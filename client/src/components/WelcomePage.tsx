import { useEffect, useRef, useState } from "react";
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
  hasSeenHomeSplash,
  injectHeroPreload,
  markHomeSplashDone,
  preloadDeferredHomeImages,
  type HomeBootPhase,
} from "@/lib/homePreload";

const SPLASH_MAX_MS = 2400;

export default function WelcomePage() {
  const skipSplash = hasSeenHomeSplash();
  const [revealed, setRevealed] = useState(skipSplash);
  const [showLoader, setShowLoader] = useState(!skipSplash);
  const [exiting, setExiting] = useState(false);
  const [progress, setProgress] = useState(skipSplash ? 100 : 0);
  const [phase, setPhase] = useState<HomeBootPhase>(skipSplash ? "ready" : "assets");
  const revealStartedRef = useRef(skipSplash);

  useEffect(() => {
    injectHeroPreload();
  }, []);

  useEffect(() => {
    if (!showLoader) {
      document.body.style.overflow = "";
      return;
    }
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showLoader]);

  useEffect(() => {
    if (skipSplash) {
      preloadDeferredHomeImages();
      return;
    }

    let cancelled = false;
    let didReveal = false;
    let maxWaitTimer: number | undefined;
    let fadeTimer: number | undefined;

    const revealNow = () => {
      if (cancelled || revealStartedRef.current) return;
      revealStartedRef.current = true;
      didReveal = true;
      markHomeSplashDone();
      preloadDeferredHomeImages();
      setProgress(100);
      setPhase("ready");
      setExiting(true);
      fadeTimer = window.setTimeout(() => {
        if (cancelled) return;
        setShowLoader(false);
        setRevealed(true);
      }, 180);
    };

    maxWaitTimer = window.setTimeout(revealNow, SPLASH_MAX_MS);

    void bootHomePage((pct, bootPhase) => {
      if (cancelled || revealStartedRef.current) return;
      setProgress(pct);
      if (bootPhase) setPhase(bootPhase);
    }).finally(() => {
      if (!cancelled) revealNow();
    });

    return () => {
      cancelled = true;
      if (maxWaitTimer !== undefined) window.clearTimeout(maxWaitTimer);
      if (fadeTimer !== undefined) window.clearTimeout(fadeTimer);
      if (!didReveal) revealStartedRef.current = false;
    };
  }, [skipSplash]);

  return (
    <>
      <SEOHead pageKey="home" />

      {showLoader && (
        <HomePageLoader progress={progress} phase={phase} exiting={exiting} />
      )}

      <div
        className={`home-page-root min-h-[100svh] supports-[height:100dvh]:min-h-[100dvh] overflow-x-hidden bg-[#300505] ${
          revealed ? "home-page-enter" : "opacity-0 pointer-events-none select-none"
        }`}
        aria-hidden={!revealed}
      >
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

        {revealed && <CampaignPopup />}
      </div>
    </>
  );
}
