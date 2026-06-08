import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2, Shield, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useSiteLanguage } from "@/lib/language";
import { useAdminAuth } from "@/lib/admin-auth";
import {
  ADMIN_PORTAL_CONFIG,
  isOutletReservationPortal,
  roleAllowedForPortal,
  type AdminPortal,
} from "@shared/admin-portals";
import type { AdminRole } from "@shared/schema";

interface LoginAdminProps {
  portal: AdminPortal;
  onSuccess: () => void;
}

export default function LoginAdmin({ portal, onSuccess }: LoginAdminProps) {
  const { lang } = useSiteLanguage();
  const { setUser } = useAdminAuth();
  const portalConfig = ADMIN_PORTAL_CONFIG[portal];
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { toast } = useToast();

  const staffPortal = isOutletReservationPortal(portal);
  const portalTitle =
    lang === "ID"
      ? staffPortal
        ? portalConfig.staffLabelID
        : portalConfig.labelID
      : staffPortal
        ? portalConfig.staffLabelEN
        : portalConfig.labelEN;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password, portal }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (data.locked) {
          const minutes = Math.ceil(data.lockTimeRemaining / 60000);
          setErrorMessage(`Akun terkunci. Coba lagi dalam ${minutes} menit.`);
        } else if (data.attemptsRemaining !== undefined) {
          setErrorMessage(`Login gagal. ${data.attemptsRemaining} percobaan tersisa.`);
        } else {
          setErrorMessage(data.message || "Username atau password salah");
        }
        return;
      }

      const role = data.user?.role as AdminRole | undefined;
      if (!role || !data.user?.id || !roleAllowedForPortal(role, portal)) {
        setErrorMessage(
          lang === "ID"
            ? "Akun tidak memiliki akses ke portal ini."
            : "This account cannot access this portal.",
        );
        return;
      }

      setUser({
        id: data.user.id,
        username: data.user.username,
        role,
      });

      toast({
        title: lang === "ID" ? "Login berhasil" : "Login successful",
        description:
          lang === "ID"
            ? `Selamat datang, ${data.user.username}`
            : `Welcome, ${data.user.username}`,
      });

      onSuccess();
    } catch {
      setErrorMessage("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#300505]">
      <div className="safe-top px-4 pt-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-heroCta text-sm text-white/75 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          {lang === "ID" ? "Kembali ke website" : "Back to website"}
        </Link>
      </div>

      <div className="flex flex-1 items-center justify-center p-4 pb-10">
        <Card className="w-full max-w-md border-white/10 shadow-2xl">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#590000]/15">
              <Shield className="h-7 w-7 text-[#590000]" />
            </div>
            <CardTitle className="text-2xl font-semibold">{portalTitle}</CardTitle>
            <CardDescription className="text-base leading-relaxed">
              {lang === "ID"
                ? staffPortal
                  ? "Masuk untuk melihat dan mengelola permintaan reservasi cabang Anda."
                  : "Masuk untuk mengelola website, reservasi, dan konten."
                : staffPortal
                  ? "Sign in to view and manage your branch reservations."
                  : "Sign in to manage the website, reservations, and content."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage ? (
                <Alert variant="destructive" data-testid="alert-login-error">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              ) : null}

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder={lang === "ID" ? "Masukkan username" : "Enter username"}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  autoFocus
                  data-testid="input-admin-username"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder={lang === "ID" ? "Masukkan password" : "Enter password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  data-testid="input-admin-password"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-[#590000] hover:bg-[#6a0000]"
                disabled={!username || !password || isLoading}
                data-testid="button-admin-login"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {lang === "ID" ? "Memverifikasi..." : "Verifying..."}
                  </>
                ) : lang === "ID" ? (
                  "Masuk"
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>

            {staffPortal ? (
              <p className="mt-4 text-center text-xs text-muted-foreground">
                {lang === "ID"
                  ? "Portal ini khusus staff reservasi cabang — tanpa akses popup atau pengaturan admin."
                  : "Branch reservation staff only — no popup or admin settings access."}
              </p>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
