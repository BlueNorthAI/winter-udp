import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { Pool } from "pg";

import { sessionMiddleware } from "@/lib/session-middleware";
import { dbMiddleware } from "@/lib/db-middleware";
import { runMigrations, sanitizeWorkspaceId, ensureWorkspaceSchemas } from "@/lib/db-migrate";
import { executePipeline, PipelineStep } from "@/lib/pipeline-executor";

import { createPipelineSchema, updatePipelineSchema } from "../schemas";

const app = new Hono()
  // Create pipeline
  .post(
    "/",
    sessionMiddleware,
    dbMiddleware,
    zValidator("json", createPipelineSchema),
    async (c) => {
      await runMigrations();
      const user = c.get("user");
      const db = c.get("db") as Pool;
      const { workspaceId, name, description, steps, schedule } = c.req.valid("json");

      const result = await db.query(
        `INSERT INTO meta.pipelines (workspace_id, name, description, steps, schedule, status, created_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [workspaceId, name, description || null, JSON.stringify(steps), schedule || null, schedule ? "active" : "inactive", user.id]
      );

      return c.json({ data: result.rows[0] });
    }
  )

  // List pipelines
  .get("/", sessionMiddleware, dbMiddleware, async (c) => {
    await runMigrations();
    const db = c.get("db") as Pool;
    const workspaceId = c.req.query("workspaceId");

    if (!workspaceId) {
      return c.json({ error: "workspaceId is required" }, 400);
    }

    const result = await db.query(
      "SELECT * FROM meta.pipelines WHERE workspace_id = $1 ORDER BY created_at DESC",
      [workspaceId]
    );

    return c.json({ data: result.rows });
  })

  // Get single pipeline
  .get("/:pipelineId", sessionMiddleware, dbMiddleware, async (c) => {
    await runMigrations();
    const db = c.get("db") as Pool;
    const { pipelineId } = c.req.param();

    const result = await db.query("SELECT * FROM meta.pipelines WHERE id = $1", [pipelineId]);
    if (result.rows.length === 0) {
      return c.json({ error: "Pipeline not found" }, 404);
    }

    return c.json({ data: result.rows[0] });
  })

  // Update pipeline
  .patch(
    "/:pipelineId",
    sessionMiddleware,
    dbMiddleware,
    zValidator("json", updatePipelineSchema),
    async (c) => {
      await runMigrations();
      const db = c.get("db") as Pool;
      const { pipelineId } = c.req.param();
      const updates = c.req.valid("json");

      const setClauses: string[] = [];
      const params: unknown[] = [];
      let idx = 1;

      if (updates.name !== undefined) {
        setClauses.push(`name = $${idx++}`);
        params.push(updates.name);
      }
      if (updates.description !== undefined) {
        setClauses.push(`description = $${idx++}`);
        params.push(updates.description);
      }
      if (updates.steps !== undefined) {
        setClauses.push(`steps = $${idx++}`);
        params.push(JSON.stringify(updates.steps));
      }
      if (updates.schedule !== undefined) {
        setClauses.push(`schedule = $${idx++}`);
        params.push(updates.schedule);
      }
      if (updates.status !== undefined) {
        setClauses.push(`status = $${idx++}`);
        params.push(updates.status);
      }

      setClauses.push(`updated_at = NOW()`);
      params.push(pipelineId);

      const result = await db.query(
        `UPDATE meta.pipelines SET ${setClauses.join(", ")} WHERE id = $${idx} RETURNING *`,
        params
      );

      if (result.rows.length === 0) {
        return c.json({ error: "Pipeline not found" }, 404);
      }

      return c.json({ data: result.rows[0] });
    }
  )

  // Delete pipeline
  .delete("/:pipelineId", sessionMiddleware, dbMiddleware, async (c) => {
    await runMigrations();
    const db = c.get("db") as Pool;
    const { pipelineId } = c.req.param();

    await db.query("DELETE FROM meta.pipelines WHERE id = $1", [pipelineId]);
    return c.json({ data: { success: true } });
  })

  // Run pipeline
  .post("/:pipelineId/run", sessionMiddleware, dbMiddleware, async (c) => {
    await runMigrations();
    const db = c.get("db") as Pool;
    const { pipelineId } = c.req.param();

    const pipelineResult = await db.query("SELECT * FROM meta.pipelines WHERE id = $1", [pipelineId]);
    if (pipelineResult.rows.length === 0) {
      return c.json({ error: "Pipeline not found" }, 404);
    }

    const pipeline = pipelineResult.rows[0];
    const safeWsId = sanitizeWorkspaceId(pipeline.workspace_id);
    await ensureWorkspaceSchemas(safeWsId);

    // Create run record
    const runResult = await db.query(
      `INSERT INTO meta.pipeline_runs (pipeline_id, status) VALUES ($1, 'running') RETURNING *`,
      [pipelineId]
    );
    const runId = runResult.rows[0].id;

    try {
      const searchPath = `bronze_${safeWsId}, silver_${safeWsId}, gold_${safeWsId}, retail, public`;
      const steps = (typeof pipeline.steps === "string" ? JSON.parse(pipeline.steps) : pipeline.steps) as PipelineStep[];

      const { results, totalRows } = await executePipeline(db, steps, searchPath);

      // Update run and pipeline
      await db.query(
        `UPDATE meta.pipeline_runs SET status = 'completed', completed_at = NOW(), rows_processed = $1, step_results = $2 WHERE id = $3`,
        [totalRows, JSON.stringify(results), runId]
      );
      await db.query(
        `UPDATE meta.pipelines SET last_run_at = NOW(), last_run_status = 'completed' WHERE id = $1`,
        [pipelineId]
      );

      // Track lineage
      const sourceStep = steps.find((s) => s.type === "source");
      const targetStep = steps.find((s) => s.type === "target");
      if (sourceStep && targetStep) {
        const sourceSchema = sourceStep.config.schema as string;
        const sourceTable = sourceStep.config.table as string;
        const targetSchema = targetStep.config.schema as string;
        const targetTable = targetStep.config.table as string;

        // Find dataset IDs
        const sourceDs = await db.query(
          "SELECT id FROM meta.datasets WHERE schema_name = $1 AND table_name = $2 LIMIT 1",
          [sourceSchema, sourceTable]
        );
        const targetDs = await db.query(
          "SELECT id FROM meta.datasets WHERE schema_name = $1 AND table_name = $2 LIMIT 1",
          [targetSchema, targetTable]
        );

        if (sourceDs.rows.length > 0 && targetDs.rows.length > 0) {
          await db.query(
            `INSERT INTO meta.lineage (source_dataset_id, target_dataset_id, transformation_type, pipeline_id)
             VALUES ($1, $2, 'pipeline', $3)
             ON CONFLICT DO NOTHING`,
            [sourceDs.rows[0].id, targetDs.rows[0].id, pipelineId]
          ).catch(() => {});
        }
      }

      return c.json({ data: { runId, status: "completed", results, totalRows } });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Pipeline execution failed";
      await db.query(
        `UPDATE meta.pipeline_runs SET status = 'failed', completed_at = NOW(), error_message = $1 WHERE id = $2`,
        [message, runId]
      );
      await db.query(
        `UPDATE meta.pipelines SET last_run_at = NOW(), last_run_status = 'failed' WHERE id = $1`,
        [pipelineId]
      );

      return c.json({ error: message }, 500);
    }
  })

  // Get pipeline run history
  .get("/:pipelineId/runs", sessionMiddleware, dbMiddleware, async (c) => {
    await runMigrations();
    const db = c.get("db") as Pool;
    const { pipelineId } = c.req.param();

    const result = await db.query(
      "SELECT * FROM meta.pipeline_runs WHERE pipeline_id = $1 ORDER BY started_at DESC LIMIT 50",
      [pipelineId]
    );

    return c.json({ data: result.rows });
  });

export default app;
