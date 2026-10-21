import { definePageTexts } from "./define";

export const WHATS_ON_TEXTS = definePageTexts("whatsOn", {
  "whatsOn.title": { section: "Daftar artikel", label: "Judul halaman", id: "Kabar Terkini", en: "What's On" },
  "whatsOn.subtitle": {
    section: "Daftar artikel",
    label: "Subjudul",
    multiline: true,
    id: "Berita, tips kuliner, dan update terbaru seputar Gadang Barubah Indonesia.",
    en: "News, culinary tips, and latest updates from Gadang Barubah Indonesia.",
  },
  "whatsOn.loadingList": { section: "Daftar artikel", label: "Teks memuat", id: "Memuat artikel...", en: "Loading articles..." },
  "whatsOn.errorList": { section: "Daftar artikel", label: "Teks gagal memuat", id: "Gagal memuat artikel.", en: "Failed to load articles." },
  "whatsOn.empty": {
    section: "Daftar artikel",
    label: "Teks saat belum ada artikel",
    id: "Belum ada artikel. Nantikan kabar terbaru dari kami.",
    en: "No articles yet. Stay tuned for updates.",
  },
  "whatsOn.readMore": { section: "Daftar artikel", label: "Link baca selengkapnya", id: "Baca selengkapnya", en: "Read more" },

  "whatsOn.detail.loading": { section: "Detail artikel", label: "Teks memuat", id: "Memuat artikel...", en: "Loading article..." },
  "whatsOn.detail.notFound": { section: "Detail artikel", label: "Judul artikel tidak ditemukan", id: "Artikel tidak ditemukan", en: "Article not found" },
  "whatsOn.detail.backToList": {
    section: "Detail artikel",
    label: "Tombol kembali (artikel tidak ditemukan)",
    id: "Kembali ke Kabar Terkini",
    en: "Back to What's On",
  },
  "whatsOn.detail.back": { section: "Detail artikel", label: "Tombol kembali di atas artikel", id: "Kabar Terkini", en: "What's On" },
});
