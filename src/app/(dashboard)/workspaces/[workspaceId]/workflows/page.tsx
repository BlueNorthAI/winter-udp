"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { JobsTab } from "@/components/workflows/jobs-tab"
import { JobRunsTab } from "@/components/workflows/job-runs-tab"
import { PipelinesTab } from "@/components/workflows/pipelines-tab"
import { MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function WorkflowsPage() {
  const [activeTab, setActiveTab] = useState("jobs")

  return (
    <div className="flex flex-col h-screen bg-background">
      <main className="flex-1 overflow-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Workflows</h1>
          <Button variant="outline" className="flex items-center gap-1">
            <MessageCircle className="h-4 w-4" />
            Send feedback
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6 border-b rounded-none w-full justify-start h-auto p-0 bg-transparent">
            <TabsTrigger
              value="jobs"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-4 py-2"
            >
              Jobs
            </TabsTrigger>
            <TabsTrigger
              value="job-runs"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-4 py-2"
            >
              Job runs
            </TabsTrigger>
            <TabsTrigger
              value="pipelines"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-4 py-2"
            >
              Pipelines
            </TabsTrigger>
          </TabsList>

          <TabsContent value="jobs" className="mt-0">
            <JobsTab />
          </TabsContent>

          <TabsContent value="job-runs" className="mt-0">
            <JobRunsTab />
          </TabsContent>

          <TabsContent value="pipelines" className="mt-0">
            <PipelinesTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
