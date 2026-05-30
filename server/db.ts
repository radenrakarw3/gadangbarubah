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
