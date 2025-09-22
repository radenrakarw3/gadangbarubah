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
      
      {/* Standard SEO Meta Tags */}
      <meta name="author" content="Gadang Barubah Restaurant" />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoConfig.twitterTitle} />
      <meta name="twitter:description" content={seoConfig.twitterDescription} />
      <meta name="twitter:image" content="https://gadangbarubahindonesia.id/og-image.jpg" />
      
      {/* Structured Data for Local Business */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Restaurant",
          "name": "Gadang Barubah",
          "alternateName": ["Gadang Barubah Restaurant", "Rumah Makan Padang Gadang Barubah"],
          "description": "Rumah makan Padang premium terbaik di Cikarang dengan nasi padang autentik, rendang terbaik, dan masakan Minang tradisional. Pilihan utama untuk kuliner Padang di area Pollux Mall.",
          "image": "https://gadangbarubahindonesia.id/og-image.jpg",
          "url": "https://gadangbarubahindonesia.id",
          "telephone": "+6289509766739",
          "priceRange": "$$",
          "servesCuisine": ["Indonesian", "Padang", "Minangkabau", "Asian"],
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Pollux Mall Cikarang",
            "addressLocality": "Cikarang",
            "addressRegion": "Jawa Barat",
            "postalCode": "17530",
            "addressCountry": "ID"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": -6.2564,
            "longitude": 107.1568
          },
          "openingHours": "Mo-Su 10:00-22:00",
          "hasMenu": "https://gadangbarubahindonesia.id/menu",
          "acceptsReservations": true,
          "paymentAccepted": ["Cash", "Credit Card", "Debit Card"],
          "currenciesAccepted": "IDR",
          "keywords": "rumah makan padang, nasi padang, restoran padang cikarang, rendang, gulai, masakan minang, gadang barubah, pollux mall",
          "sameAs": [
            "https://www.instagram.com/gadangbarubahindonesia",
            "https://wa.me/6289509766739"
          ]
        })}
      </script>
    </Helmet>
  );
}