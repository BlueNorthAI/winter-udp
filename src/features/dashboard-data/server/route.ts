import { Hono } from "hono";
import { Pool } from "pg";

import { sessionMiddleware } from "@/lib/session-middleware";
import { dbMiddleware } from "@/lib/db-middleware";
import { runMigrations, sanitizeWorkspaceId, ensureWorkspaceSchemas } from "@/lib/db-migrate";

const app = new Hono()
  // Get KPIs for workspace
  .get("/kpis", sessionMiddleware, dbMiddleware, async (c) => {
    await runMigrations();
    const db = c.get("db") as Pool;
    const workspaceId = c.req.query("workspaceId");

    if (!workspaceId) {
      return c.json({ error: "workspaceId is required" }, 400);
    }

    const safeWsId = sanitizeWorkspaceId(workspaceId);

    // Count datasets by layer
    const datasetStats = await db.query(
      `SELECT medallion_layer, count(*) as count, SUM(row_count) as total_rows
       FROM meta.datasets WHERE workspace_id = $1
       GROUP BY medallion_layer`,
      [workspaceId]
    );

    // Count pipelines
    const pipelineStats = await db.query(
      `SELECT status, count(*) as count FROM meta.pipelines WHERE workspace_id = $1 GROUP BY status`,
      [workspaceId]
    );

    // Recent query count
    const queryStats = await db.query(
      `SELECT count(*) as total, count(*) FILTER (WHERE status = 'completed') as successful,
              count(*) FILTER (WHERE status = 'failed') as failed
       FROM meta.queries WHERE workspace_id = $1`,
      [workspaceId]
    );

    // Total connections
    const connStats = await db.query(
      "SELECT count(*) as total FROM meta.connections WHERE workspace_id = $1",
      [workspaceId]
    );

    // Try to get retail KPIs from gold layer if it exists
    let retailKpis: Record<string, unknown> | null = null;
    try {
      const goldSchema = `gold_${safeWsId}`;
      const tables = await db.query(
        `SELECT table_name FROM information_schema.tables WHERE table_schema = $1`,
        [goldSchema]
      );

      if (tables.rows.length > 0) {
        // Check for common retail tables
        const tableNames = tables.rows.map((t) => t.table_name);

        if (tableNames.includes("category_performance")) {
          const catPerf = await db.query(
            `SELECT count(*) as categories, SUM(revenue) as total_revenue, SUM(transactions) as total_transactions
             FROM "${goldSchema}".category_performance`
          );
          retailKpis = Object.assign({}, retailKpis, { categoryPerformance: catPerf.rows[0] });
        }

        if (tableNames.includes("weekly_demand")) {
          const demand = await db.query(
            `SELECT count(DISTINCT sku) as active_skus,
                    SUM(total_units) as total_units,
                    SUM(total_revenue) as total_revenue
             FROM "${goldSchema}".weekly_demand`
          );
          retailKpis = Object.assign({}, retailKpis, { demandSummary: demand.rows[0] });
        }
      }
    } catch {
      // Gold layer views may not exist yet
    }

    // Also try retail schema directly
    let retailSchemaKpis = null;
    try {
      const posCount = await db.query("SELECT count(*) FROM retail.pos_transactions");
      const productCount = await db.query("SELECT count(*) FROM retail.products");
      const storeCount = await db.query("SELECT count(*) FROM retail.stores");

      retailSchemaKpis = {
        totalTransactions: parseInt(posCount.rows[0].count, 10),
        totalProducts: parseInt(productCount.rows[0].count, 10),
        totalStores: parseInt(storeCount.rows[0].count, 10),
      };
    } catch {
      // Retail tables may be empty
    }

    return c.json({
      data: {
        datasets: datasetStats.rows.reduce(
          (acc, r) => ({
            ...acc,
            [r.medallion_layer]: { count: parseInt(r.count, 10), totalRows: parseInt(r.total_rows || "0", 10) },
          }),
          {}
        ),
        pipelines: pipelineStats.rows.reduce(
          (acc, r) => ({ ...acc, [r.status]: parseInt(r.count, 10) }),
          {}
        ),
        queries: queryStats.rows[0],
        connections: parseInt(connStats.rows[0].total, 10),
        retailKpis,
        retailSchemaKpis,
      },
    });
  })

  // Get chart data for a specific analytics layer
  .get("/layer/:layerNum", sessionMiddleware, dbMiddleware, async (c) => {
    await runMigrations();
    const db = c.get("db") as Pool;
    const { layerNum } = c.req.param();
    const workspaceId = c.req.query("workspaceId");

    if (!workspaceId) {
      return c.json({ error: "workspaceId is required" }, 400);
    }

    const safeWsId = sanitizeWorkspaceId(workspaceId);
    const goldSchema = `gold_${safeWsId}`;

    try {
      await ensureWorkspaceSchemas(safeWsId);

      switch (layerNum) {
        case "0": {
          // Category Strategy
          const result = await db.query(
            `SELECT * FROM "${goldSchema}".category_performance ORDER BY revenue DESC LIMIT 50`
          ).catch(() => ({ rows: [] }));
          return c.json({ data: { layer: "Category Strategy", rows: result.rows } });
        }
        case "0.5": {
          // Demand Intelligence
          const result = await db.query(
            `SELECT * FROM "${goldSchema}".weekly_demand ORDER BY week DESC LIMIT 200`
          ).catch(() => ({ rows: [] }));
          return c.json({ data: { layer: "Demand Intelligence", rows: result.rows } });
        }
        case "1": {
          // Category Intelligence + Space Optimization
          const result = await db.query(
            `SELECT * FROM "${goldSchema}".store_profile ORDER BY total_revenue DESC LIMIT 100`
          ).catch(() => ({ rows: [] }));
          return c.json({ data: { layer: "Space Optimization", rows: result.rows } });
        }
        case "2": {
          // Assortment Optimization
          const result = await db.query(
            `SELECT * FROM "${goldSchema}".sku_performance ORDER BY total_revenue DESC LIMIT 100`
          ).catch(() => ({ rows: [] }));
          return c.json({ data: { layer: "Assortment Optimization", rows: result.rows } });
        }
        case "3": {
          // Execution + Monitoring
          const result = await db.query(
            `SELECT * FROM "${goldSchema}".kpi_scorecard LIMIT 50`
          ).catch(() => ({ rows: [] }));
          return c.json({ data: { layer: "Execution & Monitoring", rows: result.rows } });
        }
        default:
          return c.json({ error: "Invalid layer number" }, 400);
      }
    } catch {
      return c.json({ data: { layer: layerNum, rows: [], message: "Gold layer views not yet created" } });
    }
  })

  // Create gold-layer analytics views
  .post("/setup-views", sessionMiddleware, dbMiddleware, async (c) => {
    await runMigrations();
    const db = c.get("db") as Pool;
    const workspaceId = c.req.query("workspaceId");

    if (!workspaceId) {
      return c.json({ error: "workspaceId is required" }, 400);
    }

    const safeWsId = sanitizeWorkspaceId(workspaceId);
    await ensureWorkspaceSchemas(safeWsId);

    const goldSchema = `gold_${safeWsId}`;
    const silverSchema = `silver_${safeWsId}`;

    const client = await db.connect();
    try {
      await client.query("BEGIN");

      // Layer 0: Category Performance
      await client.query(`
        CREATE OR REPLACE VIEW "${goldSchema}".category_performance AS
        SELECT
          COALESCE(p.category_l1, 'Unknown') as category_l1,
          COALESCE(p.category_l2, 'Unknown') as category_l2,
          SUM(li.line_total) AS revenue,
          COUNT(DISTINCT li.transaction_id) AS transactions,
          AVG(li.line_total) AS avg_item_value,
          COUNT(DISTINCT li.sku) AS active_skus,
          SUM(li.quantity) AS total_units
        FROM retail.pos_line_items li
        LEFT JOIN retail.products p ON li.sku = p.sku
        GROUP BY COALESCE(p.category_l1, 'Unknown'), COALESCE(p.category_l2, 'Unknown')
      `);

      // Layer 0.5: Weekly Demand
      await client.query(`
        CREATE OR REPLACE VIEW "${goldSchema}".weekly_demand AS
        SELECT
          li.sku,
          DATE_TRUNC('week', t.transaction_date)::date AS week,
          SUM(li.quantity) AS total_units,
          SUM(li.line_total) AS total_revenue,
          AVG(li.unit_price) AS avg_price,
          COUNT(DISTINCT t.store_id) AS stores_sold
        FROM retail.pos_line_items li
        JOIN retail.pos_transactions t ON li.transaction_id = t.transaction_id
        GROUP BY li.sku, DATE_TRUNC('week', t.transaction_date)
      `);

      // Layer 1: Store Profile (for clustering)
      await client.query(`
        CREATE OR REPLACE VIEW "${goldSchema}".store_profile AS
        SELECT
          s.store_id,
          s.store_name,
          s.store_format,
          s.region,
          s.selling_area_sqm,
          COUNT(DISTINCT t.transaction_id) AS total_txns,
          SUM(t.total_amount) AS total_revenue,
          AVG(t.basket_size) AS avg_basket_size,
          AVG(t.total_amount) AS avg_transaction_value
        FROM retail.stores s
        LEFT JOIN retail.pos_transactions t ON s.store_id = t.store_id
        GROUP BY s.store_id, s.store_name, s.store_format, s.region, s.selling_area_sqm
      `);

      // Layer 2: SKU Performance (for assortment)
      await client.query(`
        CREATE OR REPLACE VIEW "${goldSchema}".sku_performance AS
        SELECT
          p.sku,
          p.product_name,
          p.brand,
          p.category_l1,
          p.category_l2,
          SUM(li.quantity) AS total_units,
          SUM(li.line_total) AS total_revenue,
          COUNT(DISTINCT li.transaction_id) AS txn_count,
          COUNT(DISTINCT t.store_id) AS distribution_count
        FROM retail.products p
        LEFT JOIN retail.pos_line_items li ON p.sku = li.sku
        LEFT JOIN retail.pos_transactions t ON li.transaction_id = t.transaction_id
        GROUP BY p.sku, p.product_name, p.brand, p.category_l1, p.category_l2
      `);

      // Layer 3: KPI Scorecard
      await client.query(`
        CREATE OR REPLACE VIEW "${goldSchema}".kpi_scorecard AS
        SELECT
          DATE_TRUNC('month', t.transaction_date)::date AS month,
          COUNT(DISTINCT t.transaction_id) AS total_transactions,
          SUM(t.total_amount) AS total_revenue,
          AVG(t.total_amount) AS avg_transaction_value,
          AVG(t.basket_size) AS avg_basket_size,
          SUM(t.discount_amount) AS total_discounts,
          COUNT(DISTINCT t.store_id) AS active_stores,
          COUNT(DISTINCT t.customer_id) FILTER (WHERE t.customer_id IS NOT NULL) AS unique_customers
        FROM retail.pos_transactions t
        GROUP BY DATE_TRUNC('month', t.transaction_date)
        ORDER BY month DESC
      `);

      await client.query("COMMIT");

      return c.json({ data: { success: true, message: "Gold layer views created successfully" } });
    } catch (error) {
      await client.query("ROLLBACK");
      const message = error instanceof Error ? error.message : "Failed to create views";
      return c.json({ error: message }, 500);
    } finally {
      client.release();
    }
  });

export default app;
