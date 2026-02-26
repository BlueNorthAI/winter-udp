"use client"

import { IconSidebar } from "@/components/notebook/icon-sidebar"
import { CatalogSidebar } from "@/components/notebook/catalog-sidebar"
import { CodeCell } from "@/components/notebook/code-cell"
import { UtilitySidebar } from "@/components/notebook/utility-sidebar"
import { OutputCell } from "@/components/notebook/output-cell"

export default function NotebookInterface() {


  // Sample code with syntax highlighting
  const code1 = `<span class="text-slate-600">processName = </span> 
<span class="text-purple-600">dbutils.widgets.get</span>
<span class="text-slate-600">(</span>
<span class="text-orange-600">'prm_processName'</span>
<span class="text-slate-600">)</span>
<br />
<span class="text-slate-600">nextSourceFileDateSql=</span>
<span class="text-red-600">"""SELECT NVL(MAX(PROCESSED_FILE_TABLE_DATE)+1,'2023-01-01') as </span> 
<br />
<span class="text-red-600">NEXT_SOURCE_FILE_DATE FROM pricing_analytics.processrunlogs.DELTALAKEHOUSE_PROCESS_RUNS </span> 
<br />
<span class="text-red-600">WHERE PROCESS_NAME = '{processName}' and PROCESS_STATUS = 'Completed'"""</span>
<br />
<br />
<span class="text-slate-600">nextSourceFileDateDF= </span> 
<span class="text-purple-600">spark.sql</span>
<span class="text-slate-600">(nextSourceFileDateSql)</span>
<br />
<br />
<span class="text-purple-600">print</span>
<span class="text-slate-600">(nextSourceFileDateDF.</span>
<span class="text-purple-600">select</span>
<span class="text-slate-600">(</span>
<span class="text-orange-600">'NEXT_SOURCE_FILE_DATE'</span>
<span class="text-slate-600">).</span>
<span class="text-purple-600">collect</span>
<span class="text-slate-600">()[</span>
<span class="text-blue-600">0</span>
<span class="text-slate-600">][</span>
<span class="text-orange-600">'NEXT_SOURCE_FILE_DATE'</span>
<span class="text-slate-600">])</span>`

  const code2 = `<span class="text-purple-600">from</span>
<span class="text-slate-600"> datetime </span>
<span class="text-purple-600">import</span>
<span class="text-slate-600"> datetime</span>`

  return (
    <div className="flex h-screen bg-background">
      <IconSidebar activeIcon="catalog" />
      <CatalogSidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto">
          <CodeCell
            cellNumber={1}
            code={code1}
            language="Python"
            executionTime="1s"
            executionDate="Apr 08, 2025"
            isExecuted={true}
            showControls={true}
          />

          <OutputCell
            jobName="Spark Jobs"
            jobNumber={1}
            dataframeInfo="nextSourceFileDateDF: pyspark.sql.dataframe.DataFrame = [NEXT_SOURCE_FILE_DATE: string]"
            output="2023-01-01"
          />

          <CodeCell
            cellNumber={2}
            code={code2}
            language="Python"
            executionTime="<1s"
            executionDate="Apr 08, 2025"
            isExecuted={true}
            showControls={false}
          />
        </div>
      </div>

      <UtilitySidebar />
    </div>
  )
}
