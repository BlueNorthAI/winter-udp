"use client"

import { useState } from "react"
import { MessageCircle, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ErrorChart } from "./error-chart"

interface JobRun {
  id: string
  startTime: string
  job: string
  runAs: string
  launched: string
  duration: string
  status: "Failed" | "Succeeded" | "Skipped" | "Running"
  errorCode: string
  runParameters: string
}

export function JobRuns() {
  const [selectedJob, setSelectedJob] = useState("all")
  const [selectedRunAs, setSelectedRunAs] = useState("all")
  const [startDate, setStartDate] = useState("22-04-2025 05:30 PM")
  const [endDate, setEndDate] = useState("24-04-2025 05:30 PM")
  const [runStatus, setRunStatus] = useState("all")
  const [errorCode, setErrorCode] = useState("all")

  // Sample data
  const jobRuns: JobRun[] = [
    {
      id: "1",
      startTime: "Apr 24, 2025, 05:05 AM",
      job: "Job-Ingest-Daily-Pricing-HTTP-Source-Data",
      runAs: "Shrikanth M",
      launched: "By scheduler",
      duration: "5s",
      status: "Failed",
      errorCode: "FeatureDisabled",
      runParameters: "",
    },
    {
      id: "2",
      startTime: "Apr 24, 2025, 04:30 AM",
      job: "Job-Transform-Daily-Pricing-CSV-to-DELTA-Table",
      runAs: "Shrikanth M",
      launched: "By scheduler",
      duration: "6s",
      status: "Failed",
      errorCode: "FeatureDisabled",
      runParameters: "",
    },
    {
      id: "3",
      startTime: "Apr 23, 2025, 05:05 PM",
      job: "Job-Ingest-Daily-Pricing-HTTP-Source-Data",
      runAs: "Shrikanth M",
      launched: "By scheduler",
      duration: "5s",
      status: "Failed",
      errorCode: "FeatureDisabled",
      runParameters: "",
    },
    {
      id: "4",
      startTime: "Apr 23, 2025, 05:05 AM",
      job: "Job-Ingest-Daily-Pricing-HTTP-Source-Data",
      runAs: "Shrikanth M",
      launched: "By scheduler",
      duration: "5s",
      status: "Failed",
      errorCode: "FeatureDisabled",
      runParameters: "",
    },
    {
      id: "5",
      startTime: "Apr 23, 2025, 04:30 AM",
      job: "Job-Transform-Daily-Pricing-CSV-to-DELTA-Table",
      runAs: "Shrikanth M",
      launched: "By scheduler",
      duration: "8s",
      status: "Failed",
      errorCode: "FeatureDisabled",
      runParameters: "",
    },
  ]

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Workflows</h1>
        <Button variant="outline" className="flex items-center gap-1">
          <MessageCircle className="h-4 w-4" />
          Send feedback
        </Button>
      </div>

      <Tabs defaultValue="job-runs" className="w-full">
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

        <TabsContent value="job-runs" className="mt-0">
          <div className="flex flex-wrap gap-3 mb-6">
            <Select value={selectedJob} onValueChange={setSelectedJob}>
              <SelectTrigger className="w-[120px] bg-white">
                <SelectValue placeholder="Job" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Job</SelectItem>
                <SelectItem value="ingest">Ingest Jobs</SelectItem>
                <SelectItem value="transform">Transform Jobs</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedRunAs} onValueChange={setSelectedRunAs}>
              <SelectTrigger className="w-[120px] bg-white">
                <SelectValue placeholder="Run as" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Run as</SelectItem>
                <SelectItem value="me">Me</SelectItem>
                <SelectItem value="others">Others</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <span className="text-sm">Start:</span>
              <div className="relative">
                <Input
                  type="text"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-[200px] bg-white pr-8"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">ⓘ</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm">End:</span>
              <div className="relative">
                <Input
                  type="text"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-[200px] bg-white pr-8"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">ⓘ</div>
              </div>
            </div>

            <Select value={runStatus} onValueChange={setRunStatus}>
              <SelectTrigger className="w-[150px] bg-white">
                <SelectValue placeholder="Run status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Run status</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="succeeded">Succeeded</SelectItem>
                <SelectItem value="running">Running</SelectItem>
              </SelectContent>
            </Select>

            <Select value={errorCode} onValueChange={setErrorCode}>
              <SelectTrigger className="w-[150px] bg-white">
                <SelectValue placeholder="Error code" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Error code</SelectItem>
                <SelectItem value="feature-disabled">FeatureDisabled</SelectItem>
              </SelectContent>
            </Select>

            <div className="ml-auto">
              <Button className="bg-blue-600 hover:bg-blue-700">Create job</Button>
            </div>
          </div>

          <div className="mb-6 border rounded-md p-4 bg-white">
            <div className="flex justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="text-sm font-medium">Top 5 error codes</div>
                <div className="text-xs text-gray-500">(5 errors)</div>
              </div>
            </div>

            <div className="mb-2">
              <div className="flex items-center gap-2">
                <div className="text-sm">FeatureDisabled</div>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-500 w-full"></div>
                </div>
                <div className="text-sm">5</div>
              </div>
            </div>

            <ErrorChart />

            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-red-400"></div>
                <span className="text-xs">Failed</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-gray-400"></div>
                <span className="text-xs">Skipped</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-400"></div>
                <span className="text-xs">Succeeded</span>
              </div>
            </div>
          </div>

          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Start time</TableHead>
                  <TableHead>Job</TableHead>
                  <TableHead>Run as</TableHead>
                  <TableHead>Launched</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Error code</TableHead>
                  <TableHead>Run parameters</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobRuns.map((run) => (
                  <TableRow key={run.id}>
                    <TableCell>{run.startTime}</TableCell>
                    <TableCell>{run.job}</TableCell>
                    <TableCell>{run.runAs}</TableCell>
                    <TableCell>{run.launched}</TableCell>
                    <TableCell>{run.duration}</TableCell>
                    <TableCell>
                      <StatusIndicator status={run.status} />
                    </TableCell>
                    <TableCell>{run.errorCode}</TableCell>
                    <TableCell>{run.runParameters}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function StatusIndicator({ status }: { status: JobRun["status"] }) {
  const getStatusColor = () => {
    switch (status) {
      case "Failed":
        return "bg-red-400"
      case "Succeeded":
        return "bg-green-400"
      case "Running":
        return "bg-blue-400"
      case "Skipped":
        return "bg-gray-400"
      default:
        return "bg-gray-400"
    }
  }

  return (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${getStatusColor()}`}></div>
      <span>{status}</span>
    </div>
  )
}
