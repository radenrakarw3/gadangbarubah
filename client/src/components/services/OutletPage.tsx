import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Clock, Phone } from 'lucide-react';
import Header from '../Header';

export default function OutletPage() {

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
    <div className="min-h-[100svh] supports-[height:100dvh]:min-h-[100dvh] bg-background">
      <Header showBackButton={true} backPath="/uni" />

      <main className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-serif font-medium text-foreground mb-4">
              Outlet Eksklusif Kami
            </h1>
            <div className="w-24 h-px bg-primary mx-auto mb-6"></div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Kunjungi lokasi premium kami untuk pengalaman bersantap yang tak terlupakan
            </p>
          </div>

          {/* Outlets Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {outlets.map((outlet, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 border-border/50">
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/10">
                      <span className="text-2xl">{outlet.image}</span>
                    </div>
                    <h3 className="text-xl font-serif font-medium text-foreground">{outlet.name}</h3>
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
                  
                  <Button className="w-full mt-6" variant="outline" data-testid={`button-visit-${index}`}>
                    Kunjungi Outlet
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Additional Info */}
          <Card className="bg-accent/20 border-accent/30">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-serif font-medium text-foreground mb-6">
                Fasilitas Premium
              </h3>
              <div className="w-16 h-px bg-primary mx-auto mb-8"></div>
              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
                <div className="space-y-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto border border-primary/20">
                    <span className="text-xl">🅿️</span>
                  </div>
                  <p className="text-sm text-muted-foreground font-medium">Valet Parking</p>
                </div>
                <div className="space-y-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto border border-primary/20">
                    <span className="text-xl">📶</span>
                  </div>
                  <p className="text-sm text-muted-foreground font-medium">WiFi Premium</p>
                </div>
                <div className="space-y-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto border border-primary/20">
                    <span className="text-xl">❄️</span>
                  </div>
                  <p className="text-sm text-muted-foreground font-medium">AC Premium</p>
                </div>
                <div className="space-y-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto border border-primary/20">
                    <span className="text-xl">🏆</span>
                  </div>
                  <p className="text-sm text-muted-foreground font-medium">Certified Excellence</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}