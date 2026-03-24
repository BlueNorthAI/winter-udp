/**
 * Load a sampled version of transaction_data.csv into Neon
 * Limits to 300K rows to stay within Neon's 512MB free tier
 */

import { Pool } from "pg";
import * as fs from "fs";
import * as path from "path";
import Papa from "papaparse";

const DATABASE_URL = process.env.DATABASE_URL ||
  "postgresql://BLUENORTH:74744812@0.tcp.in.ngrok.io:18552/assortment_db";

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: DATABASE_URL.includes("sslmode=require") ? { rejectUnauthorized: false } : false,
  max: 3,
});

const MAX_ROWS = 300000;

async function main() {
  const filePath = path.join(
    __dirname,
    "..",
    "dunnhumby_The-Complete-Journey",
    "dunnhumby_The-Complete-Journey CSV",
    "transaction_data.csv"
  );

  console.log(`Reading transaction_data.csv (sampling first ${MAX_ROWS.toLocaleString()} rows)...`);

  const content = fs.readFileSync(filePath, "utf-8");
  const parsed = Papa.parse<Record<string, string>>(content, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: false,
    preview: MAX_ROWS,
  });

  const headers = (parsed.meta.fields || []).map((h) =>
    h.trim().replace(/[^a-zA-Z0-9_]/g, "_").replace(/^(\d)/, "_$1").toLowerCase()
  );
  const rows = parsed.data.slice(0, MAX_ROWS);
  console.log(`Parsed: ${rows.length.toLocaleString()} rows, ${headers.length} columns`);

  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS bronze_dunnhumby.transaction_data (
        household_key BIGINT,
        basket_id BIGINT,
        day BIGINT,
        product_id BIGINT,
        quantity BIGINT,
        sales_value NUMERIC,
        store_id BIGINT,
        retail_disc NUMERIC,
        trans_time BIGINT,
        week_no BIGINT,
        coupon_disc NUMERIC,
        coupon_match_disc NUMERIC
      )
    `);
    console.log("Table created");

    const BATCH_SIZE = 1000;
    let inserted = 0;
    const originalHeaders = parsed.meta.fields!;

    for (let i = 0; i < rows.length; i += BATCH_SIZE) {
      const batch = rows.slice(i, i + BATCH_SIZE);
      if (batch.length === 0) continue;

      const colNames = headers.map((h) => `"${h}"`).join(", ");
      const valuePlaceholders = batch
        .map(
          (_, rowIdx) =>
            `(${headers.map((_, colIdx) => `$${rowIdx * headers.length + colIdx + 1}`).join(", ")})`
        )
        .join(", ");

      const values = batch.flatMap((row) =>
        originalHeaders.map((h) => {
          const val = row[h];
          if (val === "" || val == null) return null;
          return val.trim();
        })
      );

      await client.query(
        `INSERT INTO bronze_dunnhumby.transaction_data (${colNames}) VALUES ${valuePlaceholders}`,
        values
      );

      inserted += batch.length;
      if (inserted % 50000 === 0 || inserted === rows.length) {
        process.stdout.write(
          `\r  Inserted: ${inserted.toLocaleString()} / ${rows.length.toLocaleString()} (${((inserted / rows.length) * 100).toFixed(0)}%)`
        );
      }
    }

    console.log(`\nDone: ${inserted.toLocaleString()} rows loaded`);

    // Register in meta
    await client.query(
      `INSERT INTO meta.datasets (workspace_id, name, source_type, medallion_layer, schema_name, table_name, row_count, column_count, created_by)
       VALUES ('dunnhumby', 'transaction_data', 'bulk_load', 'bronze', 'bronze_dunnhumby', 'transaction_data', $1, $2, 'system')
       ON CONFLICT DO NOTHING`,
      [inserted, headers.length]
    );

    const db = await client.query("SELECT pg_database_size('winter_datalake') as s");
    console.log("DB size: " + (parseInt(db.rows[0].s) / 1024 / 1024).toFixed(1) + " MB / 512 MB");
  } finally {
    client.release();
  }

  await pool.end();
}

main().catch((err) => {
  console.error("FATAL:", err.message);
  process.exit(1);
});
