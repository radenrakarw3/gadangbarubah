import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { CalendarDays, CheckCircle2, Loader2, Users } from "lucide-react";
import { ReservationHoneypot, RESERVATION_HONEYPOT_FIELD } from "@/components/ReservationHoneypot";
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
import { COMPANY, OUTLETS, todayISO } from "@/lib/siteContent";
import {
  availableTimeSlotsForDate,
  isValidWhatsApp,
  normalizeWhatsAppInput,
  validateReservationDateTime,
} from "@shared/reservation-utils";
import { useSiteLanguage } from "@/lib/language";
import { renderTemplate, useSiteText } from "@/lib/siteText";
import PrivacyConsentField from "@/components/PrivacyConsentField";
import type { PublicReservationStatusPayload } from "@shared/public-reservation";

function ReservationStatusPanel({
  reservationId,
  lang,
}: {
  reservationId: string;
  lang: "ID" | "EN";
}) {
  const { t } = useSiteText();
  const [data, setData] = useState<PublicReservationStatusPayload | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/reservations/${reservationId}/status`);
      const json = await res.json();
      if (!json.success) {
        throw new Error(json.message || (lang === "ID" ? "Gagal memuat status" : "Failed to load status"));
      }
      setData(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : lang === "ID" ? "Gagal memuat status" : "Failed to load status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2 text-left max-w-md mx-auto">
      <Button variant="outline" size="sm" onClick={checkStatus} disabled={loading}>
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        {t("reservation.success.checkStatus")}
      </Button>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      {data ? (
        <p className="text-sm text-muted-foreground">
          {t("reservation.success.statusLabel")}: <strong>{data.statusLabel}</strong> ·{" "}
          {data.tanggalReservasi} {data.waktuReservasi} WIB · {data.outletLabel}
        </p>
      ) : null}
    </div>
  );
}

const outletIds = OUTLETS.map((o) => o.id) as [string, ...string[]];

const reservationFormSchema = z.object({
  namaLengkap: z.string().min(2, "Nama lengkap wajib diisi"),
  noWhatsApp: z
    .string()
    .min(1, "Nomor WhatsApp wajib diisi")
    .refine((val) => isValidWhatsApp(val), {
      message: "Nomor WhatsApp tidak valid. Gunakan format 08xxxxxxxxxx",
    }),
  email: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.trim() === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim()),
      { message: "Email tidak valid" },
    ),
  outlet: z.enum(outletIds, { errorMap: () => ({ message: "Pilih outlet" }) }),
  tanggalReservasi: z
    .string()
    .min(1, "Tanggal reservasi wajib diisi")
    .refine((val) => val >= todayISO(), {
      message: "Tanggal reservasi tidak boleh di masa lalu",
    }),
  waktuReservasi: z.string().min(1, "Pilih waktu reservasi"),
  jumlahTamu: z.coerce.number().int().min(1, "Minimal 1 tamu").max(50, "Maksimal 50 tamu"),
  tipeMeja: z.enum(["reguler", "vip"], { errorMap: () => ({ message: "Pilih tipe meja" }) }),
  catatan: z.string().max(500).optional(),
}).superRefine((data, ctx) => {
  const err = validateReservationDateTime(data.tanggalReservasi, data.waktuReservasi);
  if (err) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: err,
      path: ["waktuReservasi"],
    });
  }
});

type ReservationFormData = z.infer<typeof reservationFormSchema>;

export default function ReservationPage() {
  const { toast } = useToast();
  const { lang } = useSiteLanguage();
  const { t } = useSiteText();
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const form = useForm<ReservationFormData>({
    resolver: zodResolver(reservationFormSchema),
    defaultValues: {
      namaLengkap: "",
      noWhatsApp: "",
      email: "",
      outlet: OUTLETS[0].id,
      tanggalReservasi: todayISO(),
      waktuReservasi: "18:00",
      jumlahTamu: 2,
      tipeMeja: "reguler",
      catatan: "",
    },
  });

  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const honeypotRef = useRef<HTMLInputElement>(null);

  const mutation = useMutation({
    mutationFn: async (data: ReservationFormData) => {
      const honeypot = honeypotRef.current?.value?.trim() ?? "";
      if (honeypot) {
        return { success: true, data: null };
      }

      const emailTrimmed = data.email?.trim() ?? "";
      const payload = {
        namaLengkap: data.namaLengkap.trim(),
        noWhatsApp: normalizeWhatsAppInput(data.noWhatsApp),
        outlet: data.outlet,
        tanggalReservasi: data.tanggalReservasi,
        waktuReservasi: data.waktuReservasi,
        jumlahTamu: data.jumlahTamu,
        tipeMeja: data.tipeMeja,
        ...(emailTrimmed ? { email: emailTrimmed } : {}),
        ...(data.catatan?.trim() ? { catatan: data.catatan.trim() } : {}),
        [RESERVATION_HONEYPOT_FIELD]: "",
      };
      const res = await apiRequest("POST", "/api/reservations", payload);
      return res.json();
    },
    onSuccess: (result) => {
      if (result.success) {
        setSubmittedId(result.data?.id ?? null);
        toast({
          title: lang === "ID" ? "Reservasi terkirim" : "Reservation submitted",
          description: result.message,
        });
        form.reset({
          namaLengkap: "",
          noWhatsApp: "",
          email: "",
          outlet: OUTLETS[0].id,
          tanggalReservasi: todayISO(),
          waktuReservasi: "18:00",
          jumlahTamu: 2,
          tipeMeja: "reguler",
          catatan: "",
        });
        setPrivacyAccepted(false);
      } else {
        toast({
          title: "Gagal",
          description:
            result.message || (lang === "ID" ? "Reservasi gagal dikirim" : "Reservation failed"),
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
  const selectedDate = form.watch("tanggalReservasi");
  const selectedTime = form.watch("waktuReservasi");

  const timeSlots = useMemo(
    () => availableTimeSlotsForDate(selectedDate || minDate),
    [selectedDate, minDate],
  );

  useEffect(() => {
    if (timeSlots.length === 0) return;
    if (!timeSlots.includes(selectedTime as (typeof timeSlots)[number])) {
      form.setValue("waktuReservasi", timeSlots[0], { shouldValidate: true });
    }
  }, [form, selectedTime, timeSlots]);

  return (
    <PublicPageLayout>
      <SEOHead pageKey="reservation" />

      <div className="px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-2xl mx-auto space-y-8">
          <section className="text-center">
            <h1 className="text-3xl sm:text-4xl font-serif font-medium text-primary mb-4">
              {t("reservation.title")}
            </h1>
            <div className="w-24 h-px bg-primary mx-auto mb-6" />
            <p className="whitespace-pre-line text-lg text-muted-foreground leading-relaxed">
              {t("reservation.subtitle")}
            </p>
          </section>

          {submittedId ? (
            <Card className="border-green-200 bg-green-50/50 dark:bg-green-950/20">
              <CardContent className="p-8 text-center space-y-4">
                <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto" />
                <h2 className="text-xl font-semibold">
                  {t("reservation.success.title")}
                </h2>
                <p className="text-muted-foreground">
                  {renderTemplate(t("reservation.success.message"), {
                    id: <span className="font-mono text-sm">{submittedId.slice(0, 8)}</span>,
                  })}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button asChild>
                    <a
                      href={`https://wa.me/${COMPANY.whatsapp}?text=${encodeURIComponent(
                        t("reservation.success.whatsappMessage", { id: submittedId.slice(0, 8) }),
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t("reservation.success.whatsappButton")}
                    </a>
                  </Button>
                  <ReservationStatusPanel reservationId={submittedId} lang={lang} />
                  <Button variant="outline" onClick={() => setSubmittedId(null)}>
                    {t("reservation.success.newReservation")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6 sm:p-8">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit((data) => {
                      if (!privacyAccepted) {
                        toast({
                          title: lang === "ID" ? "Persetujuan diperlukan" : "Consent required",
                          description:
                            lang === "ID"
                              ? "Centang Syarat & Ketentuan serta Kebijakan Privasi."
                              : "Please accept the Terms and Privacy Policy.",
                          variant: "destructive",
                        });
                        return;
                      }
                      mutation.mutate(data);
                    })}
                    className="relative space-y-5"
                  >
                    <ReservationHoneypot ref={honeypotRef} />
                    <FormField
                      control={form.control}
                      name="namaLengkap"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("reservation.form.name")}</FormLabel>
                          <FormControl>
                            <Input placeholder={t("reservation.form.namePlaceholder")} {...field} />
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
                            <FormLabel>{t("reservation.form.whatsapp")}</FormLabel>
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
                            <FormLabel>{t("reservation.form.email")}</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="email@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="outlet"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("reservation.form.outlet")}</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={t("reservation.form.outletPlaceholder")} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {OUTLETS.map((o) => (
                                <SelectItem key={o.id} value={o.id}>
                                  {o.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="tanggalReservasi"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("reservation.form.date")}</FormLabel>
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
                                {t("reservation.form.today")}
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
                            <FormLabel>{t("reservation.form.time")}</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder={t("reservation.form.timePlaceholder")} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {timeSlots.map((slot) => (
                                  <SelectItem key={slot} value={slot}>
                                    {slot} {lang === "ID" ? "WIB" : ""}
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
                            <FormLabel>{t("reservation.form.guests")}</FormLabel>
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
                            <FormLabel>{t("reservation.form.tableType")}</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder={t("reservation.form.tableTypePlaceholder")} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="reguler">{t("reservation.form.tableRegular")}</SelectItem>
                                <SelectItem value="vip">{t("reservation.form.tableVip")}</SelectItem>
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
                          <FormLabel>{t("reservation.form.notes")}</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder={t("reservation.form.notesPlaceholder")}
                              rows={3}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <PrivacyConsentField
                      checked={privacyAccepted}
                      onCheckedChange={setPrivacyAccepted}
                      lang={lang}
                      id="reservation-privacy-consent"
                      className="pt-2"
                    />

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full"
                      disabled={mutation.isPending || timeSlots.length === 0}
                    >
                      {mutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {t("reservation.form.submitting")}
                        </>
                      ) : (
                        <>
                          <CalendarDays className="mr-2 h-4 w-4" />
                          {t("reservation.form.submit")}
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}

          <p className="text-sm text-center text-muted-foreground">
            {t("reservation.footerNote")}
          </p>
        </div>
      </div>
    </PublicPageLayout>
  );
}
