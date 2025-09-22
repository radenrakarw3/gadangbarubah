import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Store, Truck, Handshake, Crown, UtensilsCrossed, Sparkles } from 'lucide-react';
import Logo from './Logo';
import Mascot from './Mascot';

const services = [
  {
    id: 'outlet',
    name: 'Outlet Gadang Barubah',
    icon: Store,
    description: 'Kunjungi outlet kami dan nikmati pengalaman makan langsung dengan suasana yang nyaman, menu lengkap, dan pelayanan terbaik dari tim kami yang ramah.',
    path: '/services/outlet',
    color: 'from-red-500 to-red-600',
    bgColor: 'bg-red-50 dark:bg-red-950/30',
    emoji: '🏪'
  },
  {
    id: 'delivery',
    name: 'Pesan Antar',
    icon: Truck,
    description: 'Pesan makanan favorit Anda dan kami antar langsung ke rumah dengan cepat, aman, dan tetap hangat. Delivery tersedia 24/7 di area coverage kami.',
    path: '/services/delivery',
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-950/30',
    emoji: '🚚'
  },
  {
    id: 'partnership',
    name: 'Kemitraan',
    icon: Handshake,
    description: 'Bergabung sebagai mitra bisnis dan kembangkan usaha kuliner bersama Gadang Barubah. Dapatkan dukungan penuh dari sistem dan brand yang terpercaya.',
    path: '/services/partnership',
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-green-50 dark:bg-green-950/30',
    emoji: '🤝'
  },
  {
    id: 'membership',
    name: 'Membership',
    icon: Crown,
    description: 'Dapatkan benefit eksklusif dengan menjadi member Gadang Barubah. Nikmati diskon hingga 20%, promo khusus, dan poin reward setiap pembelian.',
    path: '/services/membership',
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-50 dark:bg-purple-950/30',
    emoji: '👑'
  },
  {
    id: 'catering',
    name: 'Catering & Event',
    icon: UtensilsCrossed,
    description: 'Layanan catering untuk acara spesial Anda mulai dari 50-1000 porsi. Kami siap melayani wedding, corporate event, dan acara besar lainnya.',
    path: '/services/catering',
    color: 'from-orange-500 to-orange-600',
    bgColor: 'bg-orange-50 dark:bg-orange-950/30',
    emoji: '🍽️'
  }
];

export default function UniPage() {
  const [, navigate] = useLocation();

  const handleBack = () => {
    navigate('/');
  };

  const handleServiceClick = (service: typeof services[0]) => {
    navigate(service.path);
    console.log(`Navigating to: ${service.name}`);
  };

  return (
    <div className="min-h-[100svh] supports-[height:100dvh]:min-h-[100dvh] bg-gradient-to-br from-background via-background/98 to-background/95 relative overflow-x-clip overflow-y-auto">
      {/* Enhanced floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-primary/40 rounded-full animate-ping animation-delay-1000"></div>
        <div className="absolute top-32 right-16 w-1 h-1 bg-accent/50 rounded-full animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-40 left-20 w-3 h-3 bg-primary/30 rounded-full animate-bounce animation-delay-500"></div>
        <div className="absolute top-1/2 right-8 w-2 h-2 bg-accent/40 rounded-full animate-ping animation-delay-3000"></div>
        <div className="absolute bottom-20 right-1/3 w-1 h-1 bg-primary/50 rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 left-1/4 w-1 h-1 bg-primary/40 rounded-full animate-bounce animation-delay-1500"></div>
      </div>
      
      {/* Gradient overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-transparent"></div>
      
      {/* Main content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Compact Mobile Header */}
        <header className="flex-shrink-0 bg-card/50 backdrop-blur-sm border-b border-border/50 py-2 md:py-3 px-4" data-testid="header-section">
          <div className="max-w-4xl mx-auto flex items-center space-x-3">
            <Button
              onClick={handleBack}
              variant="ghost"
              size="sm"
              className="hover-elevate p-2 md:px-3 md:py-2"
              data-testid="button-back"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline ml-1">Kembali</span>
            </Button>
            
            <div className="flex-1 flex justify-center">
              <div className="scale-50 md:scale-60 origin-center transform -my-4 md:-my-3">
                <Logo />
              </div>
            </div>
            
            <div className="w-16 md:w-20"></div> {/* Spacer for balance */}
          </div>
        </header>
        
        {/* Main content area */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-4 md:py-6">
          <div className="max-w-4xl mx-auto">
            {/* Title Section */}
            <div className="text-center mb-6 md:mb-8">
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm mb-3 md:mb-4">
                <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                <span className="text-xs md:text-sm font-medium text-primary">Layanan Uni</span>
              </div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2">
                Pilih Layanan Anda
              </h1>
              <p className="text-sm md:text-base text-muted-foreground">
                Uni siap membantu Anda dengan berbagai layanan terbaik
              </p>
            </div>

            {/* Mascot Section - Now on top */}
            <div className="flex flex-col items-center justify-center mb-6 md:mb-8">
              <div className="w-full max-w-lg">
                <Mascot 
                  isAnimating={false}
                  message="Halo! Saya Uni dari Gadang Barubah. Silakan pilih layanan yang Anda butuhkan. Saya akan membawa Anda ke halaman yang tepat!"
                />
              </div>
            </div>
            
            {/* Service Buttons Section - Now below mascot */}
            <div className="w-full">
              <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-4 md:p-6 border border-border/50 shadow-xl">
                <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2 text-center">
                  Layanan Kami
                </h2>
                <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6 text-center">
                  Klik untuk masuk ke halaman layanan
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  {services.map((service) => {
                    const IconComponent = service.icon;
                    
                    return (
                      <Card 
                        key={service.id} 
                        className="hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
                      >
                        <CardContent className="p-0">
                          <Button
                            onClick={() => handleServiceClick(service)}
                            className="w-full h-auto py-3 md:py-4 px-4 justify-start text-left rounded-lg bg-gradient-to-r from-background to-background/50 hover:from-accent/20 hover:to-accent/10 transition-all duration-300"
                            variant="ghost"
                            data-testid={`button-service-${service.id}`}
                          >
                            <div className="flex items-center space-x-3 md:space-x-4 w-full">
                              <div className={`p-2 md:p-3 rounded-xl flex-shrink-0 bg-gradient-to-r ${service.color} text-white shadow-md`}>
                                <IconComponent className="h-4 w-4 md:h-5 md:w-5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-semibold text-sm md:text-base text-foreground break-words">
                                  <span className="mr-2">{service.emoji}</span>
                                  {service.name}
                                </div>
                              </div>
                              <div className="flex-shrink-0">
                                <ArrowLeft className="h-4 w-4 text-muted-foreground rotate-180" />
                              </div>
                            </div>
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </main>
        
        {/* Compact Footer */}
        <footer className="flex-shrink-0 py-3 md:py-4 text-center border-t border-border/30 bg-card/30 backdrop-blur-sm pb-[env(safe-area-inset-bottom)]">
          <div className="space-y-1">
            <p className="text-xs md:text-sm text-muted-foreground font-medium">
              © 2025 Gadang Barubah
            </p>
            <p className="text-xs text-muted-foreground/60">
              Melayani Dengan Sepenuh Hati
            </p>
          </div>
        </footer>
      </div>
      
      <style dangerouslySetInnerHTML={{
        __html: `
          .animation-delay-500 { animation-delay: 0.5s; }
          .animation-delay-1000 { animation-delay: 1s; }
          .animation-delay-1500 { animation-delay: 1.5s; }
          .animation-delay-2000 { animation-delay: 2s; }
          .animation-delay-3000 { animation-delay: 3s; }
        `
      }} />
    </div>
  );
}