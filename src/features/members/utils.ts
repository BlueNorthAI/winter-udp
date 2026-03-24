import { Pool } from "pg";

interface GetMemberProps {
  db: Pool;
  workspaceId: string;
  userId: string;
}

export const getMember = async ({ db, workspaceId, userId }: GetMemberProps) => {
  const result = await db.query(
    "SELECT id, workspace_id, user_id, role FROM app.members WHERE workspace_id = $1 AND user_id = $2",
    [workspaceId, userId]
  );

  if (result.rows.length === 0) return null;

  const row = result.rows[0];
  return {
    $id: row.id,
    workspaceId: row.workspace_id,
    userId: row.user_id,
    role: row.role,
  };
};
