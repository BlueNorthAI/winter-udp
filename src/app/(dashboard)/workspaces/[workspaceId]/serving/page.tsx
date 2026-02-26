import { Serving } from "@/components/serving/serving"

export default function ServingPage() {
  return (
    <div className="flex flex-col h-screen bg-background">
      <main className="flex-1 overflow-auto p-6">
        <Serving />
      </main>
    </div>
  )
}
