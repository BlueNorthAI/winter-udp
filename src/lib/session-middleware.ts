import "server-only";

import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { Pool } from "pg";
import { getPool } from "./db";
import { runMigrations } from "./db-migrate";

import { AUTH_COOKIE } from "@/features/auth/constants";

export type AppUser = {
  id: string;
  name: string;
  email: string;
};

type AdditionalContext = {
  Variables: {
    user: AppUser;
    db: Pool;
  };
};

const DEFAULT_USER: AppUser = {
  id: "default-user",
  name: "User",
  email: "user@localhost",
};

export const sessionMiddleware = createMiddleware<AdditionalContext>(
  async (c, next) => {
    await runMigrations();

    const pool = getPool();
    c.set("db", pool);

    const token = getCookie(c, AUTH_COOKIE);

    if (!token) {
      c.set("user", DEFAULT_USER);
      await next();
      return;
    }

    // Validate session token against PostgreSQL
    const result = await pool.query(
      `SELECT s.user_id, u.id, u.name, u.email
       FROM app.sessions s
       JOIN app.users u ON s.user_id = u.id
       WHERE s.token = $1 AND s.expires_at > NOW()`,
      [token]
    );

    if (result.rows.length === 0) {
      c.set("user", DEFAULT_USER);
      await next();
      return;
    }

    const row = result.rows[0];
    c.set("user", {
      id: row.id,
      name: row.name,
      email: row.email,
    });

    await next();
  },
);
