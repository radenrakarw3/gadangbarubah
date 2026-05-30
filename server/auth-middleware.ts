import { Request, Response, NextFunction } from "express";

declare module "express-session" {
  interface SessionData {
    userId?: string;
    username?: string;
    role?: "admin";
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
  if (!req.session.userId || req.session.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Hanya admin yang memiliki akses",
    });
  }
  next();
}
