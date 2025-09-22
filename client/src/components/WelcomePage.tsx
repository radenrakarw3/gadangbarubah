import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';
import Logo from './Logo';

export default function WelcomePage() {
  const [, navigate] = useLocation();

  const handleContinue = () => {
    navigate('/uni');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95 relative overflow-hidden">
      {/* Floating particles effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary/30 rounded-full animate-ping"></div>
        <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-accent/40 rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-primary/20 rounded-full animate-bounce"></div>
      </div>
      
      {/* Main content */}
      <div className="relative z-10">
        {/* Header with Logo */}
        <header className="pt-8 pb-4" data-testid="header-section">
          <Logo />
        </header>
        
        {/* Main content area */}
        <main className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-8">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Welcome Title */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
                Selamat Datang di
              </h1>
              <h2 className="text-3xl md:text-5xl font-bold text-primary mb-8">
                Gadang Barubah
              </h2>
            </div>
            
            {/* About Us Content */}
            <Card className="max-w-3xl mx-auto">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold text-foreground mb-6">
                  Tentang Kami
                </h3>
                <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                  <p>
                    Gadang Barubah adalah destinasi kuliner yang menghadirkan cita rasa autentik 
                    Minangkabau dengan sentuhan modern. Kami berkomitmen untuk memberikan 
                    pengalaman kuliner terbaik dengan menu-menu tradisional yang kaya rasa 
                    dan berkualitas tinggi.
                  </p>
                  <p>
                    Dengan konsep "Gadang" yang berarti besar dalam bahasa Minang, kami 
                    menghadirkan porsi yang memuaskan dan pelayanan yang ramah untuk 
                    setiap tamu yang datang. Bergabunglah dengan keluarga besar Gadang Barubah 
                    dan rasakan kehangatan tradisi Minangkabau.
                  </p>
                  <p>
                    Dari outlet hingga layanan catering, kami siap melayani berbagai kebutuhan 
                    kuliner Anda dengan kualitas terjamin dan harga yang bersahabat.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            {/* Continue Button */}
            <div className="pt-8">
              <Button
                onClick={handleContinue}
                size="lg"
                className="text-lg px-8 py-6 hover-elevate group"
                data-testid="button-continue"
              >
                Lanjut Cari Tau Gadang Barubah
                <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </main>
        
        {/* Footer */}
        <footer className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 Gadang Barubah - Pengalaman Kuliner yang Tak Terlupakan
          </p>
        </footer>
      </div>
    </div>
  );
}