import { Hono } from "hono";
import { handle } from "hono/vercel";

import auth from "@/features/auth/server/route";
import members from "@/features/members/server/route";
import workspaces from "@/features/workspaces/server/route";
import projects from "@/features/projects/server/route";
import tasks from "@/features/tasks/server/route";

// Data platform routes
import ingestion from "@/features/ingestion/server/route";
import catalog from "@/features/catalog/server/route";
import sql from "@/features/sql/server/route";
import pipelines from "@/features/pipelines/server/route";
import ml from "@/features/ml/server/route";
import dashboardData from "@/features/dashboard-data/server/route";

const app = new Hono().basePath("/api");

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const routes = app
  .route("/auth", auth)
  .route("/members", members)
  .route("/workspaces", workspaces)
  .route("/projects", projects)
  .route("/tasks", tasks)
  // Data platform routes
  .route("/ingestion", ingestion)
  .route("/catalog", catalog)
  .route("/sql", sql)
  .route("/pipelines", pipelines)
  .route("/ml", ml)
  .route("/dashboard-data", dashboardData)

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;
