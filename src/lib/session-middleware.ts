import "server-only";

import { createMiddleware } from "hono/factory";
import { Pool } from "pg";
import { getPool } from "./db";
import { runMigrations } from "./db-migrate";

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
  id: "00000000-0000-0000-0000-000000000001",
  name: "User",
  email: "user@localhost",
};

export const sessionMiddleware = createMiddleware<AdditionalContext>(
  async (c, next) => {
    await runMigrations();

    const pool = getPool();
    c.set("db", pool);
    c.set("user", DEFAULT_USER);

    await next();
  },
);
