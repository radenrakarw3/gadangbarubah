export const COMPANY = {
  name: "PT. Gadang Barubah Indonesia",
  address:
    "Jl. Menteng Raya No.28 Blok FG, Jurang Mangu Barat, Kec. Pd. Aren, Kota Tangerang Selatan, Banten 15412",
  whatsapp: "6289509766739",
  phoneDisplay: "089509766739",
  /** Nomor WA khusus inquiry & reservasi catering (homepage + halaman catering) */
  cateringWhatsapp: "6289601039424",
  cateringPhoneDisplay: "0896-0103-9424",
};

export const SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/gadangbarubah",
  tiktok: "https://www.tiktok.com/@gadangbarubah",
} as const;

export const OUTLETS = [
  { id: "pollux-cikarang", label: "Pollux Mall Cikarang" },
  { id: "bintaro", label: "Bintaro (Jurang Mangu Barat)" },
] as const;

/** Empat panel outlet homepage — Figma Frame 6 */
export const HOME_OUTLET_PANELS = [
  {
    id: "cikarang",
    nameID: "Cikarang",
    nameEN: "Cikarang",
    addressID: "Main Gate, Pollux Mall Cikarang",
    addressEN: "Main Gate, Pollux Mall Cikarang",
    tone: "gray" as const,
    status: "open" as const,
    href: "https://maps.app.goo.gl/jP1JMKQZBU9AXSLz5",
    detailNavID: "Tentang Gadang Barubah Cikarang",
    detailNavEN: "About Gadang Barubah Cikarang",
    hours: "11.00 - 22.00",
    capacityID: ["24 Meja", "120 Kursi"],
    capacityEN: ["24 Table", "120 Seat"],
    facilitiesID: ["Regular Dining Area", "VIP Room", "Buffet Area"],
    facilitiesEN: ["Regular Dining Area", "VIP Room", "Buffet Area"],
  },
  {
    id: "bintaro",
    nameID: "Bintaro",
    nameEN: "Bintaro",
    addressID: "Jl. Menteng Raya, no.28 (Sektor 7)",
    addressEN: "Jl. Menteng Raya, no.28 (Sector 7)",
    tone: "gray" as const,
    status: "open" as const,
    href: "https://maps.google.com/?q=Jl.+Menteng+Raya+No.28+Blok+FG+Jurang+Mangu+Barat",
    detailNavID: "Tentang Gadang Barubah Bintaro",
    detailNavEN: "About Gadang Barubah Bintaro",
    hours: "11.00 - 22.00",
    capacityID: ["20 Meja", "100 Kursi"],
    capacityEN: ["20 Table", "100 Seat"],
    facilitiesID: ["Cafe Area (Smoking)", "3 VIP Room", "Regular Dining Area"],
    facilitiesEN: ["Cafe Area (Smoking)", "3 VIP Room", "Regular Dining Area"],
  },
  {
    id: "puri-indah",
    nameID: "Puri Indah (Segera Hadir)",
    nameEN: "Puri Indah (Coming Soon)",
    addressID: "Jakarta Barat",
    addressEN: "West Jakarta",
    tone: "salmon" as const,
    status: "coming-soon" as const,
  },
  {
    id: "fourth-outlet",
    nameID: "Outlet Ke-4 Kami",
    nameEN: "Our 4th Outlet",
    addressID: "Segera Diumumkan",
    addressEN: "Announce Soon",
    tone: "salmon" as const,
    status: "coming-soon" as const,
  },
] as const;

export {
  RESERVATION_TIME_SLOTS,
  todayISOInWIB as todayISO,
} from "@shared/reservation-utils";

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
  { value: "rental-room", label: "Rental Room / Sewa Ruang" },
  { value: "home-delivery", label: "Home Delivery Service" },
  { value: "tumpeng", label: "Nasi Tumpeng" },
] as const;

/** Kolase layanan homepage — Figma Frame 7 (grid 3×2) */
export const HOME_CATERING_SERVICES = [
  {
    id: "mealbox",
    cateringType: "saji-gadang" as const,
    nameID: "Mealbox (Saji Gadang)",
    nameEN: "Mealbox (Saji Gadang)",
    descriptionID:
      "Nasi box premium dengan lauk pilihan masakan Padang — praktis untuk meeting, seminar, dan acara kantor. Menu dapat disesuaikan jumlah porsi dan komposisi lauk.",
    descriptionEN:
      "Premium rice boxes with selected Padang dishes — ideal for meetings, seminars, and office events. Menu and portion counts can be tailored to your needs.",
    tone: "#C75757",
    row: "top" as const,
  },
  {
    id: "buffet",
    cateringType: "buffet" as const,
    nameID: "Buffet",
    nameEN: "Buffet",
    descriptionID:
      "Prasmanan Padang lengkap dengan setup di venue Anda — cocok untuk pernikahan, corporate event, dan perayaan besar. Tim kami menangani persiapan, saji, hingga peralatan makan.",
    descriptionEN:
      "Full Padang buffet with on-site setup — perfect for weddings, corporate events, and large celebrations. Our team handles preparation, service, and dining equipment.",
    tone: "#402C2C",
    row: "top" as const,
  },
  {
    id: "snackbox",
    cateringType: "snack-box" as const,
    nameID: "Snackbox",
    nameEN: "Snackbox",
    descriptionID:
      "Camilan khas Minang dalam kemasan elegan untuk hospitality, goodie bag acara, atau suguhan tamu. Pilihan kudapan fresh dengan presentasi rapi.",
    descriptionEN:
      "Minang-style snacks in elegant packaging for hospitality, event goodie bags, or guest treats. Fresh selections with neat presentation.",
    tone: "#3D0C0C",
    row: "top" as const,
  },
  {
    id: "rental-room",
    cateringType: "rental-room" as const,
    nameID: "Rental Room",
    nameEN: "Rental Room",
    descriptionID:
      "Sewa ruang VIP di outlet Gadang Barubah untuk private dining, arisan, gathering keluarga, atau acara intim. Ruangan ber-AC dengan kapasitas fleksibel dan layanan penuh.",
    descriptionEN:
      "VIP room rental at Gadang Barubah outlets for private dining, gatherings, and intimate events. Air-conditioned space with flexible capacity and full service.",
    tone: "#402C2C",
    row: "bottom" as const,
  },
  {
    id: "stall",
    cateringType: "stall" as const,
    nameID: "Stall",
    nameEN: "Stall",
    descriptionID:
      "Gerai live cooking di lokasi acara Anda — hadirkan pengalaman masakan Padang langsung di depan tamu. Cocok untuk festival, bazaar, dan event outdoor.",
    descriptionEN:
      "Live cooking stall at your event venue — bring the Padang cooking experience directly to your guests. Ideal for festivals, bazaars, and outdoor events.",
    tone: "#3D0C0C",
    row: "bottom" as const,
  },
  {
    id: "home-delivery",
    cateringType: "home-delivery" as const,
    nameID: "Home Delivery Service",
    nameEN: "Home Delivery Service",
    descriptionID:
      "Antar hidangan Padang ke rumah atau kantor dengan packaging rapi dan pengiriman tepat waktu. Pesan via WhatsApp untuk menu harian atau pesanan besar.",
    descriptionEN:
      "Padang meals delivered to your home or office with neat packaging and on-time service. Order via WhatsApp for daily meals or large orders.",
    tone: "#C75757",
    row: "bottom" as const,
  },
] as const;

export const FOOTER_NAV_LEFT = [
  { href: "/", label: "Beranda" },
  { href: "/about", label: "Tentang Kami" },
  { href: "/whats-on", label: "Kabar Terkini" },
  { href: "/menu", label: "Menu" },
  { href: "/catering", label: "Katering" },
] as const;

export const FOOTER_NAV_RIGHT = [
  { href: "/reservasi", label: "Reservasi" },
  { href: "/faq", label: "FAQ" },
] as const;

export const MAIN_NAV = [
  { href: "/", label: "Beranda" },
  { href: "/about", label: "Tentang Kami" },
  { href: "/whats-on", label: "Kabar Terkini" },
  { href: "/menu", label: "Menu" },
  { href: "/catering", label: "Katering" },
  { href: "/reservasi", label: "Reservasi" },
] as const;

export const SECONDARY_NAV = [
  { href: "/reservasi", label: "Reservasi Meja" },
  { href: "/faq", label: "FAQ" },
] as const;

export const LEGAL_NAV = [
  { href: "/terms", label: "Syarat dan Ketentuan" },
  { href: "/privacy", label: "Kebijakan Privasi" },
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
      "Ya, kami melayani katering pernikahan, acara perusahaan, arisan, dan gathering. Lihat halaman Katering untuk paket.",
  },
  {
    question: "Di mana lokasi outlet?",
    answer:
      "Saat ini kami memiliki 2 cabang: Pollux Mall Cikarang (GF) dan Bintaro (Jurang Mangu Barat).",
  },
  {
    question: "Apakah ada VIP room?",
    answer:
      "Ya, VIP Private Room tersedia untuk gathering keluarga dan acara kecil. Pilih tipe VIP saat mengisi formulir reservasi.",
  },
] as const;

export const SIGNATURE_MENU = [
  {
    name: "Rendang Daging",
    description: "Daging empuk dengan bumbu rempah khas Minang, dimasak hingga meresap sempurna.",
    tag: "Terlaris",
    price: "Rp 45.000",
  },
  {
    name: "Ayam Pop",
    description: "Ayam kampung lembut dengan kuah kaldu bening khas Padang.",
    tag: "Andalan",
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
    tag: "Andalan",
    price: "Rp 42.000",
  },
  {
    name: "Nasi Tumpeng",
    description: "Paket lengkap 10–15 porsi untuk acara spesial keluarga dan kantor.",
    tag: "Katering",
    price: "Rp 1.500.000",
  },
  {
    name: "Menu Saji Gadang",
    description: "Nasi box praktis dengan pilihan lauk ayam, rendang, gulai, dan dendeng.",
    tag: "Bawa Pulang",
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
