import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { Pool } from "pg";
import Papa from "papaparse";
import * as XLSX from "xlsx";

import { sessionMiddleware } from "@/lib/session-middleware";
import { dbMiddleware } from "@/lib/db-middleware";
import { runMigrations, ensureWorkspaceSchemas, sanitizeWorkspaceId } from "@/lib/db-migrate";

import { confirmUploadSchema, createConnectionSchema, importTableSchema } from "../schemas";
import { InferredColumn } from "../types";

function inferColumnType(values: string[]): InferredColumn["type"] {
  const nonEmpty = values.filter((v) => v !== "" && v !== null && v !== undefined);
  if (nonEmpty.length === 0) return "TEXT";

  const allBool = nonEmpty.every((v) =>
    ["true", "false", "1", "0", "yes", "no"].includes(String(v).toLowerCase())
  );
  if (allBool) return "BOOLEAN";

  const allInt = nonEmpty.every((v) => /^-?\d+$/.test(String(v)));
  if (allInt) return "INTEGER";

  const allNum = nonEmpty.every((v) => /^-?\d+\.?\d*$/.test(String(v)));
  if (allNum) return "NUMERIC";

  const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  const allDate = nonEmpty.every((v) => datePattern.test(String(v)));
  if (allDate) return "DATE";

  const tsPattern = /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}/;
  const allTs = nonEmpty.every((v) => tsPattern.test(String(v)));
  if (allTs) return "TIMESTAMP";

  return "TEXT";
}

function pgType(t: InferredColumn["type"]): string {
  switch (t) {
    case "INTEGER": return "BIGINT";
    case "NUMERIC": return "NUMERIC";
    case "BOOLEAN": return "BOOLEAN";
    case "DATE": return "DATE";
    case "TIMESTAMP": return "TIMESTAMPTZ";
    default: return "TEXT";
  }
}

const app = new Hono()
  // Upload and parse file (CSV or Excel)
  .post("/upload", sessionMiddleware, dbMiddleware, async (c) => {
    await runMigrations();

    const body = await c.req.parseBody();
    const file = body["file"] as File;

    if (!file) {
      return c.json({ error: "No file provided" }, 400);
    }

    const fileName = file.name;
    const fileSize = file.size;
    const ext = fileName.split(".").pop()?.toLowerCase();

    let rows: Record<string, string>[] = [];
    let headers: string[] = [];

    if (ext === "csv") {
      const text = await file.text();
      const parsed = Papa.parse<Record<string, string>>(text, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: false,
      });
      headers = parsed.meta.fields || [];
      rows = parsed.data;
    } else if (ext === "xlsx" || ext === "xls") {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json<Record<string, string>>(sheet, { defval: "" });
      if (jsonData.length > 0) {
        headers = Object.keys(jsonData[0]);
      }
      rows = jsonData;
    } else {
      return c.json({ error: "Unsupported file type. Use .csv, .xlsx, or .xls" }, 400);
    }

    // Sanitize column names
    headers = headers.map((h) =>
      h.trim().replace(/[^a-zA-Z0-9_]/g, "_").replace(/^(\d)/, "_$1").toLowerCase()
    );

    // Sample for type inference (up to 1000 rows)
    const sampleSize = Math.min(rows.length, 1000);
    const columns: InferredColumn[] = headers.map((header) => {
      const values = rows.slice(0, sampleSize).map((r) => String(r[header] ?? ""));
      return {
        name: header,
        type: inferColumnType(values),
        nullable: values.some((v) => v === "" || v === null || v === undefined),
        sampleValues: values.slice(0, 5),
      };
    });

    // Preview rows (first 100)
    const previewRows = rows.slice(0, 100).map((row) => {
      const sanitized: Record<string, unknown> = {};
      headers.forEach((h, i) => {
        const originalKey = Object.keys(row)[i];
        sanitized[h] = row[originalKey];
      });
      return sanitized;
    });

    return c.json({
      data: {
        fileName,
        fileSize,
        rowCount: rows.length,
        columns,
        previewRows,
        rawData: rows, // Full data for confirm step
      },
    });
  })

  // Confirm upload and create table
  .post(
    "/confirm",
    sessionMiddleware,
    dbMiddleware,
    zValidator("json", confirmUploadSchema),
    async (c) => {
      await runMigrations();
      const user = c.get("user");
      const db = c.get("db") as Pool;
      const { workspaceId, tableName, columns, data, medallionLayer } = c.req.valid("json");

      const safeWsId = sanitizeWorkspaceId(workspaceId);
      await ensureWorkspaceSchemas(safeWsId);

      const schemaName = `${medallionLayer}_${safeWsId}`;
      const client = await db.connect();

      try {
        await client.query("BEGIN");

        // Create table
        const colDefs = columns
          .map((col) => `"${col.name}" ${pgType(col.type as InferredColumn["type"])}${col.nullable ? "" : " NOT NULL"}`)
          .join(", ");
        await client.query(`CREATE TABLE IF NOT EXISTS "${schemaName}"."${tableName}" (${colDefs})`);

        // Bulk insert in batches of 500
        const batchSize = 500;
        for (let i = 0; i < data.length; i += batchSize) {
          const batch = data.slice(i, i + batchSize);
          if (batch.length === 0) continue;

          const colNames = columns.map((col) => `"${col.name}"`).join(", ");
          const valuePlaceholders = batch
            .map((_, rowIdx) =>
              `(${columns.map((_, colIdx) => `$${rowIdx * columns.length + colIdx + 1}`).join(", ")})`
            )
            .join(", ");

          const values = batch.flatMap((row) =>
            columns.map((col) => {
              const val = row[col.name];
              if (val === "" || val === null || val === undefined) return null;
              return val;
            })
          );

          await client.query(
            `INSERT INTO "${schemaName}"."${tableName}" (${colNames}) VALUES ${valuePlaceholders}`,
            values
          );
        }

        // Record in meta.datasets
        await client.query(
          `INSERT INTO meta.datasets (workspace_id, name, source_type, medallion_layer, schema_name, table_name, row_count, column_count, column_metadata, created_by)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
          [
            workspaceId,
            tableName,
            "file_upload",
            medallionLayer,
            schemaName,
            tableName,
            data.length,
            columns.length,
            JSON.stringify(columns),
            user.id,
          ]
        );

        await client.query("COMMIT");

        return c.json({
          data: {
            schema: schemaName,
            table: tableName,
            rowsInserted: data.length,
          },
        });
      } catch (error) {
        await client.query("ROLLBACK");
        const message = error instanceof Error ? error.message : "Unknown error";
        return c.json({ error: `Failed to create table: ${message}` }, 500);
      } finally {
        client.release();
      }
    }
  )

  // List datasets for a workspace
  .get("/datasets", sessionMiddleware, dbMiddleware, async (c) => {
    await runMigrations();
    const db = c.get("db") as Pool;
    const workspaceId = c.req.query("workspaceId");

    if (!workspaceId) {
      return c.json({ error: "workspaceId is required" }, 400);
    }

    const result = await db.query(
      "SELECT * FROM meta.datasets WHERE workspace_id = $1 OR workspace_id = 'dunnhumby' ORDER BY created_at DESC",
      [workspaceId]
    );

    return c.json({ data: result.rows });
  })

  // Create external PostgreSQL connection
  .post(
    "/connections",
    sessionMiddleware,
    dbMiddleware,
    zValidator("json", createConnectionSchema),
    async (c) => {
      await runMigrations();
      const user = c.get("user");
      const db = c.get("db") as Pool;
      const { workspaceId, name, host, port, database, username, password, sslEnabled } =
        c.req.valid("json");

      const result = await db.query(
        `INSERT INTO meta.connections (workspace_id, name, type, host, port, database_name, username, password_encrypted, ssl_enabled, status, created_by)
         VALUES ($1, $2, 'postgresql', $3, $4, $5, $6, $7, $8, 'active', $9)
         RETURNING *`,
        [workspaceId, name, host, port, database, username, password, sslEnabled, user.id]
      );

      return c.json({ data: result.rows[0] });
    }
  )

  // List connections
  .get("/connections", sessionMiddleware, dbMiddleware, async (c) => {
    await runMigrations();
    const db = c.get("db") as Pool;
    const workspaceId = c.req.query("workspaceId");

    if (!workspaceId) {
      return c.json({ error: "workspaceId is required" }, 400);
    }

    const result = await db.query(
      "SELECT id, workspace_id, name, type, host, port, database_name, username, ssl_enabled, status, created_by, created_at FROM meta.connections WHERE workspace_id = $1 ORDER BY created_at DESC",
      [workspaceId]
    );

    return c.json({ data: result.rows });
  })

  // Test connection
  .post("/connections/:connectionId/test", sessionMiddleware, dbMiddleware, async (c) => {
    await runMigrations();
    const db = c.get("db") as Pool;
    const { connectionId } = c.req.param();

    const connResult = await db.query("SELECT * FROM meta.connections WHERE id = $1", [connectionId]);
    if (connResult.rows.length === 0) {
      return c.json({ error: "Connection not found" }, 404);
    }

    const conn = connResult.rows[0];
    const testPool = new Pool({
      host: conn.host,
      port: conn.port,
      database: conn.database_name,
      user: conn.username,
      password: conn.password_encrypted,
      ssl: conn.ssl_enabled ? { rejectUnauthorized: false } : false,
      connectionTimeoutMillis: 5000,
    });

    try {
      const client = await testPool.connect();
      await client.query("SELECT 1");
      client.release();
      await testPool.end();

      await db.query("UPDATE meta.connections SET status = 'active', updated_at = NOW() WHERE id = $1", [connectionId]);

      return c.json({ data: { success: true, message: "Connection successful" } });
    } catch (error) {
      await testPool.end();
      const message = error instanceof Error ? error.message : "Connection failed";

      await db.query("UPDATE meta.connections SET status = 'error', updated_at = NOW() WHERE id = $1", [connectionId]);

      return c.json({ data: { success: false, message } });
    }
  })

  // Import table from external connection
  .post(
    "/connections/:connectionId/import",
    sessionMiddleware,
    dbMiddleware,
    zValidator("json", importTableSchema),
    async (c) => {
      await runMigrations();
      const user = c.get("user");
      const db = c.get("db") as Pool;
      const { connectionId } = c.req.param();
      const { workspaceId, sourceSchema, sourceTable, targetTable, medallionLayer } = c.req.valid("json");

      const connResult = await db.query("SELECT * FROM meta.connections WHERE id = $1", [connectionId]);
      if (connResult.rows.length === 0) {
        return c.json({ error: "Connection not found" }, 404);
      }

      const conn = connResult.rows[0];
      const sourcePool = new Pool({
        host: conn.host,
        port: conn.port,
        database: conn.database_name,
        user: conn.username,
        password: conn.password_encrypted,
        ssl: conn.ssl_enabled ? { rejectUnauthorized: false } : false,
        connectionTimeoutMillis: 10000,
      });

      try {
        const sourceClient = await sourcePool.connect();

        // Get columns from source
        const colResult = await sourceClient.query(
          `SELECT column_name, data_type, is_nullable
           FROM information_schema.columns
           WHERE table_schema = $1 AND table_name = $2
           ORDER BY ordinal_position`,
          [sourceSchema, sourceTable]
        );

        if (colResult.rows.length === 0) {
          sourceClient.release();
          await sourcePool.end();
          return c.json({ error: "Source table not found or has no columns" }, 404);
        }

        // Fetch data (limit 100k rows for MVP)
        const dataResult = await sourceClient.query(
          `SELECT * FROM "${sourceSchema}"."${sourceTable}" LIMIT 100000`
        );

        sourceClient.release();
        await sourcePool.end();

        // Create target table in workspace
        const safeWsId = sanitizeWorkspaceId(workspaceId);
        await ensureWorkspaceSchemas(safeWsId);
        const schemaName = `${medallionLayer}_${safeWsId}`;

        const localClient = await db.connect();
        try {
          await localClient.query("BEGIN");

          const colDefs = colResult.rows
            .map((col) => `"${col.column_name}" ${col.data_type === "integer" ? "BIGINT" : col.data_type}`)
            .join(", ");
          await localClient.query(`CREATE TABLE IF NOT EXISTS "${schemaName}"."${targetTable}" (${colDefs})`);

          // Insert data in batches
          if (dataResult.rows.length > 0) {
            const columns = colResult.rows.map((col) => col.column_name);
            const batchSize = 500;

            for (let i = 0; i < dataResult.rows.length; i += batchSize) {
              const batch = dataResult.rows.slice(i, i + batchSize);
              const colNames = columns.map((c) => `"${c}"`).join(", ");
              const valuePlaceholders = batch
                .map((_, rowIdx) =>
                  `(${columns.map((_, colIdx) => `$${rowIdx * columns.length + colIdx + 1}`).join(", ")})`
                )
                .join(", ");

              const values = batch.flatMap((row) => columns.map((col) => row[col] ?? null));
              await localClient.query(
                `INSERT INTO "${schemaName}"."${targetTable}" (${colNames}) VALUES ${valuePlaceholders}`,
                values
              );
            }
          }

          // Record in meta.datasets
          const columnMetadata = colResult.rows.map((col) => ({
            name: col.column_name,
            type: col.data_type.toUpperCase(),
            nullable: col.is_nullable === "YES",
            sampleValues: [],
          }));

          await localClient.query(
            `INSERT INTO meta.datasets (workspace_id, name, source_type, source_connection_id, medallion_layer, schema_name, table_name, row_count, column_count, column_metadata, created_by)
             VALUES ($1, $2, 'pg_import', $3, $4, $5, $6, $7, $8, $9, $10)`,
            [
              workspaceId,
              targetTable,
              connectionId,
              medallionLayer,
              schemaName,
              targetTable,
              dataResult.rows.length,
              colResult.rows.length,
              JSON.stringify(columnMetadata),
              user.id,
            ]
          );

          await localClient.query("COMMIT");

          return c.json({
            data: {
              schema: schemaName,
              table: targetTable,
              rowsImported: dataResult.rows.length,
              columns: colResult.rows.length,
            },
          });
        } catch (error) {
          await localClient.query("ROLLBACK");
          throw error;
        } finally {
          localClient.release();
        }
      } catch (error) {
        await sourcePool.end();
        const message = error instanceof Error ? error.message : "Import failed";
        return c.json({ error: message }, 500);
      }
    }
  );

export default app;
