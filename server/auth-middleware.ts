import { Request, Response, NextFunction } from "express";
import type { AdminRole } from "@shared/schema";

export type SessionAdminRole = AdminRole | "admin";

export function normalizeAdminRole(role: string | undefined): AdminRole | null {
  if (role === "admin_main" || role === "admin_cikarang" || role === "admin_bintaro") {
    return role;
  }
  // Backward compatibility for legacy seeded accounts
  if (role === "admin") return "admin_main";
  return null;
}

export function getRoleOutlet(role: string | undefined): string | null {
  const normalized = normalizeAdminRole(role);
  if (normalized === "admin_cikarang") return "pollux-cikarang";
  if (normalized === "admin_bintaro") return "bintaro";
  return null;
}

declare module "express-session" {
  interface SessionData {
    userId?: string;
    username?: string;
    role?: SessionAdminRole;
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    return res.status(401).json({
      success: false,
      message: "Silakan login terlebih dahulu",
    });
  }
  next();
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId || !normalizeAdminRole(req.session.role)) {
    return res.status(403).json({
      success: false,
      message: "Hanya admin yang memiliki akses",
    });
  }
  next();
}

export function requireMainAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId || normalizeAdminRole(req.session.role) !== "admin_main") {
    return res.status(403).json({
      success: false,
      message: "Hanya admin utama yang memiliki akses",
    });
  }
  next();
}
