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
import SocialFeedSection from "./home/SocialFeedSection";
import ContactSection from "./home/ContactSection";
import CampaignPopup from "./CampaignPopup";
import { bootHomePage, pinHomeImages, type HomeBootPhase } from "@/lib/homePreload";

export default function WelcomePage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<HomeBootPhase>("assets");

  useEffect(() => {
    if (!revealed) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
    document.body.style.overflow = "";
  }, [revealed]);

  useEffect(() => {
    let cancelled = false;

    async function start() {
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
      });

      if (cancelled || !rootRef.current) return;

      await bootHomePage(rootRef.current, (pct, bootPhase) => {
        if (cancelled) return;
        setProgress(pct);
        if (bootPhase) setPhase(bootPhase);
      });

      if (cancelled) return;

      setExiting(true);
      window.setTimeout(async () => {
        if (cancelled) return;
        setRevealed(true);
        if (rootRef.current) {
          await pinHomeImages(rootRef.current);
        }
      }, 500);
    }

    start();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <SEOHead pageKey="home" />

      {!revealed && (
        <HomePageLoader progress={progress} phase={phase} exiting={exiting} />
      )}

      {/* Layout tetap document-flow — tidak berubah fixed→static saat reveal */}
      <div
        ref={rootRef}
        className={`home-page-root min-h-[100svh] supports-[height:100dvh]:min-h-[100dvh] bg-ivory ${
          revealed ? "home-page-enter" : "opacity-0 pointer-events-none select-none"
        }`}
        aria-hidden={!revealed}
      >
        <SiteNav />

        <main className="home-scroll-content">
          <HeroSection />
          <SignatureMenuSection />
          <AboutSection />
          <CateringServiceSection />
          <CateringInquirySection />
          <SocialFeedSection />
          <ContactSection />
        </main>

        <SiteFooter />

        {revealed && <CampaignPopup />}
      </div>
    </>
  );
}
