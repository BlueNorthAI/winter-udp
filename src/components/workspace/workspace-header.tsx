import { Button } from "@/components/ui/button"
import { Star, MoreVertical, MessageSquare, ChevronDown } from "lucide-react"

export function WorkspaceHeader() {
  return (
    <header className="border-b p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-semibold">bluenorthai@outlook.com</h1>
          <Button variant="ghost" size="icon">
            <Star className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="flex items-center space-x-1">
            <MessageSquare className="h-4 w-4 mr-1" />
            <span>Send feedback</span>
          </Button>
          <Button variant="outline">Share</Button>
          <Button className="flex items-center">
            Create
            <ChevronDown className="h-4 w-4 ml-1" />
          </Button>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
