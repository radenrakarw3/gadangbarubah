import SEOHead from "@/components/SEOHead";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import LazyWhenVisible from "@/components/home/LazyWhenVisible";
import KemitraanHeroSection from "@/components/kemitraan/KemitraanHeroSection";
import KemitraanEventGallerySection from "@/components/kemitraan/KemitraanEventGallerySection";
import KemitraanInquirySection from "@/components/kemitraan/KemitraanInquirySection";

const loadServices = () => import("@/components/kemitraan/KemitraanServicesSection");
const loadWhy = () => import("@/components/kemitraan/KemitraanWhySection");
const loadProcess = () => import("@/components/kemitraan/KemitraanProcessSection");

export default function KemitraanPage() {
  return (
    <>
      <SEOHead pageKey="kemitraan" />

      <div className="flex min-h-[100svh] w-full flex-col supports-[height:100dvh]:min-h-[100dvh] bg-[#FFFCF8]">
        <SiteNav />

        <main>
          <KemitraanHeroSection />
          <KemitraanEventGallerySection />

          <LazyWhenVisible load={loadServices} minHeight="480px" />
          <LazyWhenVisible load={loadWhy} minHeight="360px" />
          <LazyWhenVisible load={loadProcess} minHeight="280px" />

          {/* Form selalu dimuat agar pre-select layanan & scroll CTA berfungsi */}
          <KemitraanInquirySection />
        </main>

        <SiteFooter />
      </div>
    </>
  );
}
