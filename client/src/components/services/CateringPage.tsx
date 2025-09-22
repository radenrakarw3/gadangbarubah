import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { UtensilsCrossed, Users, Calendar, Award, ArrowLeft } from 'lucide-react';
import Logo from '../Logo';

export default function CateringPage() {
  const [, navigate] = useLocation();

  const packages = [
    {
      name: "Paket Pernikahan",
      icon: "💒",
      minOrder: "200 porsi",
      price: "Mulai Rp 35.000/porsi",
      includes: ["Menu lengkap 5 item", "Nasi putih", "Kerupuk & sambal", "Kemasan elegan", "Setup buffet"],
      color: "border-pink-200 bg-pink-50 dark:bg-pink-950/30"
    },
    {
      name: "Paket Corporate",
      icon: "🏢", 
      minOrder: "50 porsi",
      price: "Mulai Rp 25.000/porsi",
      includes: ["Menu pilihan 3 item", "Nasi putih", "Air mineral", "Lunch box", "On-time delivery"],
      color: "border-blue-200 bg-blue-50 dark:bg-blue-950/30"
    },
    {
      name: "Paket Arisan/Gathering",
      icon: "🎉",
      minOrder: "30 porsi", 
      price: "Mulai Rp 30.000/porsi",
      includes: ["Menu tradisional", "Nasi putih", "Dessert", "Peralatan makan", "Dekorasi sederhana"],
      color: "border-green-200 bg-green-50 dark:bg-green-950/30"
    }
  ];

  const menuOptions = [
    { category: "Ayam", items: ["Ayam Pop", "Ayam Gulai", "Ayam Bakar", "Rendang Ayam"] },
    { category: "Daging", items: ["Rendang Daging", "Dendeng Batokok", "Gulai Daging", "Empal Gepuk"] },
    { category: "Sayuran", items: ["Gulai Nangka", "Sayur Daun Singkong", "Terong Balado", "Lombok Ijo"] },
    { category: "Ikan", items: ["Ikan Bakar", "Gulai Ikan", "Ikan Asam Padeh", "Dendeng Ikan"] }
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
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-serif font-medium text-foreground mb-4">
              Catering & Acara Eksklusif
            </h1>
            <div className="w-24 h-px bg-primary mx-auto mb-6"></div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Sajikan pengalaman kuliner istimewa untuk setiap momen berharga Anda
            </p>
          </div>

          {/* Why Choose Us */}
          <Card className="mb-8 bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-center mb-6">Mengapa Pilih Catering Kami?</h2>
              <div className="grid md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl mb-2">⭐</div>
                  <h3 className="font-semibold text-foreground mb-1">Kualitas Terjamin</h3>
                  <p className="text-sm text-muted-foreground">Rasa autentik dengan bahan segar</p>
                </div>
                <div>
                  <div className="text-3xl mb-2">🕐</div>
                  <h3 className="font-semibold text-foreground mb-1">Tepat Waktu</h3>
                  <p className="text-sm text-muted-foreground">Pengiriman sesuai jadwal acara</p>
                </div>
                <div>
                  <div className="text-3xl mb-2">🧑‍🍳</div>
                  <h3 className="font-semibold text-foreground mb-1">Chef Berpengalaman</h3>
                  <p className="text-sm text-muted-foreground">Tim chef khusus masakan Padang</p>
                </div>
                <div>
                  <div className="text-3xl mb-2">🛡️</div>
                  <h3 className="font-semibold text-foreground mb-1">Higienis & Aman</h3>
                  <p className="text-sm text-muted-foreground">Standar kebersihan tinggi</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Catering Packages */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-center mb-6">Paket Catering</h2>
            <div className="grid lg:grid-cols-3 gap-6">
              {packages.map((pkg, index) => (
                <Card key={index} className={`hover-elevate transition-all duration-300 ${pkg.color} border-2`}>
                  <CardContent className="p-6">
                    <div className="text-center mb-4">
                      <div className="text-4xl mb-2">{pkg.icon}</div>
                      <h3 className="text-xl font-bold text-foreground mb-2">{pkg.name}</h3>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Min. Order: {pkg.minOrder}</p>
                        <p className="text-lg font-bold text-primary">{pkg.price}</p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="font-semibold text-foreground mb-2">Termasuk:</h4>
                      <ul className="space-y-1">
                        {pkg.includes.map((item, iIndex) => (
                          <li key={iIndex} className="flex items-start space-x-2">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0 mt-2"></div>
                            <span className="text-sm text-muted-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <Button className="w-full hover-elevate" data-testid={`button-package-${index}`}>
                      Pesan Paket
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Menu Options */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-center mb-6">Pilihan Menu</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {menuOptions.map((menu, index) => (
                <Card key={index} className="hover-elevate transition-all duration-300">
                  <CardContent className="p-4">
                    <h3 className="text-lg font-bold text-foreground mb-3 text-center">{menu.category}</h3>
                    <ul className="space-y-2">
                      {menu.items.map((item, iIndex) => (
                        <li key={iIndex} className="text-sm text-muted-foreground flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0"></div>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Booking Info */}
          <Card className="bg-primary/10 border-primary/20">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-center mb-6 flex items-center justify-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Cara Pesan Catering</span>
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                    <div>
                      <h4 className="font-semibold text-foreground">Konsultasi & Survey</h4>
                      <p className="text-sm text-muted-foreground">Diskusi kebutuhan dan survey lokasi</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                    <div>
                      <h4 className="font-semibold text-foreground">Pilih Menu & Paket</h4>
                      <p className="text-sm text-muted-foreground">Tentukan menu sesuai budget</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                    <div>
                      <h4 className="font-semibold text-foreground">Konfirmasi & DP</h4>
                      <p className="text-sm text-muted-foreground">Bayar DP 50% untuk booking</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
                    <div>
                      <h4 className="font-semibold text-foreground">Eksekusi Acara</h4>
                      <p className="text-sm text-muted-foreground">Tim kami siapkan everything</p>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-border/50">
                    <p className="text-sm text-muted-foreground">
                      <strong>Booking minimal H-3 untuk hasil terbaik</strong>
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-card rounded-lg p-4">
                    <h4 className="font-semibold text-foreground mb-2">Contact Catering:</h4>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>📞 WhatsApp: 0813-7654-3210</p>
                      <p>📧 Email: catering@gadangbarubah.com</p>
                      <p>⏰ Jam Kerja: 08:00 - 20:00 WIB</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Button size="lg" className="w-full hover-elevate" data-testid="button-consultation">
                      <UtensilsCrossed className="mr-2 h-4 w-4" />
                      Konsultasi Gratis
                    </Button>
                    <Button variant="outline" size="lg" className="w-full hover-elevate" data-testid="button-price-list">
                      Download Price List
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}