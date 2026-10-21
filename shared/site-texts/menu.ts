import { definePageTexts } from "./define";

export const MENU_TEXTS = definePageTexts("menu", {
  "menu.title": { section: "Judul halaman", label: "Judul", id: "Menu", en: "Menu" },
  "menu.subtitle": {
    section: "Judul halaman",
    label: "Subjudul",
    multiline: true,
    id: "Jelajahi koleksi hidangan autentik Padang kami — dari rendang signature hingga paket praktis untuk dibawa pulang.",
    en: "Explore our authentic Padang dishes — from signature rendang to practical takeaway packages.",
  },
  "menu.empty": {
    section: "Judul halaman",
    label: "Teks saat menu kosong",
    id: "Menu sedang disiapkan. Silakan lihat menu digital lengkap di bawah.",
    en: "Menu is being prepared. Please see the complete digital menu below.",
  },
  "menu.pdf.title": { section: "Menu digital (PDF)", label: "Judul", id: "Menu Digital Lengkap", en: "Complete Digital Menu" },
  "menu.pdf.description": {
    section: "Menu digital (PDF)",
    label: "Deskripsi",
    multiline: true,
    id: "Lihat menu digital dengan harga terbaru dan pilihan lengkap masakan Minang tradisional.",
    en: "See our digital menu with latest prices and complete traditional Minang selections.",
  },
  "menu.pdf.button": { section: "Menu digital (PDF)", label: "Tombol buka PDF", id: "Buka Menu PDF", en: "Open Menu PDF" },
  "menu.pdf.note": {
    section: "Menu digital (PDF)",
    label: "Catatan di bawah tombol",
    id: "Update September 2025 • Kompatibel semua perangkat",
    en: "Updated September 2025 • Compatible with all devices",
  },
});
