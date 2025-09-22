import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { ArrowLeft, UserPlus, User, Phone, Calendar, MapPin, Lock, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import Logo from '@/components/Logo';
import { z } from 'zod';

const registerSchema = z.object({
  namaLengkap: z.string().min(2, "Nama lengkap minimal 2 karakter"),
  jenisKelamin: z.enum(["Uda", "Uni"], { errorMap: () => ({ message: "Pilih jenis kelamin" }) }),
  noWhatsApp: z.string().min(10, "Nomor WhatsApp minimal 10 digit"),
  tanggalLahir: z.string().min(1, "Tanggal lahir wajib diisi"),
  kodePos: z.string().length(5, "Kode pos harus 5 digit"),
  pin: z.string().length(6, "PIN harus 6 digit"),
  confirmPin: z.string().length(6, "Konfirmasi PIN harus 6 digit"),
}).refine((data) => data.pin === data.confirmPin, {
  message: "PIN dan konfirmasi PIN harus sama",
  path: ["confirmPin"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function MemberRegister() {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      namaLengkap: '',
      jenisKelamin: '' as 'Uda' | 'Uni' | '',
      noWhatsApp: '',
      tanggalLahir: '',
      kodePos: '',
      pin: '',
      confirmPin: '',
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterFormData) => {
      const { confirmPin, ...registerData } = data;
      const res = await apiRequest('POST', '/api/members/register', registerData);
      return res.json();
    },
    onSuccess: (response: any) => {
      toast({
        title: "Registrasi Berhasil!",
        description: response.message,
      });
      // Navigate to login page
      navigate('/member/login');
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Registrasi Gagal",
        description: error.message || "Terjadi kesalahan saat registrasi",
      });
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="min-h-[100svh] supports-[height:100dvh]:min-h-[100dvh] bg-background">
      {/* Header */}
      <div className="px-4 pt-8 pb-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <Button
            onClick={() => navigate('/member/login')}
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
                <UserPlus className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl font-serif font-medium text-foreground">
                Daftar Member
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Bergabung sebagai member untuk mendapatkan benefit eksklusif
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="namaLengkap"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <User className="h-4 w-4 text-primary" />
                          Nama Lengkap
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="John Doe"
                            {...field}
                            data-testid="input-nama"
                            className="text-base"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="jenisKelamin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-primary" />
                          Jenis Kelamin
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-gender">
                              <SelectValue placeholder="Pilih jenis kelamin" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Uda">Uda (Cowok)</SelectItem>
                            <SelectItem value="Uni">Uni (Cewek)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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
                    name="tanggalLahir"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-primary" />
                          Tanggal Lahir
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
                            data-testid="input-birthdate"
                            className="text-base"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="kodePos"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-primary" />
                          Kode Pos Rumah
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="12345"
                            maxLength={5}
                            {...field}
                            data-testid="input-postal-code"
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

                  <FormField
                    control={form.control}
                    name="confirmPin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Lock className="h-4 w-4 text-primary" />
                          Konfirmasi PIN
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••"
                            maxLength={6}
                            {...field}
                            data-testid="input-confirm-pin"
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
                    disabled={registerMutation.isPending}
                    data-testid="button-register"
                  >
                    {registerMutation.isPending ? "Memproses..." : "Daftar Member"}
                  </Button>
                </form>
              </Form>

              <div className="text-center">
                <span className="text-sm text-muted-foreground">Sudah punya akun? </span>
                <Button
                  variant="ghost"
                  className="text-sm p-0 h-auto font-medium text-primary hover:bg-transparent"
                  onClick={() => navigate('/member/login')}
                  data-testid="button-to-login"
                >
                  Login Member
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}