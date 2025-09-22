import { sql } from "drizzle-orm";
import { pgTable, text, varchar, date } from "drizzle-orm/pg-core";
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

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertMember = z.infer<typeof insertMemberSchema>;
export type Member = typeof members.$inferSelect;
export type LoginMember = z.infer<typeof loginMemberSchema>;
