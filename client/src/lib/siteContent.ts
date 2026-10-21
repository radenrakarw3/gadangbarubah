/** Nama & alamat perusahaan: global.company.* di shared/site-texts/global.ts */
export const COMPANY = {
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

/** Empat panel outlet homepage — Figma Frame 6. Teks: home.outlet.<id>.* di shared/site-texts/home.ts */
export const HOME_OUTLET_PANELS = [
  {
    id: "cikarang",
    tone: "gray" as const,
    status: "open" as const,
    href: "https://maps.app.goo.gl/jP1JMKQZBU9AXSLz5",
  },
  {
    id: "bintaro",
    tone: "gray" as const,
    status: "open" as const,
    href: "https://maps.google.com/?q=Jl.+Menteng+Raya+No.28+Blok+FG+Jurang+Mangu+Barat",
  },
  {
    id: "puri-indah",
    tone: "salmon" as const,
    status: "coming-soon" as const,
  },
  {
    id: "fourth-outlet",
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

/** Label tampil: catering.types.<value> di shared/site-texts/catering.ts */
export const CATERING_TYPES = [
  { value: "saji-gadang" },
  { value: "snack-box" },
  { value: "buffet" },
  { value: "stall" },
  { value: "rental-room" },
  { value: "home-delivery" },
  { value: "tumpeng" },
] as const;

/** Kolase layanan homepage — Figma Frame 7 (grid 3×2). Teks: home.services.<id>.* */
export const HOME_CATERING_SERVICES = [
  { id: "mealbox", cateringType: "saji-gadang" as const, tone: "#C75757", row: "top" as const },
  { id: "buffet", cateringType: "buffet" as const, tone: "#402C2C", row: "top" as const },
  { id: "snackbox", cateringType: "snack-box" as const, tone: "#3D0C0C", row: "top" as const },
  { id: "rental-room", cateringType: "rental-room" as const, tone: "#402C2C", row: "bottom" as const },
  { id: "stall", cateringType: "stall" as const, tone: "#3D0C0C", row: "bottom" as const },
  { id: "home-delivery", cateringType: "home-delivery" as const, tone: "#C75757", row: "bottom" as const },
] as const;

export const FOOTER_NAV_LEFT = [
  { href: "/", label: "Beranda" },
  { href: "/about", label: "Tentang Kami" },
  { href: "/kemitraan", label: "Kemitraan" },
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
  { href: "/kemitraan", label: "Kemitraan" },
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
