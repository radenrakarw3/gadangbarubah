import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Crown, Star, Gift, Percent, ArrowLeft } from 'lucide-react';
import Logo from '../Logo';
import SEOHead from '../SEOHead';

export default function MembershipPage() {
  const [, navigate] = useLocation();

  const membershipTiers = [
    {
      name: "Silver Member",
      price: "Gratis",
      color: "border-gray-300 bg-gray-50 dark:bg-gray-900/30",
      icon: "🥈",
      benefits: [
        "Diskon 5% setiap pembelian nasi padang",
        "Poin reward setiap transaksi",
        "Info promo masakan Minang via WhatsApp",
        "Birthday surprise dengan hidangan spesial"
      ]
    },
    {
      name: "Gold Member", 
      price: "Rp 99.000/tahun",
      color: "border-yellow-300 bg-yellow-50 dark:bg-yellow-900/30",
      icon: "🥇",
      benefits: [
        "Diskon 10% setiap pembelian",
        "Double poin reward",
        "Gratis delivery (min. Rp 50k)",
        "Priority customer service",
        "Monthly exclusive menu",
        "Member gathering invite"
      ]
    },
    {
      name: "Platinum Member",
      price: "Rp 199.000/tahun", 
      color: "border-purple-300 bg-purple-50 dark:bg-purple-900/30",
      icon: "💎",
      benefits: [
        "Diskon 15% setiap pembelian",
        "Triple poin reward",
        "Gratis delivery tanpa minimum",
        "VIP customer service",
        "Weekly exclusive menu",
        "Private dining reservation",
        "Annual member gift",
        "Catering discount 20%"
      ]
    }
  ];

  const rewards = [
    { points: 100, reward: "Gratis Es Teh Manis" },
    { points: 250, reward: "Gratis Kerupuk Jangek" },
    { points: 500, reward: "Diskon 20% Next Order" },
    { points: 1000, reward: "Gratis Nasi Padang Set" },
    { points: 2000, reward: "Gratis Catering 10 Porsi" }
  ];

  return (
    <div className="min-h-[100svh] supports-[height:100dvh]:min-h-[100dvh] bg-background">
      <SEOHead pageKey="membership" />
      
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

      <main className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-serif font-medium text-foreground mb-4">
              VIP Membership Pecinta Nasi Padang
            </h1>
            <div className="w-24 h-px bg-primary mx-auto mb-6"></div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Bergabunglah dengan komunitas eksklusif pecinta masakan Minang dan nikmati benefit istimewa untuk pengalaman kuliner nasi padang di Cikarang
            </p>
          </div>

          {/* Membership Tiers */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-center mb-6">Paket Membership</h2>
            <div className="grid lg:grid-cols-3 gap-6">
              {membershipTiers.map((tier, index) => (
                <Card key={index} className={`hover-elevate transition-all duration-300 ${tier.color} border-2 relative ${index === 1 ? 'scale-105 shadow-lg' : ''}`}>
                  {index === 1 && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
                      MOST POPULAR
                    </div>
                  )}
                  
                  <CardContent className="p-6">
                    <div className="text-center mb-4">
                      <div className="text-4xl mb-2">{tier.icon}</div>
                      <h3 className="text-xl font-bold text-foreground mb-2">{tier.name}</h3>
                      <div className="text-2xl font-bold text-primary">{tier.price}</div>
                    </div>
                    
                    <ul className="space-y-3 mb-6">
                      {tier.benefits.map((benefit, bIndex) => (
                        <li key={bIndex} className="flex items-start space-x-2">
                          <Star className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-muted-foreground">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button 
                      onClick={() => navigate('/member/login')}
                      className={`w-full hover-elevate ${index === 1 ? 'bg-primary hover:bg-primary/90' : ''}`}
                      variant={index === 1 ? 'default' : 'outline'}
                      data-testid={`button-join-${index}`}
                    >
                      {index === 0 ? 'Daftar Gratis' : 'Berlangganan'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Reward Points */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-center mb-6 flex items-center justify-center space-x-2">
              <Gift className="h-6 w-6" />
              <span>Tukar Poin Reward</span>
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {rewards.map((reward, index) => (
                <Card key={index} className="hover-elevate transition-all duration-300">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-lg font-bold text-primary">{reward.points} Poin</div>
                        <p className="text-sm text-muted-foreground">{reward.reward}</p>
                      </div>
                      <div className="text-2xl">🎁</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* How it Works */}
          <Card className="bg-primary/10 border-primary/20">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-center mb-6 flex items-center justify-center space-x-2">
                <Percent className="h-5 w-5" />
                <span>Cara Kerja Membership</span>
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                    <div>
                      <h4 className="font-semibold text-foreground">Daftar Membership</h4>
                      <p className="text-sm text-muted-foreground">Pilih paket yang sesuai kebutuhan</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                    <div>
                      <h4 className="font-semibold text-foreground">Dapatkan Member Card</h4>
                      <p className="text-sm text-muted-foreground">Kartu digital via WhatsApp</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                    <div>
                      <h4 className="font-semibold text-foreground">Mulai Belanja</h4>
                      <p className="text-sm text-muted-foreground">Tunjukkan kartu saat pembelian</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
                    <div>
                      <h4 className="font-semibold text-foreground">Nikmati Benefit</h4>
                      <p className="text-sm text-muted-foreground">Diskon otomatis & poin reward</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-center justify-center space-y-3">
                  <Button 
                    onClick={() => navigate('/member/login')}
                    size="lg" 
                    className="w-full hover-elevate" 
                    data-testid="button-join-now"
                  >
                    <Crown className="mr-2 h-4 w-4" />
                    Daftar Sekarang
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    Hubungi: 0812-9876-5432
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}