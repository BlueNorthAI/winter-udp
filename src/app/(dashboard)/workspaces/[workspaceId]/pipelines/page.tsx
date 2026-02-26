import { Pipelines } from   "@/components/pipelines/pipelines"

export default function PipelinesPage() {
  return (
    <div className="flex flex-col h-screen bg-background">
      <main className="flex-1 overflow-auto p-6">
        <Pipelines />
      </main>
    </div>
  )
}
