import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export function PoolsTab() {
  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button>Create pool</Button>
      </div>

      <div className="border rounded-md">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-3 font-medium">Name</th>
              <th className="text-left p-3 font-medium">Instance type</th>
              <th className="text-left p-3 font-medium">Min idle</th>
              <th className="text-left p-3 font-medium">Max capacity</th>
              <th className="text-left p-3 font-medium">Idle instances</th>
              <th className="text-left p-3 font-medium">Used instances</th>
            </tr>
          </thead>
        </table>
      </div>

      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-6">
          <Plus className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium mb-2">Create an instance pool</h3>
          <p className="text-muted-foreground">
            Your workspace has no pools.
            <a href="#" className="text-blue-600 hover:underline ml-1">
              Learn more about instance pools
            </a>
          </p>
        </div>
        <Button>Create pool</Button>
      </div>
    </div>
  )
}
