import { cookies } from "next/headers";
import { getPool } from "@/lib/db";
import { runMigrations } from "@/lib/db-migrate";
import { AUTH_COOKIE } from "@/features/auth/constants";

export const getWorkspaces = async () => {
  try {
    await runMigrations();
    const pool = getPool();
    const cookieStore = cookies();
    const token = cookieStore.get(AUTH_COOKIE)?.value;

    let userId: string | null = null;

    if (token) {
      const sessionResult = await pool.query(
        `SELECT u.id FROM app.sessions s JOIN app.users u ON s.user_id = u.id
         WHERE s.token = $1 AND s.expires_at > NOW()`,
        [token]
      );
      if (sessionResult.rows.length > 0) {
        userId = sessionResult.rows[0].id;
      }
    }

    // If authenticated, get user's workspaces; otherwise get all workspaces
    const result = userId
      ? await pool.query(
          `SELECT w.id as "$id", w.name, w.image_url as "imageUrl", w.invite_code as "inviteCode",
                  w.user_id as "userId", w.created_at as "$createdAt"
           FROM app.workspaces w
           JOIN app.members m ON w.id = m.workspace_id
           WHERE m.user_id = $1
           ORDER BY w.created_at DESC`,
          [userId]
        )
      : await pool.query(
          `SELECT w.id as "$id", w.name, w.image_url as "imageUrl", w.invite_code as "inviteCode",
                  w.user_id as "userId", w.created_at as "$createdAt"
           FROM app.workspaces w
           ORDER BY w.created_at DESC`
        );

    return { documents: result.rows, total: result.rows.length };
  } catch {
    return { documents: [], total: 0 };
  }
};
