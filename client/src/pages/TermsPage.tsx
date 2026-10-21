import { Fragment } from "react";
import PublicPageLayout from "@/components/PublicPageLayout";
import SEOHead from "@/components/SEOHead";
import { COMPANY } from "@/lib/siteContent";
import { useSiteText } from "@/lib/siteText";

const SECTIONS = [1, 2, 3, 4] as const;

export default function TermsPage() {
  const { t } = useSiteText();
  const vars = { phone: COMPANY.phoneDisplay, address: t("global.company.address") };

  return (
    <PublicPageLayout>
      <SEOHead pageKey="terms" />

      <div className="px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-3xl mx-auto prose prose-neutral dark:prose-invert">
          <h1 className="text-3xl font-serif font-medium text-primary">
            {t("legal.terms.title")}
          </h1>
          <p className="text-muted-foreground">{t("legal.updated")}</p>

          {SECTIONS.map((n) => (
            <Fragment key={n}>
              <h2>{t(`legal.terms.${n}.heading`)}</h2>
              <p className="whitespace-pre-line">{t(`legal.terms.${n}.body`, vars)}</p>
            </Fragment>
          ))}
        </div>
      </div>
    </PublicPageLayout>
  );
}
