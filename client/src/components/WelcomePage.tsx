import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';
import Logo from './Logo';
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

export default function WelcomePage() {
  const [, navigate] = useLocation();

  const handleContinue = () => {
    navigate('/uni');
  };

  const slideshowImages = [
    {
      src: image1,
      alt: "Sajian autentik Minangkabau di Gadang Barubah",
      caption: "Cita Rasa Autentik yang Tak Terlupakan"
    },
    {
      src: image2,
      alt: "Presentasi makanan premium dengan minuman segar",
      caption: "Presentasi Berkelas dengan Cita Rasa Istimewa"
    },
    {
      src: image3,
      alt: "Pelayanan prima dari staf Gadang Barubah",
      caption: "Pelayanan Tulus dari Hati"
    },
    {
      src: image4,
      alt: "Pengalaman bersantap bersama keluarga",
      caption: "Momen Berkualitas Bersama Orang Terkasih"
    },
    {
      src: image5,
      alt: "Hidangan tradisional dengan sentuhan modern",
      caption: "Tradisi Kuliner yang Diwariskan Turun Temurun"
    },
    {
      src: image6,
      alt: "Detail makanan dengan plating yang sempurna",
      caption: "Keahlian Kuliner yang Sempurna"
    },
    {
      src: image7,
      alt: "Proses memasak dengan keahlian tinggi",
      caption: "Passion dan Dedikasi dalam Setiap Sajian"
    }
  ];

  return (
    <div className="min-h-[100svh] supports-[height:100dvh]:min-h-[100dvh] bg-background">
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
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-light text-foreground mb-6 tracking-wide">
                Selamat Datang di
              </h1>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-medium text-primary mb-8 tracking-wide">
                Gadang Barubah
              </h2>
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
              <h2 className="text-4xl font-serif font-medium text-foreground mb-4">Kisah Gadang Barubah</h2>
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-8"></div>
              <p className="text-lg text-muted-foreground font-light leading-relaxed max-w-3xl mx-auto">
                Sebuah perjalanan yang dimulai dari mimpi untuk menghadirkan keagungan kuliner Minangkabau dalam balutan kemewahan modern
              </p>
            </div>

            {/* Story Section 1 - Exterior */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h3 className="text-2xl font-serif font-medium text-foreground">Arsitektur yang Menceritakan Kebesaran</h3>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Berdiri megah dengan desain kontemporer yang memukau, Gadang Barubah hadir sebagai landmark kuliner yang tak terlupakan. 
                    Setiap sudut bangunan dirancang untuk mencerminkan filosofi "Gadang" - kebesaran yang tak hanya terlihat dari kemegahan fisik, 
                    namun juga dari kehangatan yang terpancar dari setiap detailnya.
                  </p>
                  <p>
                    Fasad modern yang berpadu dengan elemen tradisional menciptakan harmoni sempurna antara warisan masa lalu dan inovasi masa kini. 
                    Di sinilah perjalanan kuliner Anda dimulai - dari langkah pertama memasuki kawasan yang dirancang khusus untuk memberikan 
                    pengalaman yang luar biasa.
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-[4/3] overflow-hidden rounded-lg shadow-xl">
                  <img 
                    src={restaurantExterior} 
                    alt="Eksterior mewah Gadang Barubah" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl"></div>
              </div>
            </div>

            {/* Story Section 2 - Interior/Night */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="lg:order-2 space-y-6">
                <h3 className="text-2xl font-serif font-medium text-foreground">Atmosfer yang Memanjakan Jiwa</h3>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Ketika malam tiba, Gadang Barubah bertransformasi menjadi oasis kuliner yang hangat dan mengundang. 
                    Pencahayaan yang dipilih dengan cermat menciptakan suasana intimacy yang sempurna, 
                    di mana setiap momen bersantap menjadi pengalaman yang berkesan.
                  </p>
                  <p>
                    Interior yang didesain dengan perpaduan elemen tradisional dan modern mencerminkan kekayaan budaya Minangkabau 
                    dalam balutan kemewahan kontemporer. Di sinilah cerita-cerita indah tercipta, di mana cita rasa bertemu dengan kehangatan, 
                    dan setiap hidangan disajikan bukan hanya sebagai makanan, tetapi sebagai karya seni yang memanjakan seluruh indra.
                  </p>
                </div>
              </div>
              <div className="lg:order-1 relative">
                <div className="aspect-[4/3] overflow-hidden rounded-lg shadow-xl">
                  <img 
                    src={restaurantNight} 
                    alt="Suasana malam yang hangat di Gadang Barubah" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
              </div>
            </div>

            {/* Story Conclusion */}
            <Card className="border-border/50 shadow-sm bg-gradient-to-br from-background to-muted/20">
              <CardContent className="p-8 sm:p-12 text-center">
                <div className="max-w-4xl mx-auto space-y-6">
                  <h3 className="text-3xl font-serif font-medium text-foreground mb-6">Lebih dari Sekadar Restoran</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Gadang Barubah adalah destinasi di mana tradisi kuliner Minangkabau yang kaya bertemu dengan standar pelayanan kelas dunia. 
                    Setiap hidangan yang kami sajikan adalah hasil dari dedikasi para chef berpengalaman yang memahami esensi cita rasa otentik, 
                    dipadu dengan inovasi modern yang memukau.
                  </p>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    Kami tidak hanya menyajikan makanan, tetapi menghadirkan pengalaman kuliner yang akan terukir dalam ingatan. 
                    Dari kehangatan sambutan hingga kelezatan hidangan penutup, setiap momen di Gadang Barubah dirancang untuk menjadi 
                    bagian dari cerita hidup yang tak terlupakan.
                  </p>
                  <div className="pt-4">
                    <div className="inline-block w-16 h-px bg-primary"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Continue Button */}
          <div className="text-center">
            <Button
              onClick={handleContinue}
              size="lg"
              className="px-8 py-4 text-base font-medium bg-primary hover:bg-primary/90 transition-all duration-300 shadow-sm hover:shadow-md"
              data-testid="button-continue"
            >
              Jelajahi Layanan Kami
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
            
            <p className="text-sm text-muted-foreground/80 mt-4">
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