import PublicPageLayout from "@/components/PublicPageLayout";
import SEOHead from "@/components/SEOHead";
import { COMPANY } from "@/lib/siteContent";
import { useSiteLanguage } from "@/lib/language";

export default function PrivacyPage() {
  const { lang } = useSiteLanguage();

  return (
    <PublicPageLayout>
      <SEOHead pageKey="privacy" />

      <div className="px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-3xl mx-auto prose prose-neutral dark:prose-invert">
          <h1 className="text-3xl font-serif font-medium text-primary">
            {lang === "ID" ? "Kebijakan Privasi" : "Privacy Policy"}
          </h1>
          <p className="text-muted-foreground">
            {lang === "ID" ? "Terakhir diperbarui: Januari 2026" : "Last updated: January 2026"}
          </p>

          <h2>1. Data yang Kami Kumpulkan</h2>
          <p>
            Saat mengisi form reservasi, kami mengumpulkan nama, nomor WhatsApp, email (opsional),
            tanggal/waktu reservasi, jumlah tamu, dan catatan. Data ini digunakan untuk konfirmasi
            reservasi meja.
          </p>

          <h2>2. Penggunaan Data</h2>
          <p>
            Data digunakan untuk mengelola permintaan reservasi, menghubungi pelanggan via WhatsApp,
            dan meningkatkan layanan {COMPANY.name}. Kami tidak menjual data pribadi kepada pihak ketiga.
          </p>

          <h2>3. Keamanan</h2>
          <p>
            Kami menerapkan praktik keamanan standar industri termasuk rate limiting dan session
            management untuk melindungi data Anda.
          </p>

          <h2>4. Analitik</h2>
          <p>
            Website menggunakan Google Analytics dengan consent mode. Data analytics hanya
            dikumpulkan setelah pengguna memberikan persetujuan melalui banner cookie (jika
            ditampilkan).
          </p>

          <h2>5. Hak Anda</h2>
          <p>
            Anda dapat meminta penghapusan atau koreksi data dengan menghubungi kami via WhatsApp{" "}
            {COMPANY.phoneDisplay}.
          </p>
        </div>
      </div>
    </PublicPageLayout>
  );
}
