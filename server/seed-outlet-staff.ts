import "dotenv/config";
import { eq } from "drizzle-orm";
import * as bcrypt from "bcrypt";
import { requireDb } from "./db";
import { users } from "@shared/schema";

const OUTLET_STAFF = [
  {
    username: "reservasi_cikarang",
    role: "admin_cikarang" as const,
    defaultPassword: "CikarangReservasi2026!",
  },
  {
    username: "reservasi_bintaro",
    role: "admin_bintaro" as const,
    defaultPassword: "BintaroReservasi2026!",
  },
];

async function seedOutletStaff() {
  console.log("🌱 Seeding akun staff reservasi per outlet...");

  for (const staff of OUTLET_STAFF) {
    const [existing] = await requireDb()
      .select()
      .from(users)
      .where(eq(users.username, staff.username))
      .limit(1);

    if (existing) {
      console.log(`  ⏭️  ${staff.username} sudah ada (role: ${existing.role})`);
      continue;
    }

    const password = process.env[`SEED_PASSWORD_${staff.role.toUpperCase()}`] ?? staff.defaultPassword;
    const hashed = await bcrypt.hash(password, 12);

    await requireDb().insert(users).values({
      username: staff.username,
      password: hashed,
      role: staff.role,
      failedAttempts: 0,
    });

    console.log(`  ✅ Dibuat: ${staff.username} (${staff.role})`);
    console.log(`     Login: /kelola-reservasi/${staff.role === "admin_cikarang" ? "cikarang" : "bintaro"}`);
    if (!process.env[`SEED_PASSWORD_${staff.role.toUpperCase()}`]) {
      console.log(`     Password default: ${staff.defaultPassword}`);
      console.log("     ⚠️  Ganti password setelah login pertama!");
    }
  }

  console.log("\n✨ Seed staff reservasi selesai");
}

seedOutletStaff()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Seed staff gagal:", err);
    process.exit(1);
  });
