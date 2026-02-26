import { Models } from "@/components/models/models"

export default function ModelsPage() {
  return (
    <div className="flex flex-col h-screen bg-background">
      <main className="flex-1 overflow-auto p-6">
        <Models />
      </main>
    </div>
  )
}
