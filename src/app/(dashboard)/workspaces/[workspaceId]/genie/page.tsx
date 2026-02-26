import { Genie } from "@/components/genie/genie"

export default function GeniePage() {
  return (
    <div className="flex flex-col h-screen bg-background">
      <main className="flex-1 overflow-auto p-6">
        <Genie />
      </main>
    </div>
  )
}
