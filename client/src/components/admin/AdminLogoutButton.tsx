import { useState } from "react";
import { useLocation } from "wouter";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAdminAuth } from "@/lib/admin-auth";
import { loginPathForPortal, portalFromPath } from "@shared/admin-portals";

export default function AdminLogoutButton() {
  const [location] = useLocation();
  const { toast } = useToast();
  const { logout } = useAdminAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    const portal = portalFromPath(location) ?? "main";
    const ok = await logout();
    if (ok) {
      window.location.replace(loginPathForPortal(portal));
      return;
    }
    toast({
      title: "Logout gagal",
      description: "Periksa koneksi internet lalu coba lagi.",
      variant: "destructive",
    });
    setLoggingOut(false);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleLogout}
      disabled={loggingOut}
      aria-label="Logout"
      title="Logout"
      data-testid="button-admin-logout"
    >
      <LogOut className="h-5 w-5" />
    </Button>
  );
}
