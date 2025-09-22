import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Store, Truck, Handshake, Crown, UtensilsCrossed, ArrowRight, ArrowLeft } from 'lucide-react';
import Logo from './Logo';
import Mascot from './Mascot';

const services = [
  {
    id: 'outlet',
    name: 'Outlet Eksklusif',
    icon: Store,
    description: 'Kunjungi outlet premium kami untuk pengalaman bersantap langsung dengan suasana yang elegan dan menu terlengkap.',
    path: '/services/outlet',
    emoji: '🏪'
  },
  {
    id: 'delivery',
    name: 'Layanan Antar Premium',
    icon: Truck,
    description: 'Nikmati hidangan berkualitas tinggi dengan layanan antar yang cepat, aman, dan menjaga kualitas makanan.',
    path: '/services/delivery',
    emoji: '🚚'
  },
  {
    id: 'partnership',
    name: 'Program Kemitraan',
    icon: Handshake,
    description: 'Bergabunglah sebagai mitra bisnis eksklusif dengan dukungan penuh sistem dan brand terpercaya.',
    path: '/services/partnership',
    emoji: '🤝'
  },
  {
    id: 'membership',
    name: 'Member Eksklusif',
    icon: Crown,
    description: 'Nikmati privilese istimewa dengan program keanggotaan yang memberikan benefit dan layanan premium.',
    path: '/services/membership',
    emoji: '👑'
  },
  {
    id: 'catering',
    name: 'Catering & Acara',
    icon: UtensilsCrossed,
    description: 'Layanan katering premium untuk acara istimewa dengan menu berkualitas tinggi dan pelayanan terbaik.',
    path: '/services/catering',
    emoji: '🍽️'
  }
];

export default function UniPage() {
  const [, navigate] = useLocation();

  const handleServiceClick = (service: typeof services[0]) => {
    navigate(service.path);
    console.log(`Navigating to: ${service.name}`);
  };

  return (
    <div className="min-h-[100svh] supports-[height:100dvh]:min-h-[100dvh] bg-background">
      {/* Top section with back button and logo */}
      <div className="px-4 pt-8 pb-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Button
            onClick={() => navigate('/')}
            variant="ghost"
            size="sm"
            className="hover:bg-accent/10 text-muted-foreground hover:text-foreground"
            data-testid="button-back"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline ml-1 text-sm">Kembali</span>
          </Button>
          
          <div className="flex-1 flex justify-center">
            <Logo />
          </div>
          
          <div className="w-20"></div>
        </div>
      </div>
      
      {/* Main content */}
      <main className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Introduction */}
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-serif font-medium text-foreground mb-4">
              Layanan Premium Kami
            </h1>
            <div className="w-24 h-px bg-primary mx-auto mb-6"></div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Uni siap membantu Anda menjelajahi berbagai layanan unggulan yang kami tawarkan
            </p>
          </div>

          {/* Mascot Section */}
          <div className="flex justify-center mb-10">
            <div className="max-w-md">
              <Mascot 
                isAnimating={false}
                message="Selamat datang! Saya Uni, asisten pribadi Anda di Gadang Barubah. Silakan pilih layanan yang Anda inginkan, dan saya akan memandu Anda ke informasi lengkapnya."
              />
            </div>
          </div>
          
          {/* Services Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => {
              const IconComponent = service.icon;
              
              return (
                <Card 
                  key={service.id} 
                  className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20"
                >
                  <CardContent className="p-6">
                    <div className="text-center mb-4">
                      <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/10 group-hover:bg-primary/10 transition-colors">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-serif text-lg font-medium text-foreground mb-2">
                        {service.name}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                        {service.description}
                      </p>
                    </div>
                    
                    <Button
                      onClick={() => handleServiceClick(service)}
                      variant="outline"
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300"
                      data-testid={`button-service-${service.id}`}
                    >
                      <span className="mr-2">{service.emoji}</span>
                      Pelajari Selengkapnya
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Bottom Note */}
          <div className="text-center mt-12">
            <div className="bg-accent/30 rounded-lg p-6 border border-accent/20">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Catatan:</strong> Tim customer service kami siap membantu Anda 24/7 
                untuk memberikan informasi detail dan bantuan pemesanan melalui berbagai channel yang tersedia.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-border/30 py-8 text-center">
        <div className="max-w-5xl mx-auto px-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground font-medium">
              © 2025 Gadang Barubah
            </p>
            <p className="text-xs text-muted-foreground/80">
              Melayani dengan Standar Keunggulan Tertinggi
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}