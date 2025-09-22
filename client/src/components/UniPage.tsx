import { useState } from 'react';
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
    color: 'from-red-500 to-red-600',
    bgColor: 'bg-red-50 dark:bg-red-950/30',
    emoji: '🏪'
  },
  {
    id: 'delivery',
    name: 'Pesan Antar',
    icon: Truck,
    description: 'Pesan makanan favorit Anda dan kami antar langsung ke rumah dengan cepat, aman, dan tetap hangat. Delivery tersedia 24/7 di area coverage kami.',
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-950/30',
    emoji: '🚚'
  },
  {
    id: 'partnership',
    name: 'Kemitraan',
    icon: Handshake,
    description: 'Bergabung sebagai mitra bisnis dan kembangkan usaha kuliner bersama Gadang Barubah. Dapatkan dukungan penuh dari sistem dan brand yang terpercaya.',
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-green-50 dark:bg-green-950/30',
    emoji: '🤝'
  },
  {
    id: 'membership',
    name: 'Membership',
    icon: Crown,
    description: 'Dapatkan benefit eksklusif dengan menjadi member Gadang Barubah. Nikmati diskon hingga 20%, promo khusus, dan poin reward setiap pembelian.',
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-50 dark:bg-purple-950/30',
    emoji: '👑'
  },
  {
    id: 'catering',
    name: 'Catering & Event',
    icon: UtensilsCrossed,
    description: 'Layanan catering untuk acara spesial Anda mulai dari 50-1000 porsi. Kami siap melayani wedding, corporate event, dan acara besar lainnya.',
    color: 'from-orange-500 to-orange-600',
    bgColor: 'bg-orange-50 dark:bg-orange-950/30',
    emoji: '🍽️'
  }
];

export default function UniPage() {
  const [, navigate] = useLocation();
  const [selectedService, setSelectedService] = useState<string | null>('outlet');
  const [mascotMessage, setMascotMessage] = useState('Halo! Saya Uni dari Gadang Barubah. Mari jelajahi layanan terbaik kami. Pilih salah satu dan saya akan jelaskan lebih detail!');

  const handleBack = () => {
    navigate('/');
  };

  const handleServiceClick = (service: typeof services[0]) => {
    setSelectedService(service.id);
    setMascotMessage(service.description);
    console.log(`Selected service: ${service.name}`);
  };

  const selectedServiceData = services.find(s => s.id === selectedService) || services[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/98 to-background/95 relative overflow-hidden">
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
        {/* Enhanced Header */}
        <header className="flex-shrink-0 px-6 py-4 bg-card/50 backdrop-blur-sm border-b border-border/50" data-testid="header-section">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Button
              onClick={handleBack}
              variant="ghost"
              className="hover-elevate rounded-full px-6 py-3 transition-all duration-300"
              data-testid="button-back"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              <span className="font-medium">Kembali</span>
            </Button>
            
            <div className="flex-1 flex justify-center">
              <div className="scale-75 lg:scale-100">
                <Logo />
              </div>
            </div>
            
            <div className="w-24"></div> {/* Spacer for balance */}
          </div>
        </header>
        
        {/* Main content area */}
        <main className="flex-1 px-4 py-6">
          <div className="max-w-7xl mx-auto">
            {/* Title Section */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm mb-4">
                <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                <span className="text-sm font-medium text-primary">Layanan Uni</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                Pilih Layanan Anda
              </h1>
              <p className="text-muted-foreground text-lg">
                Uni siap membantu Anda dengan berbagai layanan terbaik
              </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
              {/* Mascot Section */}
              <div className="xl:col-span-3 flex flex-col items-center justify-center order-2 xl:order-1">
                <div className="w-full max-w-2xl">
                  <Mascot 
                    isAnimating={selectedService !== null}
                    message={mascotMessage}
                  />
                  
                  {/* Service Info Card */}
                  {selectedService && (
                    <Card className={`mt-6 ${selectedServiceData.bgColor} border-2 border-primary/20 shadow-xl`}>
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4 mb-4">
                          <div className={`p-3 rounded-2xl bg-gradient-to-r ${selectedServiceData.color} text-white shadow-lg`}>
                            <selectedServiceData.icon className="h-6 w-6" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-foreground flex items-center space-x-2">
                              <span>{selectedServiceData.emoji}</span>
                              <span>{selectedServiceData.name}</span>
                            </h3>
                          </div>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                          {selectedServiceData.description}
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
              
              {/* Service Buttons Section */}
              <div className="xl:col-span-2 space-y-6 order-1 xl:order-2">
                <div className="sticky top-6">
                  <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-xl">
                    <h2 className="text-2xl font-bold text-foreground mb-2 text-center xl:text-left">
                      Layanan Kami
                    </h2>
                    <p className="text-muted-foreground mb-6 text-center xl:text-left">
                      Klik untuk mengetahui lebih detail
                    </p>
                    
                    <div className="space-y-3">
                      {services.map((service) => {
                        const IconComponent = service.icon;
                        const isSelected = selectedService === service.id;
                        
                        return (
                          <Card 
                            key={service.id} 
                            className={`transition-all duration-300 hover:shadow-lg ${
                              isSelected 
                                ? 'ring-2 ring-primary ring-offset-2 shadow-lg scale-[1.02]' 
                                : 'hover:shadow-md hover:scale-[1.01]'
                            }`}
                          >
                            <CardContent className="p-0">
                              <Button
                                onClick={() => handleServiceClick(service)}
                                className={`w-full h-auto py-4 px-4 justify-start text-left rounded-lg transition-all duration-300 ${
                                  isSelected 
                                    ? 'bg-gradient-to-r ' + service.color + ' text-white shadow-lg' 
                                    : 'hover:bg-accent/50'
                                }`}
                                variant="ghost"
                                data-testid={`button-service-${service.id}`}
                              >
                                <div className="flex items-center space-x-4 w-full">
                                  <div className={`p-3 rounded-xl flex-shrink-0 transition-all duration-300 ${
                                    isSelected 
                                      ? 'bg-white/20 text-white' 
                                      : `bg-gradient-to-r ${service.color} text-white`
                                  }`}>
                                    <IconComponent className="h-5 w-5" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className={`font-semibold text-sm lg:text-base transition-colors duration-300 ${
                                      isSelected ? 'text-white' : 'text-foreground'
                                    }`}>
                                      <span className="mr-2">{service.emoji}</span>
                                      {service.name}
                                    </div>
                                  </div>
                                  {isSelected && (
                                    <div className="flex-shrink-0">
                                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                    </div>
                                  )}
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
            </div>
          </div>
        </main>
        
        {/* Enhanced Footer */}
        <footer className="flex-shrink-0 py-6 text-center border-t border-border/30 bg-card/30 backdrop-blur-sm">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground font-medium">
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