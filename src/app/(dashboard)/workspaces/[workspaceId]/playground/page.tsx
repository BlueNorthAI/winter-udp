import { Playground } from "@/components/playground/playground"

export default function PlaygroundPage() {
  return (
    <div className="flex flex-col h-screen bg-background">
      <main className="flex-1 overflow-auto p-6">
        <Playground />
      </main>
    </div>
  )
}
