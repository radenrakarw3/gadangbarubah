interface SEOConfig {
  title: string;
  description: string;
  keywords?: string;
  path: string;
  ogType?: string;
  noIndex?: boolean;
}

export const createSEOConfig = (config: SEOConfig) => {
  const baseUrl = "https://gadangbarubahindonesia.id";
  const siteName = "Gadang Barubah Restaurant";
  
  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords || "gadang barubah, rumah makan padang, nasi padang unggulan, restoran padang, gadangbarubahindonesia",
    canonical: `${baseUrl}${config.path}`,
    ogTitle: config.title,
    ogDescription: config.description,
    ogUrl: `${baseUrl}${config.path}`,
    ogType: config.ogType || "website",
    ogSiteName: siteName,
    twitterTitle: config.title,
    twitterDescription: config.description,
    noIndex: config.noIndex || false,
  };
};

export const pageSEOConfigs = {
  home: createSEOConfig({
    title: "Gadang Barubah - Rumah Makan Padang Indonesia",
    description: "Gadang Barubah - Rumah makan Padang dengan cabang di berbagai kota. Nikmati nasi padang autentik, rendang, gulai khas Minang dengan cita rasa tradisional yang istimewa. Reservasi: 089509766739",
    keywords: "gadang barubah, gadangbarubah, gadangbarubahindonesia.id, gadangbarubahindonesia, rumah makan padang, nasi padang enak, restoran padang unggulan, gadang barubah indonesia, alternatif payakumbuah, pengganti pagi sore, lebih baik dari bumus, selain padang merdeka, rumah makan padang, rendang enak, gulai padang, masakan minang autentik",
    path: "/",
    ogType: "restaurant"
  }),
  
  services: createSEOConfig({
    title: "Layanan Unggulan Gadang Barubah - Outlet, Delivery, Catering & Reservasi",
    description: "Jelajahi layanan lengkap Gadang Barubah: lokasi outlet, delivery nasi padang, catering event, dan reservasi meja VIP. Pengalaman kuliner Minang di seluruh Indonesia.",
    keywords: "layanan gadang barubah, delivery nasi padang, catering padang, reservasi meja padang, outlet padang unggulan, gadang barubah services, layanan restoran padang, alternatif delivery padang",
    path: "/uni"
  }),
  
  outlet: createSEOConfig({
    title: "Lokasi Outlet Gadang Barubah - Restoran Padang",
    description: "Kunjungi outlet unggulan Gadang Barubah di berbagai lokasi. Nikmati suasana mewah, VIP room eksklusif, dan pengalaman kuliner Padang autentik yang tak terlupakan.",
    keywords: "outlet gadang barubah, restoran padang, outlet padang, lokasi gadang barubah, vip room padang, rumah makan mewah, tempat makan padang, alternatif restoran padang",
    path: "/services/outlet"
  }),
  
  delivery: createSEOConfig({
    title: "Delivery Gadang Barubah - Nasi Padang Antar ke Rumah",
    description: "Pesan nasi padang, rendang, dan gulai Gadang Barubah dengan layanan delivery. Cita rasa autentik Minang diantar langsung ke rumah Anda.",
    keywords: "delivery gadang barubah, pesan nasi padang online, antar makanan padang, delivery rendang, pesan gulai online, layanan antar makanan padang",
    path: "/services/delivery"
  }),
  
  partnership: createSEOConfig({
    title: "Kemitraan Bisnis Gadang Barubah - Peluang Franchise Restoran Padang",
    description: "Bergabunglah dengan program kemitraan Gadang Barubah. Peluang bisnis franchise rumah makan Padang dengan sistem yang telah terbukti dan dukungan penuh.",
    keywords: "franchise gadang barubah, kemitraan restoran padang, bisnis rumah makan padang, franchise makanan, peluang usaha kuliner, kemitraan bisnis gadang barubah",
    path: "/services/partnership"
  }),

  kemitraan: createSEOConfig({
    title: "Kemitraan Gadang Barubah - Catering Event, Tenant & Corporate B2B",
    description: "Hub kemitraan operasional Gadang Barubah: catering acara, tenant event, sewa venue, dan layanan corporate. Buffet, mealbox, stall, dan private dining untuk mitra B2B Anda.",
    keywords: "kemitraan gadang barubah, catering event padang, tenant stall kuliner, kemitraan catering corporate, sewa venue padang, kemitraan b2b restoran",
    path: "/kemitraan",
  }),
  
  catering: createSEOConfig({
    title: "Catering Event Gadang Barubah - Layanan Katering Padang",
    description: "Layanan catering Gadang Barubah untuk acara pernikahan, corporate event, dan gathering. Menu Padang autentik untuk acara istimewa Anda.",
    keywords: "catering gadang barubah, katering padang, catering pernikahan padang, catering event makanan padang, layanan katering, menu catering padang",
    path: "/catering",
  }),

  notFound: createSEOConfig({
    title: "Halaman Tidak Ditemukan - Gadang Barubah",
    description: "Halaman yang Anda cari tidak ditemukan. Kembali ke beranda untuk menjelajahi layanan dan hidangan Gadang Barubah.",
    keywords: "404, halaman tidak ditemukan, gadang barubah",
    path: "/404",
    noIndex: true
  }),

  about: createSEOConfig({
    title: "Tentang Kami - Gadang Barubah",
    description: "Kenali cerita Gadang Barubah, rumah makan Padang berkelas yang mengangkat warisan kuliner Minang. Outlet di Pollux Mall Cikarang dan Bintaro.",
    keywords: "about gadang barubah, tentang gadang barubah, rumah makan padang berkelas, outlet padang cikarang, outlet padang bintaro",
    path: "/about",
  }),

  menu: createSEOConfig({
    title: "Menu Gadang Barubah - Signature Nasi Padang & Masakan Minang",
    description: "Lihat menu signature Gadang Barubah: rendang, ayam pop, gulai, nasi tumpeng, dan menu digital lengkap dengan harga terbaru.",
    keywords: "menu gadang barubah, menu nasi padang, rendang, ayam pop, menu digital padang",
    path: "/menu",
  }),

  whatsOn: createSEOConfig({
    title: "What's On - Berita & Artikel Gadang Barubah",
    description: "Update terbaru, tips kuliner, dan artikel seputar Gadang Barubah Indonesia — catering, reservasi, dan outlet.",
    keywords: "berita gadang barubah, artikel padang, what's on gadang barubah",
    path: "/whats-on",
  }),

  faq: createSEOConfig({
    title: "FAQ - Pertanyaan Umum Gadang Barubah",
    description: "Jawaban pertanyaan umum seputar jam operasional, delivery, reservasi meja, dan catering Gadang Barubah.",
    keywords: "faq gadang barubah, reservasi meja, jam buka gadang barubah",
    path: "/faq",
  }),

  reservation: createSEOConfig({
    title: "Reservasi Meja - Gadang Barubah Cikarang & Bintaro",
    description: "Pesan meja reguler atau VIP room di Gadang Barubah. Isi form reservasi online dan tim kami konfirmasi via WhatsApp.",
    keywords: "reservasi gadang barubah, booking meja padang, vip room cikarang, reservasi restoran, reservasi bintaro",
    path: "/reservasi",
  }),

  terms: createSEOConfig({
    title: "Terms and Conditions - Gadang Barubah Indonesia",
    description: "Syarat dan ketentuan penggunaan website dan layanan reservasi Gadang Barubah Indonesia.",
    path: "/terms",
    noIndex: true,
  }),

  privacy: createSEOConfig({
    title: "Privacy Policy - Gadang Barubah Indonesia",
    description: "Kebijakan privasi Gadang Barubah Indonesia terkait data reservasi dan penggunaan website.",
    path: "/privacy",
    noIndex: true,
  }),
};

export function getSEOConfigByPath(path: string) {
  // Normalize path: remove trailing slash, convert to lowercase
  const normalizedPath = path.toLowerCase().replace(/\/$/, '') || '/';
  
  // Route mapping logic
  if (normalizedPath === '/') return pageSEOConfigs.home;
  if (normalizedPath === '/about') return pageSEOConfigs.about;
  if (normalizedPath === '/menu') return pageSEOConfigs.menu;
  if (normalizedPath === '/whats-on' || normalizedPath.startsWith('/whats-on/')) return pageSEOConfigs.whatsOn;
  if (normalizedPath === '/faq') return pageSEOConfigs.faq;
  if (normalizedPath === '/terms') return pageSEOConfigs.terms;
  if (normalizedPath === '/privacy') return pageSEOConfigs.privacy;
  if (normalizedPath === '/catering') return pageSEOConfigs.catering;
  if (normalizedPath === '/kemitraan') return pageSEOConfigs.kemitraan;
  if (normalizedPath === '/reservasi') return pageSEOConfigs.reservation;
  if (normalizedPath === '/uni') return pageSEOConfigs.services;
  if (normalizedPath === '/services/outlet') return pageSEOConfigs.outlet;
  if (normalizedPath === '/services/delivery') return pageSEOConfigs.delivery;
  if (normalizedPath === '/services/partnership') return pageSEOConfigs.partnership;
  if (normalizedPath === '/services/catering') return pageSEOConfigs.catering;
  
  // Default fallback
  return pageSEOConfigs.notFound;
}

export function generateSEOTags(seoConfig: ReturnType<typeof createSEOConfig>) {
  // Set robots meta based on SEO config noIndex flag
  const robotsContent = seoConfig.noIndex
    ? 'noindex, nofollow' 
    : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
    
  return {
    title: `<title>${seoConfig.title}</title>`,
    meta: `
      <meta name="description" content="${seoConfig.description}" />
      <meta name="keywords" content="${seoConfig.keywords}" />
      <meta name="author" content="Gadang Barubah Restaurant" />
      <meta name="robots" content="${robotsContent}" />
      <meta name="google-site-verification" content="Hj02LNi5KT_Oe-sk6tap41PMAU-bGPe77yPcdNs0pBc" />
      
      <!-- Open Graph Meta Tags -->
      <meta property="og:title" content="${seoConfig.ogTitle}" />
      <meta property="og:description" content="${seoConfig.ogDescription}" />
      <meta property="og:url" content="${seoConfig.ogUrl}" />
      <meta property="og:type" content="${seoConfig.ogType}" />
      <meta property="og:site_name" content="${seoConfig.ogSiteName}" />
      <meta name="application-name" content="Gadang Barubah Indonesia" />
      <meta name="publisher" content="gadangbarubahindonesia.id" />
      <meta property="og:image" content="https://gadangbarubahindonesia.id/og-image.jpg" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="id_ID" />
      
      <!-- Twitter Card Meta Tags -->
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="${seoConfig.twitterTitle}" />
      <meta name="twitter:description" content="${seoConfig.twitterDescription}" />
      <meta name="twitter:image" content="https://gadangbarubahindonesia.id/og-image.jpg" />
    `,
    link: `
      <link rel="canonical" href="${seoConfig.canonical}" />
      <link rel="preconnect" href="https://www.googletagmanager.com">
      <link rel="preconnect" href="https://www.google-analytics.com">
      <link rel="dns-prefetch" href="https://www.googletagmanager.com">
      <link rel="dns-prefetch" href="https://www.google-analytics.com">
    `,
    script: `
      <!-- Google Analytics 4 with Consent Mode v2 -->
      <script async src="https://www.googletagmanager.com/gtag/js?id=G-KJJXWLV11T"></script>
      <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        
        // Consent Mode v2 defaults - GDPR compliant (deny analytics until consent)
        gtag('consent', 'default', {
          'ad_storage': 'denied',
          'ad_user_data': 'denied', 
          'ad_personalization': 'denied',
          'analytics_storage': 'denied',
          'functionality_storage': 'granted',
          'personalization_storage': 'denied',
          'security_storage': 'granted'
        });
        
        // Configure GA4 with performance optimizations for restaurant SEO
        gtag('config', 'G-KJJXWLV11T', {
          'send_page_view': false,
          'transport_type': 'beacon',
          'allow_google_signals': false,
          'cookie_flags': 'SameSite=Strict;Secure'
        });
      </script>
    `
  };
}