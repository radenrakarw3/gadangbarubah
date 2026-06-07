import type { AdminRole } from "./schema";

export type AdminPortal = "main" | "cikarang" | "bintaro";

export type AdminPortalConfig = {
  basePath: string;
  reservationsPath: string;
  statsApi: string;
  reservationsApi: string;
  statusApiPrefix: string;
  allowedRoles: readonly AdminRole[];
  outletId: string | null;
  labelID: string;
  labelEN: string;
};

export const ADMIN_PORTAL_CONFIG: Record<AdminPortal, AdminPortalConfig> = {
  main: {
    basePath: "/admin",
    reservationsPath: "/admin/reservations",
    statsApi: "/api/admin/stats",
    reservationsApi: "/api/admin/reservations",
    statusApiPrefix: "/api/admin/reservations",
    allowedRoles: ["admin_main"],
    outletId: null,
    labelID: "Admin Utama",
    labelEN: "Main Admin",
  },
  cikarang: {
    basePath: "/admin/cikarang",
    reservationsPath: "/admin/cikarang/reservations",
    statsApi: "/api/admin/cikarang/stats",
    reservationsApi: "/api/admin/cikarang/reservations",
    statusApiPrefix: "/api/admin/cikarang/reservations",
    allowedRoles: ["admin_cikarang"],
    outletId: "pollux-cikarang",
    labelID: "Admin Cikarang",
    labelEN: "Cikarang Admin",
  },
  bintaro: {
    basePath: "/admin/bintaro",
    reservationsPath: "/admin/bintaro/reservations",
    statsApi: "/api/admin/bintaro/stats",
    reservationsApi: "/api/admin/bintaro/reservations",
    statusApiPrefix: "/api/admin/bintaro/reservations",
    allowedRoles: ["admin_bintaro"],
    outletId: "bintaro",
    labelID: "Admin Bintaro",
    labelEN: "Bintaro Admin",
  },
};

export function portalForRole(role: AdminRole): AdminPortal | null {
  if (role === "admin_main") return "main";
  if (role === "admin_cikarang") return "cikarang";
  if (role === "admin_bintaro") return "bintaro";
  return null;
}

export function roleAllowedForPortal(role: AdminRole, portal: AdminPortal): boolean {
  return ADMIN_PORTAL_CONFIG[portal].allowedRoles.includes(role);
}

export function portalLoginDeniedMessage(portal: AdminPortal): string {
  if (portal === "cikarang") return "Akun ini bukan admin cabang Cikarang.";
  if (portal === "bintaro") return "Akun ini bukan admin cabang Bintaro.";
  return "Akun ini bukan admin utama.";
}
