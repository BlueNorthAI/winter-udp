import "server-only";

import { getPool } from "./db";

const META_SCHEMA_SQL = `
-- Meta schema for platform metadata
CREATE SCHEMA IF NOT EXISTS meta;

-- External database connections
CREATE TABLE IF NOT EXISTS meta.connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id TEXT NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('postgresql', 'csv', 'excel')),
  host TEXT,
  port INT,
  database_name TEXT,
  username TEXT,
  password_encrypted TEXT,
  ssl_enabled BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'pending',
  created_by TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ingested datasets tracking
CREATE TABLE IF NOT EXISTS meta.datasets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id TEXT NOT NULL,
  name TEXT NOT NULL,
  source_type TEXT NOT NULL,
  source_connection_id UUID REFERENCES meta.connections(id) ON DELETE SET NULL,
  medallion_layer TEXT NOT NULL CHECK (medallion_layer IN ('bronze', 'silver', 'gold')),
  schema_name TEXT NOT NULL,
  table_name TEXT NOT NULL,
  row_count BIGINT,
  column_count INT,
  file_size_bytes BIGINT,
  column_metadata JSONB,
  created_by TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Query history and saved queries
CREATE TABLE IF NOT EXISTS meta.queries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id TEXT NOT NULL,
  name TEXT,
  sql_text TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  result_row_count INT,
  execution_time_ms INT,
  error_message TEXT,
  is_saved BOOLEAN DEFAULT false,
  created_by TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pipeline definitions
CREATE TABLE IF NOT EXISTS meta.pipelines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  steps JSONB NOT NULL DEFAULT '[]',
  schedule TEXT,
  status TEXT DEFAULT 'inactive',
  last_run_at TIMESTAMPTZ,
  last_run_status TEXT,
  created_by TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pipeline execution log
CREATE TABLE IF NOT EXISTS meta.pipeline_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pipeline_id UUID REFERENCES meta.pipelines(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  error_message TEXT,
  rows_processed BIGINT DEFAULT 0,
  step_results JSONB
);

-- Data lineage tracking
CREATE TABLE IF NOT EXISTS meta.lineage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_dataset_id UUID REFERENCES meta.datasets(id) ON DELETE CASCADE,
  target_dataset_id UUID REFERENCES meta.datasets(id) ON DELETE CASCADE,
  transformation_type TEXT,
  pipeline_id UUID REFERENCES meta.pipelines(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Catalog annotations (descriptions, tags)
CREATE TABLE IF NOT EXISTS meta.catalog_annotations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id TEXT NOT NULL,
  schema_name TEXT NOT NULL,
  table_name TEXT NOT NULL,
  column_name TEXT,
  description TEXT,
  tags JSONB DEFAULT '[]',
  updated_by TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(workspace_id, schema_name, table_name, column_name)
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_datasets_workspace ON meta.datasets(workspace_id);
CREATE INDEX IF NOT EXISTS idx_queries_workspace ON meta.queries(workspace_id);
CREATE INDEX IF NOT EXISTS idx_pipelines_workspace ON meta.pipelines(workspace_id);
CREATE INDEX IF NOT EXISTS idx_connections_workspace ON meta.connections(workspace_id);
CREATE INDEX IF NOT EXISTS idx_pipeline_runs_pipeline ON meta.pipeline_runs(pipeline_id);
CREATE INDEX IF NOT EXISTS idx_queries_created_at ON meta.queries(created_at DESC);
`;

const APP_SCHEMA_SQL = `
-- Application schema (replaces Appwrite)
CREATE SCHEMA IF NOT EXISTS app;

-- Users
CREATE TABLE IF NOT EXISTS app.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sessions
CREATE TABLE IF NOT EXISTS app.sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES app.users(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workspaces
CREATE TABLE IF NOT EXISTS app.workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  image_url TEXT,
  invite_code TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES app.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Members
CREATE TABLE IF NOT EXISTS app.members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES app.workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES app.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'MEMBER' CHECK (role IN ('ADMIN', 'MEMBER')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(workspace_id, user_id)
);

-- Projects
CREATE TABLE IF NOT EXISTS app.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  image_url TEXT,
  workspace_id UUID NOT NULL REFERENCES app.workspaces(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tasks
CREATE TABLE IF NOT EXISTS app.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'TODO' CHECK (status IN ('BACKLOG', 'TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE')),
  workspace_id UUID NOT NULL REFERENCES app.workspaces(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES app.projects(id) ON DELETE CASCADE,
  assignee_id UUID REFERENCES app.members(id) ON DELETE SET NULL,
  due_date TIMESTAMPTZ,
  position INT NOT NULL DEFAULT 1000,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- App indexes
CREATE INDEX IF NOT EXISTS idx_sessions_token ON app.sessions(token);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON app.sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_members_workspace ON app.members(workspace_id);
CREATE INDEX IF NOT EXISTS idx_members_user ON app.members(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_workspace ON app.projects(workspace_id);
CREATE INDEX IF NOT EXISTS idx_tasks_workspace ON app.tasks(workspace_id);
CREATE INDEX IF NOT EXISTS idx_tasks_project ON app.tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assignee ON app.tasks(assignee_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON app.tasks(status);
CREATE INDEX IF NOT EXISTS idx_workspaces_invite ON app.workspaces(invite_code);
`;

const RETAIL_SCHEMA_SQL = `
-- Retail reference schema (shared across workspaces)
CREATE SCHEMA IF NOT EXISTS retail;

-- POS Transactions
CREATE TABLE IF NOT EXISTS retail.pos_transactions (
  transaction_id TEXT PRIMARY KEY,
  store_id TEXT NOT NULL,
  register_id TEXT,
  transaction_date DATE NOT NULL,
  transaction_time TIME,
  customer_id TEXT,
  loyalty_card_id TEXT,
  total_amount NUMERIC(12,2),
  discount_amount NUMERIC(12,2),
  payment_method TEXT,
  basket_size INT
);

-- POS Line Items
CREATE TABLE IF NOT EXISTS retail.pos_line_items (
  id SERIAL PRIMARY KEY,
  transaction_id TEXT REFERENCES retail.pos_transactions(transaction_id) ON DELETE CASCADE,
  sku TEXT NOT NULL,
  ean TEXT,
  product_name TEXT,
  category_l1 TEXT,
  category_l2 TEXT,
  category_l3 TEXT,
  brand TEXT,
  manufacturer TEXT,
  quantity NUMERIC(10,3),
  unit_price NUMERIC(10,2),
  line_total NUMERIC(12,2),
  discount NUMERIC(10,2),
  promotion_id TEXT
);

-- Store Master
CREATE TABLE IF NOT EXISTS retail.stores (
  store_id TEXT PRIMARY KEY,
  store_name TEXT,
  store_format TEXT,
  region TEXT,
  city TEXT,
  address TEXT,
  latitude NUMERIC(9,6),
  longitude NUMERIC(9,6),
  selling_area_sqm NUMERIC(10,2),
  fixture_count INT,
  cluster_id TEXT,
  opened_date DATE
);

-- Product Master
CREATE TABLE IF NOT EXISTS retail.products (
  sku TEXT PRIMARY KEY,
  ean TEXT,
  product_name TEXT NOT NULL,
  brand TEXT,
  manufacturer TEXT,
  category_l1 TEXT,
  category_l2 TEXT,
  category_l3 TEXT,
  segment TEXT,
  pack_size TEXT,
  pack_type TEXT,
  unit_of_measure TEXT,
  is_own_label BOOLEAN DEFAULT false,
  shelf_life_days INT,
  status TEXT DEFAULT 'active'
);

-- Pricing History
CREATE TABLE IF NOT EXISTS retail.pricing (
  id SERIAL PRIMARY KEY,
  sku TEXT REFERENCES retail.products(sku) ON DELETE CASCADE,
  store_id TEXT REFERENCES retail.stores(store_id) ON DELETE CASCADE,
  effective_date DATE NOT NULL,
  regular_price NUMERIC(10,2),
  promo_price NUMERIC(10,2),
  cost_price NUMERIC(10,2),
  competitor_price NUMERIC(10,2),
  price_index NUMERIC(6,3)
);

-- Loyalty Customers
CREATE TABLE IF NOT EXISTS retail.loyalty_customers (
  customer_id TEXT PRIMARY KEY,
  loyalty_card_id TEXT UNIQUE,
  segment TEXT,
  join_date DATE,
  lifetime_spend NUMERIC(14,2),
  visit_frequency NUMERIC(6,2),
  avg_basket_value NUMERIC(10,2),
  preferred_store_id TEXT
);

-- Panel Data (NielsenIQ / Circana / Kantar)
CREATE TABLE IF NOT EXISTS retail.panel_data (
  id SERIAL PRIMARY KEY,
  period_start DATE,
  period_end DATE,
  source TEXT,
  market TEXT,
  category TEXT,
  brand TEXT,
  manufacturer TEXT,
  value_sales NUMERIC(14,2),
  volume_sales NUMERIC(14,2),
  value_share NUMERIC(6,3),
  volume_share NUMERIC(6,3),
  distribution_numeric NUMERIC(6,3),
  distribution_weighted NUMERIC(6,3)
);

-- Store Fixtures / Space
CREATE TABLE IF NOT EXISTS retail.fixtures (
  fixture_id TEXT PRIMARY KEY,
  store_id TEXT REFERENCES retail.stores(store_id) ON DELETE CASCADE,
  category TEXT,
  aisle TEXT,
  bay_number INT,
  shelf_count INT,
  total_linear_cm NUMERIC(10,2),
  total_facing_capacity INT
);

-- Indexes for retail tables
CREATE INDEX IF NOT EXISTS idx_pos_txn_date ON retail.pos_transactions(transaction_date);
CREATE INDEX IF NOT EXISTS idx_pos_txn_store ON retail.pos_transactions(store_id);
CREATE INDEX IF NOT EXISTS idx_pos_items_txn ON retail.pos_line_items(transaction_id);
CREATE INDEX IF NOT EXISTS idx_pos_items_sku ON retail.pos_line_items(sku);
CREATE INDEX IF NOT EXISTS idx_pricing_sku ON retail.pricing(sku);
CREATE INDEX IF NOT EXISTS idx_pricing_store ON retail.pricing(store_id);
CREATE INDEX IF NOT EXISTS idx_panel_category ON retail.panel_data(category);
`;

let migrated = false;

export async function runMigrations() {
  if (migrated) return;

  const pool = getPool();
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    await client.query(APP_SCHEMA_SQL);
    await client.query(META_SCHEMA_SQL);
    await client.query(RETAIL_SCHEMA_SQL);
    await client.query("COMMIT");
    migrated = true;
    console.log("[DB] Meta and retail schemas migrated successfully");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("[DB] Migration failed:", error);
    throw error;
  } finally {
    client.release();
  }
}

export async function ensureWorkspaceSchemas(workspaceId: string) {
  const safeId = workspaceId.replace(/[^a-zA-Z0-9_]/g, "_");
  const pool = getPool();
  const client = await pool.connect();

  try {
    await client.query(`CREATE SCHEMA IF NOT EXISTS bronze_${safeId}`);
    await client.query(`CREATE SCHEMA IF NOT EXISTS silver_${safeId}`);
    await client.query(`CREATE SCHEMA IF NOT EXISTS gold_${safeId}`);
    console.log(`[DB] Workspace schemas created for ${safeId}`);
  } finally {
    client.release();
  }
}

export function sanitizeWorkspaceId(workspaceId: string): string {
  return workspaceId.replace(/[^a-zA-Z0-9_]/g, "_");
}
