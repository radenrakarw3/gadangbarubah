import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  loginUserSchema,
  insertUserSchema,
  insertReservationSchema,
  insertCateringInquirySchema,
  updateReservationStatusSchema,
  insertCampaignSchema,
  insertMenuCategorySchema,
  updateMenuCategorySchema,
  insertMenuItemSchema,
  updateMenuItemSchema,
  updateMenuItemStatusSchema,
} from "@shared/schema";
import {
  isReservationPublicId,
  toPublicReservationStatus,
} from "@shared/public-reservation";
import rateLimit from "express-rate-limit";
import { honeypot, memberEndpointSecurity } from "./security";
import { isReservationStatus } from "@shared/reservation-status";
import {
  normalizeAdminRole,
  requireMainAdmin,
  requirePortalAdmin,
} from "./auth-middleware";
import {
  portalLoginDeniedMessage,
  roleAllowedForPortal,
  type AdminPortal,
} from "@shared/admin-portals";
import {
  notifyReservationCustomerAsync,
  notifyStaffNewReservationAsync,
} from "./reservation-notify";
import { notifyStaffNewCateringAsync } from "./catering-notify";
import {
  isValidWhatsApp,
  normalizeWhatsAppInput,
  validateReservationDateTime,
} from "@shared/reservation-utils";
import { upload, validateImageDimensions } from "./upload-middleware";
import { menuUpload } from "./menu-upload-middleware";
import fs from "fs";
import path from "path";

function deleteUploadedFile(imagePath: string) {
  const fullPath = path.join(process.cwd(), imagePath.replace(/^\//, ""));
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  const loginRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    message: {
      success: false,
      message: "Terlalu banyak percobaan login. Coba lagi dalam 15 menit.",
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

  const reservationRateLimit = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 10,
    message: {
      success: false,
      message: "Terlalu banyak permintaan reservasi. Coba lagi nanti.",
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

  const cateringInquiryRateLimit = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 10,
    message: {
      success: false,
      message: "Terlalu banyak permintaan catering. Coba lagi nanti.",
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

  const reservationStatusRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 60,
    message: {
      success: false,
      message: "Terlalu banyak pengecekan status. Coba lagi nanti.",
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

  app.post("/api/auth/login", loginRateLimit, async (req, res) => {
    try {
      const validatedData = loginUserSchema.parse(req.body);
      const result = await storage.loginUser(validatedData.username, validatedData.password);

      if (!result) {
        return res.status(401).json({
          success: false,
          message: "Username atau password salah",
        });
      }

      if (result.error) {
        return res.status(401).json({
          success: false,
          message: result.error,
          locked: result.locked,
          lockTimeRemaining: result.lockTimeRemaining,
          attemptsRemaining: result.attemptsRemaining,
        });
      }

      const portal = validatedData.portal as AdminPortal;
      const userRole = normalizeAdminRole(result.user.role);
      if (!userRole || !roleAllowedForPortal(userRole, portal)) {
        return res.status(401).json({
          success: false,
          message: portalLoginDeniedMessage(portal),
        });
      }

      req.session.regenerate((err) => {
        if (err) {
          return res.status(500).json({ success: false, message: "Gagal membuat session" });
        }

        req.session.userId = result.user.id;
        req.session.username = result.user.username;
        req.session.role = userRole;

        req.session.save((saveErr) => {
          if (saveErr) {
            return res.status(500).json({ success: false, message: "Gagal menyimpan session" });
          }

          res.json({
            success: true,
            message: "Login berhasil!",
            user: {
              id: result.user.id,
              username: result.user.username,
              role: userRole,
            },
          });
        });
      });
    } catch (error: any) {
      console.error("User login error:", error);
      res.status(400).json({
        success: false,
        message: error.errors ? "Data tidak valid" : "Gagal login",
      });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ success: false, message: "Gagal logout" });
      }
      res.clearCookie("sessionId");
      res.json({ success: true, message: "Logout berhasil" });
    });
  });

  app.get("/api/auth/session", async (req, res) => {
    const role = normalizeAdminRole(req.session.role);
    if (req.session.userId && role) {
      return res.json({
        success: true,
        authenticated: true,
        role,
        user: {
          id: req.session.userId,
          username: req.session.username,
          role,
        },
      });
    }

    res.json({ success: true, authenticated: false });
  });

  app.post("/api/reservations", reservationRateLimit, honeypot, async (req, res) => {
    try {
      const validated = insertReservationSchema.parse({
        ...req.body,
        noWhatsApp: normalizeWhatsAppInput(String(req.body.noWhatsApp ?? "")),
        jumlahTamu: Number(req.body.jumlahTamu),
      });

      const dateTimeError = validateReservationDateTime(
        validated.tanggalReservasi,
        validated.waktuReservasi,
      );
      if (dateTimeError) {
        return res.status(400).json({ success: false, message: dateTimeError });
      }

      if (!isValidWhatsApp(validated.noWhatsApp)) {
        return res.status(400).json({
          success: false,
          message: "Nomor WhatsApp tidak valid. Gunakan format 08xxxxxxxxxx",
        });
      }

      const reservation = await storage.createReservation(validated);
      notifyReservationCustomerAsync(reservation, "pending");
      notifyStaffNewReservationAsync(reservation);

      res.json({
        success: true,
        message: "Permintaan reservasi berhasil dikirim. Tim kami akan menghubungi Anda via WhatsApp.",
        data: reservation,
      });
    } catch (error: any) {
      console.error("Create reservation error:", error);
      if (error?.code === "42P01") {
        return res.status(503).json({
          success: false,
          message:
            "Tabel reservasi belum tersedia di database. Jalankan migrasi database terlebih dahulu.",
        });
      }
      res.status(400).json({
        success: false,
        message: error.errors?.[0]?.message || error.message || "Gagal membuat reservasi",
      });
    }
  });

  app.get("/api/reservations/:id/status", reservationStatusRateLimit, async (req, res) => {
    try {
      const { id } = req.params;
      if (!isReservationPublicId(id)) {
        return res.status(400).json({ success: false, message: "ID reservasi tidak valid" });
      }

      const reservation = await storage.getReservationById(id);
      if (!reservation) {
        return res.status(404).json({ success: false, message: "Reservasi tidak ditemukan" });
      }

      const payload = toPublicReservationStatus(reservation);
      if (!payload) {
        return res.status(500).json({ success: false, message: "Status reservasi tidak valid" });
      }

      res.json({ success: true, data: payload });
    } catch (error) {
      console.error("Get public reservation status error:", error);
      res.status(500).json({ success: false, message: "Gagal mengambil status reservasi" });
    }
  });

  app.post("/api/catering-inquiries", cateringInquiryRateLimit, honeypot, async (req, res) => {
    try {
      const validated = insertCateringInquirySchema.parse(req.body);
      const telepon = normalizeWhatsAppInput(validated.telepon);

      if (!isValidWhatsApp(telepon)) {
        return res.status(400).json({
          success: false,
          message: "Nomor WhatsApp tidak valid. Gunakan format 08xxxxxxxxxx",
        });
      }

      const inquiry = await storage.createCateringInquiry({
        nama: validated.nama.trim(),
        noWhatsApp: telepon,
        email: validated.email,
        tipeLayanan: validated.tipe,
        pax: validated.pax,
      });

      notifyStaffNewCateringAsync(inquiry);

      res.json({
        success: true,
        message: "Permintaan catering berhasil dikirim. Tim kami akan menghubungi Anda.",
        data: { id: inquiry.id, shortId: inquiry.id.slice(0, 8) },
      });
    } catch (error: any) {
      console.error("Create catering inquiry error:", error);
      if (error?.code === "42P01") {
        return res.status(503).json({
          success: false,
          message:
            "Tabel inquiry catering belum tersedia. Jalankan migrasi database terlebih dahulu.",
        });
      }
      res.status(400).json({
        success: false,
        message: error.errors?.[0]?.message || error.message || "Gagal mengirim inquiry catering",
      });
    }
  });

  app.get("/api/admin/catering-inquiries", requireMainAdmin, memberEndpointSecurity, async (_req, res) => {
    try {
      const data = await storage.getCateringInquiries();
      res.json({ success: true, data });
    } catch (error) {
      console.error("Get catering inquiries error:", error);
      res.status(500).json({ success: false, message: "Gagal mengambil data inquiry catering" });
    }
  });

  app.get("/api/admin/stats", requireMainAdmin, memberEndpointSecurity, async (_req, res) => {
    try {
      const stats = await storage.getAdminStats();
      res.json({
        success: true,
        data: {
          staffCount: stats.staffCount,
          hasActiveCampaign: stats.hasActiveCampaign,
        },
      });
    } catch (error) {
      console.error("Get admin stats error:", error);
      res.status(500).json({ success: false, message: "Gagal mengambil ringkasan sistem" });
    }
  });

  const registerOutletAdminRoutes = (portal: "cikarang" | "bintaro", outletId: string) => {
    app.get(
      `/api/admin/${portal}/stats`,
      requirePortalAdmin(portal),
      memberEndpointSecurity,
      async (_req, res) => {
        try {
          const stats = await storage.getAdminStats(outletId);
          res.json({ success: true, data: stats });
        } catch (error) {
          console.error(`Get ${portal} admin stats error:`, error);
          res.status(500).json({ success: false, message: "Gagal mengambil ringkasan cabang" });
        }
      },
    );

    app.get(
      `/api/admin/${portal}/reservations`,
      requirePortalAdmin(portal),
      memberEndpointSecurity,
      async (req, res) => {
        try {
          const date = typeof req.query.date === "string" ? req.query.date : undefined;
          const statusRaw = typeof req.query.status === "string" ? req.query.status : undefined;
          const status =
            statusRaw && isReservationStatus(statusRaw) ? statusRaw : undefined;
          const data = await storage.getReservations({ date, status, outlet: outletId });
          res.json({ success: true, data });
        } catch (error) {
          console.error(`Get ${portal} reservations error:`, error);
          res.status(500).json({ success: false, message: "Gagal mengambil data reservasi" });
        }
      },
    );

    app.patch(
      `/api/admin/${portal}/reservations/:id/status`,
      requirePortalAdmin(portal),
      memberEndpointSecurity,
      async (req, res) => {
        try {
          const current = await storage.getReservationById(req.params.id);
          if (!current || current.outlet !== outletId) {
            return res.status(403).json({
              success: false,
              message: "Anda hanya dapat mengelola reservasi cabang Anda",
            });
          }
          const { status } = updateReservationStatusSchema.parse(req.body);
          const updated = await storage.updateReservationStatus(req.params.id, status);
          notifyReservationCustomerAsync(updated, status);

          res.json({
            success: true,
            message: "Status reservasi diperbarui",
            data: updated,
          });
        } catch (error: any) {
          console.error(`Update ${portal} reservation status error:`, error);
          res.status(400).json({
            success: false,
            message: error.errors ? "Data tidak valid" : error.message || "Gagal memperbarui status",
          });
        }
      },
    );
  };

  registerOutletAdminRoutes("cikarang", "pollux-cikarang");
  registerOutletAdminRoutes("bintaro", "bintaro");

  app.get("/api/admin/users", requireMainAdmin, memberEndpointSecurity, async (_req, res) => {
    try {
      const staff = await storage.getStaffUsers();
      res.json({ success: true, data: staff });
    } catch (error) {
      console.error("Get staff users error:", error);
      res.status(500).json({ success: false, message: "Gagal mengambil data user" });
    }
  });

  app.post("/api/admin/users", requireMainAdmin, memberEndpointSecurity, async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      const existing = await storage.getUserByUsername(validatedData.username);
      if (existing) {
        return res.status(400).json({ success: false, message: "Username sudah digunakan" });
      }

      const user = await storage.createUser(validatedData);
      const { password: _, ...safeUser } = user;
      res.json({ success: true, message: "User berhasil dibuat", data: safeUser });
    } catch (error: any) {
      console.error("Create staff user error:", error);
      res.status(400).json({
        success: false,
        message: error.errors ? "Data tidak valid" : error.message || "Gagal membuat user",
      });
    }
  });

  app.delete("/api/admin/users/:id", requireMainAdmin, memberEndpointSecurity, async (req, res) => {
    try {
      const { id } = req.params;
      if (id === req.session.userId) {
        return res.status(400).json({
          success: false,
          message: "Tidak dapat menghapus akun yang sedang login",
        });
      }

      await storage.deleteStaffUser(id);
      res.json({ success: true, message: "User berhasil dihapus" });
    } catch (error: any) {
      console.error("Delete staff user error:", error);
      res.status(400).json({
        success: false,
        message: error.message || "Gagal menghapus user",
      });
    }
  });

  app.post(
    "/api/admin/campaigns",
    requireMainAdmin,
    memberEndpointSecurity,
    upload.single("image"),
    async (req, res) => {
      try {
        if (!req.file) {
          return res.status(400).json({ success: false, message: "File gambar harus diupload" });
        }

        const validation = validateImageDimensions(req.file.path);
        if (!validation.valid) {
          return res.status(400).json({ success: false, message: validation.error });
        }

        const validatedData = insertCampaignSchema.parse(req.body);
        const imagePath = `/uploads/campaigns/${req.file.filename}`;
        const campaign = await storage.createCampaign(
          validatedData,
          imagePath,
          req.session.userId!,
        );

        res.json({ success: true, message: "Campaign berhasil dibuat", campaign });
      } catch (error: any) {
        if (req.file) fs.unlinkSync(req.file.path);
        console.error("Create campaign error:", error);
        res.status(400).json({
          success: false,
          message: error.errors ? "Data tidak valid" : error.message || "Gagal membuat campaign",
        });
      }
    },
  );

  app.get("/api/admin/campaigns", requireMainAdmin, memberEndpointSecurity, async (_req, res) => {
    try {
      const campaigns = await storage.getCampaigns();
      res.json({ success: true, campaigns });
    } catch (error) {
      console.error("Get campaigns error:", error);
      res.status(400).json({ success: false, message: "Gagal mengambil data campaigns" });
    }
  });

  app.get("/api/campaigns/active", async (_req, res) => {
    try {
      const campaign = await storage.getActiveCampaign();
      if (campaign) {
        await storage.incrementCampaignViewCount(campaign.id);
      }
      res.json({ success: true, campaign: campaign || null });
    } catch (error) {
      console.error("Get active campaign error:", error);
      res.status(400).json({ success: false, message: "Gagal mengambil campaign aktif" });
    }
  });

  app.patch(
    "/api/admin/campaigns/:id/status",
    requireMainAdmin,
    memberEndpointSecurity,
    async (req, res) => {
      try {
        const { status } = req.body;
        if (status !== "active" && status !== "inactive") {
          return res.status(400).json({
            success: false,
            message: "Status harus 'active' atau 'inactive'",
          });
        }

        const campaign = await storage.updateCampaignStatus(req.params.id, status);
        res.json({
          success: true,
          message:
            status === "active"
              ? "Campaign diaktifkan. Campaign lain otomatis dinonaktifkan."
              : "Campaign dinonaktifkan",
          campaign,
        });
      } catch (error: any) {
        console.error("Update campaign status error:", error);
        res.status(400).json({
          success: false,
          message: error.message || "Gagal mengubah status campaign",
        });
      }
    },
  );

  app.delete("/api/admin/campaigns/:id", requireMainAdmin, memberEndpointSecurity, async (req, res) => {
    try {
      const campaigns = await storage.getCampaigns();
      const campaign = campaigns.find((c) => c.id === req.params.id);

      if (campaign) {
        const imagePath = path.join(process.cwd(), campaign.imagePath.replace(/^\//, ""));
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }

      await storage.deleteCampaign(req.params.id);
      res.json({ success: true, message: "Campaign berhasil dihapus" });
    } catch (error: any) {
      console.error("Delete campaign error:", error);
      res.status(400).json({
        success: false,
        message: error.message || "Gagal menghapus campaign",
      });
    }
  });

  app.get("/api/menu", async (_req, res) => {
    try {
      const categories = await storage.getPublicMenu();
      res.json({ success: true, categories });
    } catch (error) {
      console.error("Get public menu error:", error);
      res.status(400).json({ success: false, message: "Gagal mengambil data menu" });
    }
  });

  app.get("/api/menu/featured", async (_req, res) => {
    try {
      const items = await storage.getFeaturedMenuItems(8);
      res.json({ success: true, items });
    } catch (error) {
      console.error("Get featured menu error:", error);
      res.status(400).json({ success: false, message: "Gagal mengambil menu unggulan" });
    }
  });

  app.get("/api/admin/menu/categories", requireMainAdmin, memberEndpointSecurity, async (_req, res) => {
    try {
      const categories = await storage.getMenuCategories();
      res.json({ success: true, categories });
    } catch (error) {
      console.error("Get menu categories error:", error);
      res.status(400).json({ success: false, message: "Gagal mengambil kategori menu" });
    }
  });

  app.post("/api/admin/menu/categories", requireMainAdmin, memberEndpointSecurity, async (req, res) => {
    try {
      const data = insertMenuCategorySchema.parse(req.body);
      const category = await storage.createMenuCategory(data);
      res.json({ success: true, message: "Kategori berhasil ditambahkan", category });
    } catch (error: any) {
      console.error("Create menu category error:", error);
      res.status(400).json({
        success: false,
        message: error.errors ? "Data tidak valid" : error.message || "Gagal menambah kategori",
      });
    }
  });

  app.patch(
    "/api/admin/menu/categories/:id",
    requireMainAdmin,
    memberEndpointSecurity,
    async (req, res) => {
      try {
        const data = updateMenuCategorySchema.parse(req.body);
        const category = await storage.updateMenuCategory(req.params.id, data);
        res.json({ success: true, message: "Kategori berhasil diperbarui", category });
      } catch (error: any) {
        console.error("Update menu category error:", error);
        res.status(400).json({
          success: false,
          message: error.errors ? "Data tidak valid" : error.message || "Gagal memperbarui kategori",
        });
      }
    },
  );

  app.delete(
    "/api/admin/menu/categories/:id",
    requireMainAdmin,
    memberEndpointSecurity,
    async (req, res) => {
      try {
        await storage.deleteMenuCategory(req.params.id);
        res.json({ success: true, message: "Kategori berhasil dihapus" });
      } catch (error: any) {
        console.error("Delete menu category error:", error);
        res.status(400).json({
          success: false,
          message: error.message || "Gagal menghapus kategori",
        });
      }
    },
  );

  app.get("/api/admin/menu/items", requireMainAdmin, memberEndpointSecurity, async (_req, res) => {
    try {
      const items = await storage.getMenuItems();
      res.json({ success: true, items });
    } catch (error) {
      console.error("Get menu items error:", error);
      res.status(400).json({ success: false, message: "Gagal mengambil item menu" });
    }
  });

  app.post(
    "/api/admin/menu/items",
    requireMainAdmin,
    memberEndpointSecurity,
    menuUpload.single("image"),
    async (req, res) => {
      try {
        if (!req.file) {
          return res.status(400).json({ success: false, message: "Foto menu harus diupload" });
        }

        const data = insertMenuItemSchema.parse(req.body);
        const imagePath = `/uploads/menu/${req.file.filename}`;
        const item = await storage.createMenuItem(data, imagePath);
        res.json({ success: true, message: "Item menu berhasil ditambahkan", item });
      } catch (error: any) {
        if (req.file) fs.unlinkSync(req.file.path);
        console.error("Create menu item error:", error);
        res.status(400).json({
          success: false,
          message: error.errors ? "Data tidak valid" : error.message || "Gagal menambah item menu",
        });
      }
    },
  );

  app.patch(
    "/api/admin/menu/items/:id",
    requireMainAdmin,
    memberEndpointSecurity,
    async (req, res) => {
      try {
        const data = updateMenuItemSchema.parse(req.body);
        const item = await storage.updateMenuItem(req.params.id, data);
        res.json({ success: true, message: "Item menu berhasil diperbarui", item });
      } catch (error: any) {
        console.error("Update menu item error:", error);
        res.status(400).json({
          success: false,
          message: error.errors ? "Data tidak valid" : error.message || "Gagal memperbarui item menu",
        });
      }
    },
  );

  app.patch(
    "/api/admin/menu/items/:id/image",
    requireMainAdmin,
    memberEndpointSecurity,
    menuUpload.single("image"),
    async (req, res) => {
      try {
        if (!req.file) {
          return res.status(400).json({ success: false, message: "Foto menu harus diupload" });
        }

        const existing = await storage.getMenuItemById(req.params.id);
        if (!existing) {
          fs.unlinkSync(req.file.path);
          return res.status(404).json({ success: false, message: "Item menu tidak ditemukan" });
        }

        const imagePath = `/uploads/menu/${req.file.filename}`;
        const item = await storage.updateMenuItemImage(req.params.id, imagePath);
        deleteUploadedFile(existing.imagePath);
        res.json({ success: true, message: "Foto menu berhasil diperbarui", item });
      } catch (error: any) {
        if (req.file) fs.unlinkSync(req.file.path);
        console.error("Update menu item image error:", error);
        res.status(400).json({
          success: false,
          message: error.message || "Gagal memperbarui foto menu",
        });
      }
    },
  );

  app.patch(
    "/api/admin/menu/items/:id/status",
    requireMainAdmin,
    memberEndpointSecurity,
    async (req, res) => {
      try {
        const patch = updateMenuItemStatusSchema.parse(req.body);
        const item = await storage.updateMenuItemStatus(req.params.id, patch);
        res.json({ success: true, message: "Status item menu berhasil diperbarui", item });
      } catch (error: any) {
        console.error("Update menu item status error:", error);
        res.status(400).json({
          success: false,
          message: error.errors ? "Data tidak valid" : error.message || "Gagal memperbarui status",
        });
      }
    },
  );

  app.delete(
    "/api/admin/menu/items/:id",
    requireMainAdmin,
    memberEndpointSecurity,
    async (req, res) => {
      try {
        const deleted = await storage.deleteMenuItem(req.params.id);
        if (deleted) {
          deleteUploadedFile(deleted.imagePath);
        }
        res.json({ success: true, message: "Item menu berhasil dihapus" });
      } catch (error: any) {
        console.error("Delete menu item error:", error);
        res.status(400).json({
          success: false,
          message: error.message || "Gagal menghapus item menu",
        });
      }
    },
  );

  app.get("/sitemap.xml", (_req, res) => {
    const baseUrl = "https://gadangbarubahindonesia.id";
    const currentDate = new Date().toISOString();

    const urls = [
      { loc: `${baseUrl}/`, priority: "1.0", changefreq: "weekly" },
      { loc: `${baseUrl}/about`, priority: "0.9", changefreq: "monthly" },
      { loc: `${baseUrl}/menu`, priority: "0.9", changefreq: "weekly" },
      { loc: `${baseUrl}/catering`, priority: "0.9", changefreq: "monthly" },
      { loc: `${baseUrl}/reservasi`, priority: "0.9", changefreq: "weekly" },
      { loc: `${baseUrl}/whats-on`, priority: "0.8", changefreq: "weekly" },
      { loc: `${baseUrl}/faq`, priority: "0.7", changefreq: "monthly" },
      { loc: `${baseUrl}/services/outlet`, priority: "0.8", changefreq: "monthly" },
    ];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>`;

    res.header("Content-Type", "application/xml");
    res.send(sitemap);
  });

  const httpServer = createServer(app);
  return httpServer;
}
