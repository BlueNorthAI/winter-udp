import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { Pool } from "pg";

import { sessionMiddleware } from "@/lib/session-middleware";
import { dbMiddleware } from "@/lib/db-middleware";
import { runMigrations, sanitizeWorkspaceId, ensureWorkspaceSchemas } from "@/lib/db-migrate";
import { PG_STATEMENT_TIMEOUT_MS } from "@/config";

import { executeQuerySchema, saveQuerySchema } from "../schemas";

// SQL statements that are blocked for security
const BLOCKED_PATTERNS = [
  /DROP\s+DATABASE/i,
  /CREATE\s+ROLE/i,
  /ALTER\s+ROLE/i,
  /DROP\s+ROLE/i,
  /CREATE\s+USER/i,
  /ALTER\s+USER/i,
  /DROP\s+USER/i,
  /GRANT\s/i,
  /REVOKE\s/i,
  /CREATE\s+EXTENSION/i,
  /COPY\s+.*\s+TO\s+PROGRAM/i,
];

function isSqlBlocked(sql: string): boolean {
  return BLOCKED_PATTERNS.some((pattern) => pattern.test(sql));
}

const app = new Hono()
  // Execute SQL query
  .post(
    "/execute",
    sessionMiddleware,
    dbMiddleware,
    zValidator("json", executeQuerySchema),
    async (c) => {
      await runMigrations();
      const user = c.get("user");
      const db = c.get("db") as Pool;
      const { workspaceId, sql, limit } = c.req.valid("json");

      if (isSqlBlocked(sql)) {
        return c.json({ error: "This SQL statement is not allowed for security reasons" }, 403);
      }

      const safeWsId = sanitizeWorkspaceId(workspaceId);
      await ensureWorkspaceSchemas(safeWsId);

      const client = await db.connect();
      const startTime = Date.now();

      try {
        // Set search path to workspace schemas + dunnhumby demo data
        await client.query(
          `SET search_path TO bronze_${safeWsId}, silver_${safeWsId}, gold_${safeWsId}, bronze_dunnhumby, silver_dunnhumby, gold_dunnhumby, retail, public`
        );
        await client.query(`SET statement_timeout = ${PG_STATEMENT_TIMEOUT_MS}`);

        // Execute with limit wrapper for SELECT queries
        let queryText = sql.trim();
        const isSelect = /^\s*(SELECT|WITH)\s/i.test(queryText);

        if (isSelect && !queryText.toLowerCase().includes("limit")) {
          // Remove trailing semicolon and add LIMIT
          queryText = queryText.replace(/;\s*$/, "");
          queryText = `${queryText} LIMIT ${limit}`;
        }

        const result = await client.query(queryText);
        const executionTimeMs = Date.now() - startTime;

        const columns = result.fields ? result.fields.map((f) => f.name) : [];
        const rows = result.rows || [];

        // Record in query history
        await db.query(
          `INSERT INTO meta.queries (workspace_id, sql_text, status, result_row_count, execution_time_ms, created_by)
           VALUES ($1, $2, 'completed', $3, $4, $5)`,
          [workspaceId, sql, rows.length, executionTimeMs, user.id]
        );

        return c.json({
          data: {
            columns,
            rows,
            rowCount: rows.length,
            executionTimeMs,
            command: result.command,
          },
        });
      } catch (error) {
        const executionTimeMs = Date.now() - startTime;
        const message = error instanceof Error ? error.message : "Query execution failed";

        // Record failed query
        await db.query(
          `INSERT INTO meta.queries (workspace_id, sql_text, status, execution_time_ms, error_message, created_by)
           VALUES ($1, $2, 'failed', $3, $4, $5)`,
          [workspaceId, sql, executionTimeMs, message, user.id]
        ).catch(() => {});

        return c.json({ error: message }, 400);
      } finally {
        client.release();
      }
    }
  )

  // Get query history
  .get("/history", sessionMiddleware, dbMiddleware, async (c) => {
    await runMigrations();
    const db = c.get("db") as Pool;
    const workspaceId = c.req.query("workspaceId");
    const page = parseInt(c.req.query("page") || "1", 10);
    const pageSize = parseInt(c.req.query("pageSize") || "50", 10);

    if (!workspaceId) {
      return c.json({ error: "workspaceId is required" }, 400);
    }

    const offset = (page - 1) * pageSize;
    const result = await db.query(
      `SELECT * FROM meta.queries
       WHERE workspace_id = $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [workspaceId, pageSize, offset]
    );

    const countResult = await db.query(
      "SELECT count(*) FROM meta.queries WHERE workspace_id = $1",
      [workspaceId]
    );

    return c.json({
      data: {
        queries: result.rows,
        total: parseInt(countResult.rows[0].count, 10),
        page,
        pageSize,
      },
    });
  })

  // Save a query
  .post(
    "/save",
    sessionMiddleware,
    dbMiddleware,
    zValidator("json", saveQuerySchema),
    async (c) => {
      await runMigrations();
      const user = c.get("user");
      const db = c.get("db") as Pool;
      const { workspaceId, name, sql } = c.req.valid("json");

      const result = await db.query(
        `INSERT INTO meta.queries (workspace_id, name, sql_text, status, is_saved, created_by)
         VALUES ($1, $2, $3, 'saved', true, $4)
         RETURNING *`,
        [workspaceId, name, sql, user.id]
      );

      return c.json({ data: result.rows[0] });
    }
  )

  // List saved queries
  .get("/saved", sessionMiddleware, dbMiddleware, async (c) => {
    await runMigrations();
    const db = c.get("db") as Pool;
    const workspaceId = c.req.query("workspaceId");

    if (!workspaceId) {
      return c.json({ error: "workspaceId is required" }, 400);
    }

    const result = await db.query(
      `SELECT * FROM meta.queries
       WHERE workspace_id = $1 AND is_saved = true
       ORDER BY created_at DESC`,
      [workspaceId]
    );

    return c.json({ data: result.rows });
  })

  // Delete a saved query
  .delete("/saved/:queryId", sessionMiddleware, dbMiddleware, async (c) => {
    await runMigrations();
    const db = c.get("db") as Pool;
    const { queryId } = c.req.param();

    await db.query("DELETE FROM meta.queries WHERE id = $1 AND is_saved = true", [queryId]);

    return c.json({ data: { success: true } });
  });

export default app;
