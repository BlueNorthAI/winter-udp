import { cookies } from "next/headers";
import { getPool } from "@/lib/db";
import { runMigrations } from "@/lib/db-migrate";
import { AUTH_COOKIE } from "./constants";

const DEFAULT_USER = {
  $id: "default-user",
  name: "User",
  email: "user@localhost",
};

export const getCurrent = async () => {
  try {
    await runMigrations();
    const cookieStore = cookies();
    const token = cookieStore.get(AUTH_COOKIE)?.value;

    if (!token) return DEFAULT_USER;

    const pool = getPool();
    const result = await pool.query(
      `SELECT u.id, u.name, u.email
       FROM app.sessions s
       JOIN app.users u ON s.user_id = u.id
       WHERE s.token = $1 AND s.expires_at > NOW()`,
      [token]
    );

    if (result.rows.length === 0) return DEFAULT_USER;

    const user = result.rows[0];
    return { $id: user.id, name: user.name, email: user.email };
  } catch {
    return DEFAULT_USER;
  }
};
