import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Truck, Clock, Phone, ArrowLeft } from 'lucide-react';
import Logo from '../Logo';

export default function DeliveryPage() {
  const [, navigate] = useLocation();

  const deliveryAreas = [
    { area: "Padang Kota", time: "30-45 menit", fee: "Gratis" },
    { area: "Padang Selatan", time: "45-60 menit", fee: "Rp 5.000" },
    { area: "Padang Utara", time: "45-60 menit", fee: "Rp 5.000" },
    { area: "Bukittinggi", time: "60-90 menit", fee: "Rp 10.000" }
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
              Layanan Antar Premium
            </h1>
            <div className="w-24 h-px bg-primary mx-auto mb-6"></div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Nikmati kelezatan hidangan berkualitas tinggi langsung di rumah Anda
            </p>
          </div>

          {/* Service Info */}
          <Card className="mb-8 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl mb-2">⚡</div>
                  <h3 className="font-semibold text-foreground mb-1">Cepat & Tepat</h3>
                  <p className="text-sm text-muted-foreground">Delivery maksimal 90 menit</p>
                </div>
                <div>
                  <div className="text-3xl mb-2">🔒</div>
                  <h3 className="font-semibold text-foreground mb-1">Aman & Higienis</h3>
                  <p className="text-sm text-muted-foreground">Kemasan tertutup rapat</p>
                </div>
                <div>
                  <div className="text-3xl mb-2">📱</div>
                  <h3 className="font-semibold text-foreground mb-1">Tracking Real-time</h3>
                  <p className="text-sm text-muted-foreground">Pantau pesanan via WhatsApp</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Areas */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-center mb-6">Area Delivery</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {deliveryAreas.map((area, index) => (
                <Card key={index} className="hover-elevate transition-all duration-300">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-foreground">{area.area}</h3>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        area.fee === "Gratis" 
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                      }`}>
                        {area.fee}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{area.time}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <Card className="bg-primary/10 border-primary/20">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-center mb-6 flex items-center justify-center space-x-2">
                <Phone className="h-5 w-5" />
                <span>Cara Pesan</span>
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">1</div>
                    <p className="text-sm text-muted-foreground">Hubungi WhatsApp: <strong>0812-3456-7890</strong></p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">2</div>
                    <p className="text-sm text-muted-foreground">Pilih menu dan berikan alamat lengkap</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">3</div>
                    <p className="text-sm text-muted-foreground">Konfirmasi pesanan dan lakukan pembayaran</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">4</div>
                    <p className="text-sm text-muted-foreground">Tunggu pesanan tiba di lokasi Anda</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-center">
                  <Button size="lg" className="w-full hover-elevate" data-testid="button-order-now">
                    <Phone className="mr-2 h-4 w-4" />
                    Pesan Sekarang
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