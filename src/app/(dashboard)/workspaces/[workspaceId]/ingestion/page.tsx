import { DataIngestion } from "@/components/data-ingestion/data-ingestion"

export default function DataIngestionPage() {
  return (
    <div className="flex flex-col h-screen bg-background">
      <main className="flex-1 overflow-auto p-6">
        <DataIngestion />
      </main>
    </div>
  )
}
