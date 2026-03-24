"use client"

import { useState } from "react"
import { Download, Maximize2, X, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ResultsPanelProps {
  columns?: string[]
  rows?: Record<string, unknown>[]
  rowCount?: number
  executionTimeMs?: number
  error?: string | null
  isLoading?: boolean
  command?: string
}

export function ResultsPanel({
  columns = [],
  rows = [],
  rowCount = 0,
  executionTimeMs,
  error,
  isLoading,
  command,
}: ResultsPanelProps) {
  const handleExportCsv = () => {
    if (columns.length === 0 || rows.length === 0) return

    const header = columns.join(",")
    const csvRows = rows.map((row) =>
      columns.map((col) => {
        const val = row[col]
        if (val === null || val === undefined) return ""
        const str = String(val)
        return str.includes(",") || str.includes('"') || str.includes("\n")
          ? `"${str.replace(/"/g, '""')}"`
          : str
      }).join(",")
    )

    const csv = [header, ...csvRows].join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "query_results.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="h-full flex flex-col">
      {/* Status bar */}
      <div className="flex items-center px-3 py-1.5 border-b bg-muted/30 text-xs gap-3">
        {isLoading ? (
          <span className="flex items-center gap-1 text-blue-600">
            <Clock className="h-3 w-3 animate-pulse" /> Running query...
          </span>
        ) : error ? (
          <span className="flex items-center gap-1 text-red-600">
            <XCircle className="h-3 w-3" /> Error
          </span>
        ) : rows.length > 0 ? (
          <>
            <span className="flex items-center gap-1 text-green-600">
              <CheckCircle className="h-3 w-3" /> {command || "SELECT"}
            </span>
            <span className="text-muted-foreground">{rowCount.toLocaleString()} rows</span>
            {executionTimeMs != null && (
              <span className="text-muted-foreground">{executionTimeMs}ms</span>
            )}
            <Button variant="ghost" size="sm" className="h-6 ml-auto text-xs" onClick={handleExportCsv}>
              <Download className="h-3 w-3 mr-1" /> CSV
            </Button>
          </>
        ) : (
          <span className="text-muted-foreground">Run a query to see results (Ctrl+Enter)</span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {error ? (
          <div className="p-4">
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <pre className="whitespace-pre-wrap font-mono text-xs">{error}</pre>
            </div>
          </div>
        ) : rows.length > 0 ? (
          <table className="w-full text-sm">
            <thead className="bg-muted/50 sticky top-0">
              <tr>
                <th className="text-left px-3 py-1.5 text-xs font-medium text-muted-foreground border-r w-10">#</th>
                {columns.map((col) => (
                  <th key={col} className="text-left px-3 py-1.5 text-xs font-medium border-r whitespace-nowrap">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border-t hover:bg-muted/20">
                  <td className="px-3 py-1 text-xs text-muted-foreground border-r">{i + 1}</td>
                  {columns.map((col) => (
                    <td key={col} className="px-3 py-1 text-xs font-mono border-r max-w-[300px] truncate">
                      {row[col] != null ? String(row[col]) : <span className="text-muted-foreground italic">null</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : !isLoading ? (
          <div className="flex-1 flex items-center justify-center flex-col p-8 text-center h-full">
            <div className="h-16 w-16 bg-gray-100 rounded-md mx-auto flex items-center justify-center mb-4">
              <div className="h-8 w-8 border-2 border-dashed border-gray-300 rounded"></div>
            </div>
            <h3 className="text-lg font-medium mb-1">No results available</h3>
            <p className="text-muted-foreground text-sm">Run a query to show the results</p>
          </div>
        ) : null}
      </div>
    </div>
  )
}
