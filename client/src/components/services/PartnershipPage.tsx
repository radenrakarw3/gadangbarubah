import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Handshake, TrendingUp, Shield, Users } from 'lucide-react';
import Header from '../Header';

export default function PartnershipPage() {

  const benefits = [
    {
      icon: TrendingUp,
      title: "ROI Menguntungkan",
      description: "Return investasi hingga 25% per tahun dengan sistem bisnis yang terbukti"
    },
    {
      icon: Shield,
      title: "Brand Terpercaya",
      description: "Bergabung dengan brand yang sudah dikenal luas di Sumatera Barat"
    },
    {
      icon: Users,
      title: "Support Penuh",
      description: "Training, marketing support, dan konsultasi bisnis berkelanjutan"
    }
  ];

  const packages = [
    {
      name: "Franchise Outlet",
      investment: "Rp 150-300 juta",
      features: ["Outlet lengkap", "Training 2 minggu", "Marketing kit", "Support 1 tahun"],
      color: "border-blue-200 bg-blue-50 dark:bg-blue-950/30"
    },
    {
      name: "Food Truck Partner",
      investment: "Rp 75-150 juta", 
      features: ["Mobile unit", "Training 1 minggu", "Route planning", "Support 6 bulan"],
      color: "border-green-200 bg-green-50 dark:bg-green-950/30"
    },
    {
      name: "Kiosk Express",
      investment: "Rp 50-100 juta",
      features: ["Kiosk compact", "Training online", "Starter kit", "Support 3 bulan"],
      color: "border-orange-200 bg-orange-50 dark:bg-orange-950/30"
    }
  ];

  return (
    <div className="min-h-[100svh] supports-[height:100dvh]:min-h-[100dvh] bg-background">
      <Header showBackButton={true} backPath="/uni" />

      <main className="px-4 sm:px-6 lg:px-8 py-8 pt-20">
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-serif font-medium text-foreground mb-4">
              Program Kemitraan Eksklusif
            </h1>
            <div className="w-24 h-px bg-primary mx-auto mb-6"></div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Bergabunglah dengan jaringan mitra terpilih dalam mengembangkan bisnis kuliner premium
            </p>
          </div>

          {/* Benefits */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-center mb-6">Keuntungan Bermitra</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {benefits.map((benefit, index) => {
                const IconComponent = benefit.icon;
                return (
                  <Card key={index} className="hover-elevate transition-all duration-300 text-center">
                    <CardContent className="p-6">
                      <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <IconComponent className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-2">{benefit.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{benefit.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Partnership Packages */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-center mb-6">Paket Kemitraan</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {packages.map((pkg, index) => (
                <Card key={index} className={`hover-elevate transition-all duration-300 ${pkg.color} border-2`}>
                  <CardContent className="p-6">
                    <div className="text-center mb-4">
                      <h3 className="text-xl font-bold text-foreground mb-2">{pkg.name}</h3>
                      <div className="text-2xl font-bold text-primary">{pkg.investment}</div>
                    </div>
                    
                    <ul className="space-y-2 mb-6">
                      {pkg.features.map((feature, fIndex) => (
                        <li key={fIndex} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button className="w-full hover-elevate" data-testid={`button-package-${index}`}>
                      Pilih Paket
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <Card className="bg-primary/10 border-primary/20">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-center mb-6 flex items-center justify-center space-x-2">
                <Handshake className="h-5 w-5" />
                <span>Tertarik Bermitra?</span>
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Hubungi Tim Kemitraan:</h4>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>📞 WhatsApp: 0811-2233-4455</p>
                      <p>📧 Email: partnership@gadangbarubah.com</p>
                      <p>🏢 Office: Jl. M. Hatta No. 789, Padang</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Jam Konsultasi:</h4>
                    <p className="text-sm text-muted-foreground">Senin - Jumat: 09:00 - 17:00 WIB</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Button size="lg" className="w-full hover-elevate" data-testid="button-consultation">
                    Konsultasi Gratis
                  </Button>
                  <Button variant="outline" size="lg" className="w-full hover-elevate" data-testid="button-download-proposal">
                    Download Proposal
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}