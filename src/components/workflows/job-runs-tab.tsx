"use client"
import { MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function JobRunsTab() {
  const jobRuns = [
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
    <div>
      <div className="flex flex-wrap gap-3 mb-6">
        <Select defaultValue="job">
          <SelectTrigger className="w-[120px] bg-white">
            <SelectValue placeholder="Job" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="job">Job</SelectItem>
            <SelectItem value="all">All Jobs</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="run-as">
          <SelectTrigger className="w-[120px] bg-white">
            <SelectValue placeholder="Run as" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="run-as">Run as</SelectItem>
            <SelectItem value="me">Me</SelectItem>
            <SelectItem value="others">Others</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <span className="text-sm">Start:</span>
          <div className="relative">
            <Input type="text" defaultValue="22-04-2025 03:30 PM" className="w-[200px] bg-white pr-8" />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">ⓘ</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm">End:</span>
          <div className="relative">
            <Input type="text" defaultValue="24-04-2025 03:30 PM" className="w-[200px] bg-white pr-8" />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">ⓘ</div>
          </div>
        </div>

        <Select defaultValue="run-status">
          <SelectTrigger className="w-[150px] bg-white">
            <SelectValue placeholder="Run status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="run-status">Run status</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="succeeded">Succeeded</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="error-code">
          <SelectTrigger className="w-[150px] bg-white">
            <SelectValue placeholder="Error code" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="error-code">Error code</SelectItem>
            <SelectItem value="feature-disabled">FeatureDisabled</SelectItem>
          </SelectContent>
        </Select>

        <div className="ml-auto">
          <Button className="h-10">Create job</Button>
        </div>
      </div>

      <div className="mb-6 border rounded-md p-4 bg-white">
        <div className="flex justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="text-sm font-medium">Top 5 error codes</div>
            <div className="text-xs text-gray-500">(6 errors)</div>
          </div>
        </div>

        <div className="mb-2">
          <div className="flex items-center gap-2">
            <div className="text-sm">FeatureDisabled</div>
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-teal-500 w-full"></div>
            </div>
            <div className="text-sm">6</div>
          </div>
        </div>

        <div className="h-[150px] w-full border-t pt-4">
          <div className="flex justify-between h-full relative">
            <div className="flex flex-col justify-between">
              <div className="text-xs text-gray-500">2</div>
              <div className="text-xs text-gray-500">1</div>
              <div className="text-xs text-gray-500">0</div>
            </div>

            <div className="flex-1 mx-4 relative">
              {/* Horizontal grid lines */}
              <div className="absolute left-0 right-0 top-0 border-t border-gray-100"></div>
              <div className="absolute left-0 right-0 top-1/3 border-t border-gray-100"></div>
              <div className="absolute left-0 right-0 top-2/3 border-t border-gray-100"></div>
              <div className="absolute left-0 right-0 bottom-0 border-t border-gray-100"></div>

              {/* Bars */}
              <div className="absolute bottom-0 left-[10%] w-6 h-1/3 bg-red-400"></div>
              <div className="absolute bottom-0 left-[30%] w-6 h-2/3 bg-red-400"></div>
              <div className="absolute bottom-0 left-[50%] w-6 h-1/3 bg-red-400"></div>
              <div className="absolute bottom-0 left-[70%] w-6 h-2/3 bg-red-400"></div>
            </div>

            <div className="flex flex-col justify-between text-right">
              <div className="text-xs text-gray-500">24 Apr, 12 PM</div>
              <div className="text-xs text-gray-500">24 Apr, 12 AM</div>
              <div className="text-xs text-gray-500">23 Apr, 12 PM</div>
              <div className="text-xs text-gray-500">23 Apr, 12 AM</div>
            </div>
          </div>
        </div>

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
                <TableCell className="text-blue-600">{run.job}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-xs">S</div>
                    <span>{run.runAs}</span>
                  </div>
                </TableCell>
                <TableCell>{run.launched}</TableCell>
                <TableCell>{run.duration}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <div className="h-5 w-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                      ✕
                    </div>
                    <span>{run.status}</span>
                  </div>
                </TableCell>
                <TableCell>{run.errorCode}</TableCell>
                <TableCell>{run.runParameters}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between mt-4">
        <div></div>
        <div className="flex gap-2">
          <Button variant="outline" disabled>
            Previous
          </Button>
          <Button variant="outline">Next</Button>
        </div>
      </div>
    </div>
  )
}
