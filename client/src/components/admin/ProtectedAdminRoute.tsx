import { memo, useEffect, type ReactNode } from "react";
import { useLocation } from "wouter";
import LoginAdmin from "@/components/LoginAdmin";
import RouteFallback from "@/components/RouteFallback";
import { useAdminAuth } from "@/lib/admin-auth";
import {
  homePathForRole,
  loginPathForPortal,
  roleAllowedForPortal,
  type AdminPortal,
} from "@shared/admin-portals";

function safeAdminNextPath(path: string): string {
  if (!path.startsWith("/admin") || path.startsWith("/admin/login")) {
    return "/admin";
  }
  return path;
}

export function ProtectedAdminRoute({
  portal,
  children,
}: {
  portal: AdminPortal;
  children: ReactNode;
}) {
  const [location, navigate] = useLocation();
  const { loading, user, role } = useAdminAuth();

  useEffect(() => {
    if (loading) return;

    if (user && role && !roleAllowedForPortal(role, portal)) {
      navigate(homePathForRole(role), { replace: true });
      return;
    }

    if (!user && portal === "main") {
      const next = encodeURIComponent(safeAdminNextPath(location));
      navigate(`${loginPathForPortal("main")}?next=${next}`, { replace: true });
    }
  }, [loading, user, role, portal, location, navigate]);

  if (loading) return <RouteFallback />;

  if (!user || !role) {
    if (portal === "main") return <RouteFallback />;
    return (
      <LoginAdmin
        portal={portal}
        onSuccess={() => {
          /* session sudah di-set — render ulang menampilkan children */
        }}
      />
    );
  }

  if (!roleAllowedForPortal(role, portal)) {
    return <RouteFallback />;
  }

  return <>{children}</>;
}

export default memo(ProtectedAdminRoute);
