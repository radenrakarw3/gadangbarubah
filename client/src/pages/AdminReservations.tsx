import { useEffect, useState, useMemo } from "react";
import { useLocation, useSearch } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { CalendarDays, Loader2, RefreshCw } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AdminShell from "@/components/admin/AdminShell";
import ReservationCard from "@/components/admin/ReservationCard";
import ReservationDetailSheet from "@/components/admin/ReservationDetailSheet";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { apiFetch } from "@/lib/api";
import { OUTLETS, todayISO } from "@/lib/siteContent";
import type { ReservationRow } from "@/lib/reservation-admin";
import type { ReservationStatus } from "@shared/reservation-status";
import {
  ADMIN_PORTAL_CONFIG,
  isOutletReservationPortal,
  type AdminPortal,
} from "@shared/admin-portals";

type FilterTab = "today" | "tomorrow" | "all" | "cancelled";

function tomorrowISO() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function buildQueryUrl(baseApi: string, tab: FilterTab): string {
  const params = new URLSearchParams();
  if (tab === "today") params.set("date", todayISO());
  else if (tab === "tomorrow") params.set("date", tomorrowISO());
  else if (tab === "cancelled") params.set("status", "cancelled");
  const qs = params.toString();
  return qs ? `${baseApi}?${qs}` : baseApi;
}

const TABS: { id: FilterTab; label: string }[] = [
  { id: "today", label: "Hari Ini" },
  { id: "tomorrow", label: "Besok" },
  { id: "all", label: "Semua" },
  { id: "cancelled", label: "Batal" },
];

export default function AdminReservations({ portal }: { portal: AdminPortal }) {
  const [, navigate] = useLocation();
  const searchString = useSearch();
  const { toast } = useToast();
  const portalConfig = ADMIN_PORTAL_CONFIG[portal];
  const staffOnly = isOutletReservationPortal(portal);
  const outletLabel =
    OUTLETS.find((o) => o.id === portalConfig.outletId)?.label ?? portalConfig.staffLabelID;
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [detailRes, setDetailRes] = useState<ReservationRow | null>(null);

  const initialTab = useMemo((): FilterTab => {
    const p = new URLSearchParams(searchString);
    const f = p.get("filter");
    if (f === "tomorrow") return "tomorrow";
    if (f === "all") return "all";
    if (f === "cancelled") return "cancelled";
    return "today";
  }, [searchString]);

  const [tab, setTab] = useState<FilterTab>(initialTab);

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  const handleTabChange = (next: FilterTab) => {
    setTab(next);
    const params = new URLSearchParams();
    if (next !== "today") params.set("filter", next);
    const qs = params.toString();
    const path = portalConfig.reservationsPath ?? portalConfig.dashboardPath;
    navigate(`${path}${qs ? `?${qs}` : ""}`, { replace: true });
  };

  const reservationsApi = portalConfig.reservationsApi;
  const statusApiPrefix = portalConfig.statusApiPrefix;
  const hasReservationAccess = Boolean(reservationsApi && statusApiPrefix);

  useEffect(() => {
    if (!hasReservationAccess) {
      navigate(portalConfig.dashboardPath, { replace: true });
    }
  }, [hasReservationAccess, navigate, portalConfig.dashboardPath]);

  const queryUrl = reservationsApi ? buildQueryUrl(reservationsApi, tab) : "";

  const { data, isLoading, isFetching, refetch } = useQuery<{
    success: boolean;
    data: ReservationRow[];
  }>({
    queryKey: [queryUrl],
    queryFn: async () => {
      const res = await apiFetch(queryUrl);
      if (!res.ok) throw new Error("Gagal memuat reservasi");
      return res.json();
    },
    enabled: hasReservationAccess,
    refetchInterval: tab === "today" ? 45_000 : false,
  });

  const { data: statsData } = useQuery({
    queryKey: [portalConfig.statsApi],
    queryFn: async () => {
      const res = await apiFetch(portalConfig.statsApi);
      if (!res.ok) throw new Error("Gagal memuat statistik");
      return res.json();
    },
    enabled: hasReservationAccess,
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: ReservationStatus }) => {
      const res = await apiFetch(`${statusApiPrefix}/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Gagal memperbarui status");
      }
      return res.json();
    },
    onSuccess: (result, vars) => {
      queryClient.invalidateQueries({ queryKey: [queryUrl] });
      queryClient.invalidateQueries({ queryKey: [portalConfig.statsApi] });
      queryClient.invalidateQueries({
        predicate: (q) =>
          reservationsApi ? String(q.queryKey[0]).startsWith(reservationsApi) : false,
      });
      toast({ title: "Status diperbarui" });
      if (detailRes?.id === vars.id && result?.data) {
        setDetailRes(result.data);
      }
    },
    onError: (error: Error) => {
      toast({ title: "Gagal", description: error.message, variant: "destructive" });
    },
    onSettled: () => setUpdatingId(null),
  });

  const reservations = data?.data ?? [];
  const stats = statsData?.data;

  if (!hasReservationAccess) {
    return null;
  }

  const handleStatusChange = (id: string, status: ReservationStatus) => {
    setUpdatingId(id);
    updateMutation.mutate({ id, status });
  };

  return (
    <>
      <Helmet>
        <title>Operasional Reservasi - Admin Gadang Barubah</title>
      </Helmet>

      <AdminShell
        title={staffOnly ? portalConfig.staffLabelID : "Operasional Reservasi"}
        subtitle={staffOnly ? outletLabel : portalConfig.labelID}
        backHref={portalConfig.dashboardPath}
        showLogout
      >
        <div className="p-4 lg:p-6">
          <div className="lg:grid lg:grid-cols-[240px_1fr] lg:gap-6">
            {/* Sidebar ringkasan — desktop */}
            <aside className="hidden lg:block space-y-4">
              <Card className="border-gold/20">
                <CardContent className="p-4 space-y-3">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
                    Hari Ini
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="bg-muted/40 rounded p-2">
                      <p className="text-xl font-bold text-primary">{stats?.todayPending ?? "—"}</p>
                      <p className="text-[10px] text-muted-foreground">Menunggu</p>
                    </div>
                    <div className="bg-muted/40 rounded p-2">
                      <p className="text-xl font-bold text-primary">{stats?.todayConfirmed ?? "—"}</p>
                      <p className="text-[10px] text-muted-foreground">Dikonfirmasi</p>
                    </div>
                    <div className="bg-muted/40 rounded p-2">
                      <p className="text-xl font-bold text-violet-700">{stats?.todayDining ?? "—"}</p>
                      <p className="text-[10px] text-muted-foreground">Sedang Makan</p>
                    </div>
                    <div className="bg-muted/40 rounded p-2">
                      <p className="text-xl font-bold">{stats?.todayCompleted ?? "—"}</p>
                      <p className="text-[10px] text-muted-foreground">Pulang</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    Total hari ini: {stats?.todayTotal ?? 0} reservasi
                  </p>
                </CardContent>
              </Card>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate(portalConfig.dashboardPath)}
              >
                Kembali ke Dashboard
              </Button>
            </aside>

            <div className="space-y-4">
              {/* Mobile stats strip */}
              <div className="lg:hidden grid grid-cols-4 gap-2 text-center text-xs">
                <div className="bg-card border rounded p-2">
                  <p className="font-bold text-primary">{stats?.todayPending ?? 0}</p>
                  <p className="text-muted-foreground">Tunggu</p>
                </div>
                <div className="bg-card border rounded p-2">
                  <p className="font-bold">{stats?.todayConfirmed ?? 0}</p>
                  <p className="text-muted-foreground">Konfirm</p>
                </div>
                <div className="bg-card border rounded p-2">
                  <p className="font-bold text-violet-700">{stats?.todayDining ?? 0}</p>
                  <p className="text-muted-foreground">Makan</p>
                </div>
                <div className="bg-card border rounded p-2">
                  <p className="font-bold">{stats?.todayCompleted ?? 0}</p>
                  <p className="text-muted-foreground">Pulang</p>
                </div>
              </div>

              {/* Filter tabs */}
              <div className="flex flex-wrap gap-2 items-center">
                {TABS.map((t) => (
                  <Button
                    key={t.id}
                    variant={tab === t.id ? "default" : "outline"}
                    size="sm"
                    className={tab === t.id ? "btn-reserve" : "rounded-none"}
                    onClick={() => handleTabChange(t.id)}
                  >
                    {t.label}
                  </Button>
                ))}
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-auto"
                  onClick={() => refetch()}
                  disabled={isFetching}
                >
                  <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
                </Button>
              </div>

              {isLoading ? (
                <div className="flex justify-center py-16">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : reservations.length === 0 ? (
                <Card>
                  <CardContent className="p-10 text-center text-muted-foreground">
                    <CalendarDays className="h-10 w-10 mx-auto mb-3 opacity-40" />
                    <p>Tidak ada reservasi untuk filter ini</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {reservations.map((item) => (
                    <ReservationCard
                      key={item.id}
                      reservation={item}
                      updating={updatingId === item.id}
                      onStatusChange={handleStatusChange}
                      onOpenDetail={setDetailRes}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </AdminShell>

      <ReservationDetailSheet
        reservation={detailRes}
        open={!!detailRes}
        onOpenChange={(open) => !open && setDetailRes(null)}
      />
    </>
  );
}
