import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, User, Ticket, Gift, Phone, Loader2, LogOut } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import Logo from '@/components/Logo';
import { pageSEOConfigs } from '@/lib/seo';
import { cn } from '@/lib/utils';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

type TabType = 'profile' | 'vouchers' | 'promo';

export default function MemberDashboard() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [memberId, setMemberId] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Get logged-in member ID from localStorage
  useEffect(() => {
    const memberData = localStorage.getItem('memberData');
    if (memberData) {
      const member = JSON.parse(memberData);
      setMemberId(member.id);
    } else {
      // No logged in member, redirect to login
      navigate('/member/login');
    }
  }, [navigate]);
  
  // Fetch member profile data
  const { data: memberProfile, isLoading: profileLoading, error: profileError } = useQuery({
    queryKey: ['/api/members', memberId, 'profile'],
    queryFn: async () => {
      if (!memberId) throw new Error('No member ID');
      const response = await fetch(`/api/members/${memberId}/profile`);
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }
      const result = await response.json();
      return result.data;
    },
    enabled: !!memberId,
    retry: 1,
  });
  
  // Fetch active vouchers
  const { data: activeVouchers, isLoading: vouchersLoading } = useQuery({
    queryKey: ['/api/vouchers/active'],
    queryFn: async () => {
      const response = await fetch('/api/vouchers/active');
      if (!response.ok) {
        throw new Error('Failed to fetch vouchers');
      }
      const result = await response.json();
      return result.data;
    },
    retry: 1,
  });
  
  // Fetch active promos
  const { data: activePromos, isLoading: promosLoading } = useQuery({
    queryKey: ['/api/promos/active'],
    queryFn: async () => {
      const response = await fetch('/api/promos/active');
      if (!response.ok) {
        throw new Error('Failed to fetch promos');
      }
      const result = await response.json();
      return result.data;
    },
    retry: 1,
  });

  // Voucher claiming mutation
  const claimVoucherMutation = useMutation({
    mutationFn: async (voucherId: string) => {
      const response = await fetch(`/api/vouchers/${voucherId}/claim`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ memberId }),
      });
      if (!response.ok) {
        throw new Error('Failed to claim voucher');
      }
      return response.json();
    },
    onSuccess: (data, voucherId) => {
      toast({
        title: "Voucher berhasil diklaim!",
        description: "Voucher telah ditambahkan ke akun Anda.",
      });
      // Invalidate and refetch member profile to update points
      if (memberId) {
        queryClient.invalidateQueries({ queryKey: ['/api/members', memberId, 'profile'] });
        // Optionally invalidate vouchers list to update availability
        queryClient.invalidateQueries({ queryKey: ['/api/vouchers/active'] });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Gagal mengklaim voucher",
        description: error.message || "Terjadi kesalahan saat mengklaim voucher",
        variant: "destructive",
      });
    },
  });

  const handleClaimVoucher = (voucherId: string) => {
    claimVoucherMutation.mutate(voucherId);
  };

  const handleLogout = () => {
    localStorage.removeItem('memberData');
    toast({
      title: "Logout berhasil",
      description: "Anda telah keluar dari akun member",
    });
    navigate('/member/login');
  };

  const renderProfileSection = () => {
    if (profileLoading) {
      return (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Memuat profil...</span>
        </div>
      );
    }

    if (profileError || !memberProfile) {
      return (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Gagal memuat data profil</p>
        </div>
      );
    }

    return (
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
              <p className="text-lg font-medium">{memberProfile.namaLengkap}</p>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Nomor WhatsApp</p>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <p className="text-lg">{memberProfile.noWhatsApp}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total Points</p>
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-4 border border-primary/20">
                <p className="text-3xl font-bold text-primary">{memberProfile.totalPoints.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Points tersedia</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderVouchersSection = () => {
    if (vouchersLoading) {
      return (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Memuat voucher...</span>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="text-center mb-4">
          <h2 className="text-lg font-semibold mb-2">Voucher Tersedia</h2>
          <p className="text-sm text-muted-foreground">Tukarkan points Anda dengan voucher menarik</p>
        </div>
        
        {activeVouchers && activeVouchers.length > 0 ? (
          activeVouchers.map((voucher: any) => (
            <Card key={voucher.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{voucher.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{voucher.description}</p>
                    <p className="text-xs text-muted-foreground">
                      Valid hingga: {new Date(voucher.validUntil).toLocaleDateString('id-ID')}
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
                    disabled={
                      !memberProfile || 
                      memberProfile.totalPoints < voucher.pointsCost ||
                      claimVoucherMutation.isPending
                    }
                    onClick={() => handleClaimVoucher(voucher.id)}
                    data-testid={`button-claim-voucher-${voucher.id}`}
                  >
                    {claimVoucherMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    {claimVoucherMutation.isPending 
                      ? 'Claiming...' 
                      : memberProfile && memberProfile.totalPoints >= voucher.pointsCost 
                        ? 'Claim' 
                        : 'Points Kurang'
                    }
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Belum ada voucher tersedia</p>
          </div>
        )}
      </div>
    );
  };

  const renderPromoSection = () => {
    if (promosLoading) {
      return (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Memuat promo...</span>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="text-center mb-4">
          <h2 className="text-lg font-semibold mb-2">Promo Terbaru</h2>
          <p className="text-sm text-muted-foreground">Jangan lewatkan promo menarik dari Gadang Barubah</p>
        </div>
        
        {activePromos && activePromos.length > 0 ? (
          activePromos.map((promo: any) => (
            <Card key={promo.id}>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2">{promo.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{promo.description}</p>
                <p className="text-xs text-muted-foreground">
                  Periode: {new Date(promo.validFrom).toLocaleDateString('id-ID')} - {new Date(promo.validUntil).toLocaleDateString('id-ID')}
                </p>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Belum ada promo tersedia</p>
          </div>
        )}
      </div>
    );
  };

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
          
          <Button
            onClick={handleLogout}
            variant="ghost"
            size="sm"
            className="hover:bg-accent/10 text-muted-foreground hover:text-foreground"
            data-testid="button-logout"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline ml-1 text-sm">Logout</span>
          </Button>
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