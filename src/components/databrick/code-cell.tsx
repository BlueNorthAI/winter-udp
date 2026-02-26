import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Play, Maximize2, MoreVertical } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"

interface CodeCellProps {
  code: string
  output?: string
  executionTime?: string
  cellNumber?: number
  language?: string
}

export function CodeCell({
  code,
  output,
  executionTime = "Apr 08, 2025 (1s)",
  cellNumber = 1,
  language = "Python",
}: CodeCellProps) {
  const isMobile = useMediaQuery("(max-width: 768px)")

  return (
    <Card className="m-2 md:m-4 border">
      <div className="border-b bg-gray-50 p-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Play className="h-4 w-4" />
          </Button>
          {!isMobile && <span className="text-xs text-gray-500">{executionTime}</span>}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm">{cellNumber}</span>
          <span className="text-sm text-blue-600">{language}</span>
          <Button variant="ghost" size="icon">
            <Maximize2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="p-2 md:p-4 font-mono text-sm whitespace-pre-wrap overflow-x-auto text-xs md:text-sm">{code}</div>

      {output && (
        <div className="border-t bg-gray-50 p-2">
          <div className="text-sm text-gray-600">(1) Spark Jobs</div>
          {!isMobile && (
            <div className="mt-2 text-sm text-gray-600">
              nextSourceFileDateDF: pyspark.sql.dataframe.DataFrame = [NEXT_SOURCE_FILE_DATE: string]
            </div>
          )}
          <div className="mt-2 text-sm">{output}</div>
        </div>
      )}
    </Card>
  )
}
