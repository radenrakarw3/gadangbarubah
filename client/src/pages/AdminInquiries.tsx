import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader2, MessageCircle } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AdminShell from "@/components/admin/AdminShell";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, parseApiError, queryClient } from "@/lib/queryClient";
import {
  CATERING_INQUIRY_STATUSES,
  cateringTypeLabel,
  type CateringInquiryStatus,
} from "@shared/catering";
import type { CateringInquiry } from "@shared/schema";

const QUERY_KEY = ["/api/admin/catering-inquiries"];

const STATUS_LABEL: Record<CateringInquiryStatus, string> = {
  pending: "Baru",
  contacted: "Sudah dihubungi",
  closed: "Selesai",
};

const SOURCE_LABEL: Record<string, string> = {
  acara: "Katering & Acara",
  kemitraan: "Kemitraan",
};

type SourceFilter = "all" | "acara" | "kemitraan";

export default function AdminInquiries() {
  const { toast } = useToast();
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>("all");

  const { data, isLoading } = useQuery<{ success: boolean; data: CateringInquiry[] }>({
    queryKey: QUERY_KEY,
    refetchInterval: 60_000,
  });

  const inquiries = useMemo(() => {
    const rows = data?.data ?? [];
    return sourceFilter === "all" ? rows : rows.filter((r) => r.source === sourceFilter);
  }, [data, sourceFilter]);

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: CateringInquiryStatus }) => {
      const res = await apiRequest("PATCH", `/api/admin/catering-inquiries/${id}/status`, { status });
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Status permintaan diperbarui" });
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (err) => {
      toast({ title: "Gagal memperbarui status", description: parseApiError(err), variant: "destructive" });
    },
  });

  return (
    <>
      <Helmet>
        <title>Permintaan Acara & Kemitraan - Admin Gadang Barubah</title>
      </Helmet>

      <AdminShell
        title="Permintaan Acara & Kemitraan"
        subtitle="Data dari form Katering & Acara dan halaman Kemitraan"
        backHref="/admin"
        maxWidth="xl"
      >
        <div className="space-y-4 p-4 lg:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">{inquiries.length} permintaan</p>
            <Select value={sourceFilter} onValueChange={(v) => setSourceFilter(v as SourceFilter)}>
              <SelectTrigger className="w-[220px]" aria-label="Filter sumber">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua sumber</SelectItem>
                <SelectItem value="acara">Katering & Acara</SelectItem>
                <SelectItem value="kemitraan">Kemitraan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : inquiries.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                Belum ada permintaan.
              </CardContent>
            </Card>
          ) : (
            inquiries.map((inq) => {
              const status = inq.status as CateringInquiryStatus;
              const waNumber = inq.noWhatsApp.replace(/^0/, "62");
              return (
                <Card key={inq.id} data-testid={`card-inquiry-${inq.id}`}>
                  <CardContent className="space-y-3 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold">{inq.nama}</h3>
                        <p className="text-xs text-muted-foreground">
                          Masuk {format(new Date(inq.createdAt), "dd MMM yyyy HH:mm")} · Ref {inq.id.slice(0, 8)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline">{SOURCE_LABEL[inq.source] ?? inq.source}</Badge>
                        <Badge variant={status === "pending" ? "default" : "secondary"}>
                          {STATUS_LABEL[status] ?? inq.status}
                        </Badge>
                      </div>
                    </div>

                    <dl className="grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
                      <div><dt className="inline text-muted-foreground">Layanan: </dt><dd className="inline">{cateringTypeLabel(inq.tipeLayanan)}</dd></div>
                      <div><dt className="inline text-muted-foreground">Jumlah pax: </dt><dd className="inline">{inq.pax}</dd></div>
                      <div><dt className="inline text-muted-foreground">Tanggal acara: </dt><dd className="inline">{inq.tanggalEvent}</dd></div>
                      <div><dt className="inline text-muted-foreground">Lokasi: </dt><dd className="inline">{inq.lokasiEvent}</dd></div>
                      <div className="sm:col-span-2"><dt className="inline text-muted-foreground">Detail: </dt><dd className="inline">{inq.eventDetail}</dd></div>
                    </dl>

                    <div className="flex flex-wrap items-center gap-2">
                      <Button size="sm" variant="outline" className="gap-2" asChild>
                        <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noopener noreferrer">
                          <MessageCircle className="h-4 w-4" />
                          {inq.noWhatsApp}
                        </a>
                      </Button>
                      <Select
                        value={status}
                        onValueChange={(v) =>
                          statusMutation.mutate({ id: inq.id, status: v as CateringInquiryStatus })
                        }
                        disabled={statusMutation.isPending}
                      >
                        <SelectTrigger className="h-9 w-[180px]" aria-label="Ubah status">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {CATERING_INQUIRY_STATUSES.map((s) => (
                            <SelectItem key={s} value={s}>
                              {STATUS_LABEL[s]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </AdminShell>
    </>
  );
}
