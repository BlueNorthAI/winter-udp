import { z } from "zod";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";
import { Pool } from "pg";

import { getMember } from "@/features/members/utils";
import { sessionMiddleware } from "@/lib/session-middleware";
import { createProjectSchema, updateProjectSchema } from "../schemas";

const app = new Hono()
  .post(
    "/",
    sessionMiddleware,
    zValidator("form", createProjectSchema),
    async (c) => {
      const user = c.get("user");
      const db = c.get("db") as Pool;
      const { name, image, workspaceId } = c.req.valid("form");

      const member = await getMember({ db, workspaceId, userId: user.id });
      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      let imageUrl = "";
      if (image instanceof File && image.size > 0) {
        const buffer = await image.arrayBuffer();
        imageUrl = `data:${image.type};base64,${Buffer.from(buffer).toString("base64")}`;
      }

      const result = await db.query(
        `INSERT INTO app.projects (name, image_url, workspace_id)
         VALUES ($1, $2, $3)
         RETURNING id as "$id", name, image_url as "imageUrl", workspace_id as "workspaceId", created_at as "$createdAt"`,
        [name, imageUrl, workspaceId]
      );

      return c.json({ data: result.rows[0] });
    }
  )
  .get("/", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const db = c.get("db") as Pool;
    const { workspaceId } = c.req.query();

    if (!workspaceId) {
      return c.json({ error: "workspaceId is required" }, 400);
    }

    const member = await getMember({ db, workspaceId, userId: user.id });
    if (!member) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const result = await db.query(
      `SELECT id as "$id", name, image_url as "imageUrl", workspace_id as "workspaceId", created_at as "$createdAt"
       FROM app.projects WHERE workspace_id = $1 ORDER BY created_at DESC`,
      [workspaceId]
    );

    return c.json({ data: { documents: result.rows, total: result.rows.length } });
  })
  .get("/:projectId", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const db = c.get("db") as Pool;
    const { projectId } = c.req.param();

    const result = await db.query(
      `SELECT id as "$id", name, image_url as "imageUrl", workspace_id as "workspaceId", created_at as "$createdAt"
       FROM app.projects WHERE id = $1`,
      [projectId]
    );

    if (result.rows.length === 0) {
      return c.json({ error: "Not found" }, 404);
    }

    const project = result.rows[0];
    const member = await getMember({ db, workspaceId: project.workspaceId, userId: user.id });
    if (!member) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    return c.json({ data: project });
  })
  .patch(
    "/:projectId",
    sessionMiddleware,
    zValidator("form", updateProjectSchema),
    async (c) => {
      const user = c.get("user");
      const db = c.get("db") as Pool;
      const { projectId } = c.req.param();
      const { name, image } = c.req.valid("form");

      const existingResult = await db.query(
        "SELECT id, workspace_id FROM app.projects WHERE id = $1",
        [projectId]
      );
      if (existingResult.rows.length === 0) {
        return c.json({ error: "Not found" }, 404);
      }

      const member = await getMember({ db, workspaceId: existingResult.rows[0].workspace_id, userId: user.id });
      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      let imageUrl: string | undefined;
      if (image instanceof File && image.size > 0) {
        const buffer = await image.arrayBuffer();
        imageUrl = `data:${image.type};base64,${Buffer.from(buffer).toString("base64")}`;
      }

      const setClauses: string[] = [];
      const params: unknown[] = [];
      let idx = 1;

      if (name) { setClauses.push(`name = $${idx++}`); params.push(name); }
      if (imageUrl) { setClauses.push(`image_url = $${idx++}`); params.push(imageUrl); }
      setClauses.push("updated_at = NOW()");
      params.push(projectId);

      const result = await db.query(
        `UPDATE app.projects SET ${setClauses.join(", ")} WHERE id = $${idx}
         RETURNING id as "$id", name, image_url as "imageUrl", workspace_id as "workspaceId", created_at as "$createdAt"`,
        params
      );

      return c.json({ data: result.rows[0] });
    }
  )
  .delete("/:projectId", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const db = c.get("db") as Pool;
    const { projectId } = c.req.param();

    const result = await db.query("SELECT workspace_id FROM app.projects WHERE id = $1", [projectId]);
    if (result.rows.length === 0) {
      return c.json({ error: "Not found" }, 404);
    }

    const member = await getMember({ db, workspaceId: result.rows[0].workspace_id, userId: user.id });
    if (!member) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    await db.query("DELETE FROM app.projects WHERE id = $1", [projectId]);

    return c.json({ data: { $id: projectId } });
  })
  .get("/:projectId/analytics", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const db = c.get("db") as Pool;
    const { projectId } = c.req.param();

    const projectResult = await db.query("SELECT workspace_id FROM app.projects WHERE id = $1", [projectId]);
    if (projectResult.rows.length === 0) {
      return c.json({ error: "Not found" }, 404);
    }

    const member = await getMember({ db, workspaceId: projectResult.rows[0].workspace_id, userId: user.id });
    if (!member) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const now = new Date();
    const thisMonthStart = startOfMonth(now);
    const thisMonthEnd = endOfMonth(now);

    const taskStats = await db.query(
      `SELECT
        count(*) as total,
        count(*) FILTER (WHERE status = 'DONE') as completed,
        count(*) FILTER (WHERE status != 'DONE') as incomplete,
        count(*) FILTER (WHERE status != 'DONE' AND due_date < NOW()) as overdue,
        count(*) FILTER (WHERE assignee_id IS NOT NULL) as assigned
       FROM app.tasks WHERE project_id = $1 AND created_at >= $2 AND created_at <= $3`,
      [projectId, thisMonthStart.toISOString(), thisMonthEnd.toISOString()]
    );

    const stats = taskStats.rows[0];

    return c.json({
      data: {
        taskCount: parseInt(stats.total),
        taskDifference: parseInt(stats.total),
        assignedTaskCount: parseInt(stats.assigned),
        assignedTaskDifference: parseInt(stats.assigned),
        completedTaskCount: parseInt(stats.completed),
        completedTaskDifference: parseInt(stats.completed),
        incompleteTaskCount: parseInt(stats.incomplete),
        incompleteTaskDifference: parseInt(stats.incomplete),
        overdueTaskCount: parseInt(stats.overdue),
        overdueTaskDifference: parseInt(stats.overdue),
      },
    });
  });

export default app;
