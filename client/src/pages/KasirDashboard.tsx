import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ArrowLeft, Receipt, User, Calculator, CheckCircle, Loader2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import Logo from '@/components/Logo';
import { useToast } from '@/hooks/use-toast';
import { queryClient } from '@/lib/queryClient';
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
  const { toast } = useToast();

  const form = useForm<BillFormData>({
    resolver: zodResolver(billFormSchema),
    defaultValues: {
      noWhatsApp: '',
      billAmount: 0,
    },
  });

  const noWhatsApp = form.watch('noWhatsApp');
  const billAmount = form.watch('billAmount');

  // Calculate points whenever bill amount changes (1 point per 1000 rupiah)
  useEffect(() => {
    const points = Math.floor(billAmount / 1000);
    setCalculatedPoints(points);
  }, [billAmount]);

  // Fetch member details when noWhatsApp changes
  const { data: memberData, isLoading: memberLoading } = useQuery({
    queryKey: ['/api/members/whatsapp', noWhatsApp, 'profile'],
    queryFn: async () => {
      if (!noWhatsApp) return null;
      const response = await fetch(`/api/members/whatsapp/${noWhatsApp}/profile`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Member tidak ditemukan');
        }
        throw new Error('Gagal memuat data member');
      }
      const result = await response.json();
      return result.data;
    },
    enabled: !!noWhatsApp && noWhatsApp.length >= 10,
    retry: false,
  });

  // Process bill mutation
  const processBillMutation = useMutation({
    mutationFn: async (data: BillFormData) => {
      // Get the member ID from the memberData
      if (!memberData) {
        throw new Error('Data member tidak tersedia');
      }
      
      const response = await fetch('/api/kasir/bills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          memberId: memberData.id,
          totalAmount: data.billAmount,
          kasirId: "kasir-1" // Should be from auth session in production
        }),
      });
      if (!response.ok) {
        throw new Error('Gagal memproses bill');
      }
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Bill berhasil diproses!",
        description: `Member mendapat ${calculatedPoints} points dari bill Rp ${billAmount.toLocaleString()}`,
      });
      // Invalidate member profile to update points
      queryClient.invalidateQueries({ queryKey: ['/api/members/whatsapp', noWhatsApp, 'profile'] });
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

  const onSubmit = (data: BillFormData) => {
    processBillMutation.mutate(data);
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
            </div>
          </div>

          {/* Main Content */}
          <div className="p-4 space-y-6">
            <div className="text-center">
              <Receipt className="h-12 w-12 text-primary mx-auto mb-3" />
              <h2 className="text-2xl font-bold mb-2">Proses Bill</h2>
              <p className="text-muted-foreground">Berikan points kepada member berdasarkan total belanja</p>
            </div>

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
                    {noWhatsApp && noWhatsApp.length >= 10 && (
                      <div className="p-3 bg-muted rounded-lg">
                        {memberLoading ? (
                          <div className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="text-sm text-muted-foreground">Mencari member...</span>
                          </div>
                        ) : memberData ? (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-primary" />
                              <span className="font-medium" data-testid="text-member-name">
                                {memberData.namaLengkap}
                              </span>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              <p>WhatsApp: {memberData.noWhatsApp}</p>
                              <p data-testid="text-current-points">
                                Points saat ini: <span className="font-medium text-primary">
                                  {memberData.totalPoints.toLocaleString()}
                                </span>
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm text-destructive">
                            Member tidak ditemukan
                          </div>
                        )}
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
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              data-testid="input-bill-amount"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Points calculation display */}
                    {billAmount > 0 && (
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
                        billAmount < 1000 ||
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
          </div>
        </div>
      </div>
    </>
  );
}