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
      <meta name="application-name" content="Gadang Barubah Indonesia" />
      <meta name="publisher" content="gadangbarubahindonesia.id" />
      <meta property="og:image" content="https://gadangbarubahindonesia.id/og-image.jpg" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="id_ID" />
      
      {/* Standard SEO Meta Tags */}
      <meta name="author" content="Gadang Barubah Restaurant" />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="google-site-verification" content="Hj02LNi5KT_Oe-sk6tap41PMAU-bGPe77yPcdNs0pBc" />
      
      
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
          "description": "Rumah makan Padang premium dengan cabang di berbagai kota Indonesia. Nasi padang autentik, rendang terbaik, dan masakan Minang tradisional dengan cita rasa yang tak tertandingi.",
          "image": "https://gadangbarubahindonesia.id/og-image.jpg",
          "url": "https://gadangbarubahindonesia.id",
          "telephone": "+6289509766739",
          "priceRange": "$$",
          "servesCuisine": ["Indonesian", "Padang", "Minangkabau", "Asian"],
          "address": {
            "@type": "PostalAddress",
            "addressRegion": "Indonesia",
            "addressCountry": "ID"
          },
          "openingHours": "Mo-Su 10:00-22:00",
          "hasMenu": "https://gadangbarubahindonesia.id/menu",
          "acceptsReservations": true,
          "paymentAccepted": ["Cash", "Credit Card", "Debit Card"],
          "currenciesAccepted": "IDR",
          "keywords": "rumah makan padang, nasi padang, restoran padang premium, rendang, gulai, masakan minang, gadang barubah, cabang indonesia",
          "sameAs": [
            "https://www.instagram.com/gadangbarubahindonesia",
            "https://wa.me/6289509766739"
          ]
        })}
      </script>
      
      {/* Organization Schema for Brand Recognition */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Gadang Barubah Indonesia",
          "alternateName": ["Gadang Barubah", "gadangbarubahindonesia.id"],
          "url": "https://gadangbarubahindonesia.id",
          "logo": "https://gadangbarubahindonesia.id/og-image.jpg",
          "description": "Rumah makan Padang premium dengan cabang di berbagai kota Indonesia",
          "foundingDate": "2024",
          "industry": "Restaurant & Food Service",
          "numberOfEmployees": "10-50",
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "ID",
            "addressRegion": "Indonesia"
          },
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+6289509766739",
            "contactType": "customer service",
            "availableLanguage": "Indonesian"
          },
          "sameAs": [
            "https://www.instagram.com/gadangbarubahindonesia",
            "https://wa.me/6289509766739"
          ]
        })}
      </script>
      
      {/* WebSite Schema for Search Actions */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Gadang Barubah Indonesia",
          "alternateName": "gadangbarubahindonesia.id",
          "url": "https://gadangbarubahindonesia.id",
          "description": "Website resmi Gadang Barubah - Rumah makan Padang premium Indonesia",
          "inLanguage": "id-ID",
          "copyrightYear": "2024",
          "author": {
            "@type": "Organization",
            "name": "Gadang Barubah Indonesia"
          },
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://gadangbarubahindonesia.id/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        })}
      </script>
    </Helmet>
  );
}