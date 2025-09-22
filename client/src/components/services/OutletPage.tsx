import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, MapPin, Clock, Phone } from 'lucide-react';
import Logo from '../Logo';

export default function OutletPage() {
  const [, navigate] = useLocation();

  const handleBack = () => {
    navigate('/uni');
  };

  const outlets = [
    {
      name: "Gadang Barubah Pusat",
      address: "Jl. Raya Padang No. 123, Padang",
      phone: "0751-123456",
      hours: "08:00 - 22:00",
      image: "🏪"
    },
    {
      name: "Gadang Barubah Mall",
      address: "Mall Plaza Andalas Lt. 2, Padang",
      phone: "0751-654321", 
      hours: "10:00 - 21:00",
      image: "🏬"
    },
    {
      name: "Gadang Barubah Express",
      address: "Jl. Sudirman No. 456, Bukittinggi",
      phone: "0752-987654",
      hours: "24 Jam",
      image: "⚡"
    }
  ];

  return (
    <div className="min-h-[100svh] supports-[height:100dvh]:min-h-[100dvh] bg-gradient-to-br from-background via-background/98 to-background/95 relative overflow-x-clip overflow-y-auto">
      {/* Header */}
      <header className="bg-card/50 backdrop-blur-sm border-b border-border/50 py-3 px-4" data-testid="header-section">
        <div className="max-w-4xl mx-auto flex items-center space-x-4">
          <Button
            onClick={handleBack}
            variant="ghost"
            size="sm"
            className="hover-elevate"
            data-testid="button-back"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1 flex justify-center">
            <div className="scale-50 origin-center">
              <Logo />
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center justify-center space-x-2">
              <span className="text-4xl">🏪</span>
              <span>Outlet Gadang Barubah</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Kunjungi outlet kami untuk pengalaman makan langsung
            </p>
          </div>

          {/* Outlets Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {outlets.map((outlet, index) => (
              <Card key={index} className="hover-elevate transition-all duration-300">
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-2">{outlet.image}</div>
                    <h3 className="text-xl font-bold text-foreground">{outlet.name}</h3>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <MapPin className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                      <p className="text-sm text-muted-foreground">{outlet.address}</p>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                      <p className="text-sm text-muted-foreground">{outlet.phone}</p>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Clock className="h-4 w-4 text-primary flex-shrink-0" />
                      <p className="text-sm text-muted-foreground">{outlet.hours}</p>
                    </div>
                  </div>
                  
                  <Button className="w-full mt-4 hover-elevate" data-testid={`button-visit-${index}`}>
                    Kunjungi Outlet
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Additional Info */}
          <Card className="mt-8 bg-primary/10 border-primary/20">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-bold text-foreground mb-4">
                🍽️ Fasilitas di Outlet Kami
              </h3>
              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <div className="text-2xl">🅿️</div>
                  <p className="text-sm text-muted-foreground">Parkir Gratis</p>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl">📶</div>
                  <p className="text-sm text-muted-foreground">WiFi Gratis</p>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl">❄️</div>
                  <p className="text-sm text-muted-foreground">AC Sejuk</p>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl">🛡️</div>
                  <p className="text-sm text-muted-foreground">Protokol Kesehatan</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}