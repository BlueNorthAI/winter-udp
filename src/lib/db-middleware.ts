import "server-only";

import { createMiddleware } from "hono/factory";
import { Pool } from "pg";
import { getPool } from "./db";

type DbContext = {
  Variables: {
    db: Pool;
  };
};

export const dbMiddleware = createMiddleware<DbContext>(async (c, next) => {
  const pool = getPool();
  c.set("db", pool);
  await next();
});
