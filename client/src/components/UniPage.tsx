import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Store, Truck, Handshake, Crown, UtensilsCrossed, ArrowRight, ArrowLeft, ShoppingBag } from 'lucide-react';
import Logo from './Logo';
import Mascot from './Mascot';
import restaurantBgImage from '@assets/DSC03165_1758566711557.jpg';
import rendangKiloanImage from '@assets/DSC02799_1758569186868.jpg';

const services = [
  {
    id: 'outlet',
    name: 'Outlet Location',
    icon: Store,
    description: 'Kunjungi lokasi outlet premium kami dengan suasana mewah, VIP room eksklusif, dan pengalaman kuliner yang tak terlupakan.',
    path: '/services/outlet'
  },
  {
    id: 'delivery',
    name: 'Premium Delivery',
    icon: Truck,
    description: 'Nikmati kelezatan hidangan berkualitas restoran langsung di rumah Anda dengan layanan antar yang menjaga cita rasa.',
    path: '/services/delivery'
  },
  {
    id: 'partnership',
    name: 'Business Partnership',
    icon: Handshake,
    description: 'Bergabunglah dalam ekosistem kuliner premium kami dengan program kemitraan yang memberikan keuntungan berkelanjutan.',
    path: '/services/partnership'
  },
  {
    id: 'membership',
    name: 'VIP Membership',
    icon: Crown,
    description: 'Dapatkan akses eksklusif ke benefit istimewa, reservasi prioritas, dan pengalaman kuliner yang dipersonalisasi.',
    path: '/services/membership'
  },
  {
    id: 'catering',
    name: 'Event Catering',
    icon: UtensilsCrossed,
    description: 'Wujudkan acara istimewa Anda dengan layanan katering premium yang menciptakan momen tak terlupakan.',
    path: '/services/catering'
  }
];

export default function UniPage() {
  const [, navigate] = useLocation();

  const handleServiceClick = (service: typeof services[0]) => {
    // Services that redirect to WhatsApp
    const whatsAppServices = ['delivery', 'partnership', 'catering'];
    const whatsAppNumber = '6289509766739'; // format untuk WhatsApp API (62 untuk Indonesia + nomor tanpa 0)
    
    if (whatsAppServices.includes(service.id)) {
      const message = encodeURIComponent(`Halo, saya tertarik dengan layanan ${service.name} dari Gadang Barubah. Mohon informasi lebih lanjut.`);
      const whatsAppUrl = `https://api.whatsapp.com/send?phone=${whatsAppNumber}&text=${message}`;
      window.open(whatsAppUrl, '_blank');
    } else {
      // Navigate to individual pages for other services
      navigate(service.path);
    }
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
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-serif font-light text-foreground mb-6">
              Layanan Eksklusif
            </h1>
            <div className="w-32 h-px bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-8"></div>
            
          </div>
          
          {/* Mascot Section with Background */}
          <div 
            className="relative rounded-2xl overflow-hidden bg-cover bg-center shadow-2xl mb-16"
            style={{ backgroundImage: `url(${restaurantBgImage})` }}
          >
            <div className="absolute inset-0 bg-black/40"></div>
            <div className="relative z-10 p-8 sm:p-12 text-center">
              <div className="max-w-2xl mx-auto">
                <Mascot 
                  isAnimating={false}
                  message="Selamat datang di Gadang Barubah! Saya Uni, siap membantu Anda menemukan pengalaman kuliner terbaik."
                />
              </div>
            </div>
          </div>
          
          {/* Services Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {services.map((service) => {
              const IconComponent = service.icon;
              
              return (
                <Card 
                  key={service.id} 
                  className="group cursor-pointer hover:shadow-xl transition-all duration-500 border-border/30 hover:border-primary/30 bg-gradient-to-br from-background to-muted/10 hover-elevate"
                  onClick={() => handleServiceClick(service)}
                >
                  <CardContent className="p-8">
                    <div className="flex items-start space-x-6">
                      <div className="flex-shrink-0">
                        <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl flex items-center justify-center border border-primary/20 group-hover:from-primary/20 group-hover:to-primary/10 transition-all duration-300">
                          <IconComponent className="h-8 w-8 text-primary" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-serif text-xl font-medium text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                          {service.name}
                        </h3>
                        <p className="text-base text-muted-foreground leading-relaxed mb-6">
                          {service.description}
                        </p>
                        <div className="flex items-center text-primary font-medium text-sm group-hover:translate-x-2 transition-transform duration-300">
                          <span>Lihat Detail</span>
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Rendang Kiloan Promo */}
          <div className="max-w-2xl mx-auto mb-16">
            <Card className="overflow-hidden border-border/30 shadow-lg bg-gradient-to-br from-background to-muted/5 hover-elevate hover:shadow-xl transition-all duration-500">
              <CardContent className="p-0">
                <div className="flex items-center">
                  {/* Image Section - 1:1 ratio */}
                  <div className="w-32 h-32 flex-shrink-0">
                    <img 
                      src={rendangKiloanImage}
                      alt="Rendang Kiloan Gadang Barubah - packaging premium dengan rendang segar"
                      className="w-full h-full object-cover"
                      data-testid="img-rendang-kiloan"
                    />
                  </div>
                  
                  {/* Content Section */}
                  <div className="flex-1 p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <ShoppingBag className="h-5 w-5 text-primary mr-2" />
                          <h3 className="font-serif text-lg font-medium text-foreground">
                            Rendang Kiloan
                          </h3>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                          Nikmati kelezatan rendang premium dalam kemasan praktis untuk keluarga
                        </p>
                        <div className="text-xs text-primary/70 font-medium">
                          ✨ Rasa otentik • Kemasan premium • Tahan lama
                        </div>
                      </div>
                      
                      <Button 
                        size="sm"
                        className="ml-4"
                        asChild
                        data-testid="button-order-rendang"
                      >
                        <a
                          href={`https://api.whatsapp.com/send?phone=6289509766739&text=${encodeURIComponent('Halo, saya tertarik untuk memesan Rendang Kiloan Gadang Barubah. Mohon informasi harga dan ketersediaan.')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Order
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-border/20 py-12 text-center">
        <div className="max-w-5xl mx-auto px-4">
          <div className="space-y-3">
            <p className="text-base text-muted-foreground font-medium">
              © 2025 Gadang Barubah
            </p>
            <p className="text-sm text-muted-foreground/70">
              Keunggulan Kuliner yang Tak Tertandingi
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}