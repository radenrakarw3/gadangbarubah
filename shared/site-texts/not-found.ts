import { definePageTexts } from "./define";

export const NOT_FOUND_TEXTS = definePageTexts("notFound", {
  "notFound.title": { section: "Halaman 404", label: "Judul", id: "404 Halaman Tidak Ditemukan", en: "404 Page Not Found" },
  "notFound.description": {
    section: "Halaman 404",
    label: "Keterangan",
    multiline: true,
    id: "Halaman yang Anda cari tidak tersedia atau sudah dipindahkan.",
    en: "The page you are looking for is unavailable or has been moved.",
  },
});
