import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { deleteCookie, setCookie } from "hono/cookie";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { Pool } from "pg";

import { sessionMiddleware } from "@/lib/session-middleware";
import { getPool } from "@/lib/db";
import { runMigrations } from "@/lib/db-migrate";

import { loginSchema, registerSchema } from "../schemas";
import { AUTH_COOKIE } from "../constants";

const app = new Hono()
  .get("/current", sessionMiddleware, async (c) => {
    const user = c.get("user");
    return c.json({ data: { $id: user.id, name: user.name, email: user.email } });
  })
  .post("/login", zValidator("json", loginSchema), async (c) => {
    await runMigrations();
    const { email, password } = c.req.valid("json");
    const db = getPool();

    const userResult = await db.query(
      "SELECT id, name, email, password_hash FROM app.users WHERE email = $1",
      [email]
    );

    if (userResult.rows.length === 0) {
      return c.json({ error: "Invalid email or password" }, 401);
    }

    const user = userResult.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);

    if (!valid) {
      return c.json({ error: "Invalid email or password" }, 401);
    }

    // Create session
    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    await db.query(
      "INSERT INTO app.sessions (user_id, token, expires_at) VALUES ($1, $2, $3)",
      [user.id, token, expiresAt.toISOString()]
    );

    setCookie(c, AUTH_COOKIE, token, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
    });

    return c.json({ data: { $id: user.id, name: user.name, email: user.email } });
  })
  .post("/register", zValidator("json", registerSchema), async (c) => {
    await runMigrations();
    const { name, email, password } = c.req.valid("json");
    const db = getPool();

    const existing = await db.query("SELECT id FROM app.users WHERE email = $1", [email]);
    if (existing.rows.length > 0) {
      return c.json({ error: "Email already registered" }, 400);
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userResult = await db.query(
      "INSERT INTO app.users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email",
      [name, email, passwordHash]
    );
    const user = userResult.rows[0];

    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    await db.query(
      "INSERT INTO app.sessions (user_id, token, expires_at) VALUES ($1, $2, $3)",
      [user.id, token, expiresAt.toISOString()]
    );

    setCookie(c, AUTH_COOKIE, token, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
    });

    return c.json({ data: { $id: user.id, name: user.name, email: user.email } });
  })
  .post("/logout", sessionMiddleware, async (c) => {
    const db = c.get("db") as Pool;
    const user = c.get("user");

    await db.query("DELETE FROM app.sessions WHERE user_id = $1", [user.id]);

    deleteCookie(c, AUTH_COOKIE, { path: "/", httpOnly: true, secure: true, sameSite: "lax" });

    return c.json({ data: { success: true } });
  });

export default app;
