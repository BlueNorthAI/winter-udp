import { z } from "zod";

export const confirmUploadSchema = z.object({
  workspaceId: z.string().min(1),
  tableName: z.string().min(1).regex(/^[a-zA-Z_][a-zA-Z0-9_]*$/, "Table name must be a valid SQL identifier"),
  columns: z.array(z.object({
    name: z.string().min(1),
    type: z.enum(["TEXT", "INTEGER", "NUMERIC", "BOOLEAN", "DATE", "TIMESTAMP"]),
    nullable: z.boolean(),
  })),
  data: z.array(z.record(z.unknown())),
  medallionLayer: z.enum(["bronze", "silver", "gold"]).default("bronze"),
});

export const createConnectionSchema = z.object({
  workspaceId: z.string().min(1),
  name: z.string().min(1),
  host: z.string().min(1),
  port: z.number().int().min(1).max(65535).default(5432),
  database: z.string().min(1),
  username: z.string().min(1),
  password: z.string().min(1),
  sslEnabled: z.boolean().default(false),
});

export const importTableSchema = z.object({
  workspaceId: z.string().min(1),
  sourceSchema: z.string().default("public"),
  sourceTable: z.string().min(1),
  targetTable: z.string().min(1).regex(/^[a-zA-Z_][a-zA-Z0-9_]*$/),
  medallionLayer: z.enum(["bronze", "silver", "gold"]).default("bronze"),
});
