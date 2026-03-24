import { z } from "zod";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { Pool } from "pg";

import { getMember } from "@/features/members/utils";
import { sessionMiddleware } from "@/lib/session-middleware";

import { createTaskSchema } from "../schemas";
import { TaskStatus } from "../types";

const app = new Hono()
  .delete("/:taskId", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const db = c.get("db") as Pool;
    const { taskId } = c.req.param();

    const taskResult = await db.query("SELECT workspace_id FROM app.tasks WHERE id = $1", [taskId]);
    if (taskResult.rows.length === 0) {
      return c.json({ error: "Not found" }, 404);
    }

    const member = await getMember({ db, workspaceId: taskResult.rows[0].workspace_id, userId: user.id });
    if (!member) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    await db.query("DELETE FROM app.tasks WHERE id = $1", [taskId]);

    return c.json({ data: { $id: taskId } });
  })
  .get("/", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const db = c.get("db") as Pool;
    const { workspaceId, projectId, assigneeId, status, search, dueDate } = c.req.query();

    if (!workspaceId) {
      return c.json({ error: "workspaceId is required" }, 400);
    }

    const member = await getMember({ db, workspaceId, userId: user.id });
    if (!member) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const conditions: string[] = ["t.workspace_id = $1"];
    const params: unknown[] = [workspaceId];
    let idx = 2;

    if (projectId) { conditions.push(`t.project_id = $${idx++}`); params.push(projectId); }
    if (status) { conditions.push(`t.status = $${idx++}`); params.push(status); }
    if (assigneeId) { conditions.push(`t.assignee_id = $${idx++}`); params.push(assigneeId); }
    if (dueDate) { conditions.push(`t.due_date::date = $${idx++}::date`); params.push(dueDate); }
    if (search) { conditions.push(`t.name ILIKE $${idx++}`); params.push(`%${search}%`); }

    const result = await db.query(
      `SELECT t.id as "$id", t.name, t.status, t.workspace_id as "workspaceId",
              t.project_id as "projectId", t.assignee_id as "assigneeId",
              t.due_date as "dueDate", t.position, t.description,
              t.created_at as "$createdAt",
              p.name as "projectName", p.image_url as "projectImageUrl"
       FROM app.tasks t
       LEFT JOIN app.projects p ON t.project_id = p.id
       WHERE ${conditions.join(" AND ")}
       ORDER BY t.created_at DESC`,
      params
    );

    // Populate assignee info
    const tasks = await Promise.all(
      result.rows.map(async (task) => {
        if (task.assigneeId) {
          const assigneeResult = await db.query(
            "SELECT m.id, u.name, u.email FROM app.members m JOIN app.users u ON m.user_id = u.id WHERE m.id = $1",
            [task.assigneeId]
          );
          if (assigneeResult.rows.length > 0) {
            return { ...task, assignee: assigneeResult.rows[0] };
          }
        }
        return { ...task, assignee: null };
      })
    );

    return c.json({ data: { documents: tasks, total: tasks.length } });
  })
  .post(
    "/",
    sessionMiddleware,
    zValidator("json", createTaskSchema),
    async (c) => {
      const user = c.get("user");
      const db = c.get("db") as Pool;
      const { name, status, workspaceId, projectId, dueDate, assigneeId, description } = c.req.valid("json");

      const member = await getMember({ db, workspaceId, userId: user.id });
      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      // Get highest position
      const posResult = await db.query(
        "SELECT COALESCE(MAX(position), 0) + 1000 as next_pos FROM app.tasks WHERE workspace_id = $1 AND status = $2",
        [workspaceId, status]
      );
      const position = parseInt(posResult.rows[0].next_pos);

      const result = await db.query(
        `INSERT INTO app.tasks (name, status, workspace_id, project_id, due_date, assignee_id, description, position)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING id as "$id", name, status, workspace_id as "workspaceId",
                   project_id as "projectId", assignee_id as "assigneeId",
                   due_date as "dueDate", position, description, created_at as "$createdAt"`,
        [name, status, workspaceId, projectId, dueDate.toISOString(), assigneeId, description || null, position]
      );

      return c.json({ data: result.rows[0] });
    }
  )
  .patch(
    "/:taskId",
    sessionMiddleware,
    zValidator(
      "json",
      z.object({
        name: z.string().trim().min(1).optional(),
        status: z.nativeEnum(TaskStatus).optional(),
        projectId: z.string().optional(),
        assigneeId: z.string().optional(),
        dueDate: z.coerce.date().optional(),
        description: z.string().optional().nullable(),
      })
    ),
    async (c) => {
      const user = c.get("user");
      const db = c.get("db") as Pool;
      const { taskId } = c.req.param();
      const updates = c.req.valid("json");

      const taskResult = await db.query("SELECT workspace_id FROM app.tasks WHERE id = $1", [taskId]);
      if (taskResult.rows.length === 0) {
        return c.json({ error: "Not found" }, 404);
      }

      const member = await getMember({ db, workspaceId: taskResult.rows[0].workspace_id, userId: user.id });
      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const setClauses: string[] = [];
      const params: unknown[] = [];
      let idx = 1;

      if (updates.name !== undefined) { setClauses.push(`name = $${idx++}`); params.push(updates.name); }
      if (updates.status !== undefined) { setClauses.push(`status = $${idx++}`); params.push(updates.status); }
      if (updates.projectId !== undefined) { setClauses.push(`project_id = $${idx++}`); params.push(updates.projectId); }
      if (updates.assigneeId !== undefined) { setClauses.push(`assignee_id = $${idx++}`); params.push(updates.assigneeId); }
      if (updates.dueDate !== undefined) { setClauses.push(`due_date = $${idx++}`); params.push(updates.dueDate.toISOString()); }
      if (updates.description !== undefined) { setClauses.push(`description = $${idx++}`); params.push(updates.description); }
      setClauses.push("updated_at = NOW()");
      params.push(taskId);

      if (setClauses.length <= 1) {
        return c.json({ error: "No updates provided" }, 400);
      }

      const result = await db.query(
        `UPDATE app.tasks SET ${setClauses.join(", ")} WHERE id = $${idx}
         RETURNING id as "$id", name, status, workspace_id as "workspaceId",
                   project_id as "projectId", assignee_id as "assigneeId",
                   due_date as "dueDate", position, description, created_at as "$createdAt"`,
        params
      );

      return c.json({ data: result.rows[0] });
    }
  )
  .get("/:taskId", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const db = c.get("db") as Pool;
    const { taskId } = c.req.param();

    const result = await db.query(
      `SELECT t.id as "$id", t.name, t.status, t.workspace_id as "workspaceId",
              t.project_id as "projectId", t.assignee_id as "assigneeId",
              t.due_date as "dueDate", t.position, t.description, t.created_at as "$createdAt",
              p.name as "projectName", p.image_url as "projectImageUrl"
       FROM app.tasks t
       LEFT JOIN app.projects p ON t.project_id = p.id
       WHERE t.id = $1`,
      [taskId]
    );

    if (result.rows.length === 0) {
      return c.json({ error: "Not found" }, 404);
    }

    const task = result.rows[0];
    const member = await getMember({ db, workspaceId: task.workspaceId, userId: user.id });
    if (!member) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Get assignee
    if (task.assigneeId) {
      const assigneeResult = await db.query(
        "SELECT m.id, u.name, u.email FROM app.members m JOIN app.users u ON m.user_id = u.id WHERE m.id = $1",
        [task.assigneeId]
      );
      if (assigneeResult.rows.length > 0) {
        task.assignee = assigneeResult.rows[0];
      }
    }

    return c.json({ data: task });
  })
  .post(
    "/bulk-update",
    sessionMiddleware,
    zValidator(
      "json",
      z.object({
        tasks: z.array(
          z.object({
            $id: z.string(),
            status: z.nativeEnum(TaskStatus),
            position: z.number().int().min(0).max(1_000_000),
          })
        ),
      })
    ),
    async (c) => {
      const user = c.get("user");
      const db = c.get("db") as Pool;
      const { tasks } = c.req.valid("json");

      // Verify access to workspace of first task
      if (tasks.length > 0) {
        const taskResult = await db.query("SELECT workspace_id FROM app.tasks WHERE id = $1", [tasks[0].$id]);
        if (taskResult.rows.length > 0) {
          const member = await getMember({ db, workspaceId: taskResult.rows[0].workspace_id, userId: user.id });
          if (!member) {
            return c.json({ error: "Unauthorized" }, 401);
          }
        }
      }

      for (const task of tasks) {
        await db.query(
          "UPDATE app.tasks SET status = $1, position = $2, updated_at = NOW() WHERE id = $3",
          [task.status, task.position, task.$id]
        );
      }

      return c.json({ data: { success: true } });
    }
  );

export default app;
