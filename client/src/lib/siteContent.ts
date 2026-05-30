export const COMPANY = {
  name: "PT. Gadang Barubah Indonesia",
  address:
    "Jl. Menteng Raya No.28 Blok FG, Jurang Mangu Barat, Kec. Pd. Aren, Kota Tangerang Selatan, Banten 15412",
  whatsapp: "6289509766739",
  phoneDisplay: "089509766739",
};

export const SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/gadangbarubahindonesia",
  tiktok: "https://www.tiktok.com/@gadangbarubahindonesia",
  linkedin: "https://www.linkedin.com/company/gadang-barubah-indonesia",
};

export const OUTLETS = [
  { id: "pollux-cikarang", label: "Pollux Mall Cikarang" },
] as const;

export const RESERVATION_TIME_SLOTS = [
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
] as const;

/** Tanggal lokal (WIB) format YYYY-MM-DD untuk input type="date" */
export function todayISO() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export const CATERING_CATEGORIES = [
  {
    id: "saji-gadang",
    name: "Saji Gadang",
    description: "Nasi box & paket praktis untuk meeting dan acara kecil.",
  },
  {
    id: "snack-box",
    name: "Snack Box",
    description: "Camilan dan kudapan Minang dalam kemasan elegan.",
  },
  {
    id: "buffet",
    name: "Buffet",
    description: "Prasmanan Padang lengkap untuk wedding & corporate event.",
  },
  {
    id: "stall",
    name: "Stall",
    description: "Gerai live cooking di lokasi acara Anda.",
  },
  {
    id: "tumpeng",
    name: "Nasi Tumpeng",
    description: "Tumpeng megah 10–15 porsi untuk perayaan spesial.",
  },
] as const;

export const CATERING_TYPES = [
  { value: "saji-gadang", label: "Saji Gadang / Nasi Box" },
  { value: "snack-box", label: "Snack Box" },
  { value: "buffet", label: "Buffet" },
  { value: "stall", label: "Stall" },
  { value: "tumpeng", label: "Nasi Tumpeng" },
] as const;

export const FOOTER_NAV_LEFT = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/whats-on", label: "What's On" },
  { href: "/menu", label: "Menu" },
  { href: "/catering", label: "Catering" },
] as const;

export const FOOTER_NAV_RIGHT = [
  { href: "/reservasi", label: "Reservasi" },
  { href: "/faq", label: "FAQ's" },
] as const;

export const MAIN_NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/whats-on", label: "What's On" },
  { href: "/menu", label: "Menu" },
  { href: "/catering", label: "Catering" },
  { href: "/reservasi", label: "Reservasi" },
] as const;

export const SECONDARY_NAV = [
  { href: "/reservasi", label: "Reservasi Meja" },
  { href: "/faq", label: "FAQ's" },
] as const;

export const LEGAL_NAV = [
  { href: "/terms", label: "Terms and Conditions" },
  { href: "/privacy", label: "Privacy Policy" },
] as const;

export const FAQ_ITEMS = [
  {
    question: "Jam operasional Gadang Barubah?",
    answer:
      "Outlet kami buka setiap hari pukul 10:00–22:00 WIB. Reservasi VIP room disarankan minimal H-1.",
  },
  {
    question: "Bagaimana cara reservasi meja?",
    answer:
      'Buka halaman Reservasi, isi formulir (nama, WhatsApp, tanggal, waktu, jumlah tamu), lalu tim kami akan menghubungi Anda via WhatsApp untuk konfirmasi.',
  },
  {
    question: "Apakah tersedia layanan delivery?",
    answer:
      "Ya. Anda bisa memesan via WhatsApp atau platform delivery partner kami (GoFood, GrabFood, ShopeeFood).",
  },
  {
    question: "Apakah menerima pesanan catering untuk acara?",
    answer:
      "Ya, kami melayani catering pernikahan, corporate event, arisan, dan gathering. Lihat halaman Catering untuk paket.",
  },
  {
    question: "Di mana lokasi outlet?",
    answer:
      "Outlet unggulan kami berada di Pollux Mall Cikarang, GF. Alamat kantor perusahaan tercantum di footer website.",
  },
  {
    question: "Apakah ada VIP room?",
    answer:
      "Ya, VIP Private Room tersedia untuk gathering keluarga dan acara kecil. Pilih tipe VIP saat mengisi form reservasi.",
  },
] as const;

export const ARTICLES = [
  {
    id: "1",
    title: "Rendang Gadang Barubah: Warisan Rasa Minang",
    excerpt:
      "Mengenal proses dan cita rasa rendang autentik yang menjadi signature menu kami, dimasak dengan rempah pilihan dan resep turun-temurun.",
    date: "15 Januari 2026",
    category: "Kuliner",
  },
  {
    id: "2",
    title: "Tips Memilih Paket Catering untuk Acara Kantor",
    excerpt:
      "Panduan praktis memilih menu nasi box atau buffet Padang yang pas untuk meeting, gathering, dan event perusahaan.",
    date: "8 Januari 2026",
    category: "Catering",
  },
  {
    id: "3",
    title: "Cara Reservasi Meja & VIP Room di Gadang Barubah",
    excerpt:
      "Langkah mudah memesan meja reguler atau VIP room melalui form reservasi online kami.",
    date: "2 Januari 2026",
    category: "Reservasi",
  },
  {
    id: "4",
    title: "Suasana VIP Room di Pollux Mall Cikarang",
    excerpt:
      "Nikmati pengalaman bersantap lebih privat di VIP room outlet kami — cocok untuk keluarga, reuni, dan acara kecil.",
    date: "20 Desember 2025",
    category: "Outlet",
  },
] as const;

export const SIGNATURE_MENU = [
  {
    name: "Rendang Daging",
    description: "Daging empuk dengan bumbu rempah khas Minang, dimasak hingga meresap sempurna.",
    tag: "Best Seller",
    price: "Rp 45.000",
  },
  {
    name: "Ayam Pop",
    description: "Ayam kampung lembut dengan kuah kaldu bening khas Padang.",
    tag: "Signature",
    price: "Rp 38.000",
  },
  {
    name: "Gulai Kambing",
    description: "Gulai kambing beraroma rempah, cocok untuk pecinta cita rasa kuat.",
    tag: "Favorit",
    price: "Rp 52.000",
  },
  {
    name: "Dendeng Balado",
    description: "Dendeng renyah dengan sambal balado pedas gurih.",
    tag: "Signature",
    price: "Rp 42.000",
  },
  {
    name: "Nasi Tumpeng",
    description: "Paket lengkap 10–15 porsi untuk acara spesial keluarga dan kantor.",
    tag: "Catering",
    price: "Rp 1.500.000",
  },
  {
    name: "Saji Gadang Menu",
    description: "Nasi box praktis dengan pilihan lauk ayam, rendang, gulai, dan dendeng.",
    tag: "Takeaway",
    price: "Rp 40.000",
  },
] as const;

export const VALUE_HIGHLIGHTS = [
  {
    title: "Rasa Autentik Minang",
    description: "Resep turun-temurun dengan standar kualitas konsisten di setiap sajian.",
  },
  {
    title: "Bahan Segar Harian",
    description: "Bahan dipilih setiap hari untuk menjaga cita rasa nasi padang terbaik.",
  },
  {
    title: "Pelayanan Ramah",
    description: "Tim kami siap memberikan pengalaman bersantap yang hangat dan profesional.",
  },
  {
    title: "Reservasi Mudah",
    description: "Pesan meja reguler atau VIP room online — tim kami konfirmasi via WhatsApp.",
  },
] as const;
