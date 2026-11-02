import { ReactNode } from "react";
import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import AdminLogoutButton from "@/components/admin/AdminLogoutButton";

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
  const [, navigate] = useLocation();

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
            {showLogout ? <AdminLogoutButton /> : <div className="w-9" aria-hidden />}
          </div>
        </header>
        {children}
      </div>
    </div>
  );
}
