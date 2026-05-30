import PublicPageLayout from "@/components/PublicPageLayout";
import SEOHead from "@/components/SEOHead";
import { COMPANY } from "@/lib/siteContent";

export default function TermsPage() {
  return (
    <PublicPageLayout>
      <SEOHead pageKey="terms" />

      <div className="px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-3xl mx-auto prose prose-neutral dark:prose-invert">
          <h1 className="text-3xl font-serif font-medium text-primary">Terms and Conditions</h1>
          <p className="text-muted-foreground">Terakhir diperbarui: Januari 2026</p>

          <h2>1. Penggunaan Website</h2>
          <p>
            Dengan mengakses website Gadang Barubah Indonesia, Anda setuju untuk menggunakan layanan
            ini sesuai ketentuan yang berlaku. Informasi di website bersifat umum dan dapat berubah
            sewaktu-waktu.
          </p>

          <h2>2. Program Reservasi</h2>
          <p>
            Reservasi meja melalui website tunduk pada konfirmasi ketersediaan oleh tim kami via
            WhatsApp. Gadang Barubah berhak menolak atau mengubah jadwal reservasi jika kapasitas
            penuh.
          </p>

          <h2>3. Pemesanan & Catering</h2>
          <p>
            Pemesanan catering dan takeaway melalui WhatsApp tunduk pada konfirmasi ketersediaan
            stok dan jadwal oleh tim kami. Harga dapat berubah; harga final akan dikonfirmasi saat
            pemesanan.
          </p>

          <h2>4. Kontak</h2>
          <p>
            Pertanyaan terkait syarat dan ketentuan dapat disampaikan ke WhatsApp{" "}
            {COMPANY.phoneDisplay} atau alamat kantor: {COMPANY.address}.
          </p>
        </div>
      </div>
    </PublicPageLayout>
  );
}
