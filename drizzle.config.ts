import "dotenv/config";
import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL, ensure the database is provisioned");
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  // DB production juga berisi tabel di luar schema ini (bills, members, vouchers, dll.);
  // tanpa filter, db:push akan menawarkan untuk menghapusnya.
  tablesFilter: [
    "session",
    "users",
    "reservations",
    "catering_inquiries",
    "campaigns",
    "menu_categories",
    "menu_items",
    "whats_on_articles",
    "site_texts",
    "uploaded_files",
    "site_media_assets",
  ],
});
