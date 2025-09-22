interface SEOConfig {
  title: string;
  description: string;
  keywords?: string;
  path: string;
  ogType?: string;
}

export const createSEOConfig = (config: SEOConfig) => {
  const baseUrl = "https://gadangbarubahindonesia.id";
  const siteName = "Gadang Barubah Restaurant";
  
  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords || "gadang barubah, rumah makan padang terbaik, nasi padang premium cikarang, restoran padang pollux mall, gadangbarubahindonesia",
    canonical: `${baseUrl}${config.path}`,
    ogTitle: config.title,
    ogDescription: config.description,
    ogUrl: `${baseUrl}${config.path}`,
    ogType: config.ogType || "website",
    ogSiteName: siteName,
    twitterTitle: config.title,
    twitterDescription: config.description,
  };
};

export const pageSEOConfigs = {
  home: createSEOConfig({
    title: "Gadang Barubah - Rumah Makan Padang Premium Indonesia",
    description: "Gadang Barubah - Rumah makan Padang premium dengan cabang di berbagai kota. Nikmati nasi padang autentik, rendang terbaik, gulai khas Minang dengan cita rasa tradisional yang istimewa. Reservasi: 089509766739",
    keywords: "gadang barubah, gadangbarubah, gadangbarubahindonesia.id, gadangbarubahindonesia, rumah makan padang terbaik, nasi padang enak, restoran padang premium, gadang barubah indonesia, alternatif payakumbuah, pengganti pagi sore, lebih baik dari bumus, selain padang merdeka, rumah makan padang premium, rendang enak, gulai padang terbaik, masakan minang autentik",
    path: "/",
    ogType: "restaurant"
  }),
  
  services: createSEOConfig({
    title: "Layanan Premium Gadang Barubah - Outlet, Delivery, Catering & VIP Membership",
    description: "Jelajahi layanan lengkap Gadang Barubah: lokasi outlet premium, delivery nasi padang, catering event, dan VIP membership. Pengalaman kuliner Minang premium di seluruh Indonesia.",
    keywords: "layanan gadang barubah, delivery nasi padang, catering padang, vip membership padang, outlet padang premium, gadang barubah services, layanan restoran padang terbaik, alternatif delivery padang",
    path: "/uni"
  }),
  
  outlet: createSEOConfig({
    title: "Lokasi Outlet Gadang Barubah - Restoran Padang Premium",
    description: "Kunjungi outlet premium Gadang Barubah di berbagai lokasi. Nikmati suasana mewah, VIP room eksklusif, dan pengalaman kuliner Padang autentik yang tak terlupakan.",
    keywords: "outlet gadang barubah, restoran padang premium, outlet padang, lokasi gadang barubah, vip room padang, rumah makan mewah, tempat makan padang terbaik, alternatif restoran padang",
    path: "/services/outlet"
  }),
  
  delivery: createSEOConfig({
    title: "Delivery Nasi Padang Premium Gadang Barubah - Antar ke Rumah",
    description: "Pesan delivery nasi padang premium Gadang Barubah langsung ke rumah. Rendang, gulai, dan lauk Minang autentik dengan kualitas restoran. Order mudah via WhatsApp: 089509766739",
    keywords: "delivery nasi padang, pesan gadang barubah online, antar nasi padang, delivery rendang, gofood gadang barubah, grabfood nasi padang, delivery makanan padang, order nasi padang, alternatif delivery padang",
    path: "/services/delivery"
  }),
  
  partnership: createSEOConfig({
    title: "Kemitraan Bisnis Gadang Barubah - Bergabung dengan Kuliner Premium Minang",
    description: "Bergabunglah dengan program kemitraan Gadang Barubah. Dapatkan keuntungan berkelanjutan dalam ekosistem kuliner premium Minangkabau di Cikarang.",
    keywords: "kemitraan gadang barubah, franchise padang, bisnis kuliner minang, investasi restoran",
    path: "/services/partnership"
  }),
  
  catering: createSEOConfig({
    title: "Catering Event Gadang Barubah - Layanan Katering Padang Premium",
    description: "Wujudkan acara istimewa dengan catering premium Gadang Barubah. Hidangan Padang autentik untuk pernikahan, corporate event, dan gathering keluarga dengan cita rasa tradisional yang autentik.",
    keywords: "catering padang, catering event, katering nasi padang terbaik, catering pernikahan minang, catering gadang barubah, jasa katering padang premium, catering rendang gulai, katering makanan padang enak",
    path: "/services/catering"
  }),
  
  memberLogin: createSEOConfig({
    title: "Login Member VIP Gadang Barubah - Akses Eksklusif & Benefits Istimewa",
    description: "Login ke akun VIP Member Gadang Barubah untuk menikmati benefit eksklusif, reservasi prioritas, dan pengalaman kuliner yang dipersonalisasi.",
    keywords: "login member gadang barubah, vip member, akun premium restoran padang",
    path: "/member/login"
  }),
  
  memberRegister: createSEOConfig({
    title: "Daftar VIP Member Gadang Barubah - Raih Benefits Eksklusif Kuliner Premium",
    description: "Daftar menjadi VIP Member Gadang Barubah dan nikmati benefit eksklusif, diskon spesial, reservasi prioritas, dan pengalaman kuliner yang dipersonalisasi.",
    keywords: "daftar member gadang barubah, vip membership, member premium restoran padang",
    path: "/member/register"
  }),
  
  membership: createSEOConfig({
    title: "VIP Membership Gadang Barubah - Program Eksklusif #1 untuk Pecinta Kuliner Padang",
    description: "Bergabunglah dengan VIP Membership Gadang Barubah - program member terbaik untuk pecinta kuliner Padang. Nikmati benefit eksklusif, reservasi prioritas, diskon spesial, dan pengalaman kuliner premium yang tak tertandingi.",
    keywords: "vip membership gadang barubah, member premium padang, benefit eksklusif restoran padang, program member vip terbaik, membership kuliner padang premium, diskon nasi padang member",
    path: "/services/membership"
  }),
  
  comingSoon: createSEOConfig({
    title: "Dashboard Member VIP - Gadang Barubah (Segera Hadir)",
    description: "Dashboard Member VIP Gadang Barubah akan segera hadir dengan fitur lengkap untuk mengelola akun, melihat riwayat pesanan, dan benefit eksklusif.",
    keywords: "dashboard member gadang barubah, akun vip, member area",
    path: "/member/dashboard"
  }),
  
  notFound: createSEOConfig({
    title: "Halaman Tidak Ditemukan - Gadang Barubah",
    description: "Halaman yang Anda cari tidak ditemukan. Kembali ke beranda untuk menjelajahi layanan dan hidangan premium Gadang Barubah.",
    keywords: "404, halaman tidak ditemukan, gadang barubah",
    path: "/404"
  })
};