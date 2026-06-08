import { sql } from "drizzle-orm";

import { pgTable, text, varchar, date, integer, timestamp, json } from "drizzle-orm/pg-core";

import { createInsertSchema } from "drizzle-zod";

import { z } from "zod";

import { RESERVATION_STATUSES } from "./reservation-status";

export const ADMIN_ROLES = ["admin_main", "admin_cikarang", "admin_bintaro"] as const;
export type AdminRole = (typeof ADMIN_ROLES)[number];



/** Tabel session express-session (connect-pg-simple) — jangan dihapus saat db:push */
export const sessions = pgTable("session", {
  sid: varchar("sid").primaryKey(),
  sess: json("sess").notNull(),
  expire: timestamp("expire", { precision: 6, mode: "date" }).notNull(),
});

export const users = pgTable("users", {

  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),

  username: text("username").notNull().unique(),

  password: text("password").notNull(),

  role: varchar("role", { length: 20 }).notNull().default("admin_main"),

  failedAttempts: integer("failed_attempts").notNull().default(0),

  lockedUntil: timestamp("locked_until"),

  createdAt: timestamp("created_at").defaultNow().notNull(),

});



export const reservations = pgTable("reservations", {

  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),

  namaLengkap: text("nama_lengkap").notNull(),

  noWhatsApp: text("no_whatsapp").notNull(),

  email: text("email"),

  outlet: varchar("outlet", { length: 80 }),

  tanggalReservasi: date("tanggal_reservasi").notNull(),

  waktuReservasi: varchar("waktu_reservasi", { length: 5 }).notNull(),

  jumlahTamu: integer("jumlah_tamu").notNull(),

  tipeMeja: varchar("tipe_meja", { length: 20 }).notNull().default("reguler"),

  catatan: text("catatan"),

  status: varchar("status", { length: 20 }).notNull().default("pending"),

  arrivedAt: timestamp("arrived_at"),

  diningAt: timestamp("dining_at"),

  completedAt: timestamp("completed_at"),

  updatedAt: timestamp("updated_at").defaultNow().notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),

});



export const campaigns = pgTable("campaigns", {

  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),

  title: text("title").notNull(),

  imagePath: text("image_path").notNull(),

  status: varchar("status", { length: 10 }).notNull().default("inactive"),

  validFrom: timestamp("valid_from").notNull(),

  validUntil: timestamp("valid_until").notNull(),

  viewCount: integer("view_count").notNull().default(0),

  createdBy: varchar("created_by").notNull().references(() => users.id),

  createdAt: timestamp("created_at").defaultNow().notNull(),

});



export const insertUserSchema = createInsertSchema(users).pick({

  username: true,

  password: true,

  role: true,

}).extend({
  role: z.enum(ADMIN_ROLES, {
    errorMap: () => ({ message: "Role admin tidak valid" }),
  }),

});



export const loginUserSchema = z.object({

  username: z.string().min(3, "Username minimal 3 karakter"),

  password: z.string().min(6, "Password minimal 6 karakter"),

  portal: z.enum(["main", "cikarang", "bintaro"]).optional().default("main"),

});



export const insertReservationSchema = z.object({

  namaLengkap: z.string().min(2, "Nama lengkap wajib diisi"),

  noWhatsApp: z.string().min(10, "Nomor WhatsApp minimal 10 digit"),

  email: z.preprocess(

    (val) => (typeof val === "string" && val.trim() === "" ? undefined : val),

    z.string().email("Email tidak valid").optional(),

  ),

  outlet: z.string().max(80).optional(),

  tanggalReservasi: z.string().min(1, "Tanggal reservasi wajib diisi"),

  waktuReservasi: z.string().regex(/^\d{2}:\d{2}$/, "Format waktu tidak valid"),

  jumlahTamu: z.number().int().min(1, "Minimal 1 tamu").max(50, "Maksimal 50 tamu"),

  tipeMeja: z.enum(["reguler", "vip"], {

    errorMap: () => ({ message: "Pilih tipe meja" }),

  }),

  catatan: z.string().max(500, "Catatan maksimal 500 karakter").optional(),

});



export const updateReservationStatusSchema = z.object({

  status: z.enum(RESERVATION_STATUSES, {

    errorMap: () => ({ message: "Status tidak valid" }),

  }),

});



export const insertCampaignSchema = z.object({

  title: z.string().min(1, "Judul campaign harus diisi"),

  validFrom: z.string().min(1, "Tanggal mulai harus diisi"),

  validUntil: z.string().min(1, "Tanggal berakhir harus diisi"),

});



export type InsertUser = z.infer<typeof insertUserSchema>;

export type LoginUser = z.infer<typeof loginUserSchema>;

export type User = typeof users.$inferSelect;

export type InsertReservation = z.infer<typeof insertReservationSchema>;

export type Reservation = typeof reservations.$inferSelect;

export type InsertCampaign = z.infer<typeof insertCampaignSchema>;

export type Campaign = typeof campaigns.$inferSelect;


