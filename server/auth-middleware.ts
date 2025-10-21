import { Request, Response, NextFunction } from "express";

// Extend Express Session to include custom data
declare module 'express-session' {
  interface SessionData {
    userId?: string;
    username?: string;
    role?: 'admin' | 'kasir' | 'member';
    memberId?: string;
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    return res.status(401).json({
      success: false,
      message: "Silakan login terlebih dahulu"
    });
  }
  next();
}

export function requireAdminOrKasir(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId || !req.session.role) {
    return res.status(401).json({
      success: false,
      message: "Silakan login terlebih dahulu"
    });
  }

  if (req.session.role !== 'admin' && req.session.role !== 'kasir') {
    return res.status(403).json({
      success: false,
      message: "Anda tidak memiliki akses ke halaman ini"
    });
  }

  next();
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId || req.session.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: "Hanya admin yang memiliki akses"
    });
  }
  next();
}

export function requireMember(req: Request, res: Response, next: NextFunction) {
  if (!req.session.memberId) {
    return res.status(401).json({
      success: false,
      message: "Silakan login sebagai member terlebih dahulu"
    });
  }
  next();
}
