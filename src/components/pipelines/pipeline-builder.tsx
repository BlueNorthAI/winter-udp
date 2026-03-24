"use client"

import { useState } from "react"
import { Plus, Trash2, ArrowDown, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id"
import { useCreatePipeline } from "@/features/pipelines/api/use-create-pipeline"

interface PipelineStep {
  order: number
  type: string
  config: Record<string, unknown>
}

const STEP_TYPES = [
  { value: "source", label: "Source (Read Table)" },
  { value: "filter", label: "Filter (WHERE)" },
  { value: "transform", label: "Transform (SELECT)" },
  { value: "deduplicate", label: "Deduplicate" },
  { value: "join", label: "Join" },
  { value: "aggregate", label: "Aggregate (GROUP BY)" },
  { value: "quality_check", label: "Data Quality Check" },
  { value: "target", label: "Target (Write Table)" },
]

function StepConfig({ step, onChange }: { step: PipelineStep; onChange: (config: Record<string, unknown>) => void }) {
  const config = step.config

  switch (step.type) {
    case "source":
      return (
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-muted-foreground">Schema</label>
            <Input
              value={(config.schema as string) || ""}
              onChange={(e) => onChange({ ...config, schema: e.target.value })}
              placeholder="bronze_workspace123"
              className="h-8 text-xs"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Table</label>
            <Input
              value={(config.table as string) || ""}
              onChange={(e) => onChange({ ...config, table: e.target.value })}
              placeholder="pos_data"
              className="h-8 text-xs"
            />
          </div>
        </div>
      )
    case "filter":
      return (
        <div>
          <label className="text-xs text-muted-foreground">Conditions (one per line)</label>
          <textarea
            value={((config.conditions as string[]) || []).join("\n")}
            onChange={(e) => onChange({ ...config, conditions: e.target.value.split("\n").filter(Boolean) })}
            placeholder="amount > 0&#10;status = 'active'"
            className="w-full border rounded p-2 text-xs font-mono h-20 resize-none"
          />
        </div>
      )
    case "transform":
      return (
        <div>
          <label className="text-xs text-muted-foreground">Expressions (JSON: [{`{expr, alias}`}])</label>
          <textarea
            value={JSON.stringify(config.expressions || [{ expr: "*", alias: "*" }], null, 2)}
            onChange={(e) => {
              try { onChange({ ...config, expressions: JSON.parse(e.target.value) }) } catch {}
            }}
            className="w-full border rounded p-2 text-xs font-mono h-20 resize-none"
          />
        </div>
      )
    case "deduplicate":
      return (
        <div>
          <label className="text-xs text-muted-foreground">Dedup Keys (comma-separated)</label>
          <Input
            value={((config.keys as string[]) || []).join(", ")}
            onChange={(e) => onChange({ ...config, keys: e.target.value.split(",").map((k) => k.trim()).filter(Boolean) })}
            placeholder="id, date"
            className="h-8 text-xs"
          />
        </div>
      )
    case "aggregate":
      return (
        <div className="space-y-2">
          <div>
            <label className="text-xs text-muted-foreground">Group By (comma-separated)</label>
            <Input
              value={((config.groupBy as string[]) || []).join(", ")}
              onChange={(e) => onChange({ ...config, groupBy: e.target.value.split(",").map((k) => k.trim()).filter(Boolean) })}
              placeholder="category, brand"
              className="h-8 text-xs"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Aggregations (JSON: [{`{func, column, alias}`}])</label>
            <textarea
              value={JSON.stringify(config.aggregations || [{ func: "SUM", column: "amount", alias: "total" }], null, 2)}
              onChange={(e) => {
                try { onChange({ ...config, aggregations: JSON.parse(e.target.value) }) } catch {}
              }}
              className="w-full border rounded p-2 text-xs font-mono h-16 resize-none"
            />
          </div>
        </div>
      )
    case "target":
      return (
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-muted-foreground">Schema</label>
            <Input
              value={(config.schema as string) || ""}
              onChange={(e) => onChange({ ...config, schema: e.target.value })}
              placeholder="silver_workspace123"
              className="h-8 text-xs"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Table</label>
            <Input
              value={(config.table as string) || ""}
              onChange={(e) => onChange({ ...config, table: e.target.value })}
              placeholder="pos_clean"
              className="h-8 text-xs"
            />
          </div>
        </div>
      )
    default:
      return (
        <div>
          <label className="text-xs text-muted-foreground">Config (JSON)</label>
          <textarea
            value={JSON.stringify(config, null, 2)}
            onChange={(e) => { try { onChange(JSON.parse(e.target.value)) } catch {} }}
            className="w-full border rounded p-2 text-xs font-mono h-20 resize-none"
          />
        </div>
      )
  }
}

export function PipelineBuilder({ onClose }: { onClose?: () => void }) {
  const workspaceId = useWorkspaceId()
  const createPipeline = useCreatePipeline()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [steps, setSteps] = useState<PipelineStep[]>([
    { order: 0, type: "source", config: { schema: "", table: "" } },
    { order: 1, type: "target", config: { schema: "", table: "", mode: "overwrite" } },
  ])

  const addStep = (index: number) => {
    const newStep: PipelineStep = { order: 0, type: "filter", config: { conditions: [] } }
    const updated = [...steps]
    updated.splice(index + 1, 0, newStep)
    setSteps(updated.map((s, i) => ({ ...s, order: i })))
  }

  const removeStep = (index: number) => {
    if (steps.length <= 2) return
    setSteps(steps.filter((_, i) => i !== index).map((s, i) => ({ ...s, order: i })))
  }

  const updateStepType = (index: number, type: string) => {
    setSteps(steps.map((s, i) => i === index ? { ...s, type, config: {} } : s))
  }

  const updateStepConfig = (index: number, config: Record<string, unknown>) => {
    setSteps(steps.map((s, i) => i === index ? { ...s, config } : s))
  }

  const handleCreate = () => {
    createPipeline.mutate(
      { workspaceId, name, description, steps },
      { onSuccess: () => onClose?.() }
    )
  }

  return (
    <div className="p-6 space-y-6 overflow-auto">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Pipeline Name</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="My ETL Pipeline" className="mt-1" />
        </div>
        <div>
          <label className="text-sm font-medium">Description</label>
          <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional description" className="mt-1" />
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-3">Pipeline Steps</h3>
        <div className="space-y-2">
          {steps.map((step, index) => (
            <div key={index}>
              <div className="border rounded-lg p-3 bg-white">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium text-muted-foreground w-6">#{index + 1}</span>
                  <Select value={step.type} onValueChange={(v) => updateStepType(index, v)}>
                    <SelectTrigger className="h-8 text-xs w-52">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STEP_TYPES.map((t) => (
                        <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {steps.length > 2 && (
                    <Button variant="ghost" size="icon" className="h-7 w-7 ml-auto" onClick={() => removeStep(index)}>
                      <Trash2 className="h-3.5 w-3.5 text-red-500" />
                    </Button>
                  )}
                </div>
                <StepConfig step={step} onChange={(config) => updateStepConfig(index, config)} />
              </div>
              {index < steps.length - 1 && (
                <div className="flex items-center justify-center py-1">
                  <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => addStep(index)}>
                    <Plus className="h-3 w-3 mr-1" /> Add step
                  </Button>
                  <ArrowDown className="h-3 w-3 text-muted-foreground ml-1" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={handleCreate} disabled={!name || createPipeline.isPending}>
          {createPipeline.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          Create Pipeline
        </Button>
      </div>
    </div>
  )
}
