import PublicPageLayout from "@/components/PublicPageLayout";
import SEOHead from "@/components/SEOHead";
import FaqSection from "@/components/FaqSection";

export default function FaqPage() {
  return (
    <PublicPageLayout>
      <SEOHead pageKey="faq" />

      <div className="px-4 sm:px-6 lg:px-8 py-10">
        <FaqSection showViewAll title="FAQ's" />
      </div>
    </PublicPageLayout>
  );
}
