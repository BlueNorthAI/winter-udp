import { Marketplace } from "@/components/marketplace/marketplace"

export default function MarketplacePage() {
  return (
    <div className="flex flex-col h-screen bg-background">
      <main className="flex-1 overflow-auto p-6">
        <Marketplace />
      </main>
    </div>
  )
}
