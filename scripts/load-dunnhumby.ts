/**
 * Bulk loader for dunnhumby "The Complete Journey" dataset
 * Loads 7 CSV files into bronze schema on Neon PostgreSQL
 *
 * Usage: npx tsx scripts/load-dunnhumby.ts <workspaceId>
 */

import { Pool } from "pg";
import * as fs from "fs";
import * as path from "path";
import Papa from "papaparse";

const DATABASE_URL = process.env.DATABASE_URL ||
  "postgresql://BLUENORTH:74744812@0.tcp.in.ngrok.io:18552/assortment_db";

const DATA_DIR = path.join(__dirname, "..", "dunnhumby_The-Complete-Journey", "dunnhumby_The-Complete-Journey CSV");

// Files to load (skipping causal_data.csv - 36M rows, too large)
const FILES = [
  { file: "hh_demographic.csv", table: "hh_demographic" },
  { file: "product.csv", table: "product" },
  { file: "campaign_desc.csv", table: "campaign_desc" },
  { file: "campaign_table.csv", table: "campaign_table" },
  { file: "coupon.csv", table: "coupon" },
  { file: "coupon_redempt.csv", table: "coupon_redempt" },
  { file: "transaction_data.csv", table: "transaction_data" },
];

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: DATABASE_URL.includes("sslmode=require") ? { rejectUnauthorized: false } : false,
  max: 3,
});

function inferPgType(values: string[]): string {
  const nonEmpty = values.filter((v) => v !== "" && v != null);
  if (nonEmpty.length === 0) return "TEXT";

  if (nonEmpty.every((v) => /^-?\d+$/.test(v.trim()))) return "BIGINT";
  if (nonEmpty.every((v) => /^-?\d+\.?\d*$/.test(v.trim()))) return "NUMERIC";
  return "TEXT";
}

function sanitizeColName(name: string): string {
  return name.trim().replace(/[^a-zA-Z0-9_]/g, "_").replace(/^(\d)/, "_$1").toLowerCase();
}

async function loadFile(schemaName: string, fileName: string, tableName: string) {
  const filePath = path.join(DATA_DIR, fileName);

  if (!fs.existsSync(filePath)) {
    console.log(`  SKIP: ${fileName} not found`);
    return;
  }

  const fileSize = fs.statSync(filePath).size;
  console.log(`\n  Loading ${fileName} (${(fileSize / 1024 / 1024).toFixed(1)} MB)...`);

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const parsed = Papa.parse<Record<string, string>>(fileContent, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: false,
  });

  const headers = (parsed.meta.fields || []).map(sanitizeColName);
  const rows = parsed.data;

  console.log(`  Parsed: ${rows.length.toLocaleString()} rows, ${headers.length} columns`);

  // Infer types from first 1000 rows
  const sampleSize = Math.min(rows.length, 1000);
  const colTypes = headers.map((header, i) => {
    const originalHeader = parsed.meta.fields![i];
    const values = rows.slice(0, sampleSize).map((r) => String(r[originalHeader] ?? ""));
    return inferPgType(values);
  });

  const client = await pool.connect();
  try {
    // Drop and create table
    await client.query(`DROP TABLE IF EXISTS "${schemaName}"."${tableName}" CASCADE`);

    const colDefs = headers.map((h, i) => `"${h}" ${colTypes[i]}`).join(", ");
    await client.query(`CREATE TABLE "${schemaName}"."${tableName}" (${colDefs})`);
    console.log(`  Created table ${schemaName}.${tableName}`);

    // Insert in batches
    const BATCH_SIZE = 1000;
    let inserted = 0;

    for (let i = 0; i < rows.length; i += BATCH_SIZE) {
      const batch = rows.slice(i, i + BATCH_SIZE);
      if (batch.length === 0) continue;

      const colNames = headers.map((h) => `"${h}"`).join(", ");
      const valuePlaceholders = batch
        .map((_, rowIdx) =>
          `(${headers.map((_, colIdx) => `$${rowIdx * headers.length + colIdx + 1}`).join(", ")})`
        )
        .join(", ");

      const values = batch.flatMap((row) =>
        (parsed.meta.fields || []).map((originalHeader) => {
          const val = row[originalHeader];
          if (val === "" || val == null) return null;
          return val.trim();
        })
      );

      await client.query(
        `INSERT INTO "${schemaName}"."${tableName}" (${colNames}) VALUES ${valuePlaceholders}`,
        values
      );

      inserted += batch.length;
      if (inserted % 50000 === 0 || inserted === rows.length) {
        const pct = ((inserted / rows.length) * 100).toFixed(0);
        process.stdout.write(`\r  Inserted: ${inserted.toLocaleString()} / ${rows.length.toLocaleString()} (${pct}%)`);
      }
    }

    console.log(`\n  Done: ${inserted.toLocaleString()} rows loaded into ${schemaName}.${tableName}`);

    // Record in meta.datasets
    const columnMetadata = headers.map((h, i) => ({
      name: h,
      type: colTypes[i],
      nullable: true,
      sampleValues: [],
    }));

    await client.query(
      `INSERT INTO meta.datasets (workspace_id, name, source_type, medallion_layer, schema_name, table_name, row_count, column_count, column_metadata, created_by)
       VALUES ($1, $2, 'bulk_load', 'bronze', $3, $4, $5, $6, $7, 'system')
       ON CONFLICT DO NOTHING`,
      [workspaceId, tableName, schemaName, tableName, inserted, headers.length, JSON.stringify(columnMetadata)]
    );

  } finally {
    client.release();
  }
}

// --- Main ---
const workspaceId = process.argv[2];
if (!workspaceId) {
  console.error("Usage: npx tsx scripts/load-dunnhumby.ts <workspaceId>");
  console.error("  Find your workspaceId from the URL: /workspaces/<workspaceId>");
  process.exit(1);
}

const safeWsId = workspaceId.replace(/[^a-zA-Z0-9_]/g, "_");
const schemaName = `bronze_${safeWsId}`;

async function main() {
  console.log("=== Dunnhumby Complete Journey - Bulk Loader ===");
  console.log(`Workspace: ${workspaceId}`);
  console.log(`Target schema: ${schemaName}`);
  console.log(`Database: PostgreSQL (ngrok tunnel)`);
  console.log(`Files: ${FILES.length} CSVs (skipping causal_data.csv)\n`);

  // Ensure schemas exist
  const client = await pool.connect();
  try {
    // Run meta migration if needed
    await client.query("CREATE SCHEMA IF NOT EXISTS meta");
    await client.query(`CREATE SCHEMA IF NOT EXISTS ${schemaName}`);
    await client.query(`CREATE SCHEMA IF NOT EXISTS silver_${safeWsId}`);
    await client.query(`CREATE SCHEMA IF NOT EXISTS gold_${safeWsId}`);
    console.log(`Schemas created/verified: ${schemaName}, silver_${safeWsId}, gold_${safeWsId}`);

    // Ensure meta.datasets table exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS meta.datasets (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        workspace_id TEXT NOT NULL,
        name TEXT NOT NULL,
        source_type TEXT NOT NULL,
        source_connection_id UUID,
        medallion_layer TEXT NOT NULL,
        schema_name TEXT NOT NULL,
        table_name TEXT NOT NULL,
        row_count BIGINT,
        column_count INT,
        file_size_bytes BIGINT,
        column_metadata JSONB,
        created_by TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);
  } finally {
    client.release();
  }

  // Load each file
  const startTime = Date.now();
  for (const { file, table } of FILES) {
    await loadFile(schemaName, file, table);
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n=== All done! ${FILES.length} tables loaded in ${elapsed}s ===`);
  console.log(`\nYou can now:`);
  console.log(`  1. Open SQL Editor and run: SELECT * FROM ${schemaName}.transaction_data LIMIT 100;`);
  console.log(`  2. Browse the Catalog to see all tables`);
  console.log(`  3. Build pipelines to promote data to Silver/Gold`);
  console.log(`  4. Run ML experiments (forecasting, elasticity) on the data`);

  await pool.end();
}

main().catch((err) => {
  console.error("FATAL:", err);
  process.exit(1);
});
