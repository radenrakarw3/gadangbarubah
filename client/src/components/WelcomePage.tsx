import SEOHead from "./SEOHead";
import SiteNav from "./SiteNav";
import SiteFooter from "./SiteFooter";
import HeroSection from "./home/HeroSection";
import SectionSeam from "./home/SectionSeam";
import LazyWhenVisible from "./home/LazyWhenVisible";

const loadSignatureMenu = () => import("./home/SignatureMenuSection");
const loadAbout = () => import("./home/AboutSection");
const loadCateringService = () => import("./home/CateringServiceSection");
const loadCateringInquiry = () => import("./home/CateringInquirySection");
const loadContact = () => import("./home/ContactSection");

export default function WelcomePage() {
  return (
    <>
      <SEOHead pageKey="home" />

      <div className="home-page-root flex min-h-[100svh] flex-col supports-[height:100dvh]:min-h-[100dvh] overflow-x-hidden bg-[#300505]">
        <div className="flex flex-1 flex-col">
          <div className="relative">
            <SiteNav variant="transparent" />
            <main className="home-scroll-content">
              <HeroSection />

              <LazyWhenVisible load={loadSignatureMenu} minHeight="420px" />

              <SectionSeam variant="maroon-to-cream" />

              <LazyWhenVisible load={loadAbout} minHeight="480px" />

              <SectionSeam variant="cream-to-maroon" />

              <LazyWhenVisible load={loadCateringService} minHeight="520px" />

              <SectionSeam variant="maroon-to-inquiry" />

              <LazyWhenVisible load={loadCateringInquiry} minHeight="640px" />

              <SectionSeam variant="inquiry-to-contact" />

              <LazyWhenVisible load={loadContact} minHeight="360px" />
            </main>
          </div>
        </div>

        <SectionSeam variant="contact-to-footer" />
        <SiteFooter />
      </div>
    </>
  );
}
