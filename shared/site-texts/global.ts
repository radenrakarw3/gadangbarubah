import { definePageTexts } from "./define";

export const GLOBAL_TEXTS = definePageTexts("global", {
  "global.nav.home": { section: "Menu navigasi", label: "Beranda", id: "Beranda", en: "Home" },
  "global.nav.about": { section: "Menu navigasi", label: "Tentang Kami", id: "Tentang Kami", en: "About Us" },
  "global.nav.kemitraan": { section: "Menu navigasi", label: "Kemitraan", id: "Kemitraan", en: "Partnership" },
  "global.nav.whatsOn": { section: "Menu navigasi", label: "Kabar Terkini", id: "Kabar Terkini", en: "What's On" },
  "global.nav.menu": { section: "Menu navigasi", label: "Menu", id: "Menu", en: "Menu" },
  "global.nav.catering": { section: "Menu navigasi", label: "Katering", id: "Katering", en: "Catering" },
  "global.nav.reservation": { section: "Menu navigasi", label: "Reservasi", id: "Reservasi", en: "Reserve" },
  "global.nav.contact": { section: "Menu navigasi", label: "Kontak", id: "Kontak", en: "Contact" },
  "global.nav.book": { section: "Menu navigasi", label: "Tombol reservasi (mobile)", id: "BOOK", en: "BOOK" },
  "global.nav.language": { section: "Menu navigasi", label: "Label bahasa", id: "Bahasa", en: "Language" },
  "global.nav.reserveNow": {
    section: "Menu navigasi",
    label: "Tombol reservasi di menu layar penuh",
    id: "Reservasi Sekarang",
    en: "Reserve Now",
  },
  "global.nav.whatsappGreeting": {
    section: "Menu navigasi",
    label: "Pesan awal WhatsApp tombol Kontak",
    id: "Halo Gadang Barubah! Saya ingin bertanya.",
    en: "Hello Gadang Barubah! I have a question.",
  },

  "global.company.name": {
    section: "Perusahaan",
    label: "Nama perusahaan",
    id: "PT. Gadang Barubah Indonesia",
    en: "PT. Gadang Barubah Indonesia",
  },
  "global.company.address": {
    section: "Perusahaan",
    label: "Alamat perusahaan",
    id: "Jl. Menteng Raya No.28 Blok FG, Jurang Mangu Barat, Kec. Pd. Aren, Kota Tangerang Selatan, Banten 15412",
    en: "Jl. Menteng Raya No.28 Blok FG, Jurang Mangu Barat, Kec. Pd. Aren, Kota Tangerang Selatan, Banten 15412",
    multiline: true,
    maxLength: 500,
  },

  "global.footer.navigateHeading": { section: "Footer", label: "Judul kolom navigasi (mobile)", id: "Navigasi", en: "Navigate" },
  "global.footer.memberHeading": { section: "Footer", label: "Judul kolom member (mobile)", id: "Member", en: "Member" },
  "global.footer.member": { section: "Footer", label: "Link Member", id: "Member", en: "Member" },
  "global.footer.login": { section: "Footer", label: "Link Login", id: "Login", en: "Login" },
  "global.footer.register": { section: "Footer", label: "Link Daftar", id: "Daftar", en: "Register" },
  "global.footer.faq": { section: "Footer", label: "Link FAQ", id: "FAQ", en: "FAQ's" },
  "global.footer.terms": { section: "Footer", label: "Link Syarat dan Ketentuan", id: "Syarat dan Ketentuan", en: "Terms and Conditions" },
  "global.footer.privacy": { section: "Footer", label: "Link Kebijakan Privasi", id: "Kebijakan Privasi", en: "Privacy Policy" },
  "global.consent.text": {
    section: "Persetujuan privasi (form)",
    label: "Kalimat persetujuan ({terms} dan {privacy} = link)",
    id: "Saya setuju dengan {terms} dan {privacy}.",
    en: "I agree to the {terms} and {privacy}.",
  },
  "global.consent.terms": { section: "Persetujuan privasi (form)", label: "Teks link syarat", id: "Syarat & Ketentuan", en: "Terms & Conditions" },
  "global.consent.privacy": { section: "Persetujuan privasi (form)", label: "Teks link privasi", id: "Kebijakan Privasi", en: "Privacy Policy" },

  "global.footer.copyright": {
    section: "Footer",
    label: "Hak cipta ({year} = tahun berjalan)",
    id: "© {year} Gadang Barubah, Inc. Hak Cipta Dilindungi.",
    en: "© {year} Gadang Barubah, Inc. All Rights Reserved.",
  },
});
