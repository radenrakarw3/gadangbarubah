import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CalendarDays,
  Monitor,
  UserCog,
  Loader2,
  Utensils,
  ArrowRight,
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import AdminShell from "@/components/admin/AdminShell";
import { apiFetch } from "@/lib/api";

type AdminStats = {
  totalReservations: number;
  pendingReservations: number;
  confirmedReservations: number;
  staffCount: number;
  hasActiveCampaign: boolean;
  todayTotal: number;
  todayPending: number;
  todayConfirmed: number;
  todayArrived: number;
  todayDining: number;
  todayCompleted: number;
  currentlyDining: number;
};

export default function AdminDashboard() {
  const [, navigate] = useLocation();

  const { data: statsData, isLoading: statsLoading } = useQuery<{
    success: boolean;
    data: AdminStats;
  }>({
    queryKey: ["/api/admin/stats"],
    queryFn: async () => {
      const response = await apiFetch("/api/admin/stats");
      if (!response.ok) throw new Error("Gagal memuat ringkasan");
      return response.json();
    },
    refetchInterval: 60_000,
  });

  const stats = statsData?.data;

  const adminFeatures = [
    {
      id: "campaigns",
      title: "Kelola Popup",
      description: "Upload dan kelola popup campaign untuk landing page",
      icon: Monitor,
      route: "/admin/campaigns",
      color: "bg-pink-500",
    },
    {
      id: "users",
      title: "Kelola Admin",
      description: "Tambah atau hapus akun administrator",
      icon: UserCog,
      route: "/admin/users",
      color: "bg-slate-600",
    },
  ];

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - Gadang Barubah</title>
        <meta name="description" content="Dashboard admin Gadang Barubah" />
      </Helmet>

      <AdminShell
        title="Admin Panel"
        subtitle="Dashboard operasional"
        backHref="/"
        showLogout
        maxWidth="6xl"
      >
        <div className="p-4 lg:p-6 space-y-6">
          <div className="text-center lg:text-left">
            <h2 className="text-2xl font-bold mb-1">Dashboard Admin</h2>
            <p className="text-muted-foreground">Pantau operasional hari ini & kelola konten</p>
          </div>

          {/* CTA operasional */}
          <Card className="border-gold/30 bg-gradient-to-br from-card to-gold/5">
            <CardContent className="p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
                    Operasional
                  </p>
                  <h3 className="text-xl font-semibold mb-1">Reservasi Hari Ini</h3>
                  <p className="text-sm text-muted-foreground">
                    {statsLoading
                      ? "Memuat…"
                      : `${stats?.todayTotal ?? 0} reservasi · ${stats?.currentlyDining ?? 0} sedang makan`}
                  </p>
                </div>
                <Button
                  className="btn-reserve rounded-none h-11 px-6 gap-2 shrink-0"
                  onClick={() => navigate("/admin/reservations?filter=today")}
                >
                  <CalendarDays className="h-4 w-4" />
                  Buka Operasional Hari Ini
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Metrik hari ini */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Utensils className="h-5 w-5 text-primary" />
                Ringkasan Hari Ini
              </CardTitle>
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="text-center bg-amber-50 rounded-lg p-4 border border-amber-100">
                    <p className="text-2xl font-bold text-amber-900">{stats?.todayPending ?? 0}</p>
                    <p className="text-xs text-muted-foreground mt-1">Menunggu</p>
                  </div>
                  <div className="text-center bg-blue-50 rounded-lg p-4 border border-blue-100">
                    <p className="text-2xl font-bold text-blue-900">{stats?.todayConfirmed ?? 0}</p>
                    <p className="text-xs text-muted-foreground mt-1">Dikonfirmasi</p>
                  </div>
                  <div className="text-center bg-violet-50 rounded-lg p-4 border border-violet-100">
                    <p className="text-2xl font-bold text-violet-900">{stats?.todayDining ?? 0}</p>
                    <p className="text-xs text-muted-foreground mt-1">Sedang Makan</p>
                  </div>
                  <div className="text-center bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <p className="text-2xl font-bold text-slate-800">{stats?.todayCompleted ?? 0}</p>
                    <p className="text-xs text-muted-foreground mt-1">Sudah Pulang</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Fitur lain */}
          <div className="grid gap-4 sm:grid-cols-2">
            {adminFeatures.map((feature) => {
              const IconComponent = feature.icon;
              return (
                <Card
                  key={feature.id}
                  className="hover-elevate cursor-pointer"
                  onClick={() => navigate(feature.route)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`${feature.color} p-3 rounded-lg`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">{feature.title}</h3>
                        <p className="text-muted-foreground text-sm">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Ringkasan umum */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Statistik Keseluruhan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-primary">
                    {statsLoading ? "—" : (stats?.totalReservations ?? 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Reservasi</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">
                    {statsLoading ? "—" : (stats?.pendingReservations ?? 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Menunggu (semua)</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">
                    {statsLoading ? "—" : (stats?.confirmedReservations ?? 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Dikonfirmasi (semua)</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">
                    {statsLoading ? "—" : (stats?.staffCount ?? 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Admin</p>
                </div>
              </div>
              {stats && !statsLoading && (
                <p className="text-xs text-center text-muted-foreground mt-4">
                  Popup landing: {stats.hasActiveCampaign ? "aktif" : "tidak ada yang aktif"}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </AdminShell>
    </>
  );
}
