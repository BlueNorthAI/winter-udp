import "server-only";

import { Pool } from "pg";
import { PG_DATABASE_URL, PG_DATALAKE_URL, PG_MAX_CONNECTIONS } from "@/config";

let pool: Pool | null = null;
let datalakePool: Pool | null = null;

export function getPool(): Pool {
  if (!pool) {
    const useSSL = PG_DATABASE_URL.includes("sslmode=require");
    pool = new Pool({
      connectionString: PG_DATABASE_URL,
      max: PG_MAX_CONNECTIONS,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
      ssl: useSSL ? { rejectUnauthorized: false } : false,
    });

    pool.on("error", (err) => {
      console.error("Unexpected PG pool error:", err);
    });
  }
  return pool;
}

export function getDatalakePool(): Pool {
  if (!datalakePool) {
    const useSSL = PG_DATALAKE_URL.includes("sslmode=require");
    datalakePool = new Pool({
      connectionString: PG_DATALAKE_URL,
      max: PG_MAX_CONNECTIONS,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
      ssl: useSSL ? { rejectUnauthorized: false } : false,
    });

    datalakePool.on("error", (err) => {
      console.error("Unexpected datalake pool error:", err);
    });
  }
  return datalakePool;
}

export async function query(text: string, params?: unknown[]) {
  const client = await getPool().connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
}

export async function queryWithTimeout(
  text: string,
  params: unknown[] = [],
  timeoutMs: number = 30000
) {
  const client = await getPool().connect();
  try {
    await client.query(`SET statement_timeout = ${timeoutMs}`);
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
}
