import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, MapPin, Phone, Crown } from "lucide-react";
import PublicPageLayout from "@/components/PublicPageLayout";
import SEOHead from "@/components/SEOHead";
import AboutSlideshow from "@/components/AboutSlideshow";
import image1 from "@assets/DSC07140_1758564407964.jpg";
import image2 from "@assets/DSC02436_1758564588903.jpg";
import image3 from "@assets/DSC02371_1758564588950.jpg";
import exteriorImage from "@assets/DSC07220_1758567803910.jpg";

const storyImages = [
  { src: image1, alt: "Hidangan nasi padang Gadang Barubah", caption: "Cita Rasa Autentik Minang" },
  { src: image2, alt: "Presentasi masakan Padang", caption: "Kualitas Tanpa Kompromi" },
  { src: image3, alt: "Suasana restoran Gadang Barubah", caption: "Pengalaman Bersantap Istimewa" },
];

export default function AboutPage() {
  return (
    <PublicPageLayout>
      <SEOHead pageKey="about" />

      <div className="px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-4xl mx-auto space-y-16">
          <section className="text-center">
            <h1 className="text-3xl sm:text-4xl font-serif font-medium text-primary mb-4">
              About Gadang Barubah
            </h1>
            <div className="w-24 h-px bg-primary mx-auto mb-6" />
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Rumah makan Padang yang menghadirkan nasi padang autentik dan warisan kuliner Minang
              dengan standar kualitas tertinggi di Indonesia.
            </p>
          </section>

          <AboutSlideshow
            images={storyImages}
            content={{
              title: "Cerita Kami",
              paragraphs: [
                'Nama "Gadang Barubah" melambangkan semangat besar untuk terus berinovasi tanpa meninggalkan akar tradisi Minang yang kaya.',
                "Setiap sajian — dari rendang hingga gulai — disajikan dengan resep turun-temurun dan bahan segar pilihan.",
                "Gadang Barubah bukan hanya tempat makan, melainkan destinasi kuliner yang menghadirkan kehangatan, pelayanan prima, dan cita rasa autentik.",
              ],
            }}
            interval={5000}
          />

          <section id="outlet">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-serif font-medium text-foreground mb-4">Outlet</h2>
              <div className="w-24 h-px bg-primary mx-auto mb-4" />
              <p className="text-muted-foreground max-w-xl mx-auto">
                Kunjungi outlet unggulan kami di Pollux Mall Cikarang
              </p>
            </div>

            <Card className="overflow-hidden border-border/30">
              <div className="aspect-[16/9] sm:aspect-[21/9] overflow-hidden">
                <img
                  src={exteriorImage}
                  alt="Eksterior outlet Gadang Barubah Pollux Mall Cikarang"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <CardContent className="p-6 sm:p-8 space-y-4">
                <div className="flex items-start gap-3 text-muted-foreground">
                  <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">Pollux Mall Cikarang</p>
                    <p className="text-sm leading-relaxed">
                      Main Gate, Mall Cikarang, Jl. Raya Cikarang - Cibarusah, Pasirsari,
                      Cikarang Sel., Kabupaten Bekasi, Jawa Barat 17530 — Lantai GF
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Clock className="h-5 w-5 text-primary shrink-0" />
                  <span>Buka setiap hari: 10:00 – 22:00 WIB</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Phone className="h-5 w-5 text-primary shrink-0" />
                  <a
                    href="https://wa.me/6289509766739"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    089509766739
                  </a>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Crown className="h-5 w-5 text-primary shrink-0" />
                  <span>VIP Private Room tersedia untuk acara spesial</span>
                </div>
                <Link href="/services/outlet">
                  <Button className="mt-2">Lihat Detail Outlet</Button>
                </Link>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </PublicPageLayout>
  );
}
