import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertMemberSchema, loginMemberSchema, loginUserSchema, insertUserSchema,
  insertVoucherSchema, insertPromoSchema, insertBillSchema, claimVoucherSchema,
  insertCampaignSchema,
} from "@shared/schema";
import rateLimit from "express-rate-limit";
import { memberEndpointSecurity } from "./security";
import {
  requireAdmin,
  requireAdminOrKasir,
  requireMember,
} from "./auth-middleware";
import type { Request, Response, NextFunction } from "express";
import { upload, validateImageDimensions } from "./upload-middleware";
import fs from "fs";
import path from "path";

function requireMemberSelf(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (!req.session.memberId) {
    return res.status(401).json({
      success: false,
      message: "Silakan login sebagai member terlebih dahulu",
    });
  }
  const paramId = req.params.memberId;
  if (paramId && req.session.memberId !== paramId) {
    return res.status(403).json({
      success: false,
      message: "Akses ditolak",
    });
  }
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Rate limiting for member login - prevent brute force attacks
  const loginRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 5, // Limit each IP to 5 login requests per windowMs
    message: {
      success: false,
      message: "Terlalu banyak percobaan login. Coba lagi dalam 15 menit."
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  });

  // Member Registration with enhanced security
  app.post("/api/members/register", memberEndpointSecurity, async (req, res) => {
    try {
      const validatedData = insertMemberSchema.parse(req.body);
      
      // Check if member already exists
      const existingMember = await storage.getMemberByWhatsApp(validatedData.noWhatsApp);
      if (existingMember) {
        return res.status(400).json({ 
          success: false, 
          message: "Nomor WhatsApp sudah terdaftar" 
        });
      }
      
      const newMember = await storage.createMember(validatedData);

      req.session.regenerate((err) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: "Registrasi berhasil tetapi gagal membuat session. Silakan login.",
          });
        }

        req.session.memberId = newMember.id;
        req.session.role = "member";
        delete req.session.userId;
        delete req.session.username;

        req.session.save((saveErr) => {
          if (saveErr) {
            return res.status(500).json({
              success: false,
              message: "Registrasi berhasil tetapi gagal menyimpan session. Silakan login.",
            });
          }

          res.json({
            success: true,
            message: "Registrasi berhasil!",
            member: {
              id: newMember.id,
              namaLengkap: newMember.namaLengkap,
              noWhatsApp: newMember.noWhatsApp,
              tanggalLahir: newMember.tanggalLahir,
              kodePos: newMember.kodePos,
            },
          });
        });
      });
    } catch (error: any) {
      console.error('Registration error:', error);
      res.status(400).json({ 
        success: false, 
        message: error.errors ? "Data tidak valid" : "Gagal registrasi" 
      });
    }
  });
  
  // Admin/Kasir Login with role-based auth and rate limiting
  app.post("/api/auth/login", loginRateLimit, async (req, res) => {
    try {
      const validatedData = loginUserSchema.parse(req.body);
      
      const result = await storage.loginUser(validatedData.username, validatedData.password);
      
      if (!result) {
        return res.status(401).json({ 
          success: false, 
          message: "Username atau password salah" 
        });
      }

      if (result.error) {
        return res.status(401).json({ 
          success: false, 
          message: result.error,
          locked: result.locked,
          lockTimeRemaining: result.lockTimeRemaining,
          attemptsRemaining: result.attemptsRemaining
        });
      }

      // Regenerate session to prevent session fixation attacks
      req.session.regenerate((err) => {
        if (err) {
          return res.status(500).json({ 
            success: false, 
            message: "Gagal membuat session" 
          });
        }

        // Clear any stale role-specific fields and set new session data
        const role = result.user.role;
        if (role !== "admin" && role !== "kasir") {
          return res.status(500).json({
            success: false,
            message: "Role pengguna tidak valid",
          });
        }
        req.session.userId = result.user.id;
        req.session.username = result.user.username;
        req.session.role = role;
        delete req.session.memberId; // Clear member session if exists
        
        req.session.save((err) => {
          if (err) {
            return res.status(500).json({ 
              success: false, 
              message: "Gagal menyimpan session" 
            });
          }

          res.json({ 
            success: true, 
            message: "Login berhasil!",
            user: { 
              id: result.user.id, 
              username: result.user.username, 
              role: result.user.role
            } 
          });
        });
      });
    } catch (error: any) {
      console.error('User login error:', error);
      res.status(400).json({ 
        success: false, 
        message: error.errors ? "Data tidak valid" : "Gagal login" 
      });
    }
  });

  // Admin/Kasir Logout
  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ 
          success: false, 
          message: "Gagal logout" 
        });
      }
      res.clearCookie('sessionId');
      res.json({ 
        success: true, 
        message: "Logout berhasil" 
      });
    });
  });

  // Check session status (admin/kasir or member)
  app.get("/api/auth/session", async (req, res) => {
    if (req.session.memberId && req.session.role === "member") {
      const member = await storage.getMember(req.session.memberId);
      if (!member) {
        return res.json({ success: true, authenticated: false });
      }
      const { pinHash: _, ...safeMember } = member;
      return res.json({
        success: true,
        authenticated: true,
        role: "member",
        member: safeMember,
      });
    }

    if (req.session.userId && req.session.role) {
      return res.json({
        success: true,
        authenticated: true,
        role: req.session.role,
        user: {
          id: req.session.userId,
          username: req.session.username,
          role: req.session.role,
        },
      });
    }

    res.json({
      success: true,
      authenticated: false,
    });
  });

  // Member Login with enhanced security and rate limiting
  app.post("/api/members/login", loginRateLimit, memberEndpointSecurity, async (req, res) => {
    try {
      const validatedData = loginMemberSchema.parse(req.body);
      
      const result = await storage.loginMember(validatedData.noWhatsApp, validatedData.pin);
      
      if (!result) {
        return res.status(401).json({ 
          success: false, 
          message: "Nomor WhatsApp atau PIN salah" 
        });
      }

      if (result.error) {
        return res.status(401).json({ 
          success: false, 
          message: result.error 
        });
      }

      // Regenerate session to prevent session fixation attacks
      req.session.regenerate((err) => {
        if (err) {
          return res.status(500).json({ 
            success: false, 
            message: "Gagal membuat session" 
          });
        }

        // Clear any stale role-specific fields and set new session data
        req.session.memberId = result.member.id;
        req.session.role = 'member';
        delete req.session.userId; // Clear admin/kasir session if exists
        delete req.session.username; // Clear admin/kasir username if exists
        
        req.session.save((err) => {
          if (err) {
            return res.status(500).json({ 
              success: false, 
              message: "Gagal menyimpan session" 
            });
          }

          res.json({ 
            success: true, 
            message: "Login berhasil!",
            member: { 
              id: result.member.id, 
              namaLengkap: result.member.namaLengkap, 
              noWhatsApp: result.member.noWhatsApp,
              tanggalLahir: result.member.tanggalLahir,
              kodePos: result.member.kodePos
            } 
          });
        });
      });
    } catch (error: any) {
      console.error('Member login error:', error);
      res.status(400).json({ 
        success: false, 
        message: error.errors ? "Data tidak valid" : "Gagal login" 
      });
    }
  });

  // Member Logout
  app.post("/api/members/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ 
          success: false, 
          message: "Gagal logout" 
        });
      }
      res.clearCookie('sessionId');
      res.json({ 
        success: true, 
        message: "Logout berhasil" 
      });
    });
  });

  // Consolidated Member Dashboard - Single optimized API call
  app.get(
    "/api/members/:memberId/dashboard",
    requireMember,
    requireMemberSelf,
    memberEndpointSecurity,
    async (req, res) => {
    try {
      const { memberId } = req.params;
      const dashboard = await storage.getMemberDashboard(memberId);
      
      res.json({
        success: true,
        data: dashboard
      });
    } catch (error: any) {
      console.error('Get member dashboard error:', error);
      
      if (error.message === 'Member tidak ditemukan') {
        return res.status(404).json({ 
          success: false, 
          message: error.message 
        });
      }
      
      res.status(500).json({ 
        success: false, 
        message: "Gagal mengambil data dashboard" 
      });
    }
  },
  );

  // Member Dashboard Routes
  app.get(
    "/api/members/:memberId/profile",
    requireMember,
    requireMemberSelf,
    memberEndpointSecurity,
    async (req, res) => {
    try {
      const { memberId } = req.params;
      
      const member = await storage.getMember(memberId);
      if (!member) {
        return res.status(404).json({ 
          success: false, 
          message: "Member tidak ditemukan" 
        });
      }
      
      // Get member points (initialize if doesn't exist)
      let memberPoints = await storage.getMemberPoints(memberId);
      if (!memberPoints) {
        memberPoints = await storage.initializeMemberPoints(memberId);
      }
      
      res.json({
        success: true,
        data: {
          id: member.id,
          namaLengkap: member.namaLengkap,
          noWhatsApp: member.noWhatsApp,
          totalPoints: memberPoints.totalPoints
        }
      });
    } catch (error: any) {
      console.error('Get member profile error:', error);
      res.status(500).json({ 
        success: false, 
        message: "Gagal mengambil data profil" 
      });
    }
  });

  // Get member profile by WhatsApp number (for kasir)
  app.get(
    "/api/members/whatsapp/:noWhatsApp/profile",
    requireAdminOrKasir,
    memberEndpointSecurity,
    async (req, res) => {
    try {
      const noWhatsApp = decodeURIComponent(req.params.noWhatsApp);
      
      const member = await storage.getMemberByWhatsApp(noWhatsApp);
      if (!member) {
        return res.status(404).json({ 
          success: false, 
          message: "Member tidak ditemukan" 
        });
      }
      
      // Get member points (initialize if doesn't exist)
      let memberPoints = await storage.getMemberPoints(member.id);
      if (!memberPoints) {
        memberPoints = await storage.initializeMemberPoints(member.id);
      }
      
      res.json({
        success: true,
        data: {
          id: member.id,
          namaLengkap: member.namaLengkap,
          noWhatsApp: member.noWhatsApp,
          totalPoints: memberPoints.totalPoints
        }
      });
    } catch (error: any) {
      console.error('Get member profile by WhatsApp error:', error);
      res.status(500).json({ 
        success: false, 
        message: "Gagal mengambil data member" 
      });
    }
  });

  app.get(
    "/api/members/:memberId/voucher-claims",
    requireMember,
    requireMemberSelf,
    memberEndpointSecurity,
    async (req, res) => {
    try {
      const { memberId } = req.params;
      
      const claims = await storage.getMemberVoucherClaims(memberId);
      res.json({
        success: true,
        data: claims
      });
    } catch (error: any) {
      console.error('Get voucher claims error:', error);
      res.status(500).json({ 
        success: false, 
        message: "Gagal mengambil data voucher claims" 
      });
    }
  });

  // Voucher Routes
  app.get("/api/vouchers/active", requireMember, memberEndpointSecurity, async (req, res) => {
    try {
      const activeVouchers = await storage.getActiveVouchers();
      res.json({
        success: true,
        data: activeVouchers
      });
    } catch (error: any) {
      console.error('Get active vouchers error:', error);
      res.status(500).json({ 
        success: false, 
        message: "Gagal mengambil data voucher" 
      });
    }
  });

  app.post("/api/vouchers/claim", requireMember, memberEndpointSecurity, async (req, res) => {
    try {
      const validatedData = claimVoucherSchema.parse(req.body);
      const memberId = req.session.memberId!;

      const claim = await storage.claimVoucher(memberId, validatedData.voucherId);
      res.json({
        success: true,
        message: "Voucher berhasil di-claim!",
        data: claim
      });
    } catch (error: any) {
      console.error('Claim voucher error:', error);
      res.status(400).json({ 
        success: false, 
        message: error.message || "Gagal claim voucher" 
      });
    }
  });

  // Promo Routes
  app.get("/api/promos/active", requireMember, memberEndpointSecurity, async (req, res) => {
    try {
      const activePromos = await storage.getActivePromos();
      res.json({
        success: true,
        data: activePromos
      });
    } catch (error: any) {
      console.error('Get active promos error:', error);
      res.status(500).json({ 
        success: false, 
        message: "Gagal mengambil data promo" 
      });
    }
  });

  // Admin Routes - Create Vouchers and Promos
  app.post("/api/admin/vouchers", requireAdmin, memberEndpointSecurity, async (req, res) => {
    try {
      const validatedData = insertVoucherSchema.parse(req.body);
      const voucher = await storage.createVoucher(validatedData, req.session.userId!);
      res.json({
        success: true,
        message: "Voucher berhasil dibuat!",
        data: voucher
      });
    } catch (error: any) {
      console.error('Create voucher error:', error);
      res.status(400).json({ 
        success: false, 
        message: error.errors ? "Data tidak valid" : "Gagal membuat voucher" 
      });
    }
  });

  app.post("/api/admin/promos", requireAdmin, memberEndpointSecurity, async (req, res) => {
    try {
      const validatedData = insertPromoSchema.parse(req.body);
      const promo = await storage.createPromo(validatedData, req.session.userId!);
      res.json({
        success: true,
        message: "Promo berhasil dibuat!",
        data: promo
      });
    } catch (error: any) {
      console.error('Create promo error:', error);
      res.status(400).json({ 
        success: false, 
        message: error.errors ? "Data tidak valid" : "Gagal membuat promo" 
      });
    }
  });

  app.get("/api/admin/vouchers", requireAdmin, memberEndpointSecurity, async (req, res) => {
    try {
      const vouchers = await storage.getVouchers();
      res.json({
        success: true,
        data: vouchers
      });
    } catch (error: any) {
      console.error('Get all vouchers error:', error);
      res.status(500).json({ 
        success: false, 
        message: "Gagal mengambil data voucher" 
      });
    }
  });

  // Update voucher endpoint
  app.put("/api/admin/vouchers/:id", requireAdmin, memberEndpointSecurity, async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertVoucherSchema.parse(req.body);
      const updatedVoucher = await storage.updateVoucher(id, validatedData);
      res.json({
        success: true,
        message: "Voucher berhasil diperbarui!",
        data: updatedVoucher
      });
    } catch (error: any) {
      console.error('Update voucher error:', error);
      res.status(400).json({ 
        success: false, 
        message: error.errors ? "Data tidak valid" : error.message || "Gagal memperbarui voucher" 
      });
    }
  });

  // Delete voucher endpoint
  app.delete("/api/admin/vouchers/:id", requireAdmin, memberEndpointSecurity, async (req, res) => {
    try {
      const { id } = req.params;
      
      await storage.deleteVoucher(id);
      res.json({
        success: true,
        message: "Voucher berhasil dihapus!"
      });
    } catch (error: any) {
      console.error('Delete voucher error:', error);
      res.status(400).json({ 
        success: false, 
        message: error.message || "Gagal menghapus voucher" 
      });
    }
  });

  app.get("/api/admin/promos", requireAdmin, memberEndpointSecurity, async (req, res) => {
    try {
      const promos = await storage.getPromos();
      res.json({
        success: true,
        data: promos
      });
    } catch (error: any) {
      console.error('Get all promos error:', error);
      res.status(500).json({ 
        success: false, 
        message: "Gagal mengambil data promo" 
      });
    }
  });

  // Update promo endpoint
  app.put("/api/admin/promos/:id", requireAdmin, memberEndpointSecurity, async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertPromoSchema.parse(req.body);

      const updatedPromo = await storage.updatePromo(id, validatedData);
      res.json({
        success: true,
        message: "Promo berhasil diperbarui!",
        data: updatedPromo
      });
    } catch (error: any) {
      console.error('Update promo error:', error);
      res.status(400).json({ 
        success: false, 
        message: error.errors ? "Data tidak valid" : error.message || "Gagal memperbarui promo" 
      });
    }
  });

  // Delete promo endpoint
  app.delete("/api/admin/promos/:id", requireAdmin, memberEndpointSecurity, async (req, res) => {
    try {
      const { id } = req.params;
      
      await storage.deletePromo(id);
      res.json({
        success: true,
        message: "Promo berhasil dihapus!"
      });
    } catch (error: any) {
      console.error('Delete promo error:', error);
      res.status(400).json({ 
        success: false, 
        message: error.message || "Gagal menghapus promo" 
      });
    }
  });

  // Admin endpoints for data member dan riwayat transaksi
  app.get("/api/admin/members", requireAdmin, memberEndpointSecurity, async (req, res) => {
    try {
      const members = await storage.getAllMembers();
      res.json({
        success: true,
        data: members
      });
    } catch (error: any) {
      console.error('Get all members error:', error);
      res.status(500).json({ 
        success: false, 
        message: "Gagal mengambil data member" 
      });
    }
  });

  // Update member endpoint
  app.put("/api/admin/members/:id", requireAdmin, memberEndpointSecurity, async (req, res) => {
    try {
      const { id } = req.params;
      const { namaLengkap, jenisKelamin, noWhatsApp, tanggalLahir, kodePos } = req.body;
      
      // Basic validation
      if (!namaLengkap || !jenisKelamin || !noWhatsApp || !tanggalLahir || !kodePos) {
        return res.status(400).json({ 
          success: false, 
          message: "Semua field harus diisi" 
        });
      }
      
      // Check if member exists
      const existingMember = await storage.getMember(id);
      if (!existingMember) {
        return res.status(404).json({ 
          success: false, 
          message: "Member tidak ditemukan" 
        });
      }
      
      // Check if WhatsApp number is already used by another member
      const memberWithSameWhatsApp = await storage.getMemberByWhatsApp(noWhatsApp);
      if (memberWithSameWhatsApp && memberWithSameWhatsApp.id !== id) {
        return res.status(400).json({ 
          success: false, 
          message: "Nomor WhatsApp sudah digunakan member lain" 
        });
      }
      
      const updatedMember = await storage.updateMember(id, {
        namaLengkap,
        jenisKelamin,
        noWhatsApp,
        tanggalLahir,
        kodePos
      });
      
      res.json({
        success: true,
        message: "Data member berhasil diperbarui!",
        data: updatedMember
      });
    } catch (error: any) {
      console.error('Update member error:', error);
      res.status(400).json({ 
        success: false, 
        message: error.message || "Gagal memperbarui data member" 
      });
    }
  });

  // Delete member endpoint
  app.delete("/api/admin/members/:id", requireAdmin, memberEndpointSecurity, async (req, res) => {
    try {
      const { id } = req.params;
      
      // Check if member exists
      const existingMember = await storage.getMember(id);
      if (!existingMember) {
        return res.status(404).json({ 
          success: false, 
          message: "Member tidak ditemukan" 
        });
      }
      
      await storage.deleteMember(id);
      res.json({
        success: true,
        message: "Member berhasil dihapus!"
      });
    } catch (error: any) {
      console.error('Delete member error:', error);
      res.status(400).json({ 
        success: false, 
        message: error.message || "Gagal menghapus member" 
      });
    }
  });

  app.get("/api/admin/stats", requireAdmin, memberEndpointSecurity, async (req, res) => {
    try {
      const stats = await storage.getAdminStats();
      res.json({ success: true, data: stats });
    } catch (error: any) {
      console.error("Get admin stats error:", error);
      res.status(500).json({
        success: false,
        message: "Gagal mengambil ringkasan sistem",
      });
    }
  });

  app.get("/api/admin/users", requireAdmin, memberEndpointSecurity, async (req, res) => {
    try {
      const staff = await storage.getStaffUsers();
      res.json({ success: true, data: staff });
    } catch (error: any) {
      console.error("Get staff users error:", error);
      res.status(500).json({
        success: false,
        message: "Gagal mengambil data user",
      });
    }
  });

  app.post("/api/admin/users", requireAdmin, memberEndpointSecurity, async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      const existing = await storage.getUserByUsername(validatedData.username);
      if (existing) {
        return res.status(400).json({
          success: false,
          message: "Username sudah digunakan",
        });
      }

      const user = await storage.createUser(validatedData);
      const { password: _, ...safeUser } = user;
      res.json({
        success: true,
        message: "User berhasil dibuat",
        data: safeUser,
      });
    } catch (error: any) {
      console.error("Create staff user error:", error);
      res.status(400).json({
        success: false,
        message: error.errors ? "Data tidak valid" : error.message || "Gagal membuat user",
      });
    }
  });

  app.delete("/api/admin/users/:id", requireAdmin, memberEndpointSecurity, async (req, res) => {
    try {
      const { id } = req.params;
      if (id === req.session.userId) {
        return res.status(400).json({
          success: false,
          message: "Tidak dapat menghapus akun yang sedang login",
        });
      }

      await storage.deleteStaffUser(id);
      res.json({
        success: true,
        message: "User berhasil dihapus",
      });
    } catch (error: any) {
      console.error("Delete staff user error:", error);
      res.status(400).json({
        success: false,
        message: error.message || "Gagal menghapus user",
      });
    }
  });

  app.get("/api/admin/bills", requireAdmin, memberEndpointSecurity, async (req, res) => {
    try {
      const bills = await storage.getAllBills();
      res.json({
        success: true,
        data: bills
      });
    } catch (error: any) {
      console.error('Get all bills error:', error);
      res.status(500).json({ 
        success: false, 
        message: "Gagal mengambil data transaksi" 
      });
    }
  });

  // Kasir Routes - Create Bills and Award Points
  app.post("/api/kasir/bills", requireAdminOrKasir, memberEndpointSecurity, async (req, res) => {
    try {
      const validatedData = insertBillSchema.parse(req.body);
      const kasirId = req.session.userId!;

      const bill = await storage.createBillAndAwardPoints(validatedData, kasirId);
      res.json({
        success: true,
        message: `Bill berhasil diproses! Member mendapat ${bill.pointsAwarded} points.`,
        data: bill
      });
    } catch (error: any) {
      console.error('Create bill error:', error);
      res.status(400).json({ 
        success: false, 
        message: error.errors ? "Data tidak valid" : "Gagal memproses bill" 
      });
    }
  });

  // Get all voucher claims for kasir
  app.get("/api/kasir/voucher-claims", requireAdminOrKasir, memberEndpointSecurity, async (req, res) => {
    try {
      const claims = await storage.getAllVoucherClaims();
      res.json({
        success: true,
        data: claims
      });
    } catch (error: any) {
      console.error('Get voucher claims error:', error);
      res.status(500).json({ 
        success: false, 
        message: "Gagal mengambil data voucher claims" 
      });
    }
  });

  app.post("/api/kasir/voucher-claims/:claimId/redeem", requireAdminOrKasir, memberEndpointSecurity, async (req, res) => {
    try {
      const { claimId } = req.params;
      
      const claim = await storage.redeemVoucherClaim(claimId);
      res.json({
        success: true,
        message: "Voucher berhasil ditebus!",
        data: claim
      });
    } catch (error: any) {
      console.error('Redeem voucher error:', error);
      res.status(400).json({ 
        success: false, 
        message: error.message || "Gagal menebus voucher" 
      });
    }
  });

  // Campaign Routes - Popup untuk Landing Page
  
  // Create campaign with image upload (Admin only)
  app.post("/api/admin/campaigns", requireAdmin, memberEndpointSecurity, upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ 
          success: false, 
          message: "File gambar harus diupload" 
        });
      }

      // Validate image dimensions (600x600px)
      const validation = validateImageDimensions(req.file.path);
      if (!validation.valid) {
        return res.status(400).json({ 
          success: false, 
          message: validation.error 
        });
      }

      const validatedData = insertCampaignSchema.parse(req.body);
      const imagePath = `/uploads/campaigns/${req.file.filename}`;
      
      const campaign = await storage.createCampaign(validatedData, imagePath, req.session.userId!);
      
      res.json({ 
        success: true, 
        message: "Campaign berhasil dibuat",
        campaign 
      });
    } catch (error: any) {
      if (req.file) fs.unlinkSync(req.file.path);
      console.error('Create campaign error:', error);
      res.status(400).json({ 
        success: false, 
        message: error.errors ? "Data tidak valid" : error.message || "Gagal membuat campaign" 
      });
    }
  });

  // Get all campaigns (Admin only)
  app.get("/api/admin/campaigns", requireAdmin, memberEndpointSecurity, async (req, res) => {
    try {
      const campaigns = await storage.getCampaigns();
      res.json({ success: true, campaigns });
    } catch (error: any) {
      console.error('Get campaigns error:', error);
      res.status(400).json({ 
        success: false, 
        message: "Gagal mengambil data campaigns" 
      });
    }
  });

  // Get active campaign (Public - for landing page)
  app.get("/api/campaigns/active", async (req, res) => {
    try {
      const campaign = await storage.getActiveCampaign();
      
      if (campaign) {
        // Increment view count
        await storage.incrementCampaignViewCount(campaign.id);
      }
      
      res.json({ 
        success: true, 
        campaign: campaign || null 
      });
    } catch (error: any) {
      console.error('Get active campaign error:', error);
      res.status(400).json({ 
        success: false, 
        message: "Gagal mengambil campaign aktif" 
      });
    }
  });

  // Update campaign status (Admin only)
  app.patch("/api/admin/campaigns/:id/status", requireAdmin, memberEndpointSecurity, async (req, res) => {
    try {
      const { status } = req.body;
      if (status !== 'active' && status !== 'inactive') {
        return res.status(400).json({ 
          success: false, 
          message: "Status harus 'active' atau 'inactive'" 
        });
      }

      const campaign = await storage.updateCampaignStatus(req.params.id, status);
      
      res.json({ 
        success: true, 
        message: status === 'active' 
          ? 'Campaign diaktifkan. Campaign lain otomatis dinonaktifkan.' 
          : 'Campaign dinonaktifkan',
        campaign 
      });
    } catch (error: any) {
      console.error('Update campaign status error:', error);
      res.status(400).json({ 
        success: false, 
        message: error.message || "Gagal mengubah status campaign" 
      });
    }
  });

  // Delete campaign (Admin only)
  app.delete("/api/admin/campaigns/:id", requireAdmin, memberEndpointSecurity, async (req, res) => {
    try {
      // Get campaign first to delete image file
      const campaigns = await storage.getCampaigns();
      const campaign = campaigns.find(c => c.id === req.params.id);
      
      if (campaign) {
        // Delete image file from disk
        const imagePath = path.join(process.cwd(), campaign.imagePath.replace(/^\//, ""));
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }

      await storage.deleteCampaign(req.params.id);
      
      res.json({ 
        success: true, 
        message: "Campaign berhasil dihapus" 
      });
    } catch (error: any) {
      console.error('Delete campaign error:', error);
      res.status(400).json({ 
        success: false, 
        message: error.message || "Gagal menghapus campaign" 
      });
    }
  });

  // SEO Sitemap.xml endpoint
  app.get("/sitemap.xml", (req, res) => {
    const baseUrl = "https://gadangbarubahindonesia.id";
    const currentDate = new Date().toISOString();
    
    const urls = [
      {
        loc: `${baseUrl}/`,
        lastmod: currentDate,
        changefreq: "weekly",
        priority: "1.0"
      },
      {
        loc: `${baseUrl}/uni`,
        lastmod: currentDate,
        changefreq: "weekly", 
        priority: "0.9"
      },
      {
        loc: `${baseUrl}/services/outlet`,
        lastmod: currentDate,
        changefreq: "monthly",
        priority: "0.8"
      },
      {
        loc: `${baseUrl}/services/delivery`,
        lastmod: currentDate,
        changefreq: "weekly",
        priority: "0.8"
      },
      {
        loc: `${baseUrl}/services/catering`,
        lastmod: currentDate,
        changefreq: "monthly",
        priority: "0.7"
      },
      {
        loc: `${baseUrl}/services/membership`,
        lastmod: currentDate,
        changefreq: "monthly",
        priority: "0.7"
      },
      {
        loc: `${baseUrl}/services/partnership`,
        lastmod: currentDate,
        changefreq: "monthly",
        priority: "0.6"
      },
      {
        loc: `${baseUrl}/member/login`,
        lastmod: currentDate,
        changefreq: "yearly",
        priority: "0.5"
      },
      {
        loc: `${baseUrl}/member/register`,
        lastmod: currentDate,
        changefreq: "yearly",
        priority: "0.5"
      }
    ];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    res.set('Content-Type', 'application/xml');
    res.send(sitemap);
  });

  const httpServer = createServer(app);

  return httpServer;
}
