import "dotenv/config";
import { requireDb } from "./db";
import { users } from "@shared/schema";
import * as bcrypt from "bcrypt";

async function seed() {
  console.log("🌱 Starting database seed...");

  try {
    // Check if users already exist
    const existingUsers = await requireDb().select().from(users);
    
    if (existingUsers.length > 0) {
      console.log("⚠️  Users already exist. Skipping seed.");
      console.log(`Found ${existingUsers.length} existing users`);
      return;
    }

    const saltRounds = 12;

    // Create admin user
    const adminPassword = await bcrypt.hash("admin123", saltRounds);
    const [admin] = await requireDb().insert(users).values({
      username: "admin",
      password: adminPassword,
      role: "admin",
      failedAttempts: 0,
    }).returning();

    console.log("✅ Created admin user");
    console.log("   Username: admin");
    console.log("   Password: admin123");

    // Create kasir user
    const kasirPassword = await bcrypt.hash("kasir123", saltRounds);
    const [kasir] = await requireDb().insert(users).values({
      username: "kasir",
      password: kasirPassword,
      role: "kasir",
      failedAttempts: 0,
    }).returning();

    console.log("✅ Created kasir user");
    console.log("   Username: kasir");
    console.log("   Password: kasir123");

    console.log("\n🎉 Database seed completed successfully!");
    console.log("\n⚠️  IMPORTANT: Change these default passwords in production!");
    
  } catch (error) {
    console.error("❌ Seed failed:", error);
    throw error;
  }
}

seed()
  .then(() => {
    console.log("\n✨ Seed script finished");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Seed script failed:", error);
    process.exit(1);
  });
