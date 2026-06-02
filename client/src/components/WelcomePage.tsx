import { lazy, Suspense, useEffect, useState } from "react";
import SEOHead from "./SEOHead";
import SiteNav from "./SiteNav";
import SiteFooter from "./SiteFooter";
import HeroSection from "./home/HeroSection";
import SectionSeam from "./home/SectionSeam";
import { warmHomePage } from "@/lib/homePreload";

const SignatureMenuSection = lazy(() => import("./home/SignatureMenuSection"));
const AboutSection = lazy(() => import("./home/AboutSection"));
const CateringServiceSection = lazy(() => import("./home/CateringServiceSection"));
const CateringInquirySection = lazy(() => import("./home/CateringInquirySection"));
const ContactSection = lazy(() => import("./home/ContactSection"));
const CampaignPopup = lazy(() => import("./CampaignPopup"));

function SectionPlaceholder({ className = "bg-[#300505]" }: { className?: string }) {
  return <div className={`min-h-[280px] sm:min-h-[360px] ${className}`} aria-hidden />;
}

export default function WelcomePage() {
  const [showCampaign, setShowCampaign] = useState(false);

  useEffect(() => {
    warmHomePage();
    const t = window.setTimeout(() => setShowCampaign(true), 2500);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <>
      <SEOHead pageKey="home" />

      <div className="home-page-root min-h-[100svh] supports-[height:100dvh]:min-h-[100dvh] overflow-x-hidden bg-[#300505]">
        <div className="relative">
          <SiteNav variant="transparent" />
          <main className="home-scroll-content">
            <HeroSection />

            <Suspense fallback={<SectionPlaceholder />}>
              <SignatureMenuSection />
            </Suspense>

            <SectionSeam variant="maroon-to-cream" />

            <Suspense fallback={<SectionPlaceholder className="bg-[#f5ebe6]" />}>
              <AboutSection />
            </Suspense>

            <SectionSeam variant="cream-to-maroon" />

            <Suspense fallback={<SectionPlaceholder />}>
              <CateringServiceSection />
            </Suspense>

            <SectionSeam variant="maroon-to-inquiry" />

            <Suspense fallback={<SectionPlaceholder className="bg-[#FFFCF8]" />}>
              <CateringInquirySection />
            </Suspense>

            <SectionSeam variant="inquiry-to-contact" />

            <Suspense fallback={<SectionPlaceholder className="bg-[#f3efe8]" />}>
              <ContactSection />
            </Suspense>
          </main>
        </div>

        <SectionSeam variant="contact-to-footer" />
        <SiteFooter />

        {showCampaign && (
          <Suspense fallback={null}>
            <CampaignPopup />
          </Suspense>
        )}
      </div>
    </>
  );
}
