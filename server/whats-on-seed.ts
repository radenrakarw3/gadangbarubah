import { storage } from "./storage";

const SEED_ARTICLES = [
  {
    slug: "rendang-gadang-barubah-warisan-rasa-minang",
    titleId: "Rendang Gadang Barubah: Warisan Rasa Minang",
    titleEn: "Gadang Barubah Rendang: Minang Heritage on a Plate",
    excerptId:
      "Mengenal proses dan cita rasa rendang autentik yang menjadi signature menu kami, dimasak dengan rempah pilihan dan resep turun-temurun.",
    excerptEn:
      "Discover how our signature rendang is crafted with premium spices and time-honored Minang recipes.",
    contentId:
      "Rendang menjadi ikon masakan Padang yang tak lekang oleh waktu. Di Gadang Barubah, setiap porsi rendang dimasak perlahan agar bumbu meresap sempurna ke daging.\n\nKami menggunakan rempah pilihan dan resep turun-temurun yang dijaga kualitasnya. Hasilnya adalah rendang dengan tekstur empuk, aroma kaya, dan cita rasa yang konsisten di setiap kunjungan Anda.",
    contentEn:
      "Rendang is the timeless icon of Padang cuisine. At Gadang Barubah, every portion is slow-cooked so spices fully infuse the meat.\n\nWe use premium spices and heritage recipes with strict quality control. The result is tender rendang with rich aroma and consistent flavor on every visit.",
    categoryId: "Kuliner",
    categoryEn: "Culinary",
    publishedAt: "2026-01-15",
    sortOrder: 0,
  },
  {
    slug: "tips-memilih-paket-katering-acara-kantor",
    titleId: "Tips Memilih Paket Katering untuk Acara Kantor",
    titleEn: "Tips for Choosing Catering Packages for Office Events",
    excerptId:
      "Panduan praktis memilih menu nasi box atau buffet Padang yang pas untuk meeting, gathering, dan event perusahaan.",
    excerptEn:
      "A practical guide to choosing nasi box or Padang buffet menus for meetings, gatherings, and corporate events.",
    contentId:
      "Acara kantor membutuhkan menu yang praktis, higienis, dan disukai banyak orang. Paket Saji Gadang / Nasi Box cocok untuk meeting kecil, sementara buffet lebih ideal untuk gathering besar.\n\nPastikan jumlah pax, waktu penyajian, dan kebutuhan dietary tim Anda dikomunikasikan lebih awal agar pengalaman acara berjalan lancar.",
    contentEn:
      "Office events need practical, hygienic menus that appeal to many guests. Mealbox packages work well for small meetings, while buffet service suits larger gatherings.\n\nConfirm guest count, serving time, and dietary needs early so your event runs smoothly.",
    categoryId: "Katering",
    categoryEn: "Catering",
    publishedAt: "2026-01-08",
    sortOrder: 1,
  },
  {
    slug: "cara-reservasi-meja-vip-room",
    titleId: "Cara Reservasi Meja & VIP Room di Gadang Barubah",
    titleEn: "How to Book a Table & VIP Room at Gadang Barubah",
    excerptId:
      "Langkah mudah memesan meja reguler atau VIP room melalui form reservasi online kami.",
    excerptEn:
      "Easy steps to book a regular table or VIP room through our online reservation form.",
    contentId:
      "Reservasi dapat dilakukan melalui form di website: pilih outlet, tanggal, jam, dan jumlah tamu. Untuk VIP room, pilih tipe meja VIP saat mengisi formulir.\n\nTim kami akan mengonfirmasi ketersediaan melalui WhatsApp. Disarankan melakukan reservasi minimal H-1 untuk akhir pekan dan hari libur.",
    contentEn:
      "Book through our website form: choose outlet, date, time, and guest count. For VIP rooms, select the VIP table type in the form.\n\nOur team confirms availability via WhatsApp. We recommend booking at least one day ahead for weekends and holidays.",
    categoryId: "Reservasi",
    categoryEn: "Reservation",
    publishedAt: "2026-01-02",
    sortOrder: 2,
  },
  {
    slug: "suasana-outlet-cikarang-bintaro",
    titleId: "Suasana Outlet Gadang Barubah: Cikarang & Bintaro",
    titleEn: "Gadang Barubah Outlets: Cikarang & Bintaro",
    excerptId:
      "Kenali pengalaman bersantap di dua cabang kami, dari VIP room di Cikarang hingga suasana hangat di Bintaro.",
    excerptEn:
      "Explore dining at our two branches, from Cikarang's VIP rooms to Bintaro's warm atmosphere.",
    contentId:
      "Cabang Pollux Mall Cikarang menghadirkan pengalaman bersantap modern dengan opsi VIP room untuk acara keluarga dan perusahaan.\n\nCabang Bintaro (Jurang Mangu Barat) menawarkan suasana hangat dengan interior kontemporer. Kunjungi halaman outlet kami untuk melihat foto dan detail fasilitas masing-masing cabang.",
    contentEn:
      "Pollux Mall Cikarang offers a modern dining experience with VIP room options for family and corporate events.\n\nBintaro (Jurang Mangu Barat) provides a warm atmosphere with contemporary interiors. Visit our outlet page for photos and facility details for each branch.",
    categoryId: "Outlet",
    categoryEn: "Outlet",
    publishedAt: "2025-12-20",
    sortOrder: 3,
  },
] as const;

export async function seedWhatsOnIfEmpty(): Promise<void> {
  try {
    const existing = await storage.getWhatsOnArticlesAdmin();
    if (existing.length > 0) return;

    for (const article of SEED_ARTICLES) {
      await storage.createWhatsOnArticle({
        ...article,
        isPublished: true,
      });
    }
  } catch (error) {
    console.error("[WhatsOnSeed] gagal seed artikel:", error);
  }
}
