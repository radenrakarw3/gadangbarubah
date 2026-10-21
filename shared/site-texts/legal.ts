import { definePageTexts } from "./define";

/** Isi pasal saat ini hanya berbahasa Indonesia; default EN = teks ID. */
const same = (text: string) => ({ id: text, en: text });

export const LEGAL_TEXTS = definePageTexts("legal", {
  "legal.updated": {
    section: "Umum",
    label: "Tanggal pembaruan (kedua halaman)",
    id: "Terakhir diperbarui: Januari 2026",
    en: "Last updated: January 2026",
  },

  "legal.terms.title": { section: "Syarat dan Ketentuan", label: "Judul", id: "Syarat dan Ketentuan", en: "Terms and Conditions" },
  "legal.terms.1.heading": { section: "Syarat dan Ketentuan", label: "Pasal 1 — judul", ...same("1. Penggunaan Website") },
  "legal.terms.1.body": {
    section: "Syarat dan Ketentuan",
    label: "Pasal 1 — isi",
    multiline: true,
    ...same("Dengan mengakses website Gadang Barubah Indonesia, Anda setuju untuk menggunakan layanan ini sesuai ketentuan yang berlaku. Informasi di website bersifat umum dan dapat berubah sewaktu-waktu."),
  },
  "legal.terms.2.heading": { section: "Syarat dan Ketentuan", label: "Pasal 2 — judul", ...same("2. Program Reservasi") },
  "legal.terms.2.body": {
    section: "Syarat dan Ketentuan",
    label: "Pasal 2 — isi",
    multiline: true,
    ...same("Reservasi meja melalui website tunduk pada konfirmasi ketersediaan oleh tim kami via WhatsApp. Gadang Barubah berhak menolak atau mengubah jadwal reservasi jika kapasitas penuh."),
  },
  "legal.terms.3.heading": { section: "Syarat dan Ketentuan", label: "Pasal 3 — judul", ...same("3. Pemesanan & Catering") },
  "legal.terms.3.body": {
    section: "Syarat dan Ketentuan",
    label: "Pasal 3 — isi",
    multiline: true,
    ...same("Pemesanan catering dan takeaway melalui WhatsApp tunduk pada konfirmasi ketersediaan stok dan jadwal oleh tim kami. Harga dapat berubah; harga final akan dikonfirmasi saat pemesanan."),
  },
  "legal.terms.4.heading": { section: "Syarat dan Ketentuan", label: "Pasal 4 — judul", ...same("4. Kontak") },
  "legal.terms.4.body": {
    section: "Syarat dan Ketentuan",
    label: "Pasal 4 — isi ({phone} = no. WA, {address} = alamat perusahaan)",
    multiline: true,
    ...same("Pertanyaan terkait syarat dan ketentuan dapat disampaikan ke WhatsApp {phone} atau alamat kantor: {address}."),
  },

  "legal.privacy.title": { section: "Kebijakan Privasi", label: "Judul", id: "Kebijakan Privasi", en: "Privacy Policy" },
  "legal.privacy.1.heading": { section: "Kebijakan Privasi", label: "Pasal 1 — judul", ...same("1. Data yang Kami Kumpulkan") },
  "legal.privacy.1.body": {
    section: "Kebijakan Privasi",
    label: "Pasal 1 — isi",
    multiline: true,
    ...same("Saat mengisi form reservasi, kami mengumpulkan nama, nomor WhatsApp, email (opsional), tanggal/waktu reservasi, jumlah tamu, dan catatan. Data ini digunakan untuk konfirmasi reservasi meja."),
  },
  "legal.privacy.2.heading": { section: "Kebijakan Privasi", label: "Pasal 2 — judul", ...same("2. Penggunaan Data") },
  "legal.privacy.2.body": {
    section: "Kebijakan Privasi",
    label: "Pasal 2 — isi ({company} = nama perusahaan)",
    multiline: true,
    ...same("Data digunakan untuk mengelola permintaan reservasi, menghubungi pelanggan via WhatsApp, dan meningkatkan layanan {company}. Kami tidak menjual data pribadi kepada pihak ketiga."),
  },
  "legal.privacy.3.heading": { section: "Kebijakan Privasi", label: "Pasal 3 — judul", ...same("3. Keamanan") },
  "legal.privacy.3.body": {
    section: "Kebijakan Privasi",
    label: "Pasal 3 — isi",
    multiline: true,
    ...same("Kami menerapkan praktik keamanan standar industri termasuk rate limiting dan session management untuk melindungi data Anda."),
  },
  "legal.privacy.4.heading": { section: "Kebijakan Privasi", label: "Pasal 4 — judul", ...same("4. Analitik") },
  "legal.privacy.4.body": {
    section: "Kebijakan Privasi",
    label: "Pasal 4 — isi",
    multiline: true,
    ...same("Website menggunakan Google Analytics dengan consent mode. Data analytics hanya dikumpulkan setelah pengguna memberikan persetujuan melalui banner cookie (jika ditampilkan)."),
  },
  "legal.privacy.5.heading": { section: "Kebijakan Privasi", label: "Pasal 5 — judul", ...same("5. Hak Anda") },
  "legal.privacy.5.body": {
    section: "Kebijakan Privasi",
    label: "Pasal 5 — isi ({phone} = no. WA)",
    multiline: true,
    ...same("Anda dapat meminta penghapusan atau koreksi data dengan menghubungi kami via WhatsApp {phone}."),
  },
});
