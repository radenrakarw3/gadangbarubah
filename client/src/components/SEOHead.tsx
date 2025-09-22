import { Helmet } from 'react-helmet-async';
import { pageSEOConfigs } from '@/lib/seo';

interface SEOHeadProps {
  pageKey: keyof typeof pageSEOConfigs;
}

export default function SEOHead({ pageKey }: SEOHeadProps) {
  const seoConfig = pageSEOConfigs[pageKey];

  return (
    <Helmet>
      <title>{seoConfig.title}</title>
      <meta name="description" content={seoConfig.description} />
      <meta name="keywords" content={seoConfig.keywords} />
      <link rel="canonical" href={seoConfig.canonical} />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={seoConfig.ogTitle} />
      <meta property="og:description" content={seoConfig.ogDescription} />
      <meta property="og:url" content={seoConfig.ogUrl} />
      <meta property="og:type" content={seoConfig.ogType} />
      <meta property="og:site_name" content={seoConfig.ogSiteName} />
      <meta property="og:image" content="https://gadangbarubahindonesia.id/og-image.jpg" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="id_ID" />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoConfig.twitterTitle} />
      <meta name="twitter:description" content={seoConfig.twitterDescription} />
      <meta name="twitter:image" content="https://gadangbarubahindonesia.id/og-image.jpg" />
    </Helmet>
  );
}