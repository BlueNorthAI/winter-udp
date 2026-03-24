import { z } from "zod";

export const describeSchema = z.object({
  workspaceId: z.string().min(1),
  schema: z.string().min(1),
  table: z.string().min(1),
  columns: z.array(z.string()).optional(),
});

export const forecastSchema = z.object({
  workspaceId: z.string().min(1),
  schema: z.string().min(1),
  table: z.string().min(1),
  dateColumn: z.string().min(1),
  valueColumn: z.string().min(1),
  groupByColumn: z.string().optional(),
  groupByValue: z.string().optional(),
  horizonPeriods: z.number().int().min(1).max(52).default(12),
  seasonLength: z.number().int().min(2).max(52).default(12),
});

export const elasticitySchema = z.object({
  workspaceId: z.string().min(1),
  schema: z.string().min(1),
  table: z.string().min(1),
  priceColumn: z.string().min(1),
  quantityColumn: z.string().min(1),
  groupByColumn: z.string().optional(),
  groupByValue: z.string().optional(),
});

export const saveExperimentSchema = z.object({
  workspaceId: z.string().min(1),
  name: z.string().min(1),
  type: z.enum(["forecast", "elasticity", "descriptive"]),
  config: z.record(z.unknown()),
  results: z.record(z.unknown()),
});
