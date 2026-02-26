import { Button } from "@/components/ui/button"
import { ChevronDown, Star, Play, MoreVertical } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"

interface NotebookHeaderProps {
  title: string
  language?: string
}

export function NotebookHeader({ title, language = "Python" }: NotebookHeaderProps) {
  const isMobile = useMediaQuery("(max-width: 768px)")

  return (
    <div className="border-b p-2 bg-white flex items-center justify-between">
      <div className="flex items-center gap-4 overflow-hidden">
        <h1 className="text-lg font-medium truncate">{title}</h1>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" size="sm">
            {language}
            <ChevronDown className="ml-1 h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Star className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {isMobile ? (
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-5 w-5" />
        </Button>
      ) : (
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Play className="mr-1 h-4 w-4" />
            Run all
          </Button>
          <Button variant="outline" size="sm">
            Terminated
            <ChevronDown className="ml-1 h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            Schedule (1)
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700" size="sm">
            Share
          </Button>
          <Button variant="ghost" size="icon">
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
