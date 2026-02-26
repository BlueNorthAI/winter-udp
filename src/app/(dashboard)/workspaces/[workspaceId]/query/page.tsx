import { QueryHistory } from "@/components/query-history/query-history"

export default function QueryHistoryPage() {
  return (
    <div className="flex flex-col h-screen bg-background">
      <main className="flex-1 overflow-auto p-6">
        <QueryHistory />
      </main>
    </div>
  )
}
