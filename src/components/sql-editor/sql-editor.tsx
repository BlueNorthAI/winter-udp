"use client"

import { useState } from "react"
import { Play, ChevronDown, Star, Plus, X, RefreshCw, Save, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id"
import { useExecuteQuery } from "@/features/sql/api/use-execute-query"
import { useSaveQuery } from "@/features/sql/api/use-save-query"
import { useGetSchemas } from "@/features/catalog/api/use-get-schemas"
import { CatalogBrowser } from "./catalog-browser"
import { QueryEditor } from "./query-editor"
import { ResultsPanel } from "./results-panel"

interface QueryTab {
  id: string
  name: string
  sql: string
}

export function SqlEditor() {
  const workspaceId = useWorkspaceId()
  const executeQuery = useExecuteQuery()
  const saveQuery = useSaveQuery()
  const { data: schemas } = useGetSchemas(workspaceId)

  const [tabs, setTabs] = useState<QueryTab[]>([
    { id: "1", name: "Query 1", sql: "SELECT * FROM retail.products LIMIT 100;" },
  ])
  const [activeTabId, setActiveTabId] = useState("1")
  const [results, setResults] = useState<{
    columns: string[]
    rows: Record<string, unknown>[]
    rowCount: number
    executionTimeMs: number
    command: string
  } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [saveName, setSaveName] = useState("")

  const activeTab = tabs.find((t) => t.id === activeTabId)
  const sqlQuery = activeTab?.sql || ""

  const setSqlQuery = (sql: string) => {
    setTabs((prev) => prev.map((t) => t.id === activeTabId ? { ...t, sql } : t))
  }

  const handleRunQuery = () => {
    setError(null)
    setResults(null)

    executeQuery.mutate(
      { workspaceId, sql: sqlQuery },
      {
        onSuccess: (data) => {
          setResults(data)
          setError(null)
        },
        onError: (err) => {
          setError(err.message)
          setResults(null)
        },
      }
    )
  }

  const handleSave = () => {
    if (!saveName) return
    saveQuery.mutate(
      { workspaceId, name: saveName, sql: sqlQuery },
      {
        onSuccess: () => {
          setShowSaveDialog(false)
          setSaveName("")
        },
      }
    )
  }

  const addTab = () => {
    const newId = String(Date.now())
    setTabs((prev) => [...prev, { id: newId, name: `Query ${prev.length + 1}`, sql: "" }])
    setActiveTabId(newId)
  }

  const closeTab = (id: string) => {
    if (tabs.length <= 1) return
    const newTabs = tabs.filter((t) => t.id !== id)
    setTabs(newTabs)
    if (activeTabId === id) setActiveTabId(newTabs[0].id)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Tabs */}
      <div className="flex border-b">
        <div className="flex-1 flex overflow-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTabId(tab.id)}
              className={`flex items-center gap-2 px-4 h-10 border-r text-sm whitespace-nowrap ${
                activeTabId === tab.id ? "bg-white font-medium" : "bg-muted/30 text-muted-foreground"
              }`}
            >
              {tab.name}
              {tabs.length > 1 && (
                <X
                  className="h-3 w-3 hover:text-red-500"
                  onClick={(e) => { e.stopPropagation(); closeTab(tab.id) }}
                />
              )}
            </button>
          ))}
        </div>
        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-none border-l" onClick={addTab}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left panel - Catalog browser */}
        <div className="w-64 border-r flex flex-col">
          <div className="flex items-center justify-between p-2 border-b">
            <span className="font-medium text-sm">Catalog</span>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <RefreshCw className="h-3.5 w-3.5" />
            </Button>
          </div>
          <div className="p-2">
            <Input type="text" placeholder="Search..." className="h-7 text-xs" />
          </div>
          <CatalogBrowser />
        </div>

        {/* Right panel - Query editor and results */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Query controls */}
          <div className="flex items-center p-2 border-b gap-2">
            <Button
              className="bg-blue-600 hover:bg-blue-700 flex items-center gap-1"
              onClick={handleRunQuery}
              disabled={executeQuery.isPending || !sqlQuery.trim()}
            >
              <Play className="h-4 w-4" />
              {executeQuery.isPending ? "Running..." : "Run"}
            </Button>

            <div className="flex items-center ml-auto gap-2">
              {showSaveDialog ? (
                <div className="flex items-center gap-2">
                  <Input
                    value={saveName}
                    onChange={(e) => setSaveName(e.target.value)}
                    placeholder="Query name..."
                    className="h-8 w-48 text-sm"
                    onKeyDown={(e) => e.key === "Enter" && handleSave()}
                  />
                  <Button variant="outline" className="h-8" onClick={handleSave} disabled={!saveName}>
                    Save
                  </Button>
                  <Button variant="ghost" className="h-8" onClick={() => setShowSaveDialog(false)}>
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button variant="outline" className="h-8" onClick={() => setShowSaveDialog(true)}>
                  <Save className="h-3.5 w-3.5 mr-1" /> Save
                </Button>
              )}
            </div>
          </div>

          {/* Query editor */}
          <div className="flex-1 overflow-hidden min-h-[200px]">
            <QueryEditor value={sqlQuery} onChange={setSqlQuery} onRun={handleRunQuery} />
          </div>

          {/* Results panel */}
          <div className="h-72 border-t">
            <ResultsPanel
              columns={results?.columns}
              rows={results?.rows}
              rowCount={results?.rowCount}
              executionTimeMs={results?.executionTimeMs}
              error={error}
              isLoading={executeQuery.isPending}
              command={results?.command}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
