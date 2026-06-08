import { useEffect, useMemo } from "react";
import { useLocation, useSearch } from "wouter";
import LoginAdmin from "@/components/LoginAdmin";
import RouteFallback from "@/components/RouteFallback";
import { useAdminAuth } from "@/lib/admin-auth";
import { homePathForRole } from "@shared/admin-portals";

function safeAdminNextPath(next: string | null): string {
  if (!next || !next.startsWith("/admin") || next.startsWith("/admin/login")) {
    return "/admin";
  }
  return next;
}

export default function AdminLoginPage() {
  const [, navigate] = useLocation();
  const searchString = useSearch();
  const { loading, user, role } = useAdminAuth();

  const nextPath = useMemo(() => {
    const next = new URLSearchParams(searchString).get("next");
    return safeAdminNextPath(next);
  }, [searchString]);

  useEffect(() => {
    if (!loading && user && role) {
      if (role === "admin_main") {
        navigate(nextPath, { replace: true });
      } else {
        navigate(homePathForRole(role), { replace: true });
      }
    }
  }, [loading, user, role, nextPath, navigate]);

  if (loading) return <RouteFallback />;
  if (user && role) return <RouteFallback />;

  return (
    <LoginAdmin
      portal="main"
      onSuccess={() => navigate(nextPath, { replace: true })}
    />
  );
}
