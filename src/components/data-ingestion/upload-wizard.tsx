"use client"

import { useState, useCallback } from "react"
import { Upload, FileSpreadsheet, Check, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useUploadFile } from "@/features/ingestion/api/use-upload-file"
import { useConfirmUpload } from "@/features/ingestion/api/use-confirm-upload"
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id"
import { DataPreview } from "./data-preview"

type Step = "upload" | "preview" | "configure" | "success"

interface InferredColumn {
  name: string
  type: string
  nullable: boolean
  sampleValues: string[]
}

export function UploadWizard({ onClose }: { onClose?: () => void }) {
  const workspaceId = useWorkspaceId()
  const [step, setStep] = useState<Step>("upload")
  const [fileName, setFileName] = useState("")
  const [tableName, setTableName] = useState("")
  const [medallionLayer, setMedallionLayer] = useState<"bronze" | "silver" | "gold">("bronze")
  const [columns, setColumns] = useState<InferredColumn[]>([])
  const [previewRows, setPreviewRows] = useState<Record<string, unknown>[]>([])
  const [rawData, setRawData] = useState<Record<string, unknown>[]>([])
  const [rowCount, setRowCount] = useState(0)
  const [result, setResult] = useState<{ schema: string; table: string; rowsInserted: number } | null>(null)

  const uploadMutation = useUploadFile()
  const confirmMutation = useConfirmUpload()

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const handleFile = async (file: File) => {
    setFileName(file.name)
    const baseName = file.name.replace(/\.(csv|xlsx|xls)$/i, "").replace(/[^a-zA-Z0-9]/g, "_").toLowerCase()
    setTableName(baseName)

    uploadMutation.mutate(file, {
      onSuccess: (data) => {
        setColumns(data.columns)
        setPreviewRows(data.previewRows)
        setRawData(data.rawData)
        setRowCount(data.rowCount)
        setStep("preview")
      },
    })
  }

  const handleColumnTypeChange = (index: number, newType: string) => {
    setColumns((prev) => prev.map((col, i) => i === index ? { ...col, type: newType } : col))
  }

  const handleConfirm = () => {
    confirmMutation.mutate(
      {
        workspaceId,
        tableName,
        columns: columns.map((c) => ({ name: c.name, type: c.type, nullable: c.nullable })),
        data: rawData,
        medallionLayer,
      },
      {
        onSuccess: (data) => {
          setResult(data)
          setStep("success")
        },
      }
    )
  }

  if (step === "upload") {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h2 className="text-xl font-semibold">Upload Data File</h2>
          <p className="text-sm text-muted-foreground mt-1">Upload a CSV or Excel file to ingest into the datalake</p>
        </div>

        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed rounded-lg p-12 text-center hover:border-blue-400 transition-colors cursor-pointer"
          onClick={() => document.getElementById("file-input")?.click()}
        >
          {uploadMutation.isPending ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
              <p className="text-sm text-muted-foreground">Parsing {fileName}...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <Upload className="h-12 w-12 text-muted-foreground" />
              <p className="font-medium">Drag and drop a file here, or click to browse</p>
              <p className="text-sm text-muted-foreground">Supports .csv, .xlsx, .xls files (up to 50MB)</p>
            </div>
          )}
          <input
            id="file-input"
            type="file"
            accept=".csv,.xlsx,.xls"
            className="hidden"
            onChange={handleFileSelect}
          />
        </div>

        {uploadMutation.isError && (
          <div className="flex items-center gap-2 text-red-600 text-sm">
            <AlertCircle className="h-4 w-4" />
            {uploadMutation.error.message}
          </div>
        )}
      </div>
    )
  }

  if (step === "preview") {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Preview: {fileName}</h2>
            <p className="text-sm text-muted-foreground">{rowCount.toLocaleString()} rows, {columns.length} columns</p>
          </div>
          <Button variant="outline" onClick={() => setStep("upload")}>Upload Different File</Button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Table Name</label>
            <Input value={tableName} onChange={(e) => setTableName(e.target.value)} className="mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium">Medallion Layer</label>
            <Select value={medallionLayer} onValueChange={(v) => setMedallionLayer(v as "bronze" | "silver" | "gold")}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bronze">Bronze (Raw)</SelectItem>
                <SelectItem value="silver">Silver (Cleaned)</SelectItem>
                <SelectItem value="gold">Gold (Analytics)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-2">Column Schema</h3>
          <div className="border rounded-lg overflow-auto max-h-48">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-2">Column</th>
                  <th className="text-left p-2">Inferred Type</th>
                  <th className="text-left p-2">Nullable</th>
                  <th className="text-left p-2">Samples</th>
                </tr>
              </thead>
              <tbody>
                {columns.map((col, i) => (
                  <tr key={col.name} className="border-t">
                    <td className="p-2 font-mono text-xs">{col.name}</td>
                    <td className="p-2">
                      <Select value={col.type} onValueChange={(v) => handleColumnTypeChange(i, v)}>
                        <SelectTrigger className="h-7 text-xs w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {["TEXT", "INTEGER", "NUMERIC", "BOOLEAN", "DATE", "TIMESTAMP"].map((t) => (
                            <SelectItem key={t} value={t}>{t}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="p-2 text-xs">{col.nullable ? "Yes" : "No"}</td>
                    <td className="p-2 text-xs text-muted-foreground truncate max-w-[200px]">
                      {col.sampleValues.slice(0, 3).join(", ")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <DataPreview rows={previewRows} columns={columns.map((c) => c.name)} />

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setStep("upload")}>Back</Button>
          <Button onClick={handleConfirm} disabled={confirmMutation.isPending || !tableName}>
            {confirmMutation.isPending ? (
              <><Loader2 className="h-4 w-4 animate-spin mr-2" />Ingesting...</>
            ) : (
              <><FileSpreadsheet className="h-4 w-4 mr-2" />Ingest {rowCount.toLocaleString()} rows</>
            )}
          </Button>
        </div>

        {confirmMutation.isError && (
          <div className="flex items-center gap-2 text-red-600 text-sm">
            <AlertCircle className="h-4 w-4" />
            {confirmMutation.error.message}
          </div>
        )}
      </div>
    )
  }

  if (step === "success" && result) {
    return (
      <div className="p-6 text-center space-y-4">
        <div className="flex justify-center">
          <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
            <Check className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <h2 className="text-xl font-semibold">Data Ingested Successfully</h2>
        <div className="text-sm text-muted-foreground space-y-1">
          <p>Table: <span className="font-mono">{result.schema}.{result.table}</span></p>
          <p>Rows inserted: {result.rowsInserted.toLocaleString()}</p>
        </div>
        <div className="flex justify-center gap-2">
          <Button variant="outline" onClick={() => { setStep("upload"); setResult(null) }}>Upload Another</Button>
          {onClose && <Button onClick={onClose}>Done</Button>}
        </div>
      </div>
    )
  }

  return null
}
