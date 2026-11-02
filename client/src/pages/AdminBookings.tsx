import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ExternalLink, Loader2 } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import AdminLogoutButton from "@/components/admin/AdminLogoutButton";
import { apiFetch } from "@/lib/api";
import { useSiteLanguage } from "@/lib/language";
import { cateringTypeLabel } from "@shared/catering";
import type { CateringInquiry, Reservation } from "@shared/schema";

type CategoryFilter = "all" | "outlet" | "catering";
type OutletFilter = "all" | "pollux-cikarang" | "bintaro";

type BookingRow =
  | {
      kind: "outlet";
      id: string;
      createdAt: string;
      title: string;
      subtitle: string;
      status: string;
      proofPath: string;
      meta: string;
    }
  | {
      kind: "catering";
      id: string;
      createdAt: string;
      title: string;
      subtitle: string;
      status: string;
      proofPath: string;
      meta: string;
    };

export default function AdminBookings() {
  const [, navigate] = useLocation();
  const { lang } = useSiteLanguage();
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [outlet, setOutlet] = useState<OutletFilter>("all");

  const reservationsQuery = useQuery<{ success: boolean; data: Reservation[] }>({
    queryKey: ["/api/admin/reservations", outlet],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (outlet !== "all") params.set("outlet", outlet);
      const res = await apiFetch(`/api/admin/reservations?${params.toString()}`);
      if (!res.ok) throw new Error("Gagal memuat reservasi");
      return res.json();
    },
  });

  const inquiriesQuery = useQuery<{ success: boolean; data: CateringInquiry[] }>({
    queryKey: ["/api/admin/catering-inquiries"],
    queryFn: async () => {
      const res = await apiFetch("/api/admin/catering-inquiries");
      if (!res.ok) throw new Error("Gagal memuat inquiry");
      return res.json();
    },
  });

  const rows = useMemo(() => {
    const list: BookingRow[] = [];
    for (const r of reservationsQuery.data?.data ?? []) {
      list.push({
        kind: "outlet",
        id: r.id,
        createdAt: String(r.createdAt),
        title: r.namaLengkap,
        subtitle: `${r.outlet === "bintaro" ? "Bintaro" : "Cikarang"} · ${r.tanggalReservasi} ${r.waktuReservasi}`,
        status: r.status,
        proofPath: `/cek-reservasi/${r.id}`,
        meta: `${r.jumlahTamu} tamu · ${r.tipeMeja}`,
      });
    }
    for (const i of inquiriesQuery.data?.data ?? []) {
      list.push({
        kind: "catering",
        id: i.id,
        createdAt: String(i.createdAt),
        title: i.nama,
        subtitle: `${i.source === "kemitraan" ? "Kemitraan" : "Acara"} · ${cateringTypeLabel(i.tipeLayanan)}`,
        status: i.status,
        proofPath: `/cek-inquiry/${i.id}`,
        meta: `${i.tanggalEvent} · ${i.pax} pax`,
      });
    }
    return list
      .filter((row) => {
        if (category === "outlet") return row.kind === "outlet";
        if (category === "catering") return row.kind === "catering";
        return true;
      })
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  }, [reservationsQuery.data, inquiriesQuery.data, category]);

  const loading = reservationsQuery.isLoading || inquiriesQuery.isLoading;

  return (
    <>
      <Helmet>
        <title>Database Pemesanan - Admin Gadang Barubah</title>
      </Helmet>
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-4xl">
          <div className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
            <div className="flex items-center gap-3 p-4">
              <Button variant="ghost" size="icon" onClick={() => navigate("/admin")}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex-1">
                <h1 className="text-lg font-semibold">
                  {lang === "ID" ? "Database Pemesanan" : "Bookings Database"}
                </h1>
                <p className="text-xs text-muted-foreground">
                  {lang === "ID"
                    ? "Reservasi outlet & pemesanan katering B2B"
                    : "Outlet reservations & B2B catering inquiries"}
                </p>
              </div>
              <AdminLogoutButton />
            </div>
          </div>

          <div className="space-y-4 p-4">
            <div className="flex flex-col gap-3 sm:flex-row">
              <Select value={category} onValueChange={(v) => setCategory(v as CategoryFilter)}>
                <SelectTrigger className="sm:w-56">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {lang === "ID" ? "Semua kategori" : "All categories"}
                  </SelectItem>
                  <SelectItem value="outlet">
                    {lang === "ID" ? "Reservasi outlet" : "Outlet reservations"}
                  </SelectItem>
                  <SelectItem value="catering">
                    {lang === "ID" ? "Katering / Acara B2B" : "Catering / B2B events"}
                  </SelectItem>
                </SelectContent>
              </Select>
              <Select value={outlet} onValueChange={(v) => setOutlet(v as OutletFilter)}>
                <SelectTrigger className="sm:w-56" disabled={category === "catering"}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {lang === "ID" ? "Semua outlet" : "All outlets"}
                  </SelectItem>
                  <SelectItem value="pollux-cikarang">Cikarang</SelectItem>
                  <SelectItem value="bintaro">Bintaro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {loading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : rows.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  {lang === "ID" ? "Belum ada data." : "No bookings yet."}
                </CardContent>
              </Card>
            ) : (
              <ul className="space-y-3">
                {rows.map((row) => (
                  <li key={`${row.kind}-${row.id}`}>
                    <Card>
                      <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0 space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant={row.kind === "outlet" ? "default" : "secondary"}>
                              {row.kind === "outlet"
                                ? lang === "ID"
                                  ? "Outlet"
                                  : "Outlet"
                                : "B2B"}
                            </Badge>
                            <Badge variant="outline">{row.status}</Badge>
                            <span className="font-mono text-xs text-muted-foreground">
                              {row.id.slice(0, 8)}
                            </span>
                          </div>
                          <p className="font-medium">{row.title}</p>
                          <p className="text-sm text-muted-foreground">{row.subtitle}</p>
                          <p className="text-xs text-muted-foreground">{row.meta}</p>
                        </div>
                        <Button asChild variant="outline" size="sm" className="shrink-0">
                          <a href={row.proofPath} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            {lang === "ID" ? "Link bukti" : "Proof link"}
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
