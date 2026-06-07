import { Suspense, lazy, type ComponentType } from "react";
import RouteFallback from "@/components/RouteFallback";
import ProtectedAdminRoute from "@/components/admin/ProtectedAdminRoute";
import type { AdminPortal } from "@shared/admin-portals";

const AdminDashboard = lazy(() => import("@/pages/AdminDashboard"));
const AdminCampaigns = lazy(() => import("@/pages/AdminCampaigns"));
const AdminUsers = lazy(() => import("@/pages/AdminUsers"));
const AdminReservations = lazy(() => import("@/pages/AdminReservations"));
const AdminEmails = lazy(() => import("@/pages/AdminEmails"));

function withPortalPage(Component: ComponentType<{ portal: AdminPortal }>, portal: AdminPortal) {
  return function PortalPage() {
    return (
      <ProtectedAdminRoute portal={portal}>
        <Suspense fallback={<RouteFallback />}>
          <Component portal={portal} />
        </Suspense>
      </ProtectedAdminRoute>
    );
  };
}

export const MainAdminDashboard = withPortalPage(AdminDashboard, "main");
export const CikarangAdminDashboard = withPortalPage(AdminDashboard, "cikarang");
export const BintaroAdminDashboard = withPortalPage(AdminDashboard, "bintaro");

export const MainAdminReservations = withPortalPage(AdminReservations, "main");
export const CikarangAdminReservations = withPortalPage(AdminReservations, "cikarang");
export const BintaroAdminReservations = withPortalPage(AdminReservations, "bintaro");

export function MainAdminOnlyPage({ component: Component }: { component: ComponentType }) {
  return (
    <ProtectedAdminRoute portal="main">
      <Suspense fallback={<RouteFallback />}>
        <Component />
      </Suspense>
    </ProtectedAdminRoute>
  );
}

export { AdminCampaigns, AdminUsers, AdminEmails };
