import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

export function VectorSearchTab() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-6">
        <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-medium mb-2">No endpoints exist. Create an Endpoint.</h3>
      </div>
      <p className="max-w-2xl text-muted-foreground mb-8">
        bnai Vector Search is serverless similarity search engine that allows you to store a vector representation
        of your data, including metadata, in a vector database.
        <a href="#" className="text-blue-600 hover:underline ml-1">
          Learn more...
        </a>
      </p>
      <Button>Create an Endpoint</Button>
    </div>
  )
}
