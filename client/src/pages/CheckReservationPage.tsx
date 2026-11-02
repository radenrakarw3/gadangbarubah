import { useQuery } from "@tanstack/react-query";
import { Link, useRoute } from "wouter";
import { Loader2 } from "lucide-react";
import PublicPageLayout from "@/components/PublicPageLayout";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useSiteLanguage } from "@/lib/language";
import type { PublicReservationStatusPayload } from "@shared/public-reservation";
import { isReservationPublicId } from "@shared/public-reservation";

type StatusResponse =
  | { success: true; data: PublicReservationStatusPayload }
  | { success: false; message?: string };

export default function CheckReservationPage() {
  const { lang } = useSiteLanguage();
  const [, params] = useRoute("/cek-reservasi/:id");
  const id = params?.id ?? "";
  const validId = isReservationPublicId(id);

  const { data, isLoading, isError, refetch, isFetching } = useQuery<StatusResponse>({
    queryKey: ["reservation-status", id],
    enabled: validId,
    queryFn: async () => {
      const res = await fetch(`/api/reservations/${id}/status`);
      return res.json();
    },
    refetchOnWindowFocus: true,
  });

  const payload = data?.success ? data.data : null;
  const errorMessage =
    !validId
      ? lang === "ID"
        ? "ID reservasi tidak valid."
        : "Invalid reservation ID."
      : isError || (data && !data.success)
        ? data && !data.success
          ? data.message ?? (lang === "ID" ? "Reservasi tidak ditemukan." : "Reservation not found.")
          : lang === "ID"
            ? "Gagal memuat status."
            : "Failed to load status."
        : null;

  return (
    <PublicPageLayout>
      <SEOHead pageKey="reservation" />

      <div className="px-4 sm:px-6 lg:px-8 py-10">
        <div className="mx-auto max-w-lg space-y-6">
          <section className="text-center">
            <h1 className="mb-4 font-serif text-3xl font-medium text-primary sm:text-4xl">
              {lang === "ID" ? "Status Reservasi" : "Reservation Status"}
            </h1>
            <div className="mx-auto mb-6 h-px w-24 bg-primary" />
            <p className="text-muted-foreground">
              {lang === "ID"
                ? "Tampilkan halaman ini ke admin WhatsApp untuk verifikasi pemesanan."
                : "Show this page to the WhatsApp admin to verify the booking."}
            </p>
          </section>

          <Card>
            <CardContent className="space-y-4 p-6">
              {isLoading ? (
                <div className="flex items-center justify-center gap-2 py-8 text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  {lang === "ID" ? "Memuat..." : "Loading..."}
                </div>
              ) : errorMessage ? (
                <p className="text-center text-destructive">{errorMessage}</p>
              ) : payload ? (
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">ID</dt>
                    <dd className="font-mono font-medium">{payload.shortId}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">
                      {lang === "ID" ? "Status" : "Status"}
                    </dt>
                    <dd className="font-medium text-primary">{payload.statusLabel}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">
                      {lang === "ID" ? "Outlet" : "Outlet"}
                    </dt>
                    <dd className="font-medium text-right">{payload.outletLabel}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">
                      {lang === "ID" ? "Tanggal" : "Date"}
                    </dt>
                    <dd className="font-medium">
                      {payload.tanggalReservasi} · {payload.waktuReservasi} WIB
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">
                      {lang === "ID" ? "Jumlah tamu" : "Guests"}
                    </dt>
                    <dd className="font-medium">{payload.jumlahTamu}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">
                      {lang === "ID" ? "Tipe meja" : "Table type"}
                    </dt>
                    <dd className="font-medium">
                      {payload.tipeMeja === "vip" ? "VIP Room" : "Reguler"}
                    </dd>
                  </div>
                </dl>
              ) : null}

              <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:justify-center">
                {validId ? (
                  <Button
                    variant="outline"
                    onClick={() => refetch()}
                    disabled={isFetching}
                  >
                    {isFetching ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {lang === "ID" ? "Muat ulang" : "Refresh"}
                  </Button>
                ) : null}
                <Button asChild>
                  <Link href="/reservasi">
                    {lang === "ID" ? "Buat reservasi baru" : "New reservation"}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PublicPageLayout>
  );
}
