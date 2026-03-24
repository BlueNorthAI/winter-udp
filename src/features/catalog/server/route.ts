import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { Pool } from "pg";

import { sessionMiddleware } from "@/lib/session-middleware";
import { dbMiddleware } from "@/lib/db-middleware";
import { runMigrations, sanitizeWorkspaceId } from "@/lib/db-migrate";

const app = new Hono()
  // List schemas for a workspace (bronze, silver, gold + retail)
  .get("/schemas", sessionMiddleware, dbMiddleware, async (c) => {
    await runMigrations();
    const db = c.get("db") as Pool;
    const workspaceId = c.req.query("workspaceId");

    if (!workspaceId) {
      return c.json({ error: "workspaceId is required" }, 400);
    }

    const safeWsId = sanitizeWorkspaceId(workspaceId);
    const patterns = [`bronze_${safeWsId}`, `silver_${safeWsId}`, `gold_${safeWsId}`, "retail", "meta"];

    // Also include dunnhumby schemas so demo data is always visible
    patterns.push("bronze_dunnhumby", "silver_dunnhumby", "gold_dunnhumby");

    const result = await db.query(
      `SELECT schema_name
       FROM information_schema.schemata
       WHERE schema_name = ANY($1)
       ORDER BY schema_name`,
      [patterns]
    );

    return c.json({ data: result.rows.map((r) => r.schema_name) });
  })

  // List tables in a schema
  .get("/tables", sessionMiddleware, dbMiddleware, async (c) => {
    await runMigrations();
    const db = c.get("db") as Pool;
    const schema = c.req.query("schema");

    if (!schema) {
      return c.json({ error: "schema is required" }, 400);
    }

    const result = await db.query(
      `SELECT
        t.table_name,
        t.table_type,
        pg_catalog.obj_description(pgc.oid, 'pg_class') as description,
        (SELECT count(*) FROM information_schema.columns c WHERE c.table_schema = t.table_schema AND c.table_name = t.table_name) as column_count
       FROM information_schema.tables t
       LEFT JOIN pg_catalog.pg_class pgc ON pgc.relname = t.table_name
       LEFT JOIN pg_catalog.pg_namespace pgn ON pgn.oid = pgc.relnamespace AND pgn.nspname = t.table_schema
       WHERE t.table_schema = $1
       ORDER BY t.table_name`,
      [schema]
    );

    // Get row counts for each table
    const tablesWithCounts = await Promise.all(
      result.rows.map(async (table) => {
        try {
          const countResult = await db.query(
            `SELECT count(*) as row_count FROM "${schema}"."${table.table_name}"`
          );
          return { ...table, row_count: parseInt(countResult.rows[0].row_count, 10) };
        } catch {
          return { ...table, row_count: null };
        }
      })
    );

    return c.json({ data: tablesWithCounts });
  })

  // Get columns for a table
  .get("/columns", sessionMiddleware, dbMiddleware, async (c) => {
    await runMigrations();
    const db = c.get("db") as Pool;
    const schema = c.req.query("schema");
    const table = c.req.query("table");

    if (!schema || !table) {
      return c.json({ error: "schema and table are required" }, 400);
    }

    const result = await db.query(
      `SELECT
        column_name,
        data_type,
        is_nullable,
        column_default,
        character_maximum_length,
        numeric_precision,
        ordinal_position
       FROM information_schema.columns
       WHERE table_schema = $1 AND table_name = $2
       ORDER BY ordinal_position`,
      [schema, table]
    );

    // Get annotations if any
    const annotations = await db.query(
      `SELECT column_name, description, tags FROM meta.catalog_annotations
       WHERE schema_name = $1 AND table_name = $2`,
      [schema, table]
    );

    const annotationMap = new Map(
      annotations.rows.map((a) => [a.column_name, { description: a.description, tags: a.tags }])
    );

    const columns = result.rows.map((col) => ({
      ...col,
      annotation: annotationMap.get(col.column_name) || null,
    }));

    return c.json({ data: columns });
  })

  // Preview table data
  .get("/preview", sessionMiddleware, dbMiddleware, async (c) => {
    await runMigrations();
    const db = c.get("db") as Pool;
    const schema = c.req.query("schema");
    const table = c.req.query("table");
    const limit = parseInt(c.req.query("limit") || "100", 10);

    if (!schema || !table) {
      return c.json({ error: "schema and table are required" }, 400);
    }

    const safeLimit = Math.min(limit, 1000);
    const result = await db.query(
      `SELECT * FROM "${schema}"."${table}" LIMIT ${safeLimit}`
    );

    return c.json({ data: { rows: result.rows, fields: result.fields.map((f) => f.name) } });
  })

  // Get column statistics for profiling
  .get("/stats", sessionMiddleware, dbMiddleware, async (c) => {
    await runMigrations();
    const db = c.get("db") as Pool;
    const schema = c.req.query("schema");
    const table = c.req.query("table");

    if (!schema || !table) {
      return c.json({ error: "schema and table are required" }, 400);
    }

    // Get column list first
    const colResult = await db.query(
      `SELECT column_name, data_type FROM information_schema.columns
       WHERE table_schema = $1 AND table_name = $2
       ORDER BY ordinal_position`,
      [schema, table]
    );

    // Get total row count
    const countResult = await db.query(`SELECT count(*) as total FROM "${schema}"."${table}"`);
    const totalRows = parseInt(countResult.rows[0].total, 10);

    // Get stats per column
    const stats = await Promise.all(
      colResult.rows.map(async (col) => {
        try {
          const colName = `"${col.column_name}"`;
          const statsResult = await db.query(
            `SELECT
              count(${colName}) as non_null_count,
              count(*) - count(${colName}) as null_count,
              count(DISTINCT ${colName}) as distinct_count
             FROM "${schema}"."${table}"`
          );

          const row = statsResult.rows[0];
          return {
            column_name: col.column_name,
            data_type: col.data_type,
            non_null_count: parseInt(row.non_null_count, 10),
            null_count: parseInt(row.null_count, 10),
            distinct_count: parseInt(row.distinct_count, 10),
          };
        } catch {
          return {
            column_name: col.column_name,
            data_type: col.data_type,
            non_null_count: null,
            null_count: null,
            distinct_count: null,
          };
        }
      })
    );

    return c.json({ data: { totalRows, columns: stats } });
  })

  // Update catalog annotations
  .patch(
    "/annotations",
    sessionMiddleware,
    dbMiddleware,
    zValidator(
      "json",
      z.object({
        workspaceId: z.string().min(1),
        schemaName: z.string().min(1),
        tableName: z.string().min(1),
        columnName: z.string().nullable().default(null),
        description: z.string().optional(),
        tags: z.array(z.string()).optional(),
      })
    ),
    async (c) => {
      await runMigrations();
      const user = c.get("user");
      const db = c.get("db") as Pool;
      const { workspaceId, schemaName, tableName, columnName, description, tags } = c.req.valid("json");

      await db.query(
        `INSERT INTO meta.catalog_annotations (workspace_id, schema_name, table_name, column_name, description, tags, updated_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (workspace_id, schema_name, table_name, column_name)
         DO UPDATE SET description = COALESCE($5, meta.catalog_annotations.description),
                       tags = COALESCE($6, meta.catalog_annotations.tags),
                       updated_by = $7,
                       updated_at = NOW()`,
        [workspaceId, schemaName, tableName, columnName, description || null, tags ? JSON.stringify(tags) : null, user.id]
      );

      return c.json({ data: { success: true } });
    }
  );

export default app;
