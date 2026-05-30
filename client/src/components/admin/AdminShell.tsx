import { ReactNode, useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Logo from "@/components/Logo";
import { useToast } from "@/hooks/use-toast";
import { apiFetch } from "@/lib/api";

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
  backHref = "/admin",
  showLogout = false,
  children,
  maxWidth = "6xl",
}: AdminShellProps) {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      const res = await apiFetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        toast({ title: "Logout berhasil" });
        navigate("/");
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
        <header className="sticky top-0 z-50 bg-ivory/95 backdrop-blur-md border-b border-border/50">
          <div className="flex items-center justify-between gap-3 p-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(backHref)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2 flex-1 min-w-0 justify-center">
              <Logo />
              <div className="min-w-0 text-center sm:text-left">
                <h1 className="font-semibold text-base sm:text-lg truncate">{title}</h1>
                {subtitle && (
                  <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
                )}
              </div>
            </div>
            {showLogout ? (
              <Button variant="ghost" size="icon" onClick={handleLogout} disabled={loggingOut}>
                <LogOut className="h-5 w-5" />
              </Button>
            ) : (
              <Badge variant="secondary" className="text-[10px] shrink-0">
                Admin
              </Badge>
            )}
          </div>
        </header>
        {children}
      </div>
    </div>
  );
}
