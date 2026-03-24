export interface ExperimentRecord {
  id: string;
  workspace_id: string;
  name: string;
  type: string;
  config: Record<string, unknown>;
  results: Record<string, unknown> | null;
  status: string;
  created_by: string;
  created_at: string;
}
