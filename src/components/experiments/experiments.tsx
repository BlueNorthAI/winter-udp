"use client"

import { useState } from "react"
import { Search, TrendingUp, BarChart3, Activity, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id"
import { useGetSchemas } from "@/features/catalog/api/use-get-schemas"
import { useRunAnalysis } from "@/features/ml/api/use-run-analysis"
import { useGetExperiments } from "@/features/ml/api/use-get-experiments"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart } from "recharts"

type View = "main" | "forecast" | "elasticity" | "describe"

export function Experiments() {
  const workspaceId = useWorkspaceId()
  const { data: experiments } = useGetExperiments(workspaceId)
  const runAnalysis = useRunAnalysis()
  const [view, setView] = useState<View>("main")
  const [results, setResults] = useState<Record<string, unknown> | null>(null)

  // Forecast config
  const [fSchema, setFSchema] = useState("")
  const [fTable, setFTable] = useState("")
  const [fDateCol, setFDateCol] = useState("")
  const [fValueCol, setFValueCol] = useState("")
  const [fHorizon, setFHorizon] = useState("12")

  // Elasticity config
  const [eSchema, setESchema] = useState("")
  const [eTable, setETable] = useState("")
  const [ePriceCol, setEPriceCol] = useState("")
  const [eQtyCol, setEQtyCol] = useState("")

  // Describe config
  const [dSchema, setDSchema] = useState("")
  const [dTable, setDTable] = useState("")

  const handleRunForecast = () => {
    runAnalysis.mutate(
      {
        type: "forecast",
        params: {
          workspaceId, schema: fSchema, table: fTable,
          dateColumn: fDateCol, valueColumn: fValueCol,
          horizonPeriods: parseInt(fHorizon, 10), seasonLength: 12,
        },
      },
      { onSuccess: (data) => setResults(data) }
    )
  }

  const handleRunElasticity = () => {
    runAnalysis.mutate(
      {
        type: "elasticity",
        params: { workspaceId, schema: eSchema, table: eTable, priceColumn: ePriceCol, quantityColumn: eQtyCol },
      },
      { onSuccess: (data) => setResults(data) }
    )
  }

  const handleRunDescribe = () => {
    runAnalysis.mutate(
      { type: "describe", params: { workspaceId, schema: dSchema, table: dTable } },
      { onSuccess: (data) => setResults(data) }
    )
  }

  if (view === "forecast") {
    return (
      <div className="flex flex-col h-full p-6">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" onClick={() => { setView("main"); setResults(null) }}>Back</Button>
          <h1 className="text-xl font-semibold">Demand Forecasting</h1>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div><label className="text-sm font-medium">Schema</label><Input value={fSchema} onChange={(e) => setFSchema(e.target.value)} placeholder="gold_workspace..." className="mt-1" /></div>
          <div><label className="text-sm font-medium">Table</label><Input value={fTable} onChange={(e) => setFTable(e.target.value)} placeholder="weekly_demand" className="mt-1" /></div>
          <div><label className="text-sm font-medium">Date Column</label><Input value={fDateCol} onChange={(e) => setFDateCol(e.target.value)} placeholder="week" className="mt-1" /></div>
          <div><label className="text-sm font-medium">Value Column</label><Input value={fValueCol} onChange={(e) => setFValueCol(e.target.value)} placeholder="total_units" className="mt-1" /></div>
          <div><label className="text-sm font-medium">Forecast Periods</label><Input value={fHorizon} onChange={(e) => setFHorizon(e.target.value)} placeholder="12" className="mt-1" /></div>
        </div>

        <Button className="bg-blue-600 hover:bg-blue-700 w-fit mb-6" onClick={handleRunForecast} disabled={runAnalysis.isPending}>
          {runAnalysis.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <TrendingUp className="h-4 w-4 mr-2" />}
          Run Forecast
        </Button>

        {results && !!(results as Record<string, unknown>).historical && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="border rounded-lg p-3">
                <p className="text-sm text-muted-foreground">Trend Slope</p>
                <p className="text-xl font-bold">{String(((results as Record<string, unknown>).trend as Record<string, number>)?.slope?.toFixed(2) ?? "")}</p>
              </div>
              <div className="border rounded-lg p-3">
                <p className="text-sm text-muted-foreground">MAPE</p>
                <p className="text-xl font-bold">{String(((results as Record<string, unknown>).mape as number)?.toFixed(1) ?? "")}%</p>
              </div>
              <div className="border rounded-lg p-3">
                <p className="text-sm text-muted-foreground">Forecast Periods</p>
                <p className="text-xl font-bold">{String(((results as Record<string, unknown>).forecast as unknown[])?.length ?? 0)}</p>
              </div>
            </div>
            <div className="border rounded-lg p-4 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={[
                  ...((results as Record<string, unknown>).historical as { period: string; value: number }[]).map((h) => ({ period: h.period, actual: h.value })),
                  ...((results as Record<string, unknown>).forecast as { period: string; value: number; lower: number; upper: number }[]).map((f) => ({
                    period: f.period, forecast: f.value, lower: f.lower, upper: f.upper,
                  })),
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="actual" stroke="#2563eb" strokeWidth={2} dot={false} />
                  <Area type="monotone" dataKey="upper" stroke="none" fill="#93c5fd" fillOpacity={0.3} />
                  <Area type="monotone" dataKey="lower" stroke="none" fill="#93c5fd" fillOpacity={0.3} />
                  <Line type="monotone" dataKey="forecast" stroke="#dc2626" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {runAnalysis.isError && (
          <div className="text-red-600 text-sm mt-2">{runAnalysis.error.message}</div>
        )}
      </div>
    )
  }

  if (view === "elasticity") {
    return (
      <div className="flex flex-col h-full p-6">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" onClick={() => { setView("main"); setResults(null) }}>Back</Button>
          <h1 className="text-xl font-semibold">Price Elasticity Estimation</h1>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div><label className="text-sm font-medium">Schema</label><Input value={eSchema} onChange={(e) => setESchema(e.target.value)} placeholder="retail" className="mt-1" /></div>
          <div><label className="text-sm font-medium">Table</label><Input value={eTable} onChange={(e) => setETable(e.target.value)} placeholder="pricing" className="mt-1" /></div>
          <div><label className="text-sm font-medium">Price Column</label><Input value={ePriceCol} onChange={(e) => setEPriceCol(e.target.value)} placeholder="regular_price" className="mt-1" /></div>
          <div><label className="text-sm font-medium">Quantity Column</label><Input value={eQtyCol} onChange={(e) => setEQtyCol(e.target.value)} placeholder="volume_sales" className="mt-1" /></div>
        </div>

        <Button className="bg-blue-600 hover:bg-blue-700 w-fit mb-6" onClick={handleRunElasticity} disabled={runAnalysis.isPending}>
          {runAnalysis.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Activity className="h-4 w-4 mr-2" />}
          Calculate Elasticity
        </Button>

        {results && (results as Record<string, unknown>).elasticity !== undefined && (
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-3">
              <div className="border rounded-lg p-3">
                <p className="text-sm text-muted-foreground">Elasticity</p>
                <p className="text-2xl font-bold">{((results as Record<string, unknown>).elasticity as number)?.toFixed(3)}</p>
              </div>
              <div className="border rounded-lg p-3">
                <p className="text-sm text-muted-foreground">R-Squared</p>
                <p className="text-2xl font-bold">{((results as Record<string, unknown>).rSquared as number)?.toFixed(3)}</p>
              </div>
              <div className="border rounded-lg p-3">
                <p className="text-sm text-muted-foreground">Sample Size</p>
                <p className="text-2xl font-bold">{(results as Record<string, unknown>).sampleSize as number}</p>
              </div>
              <div className="border rounded-lg p-3 col-span-1">
                <p className="text-sm text-muted-foreground">Interpretation</p>
                <p className="text-sm font-medium mt-1">{(results as Record<string, unknown>).interpretation as string}</p>
              </div>
            </div>
          </div>
        )}

        {runAnalysis.isError && (
          <div className="text-red-600 text-sm mt-2">{runAnalysis.error.message}</div>
        )}
      </div>
    )
  }

  if (view === "describe") {
    return (
      <div className="flex flex-col h-full p-6">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" onClick={() => { setView("main"); setResults(null) }}>Back</Button>
          <h1 className="text-xl font-semibold">Descriptive Statistics</h1>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div><label className="text-sm font-medium">Schema</label><Input value={dSchema} onChange={(e) => setDSchema(e.target.value)} placeholder="bronze_workspace..." className="mt-1" /></div>
          <div><label className="text-sm font-medium">Table</label><Input value={dTable} onChange={(e) => setDTable(e.target.value)} placeholder="pos_data" className="mt-1" /></div>
        </div>

        <Button className="bg-blue-600 hover:bg-blue-700 w-fit mb-6" onClick={handleRunDescribe} disabled={runAnalysis.isPending}>
          {runAnalysis.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <BarChart3 className="h-4 w-4 mr-2" />}
          Run Analysis
        </Button>

        {results && Array.isArray(results) && (
          <div className="border rounded-lg overflow-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-2">Column</th>
                  <th className="text-right p-2">Count</th>
                  <th className="text-right p-2">Mean</th>
                  <th className="text-right p-2">Median</th>
                  <th className="text-right p-2">Std Dev</th>
                  <th className="text-right p-2">Min</th>
                  <th className="text-right p-2">Max</th>
                  <th className="text-right p-2">Q1</th>
                  <th className="text-right p-2">Q3</th>
                </tr>
              </thead>
              <tbody>
                {(results as Record<string, unknown>[]).map((col) => (
                  <tr key={col.column as string} className="border-t">
                    <td className="p-2 font-mono text-xs font-medium">{col.column as string}</td>
                    {col.stats ? (
                      <>
                        <td className="p-2 text-right text-xs">{((col.stats as Record<string, number>).count)?.toLocaleString()}</td>
                        <td className="p-2 text-right text-xs">{((col.stats as Record<string, number>).mean)?.toFixed(2)}</td>
                        <td className="p-2 text-right text-xs">{((col.stats as Record<string, number>).median)?.toFixed(2)}</td>
                        <td className="p-2 text-right text-xs">{((col.stats as Record<string, number>).standardDeviation)?.toFixed(2)}</td>
                        <td className="p-2 text-right text-xs">{((col.stats as Record<string, number>).min)?.toFixed(2)}</td>
                        <td className="p-2 text-right text-xs">{((col.stats as Record<string, number>).max)?.toFixed(2)}</td>
                        <td className="p-2 text-right text-xs">{((col.stats as Record<string, number>).q1)?.toFixed(2)}</td>
                        <td className="p-2 text-right text-xs">{((col.stats as Record<string, number>).q3)?.toFixed(2)}</td>
                      </>
                    ) : (
                      <td colSpan={8} className="p-2 text-xs text-muted-foreground">No numeric data</td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {runAnalysis.isError && (
          <div className="text-red-600 text-sm mt-2">{runAnalysis.error.message}</div>
        )}
      </div>
    )
  }

  // Main view
  return (
    <div className="flex flex-col h-full p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-2">ML Experiments</h1>
        <p className="text-muted-foreground">Run analytics and machine learning experiments on your data</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <button
          onClick={() => setView("forecast")}
          className="flex flex-col items-start gap-3 p-5 border rounded-lg hover:border-blue-400 hover:bg-blue-50/50 transition-all text-left"
        >
          <div className="h-10 w-10 bg-blue-500 rounded-lg flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-medium">Demand Forecasting</h3>
            <p className="text-sm text-muted-foreground">Time-series forecasting with trend decomposition and seasonality</p>
          </div>
        </button>

        <button
          onClick={() => setView("elasticity")}
          className="flex flex-col items-start gap-3 p-5 border rounded-lg hover:border-green-400 hover:bg-green-50/50 transition-all text-left"
        >
          <div className="h-10 w-10 bg-green-500 rounded-lg flex items-center justify-center">
            <Activity className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-medium">Price Elasticity</h3>
            <p className="text-sm text-muted-foreground">Log-log regression to estimate price sensitivity by SKU or category</p>
          </div>
        </button>

        <button
          onClick={() => setView("describe")}
          className="flex flex-col items-start gap-3 p-5 border rounded-lg hover:border-purple-400 hover:bg-purple-50/50 transition-all text-left"
        >
          <div className="h-10 w-10 bg-purple-500 rounded-lg flex items-center justify-center">
            <BarChart3 className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-medium">Descriptive Statistics</h3>
            <p className="text-sm text-muted-foreground">Compute mean, median, std dev, quartiles for numeric columns</p>
          </div>
        </button>
      </div>

      {/* Experiment history */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Experiment History</h2>
        <div className="border rounded-lg overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-3 font-medium">Name</th>
                <th className="text-left p-3 font-medium">Status</th>
                <th className="text-left p-3 font-medium">Created</th>
              </tr>
            </thead>
            <tbody>
              {!experiments || experiments.length === 0 ? (
                <tr><td colSpan={3} className="text-center p-8 text-muted-foreground">No experiments yet. Run an analysis to get started.</td></tr>
              ) : (
                experiments.map((exp: Record<string, unknown>) => (
                  <tr key={exp.id as string} className="border-t hover:bg-muted/30">
                    <td className="p-3">{exp.name as string}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-xs bg-green-100 text-green-800">{exp.status as string}</span>
                    </td>
                    <td className="p-3 text-xs text-muted-foreground">
                      {exp.created_at ? new Date(exp.created_at as string).toLocaleString() : "-"}
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
