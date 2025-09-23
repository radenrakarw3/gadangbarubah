import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertMemberSchema, loginMemberSchema, insertVoucherSchema, 
  insertPromoSchema, insertBillSchema, claimVoucherSchema 
} from "@shared/schema";
import rateLimit from "express-rate-limit";
import { memberEndpointSecurity } from "./security";

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
      res.json({ 
        success: true, 
        message: "Registrasi berhasil! Silakan login dengan nomor WhatsApp dan PIN Anda.",
        member: { 
          id: newMember.id, 
          namaLengkap: newMember.namaLengkap, 
          noWhatsApp: newMember.noWhatsApp 
        } 
      });
    } catch (error: any) {
      console.error('Registration error:', error);
      res.status(400).json({ 
        success: false, 
        message: error.errors ? "Data tidak valid" : "Gagal registrasi" 
      });
    }
  });
  
  // Member Login with enhanced security
  app.post("/api/members/login", loginRateLimit, memberEndpointSecurity, async (req, res) => {
    try {
      const validatedData = loginMemberSchema.parse(req.body);
      
      const member = await storage.loginMember(validatedData.noWhatsApp, validatedData.pin);
      if (!member) {
        return res.status(401).json({ 
          success: false, 
          message: "Nomor WhatsApp atau PIN salah" 
        });
      }
      
      res.json({ 
        success: true, 
        message: "Login berhasil!",
        member: { 
          id: member.id, 
          namaLengkap: member.namaLengkap, 
          noWhatsApp: member.noWhatsApp,
          tanggalLahir: member.tanggalLahir,
          kodePos: member.kodePos
        } 
      });
    } catch (error: any) {
      console.error('Login error:', error);
      res.status(400).json({ 
        success: false, 
        message: error.errors ? "Data tidak valid" : "Gagal login" 
      });
    }
  });

  // Member Dashboard Routes
  app.get("/api/members/:memberId/profile", memberEndpointSecurity, async (req, res) => {
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

  app.get("/api/members/:memberId/voucher-claims", memberEndpointSecurity, async (req, res) => {
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
  app.get("/api/vouchers/active", memberEndpointSecurity, async (req, res) => {
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

  app.post("/api/vouchers/claim", memberEndpointSecurity, async (req, res) => {
    try {
      const validatedData = claimVoucherSchema.parse(req.body);
      const { memberId } = req.body; // Should come from authenticated session in real app
      
      if (!memberId) {
        return res.status(400).json({ 
          success: false, 
          message: "Member ID diperlukan" 
        });
      }
      
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
  app.get("/api/promos/active", memberEndpointSecurity, async (req, res) => {
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
  app.post("/api/admin/vouchers", memberEndpointSecurity, async (req, res) => {
    try {
      const validatedData = insertVoucherSchema.parse(req.body);
      const { adminId } = req.body; // Should come from authenticated admin session
      
      if (!adminId) {
        return res.status(400).json({ 
          success: false, 
          message: "Admin ID diperlukan" 
        });
      }
      
      const voucher = await storage.createVoucher(validatedData, adminId);
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

  app.post("/api/admin/promos", memberEndpointSecurity, async (req, res) => {
    try {
      const validatedData = insertPromoSchema.parse(req.body);
      const { adminId } = req.body; // Should come from authenticated admin session
      
      if (!adminId) {
        return res.status(400).json({ 
          success: false, 
          message: "Admin ID diperlukan" 
        });
      }
      
      const promo = await storage.createPromo(validatedData, adminId);
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

  app.get("/api/admin/vouchers", memberEndpointSecurity, async (req, res) => {
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

  app.get("/api/admin/promos", memberEndpointSecurity, async (req, res) => {
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

  // Admin endpoints for data member dan riwayat transaksi
  app.get("/api/admin/members", memberEndpointSecurity, async (req, res) => {
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

  app.get("/api/admin/bills", memberEndpointSecurity, async (req, res) => {
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
  app.post("/api/kasir/bills", memberEndpointSecurity, async (req, res) => {
    try {
      const validatedData = insertBillSchema.parse(req.body);
      const { kasirId } = req.body; // Should come from authenticated kasir session
      
      if (!kasirId) {
        return res.status(400).json({ 
          success: false, 
          message: "Kasir ID diperlukan" 
        });
      }
      
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

  app.post("/api/kasir/voucher-claims/:claimId/redeem", memberEndpointSecurity, async (req, res) => {
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
