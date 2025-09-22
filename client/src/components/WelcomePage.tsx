import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';
import Header from './Header';

export default function WelcomePage() {
  const [, navigate] = useLocation();

  const handleContinue = () => {
    navigate('/uni');
  };

  return (
    <div className="min-h-[100svh] supports-[height:100dvh]:min-h-[100dvh] bg-background">
      <Header />
      
      {/* Main content */}
      <main className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Section */}
          <div className="text-center mb-16">
            <div className="mb-8">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-light text-foreground mb-6 tracking-wide">
                Selamat Datang di
              </h1>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-medium text-primary mb-8 tracking-wide">
                Gadang Barubah
              </h2>
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-8"></div>
              <p className="text-lg sm:text-xl text-muted-foreground font-light leading-relaxed max-w-2xl mx-auto">
                Cita Rasa Autentik Minangkabau dengan Sentuhan Kemewahan
              </p>
            </div>
          </div>
          
          {/* About Us Section */}
          <Card className="mb-12 border-border/50 shadow-sm">
            <CardContent className="p-8 sm:p-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-serif font-medium text-foreground mb-2">Tentang Kami</h2>
                <div className="w-16 h-px bg-primary mx-auto"></div>
              </div>
              
              {/* Features Grid */}
              <div className="grid md:grid-cols-3 gap-8 mb-10">
                <div className="text-center">
                  <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/10">
                    <span className="text-2xl text-primary">🍽️</span>
                  </div>
                  <h3 className="font-serif text-lg font-medium mb-3">Kuliner Berkelas</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Menu autentik Minangkabau yang dipersembahkan dengan standar kuliner premium
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/10">
                    <span className="text-2xl text-primary">🎖️</span>
                  </div>
                  <h3 className="font-serif text-lg font-medium mb-3">Pelayanan Prima</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Hospitalitas terbaik dengan perhatian detail yang menjadi ciri khas keunggulan kami
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/10">
                    <span className="text-2xl text-primary">✨</span>
                  </div>
                  <h3 className="font-serif text-lg font-medium mb-3">Pengalaman Istimewa</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Setiap kunjungan menjadi momen berkesan dengan suasana yang hangat dan eksklusif
                  </p>
                </div>
              </div>
              
              {/* Description */}
              <div className="text-center max-w-3xl mx-auto space-y-6">
                <p className="text-base text-muted-foreground leading-relaxed">
                  Gadang Barubah hadir sebagai destinasi kuliner premium yang memadukan warisan tradisi 
                  Minangkabau dengan keunggulan pelayanan modern. Kami berkomitmen memberikan pengalaman 
                  bersantap yang tak terlupakan melalui cita rasa otentik dan atmosfer yang istimewa.
                </p>
                
                <p className="text-base text-muted-foreground leading-relaxed">
                  Dengan filosofi "Gadang" yang bermakna kebesaran, kami menghadirkan kemewahan dalam 
                  setiap aspek - dari kualitas bahan terbaik hingga kehangatan pelayanan yang 
                  mencerminkan nilai-nilai luhur budaya Minangkabau.
                </p>
              </div>
            </CardContent>
          </Card>
          
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