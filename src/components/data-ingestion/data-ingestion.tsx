"use client"

import { useState } from "react"
import { Search, Database, Upload, FileSpreadsheet, Table2, Plug } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id"
import { useGetDatasets } from "@/features/ingestion/api/use-get-datasets"
import { UploadWizard } from "./upload-wizard"
import { ConnectionForm } from "./connection-form"

export function DataIngestion() {
  const workspaceId = useWorkspaceId()
  const { data: datasets, isLoading } = useGetDatasets(workspaceId)
  const [activeView, setActiveView] = useState<"main" | "upload" | "connect">("main")

  if (activeView === "upload") {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-2 p-4 border-b">
          <Button variant="ghost" onClick={() => setActiveView("main")}>Back</Button>
          <h1 className="text-lg font-semibold">Upload Data</h1>
        </div>
        <UploadWizard onClose={() => setActiveView("main")} />
      </div>
    )
  }

  if (activeView === "connect") {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-2 p-4 border-b">
          <Button variant="ghost" onClick={() => setActiveView("main")}>Back</Button>
          <h1 className="text-lg font-semibold">Connect Database</h1>
        </div>
        <ConnectionForm onSuccess={() => setActiveView("main")} />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-2">Data Ingestion</h1>
        <p className="text-muted-foreground">Upload files or connect to external databases to populate your datalake</p>
      </div>

      {/* Action cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <button
          onClick={() => setActiveView("upload")}
          className="flex flex-col items-start gap-3 p-5 border rounded-lg hover:border-blue-400 hover:bg-blue-50/50 transition-all text-left"
        >
          <div className="h-10 w-10 bg-blue-500 rounded-lg flex items-center justify-center">
            <FileSpreadsheet className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-medium">Upload CSV / Excel</h3>
            <p className="text-sm text-muted-foreground">Parse and ingest tabular data files into the Bronze layer</p>
          </div>
        </button>

        <button
          onClick={() => setActiveView("connect")}
          className="flex flex-col items-start gap-3 p-5 border rounded-lg hover:border-green-400 hover:bg-green-50/50 transition-all text-left"
        >
          <div className="h-10 w-10 bg-green-500 rounded-lg flex items-center justify-center">
            <Plug className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-medium">Connect PostgreSQL</h3>
            <p className="text-sm text-muted-foreground">Connect to an external PostgreSQL database and import tables</p>
          </div>
        </button>

        <div className="flex flex-col items-start gap-3 p-5 border rounded-lg opacity-50">
          <div className="h-10 w-10 bg-purple-500 rounded-lg flex items-center justify-center">
            <Upload className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-medium">API / Webhook</h3>
            <p className="text-sm text-muted-foreground">Stream data via API endpoints (coming soon)</p>
          </div>
        </div>
      </div>

      {/* Datasets table */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Ingested Datasets</h2>
          <div className="flex items-center border rounded-md w-64">
            <Input
              type="search"
              placeholder="Search datasets..."
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-8"
            />
            <div className="px-2">
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </div>

        <div className="border rounded-lg overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-3 font-medium">Name</th>
                <th className="text-left p-3 font-medium">Layer</th>
                <th className="text-left p-3 font-medium">Source</th>
                <th className="text-left p-3 font-medium">Schema.Table</th>
                <th className="text-right p-3 font-medium">Rows</th>
                <th className="text-right p-3 font-medium">Columns</th>
                <th className="text-left p-3 font-medium">Created</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={7} className="text-center p-8 text-muted-foreground">Loading datasets...</td></tr>
              ) : !datasets || datasets.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center p-8">
                    <div className="flex flex-col items-center gap-2">
                      <Table2 className="h-10 w-10 text-muted-foreground" />
                      <p className="text-muted-foreground">No datasets yet. Upload a file or connect a database to get started.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                datasets.map((ds: Record<string, unknown>) => (
                  <tr key={ds.id as string} className="border-t hover:bg-muted/30">
                    <td className="p-3 font-medium">{ds.name as string}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        ds.medallion_layer === "bronze" ? "bg-amber-100 text-amber-800" :
                        ds.medallion_layer === "silver" ? "bg-gray-100 text-gray-800" :
                        "bg-yellow-100 text-yellow-800"
                      }`}>
                        {(ds.medallion_layer as string)}
                      </span>
                    </td>
                    <td className="p-3 text-muted-foreground">{ds.source_type as string}</td>
                    <td className="p-3 font-mono text-xs">{ds.schema_name as string}.{ds.table_name as string}</td>
                    <td className="p-3 text-right">{ds.row_count != null ? Number(ds.row_count).toLocaleString() : "-"}</td>
                    <td className="p-3 text-right">{ds.column_count != null ? String(ds.column_count) : "-"}</td>
                    <td className="p-3 text-muted-foreground text-xs">
                      {ds.created_at ? new Date(ds.created_at as string).toLocaleDateString() : "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
