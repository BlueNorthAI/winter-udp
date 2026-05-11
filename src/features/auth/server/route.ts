import { Hono } from "hono";
import { sessionMiddleware } from "@/lib/session-middleware";

const DEFAULT_USER = {
  $id: "00000000-0000-0000-0000-000000000001",
  name: "User",
  email: "user@localhost",
};

const app = new Hono()
  .get("/current", sessionMiddleware, async (c) => {
    return c.json({ data: DEFAULT_USER });
  });

export default app;
