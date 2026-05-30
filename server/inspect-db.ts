import "dotenv/config";
import { Pool } from "@neondatabase/serverless";

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const tables = await pool.query(
    `SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name`,
  );
  console.log("TABLES:", tables.rows.map((x) => x.table_name).join(", "));

  for (const t of tables.rows.map((x) => x.table_name)) {
    const c = await pool.query(`SELECT COUNT(*)::int AS n FROM "${t}"`);
    console.log(`${t}: ${c.rows[0].n} rows`);
  }

  await pool.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
