import { sql } from "drizzle-orm";
import { pgTable, text, varchar, date, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const members = pgTable("members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  namaLengkap: text("nama_lengkap").notNull(),
  jenisKelamin: varchar("jenis_kelamin", { length: 3 }).notNull(), // 'Uda' or 'Uni'
  noWhatsApp: text("no_whatsapp").notNull().unique(),
  tanggalLahir: date("tanggal_lahir").notNull(),
  kodePos: varchar("kode_pos", { length: 10 }).notNull(),
  pinHash: text("pin_hash").notNull(),
});

// Member points balance - one record per member
export const memberPoints = pgTable("member_points", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  memberId: varchar("member_id").notNull().unique().references(() => members.id),
  totalPoints: integer("total_points").notNull().default(0),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Vouchers that can be created by admin
export const vouchers = pgTable("vouchers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  pointsCost: integer("points_cost").notNull(),
  validFrom: timestamp("valid_from").notNull(),
  validUntil: timestamp("valid_until").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  createdBy: varchar("created_by").notNull().references(() => users.id), // Admin who created it
});

// Promos created by admin
export const promos = pgTable("promos", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  validFrom: timestamp("valid_from").notNull(),
  validUntil: timestamp("valid_until").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  createdBy: varchar("created_by").notNull().references(() => users.id), // Admin who created it
});

// Bills processed by kasir to award points
export const bills = pgTable("bills", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  memberId: varchar("member_id").notNull().references(() => members.id),
  totalAmount: integer("total_amount").notNull(), // in rupiah
  pointsAwarded: integer("points_awarded").notNull(),
  processedBy: varchar("processed_by").notNull().references(() => users.id), // Kasir who processed it
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Track voucher claims by members
export const voucherClaims = pgTable("voucher_claims", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  voucherId: varchar("voucher_id").notNull().references(() => vouchers.id),
  memberId: varchar("member_id").notNull().references(() => members.id),
  pointsUsed: integer("points_used").notNull(),
  status: varchar("status", { length: 20 }).notNull().default("claimed"), // claimed, redeemed, expired
  claimedAt: timestamp("claimed_at").defaultNow().notNull(),
  redeemedAt: timestamp("redeemed_at"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertMemberSchema = createInsertSchema(members).omit({
  id: true,
  pinHash: true, // Omit pinHash as we'll accept pin and hash it server-side
}).extend({
  jenisKelamin: z.enum(["Uda", "Uni"], { errorMap: () => ({ message: "Pilih jenis kelamin" }) }),
  pin: z.string().length(6, "PIN harus 6 digit"),
});

export const loginMemberSchema = z.object({
  noWhatsApp: z.string().min(10, "Nomor WhatsApp minimal 10 digit"),
  pin: z.string().length(6, "PIN harus 6 digit"),
});

// Voucher schemas
export const insertVoucherSchema = z.object({
  title: z.string().min(1, "Judul voucher harus diisi"),
  description: z.string().min(1, "Deskripsi harus diisi"),
  pointsCost: z.number().min(1, "Points cost minimal 1"),
  validFrom: z.string().min(1, "Tanggal mulai harus diisi"),
  validUntil: z.string().min(1, "Tanggal berakhir harus diisi"),
  isActive: z.boolean().optional().default(true),
});

export const insertPromoSchema = z.object({
  title: z.string().min(1, "Judul promo harus diisi"),
  description: z.string().min(1, "Deskripsi harus diisi"),
  validFrom: z.string().min(1, "Tanggal mulai harus diisi"),
  validUntil: z.string().min(1, "Tanggal berakhir harus diisi"),
  isActive: z.boolean().optional().default(true),
});

export const insertBillSchema = createInsertSchema(bills).omit({
  id: true,
  createdAt: true,
  processedBy: true,
  pointsAwarded: true, // Will be calculated from totalAmount
});

export const claimVoucherSchema = z.object({
  voucherId: z.string().uuid(),
});

// Type exports
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertMember = z.infer<typeof insertMemberSchema>;
export type Member = typeof members.$inferSelect;
export type LoginMember = z.infer<typeof loginMemberSchema>;

export type MemberPoints = typeof memberPoints.$inferSelect;
export type InsertVoucher = z.infer<typeof insertVoucherSchema>;
export type Voucher = typeof vouchers.$inferSelect;
export type InsertPromo = z.infer<typeof insertPromoSchema>;
export type Promo = typeof promos.$inferSelect;
export type InsertBill = z.infer<typeof insertBillSchema>;
export type Bill = typeof bills.$inferSelect;
export type VoucherClaim = typeof voucherClaims.$inferSelect;
export type ClaimVoucherRequest = z.infer<typeof claimVoucherSchema>;
