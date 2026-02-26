"use client"

import { Play, ChevronDown, CheckSquare, MoreVertical, Trash2, Code, Maximize2, LayoutGrid } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

interface CodeCellProps {
  cellNumber: number
  code: string
  language?: string
  executionTime?: string
  executionDate?: string
  isExecuted?: boolean
  onRun?: () => void
  showControls?: boolean
}

export function CodeCell({
  cellNumber,
  code,
  language = "Python",
  executionTime = "1s",
  executionDate = "Apr 08, 2025",
  isExecuted = true,
  onRun,
  showControls = true,
}: CodeCellProps) {
  return (
    <Card className="border-0 rounded-none mb-4">
      <div className="flex items-center border-b bg-muted/30">
        {showControls && (
          <div className="flex items-center p-1">
            <LayoutGrid className="h-5 w-5 text-muted-foreground mx-2" />
          </div>
        )}
        <div className="flex items-center border-l border-r">
          <Button className="h-8 rounded-none bg-blue-600 hover:bg-blue-700 text-white px-3" onClick={onRun}>
            <Play className="h-4 w-4 mr-1" />
          </Button>
          {showControls && (
            <Button variant="ghost" className="h-8 rounded-none px-1 border-l border-r">
              <ChevronDown className="h-4 w-4" />
            </Button>
          )}
          {isExecuted && (
            <div className="flex items-center px-3 h-8">
              <CheckSquare className="h-4 w-4 text-green-600 mr-2" />
              <span className="text-xs">
                {executionDate} ({executionTime})
              </span>
            </div>
          )}
        </div>
        <div className="ml-auto flex items-center h-8">
          <span className="px-3 text-xs">{cellNumber}</span>
          {language && (
            <Badge variant="outline" className="rounded-sm font-normal mr-2 text-xs">
              {language}
            </Badge>
          )}
          {showControls && (
            <>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Code className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Maximize2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>
      <ScrollArea className={`${code.split("\n").length > 10 ? "h-[200px]" : "h-[60px]"} w-full`}>
        <pre className="p-4 text-xs font-mono">
          <code dangerouslySetInnerHTML={{ __html: code }} />
        </pre>
      </ScrollArea>
    </Card>
  )
}
