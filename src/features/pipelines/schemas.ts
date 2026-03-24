import { z } from "zod";

const stepSchema = z.object({
  order: z.number().int().min(0),
  type: z.enum(["source", "filter", "transform", "deduplicate", "join", "aggregate", "quality_check", "target"]),
  config: z.record(z.unknown()),
});

export const createPipelineSchema = z.object({
  workspaceId: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
  steps: z.array(stepSchema).min(1),
  schedule: z.string().nullable().optional(),
});

export const updatePipelineSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  steps: z.array(stepSchema).min(1).optional(),
  schedule: z.string().nullable().optional(),
  status: z.enum(["active", "inactive"]).optional(),
});
