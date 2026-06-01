import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Truck, Clock, Phone, ArrowLeft } from 'lucide-react';
import Logo from '../Logo';
import SEOHead from '../SEOHead';
import { useSiteLanguage } from '@/lib/language';

export default function DeliveryPage() {
  const [, navigate] = useLocation();
  const { lang } = useSiteLanguage();

  const deliveryAreas = [
    { area: "Cikarang Pusat", time: "30-45 menit", fee: "Gratis" },
    { area: "Cikarang Utara", time: "45-60 menit", fee: "Rp 5.000" },
    { area: "Cikarang Selatan", time: "45-60 menit", fee: "Rp 5.000" },
    { area: "Bekasi Timur", time: "60-90 menit", fee: "Rp 10.000" }
  ];

  return (
    <div className="min-h-[100svh] supports-[height:100dvh]:min-h-[100dvh] bg-background">
      <SEOHead pageKey="delivery" />
      
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
            <span className="hidden sm:inline ml-1 text-sm">{lang === 'ID' ? 'Kembali' : 'Back'}</span>
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
              {lang === 'EN' ? 'Authentic Padang Delivery in Cikarang' : 'Delivery Nasi Padang Autentik ke Cikarang'}
            </h1>
            <div className="w-24 h-px bg-primary mx-auto mb-6"></div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {lang === 'ID'
                ? 'Nikmati kelezatan nasi padang, rendang, dan gulai berkualitas rumah makan langsung di rumah Anda dengan layanan antar terpercaya'
                : 'Enjoy authentic Padang dishes, rendang, and gulai delivered to your home with reliable service.'}
            </p>
          </div>

          {/* Service Info */}
          <Card className="mb-8 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl mb-2">⚡</div>
                  <h3 className="font-semibold text-foreground mb-1">{lang === 'ID' ? 'Cepat & Tepat' : 'Fast & Reliable'}</h3>
                  <p className="text-sm text-muted-foreground">{lang === 'ID' ? 'Delivery maksimal 90 menit' : 'Delivery up to 90 minutes'}</p>
                </div>
                <div>
                  <div className="text-3xl mb-2">🔒</div>
                  <h3 className="font-semibold text-foreground mb-1">{lang === 'ID' ? 'Aman & Higienis' : 'Safe & Hygienic'}</h3>
                  <p className="text-sm text-muted-foreground">{lang === 'ID' ? 'Kemasan tertutup rapat' : 'Sealed packaging'}</p>
                </div>
                <div>
                  <div className="text-3xl mb-2">📱</div>
                  <h3 className="font-semibold text-foreground mb-1">{lang === 'ID' ? 'Tracking Real-time' : 'Real-time Tracking'}</h3>
                  <p className="text-sm text-muted-foreground">{lang === 'ID' ? 'Pantau pesanan via WhatsApp' : 'Track orders via WhatsApp'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Areas */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-center mb-6">{lang === 'ID' ? 'Area Delivery' : 'Delivery Areas'}</h2>
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
                <span>{lang === 'ID' ? 'Cara Pesan' : 'How to Order'}</span>
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">1</div>
                    <p className="text-sm text-muted-foreground">{lang === 'ID' ? 'Hubungi WhatsApp: ' : 'Contact WhatsApp: '}<strong>0812-3456-7890</strong></p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">2</div>
                    <p className="text-sm text-muted-foreground">{lang === 'ID' ? 'Pilih menu dan berikan alamat lengkap' : 'Choose menu and provide full address'}</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">3</div>
                    <p className="text-sm text-muted-foreground">{lang === 'ID' ? 'Konfirmasi pesanan dan lakukan pembayaran' : 'Confirm order and complete payment'}</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">4</div>
                    <p className="text-sm text-muted-foreground">{lang === 'ID' ? 'Tunggu pesanan tiba di lokasi Anda' : 'Wait for your order to arrive'}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-center">
                  <Button size="lg" className="w-full hover-elevate" data-testid="button-order-now">
                    <Phone className="mr-2 h-4 w-4" />
                    {lang === 'ID' ? 'Pesan Sekarang' : 'Order Now'}
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