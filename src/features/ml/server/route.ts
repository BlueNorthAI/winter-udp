import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { Pool } from "pg";

import { sessionMiddleware } from "@/lib/session-middleware";
import { dbMiddleware } from "@/lib/db-middleware";
import { runMigrations, sanitizeWorkspaceId, ensureWorkspaceSchemas } from "@/lib/db-migrate";
import { computeDescriptiveStats, demandForecast, priceElasticity } from "@/lib/statistics";

import { describeSchema, forecastSchema, elasticitySchema, saveExperimentSchema } from "../schemas";

const app = new Hono()
  // Descriptive statistics
  .post(
    "/describe",
    sessionMiddleware,
    dbMiddleware,
    zValidator("json", describeSchema),
    async (c) => {
      await runMigrations();
      const db = c.get("db") as Pool;
      const { schema, table, columns } = c.req.valid("json");

      // Get numeric columns
      const colResult = await db.query(
        `SELECT column_name, data_type FROM information_schema.columns
         WHERE table_schema = $1 AND table_name = $2
         AND data_type IN ('integer', 'bigint', 'numeric', 'real', 'double precision', 'smallint')
         ORDER BY ordinal_position`,
        [schema, table]
      );

      const targetColumns = columns
        ? colResult.rows.filter((r) => columns.includes(r.column_name))
        : colResult.rows;

      const stats = await Promise.all(
        targetColumns.map(async (col) => {
          const dataResult = await db.query(
            `SELECT "${col.column_name}"::numeric as val FROM "${schema}"."${table}" WHERE "${col.column_name}" IS NOT NULL LIMIT 50000`
          );
          const values = dataResult.rows.map((r) => parseFloat(r.val));

          if (values.length === 0) {
            return { column: col.column_name, dataType: col.data_type, stats: null };
          }

          return {
            column: col.column_name,
            dataType: col.data_type,
            stats: computeDescriptiveStats(values),
          };
        })
      );

      return c.json({ data: stats });
    }
  )

  // Demand forecasting
  .post(
    "/forecast",
    sessionMiddleware,
    dbMiddleware,
    zValidator("json", forecastSchema),
    async (c) => {
      await runMigrations();
      const db = c.get("db") as Pool;
      const { workspaceId, schema, table, dateColumn, valueColumn, groupByColumn, groupByValue, horizonPeriods, seasonLength } =
        c.req.valid("json");

      const safeWsId = sanitizeWorkspaceId(workspaceId);
      await ensureWorkspaceSchemas(safeWsId);

      let query = `SELECT "${dateColumn}" as period, SUM("${valueColumn}"::numeric) as value
                    FROM "${schema}"."${table}"`;

      const params: unknown[] = [];

      if (groupByColumn && groupByValue) {
        query += ` WHERE "${groupByColumn}" = $1`;
        params.push(groupByValue);
      }

      query += ` GROUP BY "${dateColumn}" ORDER BY "${dateColumn}"`;

      const result = await db.query(query, params);

      if (result.rows.length < 4) {
        return c.json({ error: "Insufficient data for forecasting (need at least 4 periods)" }, 400);
      }

      const data = result.rows.map((r) => ({
        period: String(r.period),
        value: parseFloat(r.value),
      }));

      const forecast = demandForecast(data, horizonPeriods, seasonLength);

      return c.json({ data: forecast });
    }
  )

  // Price elasticity estimation
  .post(
    "/elasticity",
    sessionMiddleware,
    dbMiddleware,
    zValidator("json", elasticitySchema),
    async (c) => {
      await runMigrations();
      const db = c.get("db") as Pool;
      const { schema, table, priceColumn, quantityColumn, groupByColumn, groupByValue } =
        c.req.valid("json");

      let query = `SELECT "${priceColumn}"::numeric as price, "${quantityColumn}"::numeric as quantity
                    FROM "${schema}"."${table}"
                    WHERE "${priceColumn}" IS NOT NULL AND "${quantityColumn}" IS NOT NULL`;

      const params: unknown[] = [];

      if (groupByColumn && groupByValue) {
        query += ` AND "${groupByColumn}" = $1`;
        params.push(groupByValue);
      }

      query += " LIMIT 50000";

      const result = await db.query(query, params);

      const pairs = result.rows.map((r) => ({
        price: parseFloat(r.price),
        quantity: parseFloat(r.quantity),
      }));

      const elasticityResult = priceElasticity(pairs);

      return c.json({ data: elasticityResult });
    }
  )

  // Save experiment
  .post(
    "/experiments",
    sessionMiddleware,
    dbMiddleware,
    zValidator("json", saveExperimentSchema),
    async (c) => {
      await runMigrations();
      const user = c.get("user");
      const db = c.get("db") as Pool;
      const { workspaceId, name, type, config, results } = c.req.valid("json");

      // Store in meta.queries as a special type (reusing for MVP simplicity)
      const result = await db.query(
        `INSERT INTO meta.queries (workspace_id, name, sql_text, status, is_saved, created_by)
         VALUES ($1, $2, $3, 'completed', true, $4)
         RETURNING *`,
        [workspaceId, `[${type}] ${name}`, JSON.stringify({ type, config, results }), user.id]
      );

      return c.json({ data: result.rows[0] });
    }
  )

  // List experiments
  .get("/experiments", sessionMiddleware, dbMiddleware, async (c) => {
    await runMigrations();
    const db = c.get("db") as Pool;
    const workspaceId = c.req.query("workspaceId");

    if (!workspaceId) {
      return c.json({ error: "workspaceId is required" }, 400);
    }

    const result = await db.query(
      `SELECT * FROM meta.queries
       WHERE workspace_id = $1 AND is_saved = true AND name LIKE '[%'
       ORDER BY created_at DESC`,
      [workspaceId]
    );

    return c.json({ data: result.rows });
  });

export default app;
