import { Dashboards } from "@/components/dashboard/dashboards"

export default function DashboardsPage() {
  return (
    <div className="flex flex-col h-screen bg-background">
      <main className="flex-1 overflow-auto p-6">
        <Dashboards />
      </main>
    </div>
  )
}
