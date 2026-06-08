import type { AdminRole } from "./schema";

export type AdminPortal = "main" | "cikarang" | "bintaro";

export type AdminPortalConfig = {
  basePath: string;
  /** Ringkasan operasional — staff cabang; admin utama tanpa reservasi */
  dashboardPath: string;
  statsApi: string;
  allowedRoles: readonly AdminRole[];
  outletId: string | null;
  labelID: string;
  labelEN: string;
  staffLabelID: string;
  staffLabelEN: string;
  /** Hanya portal cabang — admin utama tidak mengelola reservasi */
  reservationStaffPath?: string;
  reservationsPath?: string;
  reservationsApi?: string;
  statusApiPrefix?: string;
};

export const ADMIN_PORTAL_CONFIG: Record<AdminPortal, AdminPortalConfig> = {
  main: {
    basePath: "/admin",
    dashboardPath: "/admin",
    statsApi: "/api/admin/stats",
    allowedRoles: ["admin_main"],
    outletId: null,
    labelID: "Admin Utama",
    labelEN: "Main Admin",
    staffLabelID: "Admin Utama",
    staffLabelEN: "Main Admin",
  },
  cikarang: {
    basePath: "/kelola-reservasi/cikarang",
    dashboardPath: "/kelola-reservasi/cikarang/dashboard",
    reservationStaffPath: "/kelola-reservasi/cikarang",
    reservationsPath: "/kelola-reservasi/cikarang",
    statsApi: "/api/admin/cikarang/stats",
    reservationsApi: "/api/admin/cikarang/reservations",
    statusApiPrefix: "/api/admin/cikarang/reservations",
    allowedRoles: ["admin_cikarang"],
    outletId: "pollux-cikarang",
    labelID: "Admin Cikarang",
    labelEN: "Cikarang Admin",
    staffLabelID: "Kelola Reservasi Cikarang",
    staffLabelEN: "Cikarang Reservations",
  },
  bintaro: {
    basePath: "/kelola-reservasi/bintaro",
    dashboardPath: "/kelola-reservasi/bintaro/dashboard",
    reservationStaffPath: "/kelola-reservasi/bintaro",
    reservationsPath: "/kelola-reservasi/bintaro",
    statsApi: "/api/admin/bintaro/stats",
    reservationsApi: "/api/admin/bintaro/reservations",
    statusApiPrefix: "/api/admin/bintaro/reservations",
    allowedRoles: ["admin_bintaro"],
    outletId: "bintaro",
    labelID: "Admin Bintaro",
    labelEN: "Bintaro Admin",
    staffLabelID: "Kelola Reservasi Bintaro",
    staffLabelEN: "Bintaro Reservations",
  },
};

export function isOutletReservationPortal(portal: AdminPortal): boolean {
  return portal === "cikarang" || portal === "bintaro";
}

export function portalHasReservations(portal: AdminPortal): boolean {
  return Boolean(ADMIN_PORTAL_CONFIG[portal].reservationsPath);
}

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
  if (portal === "cikarang") return "Akun ini bukan staff reservasi cabang Cikarang.";
  if (portal === "bintaro") return "Akun ini bukan staff reservasi cabang Bintaro.";
  return "Akun ini bukan admin utama.";
}

export function loginPathForPortal(portal: AdminPortal): string {
  if (portal === "main") return "/admin/login";
  return ADMIN_PORTAL_CONFIG[portal].basePath;
}

export function portalFromPath(path: string): AdminPortal | null {
  if (path.startsWith("/kelola-reservasi/cikarang")) return "cikarang";
  if (path.startsWith("/kelola-reservasi/bintaro")) return "bintaro";
  if (path.startsWith("/admin")) return "main";
  return null;
}

export function homePathForRole(role: AdminRole): string {
  const portal = portalForRole(role);
  return portal ? ADMIN_PORTAL_CONFIG[portal].dashboardPath : "/";
}
