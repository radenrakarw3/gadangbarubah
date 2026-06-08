import { sql } from "drizzle-orm";

import { pgTable, text, varchar, date, integer, timestamp, json, boolean } from "drizzle-orm/pg-core";

import { createInsertSchema } from "drizzle-zod";

import { z } from "zod";

import { RESERVATION_STATUSES } from "./reservation-status";
import { CATERING_INQUIRY_TYPES } from "./catering";
import { RESERVATION_OUTLET_IDS } from "./reservation-utils";

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

  confirmedAt: timestamp("confirmed_at"),

  arrivedAt: timestamp("arrived_at"),

  diningAt: timestamp("dining_at"),

  completedAt: timestamp("completed_at"),

  cancelledAt: timestamp("cancelled_at"),

  customerNotifyOk: boolean("customer_notify_ok"),

  customerNotifyError: text("customer_notify_error"),

  customerNotifyAt: timestamp("customer_notify_at"),

  staffNotifyOk: boolean("staff_notify_ok"),

  staffNotifyError: text("staff_notify_error"),

  staffNotifyAt: timestamp("staff_notify_at"),

  updatedAt: timestamp("updated_at").defaultNow().notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),

});



export const cateringInquiries = pgTable("catering_inquiries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  nama: text("nama").notNull(),
  noWhatsApp: text("no_whatsapp").notNull(),
  email: text("email"),
  tipeLayanan: varchar("tipe_layanan", { length: 40 }).notNull(),
  pax: integer("pax").notNull(),
  status: varchar("status", { length: 20 }).notNull().default("pending"),
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



export const menuCategories = pgTable("menu_categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  nameId: text("name_id").notNull(),
  nameEn: text("name_en").notNull(),
  slug: varchar("slug", { length: 80 }).notNull().unique(),
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const menuItems = pgTable("menu_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  categoryId: varchar("category_id").notNull().references(() => menuCategories.id),
  nameId: text("name_id").notNull(),
  nameEn: text("name_en").notNull(),
  descriptionId: text("description_id").notNull(),
  descriptionEn: text("description_en").notNull(),
  imagePath: text("image_path").notNull(),
  tag: varchar("tag", { length: 40 }),
  isFeatured: boolean("is_featured").notNull().default(false),
  isActive: boolean("is_active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
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

  outlet: z.enum(RESERVATION_OUTLET_IDS, {
    errorMap: () => ({ message: "Pilih outlet yang valid" }),
  }),

  tanggalReservasi: z.string().min(1, "Tanggal reservasi wajib diisi"),

  waktuReservasi: z.string().regex(/^\d{2}:\d{2}$/, "Format waktu tidak valid"),

  jumlahTamu: z.number().int().min(1, "Minimal 1 tamu").max(50, "Maksimal 50 tamu"),

  tipeMeja: z.enum(["reguler", "vip"], {

    errorMap: () => ({ message: "Pilih tipe meja" }),

  }),

  catatan: z.string().max(500, "Catatan maksimal 500 karakter").optional(),

});



export const insertCateringInquirySchema = z.object({
  nama: z.string().min(2, "Nama wajib diisi"),
  telepon: z.string().min(10, "Nomor telepon minimal 10 digit"),
  email: z.preprocess(
    (val) => (typeof val === "string" && val.trim() === "" ? undefined : val),
    z.string().email("Email tidak valid").optional(),
  ),
  tipe: z.enum(CATERING_INQUIRY_TYPES, {
    errorMap: () => ({ message: "Pilih layanan catering yang valid" }),
  }),
  pax: z.coerce.number().int().min(1, "Minimal 1 pax").max(5000, "Maksimal 5000 pax"),
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



export const insertMenuCategorySchema = z.object({
  nameId: z.string().min(1, "Nama kategori (ID) wajib diisi"),
  nameEn: z.string().min(1, "Nama kategori (EN) wajib diisi"),
  slug: z
    .string()
    .min(1, "Slug wajib diisi")
    .max(80)
    .regex(/^[a-z0-9-]+$/, "Slug hanya huruf kecil, angka, dan strip"),
  sortOrder: z.coerce.number().int().min(0).optional().default(0),
  isActive: z.coerce.boolean().optional().default(true),
});

export const updateMenuCategorySchema = insertMenuCategorySchema.partial();

export const insertMenuItemSchema = z.object({
  categoryId: z.string().min(1, "Kategori wajib dipilih"),
  nameId: z.string().min(1, "Nama (ID) wajib diisi"),
  nameEn: z.string().min(1, "Nama (EN) wajib diisi"),
  descriptionId: z.string().min(1, "Deskripsi (ID) wajib diisi"),
  descriptionEn: z.string().min(1, "Deskripsi (EN) wajib diisi"),
  tag: z.string().max(40).optional(),
  isFeatured: z.coerce.boolean().optional().default(false),
  isActive: z.coerce.boolean().optional().default(true),
  sortOrder: z.coerce.number().int().min(0).optional().default(0),
});

export const updateMenuItemSchema = insertMenuItemSchema.partial();

export const updateMenuItemStatusSchema = z.object({
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
});



export type InsertUser = z.infer<typeof insertUserSchema>;

export type LoginUser = z.infer<typeof loginUserSchema>;

export type User = typeof users.$inferSelect;

export type InsertReservation = z.infer<typeof insertReservationSchema>;

export type Reservation = typeof reservations.$inferSelect;

export type InsertCateringInquiry = z.infer<typeof insertCateringInquirySchema>;

export type CateringInquiry = typeof cateringInquiries.$inferSelect;

export type InsertCampaign = z.infer<typeof insertCampaignSchema>;

export type Campaign = typeof campaigns.$inferSelect;

export type InsertMenuCategory = z.infer<typeof insertMenuCategorySchema>;
export type UpdateMenuCategory = z.infer<typeof updateMenuCategorySchema>;
export type MenuCategory = typeof menuCategories.$inferSelect;

export type InsertMenuItem = z.infer<typeof insertMenuItemSchema>;
export type UpdateMenuItem = z.infer<typeof updateMenuItemSchema>;
export type MenuItem = typeof menuItems.$inferSelect;


