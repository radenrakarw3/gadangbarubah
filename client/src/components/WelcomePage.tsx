import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight, User, Download, FileText } from 'lucide-react';
import Logo from './Logo';
import SEOHead from './SEOHead';
import ImageSlideshow from './ImageSlideshow';
import image1 from '@assets/DSC07140_1758564407964.jpg';
import image2 from '@assets/DSC02436_1758564588903.jpg';
import image3 from '@assets/DSC02371_1758564588950.jpg';
import image4 from '@assets/DSC07168_1758564588951.jpg';
import image5 from '@assets/DSC07153_1758564588952.jpg';
import image6 from '@assets/DSC07152_1758564588952.jpg';
import image7 from '@assets/DSC07130_1758564588953.jpg';
import restaurantExterior from '@assets/DSC07220_1758565473982.jpg';
import restaurantNight from '@assets/DSC05600_1758565473997.jpg';
import menuPdf from '@assets/Menu Gadang Digital 5 September 2025_1758627992252.pdf';
import { AnimatedUni } from './AnimatedUni';

export default function WelcomePage() {
  const [, navigate] = useLocation();

  const handleContinue = () => {
    navigate('/uni');
  };

  const slideshowImages = [
    {
      src: image1,
      alt: "Nasi padang dan rendang autentik Minangkabau di Gadang Barubah",
      caption: "Cita Rasa Nasi Padang Autentik yang Tak Terlupakan"
    },
    {
      src: image2,
      alt: "Presentasi masakan Padang premium dengan minuman segar",
      caption: "Presentasi Berkelas dengan Cita Rasa Istimewa"
    },
    {
      src: image3,
      alt: "Pelayanan prima dari staf rumah makan Padang Gadang Barubah",
      caption: "Pelayanan Tulus dari Hati"
    },
    {
      src: image4,
      alt: "Pengalaman bersantap nasi padang bersama keluarga",
      caption: "Momen Berkualitas Bersama Orang Terkasih"
    },
    {
      src: image5,
      alt: "Hidangan tradisional Padang dengan sentuhan modern",
      caption: "Tradisi Kuliner Minang yang Diwariskan Turun Temurun"
    },
    {
      src: image6,
      alt: "Detail masakan Padang dengan plating yang sempurna",
      caption: "Keahlian Kuliner Padang yang Sempurna"
    },
    {
      src: image7,
      alt: "Proses memasak rendang dan gulai dengan keahlian tinggi",
      caption: "Passion dan Dedikasi dalam Setiap Sajian"
    }
  ];

  return (
    <div className="min-h-[100svh] supports-[height:100dvh]:min-h-[100dvh] bg-background">
      <SEOHead pageKey="home" />
      
      {/* Logo at top */}
      <div className="text-center pt-8 pb-4">
        <Logo />
      </div>
      
      {/* Main content */}
      <main className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Section */}
          <div className="text-center mb-12">
            <div className="mb-8">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-medium text-primary mb-8 tracking-wide">
                Selamat Datang di Gadang Barubah - Rumah Makan Padang Premium Indonesia
              </h1>
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-8"></div>
            </div>
          </div>
          
          {/* Restaurant Images Slideshow */}
          <div className="mb-10">
            <ImageSlideshow images={slideshowImages} interval={5000} />
          </div>
          
          {/* About Us Story Section */}
          <div className="mb-10 space-y-16">
            {/* Story Header */}
            <div className="text-center">
              <h2 className="text-4xl font-serif font-medium text-foreground mb-4">Tentang Kami – Gadang Barubah</h2>
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-8"></div>
              <p className="text-lg text-muted-foreground font-light leading-relaxed max-w-3xl mx-auto">
                Rumah makan Padang premium yang menghadirkan nasi padang autentik dan masakan Minang tradisional terbaik. Pilihan utama untuk pecinta kuliner Padang dengan cita rasa premium dan pelayanan terdepan di seluruh Indonesia.
              </p>
            </div>

            {/* Story Section 1 - Heritage & Innovation */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h3 className="text-2xl font-serif font-medium text-foreground">Semangat Besar untuk Berinovasi</h3>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Gadang Barubah adalah pilihan terdepan untuk pecinta kuliner Padang di Indonesia. Nama "Gadang Barubah" melambangkan semangat besar untuk terus berinovasi, tanpa meninggalkan akar tradisi yang kaya. 
                    Di sini, setiap sajian nasi padang dan masakan Minang bukan sekadar makanan, melainkan sebuah perjalanan rasa yang menghadirkan resep turun-temurun khas Padang dengan standar kualitas tertinggi.
                  </p>
                  <p>
                    Dari rendang daging yang mendunia, gulai kambing penuh rempah, hingga aneka lauk pauk segar khas Padang—disajikan dengan sentuhan kekinian yang 
                    menggugah selera. Harmoni tradisi dan inovasi hadir dalam setiap hidangan nasi padang, membawa cita rasa autentik masakan Minang yang tak lekang oleh waktu.
                  </p>
                </div>
              </div>
              <div className="relative overflow-hidden rounded-xl shadow-2xl">
                <div className="aspect-[4/3]">
                  <img 
                    src={restaurantExterior} 
                    alt="Eksterior mewah rumah makan Padang Gadang Barubah Indonesia (gadangbarubahindonesia.id)" 
                    className="w-full h-full object-cover"
                    data-testid="img-exterior"
                  />
                </div>
              </div>
            </div>

            {/* Story Section 2 - Philosophy & Experience */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="lg:order-2 space-y-6">
                <h3 className="text-2xl font-serif font-medium text-foreground">Bahasa Universal yang Menyatukan</h3>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Kami percaya, kuliner adalah bahasa universal yang mampu menyatukan. Karena itu, Gadang Barubah (gadangbarubahindonesia.id) berkomitmen 
                    menghadirkan pengalaman bersantap yang hangat, ramah, dan berkesan, baik untuk keluarga, sahabat, maupun kolega.
                  </p>
                  <p>
                    Biarkan aroma rempah rendang dan gulai serta cita rasa autentik nasi padang membawa Anda seolah berkunjung langsung ke ranah Minang, sekaligus 
                    merasakan kenyamanan ruang modern yang kami hadirkan di tengah Cikarang. Setiap momen makan bersama menjadi istimewa dalam suasana 
                    rumah makan Padang yang dirancang khusus untuk menciptakan kebersamaan.
                  </p>
                </div>
              </div>
              <div className="lg:order-1 relative overflow-hidden rounded-xl shadow-2xl">
                <div className="aspect-[4/3]">
                  <img 
                    src={restaurantNight} 
                    alt="Suasana malam hangat di rumah makan Padang Gadang Barubah dengan pencahayaan ambient" 
                    className="w-full h-full object-cover"
                    data-testid="img-night"
                  />
                </div>
              </div>
            </div>

            {/* Story Conclusion */}
            <Card className="border-border/50 shadow-sm bg-gradient-to-br from-background to-muted/20">
              <CardContent className="p-8 sm:p-12 text-center">
                <div className="max-w-4xl mx-auto space-y-6">
                  <h3 className="text-3xl font-serif font-medium text-foreground mb-6">Destinasi Kuliner Warisan Indonesia</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Gadang Barubah bukan hanya tempat makan, melainkan sebuah destinasi kuliner yang mengajak Anda menjelajahi 
                    kekayaan warisan Indonesia. Setiap hidangan menceritakan kisah budaya yang terjaga, dengan rasa yang autentik 
                    dan pelayanan yang penuh kehangatan.
                  </p>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    Di tengah hiruk pikuk kehidupan modern, kami hadirkan ruang di mana tradisi bertemu dengan kenyamanan. 
                    Tempat di mana setiap gigitan membawa kenangan, dan setiap kunjungan menjadi bagian dari perjalanan 
                    kuliner yang tak terlupakan bersama keluarga dan orang tersayang.
                  </p>
                  <div className="pt-4">
                    <div className="inline-block w-16 h-px bg-primary"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Menu Download Section */}
          <div className="mb-10">
            <Card className="border-border/50 shadow-sm bg-gradient-to-br from-background to-muted/20">
              <CardContent className="p-8 sm:p-12 text-center">
                <div className="max-w-3xl mx-auto space-y-6">
                  <div className="flex justify-center mb-4">
                    <div className="p-4 bg-primary/10 rounded-full">
                      <FileText className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-serif font-medium text-foreground mb-6">Download Menu Lengkap</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                    Jelajahi koleksi lengkap hidangan autentik Padang kami. Unduh menu digital untuk melihat 
                    semua pilihan masakan Minang tradisional dengan harga terbaru.
                  </p>
                  <div className="flex justify-center">
                    <Button
                      asChild
                      size="lg"
                      className="text-base font-medium"
                      data-testid="button-download-menu"
                    >
                      <a 
                        href={menuPdf} 
                        download="Menu-Gadang-Barubah-2025.pdf"
                        data-testid="link-download-menu"
                      >
                        <Download className="mr-2 h-5 w-5" />
                        Download Menu PDF
                      </a>
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground/80">
                    File PDF • Update September 2025 • Kompatibel dengan semua perangkat
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Animated Uni Mascot with Speech Bubble */}
          <AnimatedUni />

          {/* Continue Button */}
          <div className="text-center space-y-4">
            <Button
              onClick={handleContinue}
              size="lg"
              className="px-8 py-4 text-base font-medium bg-primary hover:bg-primary/90 transition-all duration-300 shadow-sm hover:shadow-md"
              data-testid="button-continue"
            >
              Jelajahi Layanan Kami
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
            
            {/* Login Member Button */}
            <div className="flex justify-center">
              <Button
                onClick={() => navigate('/member/login')}
                variant="outline"
                size="sm"
                className="text-sm font-medium border-primary/30 text-primary hover:bg-primary/5"
                data-testid="button-member-login"
              >
                <User className="mr-2 h-4 w-4" />
                Login Member
              </Button>
            </div>
            
            <p className="text-sm text-muted-foreground/80">
              Temui Uni, asisten virtual kami yang siap membantu
            </p>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-border/30 py-8 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground font-medium">
              © 2025 Gadang Barubah
            </p>
            <p className="text-xs text-muted-foreground/80">
              Keunggulan Kuliner yang Tak Tertandingi
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}