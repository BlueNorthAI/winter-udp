import { z } from "zod";

export const executeQuerySchema = z.object({
  workspaceId: z.string().min(1),
  sql: z.string().min(1),
  limit: z.number().int().min(1).max(10000).default(1000),
});

export const saveQuerySchema = z.object({
  workspaceId: z.string().min(1),
  name: z.string().min(1),
  sql: z.string().min(1),
});
