export interface QueryResult {
  columns: string[];
  rows: Record<string, unknown>[];
  rowCount: number;
  executionTimeMs: number;
}

export interface QueryRecord {
  id: string;
  workspace_id: string;
  name: string | null;
  sql_text: string;
  status: string;
  result_row_count: number | null;
  execution_time_ms: number | null;
  error_message: string | null;
  is_saved: boolean;
  created_by: string;
  created_at: string;
}
