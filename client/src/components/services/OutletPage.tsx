import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Clock, Phone, ArrowLeft, Store } from 'lucide-react';
import Logo from '../Logo';

export default function OutletPage() {
  const [, navigate] = useLocation();

  const locations = [
    {
      name: "Gadang Barubah Flagship",
      address: "Jl. Raya Padang No. 123, Padang",
      phone: "0751-123456",
      hours: "08:00 - 22:00",
      icon: Store,
      type: "Flagship Restaurant",
      description: "Pengalaman dining premium dengan menu signature lengkap dan private dining room."
    },
    {
      name: "Gadang Barubah Plaza",
      address: "Mall Plaza Andalas Lt. 2, Padang",
      phone: "0751-654321", 
      hours: "10:00 - 21:00",
      icon: Store,
      type: "Contemporary Dining",
      description: "Suasana modern dengan konsep open kitchen dan live cooking experience."
    },
    {
      name: "Gadang Barubah Express",
      address: "Jl. Sudirman No. 456, Bukittinggi",
      phone: "0752-987654",
      hours: "24 Jam",
      icon: Clock,
      type: "Quick Fine Dining",
      description: "Layanan 24 jam dengan kualitas premium untuk kenyamanan Anda kapan saja."
    }
  ];

  return (
    <div className="min-h-[100svh] supports-[height:100dvh]:min-h-[100dvh] bg-background">
      {/* Top section with back button and logo */}
      <div className="px-4 pt-8 pb-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Button
            onClick={() => navigate('/uni')}
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
      
      <main className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-serif font-light text-foreground mb-6">
              Dining Experience
            </h1>
            <div className="w-32 h-px bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-8"></div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light">
              Temukan pengalaman bersantap eksklusif di lokasi premium kami dengan suasana mewah dan menu signature yang tak terlupakan
            </p>
          </div>

          {/* Locations Grid */}
          <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {locations.map((location, index) => {
              const LocationIcon = location.icon;
              return (
                <Card 
                  key={index} 
                  className="group hover:shadow-xl transition-all duration-500 border-border/30 hover:border-primary/30 bg-gradient-to-br from-background to-muted/10 hover-elevate"
                >
                  <CardContent className="p-8">
                    <div className="flex items-start space-x-6">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl flex items-center justify-center border border-primary/20">
                          <LocationIcon className="h-7 w-7 text-primary" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="mb-4">
                          <h3 className="font-serif text-2xl font-medium text-foreground mb-2">
                            {location.name}
                          </h3>
                          <p className="text-sm font-medium text-primary mb-3">{location.type}</p>
                          <p className="text-base text-muted-foreground leading-relaxed mb-6">
                            {location.description}
                          </p>
                        </div>
                        
                        <div className="space-y-3 mb-6">
                          <div className="flex items-start space-x-3">
                            <MapPin className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                            <p className="text-sm text-muted-foreground">{location.address}</p>
                          </div>
                          
                          <div className="flex items-center space-x-3">
                            <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                            <p className="text-sm text-muted-foreground">{location.phone}</p>
                          </div>
                          
                          <div className="flex items-center space-x-3">
                            <Clock className="h-4 w-4 text-primary flex-shrink-0" />
                            <p className="text-sm text-muted-foreground">Buka: {location.hours}</p>
                          </div>
                        </div>
                        
                        <Button 
                          className="bg-primary hover:bg-primary/90 transition-all duration-300 px-6"
                          onClick={() => console.log(`Reservasi ${location.name}`)}
                          data-testid={`button-visit-${index}`}
                        >
                          Buat Reservasi
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Premium Experience */}
          <Card className="border-border/30 shadow-lg bg-gradient-to-br from-background to-muted/5">
            <CardContent className="p-10 text-center">
              <h3 className="text-3xl font-serif font-medium text-foreground mb-6">
                Pengalaman Premium
              </h3>
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-8"></div>
              <p className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-2xl mx-auto">
                Setiap lokasi dirancang untuk memberikan pengalaman kuliner yang tak terlupakan dengan fasilitas terbaik dan pelayanan berkelas dunia.
              </p>
              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl flex items-center justify-center mx-auto border border-primary/20">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground font-medium">Valet Parking</p>
                </div>
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl flex items-center justify-center mx-auto border border-primary/20">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground font-medium">Concierge 24/7</p>
                </div>
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl flex items-center justify-center mx-auto border border-primary/20">
                    <Store className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground font-medium">Private Dining</p>
                </div>
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl flex items-center justify-center mx-auto border border-primary/20">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground font-medium">Priority Service</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}