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
import { ArrowLeft, Plus, Megaphone, Edit, Trash2, Loader2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import Logo from '@/components/Logo';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const promoFormSchema = z.object({
  title: z.string().min(1, 'Judul promo harus diisi'),
  description: z.string().min(1, 'Deskripsi harus diisi'),
  validFrom: z.string().min(1, 'Tanggal mulai harus diisi'),
  validUntil: z.string().min(1, 'Tanggal berakhir harus diisi'),
});

type PromoFormData = z.infer<typeof promoFormSchema>;

export default function AdminPromos() {
  const [, navigate] = useLocation();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<PromoFormData>({
    resolver: zodResolver(promoFormSchema),
    defaultValues: {
      title: '',
      description: '',
      validFrom: '',
      validUntil: '',
    },
  });

  // Fetch promos
  const { data: promos, isLoading, error } = useQuery({
    queryKey: ['/api/admin/promos'],
    queryFn: async () => {
      const response = await fetch('/api/admin/promos');
      if (!response.ok) {
        throw new Error('Failed to fetch promos');
      }
      const result = await response.json();
      return result.data;
    },
  });

  // Create promo mutation
  const createPromoMutation = useMutation({
    mutationFn: async (data: PromoFormData) => {
      const response = await fetch('/api/admin/promos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          validFrom: new Date(data.validFrom).toISOString(),
          validUntil: new Date(data.validUntil).toISOString(),
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to create promo');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Promo berhasil dibuat!",
        description: "Promo baru telah ditambahkan ke sistem.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/promos'] });
      queryClient.invalidateQueries({ queryKey: ['/api/promos/active'] });
      setIsCreateDialogOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Gagal membuat promo",
        description: error.message || "Terjadi kesalahan saat membuat promo",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: PromoFormData) => {
    createPromoMutation.mutate(data);
  };

  return (
    <>
      <Helmet>
        <title>Kelola Promo - Admin Gadang Barubah</title>
        <meta name="description" content="Kelola promo untuk member Gadang Barubah" />
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
                  <Megaphone className="h-6 w-6 text-primary" />
                  <div>
                    <h1 className="font-semibold text-lg">Kelola Promo</h1>
                    <p className="text-sm text-muted-foreground">Admin Panel</p>
                  </div>
                </div>
              </div>
              
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button data-testid="button-create-promo">
                    <Plus className="h-4 w-4 mr-2" />
                    Buat Promo
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Buat Promo Baru</DialogTitle>
                  </DialogHeader>
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Judul Promo</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Contoh: Promo Akhir Tahun" 
                                {...field} 
                                data-testid="input-promo-title"
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
                                placeholder="Deskripsi promo..."
                                {...field}
                                data-testid="input-promo-description"
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
                            <FormLabel>Mulai Dari</FormLabel>
                            <FormControl>
                              <Input 
                                type="date" 
                                {...field}
                                data-testid="input-promo-start-date"
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
                                data-testid="input-promo-end-date"
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
                          data-testid="button-cancel-promo"
                        >
                          Batal
                        </Button>
                        <Button 
                          type="submit" 
                          disabled={createPromoMutation.isPending}
                          className="flex-1"
                          data-testid="button-submit-promo"
                        >
                          {createPromoMutation.isPending && (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          )}
                          {createPromoMutation.isPending ? 'Membuat...' : 'Buat Promo'}
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
                <span className="ml-2 text-muted-foreground">Memuat promo...</span>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Gagal memuat data promo</p>
                <Button 
                  variant="outline" 
                  onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/admin/promos'] })}
                  className="mt-4"
                >
                  Coba Lagi
                </Button>
              </div>
            ) : promos && promos.length > 0 ? (
              <div className="grid gap-4">
                {promos.map((promo: any) => (
                  <Card key={promo.id} data-testid={`card-promo-${promo.id}`}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg" data-testid={`text-promo-title-${promo.id}`}>
                              {promo.title}
                            </h3>
                            <Badge 
                              variant="secondary"
                              data-testid={`badge-promo-status-${promo.id}`}
                            >
                              {new Date() >= new Date(promo.validFrom) && new Date() <= new Date(promo.validUntil) 
                                ? 'Aktif' 
                                : new Date() < new Date(promo.validFrom)
                                  ? 'Belum Mulai'
                                  : 'Expired'
                              }
                            </Badge>
                          </div>
                          <p className="text-muted-foreground mb-3" data-testid={`text-promo-description-${promo.id}`}>
                            {promo.description}
                          </p>
                          <div className="text-sm text-muted-foreground">
                            <span>
                              Periode: {new Date(promo.validFrom).toLocaleDateString('id-ID')} - {new Date(promo.validUntil).toLocaleDateString('id-ID')}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" data-testid={`button-edit-promo-${promo.id}`}>
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-destructive hover:text-destructive"
                          data-testid={`button-delete-promo-${promo.id}`}
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
                <Megaphone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium text-lg mb-2">Belum Ada Promo</h3>
                <p className="text-muted-foreground mb-6">Mulai buat promo pertama untuk member Anda</p>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Buat Promo Pertama
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}