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
    keywords: config.keywords || "gadang barubah, rumah makan padang terbaik, nasi padang unggulan, restoran padang, gadangbarubahindonesia",
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
    title: "Gadang Barubah - Rumah Makan Padang Terbaik Indonesia",
    description: "Gadang Barubah - Rumah makan Padang terbaik dengan cabang di berbagai kota. Nikmati nasi padang autentik, rendang terbaik, gulai khas Minang dengan cita rasa tradisional yang istimewa. Reservasi: 089509766739",
    keywords: "gadang barubah, gadangbarubah, gadangbarubahindonesia.id, gadangbarubahindonesia, rumah makan padang terbaik, nasi padang enak, restoran padang unggulan, gadang barubah indonesia, alternatif payakumbuah, pengganti pagi sore, lebih baik dari bumus, selain padang merdeka, rumah makan padang terbaik, rendang enak, gulai padang terbaik, masakan minang autentik",
    path: "/",
    ogType: "restaurant"
  }),
  
  services: createSEOConfig({
    title: "Layanan Unggulan Gadang Barubah - Outlet, Delivery, Catering & VIP Membership",
    description: "Jelajahi layanan lengkap Gadang Barubah: lokasi outlet terbaik, delivery nasi padang, catering event, dan VIP membership. Pengalaman kuliner Minang terbaik di seluruh Indonesia.",
    keywords: "layanan gadang barubah, delivery nasi padang, catering padang, vip membership padang, outlet padang unggulan, gadang barubah services, layanan restoran padang terbaik, alternatif delivery padang",
    path: "/uni"
  }),
  
  outlet: createSEOConfig({
    title: "Lokasi Outlet Gadang Barubah - Restoran Padang Terbaik",
    description: "Kunjungi outlet unggulan Gadang Barubah di berbagai lokasi. Nikmati suasana mewah, VIP room eksklusif, dan pengalaman kuliner Padang autentik yang tak terlupakan.",
    keywords: "outlet gadang barubah, restoran padang terbaik, outlet padang, lokasi gadang barubah, vip room padang, rumah makan mewah, tempat makan padang terbaik, alternatif restoran padang",
    path: "/services/outlet"
  }),
  
  delivery: createSEOConfig({
    title: "Delivery Terbaik Gadang Barubah - Nasi Padang Antar ke Rumah",
    description: "Pesan nasi padang, rendang, dan gulai terbaik Gadang Barubah dengan layanan delivery. Cita rasa autentik Minang diantar langsung ke rumah Anda.",
    keywords: "delivery gadang barubah, pesan nasi padang online, antar makanan padang, delivery rendang, pesan gulai online, layanan antar makanan padang terbaik",
    path: "/services/delivery"
  }),
  
  partnership: createSEOConfig({
    title: "Kemitraan Bisnis Gadang Barubah - Peluang Franchise Restoran Padang",
    description: "Bergabunglah dengan program kemitraan Gadang Barubah. Peluang bisnis franchise rumah makan Padang terbaik dengan sistem yang telah terbukti dan dukungan penuh.",
    keywords: "franchise gadang barubah, kemitraan restoran padang, bisnis rumah makan padang, franchise makanan, peluang usaha kuliner, kemitraan bisnis gadang barubah",
    path: "/services/partnership"
  }),
  
  catering: createSEOConfig({
    title: "Catering Event Gadang Barubah - Layanan Katering Padang Terbaik",
    description: "Layanan catering Gadang Barubah untuk acara pernikahan, corporate event, dan gathering. Menu Padang autentik untuk acara istimewa Anda.",
    keywords: "catering gadang barubah, katering padang, catering pernikahan padang, catering event makanan padang, layanan katering terbaik, menu catering padang",
    path: "/services/catering"
  }),
  
  memberLogin: createSEOConfig({
    title: "Login Member VIP Gadang Barubah - Akses Eksklusif Istimewa",
    description: "Login ke akun VIP member Gadang Barubah untuk menikmati benefit eksklusif, diskon khusus, dan layanan prioritas untuk pengalaman kuliner yang istimewa.",
    keywords: "login member gadang barubah, vip member, akun istimewa gadang barubah, member eksklusif, login vip restoran padang",
    path: "/member/login",
    noIndex: true
  }),
  
  memberRegister: createSEOConfig({
    title: "Daftar VIP Member Gadang Barubah - Bergabung Program Eksklusif",
    description: "Daftar sebagai VIP member Gadang Barubah dan nikmati benefit eksklusif seperti diskon khusus, reservasi prioritas, dan menu spesial untuk member.",
    keywords: "daftar member gadang barubah, registrasi vip member, membership gadang barubah, daftar member eksklusif, program vip restoran padang",
    path: "/member/register",
    noIndex: true
  }),
  
  comingSoon: createSEOConfig({
    title: "Coming Soon - Fitur Baru Gadang Barubah",
    description: "Fitur baru Gadang Barubah segera hadir! Pantai terus update terbaru dari rumah makan Padang favorit Anda.",
    keywords: "coming soon gadang barubah, fitur baru, update gadang barubah, segera hadir",
    path: "/member/dashboard"
  }),
  
  notFound: createSEOConfig({
    title: "Halaman Tidak Ditemukan - Gadang Barubah",
    description: "Halaman yang Anda cari tidak ditemukan. Kembali ke beranda untuk menjelajahi layanan dan hidangan terbaik Gadang Barubah.",
    keywords: "404, halaman tidak ditemukan, gadang barubah",
    path: "/404",
    noIndex: true
  })
};

export function getSEOConfigByPath(path: string) {
  // Normalize path: remove trailing slash, convert to lowercase
  const normalizedPath = path.toLowerCase().replace(/\/$/, '') || '/';
  
  // Route mapping logic
  if (normalizedPath === '/') return pageSEOConfigs.home;
  if (normalizedPath === '/uni') return pageSEOConfigs.services;
  if (normalizedPath === '/services/outlet') return pageSEOConfigs.outlet;
  if (normalizedPath === '/services/delivery') return pageSEOConfigs.delivery;
  if (normalizedPath === '/services/partnership') return pageSEOConfigs.partnership;
  if (normalizedPath === '/services/catering') return pageSEOConfigs.catering;
  if (normalizedPath === '/member/login' || normalizedPath === '/services/membership') return pageSEOConfigs.memberLogin;
  if (normalizedPath === '/member/register') return pageSEOConfigs.memberRegister;
  if (normalizedPath === '/member/dashboard') return pageSEOConfigs.comingSoon;
  
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