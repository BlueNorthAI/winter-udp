"use client"

import { useState } from "react"
import { Database, Table2, ArrowRight, BarChart3, TrendingUp, Store, Package, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id"
import { useGetKpis } from "@/features/dashboard-data/api/use-get-kpis"
import { useGetLayerData } from "@/features/dashboard-data/api/use-get-chart-data"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

const COLORS = ["#2563eb", "#16a34a", "#dc2626", "#f59e0b", "#8b5cf6", "#06b6d4", "#ec4899", "#84cc16"]

function KpiCard({ label, value, icon: Icon, color = "text-blue-600" }: { label: string; value: string | number; icon: React.ElementType; color?: string }) {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`h-4 w-4 ${color}`} />
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <p className="text-2xl font-bold">{typeof value === "number" ? value.toLocaleString() : value}</p>
    </div>
  )
}

export function Dashboards() {
  const workspaceId = useWorkspaceId()
  const { data: kpis, isLoading } = useGetKpis(workspaceId)
  const [activeLayer, setActiveLayer] = useState("0")
  const { data: layerData, isLoading: layerLoading } = useGetLayerData(workspaceId, activeLayer)

  const [setupLoading, setSetupLoading] = useState(false)

  const handleSetupViews = async () => {
    setSetupLoading(true)
    try {
      await fetch(`/api/dashboard-data/setup-views?workspaceId=${workspaceId}`, { method: "POST" })
    } finally {
      setSetupLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full p-6 overflow-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Retail Analytics Dashboard</h1>
          <p className="text-muted-foreground">Platform KPIs and retail analytics layers</p>
        </div>
        <Button variant="outline" onClick={handleSetupViews} disabled={setupLoading}>
          {setupLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          Setup Analytics Views
        </Button>
      </div>

      {/* Platform KPIs */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-3">Platform Overview</h2>
        {isLoading ? (
          <div className="flex items-center justify-center p-8 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading KPIs...
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <KpiCard
              label="Bronze Datasets"
              value={kpis?.datasets?.bronze?.count || 0}
              icon={Database}
              color="text-amber-600"
            />
            <KpiCard
              label="Silver Datasets"
              value={kpis?.datasets?.silver?.count || 0}
              icon={Database}
              color="text-gray-600"
            />
            <KpiCard
              label="Gold Datasets"
              value={kpis?.datasets?.gold?.count || 0}
              icon={Database}
              color="text-yellow-600"
            />
            <KpiCard
              label="Total Queries"
              value={parseInt(kpis?.queries?.total || "0", 10)}
              icon={Table2}
            />
            <KpiCard
              label="Active Pipelines"
              value={kpis?.pipelines?.active || 0}
              icon={ArrowRight}
              color="text-green-600"
            />
            <KpiCard
              label="Connections"
              value={kpis?.connections || 0}
              icon={Database}
              color="text-purple-600"
            />
            {kpis?.retailSchemaKpis && (
              <>
                <KpiCard
                  label="POS Transactions"
                  value={kpis.retailSchemaKpis.totalTransactions}
                  icon={BarChart3}
                  color="text-blue-600"
                />
                <KpiCard
                  label="Products"
                  value={kpis.retailSchemaKpis.totalProducts}
                  icon={Package}
                />
              </>
            )}
          </div>
        )}
      </div>

      {/* Analytics Layers */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Analytics Layers</h2>
        <Tabs value={activeLayer} onValueChange={setActiveLayer}>
          <TabsList className="mb-4">
            <TabsTrigger value="0">L0: Category Strategy</TabsTrigger>
            <TabsTrigger value="0.5">L0.5: Demand Intelligence</TabsTrigger>
            <TabsTrigger value="1">L1: Space Optimization</TabsTrigger>
            <TabsTrigger value="2">L2: Assortment</TabsTrigger>
            <TabsTrigger value="3">L3: Execution</TabsTrigger>
          </TabsList>

          <div className="border rounded-lg p-4">
            {layerLoading ? (
              <div className="flex items-center justify-center p-8 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading data...
              </div>
            ) : !layerData?.rows || layerData.rows.length === 0 ? (
              <div className="text-center p-8">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-40" />
                <p className="text-muted-foreground">No data available for this layer.</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Ingest retail data and click &quot;Setup Analytics Views&quot; to populate.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{layerData.layer}</h3>
                  <span className="text-sm text-muted-foreground">{layerData.rows.length} records</span>
                </div>

                {/* Chart for category data */}
                {activeLayer === "0" && layerData.rows.length > 0 && (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={layerData.rows.slice(0, 15)}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="category_l2" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={80} />
                        <YAxis tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Bar dataKey="revenue" fill="#2563eb" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* Data table */}
                <div className="border rounded-lg overflow-auto max-h-64">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50 sticky top-0">
                      <tr>
                        {Object.keys(layerData.rows[0]).map((key) => (
                          <th key={key} className="text-left p-2 text-xs font-medium whitespace-nowrap">{key}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {layerData.rows.slice(0, 50).map((row: Record<string, unknown>, i: number) => (
                        <tr key={i} className="border-t hover:bg-muted/30">
                          {Object.values(row).map((val, j) => (
                            <td key={j} className="p-2 text-xs font-mono whitespace-nowrap max-w-[200px] truncate">
                              {val != null ? String(val) : "-"}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </Tabs>
      </div>
    </div>
  )
}
