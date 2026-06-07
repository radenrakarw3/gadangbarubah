import SEOHead from "./SEOHead";
import SiteNav from "./SiteNav";
import SiteFooter from "./SiteFooter";
import HeroSection from "./home/HeroSection";
import SectionSeam from "./home/SectionSeam";
import LazyWhenVisible from "./home/LazyWhenVisible";

const loadSignatureMenu = () => import("./home/SignatureMenuSection");
const loadAbout = () => import("./home/AboutSection");
const loadOurOutlet = () => import("./home/OurOutletSection");
const loadCateringInquiry = () => import("./home/CateringInquirySection");

export default function WelcomePage() {
  return (
    <>
      <SEOHead pageKey="home" />

      <div className="home-page-root home-desktop-compact flex min-h-[100svh] w-full max-w-full flex-col supports-[height:100dvh]:min-h-[100dvh] overflow-x-clip bg-[#300505]">
        <div className="flex flex-1 flex-col">
          <div className="relative">
            <SiteNav variant="transparent" />
            <main className="home-scroll-content">
              <HeroSection />

              <LazyWhenVisible load={loadSignatureMenu} minHeight="420px" />

              <SectionSeam variant="maroon-to-cream" />

              <LazyWhenVisible load={loadAbout} minHeight="480px" />

              <SectionSeam variant="cream-to-maroon" />

              <LazyWhenVisible load={loadOurOutlet} minHeight="800px" />

              <LazyWhenVisible load={loadCateringInquiry} minHeight="900px" />
            </main>
          </div>
        </div>

        <SectionSeam variant="contact-to-footer" />
        <SiteFooter />
      </div>
    </>
  );
}
