import "dotenv/config";
import { Pool } from "@neondatabase/serverless";

const LEGACY_TABLES = [
  "members",
  "member_points",
  "point_transactions",
  "vouchers",
  "promos",
  "bills",
  "bill_items",
  "kasir_sessions",
];

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  console.log("🧹 Membersihkan data lama...\n");

  for (const table of LEGACY_TABLES) {
    const exists = await pool.query(
      `SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name=$1`,
      [table],
    );
    if (exists.rowCount) {
      await pool.query(`DROP TABLE IF EXISTS "${table}" CASCADE`);
      console.log(`  ✓ Dropped legacy table: ${table}`);
    }
  }

  const delReservations = await pool.query(`DELETE FROM reservations`);
  console.log(`  ✓ Hapus ${delReservations.rowCount} reservasi (termasuk data test)`);

  const delSessions = await pool.query(`DELETE FROM session`);
  console.log(`  ✓ Hapus ${delSessions.rowCount} session lama`);

  const delCampaigns = await pool.query(`DELETE FROM campaigns`);
  console.log(`  ✓ Hapus ${delCampaigns.rowCount} campaign`);

  const kasirUsers = await pool.query(`DELETE FROM users WHERE role != 'admin'`);
  console.log(`  ✓ Hapus ${kasirUsers.rowCount} user non-admin`);

  const remaining = await pool.query(`SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name`);
  console.log("\n📊 Tabel tersisa:", remaining.rows.map((r) => r.table_name).join(", "));

  for (const row of remaining.rows) {
    const t = row.table_name;
    const c = await pool.query(`SELECT COUNT(*)::int AS n FROM "${t}"`);
    console.log(`   ${t}: ${c.rows[0].n} baris`);
  }

  console.log("\n✅ Cleanup selesai. Admin user tetap dipertahankan.");
  await pool.end();
}

main().catch((e) => {
  console.error("❌ Cleanup gagal:", e);
  process.exit(1);
});
