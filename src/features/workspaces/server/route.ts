import { z } from "zod";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import { Pool } from "pg";

import { MemberRole } from "@/features/members/types";
import { getMember } from "@/features/members/utils";
import { generateInviteCode } from "@/lib/utils";
import { sessionMiddleware } from "@/lib/session-middleware";
import { ensureWorkspaceSchemas, sanitizeWorkspaceId } from "@/lib/db-migrate";

import { createWorkspaceSchema, updateWorkspaceSchema } from "../schemas";

const app = new Hono()
  .get("/", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const db = c.get("db") as Pool;

    const result = await db.query(
      `SELECT w.id as "$id", w.name, w.image_url as "imageUrl", w.invite_code as "inviteCode",
              w.user_id as "userId", w.created_at as "$createdAt"
       FROM app.workspaces w
       JOIN app.members m ON w.id = m.workspace_id
       WHERE m.user_id = $1
       ORDER BY w.created_at DESC`,
      [user.id]
    );

    return c.json({ data: { documents: result.rows, total: result.rows.length } });
  })
  .get("/:workspaceId", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const db = c.get("db") as Pool;
    const { workspaceId } = c.req.param();

    const member = await getMember({ db, workspaceId, userId: user.id });
    if (!member) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const result = await db.query(
      `SELECT id as "$id", name, image_url as "imageUrl", invite_code as "inviteCode",
              user_id as "userId", created_at as "$createdAt"
       FROM app.workspaces WHERE id = $1`,
      [workspaceId]
    );

    if (result.rows.length === 0) {
      return c.json({ error: "Not found" }, 404);
    }

    return c.json({ data: result.rows[0] });
  })
  .get("/:workspaceId/info", sessionMiddleware, async (c) => {
    const db = c.get("db") as Pool;
    const { workspaceId } = c.req.param();

    const result = await db.query(
      "SELECT id as \"$id\", name FROM app.workspaces WHERE id = $1",
      [workspaceId]
    );

    return c.json({ data: result.rows[0] || null });
  })
  .post(
    "/",
    zValidator("form", createWorkspaceSchema),
    sessionMiddleware,
    async (c) => {
      const user = c.get("user");
      const db = c.get("db") as Pool;
      const { name, image } = c.req.valid("form");

      let imageUrl = "";
      if (image instanceof File && image.size > 0) {
        // For MVP: store as base64 data URL
        const buffer = await image.arrayBuffer();
        imageUrl = `data:${image.type};base64,${Buffer.from(buffer).toString("base64")}`;
      }

      const inviteCode = generateInviteCode(6);

      const wsResult = await db.query(
        `INSERT INTO app.workspaces (name, image_url, invite_code, user_id)
         VALUES ($1, $2, $3, $4)
         RETURNING id as "$id", name, image_url as "imageUrl", invite_code as "inviteCode", user_id as "userId", created_at as "$createdAt"`,
        [name, imageUrl, inviteCode, user.id]
      );

      const workspace = wsResult.rows[0];

      // Add creator as ADMIN member
      await db.query(
        "INSERT INTO app.members (workspace_id, user_id, role) VALUES ($1, $2, $3)",
        [workspace.$id, user.id, MemberRole.ADMIN]
      );

      // Create datalake schemas for this workspace
      await ensureWorkspaceSchemas(sanitizeWorkspaceId(workspace.$id));

      return c.json({ data: workspace });
    }
  )
  .patch(
    "/:workspaceId",
    sessionMiddleware,
    zValidator("form", updateWorkspaceSchema),
    async (c) => {
      const user = c.get("user");
      const db = c.get("db") as Pool;
      const { workspaceId } = c.req.param();
      const { name, image } = c.req.valid("form");

      const member = await getMember({ db, workspaceId, userId: user.id });
      if (!member || member.role !== MemberRole.ADMIN) {
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
      params.push(workspaceId);

      const result = await db.query(
        `UPDATE app.workspaces SET ${setClauses.join(", ")} WHERE id = $${idx}
         RETURNING id as "$id", name, image_url as "imageUrl", invite_code as "inviteCode", user_id as "userId", created_at as "$createdAt"`,
        params
      );

      return c.json({ data: result.rows[0] });
    }
  )
  .delete("/:workspaceId", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const db = c.get("db") as Pool;
    const { workspaceId } = c.req.param();

    const member = await getMember({ db, workspaceId, userId: user.id });
    if (!member || member.role !== MemberRole.ADMIN) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Cascade delete handles members, projects, tasks
    await db.query("DELETE FROM app.workspaces WHERE id = $1", [workspaceId]);

    return c.json({ data: { $id: workspaceId } });
  })
  .post("/:workspaceId/reset-invite-code", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const db = c.get("db") as Pool;
    const { workspaceId } = c.req.param();

    const member = await getMember({ db, workspaceId, userId: user.id });
    if (!member || member.role !== MemberRole.ADMIN) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const inviteCode = generateInviteCode(6);
    const result = await db.query(
      `UPDATE app.workspaces SET invite_code = $1, updated_at = NOW() WHERE id = $2
       RETURNING id as "$id", name, image_url as "imageUrl", invite_code as "inviteCode", user_id as "userId"`,
      [inviteCode, workspaceId]
    );

    return c.json({ data: result.rows[0] });
  })
  .post(
    "/:workspaceId/join",
    sessionMiddleware,
    zValidator("json", z.object({ code: z.string() })),
    async (c) => {
      const user = c.get("user");
      const db = c.get("db") as Pool;
      const { workspaceId } = c.req.param();
      const { code } = c.req.valid("json");

      const wsResult = await db.query("SELECT * FROM app.workspaces WHERE id = $1", [workspaceId]);
      if (wsResult.rows.length === 0) {
        return c.json({ error: "Not found" }, 404);
      }

      if (wsResult.rows[0].invite_code !== code) {
        return c.json({ error: "Invalid invite code" }, 400);
      }

      const existingMember = await getMember({ db, workspaceId, userId: user.id });
      if (existingMember) {
        return c.json({ error: "Already a member" }, 400);
      }

      await db.query(
        "INSERT INTO app.members (workspace_id, user_id, role) VALUES ($1, $2, $3)",
        [workspaceId, user.id, MemberRole.MEMBER]
      );

      return c.json({ data: { $id: workspaceId } });
    }
  )
  .get("/:workspaceId/analytics", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const db = c.get("db") as Pool;
    const { workspaceId } = c.req.param();

    const member = await getMember({ db, workspaceId, userId: user.id });
    if (!member) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const now = new Date();
    const thisMonthStart = startOfMonth(now);
    const thisMonthEnd = endOfMonth(now);
    const lastMonthStart = startOfMonth(subMonths(now, 1));
    const lastMonthEnd = endOfMonth(subMonths(now, 1));

    const thisMonthTasks = await db.query(
      "SELECT count(*) FROM app.tasks WHERE workspace_id = $1 AND created_at >= $2 AND created_at <= $3",
      [workspaceId, thisMonthStart.toISOString(), thisMonthEnd.toISOString()]
    );
    const lastMonthTasks = await db.query(
      "SELECT count(*) FROM app.tasks WHERE workspace_id = $1 AND created_at >= $2 AND created_at <= $3",
      [workspaceId, lastMonthStart.toISOString(), lastMonthEnd.toISOString()]
    );

    const assignedTasks = await db.query(
      "SELECT count(*) FROM app.tasks WHERE workspace_id = $1 AND assignee_id IS NOT NULL AND created_at >= $2 AND created_at <= $3",
      [workspaceId, thisMonthStart.toISOString(), thisMonthEnd.toISOString()]
    );

    const completedTasks = await db.query(
      "SELECT count(*) FROM app.tasks WHERE workspace_id = $1 AND status = 'DONE' AND created_at >= $2 AND created_at <= $3",
      [workspaceId, thisMonthStart.toISOString(), thisMonthEnd.toISOString()]
    );

    const overdueTasks = await db.query(
      "SELECT count(*) FROM app.tasks WHERE workspace_id = $1 AND status != 'DONE' AND due_date < NOW()",
      [workspaceId]
    );

    const incompleteTasks = await db.query(
      "SELECT count(*) FROM app.tasks WHERE workspace_id = $1 AND status != 'DONE' AND created_at >= $2 AND created_at <= $3",
      [workspaceId, thisMonthStart.toISOString(), thisMonthEnd.toISOString()]
    );

    return c.json({
      data: {
        taskCount: parseInt(thisMonthTasks.rows[0].count),
        taskDifference: parseInt(thisMonthTasks.rows[0].count) - parseInt(lastMonthTasks.rows[0].count),
        assignedTaskCount: parseInt(assignedTasks.rows[0].count),
        assignedTaskDifference: parseInt(assignedTasks.rows[0].count),
        completedTaskCount: parseInt(completedTasks.rows[0].count),
        completedTaskDifference: parseInt(completedTasks.rows[0].count),
        incompleteTaskCount: parseInt(incompleteTasks.rows[0].count),
        incompleteTaskDifference: parseInt(incompleteTasks.rows[0].count),
        overdueTaskCount: parseInt(overdueTasks.rows[0].count),
        overdueTaskDifference: parseInt(overdueTasks.rows[0].count),
      },
    });
  });

export default app;
