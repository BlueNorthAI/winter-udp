import { Alerts } from "@/components/alerts/alerts"

export default function AlertsPage() {
  return (
    <div className="flex flex-col h-screen bg-background">
      <main className="flex-1 overflow-auto p-6">
        <Alerts />
      </main>
    </div>
  )
}
