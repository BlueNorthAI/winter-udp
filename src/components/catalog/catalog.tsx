"use client"

import { useState } from "react"
import { RefreshCw, Database, Table2, Columns3, ChevronRight, ChevronDown, Search, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id"
import { useGetSchemas } from "@/features/catalog/api/use-get-schemas"
import { useGetTables } from "@/features/catalog/api/use-get-tables"
import { useGetColumns } from "@/features/catalog/api/use-get-columns"
import { useGetTableStats } from "@/features/catalog/api/use-get-table-stats"

function LayerBadge({ schema }: { schema: string }) {
  if (schema.startsWith("bronze_")) return <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-100 text-amber-800">Bronze</span>
  if (schema.startsWith("silver_")) return <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-200 text-gray-700">Silver</span>
  if (schema.startsWith("gold_")) return <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-yellow-100 text-yellow-800">Gold</span>
  if (schema === "retail") return <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-100 text-blue-800">Retail</span>
  return <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-600">{schema}</span>
}

export function Catalog() {
  const workspaceId = useWorkspaceId()
  const { data: schemas, isLoading: schemasLoading, refetch } = useGetSchemas(workspaceId)
  const [selectedSchema, setSelectedSchema] = useState<string>("")
  const [selectedTable, setSelectedTable] = useState<string>("")
  const [expandedSchemas, setExpandedSchemas] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState("")

  const { data: tables } = useGetTables(selectedSchema || expandedSchemas.values().next().value || "")
  const { data: columns } = useGetColumns(selectedSchema, selectedTable)
  const { data: tableStats } = useGetTableStats(selectedSchema, selectedTable)

  const toggleSchema = (schema: string) => {
    const next = new Set(expandedSchemas)
    if (next.has(schema)) {
      next.delete(schema)
    } else {
      next.add(schema)
      setSelectedSchema(schema)
    }
    setExpandedSchemas(next)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center p-3 border-b">
        <h1 className="text-lg font-semibold">Data Catalog</h1>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => refetch()}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex h-full overflow-hidden">
        {/* Schema tree */}
        <div className="w-72 border-r p-3 overflow-auto">
          <div className="relative mb-3">
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-8 text-sm"
            />
            <Search className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
          </div>

          {schemasLoading ? (
            <p className="text-sm text-muted-foreground p-2">Loading schemas...</p>
          ) : !schemas || schemas.length === 0 ? (
            <div className="text-sm text-muted-foreground p-2 text-center">
              <Database className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No schemas found.</p>
              <p className="text-xs mt-1">Ingest data to create schemas.</p>
            </div>
          ) : (
            <div className="space-y-1">
              {schemas.filter((s: string) => s.toLowerCase().includes(searchQuery.toLowerCase())).map((schema: string) => (
                <SchemaNode
                  key={schema}
                  schema={schema}
                  isExpanded={expandedSchemas.has(schema)}
                  selectedTable={selectedSchema === schema ? selectedTable : ""}
                  onToggle={() => toggleSchema(schema)}
                  onSelectTable={(table) => { setSelectedSchema(schema); setSelectedTable(table) }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Detail panel */}
        <div className="flex-1 p-4 overflow-auto">
          {!selectedTable ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <Table2 className="h-12 w-12 mb-3 opacity-40" />
              <p>Select a table to view its details</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Table2 className="h-5 w-5" />
                  {selectedSchema}.{selectedTable}
                </h2>
                {tableStats && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {tableStats.totalRows?.toLocaleString()} rows, {tableStats.columns?.length} columns
                  </p>
                )}
              </div>

              {/* Column details */}
              <div>
                <h3 className="font-medium mb-2 flex items-center gap-2">
                  <Columns3 className="h-4 w-4" /> Columns
                </h3>
                <div className="border rounded-lg overflow-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left p-2">#</th>
                        <th className="text-left p-2">Column</th>
                        <th className="text-left p-2">Type</th>
                        <th className="text-left p-2">Nullable</th>
                        <th className="text-right p-2">Distinct</th>
                        <th className="text-right p-2">Nulls</th>
                      </tr>
                    </thead>
                    <tbody>
                      {columns?.map((col: Record<string, unknown>, i: number) => {
                        const stat = tableStats?.columns?.find((s: Record<string, unknown>) => s.column_name === col.column_name)
                        return (
                          <tr key={col.column_name as string} className="border-t">
                            <td className="p-2 text-muted-foreground">{col.ordinal_position as number}</td>
                            <td className="p-2 font-mono text-xs font-medium">{col.column_name as string}</td>
                            <td className="p-2 text-xs">{col.data_type as string}</td>
                            <td className="p-2 text-xs">{col.is_nullable === "YES" ? "Yes" : "No"}</td>
                            <td className="p-2 text-right text-xs">{stat?.distinct_count?.toLocaleString() ?? "-"}</td>
                            <td className="p-2 text-right text-xs">{stat?.null_count?.toLocaleString() ?? "-"}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Stats summary */}
              {tableStats?.columns && (
                <div>
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" /> Data Profile
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="border rounded-lg p-3">
                      <p className="text-2xl font-bold">{tableStats.totalRows?.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Total Rows</p>
                    </div>
                    <div className="border rounded-lg p-3">
                      <p className="text-2xl font-bold">{tableStats.columns.length}</p>
                      <p className="text-xs text-muted-foreground">Columns</p>
                    </div>
                    <div className="border rounded-lg p-3">
                      <p className="text-2xl font-bold">
                        {tableStats.columns.filter((c: Record<string, unknown>) => (c.null_count as number) > 0).length}
                      </p>
                      <p className="text-xs text-muted-foreground">Columns with Nulls</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function SchemaNode({
  schema,
  isExpanded,
  selectedTable,
  onToggle,
  onSelectTable,
}: {
  schema: string
  isExpanded: boolean
  selectedTable: string
  onToggle: () => void
  onSelectTable: (table: string) => void
}) {
  const { data: tables } = useGetTables(isExpanded ? schema : "")

  return (
    <div>
      <button
        onClick={onToggle}
        className="flex items-center gap-1.5 w-full px-2 py-1.5 hover:bg-muted/50 rounded text-sm"
      >
        {isExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
        <Database className="h-3.5 w-3.5 text-blue-600" />
        <span className="truncate flex-1 text-left">{schema}</span>
        <LayerBadge schema={schema} />
      </button>
      {isExpanded && tables && (
        <div className="ml-6 space-y-0.5">
          {tables.map((table: Record<string, unknown>) => (
            <button
              key={table.table_name as string}
              onClick={() => onSelectTable(table.table_name as string)}
              className={`flex items-center gap-1.5 w-full px-2 py-1 hover:bg-muted/50 rounded text-xs ${
                selectedTable === table.table_name ? "bg-blue-50 text-blue-700" : ""
              }`}
            >
              <Table2 className="h-3 w-3" />
              <span className="truncate flex-1 text-left">{table.table_name as string}</span>
              <span className="text-muted-foreground text-[10px]">
                {table.row_count != null ? Number(table.row_count).toLocaleString() : ""}
              </span>
            </button>
          ))}
          {tables.length === 0 && (
            <p className="text-xs text-muted-foreground px-2 py-1">No tables</p>
          )}
        </div>
      )}
    </div>
  )
}
