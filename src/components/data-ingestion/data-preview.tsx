"use client"

interface DataPreviewProps {
  rows: Record<string, unknown>[]
  columns: string[]
}

export function DataPreview({ rows, columns }: DataPreviewProps) {
  if (rows.length === 0) return null

  return (
    <div>
      <h3 className="font-medium mb-2">Data Preview (first {Math.min(rows.length, 100)} rows)</h3>
      <div className="border rounded-lg overflow-auto max-h-64">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 sticky top-0">
            <tr>
              <th className="text-left p-2 text-xs font-medium text-muted-foreground">#</th>
              {columns.map((col) => (
                <th key={col} className="text-left p-2 text-xs font-medium whitespace-nowrap">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.slice(0, 100).map((row, i) => (
              <tr key={i} className="border-t hover:bg-muted/30">
                <td className="p-2 text-xs text-muted-foreground">{i + 1}</td>
                {columns.map((col) => (
                  <td key={col} className="p-2 text-xs font-mono whitespace-nowrap max-w-[200px] truncate">
                    {row[col] != null ? String(row[col]) : <span className="text-muted-foreground italic">null</span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
