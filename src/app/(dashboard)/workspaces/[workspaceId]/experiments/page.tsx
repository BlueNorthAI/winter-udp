import { Experiments } from "@/components/experiments/experiments"

export default function ExperimentsPage() {
  return (
    <div className="flex flex-col h-screen bg-background">
      <main className="flex-1 overflow-auto p-6">
        <Experiments />
      </main>
    </div>
  )
}
