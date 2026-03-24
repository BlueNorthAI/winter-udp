// PostgreSQL Datalake Configuration
export const PG_DATABASE_URL = process.env.DATABASE_URL!;
export const PG_MAX_CONNECTIONS = parseInt(process.env.PG_MAX_CONNECTIONS || "10", 10);
export const PG_STATEMENT_TIMEOUT_MS = parseInt(process.env.PG_STATEMENT_TIMEOUT_MS || "30000", 10);
export const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "";
