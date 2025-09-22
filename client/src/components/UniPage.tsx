import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Store, Truck, Handshake, Crown, UtensilsCrossed } from 'lucide-react';
import Logo from './Logo';
import Mascot from './Mascot';

const services = [
  {
    id: 'outlet',
    name: 'Outlet Gadang Barubah',
    icon: Store,
    description: 'Kunjungi outlet kami dan nikmati pengalaman makan langsung dengan suasana yang nyaman dan menu lengkap.',
    color: 'bg-red-500 hover:bg-red-600'
  },
  {
    id: 'delivery',
    name: 'Pesan Antar',
    icon: Truck,
    description: 'Pesan makanan favorit Anda dan kami antar langsung ke rumah dengan cepat dan aman.',
    color: 'bg-blue-500 hover:bg-blue-600'
  },
  {
    id: 'partnership',
    name: 'Kemitraan',
    icon: Handshake,
    description: 'Bergabung sebagai mitra bisnis dan kembangkan usaha kuliner bersama Gadang Barubah.',
    color: 'bg-green-500 hover:bg-green-600'
  },
  {
    id: 'membership',
    name: 'Membership',
    icon: Crown,
    description: 'Dapatkan benefit eksklusif dengan menjadi member Gadang Barubah. Nikmati diskon dan promo khusus.',
    color: 'bg-purple-500 hover:bg-purple-600'
  },
  {
    id: 'catering',
    name: 'Catering & Event',
    icon: UtensilsCrossed,
    description: 'Layanan catering untuk acara spesial Anda. Kami siap melayani berbagai event dengan menu pilihan.',
    color: 'bg-orange-500 hover:bg-orange-600'
  }
];

export default function UniPage() {
  const [, navigate] = useLocation();
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [mascotMessage, setMascotMessage] = useState('Halo! Saya Uni dari Gadang Barubah. Pilih layanan yang Anda butuhkan, dan saya akan membantu Anda!');

  const handleBack = () => {
    navigate('/');
  };

  const handleServiceClick = (service: typeof services[0]) => {
    setSelectedService(service.id);
    setMascotMessage(service.description);
    console.log(`Selected service: ${service.name}`);
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
        {/* Header */}
        <header className="flex items-center justify-between p-6" data-testid="header-section">
          <Button
            onClick={handleBack}
            variant="ghost"
            className="hover-elevate"
            data-testid="button-back"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Button>
          <div className="flex-1 flex justify-center">
            <div className="scale-75">
              <Logo />
            </div>
          </div>
        </header>
        
        {/* Main content area */}
        <main className="px-4 py-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Mascot Section */}
              <div className="lg:col-span-2 flex flex-col items-center justify-center">
                <Mascot 
                  isAnimating={selectedService !== null}
                  message={mascotMessage}
                />
              </div>
              
              {/* Service Buttons Section */}
              <div className="space-y-4">
                <div className="text-center lg:text-left mb-6">
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    Layanan Kami
                  </h2>
                  <p className="text-muted-foreground">
                    Pilih layanan yang Anda butuhkan
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                  {services.map((service) => {
                    const IconComponent = service.icon;
                    return (
                      <Card key={service.id} className="hover-elevate transition-all duration-200">
                        <CardContent className="p-4">
                          <Button
                            onClick={() => handleServiceClick(service)}
                            className={`w-full h-auto py-4 px-4 justify-start text-left ${
                              selectedService === service.id 
                                ? 'ring-2 ring-primary ring-offset-2' 
                                : ''
                            }`}
                            variant={selectedService === service.id ? "default" : "ghost"}
                            data-testid={`button-service-${service.id}`}
                          >
                            <div className="flex items-center space-x-3 w-full">
                              <div className={`p-2 rounded-lg ${service.color} text-white flex-shrink-0`}>
                                <IconComponent className="h-5 w-5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm lg:text-base truncate">
                                  {service.name}
                                </div>
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
        
        {/* Footer */}
        <footer className="text-center py-6">
          <p className="text-sm text-muted-foreground">
            © 2025 Gadang Barubah - Melayani Dengan Sepenuh Hati
          </p>
        </footer>
      </div>
    </div>
  );
}