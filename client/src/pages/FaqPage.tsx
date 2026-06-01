import PublicPageLayout from "@/components/PublicPageLayout";
import SEOHead from "@/components/SEOHead";
import FaqSection from "@/components/FaqSection";
import { useSiteLanguage } from "@/lib/language";

export default function FaqPage() {
  const { lang } = useSiteLanguage();

  return (
    <PublicPageLayout>
      <SEOHead pageKey="faq" />

      <div className="px-4 sm:px-6 lg:px-8 py-10">
        <FaqSection
          showViewAll
          title={lang === "ID" ? "FAQ" : "FAQ"}
          subtitle={
            lang === "ID"
              ? "Temukan jawaban seputar layanan, reservasi, dan outlet Gadang Barubah."
              : "Find answers about services, reservations, and Gadang Barubah outlets."
          }
        />
      </div>
    </PublicPageLayout>
  );
}
