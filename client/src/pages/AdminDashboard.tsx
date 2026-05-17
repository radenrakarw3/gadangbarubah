import { useState } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Gift, Megaphone, Users, Receipt, LogOut, Monitor, UserCog, Loader2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import Logo from '@/components/Logo';
import { useToast } from '@/hooks/use-toast';
import { apiFetch } from '@/lib/api';

type AdminStats = {
  totalMembers: number;
  activeVouchers: number;
  activePromos: number;
  totalBills: number;
  pendingVoucherClaims: number;
  staffCount: number;
  hasActiveCampaign: boolean;
};

export default function AdminDashboard() {
  const [, navigate] = useLocation();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { toast } = useToast();

  const { data: statsData, isLoading: statsLoading } = useQuery<{
    success: boolean;
    data: AdminStats;
  }>({
    queryKey: ['/api/admin/stats'],
    queryFn: async () => {
      const response = await apiFetch('/api/admin/stats');
      if (!response.ok) {
        throw new Error('Gagal memuat ringkasan');
      }
      return response.json();
    },
  });

  const stats = statsData?.data;

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const response = await apiFetch('/api/auth/logout', {
        method: 'POST',
      });

      if (response.ok) {
        toast({
          title: "Logout berhasil",
          description: "Anda telah keluar dari sistem",
        });
        navigate('/');
      } else {
        throw new Error('Logout gagal');
      }
    } catch (error) {
      toast({
        title: "Logout gagal",
        description: "Terjadi kesalahan saat logout",
        variant: "destructive",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const adminFeatures = [
    {
      id: 'vouchers',
      title: 'Kelola Voucher',
      description: 'Buat, edit, dan kelola voucher yang dapat diklaim member',
      icon: Gift,
      route: '/admin/vouchers',
      color: 'bg-blue-500',
    },
    {
      id: 'promos',
      title: 'Kelola Promo',
      description: 'Buat dan kelola promo terbaru untuk member',
      icon: Megaphone,
      route: '/admin/promos',
      color: 'bg-green-500',
    },
    {
      id: 'campaigns',
      title: 'Kelola Popup',
      description: 'Upload dan kelola popup campaign untuk landing page',
      icon: Monitor,
      route: '/admin/campaigns',
      color: 'bg-pink-500',
    },
    {
      id: 'members',
      title: 'Data Member',
      description: 'Lihat data member dan riwayat points',
      icon: Users,
      route: '/admin/members',
      color: 'bg-purple-500',
    },
    {
      id: 'bills',
      title: 'Riwayat Transaksi',
      description: 'Lihat riwayat bill dan pemberian points',
      icon: Receipt,
      route: '/admin/bills',
      color: 'bg-orange-500',
    },
    {
      id: 'users',
      title: 'Kelola User',
      description: 'Tambah atau hapus akun admin dan kasir',
      icon: UserCog,
      route: '/admin/users',
      color: 'bg-slate-600',
    },
  ];

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - Gadang Barubah</title>
        <meta name="description" content="Dashboard admin untuk mengelola voucher, promo, dan data member Gadang Barubah" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b">
            <div className="flex items-center justify-between p-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate('/')}
                data-testid="button-back"
                title="Kembali ke Home"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-2">
                <Logo />
                <div>
                  <h1 className="font-semibold text-lg">Admin Panel</h1>
                  <Badge variant="secondary" className="text-xs">
                    Administrator
                  </Badge>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleLogout}
                disabled={isLoggingOut}
                data-testid="button-logout"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-4 space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Dashboard Admin</h2>
              <p className="text-muted-foreground">Kelola sistem member Gadang Barubah</p>
            </div>

            <div className="grid gap-4">
              {adminFeatures.map((feature) => {
                const IconComponent = feature.icon;
                return (
                  <Card 
                    key={feature.id} 
                    className="hover-elevate cursor-pointer"
                    onClick={() => navigate(feature.route)}
                    data-testid={`card-admin-${feature.id}`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`${feature.color} p-3 rounded-lg`}>
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1">{feature.title}</h3>
                          <p className="text-muted-foreground text-sm">{feature.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ringkasan Sistem</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary" data-testid="text-total-members">
                        {statsLoading ? '—' : (stats?.totalMembers ?? 0)}
                      </p>
                    <p className="text-sm text-muted-foreground">Total Member</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary" data-testid="text-active-vouchers">
                        {statsLoading ? '—' : (stats?.activeVouchers ?? 0)}
                      </p>
                    <p className="text-sm text-muted-foreground">Voucher Aktif</p>
                  </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary" data-testid="text-total-bills">
                        {statsLoading ? '—' : (stats?.totalBills ?? 0)}
                      </p>
                      <p className="text-sm text-muted-foreground">Total Transaksi</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary" data-testid="text-pending-claims">
                        {statsLoading ? '—' : (stats?.pendingVoucherClaims ?? 0)}
                      </p>
                      <p className="text-sm text-muted-foreground">Voucher Menunggu Tebus</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary" data-testid="text-active-promos">
                        {statsLoading ? '—' : (stats?.activePromos ?? 0)}
                      </p>
                      <p className="text-sm text-muted-foreground">Promo Aktif</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary" data-testid="text-staff-count">
                        {statsLoading ? '—' : (stats?.staffCount ?? 0)}
                      </p>
                      <p className="text-sm text-muted-foreground">User Staff</p>
                    </div>
                </div>
                {stats && !statsLoading && (
                  <p className="text-xs text-center text-muted-foreground">
                    Popup landing: {stats.hasActiveCampaign ? 'aktif' : 'tidak ada yang aktif'}
                  </p>
                )}
                {statsLoading && (
                  <div className="flex justify-center pt-2">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}