import { definePageTexts } from "./define";

/** Pertanyaan FAQ saat ini hanya berbahasa Indonesia; default EN = teks ID. */
const same = (text: string) => ({ id: text, en: text });

export const FAQ_TEXTS = definePageTexts("faq", {
  "faq.title": { section: "Judul halaman", label: "Judul", id: "FAQ", en: "FAQ" },
  "faq.subtitle": {
    section: "Judul halaman",
    label: "Subjudul",
    multiline: true,
    id: "Temukan jawaban seputar layanan, reservasi, dan outlet Gadang Barubah.",
    en: "Find answers about services, reservations, and Gadang Barubah outlets.",
  },

  "faq.1.question": { section: "Pertanyaan", label: "Pertanyaan 1", ...same("Jam operasional Gadang Barubah?") },
  "faq.1.answer": {
    section: "Pertanyaan",
    label: "Jawaban 1",
    multiline: true,
    ...same("Outlet kami buka setiap hari pukul 10:00–22:00 WIB. Reservasi VIP room disarankan minimal H-1."),
  },
  "faq.2.question": { section: "Pertanyaan", label: "Pertanyaan 2", ...same("Bagaimana cara reservasi meja?") },
  "faq.2.answer": {
    section: "Pertanyaan",
    label: "Jawaban 2",
    multiline: true,
    ...same("Buka halaman Reservasi, isi formulir (nama, WhatsApp, tanggal, waktu, jumlah tamu), lalu tim kami akan menghubungi Anda via WhatsApp untuk konfirmasi."),
  },
  "faq.3.question": { section: "Pertanyaan", label: "Pertanyaan 3", ...same("Apakah tersedia layanan delivery?") },
  "faq.3.answer": {
    section: "Pertanyaan",
    label: "Jawaban 3",
    multiline: true,
    ...same("Ya. Anda bisa memesan via WhatsApp atau platform delivery partner kami (GoFood, GrabFood, ShopeeFood)."),
  },
  "faq.4.question": { section: "Pertanyaan", label: "Pertanyaan 4", ...same("Apakah menerima pesanan catering untuk acara?") },
  "faq.4.answer": {
    section: "Pertanyaan",
    label: "Jawaban 4",
    multiline: true,
    ...same("Ya, kami melayani katering pernikahan, acara perusahaan, arisan, dan gathering. Lihat halaman Katering untuk paket."),
  },
  "faq.5.question": { section: "Pertanyaan", label: "Pertanyaan 5", ...same("Di mana lokasi outlet?") },
  "faq.5.answer": {
    section: "Pertanyaan",
    label: "Jawaban 5",
    multiline: true,
    ...same("Saat ini kami memiliki 2 cabang: Pollux Mall Cikarang (GF) dan Bintaro (Jurang Mangu Barat)."),
  },
  "faq.6.question": { section: "Pertanyaan", label: "Pertanyaan 6", ...same("Apakah ada VIP room?") },
  "faq.6.answer": {
    section: "Pertanyaan",
    label: "Jawaban 6",
    multiline: true,
    ...same("Ya, VIP Private Room tersedia untuk gathering keluarga dan acara kecil. Pilih tipe VIP saat mengisi formulir reservasi."),
  },
});
