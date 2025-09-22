import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMemberSchema, loginMemberSchema } from "@shared/schema";
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
  app.post("/api/members/login", memberEndpointSecurity, async (req, res) => {
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
