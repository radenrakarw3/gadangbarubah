import { useState } from 'react';
import { useLocation } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ArrowLeft, Plus, Gift, Edit, Trash2, Loader2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import Logo from '@/components/Logo';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const voucherFormSchema = z.object({
  title: z.string().min(1, 'Judul voucher harus diisi'),
  description: z.string().min(1, 'Deskripsi harus diisi'),
  pointsCost: z.number().min(1, 'Points cost minimal 1'),
  validFrom: z.string().min(1, 'Tanggal mulai harus diisi'),
  validUntil: z.string().min(1, 'Tanggal berakhir harus diisi'),
});

type VoucherFormData = z.infer<typeof voucherFormSchema>;

export default function AdminVouchers() {
  const [, navigate] = useLocation();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<VoucherFormData>({
    resolver: zodResolver(voucherFormSchema),
    defaultValues: {
      title: '',
      description: '',
      pointsCost: 100, // Start with a valid number instead of 0
      validFrom: '',
      validUntil: '',
    },
  });

  // Fetch vouchers
  const { data: vouchers, isLoading, error } = useQuery({
    queryKey: ['/api/admin/vouchers'],
    queryFn: async () => {
      const response = await fetch('/api/admin/vouchers');
      if (!response.ok) {
        throw new Error('Failed to fetch vouchers');
      }
      const result = await response.json();
      return result.data;
    },
  });

  // Create voucher mutation
  const createVoucherMutation = useMutation({
    mutationFn: async (data: VoucherFormData) => {
      const response = await fetch('/api/admin/vouchers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          // Send date strings directly
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to create voucher');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Voucher berhasil dibuat!",
        description: "Voucher baru telah ditambahkan ke sistem.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/vouchers'] });
      queryClient.invalidateQueries({ queryKey: ['/api/vouchers/active'] });
      setIsCreateDialogOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Gagal membuat voucher",
        description: error.message || "Terjadi kesalahan saat membuat voucher",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: VoucherFormData) => {
    createVoucherMutation.mutate(data);
  };

  return (
    <>
      <Helmet>
        <title>Kelola Voucher - Admin Gadang Barubah</title>
        <meta name="description" content="Kelola voucher yang dapat diklaim member Gadang Barubah" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => navigate('/admin')}
                  data-testid="button-back"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div className="flex items-center gap-2">
                  <Gift className="h-6 w-6 text-primary" />
                  <div>
                    <h1 className="font-semibold text-lg">Kelola Voucher</h1>
                    <p className="text-sm text-muted-foreground">Admin Panel</p>
                  </div>
                </div>
              </div>
              
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button data-testid="button-create-voucher">
                    <Plus className="h-4 w-4 mr-2" />
                    Buat Voucher
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Buat Voucher Baru</DialogTitle>
                  </DialogHeader>
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Judul Voucher</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Contoh: Diskon 20% Menu Utama" 
                                {...field} 
                                data-testid="input-voucher-title"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Deskripsi</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Deskripsi voucher..."
                                {...field}
                                data-testid="input-voucher-description"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="pointsCost"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Points yang Diperlukan</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="500"
                                value={field.value || ''}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  field.onChange(value === '' ? 100 : parseInt(value) || 100);
                                }}
                                data-testid="input-voucher-points"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="validFrom"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Berlaku Mulai</FormLabel>
                            <FormControl>
                              <Input 
                                type="date" 
                                {...field}
                                data-testid="input-voucher-from-date"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="validUntil"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Berlaku Hingga</FormLabel>
                            <FormControl>
                              <Input 
                                type="date" 
                                {...field}
                                data-testid="input-voucher-date"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex gap-2 pt-4">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setIsCreateDialogOpen(false)}
                          className="flex-1"
                          data-testid="button-cancel-voucher"
                        >
                          Batal
                        </Button>
                        <Button 
                          type="submit" 
                          disabled={createVoucherMutation.isPending}
                          className="flex-1"
                          data-testid="button-submit-voucher"
                        >
                          {createVoucherMutation.isPending && (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          )}
                          {createVoucherMutation.isPending ? 'Membuat...' : 'Buat Voucher'}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-4 space-y-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">Memuat voucher...</span>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Gagal memuat data voucher</p>
                <Button 
                  variant="outline" 
                  onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/admin/vouchers'] })}
                  className="mt-4"
                >
                  Coba Lagi
                </Button>
              </div>
            ) : vouchers && vouchers.length > 0 ? (
              <div className="grid gap-4">
                {vouchers.map((voucher: any) => (
                  <Card key={voucher.id} data-testid={`card-voucher-${voucher.id}`}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg" data-testid={`text-voucher-title-${voucher.id}`}>
                              {voucher.title}
                            </h3>
                            <Badge variant="secondary" data-testid={`badge-voucher-status-${voucher.id}`}>
                              {new Date(voucher.validUntil) > new Date() ? 'Aktif' : 'Expired'}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground mb-3" data-testid={`text-voucher-description-${voucher.id}`}>
                            {voucher.description}
                          </p>
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-1">
                              <Gift className="h-4 w-4 text-primary" />
                              <span className="font-medium text-primary">{voucher.pointsCost} Points</span>
                            </div>
                            <span className="text-muted-foreground">
                              Berlaku hingga: {new Date(voucher.validUntil).toLocaleDateString('id-ID')}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" data-testid={`button-edit-voucher-${voucher.id}`}>
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-destructive hover:text-destructive"
                          data-testid={`button-delete-voucher-${voucher.id}`}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Hapus
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Gift className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium text-lg mb-2">Belum Ada Voucher</h3>
                <p className="text-muted-foreground mb-6">Mulai buat voucher pertama untuk member Anda</p>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Buat Voucher Pertama
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}