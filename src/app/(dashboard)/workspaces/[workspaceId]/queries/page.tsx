import { Queries } from "@/components/queries/queries"

export default function QueriesPage() {
  return (
    <div className="flex flex-col h-screen bg-background">
      <main className="flex-1 overflow-auto p-6">
        <Queries />
      </main>
    </div>
  )
}
