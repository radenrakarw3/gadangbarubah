import { memo, useEffect, useState, type ReactNode } from "react";
import { useLocation } from "wouter";
import LoginAdmin from "@/components/LoginAdmin";
import RouteFallback from "@/components/RouteFallback";
import {
  ADMIN_PORTAL_CONFIG,
  portalForRole,
  roleAllowedForPortal,
  type AdminPortal,
} from "@shared/admin-portals";
import type { AdminRole } from "@shared/schema";

export function ProtectedAdminRoute({
  portal,
  children,
}: {
  portal: AdminPortal;
  children: ReactNode;
}) {
  const [, navigate] = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [recheckTrigger, setRecheckTrigger] = useState(0);

  useEffect(() => {
    const checkSession = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/auth/session", { credentials: "include" });
        if (!response.ok) {
          setIsAuthenticated(false);
          return;
        }

        const data = await response.json();
        const role = data.role as AdminRole | undefined;

        if (!data.authenticated || !role) {
          setIsAuthenticated(false);
          return;
        }

        if (roleAllowedForPortal(role, portal)) {
          setIsAuthenticated(true);
          return;
        }

        const userPortal = portalForRole(role);
        if (userPortal) {
          navigate(ADMIN_PORTAL_CONFIG[userPortal].basePath);
          return;
        }

        setIsAuthenticated(false);
      } catch {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, [portal, recheckTrigger, navigate]);

  const handleLogin = () => setRecheckTrigger((prev) => prev + 1);

  if (isLoading) return <RouteFallback />;
  if (!isAuthenticated) return <LoginAdmin portal={portal} onLogin={handleLogin} />;
  return <>{children}</>;
}

export default memo(ProtectedAdminRoute);
