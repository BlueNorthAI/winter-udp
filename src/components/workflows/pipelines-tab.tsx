import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function PipelinesTab() {
  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Filter by pipeline name" className="pl-8 bg-white" />
        </div>

        <div className="flex items-center gap-2">
          <Checkbox id="my-pipelines" />
          <label htmlFor="my-pipelines" className="text-sm">
            Only my pipelines
          </label>
        </div>

        <Select defaultValue="type">
          <SelectTrigger className="w-[120px] bg-white">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="type">Type</SelectItem>
            <SelectItem value="all">All Types</SelectItem>
          </SelectContent>
        </Select>

        <div className="ml-auto">
          <Button className="h-10">Create pipeline</Button>
        </div>
      </div>

      <div className="border rounded-md p-8 bg-white flex flex-col items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center mb-6">
          <div className="flex flex-col items-center mb-4">
            <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-2">
              <div className="h-8 w-8 bg-gray-300 rounded-md"></div>
            </div>
            <div className="h-2 w-32 bg-gray-200 rounded-full mb-1"></div>
            <div className="h-2 w-24 bg-gray-200 rounded-full mb-1"></div>
            <div className="h-2 w-28 bg-gray-200 rounded-full mb-1"></div>
            <div className="h-2 w-20 bg-gray-200 rounded-full"></div>
          </div>
          <h3 className="text-xl font-medium mb-1">No pipelines here</h3>
        </div>

        <div className="flex gap-4">
          <Button variant="outline" className="h-10">
            Create pipeline from sample data
          </Button>
          <p className="flex items-center">or</p>
          <Button variant="outline" className="h-10">
            Create pipeline from existing source code
          </Button>
        </div>
      </div>
    </div>
  )
}
