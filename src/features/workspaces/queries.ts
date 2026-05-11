import { getPool } from "@/lib/db";
import { runMigrations, ensureWorkspaceSchemas, sanitizeWorkspaceId } from "@/lib/db-migrate";
import { generateInviteCode } from "@/lib/utils";
import { MemberRole } from "@/features/members/types";

const DEFAULT_USER_ID = "00000000-0000-0000-0000-000000000001";

export const getWorkspaces = async () => {
  try {
    await runMigrations();
    const pool = getPool();

    const result = await pool.query(
      `SELECT w.id as "$id", w.name, w.image_url as "imageUrl", w.invite_code as "inviteCode",
              w.user_id as "userId", w.created_at as "$createdAt"
       FROM app.workspaces w
       ORDER BY w.created_at DESC`
    );

    if (result.rows.length === 0) {
      const inviteCode = generateInviteCode(6);
      const wsResult = await pool.query(
        `INSERT INTO app.workspaces (name, image_url, invite_code, user_id)
         VALUES ($1, $2, $3, $4)
         RETURNING id as "$id", name, image_url as "imageUrl", invite_code as "inviteCode", user_id as "userId", created_at as "$createdAt"`,
        ["Default Workspace", "", inviteCode, DEFAULT_USER_ID]
      );
      const workspace = wsResult.rows[0];
      await pool.query(
        "INSERT INTO app.members (workspace_id, user_id, role) VALUES ($1, $2, $3)",
        [workspace.$id, DEFAULT_USER_ID, MemberRole.ADMIN]
      );
      await ensureWorkspaceSchemas(sanitizeWorkspaceId(workspace.$id));
      return { documents: [workspace], total: 1 };
    }

    return { documents: result.rows, total: result.rows.length };
  } catch {
    return { documents: [], total: 0 };
  }
};
