import { ReactNode, useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import { useToast } from "@/hooks/use-toast";
import { useAdminAuth } from "@/lib/admin-auth";
import { loginPathForPortal, portalFromPath } from "@shared/admin-portals";

interface AdminShellProps {
  title: string;
  subtitle?: string;
  backHref?: string;
  showLogout?: boolean;
  children: ReactNode;
  maxWidth?: "md" | "lg" | "xl" | "6xl";
}

const WIDTH: Record<NonNullable<AdminShellProps["maxWidth"]>, string> = {
  md: "max-w-md",
  lg: "max-w-4xl",
  xl: "max-w-5xl",
  "6xl": "max-w-6xl",
};

export default function AdminShell({
  title,
  subtitle,
  backHref = "/",
  showLogout = true,
  children,
  maxWidth = "6xl",
}: AdminShellProps) {
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const { logout } = useAdminAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      const ok = await logout();
      if (ok) {
        toast({ title: "Logout berhasil" });
        const portal = portalFromPath(location) ?? "main";
        navigate(loginPathForPortal(portal));
      } else {
        toast({ title: "Logout gagal", variant: "destructive" });
      }
    } catch {
      toast({ title: "Logout gagal", variant: "destructive" });
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-ivory">
      <div className={`${WIDTH[maxWidth]} mx-auto`}>
        <header className="sticky top-0 z-50 border-b border-border/50 bg-ivory/95 backdrop-blur-md">
          <div className="flex items-center justify-between gap-3 p-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(backHref)} aria-label="Kembali">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex min-w-0 flex-1 items-center justify-center gap-2">
              <Logo />
              <div className="min-w-0 text-center sm:text-left">
                <h1 className="truncate text-base font-semibold sm:text-lg">{title}</h1>
                {subtitle ? (
                  <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
                ) : null}
              </div>
            </div>
            {showLogout ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                disabled={loggingOut}
                aria-label="Logout"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            ) : (
              <div className="w-9" aria-hidden />
            )}
          </div>
        </header>
        {children}
      </div>
    </div>
  );
}
