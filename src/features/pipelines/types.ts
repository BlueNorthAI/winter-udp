import { PipelineStep } from "@/lib/pipeline-executor";

export interface PipelineRecord {
  id: string;
  workspace_id: string;
  name: string;
  description: string | null;
  steps: PipelineStep[];
  schedule: string | null;
  status: string;
  last_run_at: string | null;
  last_run_status: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface PipelineRunRecord {
  id: string;
  pipeline_id: string;
  status: string;
  started_at: string;
  completed_at: string | null;
  error_message: string | null;
  rows_processed: number;
  step_results: unknown;
}
