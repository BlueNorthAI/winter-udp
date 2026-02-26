"use client"

import { useEffect } from "react"
import { NotebookHeader } from "@/components/databrick/notebook-header"
import { TableOfContents } from "@/components/databrick/table-of-contents"
import { CodeCell } from "@/components/databrick/code-cell"
import { useMediaQuery } from "@/hooks/use-media-query"

export default function DatabrickPage() {
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Auto-collapse sidebar on mobile
  useEffect(() => {
    if (isMobile) {
      // Handle mobile sidebar collapse if needed
    }
  }, [isMobile])

  const pythonCode = `processName = dbutils.widgets.get('prm_processName')
nextSourceFileDateSql="""SELECT NVL(MAX(PROCESSED_FILE_TABLE_DATE)+1,'2023-01-01') as
NEXT_SOURCE_FILE_DATE FROM pricing_analytics.processrunlogs.DATALAKEHOUSE_PROCESS_RUNS
WHERE PROCESS_NAME = '{processName}' and PROCESS_STATUS = 'Completed'"""

nextSourceFileDateDF= spark.sql(nextSourceFileDateSql)

print(nextSourceFileDateDF.select('NEXT_SOURCE_FILE_DATE').collect()[0]['NEXT_SOURCE_FILE_DATE'])`

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <NotebookHeader title="01-Ingest-Daily-Pricing-HTTP-Source-Data" />

      <div className="flex-1 flex overflow-hidden">
        {!isMobile && <TableOfContents />}

        <div className="flex-1 overflow-auto">
          <CodeCell code={pythonCode} output="2023-01-01" />
        </div>
      </div>
    </div>
  )
}
