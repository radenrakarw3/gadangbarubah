import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { ArrowLeft, Lock, Phone, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import Logo from '@/components/Logo';
import { z } from 'zod';

const loginSchema = z.object({
  noWhatsApp: z.string().min(10, "Nomor WhatsApp minimal 10 digit"),
  pin: z.string().length(6, "PIN harus 6 digit"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function MemberLogin() {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      noWhatsApp: '',
      pin: '',
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormData) => {
      const res = await apiRequest('POST', '/api/members/login', data);
      return res.json();
    },
    onSuccess: (response: any) => {
      toast({
        title: "Login Berhasil!",
        description: `Selamat datang, ${response.member.namaLengkap}!`,
      });
      // For now, navigate back to home. Later we can add member dashboard
      navigate('/');
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Login Gagal",
        description: error.message || "Nomor WhatsApp atau PIN salah",
      });
    },
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  const handleForgotPin = () => {
    const message = encodeURIComponent('Halo, saya lupa PIN member Gadang Barubah. Mohon bantuan untuk reset PIN.');
    const whatsAppUrl = `https://api.whatsapp.com/send?phone=6289509766739&text=${message}`;
    window.open(whatsAppUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-[100svh] supports-[height:100dvh]:min-h-[100dvh] bg-background">
      {/* Header */}
      <div className="px-4 pt-8 pb-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
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

      {/* Main Content */}
      <main className="px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card className="border-border/30 shadow-lg">
            <CardHeader className="text-center space-y-4">
              <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full flex items-center justify-center mx-auto border border-primary/20">
                <Lock className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl font-serif font-medium text-foreground">
                Login Member
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Masukkan nomor WhatsApp dan PIN untuk akses member
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="noWhatsApp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-primary" />
                          Nomor WhatsApp
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="08123456789"
                            {...field}
                            data-testid="input-whatsapp"
                            className="text-base"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="pin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Lock className="h-4 w-4 text-primary" />
                          PIN (6 Digit)
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••"
                            maxLength={6}
                            {...field}
                            data-testid="input-pin"
                            className="text-base text-center tracking-widest"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full text-base"
                    disabled={loginMutation.isPending}
                    data-testid="button-login"
                  >
                    {loginMutation.isPending ? "Memproses..." : "Login"}
                  </Button>
                </form>
              </Form>

              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full text-sm"
                  onClick={handleForgotPin}
                  data-testid="button-forgot-pin"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Lupa PIN? Chat Admin
                </Button>

                <div className="text-center">
                  <span className="text-sm text-muted-foreground">Belum punya akun? </span>
                  <Button
                    variant="ghost"
                    className="text-sm p-0 h-auto font-medium text-primary hover:bg-transparent"
                    onClick={() => navigate('/member/register')}
                    data-testid="button-register"
                  >
                    Daftar Member
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