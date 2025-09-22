import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight, Sparkles } from 'lucide-react';
import Logo from './Logo';

export default function WelcomePage() {
  const [, navigate] = useLocation();

  const handleContinue = () => {
    navigate('/uni');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/98 to-background/95 relative overflow-hidden">
      {/* Enhanced floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-primary/40 rounded-full animate-ping animation-delay-1000"></div>
        <div className="absolute top-32 right-16 w-1 h-1 bg-accent/50 rounded-full animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-40 left-20 w-3 h-3 bg-primary/30 rounded-full animate-bounce animation-delay-500"></div>
        <div className="absolute top-1/2 right-8 w-2 h-2 bg-accent/40 rounded-full animate-ping animation-delay-3000"></div>
        <div className="absolute bottom-20 right-1/3 w-1 h-1 bg-primary/50 rounded-full animate-pulse"></div>
      </div>
      
      {/* Gradient overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent"></div>
      
      {/* Main content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header with Logo */}
        <header className="flex-shrink-0 pt-8 pb-4" data-testid="header-section">
          <Logo />
        </header>
        
        {/* Main content area */}
        <main className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="max-w-5xl mx-auto text-center space-y-12">
            {/* Enhanced Welcome Title */}
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
                <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                <span className="text-sm font-medium text-primary">Selamat Datang</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-foreground via-foreground to-primary/80 bg-clip-text text-transparent leading-tight">
                Gadang Barubah
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground font-light max-w-2xl mx-auto">
                Cita Rasa Autentik Minangkabau dengan Sentuhan Modern
              </p>
            </div>
            
            {/* Enhanced About Us Card */}
            <Card className="max-w-4xl mx-auto shadow-2xl border-primary/10 bg-card/80 backdrop-blur-sm">
              <CardContent className="p-8 md:p-12">
                <div className="flex items-center justify-center mb-8">
                  <div className="h-1 w-16 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full"></div>
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8 flex items-center justify-center space-x-3">
                  <span className="text-primary text-4xl">✨</span>
                  <span>Tentang Kami</span>
                  <span className="text-primary text-4xl">✨</span>
                </h2>
                
                <div className="grid md:grid-cols-3 gap-8 mb-8">
                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                      <span className="text-2xl">🏪</span>
                    </div>
                    <h3 className="font-semibold text-lg">Kualitas Terjamin</h3>
                    <p className="text-sm text-muted-foreground">
                      Menu autentik dengan bahan berkualitas tinggi
                    </p>
                  </div>
                  
                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                      <span className="text-2xl">❤️</span>
                    </div>
                    <h3 className="font-semibold text-lg">Pelayanan Ramah</h3>
                    <p className="text-sm text-muted-foreground">
                      Kehangatan tradisi Minangkabau di setiap pelayanan
                    </p>
                  </div>
                  
                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                      <span className="text-2xl">🍽️</span>
                    </div>
                    <h3 className="font-semibold text-lg">Porsi Memuaskan</h3>
                    <p className="text-sm text-muted-foreground">
                      Porsi "Gadang" dengan harga bersahabat
                    </p>
                  </div>
                </div>
                
                <div className="prose prose-lg max-w-none text-center">
                  <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                    Gadang Barubah menghadirkan destinasi kuliner yang memadukan 
                    <span className="text-primary font-semibold"> cita rasa tradisional Minangkabau</span> 
                    dengan inovasi modern untuk menciptakan pengalaman makan yang tak terlupakan.
                  </p>
                  
                  <p className="text-base text-muted-foreground/80 leading-relaxed">
                    Dari outlet hingga layanan catering, kami berkomitmen memberikan yang terbaik 
                    untuk setiap momen spesial Anda. Bergabunglah dengan keluarga besar Gadang Barubah 
                    dan rasakan keistimewaan kuliner Nusantara.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            {/* Enhanced Continue Button */}
            <div className="pt-4">
              <div className="flex flex-col items-center space-y-4">
                <Button
                  onClick={handleContinue}
                  size="lg"
                  className="text-lg px-12 py-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary group relative overflow-hidden"
                  data-testid="button-continue"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  <span className="relative z-10 font-semibold">Lanjut Cari Tau Gadang Barubah</span>
                  <ChevronRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform duration-300 relative z-10" />
                </Button>
                
                <p className="text-sm text-muted-foreground/80 animate-pulse">
                  Temui Uni dan jelajahi layanan kami
                </p>
              </div>
            </div>
          </div>
        </main>
        
        {/* Enhanced Footer */}
        <footer className="flex-shrink-0 py-8 text-center">
          <div className="space-y-2">
            <div className="h-px w-32 bg-gradient-to-r from-transparent via-border to-transparent mx-auto mb-4"></div>
            <p className="text-sm text-muted-foreground font-medium">
              © 2025 Gadang Barubah
            </p>
            <p className="text-xs text-muted-foreground/60">
              Pengalaman Kuliner yang Tak Terlupakan
            </p>
          </div>
        </footer>
      </div>
      
      <style dangerouslySetInnerHTML={{
        __html: `
          .animation-delay-500 { animation-delay: 0.5s; }
          .animation-delay-1000 { animation-delay: 1s; }
          .animation-delay-2000 { animation-delay: 2s; }
          .animation-delay-3000 { animation-delay: 3s; }
        `
      }} />
    </div>
  );
}