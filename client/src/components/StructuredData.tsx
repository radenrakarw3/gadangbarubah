export function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Restaurant",
        "@id": "https://gadangbarubahindonesia.id/#restaurant",
        "name": "Gadang Barubah Restaurant",
        "alternateName": "Gadang Barubah",
        "description": "Restoran Padang di Sumatera Barat yang menyajikan masakan Minang authentic dengan cita rasa tradisional. Spesialis nasi padang, rendang, dan sate padang.",
        "url": "https://gadangbarubahindonesia.id",
        "telephone": "+62812-3456-7890",
        "email": "info@gadangbarubahindonesia.id",
        "priceRange": "$$",
        "currenciesAccepted": "IDR",
        "paymentAccepted": ["Cash", "Credit Card", "Debit Card", "Mobile Payment"],
        "servesCuisine": ["Indonesian", "Minangkabau", "Padang"],
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Jl. Veteran No. 123",
          "addressLocality": "Padang",
          "addressRegion": "Sumatera Barat", 
          "postalCode": "25111",
          "addressCountry": "ID"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": -0.9492,
          "longitude": 100.3543
        },
        "openingHoursSpecification": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            "opens": "10:00",
            "closes": "22:00"
          }
        ],
        "menu": "https://gadangbarubahindonesia.id/#menu",
        "image": [
          "https://gadangbarubahindonesia.id/assets/rendang-gadang-barubah.jpg",
          "https://gadangbarubahindonesia.id/assets/nasi-padang-complete.jpg",
          "https://gadangbarubahindonesia.id/assets/restaurant-interior.jpg"
        ],
        "logo": "https://gadangbarubahindonesia.id/favicon.webp",
        "sameAs": [
          "https://instagram.com/gadangbarubah",
          "https://facebook.com/gadangbarubah",
          "https://www.google.com/maps/place/Gadang+Barubah+Restaurant",
          "https://gofood.link/a/gadangbarubah",
          "https://grabfood.page.link/gadangbarubah"
        ],
        "hasMenu": {
          "@type": "Menu",
          "@id": "https://gadangbarubahindonesia.id/#menu",
          "name": "Menu Gadang Barubah",
          "description": "Menu lengkap masakan Padang tradisional",
          "hasMenuSection": [
            {
              "@type": "MenuSection",
              "name": "Menu Signature",
              "description": "Menu andalan khas Gadang Barubah",
              "hasMenuItem": [
                {
                  "@type": "MenuItem",
                  "name": "Rendang Gadang Barubah",
                  "description": "Rendang daging sapi dengan bumbu rahasia turun temurun",
                  "offers": {
                    "@type": "Offer",
                    "price": "45000",
                    "priceCurrency": "IDR"
                  }
                },
                {
                  "@type": "MenuItem", 
                  "name": "Sate Padang Special",
                  "description": "Sate daging dengan kuah khas Padang yang gurih",
                  "offers": {
                    "@type": "Offer",
                    "price": "35000",
                    "priceCurrency": "IDR"
                  }
                }
              ]
            }
          ]
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.8",
          "reviewCount": "892",
          "bestRating": "5",
          "worstRating": "1"
        },
        "review": [
          {
            "@type": "Review",
            "author": {
              "@type": "Person",
              "name": "Budi Santoso"
            },
            "reviewRating": {
              "@type": "Rating",
              "ratingValue": "5",
              "bestRating": "5"
            },
            "reviewBody": "Rendangnya benar-benar authentic! Rasa seperti masakan nenek di kampung. Pelayanan ramah dan tempat bersih."
          }
        ]
      },
      {
        "@type": "LocalBusiness",
        "@id": "https://gadangbarubahindonesia.id/#localbusiness",
        "name": "Gadang Barubah Restaurant",
        "description": "Restoran Padang di Sumatera Barat",
        "url": "https://gadangbarubahindonesia.id",
        "telephone": "+62812-3456-7890",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Jl. Veteran No. 123",
          "addressLocality": "Padang",
          "addressRegion": "Sumatera Barat",
          "postalCode": "25111", 
          "addressCountry": "ID"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": -0.9492,
          "longitude": 100.3543
        },
        "openingHoursSpecification": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            "opens": "10:00",
            "closes": "22:00"
          }
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://gadangbarubahindonesia.id/#website", 
        "url": "https://gadangbarubahindonesia.id",
        "name": "Gadang Barubah Restaurant",
        "description": "Website resmi Restoran Gadang Barubah - Restoran Padang di Sumatera Barat",
        "inLanguage": "id-ID",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://gadangbarubahindonesia.id/search?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}