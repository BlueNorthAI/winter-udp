import { z } from "zod";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { Pool } from "pg";

import { sessionMiddleware } from "@/lib/session-middleware";
import { getMember } from "../utils";
import { MemberRole } from "../types";

const app = new Hono()
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
      `SELECT m.id as "$id", m.workspace_id as "workspaceId", m.user_id as "userId", m.role,
              u.name, u.email
       FROM app.members m
       JOIN app.users u ON m.user_id = u.id
       WHERE m.workspace_id = $1
       ORDER BY m.created_at`,
      [workspaceId]
    );

    return c.json({
      data: {
        documents: result.rows,
        total: result.rows.length,
      },
    });
  })
  .delete("/:memberId", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const db = c.get("db") as Pool;
    const { memberId } = c.req.param();

    // Get the member being deleted
    const memberResult = await db.query(
      "SELECT id, workspace_id, user_id FROM app.members WHERE id = $1",
      [memberId]
    );

    if (memberResult.rows.length === 0) {
      return c.json({ error: "Not found" }, 404);
    }

    const memberToDelete = memberResult.rows[0];

    // Check if current user is admin
    const currentMember = await getMember({
      db,
      workspaceId: memberToDelete.workspace_id,
      userId: user.id,
    });

    if (!currentMember || currentMember.role !== MemberRole.ADMIN) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Count admins - don't delete last admin
    const adminCount = await db.query(
      "SELECT count(*) FROM app.members WHERE workspace_id = $1 AND role = 'ADMIN'",
      [memberToDelete.workspace_id]
    );

    if (parseInt(adminCount.rows[0].count) <= 1 && memberToDelete.user_id === user.id) {
      return c.json({ error: "Cannot remove the last admin" }, 400);
    }

    await db.query("DELETE FROM app.members WHERE id = $1", [memberId]);

    return c.json({ data: { $id: memberId } });
  })
  .patch(
    "/:memberId",
    sessionMiddleware,
    zValidator("json", z.object({ role: z.nativeEnum(MemberRole) })),
    async (c) => {
      const user = c.get("user");
      const db = c.get("db") as Pool;
      const { memberId } = c.req.param();
      const { role } = c.req.valid("json");

      const memberResult = await db.query(
        "SELECT id, workspace_id, user_id, role FROM app.members WHERE id = $1",
        [memberId]
      );

      if (memberResult.rows.length === 0) {
        return c.json({ error: "Not found" }, 404);
      }

      const memberToUpdate = memberResult.rows[0];

      const currentMember = await getMember({
        db,
        workspaceId: memberToUpdate.workspace_id,
        userId: user.id,
      });

      if (!currentMember || currentMember.role !== MemberRole.ADMIN) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      // Don't downgrade the last admin
      if (memberToUpdate.role === "ADMIN" && role === MemberRole.MEMBER) {
        const adminCount = await db.query(
          "SELECT count(*) FROM app.members WHERE workspace_id = $1 AND role = 'ADMIN'",
          [memberToUpdate.workspace_id]
        );
        if (parseInt(adminCount.rows[0].count) <= 1) {
          return c.json({ error: "Cannot downgrade the last admin" }, 400);
        }
      }

      await db.query("UPDATE app.members SET role = $1 WHERE id = $2", [role, memberId]);

      return c.json({ data: { $id: memberId, role } });
    }
  );

export default app;
