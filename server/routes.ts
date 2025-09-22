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

  const httpServer = createServer(app);

  return httpServer;
}
