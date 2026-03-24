export interface InferredColumn {
  name: string;
  type: "TEXT" | "INTEGER" | "NUMERIC" | "BOOLEAN" | "DATE" | "TIMESTAMP";
  nullable: boolean;
  sampleValues: string[];
}

export interface UploadPreview {
  fileName: string;
  rowCount: number;
  columns: InferredColumn[];
  previewRows: Record<string, unknown>[];
}

export interface DatasetRecord {
  id: string;
  workspace_id: string;
  name: string;
  source_type: string;
  medallion_layer: string;
  schema_name: string;
  table_name: string;
  row_count: number | null;
  column_count: number | null;
  file_size_bytes: number | null;
  column_metadata: InferredColumn[] | null;
  created_by: string;
  created_at: string;
}

export interface ConnectionRecord {
  id: string;
  workspace_id: string;
  name: string;
  type: string;
  host: string | null;
  port: number | null;
  database_name: string | null;
  username: string | null;
  ssl_enabled: boolean;
  status: string;
  created_by: string;
  created_at: string;
}
