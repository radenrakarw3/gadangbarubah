import type { AdminRole } from "./schema";

export type AdminPortal = "main" | "cikarang" | "bintaro";

export type AdminPortalConfig = {
  basePath: string;
  /** Panel staff cabang — hanya kelola reservasi, tanpa popup/admin */
  reservationStaffPath: string;
  reservationsPath: string;
  statsApi: string;
  reservationsApi: string;
  statusApiPrefix: string;
  allowedRoles: readonly AdminRole[];
  outletId: string | null;
  labelID: string;
  labelEN: string;
  staffLabelID: string;
  staffLabelEN: string;
};

export const ADMIN_PORTAL_CONFIG: Record<AdminPortal, AdminPortalConfig> = {
  main: {
    basePath: "/admin",
    reservationStaffPath: "/admin/reservations",
    reservationsPath: "/admin/reservations",
    statsApi: "/api/admin/stats",
    reservationsApi: "/api/admin/reservations",
    statusApiPrefix: "/api/admin/reservations",
    allowedRoles: ["admin_main"],
    outletId: null,
    labelID: "Admin Utama",
    labelEN: "Main Admin",
    staffLabelID: "Admin Utama",
    staffLabelEN: "Main Admin",
  },
  cikarang: {
    basePath: "/kelola-reservasi/cikarang",
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
