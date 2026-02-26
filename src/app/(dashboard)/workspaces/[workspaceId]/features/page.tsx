import { Features } from "@/components/features/features"

export default function FeaturesPage() {
  return (
    <div className="flex flex-col h-screen bg-background">
      <main className="flex-1 overflow-auto p-6">
        <Features />
      </main>
    </div>
  )
}
