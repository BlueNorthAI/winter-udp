import { Catalog } from "@/components/catalog/catalog"

export default function CatalogPage() {
  return (
    <div className="flex flex-col h-screen bg-background">
      <main className="flex-1 overflow-hidden">
        <Catalog />
      </main>
    </div>
  )
}
