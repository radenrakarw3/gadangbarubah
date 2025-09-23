import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, User, Ticket, Gift, Phone } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import Logo from '@/components/Logo';
import { pageSEOConfigs } from '@/lib/seo';
import { cn } from '@/lib/utils';

type TabType = 'profile' | 'vouchers' | 'promo';

export default function MemberDashboard() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  
  // Mock data for now - will be replaced with actual data from API
  const memberData = {
    id: '123',
    namaLengkap: 'John Doe',
    noWhatsApp: '081234567890',
    totalPoints: 1500
  };

  const activeVouchers = [
    {
      id: '1',
      title: 'Diskon 20% Menu Utama',
      description: 'Dapatkan diskon 20% untuk semua menu utama Gadang Barubah',
      pointsCost: 500,
      validUntil: new Date('2025-01-31')
    },
    {
      id: '2',
      title: 'Free Dessert',
      description: 'Gratis dessert pilihan untuk pembelian minimal Rp 100.000',
      pointsCost: 300,
      validUntil: new Date('2025-02-15')
    }
  ];

  const activePromos = [
    {
      id: '1',
      title: 'Promo Akhir Tahun',
      description: 'Nikmati promo spesial akhir tahun dengan diskon hingga 30% untuk paket keluarga',
      validFrom: new Date('2024-12-01'),
      validUntil: new Date('2025-01-15')
    },
    {
      id: '2',
      title: 'Buka Puasa Bersama',
      description: 'Paket buka puasa keluarga mulai dari Rp 150.000 untuk 4 orang',
      validFrom: new Date('2025-03-01'),
      validUntil: new Date('2025-04-30')
    }
  ];

  const renderProfileSection = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profil Saya
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Nama Lengkap</p>
            <p className="text-lg font-medium">{memberData.namaLengkap}</p>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Nomor WhatsApp</p>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <p className="text-lg">{memberData.noWhatsApp}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Total Points</p>
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-4 border border-primary/20">
              <p className="text-3xl font-bold text-primary">{memberData.totalPoints.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Points tersedia</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderVouchersSection = () => (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <h2 className="text-lg font-semibold mb-2">Voucher Tersedia</h2>
        <p className="text-sm text-muted-foreground">Tukarkan points Anda dengan voucher menarik</p>
      </div>
      
      {activeVouchers.map((voucher) => (
        <Card key={voucher.id}>
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">{voucher.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">{voucher.description}</p>
                <p className="text-xs text-muted-foreground">
                  Valid hingga: {voucher.validUntil.toLocaleDateString('id-ID')}
                </p>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Gift className="h-4 w-4 text-primary" />
                <span className="font-semibold text-primary">{voucher.pointsCost} Points</span>
              </div>
              <Button 
                size="sm" 
                disabled={memberData.totalPoints < voucher.pointsCost}
                data-testid={`button-claim-voucher-${voucher.id}`}
              >
                {memberData.totalPoints >= voucher.pointsCost ? 'Claim' : 'Points Kurang'}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderPromoSection = () => (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <h2 className="text-lg font-semibold mb-2">Promo Terbaru</h2>
        <p className="text-sm text-muted-foreground">Jangan lewatkan promo menarik dari Gadang Barubah</p>
      </div>
      
      {activePromos.map((promo) => (
        <Card key={promo.id}>
          <CardContent className="p-4">
            <h3 className="font-semibold text-lg mb-2">{promo.title}</h3>
            <p className="text-sm text-muted-foreground mb-3">{promo.description}</p>
            <p className="text-xs text-muted-foreground">
              Periode: {promo.validFrom.toLocaleDateString('id-ID')} - {promo.validUntil.toLocaleDateString('id-ID')}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileSection();
      case 'vouchers':
        return renderVouchersSection();
      case 'promo':
        return renderPromoSection();
      default:
        return renderProfileSection();
    }
  };

  return (
    <div className="min-h-[100svh] supports-[height:100dvh]:min-h-[100dvh] bg-background flex flex-col">
      <Helmet>
        <title>Member Dashboard - Gadang Barubah</title>
        <meta name="description" content="Dashboard member Gadang Barubah untuk melihat points, claim voucher, dan info promo terbaru" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      {/* Header */}
      <div className="px-4 pt-8 pb-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <Button
            onClick={() => navigate('/')}
            variant="ghost"
            size="sm"
            className="hover:bg-accent/10 text-muted-foreground hover:text-foreground"
            data-testid="button-back-home"
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

      {/* Main Content */}
      <main className="flex-1 px-4 pb-20 overflow-y-auto">
        <div className="max-w-md mx-auto">
          {renderContent()}
        </div>
      </main>

      {/* Footer Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border">
        <div className="max-w-md mx-auto px-4 py-2">
          <nav className="flex justify-around">
            <button
              onClick={() => setActiveTab('profile')}
              className={cn(
                "flex flex-col items-center py-2 px-3 rounded-lg transition-colors",
                activeTab === 'profile' 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              )}
              data-testid="tab-profile"
            >
              <User className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">Profil</span>
            </button>
            
            <button
              onClick={() => setActiveTab('vouchers')}
              className={cn(
                "flex flex-col items-center py-2 px-3 rounded-lg transition-colors",
                activeTab === 'vouchers' 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              )}
              data-testid="tab-vouchers"
            >
              <Ticket className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">Voucher</span>
            </button>
            
            <button
              onClick={() => setActiveTab('promo')}
              className={cn(
                "flex flex-col items-center py-2 px-3 rounded-lg transition-colors",
                activeTab === 'promo' 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              )}
              data-testid="tab-promo"
            >
              <Gift className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">Promo</span>
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}