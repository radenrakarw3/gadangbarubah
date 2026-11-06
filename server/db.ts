import "dotenv/config";
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
import * as schema from "@shared/schema";
import { isProduction } from "./env";

neonConfig.webSocketConstructor = ws;

const databaseUrl = process.env.DATABASE_URL?.trim();

if (!databaseUrl) {
  if (isProduction()) {
    throw new Error(
      "DATABASE_URL must be set. Did you forget to provision a database?",
    );
  }
  console.warn(
    "[dev] DATABASE_URL tidak di-set — fitur database/API tidak aktif sampai .env diisi",
  );
}

export const pool = databaseUrl
  ? new Pool({ connectionString: databaseUrl })
  : null;

export const db = pool
  ? drizzle({ client: pool, schema })
  : null;

export function requireDb() {
  if (!db) {
    throw new Error(
      "DATABASE_URL must be set. Tambahkan connection string Neon ke file .env",
    );
  }
  return db;
}

/** Pastikan tabel blob media ada (Railway/Neon production kadang belum ikut db:push). */
export async function ensureMediaTables(): Promise<void> {
  if (!pool) return;
  await pool.query(`
    CREATE TABLE IF NOT EXISTS uploaded_files (
      id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
      mime_type varchar(80) NOT NULL,
      size integer NOT NULL,
      data bytea NOT NULL,
      created_at timestamp DEFAULT now() NOT NULL
    );
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS site_media_assets (
      key varchar(80) PRIMARY KEY,
      image_path text NOT NULL,
      label text NOT NULL,
      updated_at timestamp DEFAULT now() NOT NULL
    );
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS site_texts (
      key varchar(120) PRIMARY KEY,
      value_id text NOT NULL,
      value_en text NOT NULL,
      updated_by varchar REFERENCES users(id) ON DELETE SET NULL,
      updated_at timestamp DEFAULT now() NOT NULL
    );
  `);
}
