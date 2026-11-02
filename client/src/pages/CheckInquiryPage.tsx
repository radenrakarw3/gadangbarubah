import { useQuery } from "@tanstack/react-query";
import { Link, useRoute } from "wouter";
import { Loader2 } from "lucide-react";
import PublicPageLayout from "@/components/PublicPageLayout";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useSiteLanguage } from "@/lib/language";
import type { PublicCateringStatusPayload } from "@shared/public-catering";
import { isCateringPublicId } from "@shared/public-catering";

type StatusResponse =
  | { success: true; data: PublicCateringStatusPayload }
  | { success: false; message?: string };

export default function CheckInquiryPage() {
  const { lang } = useSiteLanguage();
  const [, params] = useRoute("/cek-inquiry/:id");
  const id = params?.id ?? "";
  const validId = isCateringPublicId(id);

  const { data, isLoading, isError, refetch, isFetching } = useQuery<StatusResponse>({
    queryKey: ["catering-status", id],
    enabled: validId,
    queryFn: async () => {
      const res = await fetch(`/api/catering-inquiries/${id}/status`);
      return res.json();
    },
    refetchOnWindowFocus: true,
  });

  const payload = data?.success ? data.data : null;
  const errorMessage = !validId
    ? lang === "ID"
      ? "ID permintaan tidak valid."
      : "Invalid inquiry ID."
    : isError || (data && !data.success)
      ? data && !data.success
        ? data.message ??
          (lang === "ID" ? "Permintaan tidak ditemukan." : "Inquiry not found.")
        : lang === "ID"
          ? "Gagal memuat status."
          : "Failed to load status."
      : null;

  return (
    <PublicPageLayout>
      <SEOHead pageKey="catering" />
      <div className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-lg space-y-6">
          <section className="text-center">
            <h1 className="mb-4 font-serif text-3xl font-medium text-primary sm:text-4xl">
              {lang === "ID" ? "Status Pemesanan Acara" : "Event Inquiry Status"}
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
                    <dt className="text-muted-foreground">Status</dt>
                    <dd className="font-medium text-primary">{payload.statusLabel}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">
                      {lang === "ID" ? "PIC" : "PIC"}
                    </dt>
                    <dd className="font-medium">{payload.nama}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">
                      {lang === "ID" ? "Layanan" : "Service"}
                    </dt>
                    <dd className="font-medium text-right">{payload.tipeLabel}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">
                      {lang === "ID" ? "Tanggal" : "Date"}
                    </dt>
                    <dd className="font-medium">{payload.tanggalEvent}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">Pax</dt>
                    <dd className="font-medium">{payload.pax}</dd>
                  </div>
                </dl>
              ) : null}

              <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:justify-center">
                {validId ? (
                  <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
                    {isFetching ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {lang === "ID" ? "Muat ulang" : "Refresh"}
                  </Button>
                ) : null}
                <Button asChild>
                  <Link href="/catering">
                    {lang === "ID" ? "Ke halaman katering" : "Go to catering"}
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
