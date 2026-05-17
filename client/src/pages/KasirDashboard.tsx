import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ArrowLeft, Receipt, User, Calculator, CheckCircle, Loader2, Ticket, LogOut } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import Logo from '@/components/Logo';
import MemberSummaryPanel from '@/components/MemberSummaryPanel';
import { useToast } from '@/hooks/use-toast';
import { queryClient } from '@/lib/queryClient';
import { apiFetch } from '@/lib/api';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const billFormSchema = z.object({
  noWhatsApp: z.string().min(10, 'Nomor WhatsApp minimal 10 digit'),
  billAmount: z.number().min(1000, 'Minimal bill Rp 1,000'),
});

type BillFormData = z.infer<typeof billFormSchema>;

export default function KasirDashboard() {
  const [, navigate] = useLocation();
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [calculatedPoints, setCalculatedPoints] = useState(0);
  const [activeTab, setActiveTab] = useState<'bills' | 'vouchers'>('bills');
  const [debouncedWhatsApp, setDebouncedWhatsApp] = useState('');
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { toast } = useToast();

  const form = useForm<BillFormData>({
    resolver: zodResolver(billFormSchema),
    defaultValues: {
      noWhatsApp: '',
      billAmount: '' as any,
    },
  });

  const noWhatsApp = form.watch('noWhatsApp');
  const billAmount = form.watch('billAmount') as any;

  // Debounce WhatsApp search (500ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedWhatsApp(noWhatsApp || '');
    }, 500);

    return () => clearTimeout(timer);
  }, [noWhatsApp]);

  // Calculate points whenever bill amount changes (1 point per 1000 rupiah)
  useEffect(() => {
    const amount = typeof billAmount === 'string' ? parseInt(billAmount) : billAmount;
    const points = amount && amount > 0 ? Math.floor(amount / 1000) : 0;
    setCalculatedPoints(points);
  }, [billAmount]);

  // Fetch member details using debounced search (500ms delay)
  const { data: memberData, isLoading: memberLoading, error: memberError } = useQuery({
    queryKey: ['/api/members/whatsapp', debouncedWhatsApp, 'profile'],
    queryFn: async () => {
      if (!debouncedWhatsApp) return null;
      const response = await apiFetch(
        `/api/members/whatsapp/${encodeURIComponent(debouncedWhatsApp)}/profile`,
      );
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Member tidak ditemukan');
        }
        throw new Error('Gagal memuat data member');
      }
      const result = await response.json();
      return result.data;
    },
    enabled: !!debouncedWhatsApp && debouncedWhatsApp.length >= 10,
    retry: false,
  });

  // Fetch all voucher claims for kasir
  const { data: voucherClaimsData, isLoading: voucherClaimsLoading } = useQuery({
    queryKey: ['/api/kasir/voucher-claims'],
    enabled: activeTab === 'vouchers',
  });

  // Process bill mutation
  const processBillMutation = useMutation({
    mutationFn: async (data: BillFormData) => {
      // Get the member ID from the memberData
      if (!memberData) {
        throw new Error('Data member tidak tersedia');
      }
      
      const response = await apiFetch('/api/kasir/bills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          memberId: memberData.id,
          totalAmount:
            typeof data.billAmount === 'string'
              ? parseInt(data.billAmount)
              : data.billAmount,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Gagal memproses bill');
      }
      return response.json();
    },
    onSuccess: (data) => {
      const amount = typeof billAmount === 'string' ? parseInt(billAmount) : billAmount;
      toast({
        title: "Bill berhasil diproses!",
        description: `Member mendapat ${calculatedPoints} points dari bill Rp ${amount ? amount.toLocaleString() : '0'}`,
      });
      // Invalidate member profile to update points (use debounced key)
      queryClient.invalidateQueries({ queryKey: ['/api/members/whatsapp', debouncedWhatsApp, 'profile'] });
      // Reset form
      form.reset();
      setSelectedMember(null);
      setCalculatedPoints(0);
    },
    onError: (error: any) => {
      toast({
        title: "Gagal memproses bill",
        description: error.message || "Terjadi kesalahan saat memproses bill",
        variant: "destructive",
      });
    },
  });

  // Redeem voucher mutation
  const redeemVoucherMutation = useMutation({
    mutationFn: async (claimId: string) => {
      const response = await apiFetch(`/api/kasir/voucher-claims/${claimId}/redeem`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Gagal menebus voucher');
      }
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Voucher berhasil ditebus!",
        description: "Voucher telah berhasil ditebus untuk member",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/kasir/voucher-claims'] });
    },
    onError: (error: any) => {
      toast({
        title: "Gagal menebus voucher",
        description: error.message || "Terjadi kesalahan saat menebus voucher",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: BillFormData) => {
    processBillMutation.mutate(data);
  };

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

  return (
    <>
      <Helmet>
        <title>Kasir Dashboard - Gadang Barubah</title>
        <meta name="description" content="Dashboard kasir untuk memproses bill dan memberikan points kepada member Gadang Barubah" />
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
                  <h1 className="font-semibold text-lg">Kasir</h1>
                  <Badge variant="secondary" className="text-xs">
                    Cashier
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
              <Receipt className="h-12 w-12 text-primary mx-auto mb-3" />
              <h2 className="text-2xl font-bold mb-2">Kasir Dashboard</h2>
              <p className="text-muted-foreground">Kelola transaksi dan voucher member</p>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'bills' | 'vouchers')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="bills" className="flex items-center gap-2" data-testid="tab-bills">
                  <Calculator className="h-4 w-4" />
                  Proses Bill
                </TabsTrigger>
                <TabsTrigger value="vouchers" className="flex items-center gap-2" data-testid="tab-vouchers">
                  <Ticket className="h-4 w-4" />
                  Kelola Voucher
                </TabsTrigger>
              </TabsList>

              {/* Bills Tab Content */}
              <TabsContent value="bills" className="space-y-4">{/* Wrapper untuk bills content */}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Input Transaksi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="noWhatsApp"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nomor WhatsApp Member</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="081234567890" 
                              {...field}
                              data-testid="input-whatsapp-member"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Member Info Display */}
                    {debouncedWhatsApp && debouncedWhatsApp.length >= 10 && (
                      <div>
                        {memberLoading ? (
                          <div className="flex items-center justify-center py-4">
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            <span className="text-sm text-muted-foreground">Mencari member...</span>
                          </div>
                        ) : memberError ? (
                          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                            <p className="text-sm text-destructive">Member tidak ditemukan</p>
                          </div>
                        ) : memberData ? (
                          <MemberSummaryPanel
                            member={{
                              id: memberData.id,
                              namaLengkap: memberData.namaLengkap,
                              noWhatsApp: memberData.noWhatsApp
                            }}
                            points={memberData.totalPoints}
                            compact
                          />
                        ) : null}
                      </div>
                    )}

                    <FormField
                      control={form.control}
                      name="billAmount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Total Bill (Rupiah)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="150000"
                              {...field}
                              onChange={(e) => {
                                const value = e.target.value;
                                field.onChange(value === '' ? '' : parseInt(value) || '');
                              }}
                              data-testid="input-bill-amount"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Points calculation display */}
                    {calculatedPoints > 0 && (
                      <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">Points yang akan diterima</p>
                            <p className="text-2xl font-bold text-primary" data-testid="text-calculated-points">
                              {calculatedPoints.toLocaleString()} Points
                            </p>
                            <p className="text-xs text-muted-foreground">
                              1 point = Rp 1,000
                            </p>
                          </div>
                          <CheckCircle className="h-8 w-8 text-primary" />
                        </div>
                      </div>
                    )}

                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={
                        !noWhatsApp || 
                        noWhatsApp.length < 10 ||
                        !memberData || 
                        calculatedPoints === 0 ||
                        processBillMutation.isPending
                      }
                      data-testid="button-process-bill"
                    >
                      {processBillMutation.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Memproses...
                        </>
                      ) : (
                        <>
                          <Receipt className="h-4 w-4 mr-2" />
                          Proses Bill & Berikan Points
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <div className="text-center text-sm text-muted-foreground">
              <p>Sistem Points: 1 point untuk setiap Rp 1,000</p>
              <p>Minimal transaksi: Rp 1,000</p>
            </div>
            </TabsContent>

              {/* Vouchers Tab Content */}
              <TabsContent value="vouchers" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Ticket className="h-5 w-5" />
                      Kelola Voucher Claims
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {voucherClaimsLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin mr-2" />
                        <span>Memuat data voucher claims...</span>
                      </div>
                    ) : (voucherClaimsData as any)?.data && (voucherClaimsData as any).data.length > 0 ? (
                      <div className="space-y-4">
                        {(voucherClaimsData as any).data.map((claim: any) => (
                          <div key={claim.id} className="p-4 border rounded-lg space-y-2">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium" data-testid={`text-voucher-title-${claim.id}`}>
                                  {claim.voucherTitle}
                                </h4>
                                <p className="text-sm text-muted-foreground" data-testid={`text-member-info-${claim.id}`}>
                                  {claim.memberName} - {claim.memberWhatsApp}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Diklaim: {new Date(claim.claimedAt).toLocaleString('id-ID')}
                                </p>
                              </div>
                              <div className="text-right">
                                <Badge 
                                  variant={claim.status === 'claimed' ? 'secondary' : 'default'}
                                  data-testid={`badge-status-${claim.id}`}
                                >
                                  {claim.status === 'claimed' ? 'Menunggu' : 'Ditebus'}
                                </Badge>
                                <p className="text-sm font-medium text-primary">
                                  {claim.pointsUsed} points
                                </p>
                              </div>
                            </div>
                            
                            {claim.status === 'claimed' && (
                              <Button
                                size="sm"
                                onClick={() => redeemVoucherMutation.mutate(claim.id)}
                                disabled={redeemVoucherMutation.isPending}
                                className="w-full"
                                data-testid={`button-redeem-${claim.id}`}
                              >
                                {redeemVoucherMutation.isPending ? (
                                  <>
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    Memproses...
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Tebus Voucher
                                  </>
                                )}
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Ticket className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">Belum ada voucher yang diklaim</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
}