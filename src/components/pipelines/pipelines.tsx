"use client"

import { useState } from "react"
import { Search, Plus, Play, Clock, CheckCircle, XCircle, Loader2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id"
import { useGetPipelines } from "@/features/pipelines/api/use-get-pipelines"
import { useRunPipeline } from "@/features/pipelines/api/use-run-pipeline"
import { PipelineBuilder } from "./pipeline-builder"

export function Pipelines() {
  const workspaceId = useWorkspaceId()
  const { data: pipelines, isLoading } = useGetPipelines(workspaceId)
  const runPipeline = useRunPipeline()
  const [searchQuery, setSearchQuery] = useState("")
  const [showBuilder, setShowBuilder] = useState(false)
  const [runningId, setRunningId] = useState<string | null>(null)

  const handleRun = (pipelineId: string) => {
    setRunningId(pipelineId)
    runPipeline.mutate(pipelineId, {
      onSettled: () => setRunningId(null),
    })
  }

  if (showBuilder) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-2 p-4 border-b">
          <Button variant="ghost" onClick={() => setShowBuilder(false)}>Back</Button>
          <h1 className="text-lg font-semibold">Create Pipeline</h1>
        </div>
        <PipelineBuilder onClose={() => setShowBuilder(false)} />
      </div>
    )
  }

  const filteredPipelines = (pipelines || []).filter((p: Record<string, unknown>) =>
    (p.name as string).toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex flex-col h-full p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Pipelines</h1>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setShowBuilder(true)}>
          <Plus className="h-4 w-4 mr-1" /> Create Pipeline
        </Button>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-md">
          <Input
            type="search"
            placeholder="Filter by pipeline name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      <div className="border rounded-lg overflow-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-3 font-medium">Name</th>
              <th className="text-left p-3 font-medium">Steps</th>
              <th className="text-left p-3 font-medium">Schedule</th>
              <th className="text-left p-3 font-medium">Status</th>
              <th className="text-left p-3 font-medium">Last Run</th>
              <th className="text-right p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={6} className="text-center p-8 text-muted-foreground">Loading pipelines...</td></tr>
            ) : filteredPipelines.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center p-8">
                  <div className="flex flex-col items-center gap-2">
                    <ArrowRight className="h-10 w-10 text-muted-foreground opacity-40" />
                    <p className="text-muted-foreground">No pipelines yet. Create one to start transforming data.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredPipelines.map((pipeline: Record<string, unknown>) => {
                const steps = typeof pipeline.steps === "string"
                  ? JSON.parse(pipeline.steps as string)
                  : pipeline.steps
                return (
                  <tr key={pipeline.id as string} className="border-t hover:bg-muted/30">
                    <td className="p-3 font-medium">{pipeline.name as string}</td>
                    <td className="p-3 text-muted-foreground">{Array.isArray(steps) ? steps.length : 0} steps</td>
                    <td className="p-3 text-xs font-mono">{(pipeline.schedule as string) || "Manual"}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        pipeline.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
                      }`}>
                        {pipeline.status as string}
                      </span>
                    </td>
                    <td className="p-3 text-xs">
                      {pipeline.last_run_at ? (
                        <span className="flex items-center gap-1">
                          {pipeline.last_run_status === "completed" ? (
                            <CheckCircle className="h-3 w-3 text-green-600" />
                          ) : (
                            <XCircle className="h-3 w-3 text-red-600" />
                          )}
                          {new Date(pipeline.last_run_at as string).toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">Never</span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7"
                        onClick={() => handleRun(pipeline.id as string)}
                        disabled={runningId === pipeline.id}
                      >
                        {runningId === pipeline.id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <><Play className="h-3 w-3 mr-1" /> Run</>
                        )}
                      </Button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
