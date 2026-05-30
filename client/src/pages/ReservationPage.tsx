import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { CalendarDays, CheckCircle2, Loader2, Users } from "lucide-react";
import PublicPageLayout from "@/components/PublicPageLayout";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, parseApiError } from "@/lib/queryClient";
import { COMPANY, OUTLETS, RESERVATION_TIME_SLOTS, todayISO } from "@/lib/siteContent";

const TIME_SLOTS = RESERVATION_TIME_SLOTS;

const reservationFormSchema = z.object({
  namaLengkap: z.string().min(2, "Nama lengkap wajib diisi"),
  noWhatsApp: z.string().min(10, "Nomor WhatsApp minimal 10 digit"),
  email: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.trim() === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim()),
      { message: "Email tidak valid" },
    ),
  tanggalReservasi: z.string().min(1, "Tanggal reservasi wajib diisi"),
  waktuReservasi: z.string().min(1, "Pilih waktu reservasi"),
  jumlahTamu: z.coerce.number().int().min(1, "Minimal 1 tamu").max(50, "Maksimal 50 tamu"),
  tipeMeja: z.enum(["reguler", "vip"], { errorMap: () => ({ message: "Pilih tipe meja" }) }),
  catatan: z.string().max(500).optional(),
});

type ReservationFormData = z.infer<typeof reservationFormSchema>;

export default function ReservationPage() {
  const { toast } = useToast();
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const form = useForm<ReservationFormData>({
    resolver: zodResolver(reservationFormSchema),
    defaultValues: {
      namaLengkap: "",
      noWhatsApp: "",
      email: "",
      tanggalReservasi: todayISO(),
      waktuReservasi: "",
      jumlahTamu: 2,
      tipeMeja: "reguler",
      catatan: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: ReservationFormData) => {
      const emailTrimmed = data.email?.trim() ?? "";
      const payload = {
        namaLengkap: data.namaLengkap.trim(),
        noWhatsApp: data.noWhatsApp.trim(),
        outlet: OUTLETS[0].id,
        tanggalReservasi: data.tanggalReservasi,
        waktuReservasi: data.waktuReservasi,
        jumlahTamu: data.jumlahTamu,
        tipeMeja: data.tipeMeja,
        ...(emailTrimmed ? { email: emailTrimmed } : {}),
        ...(data.catatan?.trim() ? { catatan: data.catatan.trim() } : {}),
      };
      const res = await apiRequest("POST", "/api/reservations", payload);
      return res.json();
    },
    onSuccess: (result) => {
      if (result.success) {
        setSubmittedId(result.data?.id ?? null);
        toast({
          title: "Reservasi terkirim",
          description: result.message,
        });
        form.reset({
          namaLengkap: "",
          noWhatsApp: "",
          email: "",
          tanggalReservasi: todayISO(),
          waktuReservasi: "",
          jumlahTamu: 2,
          tipeMeja: "reguler",
          catatan: "",
        });
      } else {
        toast({
          title: "Gagal",
          description: result.message || "Reservasi gagal dikirim",
          variant: "destructive",
        });
      }
    },
    onError: (err) => {
      toast({
        title: "Gagal",
        description: parseApiError(err),
        variant: "destructive",
      });
    },
  });

  const minDate = todayISO();

  return (
    <PublicPageLayout>
      <SEOHead pageKey="reservation" />

      <div className="px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-2xl mx-auto space-y-8">
          <section className="text-center">
            <h1 className="text-3xl sm:text-4xl font-serif font-medium text-primary mb-4">
              Reservasi Meja
            </h1>
            <div className="w-24 h-px bg-primary mx-auto mb-6" />
            <p className="text-lg text-muted-foreground leading-relaxed">
              Pesan meja di Gadang Barubah Pollux Mall Cikarang — meja reguler atau VIP room untuk
              acara spesial Anda.
            </p>
          </section>

          {submittedId ? (
            <Card className="border-green-200 bg-green-50/50 dark:bg-green-950/20">
              <CardContent className="p-8 text-center space-y-4">
                <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto" />
                <h2 className="text-xl font-semibold">Permintaan Reservasi Diterima</h2>
                <p className="text-muted-foreground">
                  Tim kami akan menghubungi Anda via WhatsApp untuk konfirmasi. Simpan ID reservasi:{" "}
                  <span className="font-mono text-sm">{submittedId.slice(0, 8)}</span>
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button asChild>
                    <a
                      href={`https://wa.me/${COMPANY.whatsapp}?text=${encodeURIComponent(
                        `Halo Gadang Barubah, saya sudah mengisi form reservasi (ID: ${submittedId.slice(0, 8)}). Mohon konfirmasi.`,
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Konfirmasi via WhatsApp
                    </a>
                  </Button>
                  <Button variant="outline" onClick={() => setSubmittedId(null)}>
                    Buat Reservasi Lain
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6 sm:p-8">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
                    className="space-y-5"
                  >
                    <FormField
                      control={form.control}
                      name="namaLengkap"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nama Lengkap</FormLabel>
                          <FormControl>
                            <Input placeholder="Contoh: Budi Santoso" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="noWhatsApp"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nomor WhatsApp</FormLabel>
                            <FormControl>
                              <Input placeholder="08xxxxxxxxxx" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email (opsional)</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="email@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="tanggalReservasi"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tanggal</FormLabel>
                            <div className="flex gap-2">
                              <FormControl>
                                <Input type="date" min={minDate} className="flex-1" {...field} />
                              </FormControl>
                              <Button
                                type="button"
                                variant={field.value === minDate ? "default" : "outline"}
                                className="shrink-0"
                                onClick={() => form.setValue("tanggalReservasi", minDate)}
                              >
                                Hari Ini
                              </Button>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="waktuReservasi"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Waktu</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Pilih waktu" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {TIME_SLOTS.map((slot) => (
                                  <SelectItem key={slot} value={slot}>
                                    {slot} WIB
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="jumlahTamu"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Jumlah Tamu</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input type="number" min={1} max={50} className="pl-9" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="tipeMeja"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tipe Meja</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Pilih tipe meja" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="reguler">Meja Reguler</SelectItem>
                                <SelectItem value="vip">VIP Room</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="catatan"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Catatan (opsional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Permintaan khusus, alergi makanan, acara ulang tahun, dll."
                              rows={3}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" size="lg" className="w-full" disabled={mutation.isPending}>
                      {mutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Mengirim...
                        </>
                      ) : (
                        <>
                          <CalendarDays className="mr-2 h-4 w-4" />
                          Kirim Permintaan Reservasi
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}

          <p className="text-sm text-center text-muted-foreground">
            Jam operasional: 10:00 – 22:00 WIB • Reservasi VIP room disarankan H-1
          </p>
        </div>
      </div>
    </PublicPageLayout>
  );
}
