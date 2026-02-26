"use client"

import { ChevronDown, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

interface OutputCellProps {
  jobName: string
  jobNumber: number
  dataframeInfo?: string
  output: string
}

export function OutputCell({ jobName, jobNumber, dataframeInfo, output }: OutputCellProps) {
  return (
    <div className="mb-4 pl-8">
      <div className="flex items-center text-xs text-muted-foreground mb-2">
        <Button variant="ghost" size="icon" className="h-5 w-5 mr-1">
          <ChevronDown className="h-3 w-3" />
        </Button>
        <span>
          ({jobNumber}) {jobName}
        </span>
      </div>
      {dataframeInfo && (
        <div className="flex items-center text-xs text-muted-foreground mb-2 pl-4">
          <FileText className="h-4 w-4 mr-2" />
          <span>{dataframeInfo}</span>
        </div>
      )}
      <div className="pl-4 text-xs font-mono">{output}</div>
    </div>
  )
}
