import "server-only";

import { Pool } from "pg";

export interface PipelineStep {
  order: number;
  type: "source" | "filter" | "transform" | "deduplicate" | "join" | "aggregate" | "quality_check" | "target";
  config: Record<string, unknown>;
}

export interface StepResult {
  step: number;
  type: string;
  status: "success" | "error";
  rowsAffected?: number;
  message?: string;
  sql?: string;
}

function buildSourceSQL(config: Record<string, unknown>): string {
  const schema = config.schema as string;
  const table = config.table as string;
  const columns = (config.columns as string[]) || ["*"];
  return `SELECT ${columns.join(", ")} FROM "${schema}"."${table}"`;
}

function buildFilterSQL(prevSQL: string, config: Record<string, unknown>): string {
  const conditions = config.conditions as string[];
  return `SELECT * FROM (${prevSQL}) _f WHERE ${conditions.join(" AND ")}`;
}

function buildTransformSQL(prevSQL: string, config: Record<string, unknown>): string {
  const expressions = config.expressions as { alias: string; expr: string }[];
  const selectList = expressions.map((e) => `${e.expr} AS "${e.alias}"`).join(", ");
  return `SELECT ${selectList} FROM (${prevSQL}) _t`;
}

function buildDeduplicateSQL(prevSQL: string, config: Record<string, unknown>): string {
  const keys = config.keys as string[];
  if (keys && keys.length > 0) {
    const orderBy = (config.orderBy as string) || keys[0];
    const keyList = keys.map((k) => `"${k}"`).join(", ");
    return `SELECT * FROM (
      SELECT *, ROW_NUMBER() OVER (PARTITION BY ${keyList} ORDER BY "${orderBy}" DESC) as _rn
      FROM (${prevSQL}) _dd
    ) _dedup WHERE _rn = 1`;
  }
  return `SELECT DISTINCT * FROM (${prevSQL}) _dd`;
}

function buildJoinSQL(prevSQL: string, config: Record<string, unknown>): string {
  const joinSchema = config.joinSchema as string;
  const joinTable = config.joinTable as string;
  const joinType = (config.joinType as string) || "INNER";
  const onCondition = config.onCondition as string;
  return `SELECT * FROM (${prevSQL}) _left ${joinType} JOIN "${joinSchema}"."${joinTable}" _right ON ${onCondition}`;
}

function buildAggregateSQL(prevSQL: string, config: Record<string, unknown>): string {
  const groupBy = config.groupBy as string[];
  const aggregations = config.aggregations as { func: string; column: string; alias: string }[];
  const groupList = groupBy.map((g) => `"${g}"`).join(", ");
  const aggList = aggregations.map((a) => `${a.func}("${a.column}") AS "${a.alias}"`).join(", ");
  const selectList = groupList ? `${groupList}, ${aggList}` : aggList;
  return `SELECT ${selectList} FROM (${prevSQL}) _agg${groupList ? ` GROUP BY ${groupList}` : ""}`;
}

function buildQualityCheckSQL(prevSQL: string, config: Record<string, unknown>): string {
  const checks = config.checks as { type: string; column: string; value?: unknown }[];
  const conditions: string[] = [];

  for (const check of checks) {
    switch (check.type) {
      case "not_null":
        conditions.push(`"${check.column}" IS NOT NULL`);
        break;
      case "unique":
        // Will be checked separately
        break;
      case "range":
        const range = check.value as { min: number; max: number };
        conditions.push(`"${check.column}" BETWEEN ${range.min} AND ${range.max}`);
        break;
    }
  }

  if (conditions.length > 0) {
    return `SELECT * FROM (${prevSQL}) _qc WHERE ${conditions.join(" AND ")}`;
  }
  return prevSQL;
}

export async function executePipeline(
  db: Pool,
  steps: PipelineStep[],
  searchPath: string
): Promise<{ results: StepResult[]; totalRows: number }> {
  const client = await db.connect();
  const results: StepResult[] = [];
  let currentSQL = "";
  let totalRows = 0;

  try {
    await client.query("BEGIN");
    await client.query(`SET search_path TO ${searchPath}`);

    const sortedSteps = [...steps].sort((a, b) => a.order - b.order);

    for (const step of sortedSteps) {
      try {
        switch (step.type) {
          case "source":
            currentSQL = buildSourceSQL(step.config);
            break;
          case "filter":
            currentSQL = buildFilterSQL(currentSQL, step.config);
            break;
          case "transform":
            currentSQL = buildTransformSQL(currentSQL, step.config);
            break;
          case "deduplicate":
            currentSQL = buildDeduplicateSQL(currentSQL, step.config);
            break;
          case "join":
            currentSQL = buildJoinSQL(currentSQL, step.config);
            break;
          case "aggregate":
            currentSQL = buildAggregateSQL(currentSQL, step.config);
            break;
          case "quality_check":
            currentSQL = buildQualityCheckSQL(currentSQL, step.config);
            break;
          case "target": {
            const targetSchema = step.config.schema as string;
            const targetTable = step.config.table as string;
            const mode = (step.config.mode as string) || "overwrite";

            if (mode === "overwrite") {
              await client.query(`DROP TABLE IF EXISTS "${targetSchema}"."${targetTable}"`);
              await client.query(
                `CREATE TABLE "${targetSchema}"."${targetTable}" AS ${currentSQL}`
              );
            } else {
              await client.query(
                `INSERT INTO "${targetSchema}"."${targetTable}" ${currentSQL}`
              );
            }

            const countResult = await client.query(
              `SELECT count(*) FROM "${targetSchema}"."${targetTable}"`
            );
            totalRows = parseInt(countResult.rows[0].count, 10);

            results.push({
              step: step.order,
              type: step.type,
              status: "success",
              rowsAffected: totalRows,
              sql: currentSQL,
            });
            continue;
          }
        }

        results.push({
          step: step.order,
          type: step.type,
          status: "success",
          sql: currentSQL,
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Step failed";
        results.push({
          step: step.order,
          type: step.type,
          status: "error",
          message,
          sql: currentSQL,
        });
        throw error;
      }
    }

    await client.query("COMMIT");
    return { results, totalRows };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
