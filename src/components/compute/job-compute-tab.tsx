"use client"

import { useState } from "react"
import { ChevronDown, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function JobComputeTab() {
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  const toggleSort = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc")
  }

  const jobComputes = [
    {
      id: "job-24972099648293-run-171584",
      policy: "-",
      runtime: "15.4",
      activeMemory: "-",
      activeCores: "-",
      activeDBUs: "-",
      sourceType: "JOB",
      source: "Job-Ingest-Pricing-Reference-DB-Source-Data",
      jobRunAs: "Shrikanth M",
    },
    {
      id: "job-6197104400018-run-1014924",
      policy: "-",
      runtime: "14.3",
      activeMemory: "-",
      activeCores: "-",
      activeDBUs: "-",
      sourceType: "JOB",
      source: "Job-Ingest-Daily-Pricing-HTTP-Source-Data",
      jobRunAs: "Shrikanth M",
    },
    {
      id: "job-6197104400018-run-1058004",
      policy: "-",
      runtime: "14.3",
      activeMemory: "-",
      activeCores: "-",
      activeDBUs: "-",
      sourceType: "JOB",
      source: "Job-Ingest-Daily-Pricing-HTTP-Source-Data",
      jobRunAs: "Shrikanth M",
    },
    {
      id: "job-6197104400018-run-1067142",
      policy: "-",
      runtime: "14.3",
      activeMemory: "-",
      activeCores: "-",
      activeDBUs: "-",
      sourceType: "JOB",
      source: "Job-Ingest-Daily-Pricing-HTTP-Source-Data",
      jobRunAs: "Shrikanth M",
    },
    {
      id: "job-6197104400018-run-1075638",
      policy: "-",
      runtime: "14.3",
      activeMemory: "-",
      activeCores: "-",
      activeDBUs: "-",
      sourceType: "JOB",
      source: "Job-Ingest-Daily-Pricing-HTTP-Source-Data",
      jobRunAs: "Shrikanth M",
    },
    {
      id: "job-6197104400018-run-1078353",
      policy: "-",
      runtime: "14.3",
      activeMemory: "-",
      activeCores: "-",
      activeDBUs: "-",
      sourceType: "JOB",
      source: "Job-Ingest-Daily-Pricing-HTTP-Source-Data",
      jobRunAs: "Shrikanth M",
    },
    {
      id: "job-6197104400018-run-1299023",
      policy: "-",
      runtime: "14.3",
      activeMemory: "-",
      activeCores: "-",
      activeDBUs: "-",
      sourceType: "JOB",
      source: "Job-Ingest-Daily-Pricing-HTTP-Source-Data",
      jobRunAs: "Shrikanth M",
    },
    {
      id: "job-6197104400018-run-1963947",
      policy: "-",
      runtime: "14.3",
      activeMemory: "-",
      activeCores: "-",
      activeDBUs: "-",
      sourceType: "JOB",
      source: "Job-Ingest-Daily-Pricing-HTTP-Source-Data",
      jobRunAs: "Shrikanth M",
    },
    {
      id: "job-6197104400018-run-2538440",
      policy: "-",
      runtime: "14.3",
      activeMemory: "-",
      activeCores: "-",
      activeDBUs: "-",
      sourceType: "JOB",
      source: "Job-Ingest-Daily-Pricing-HTTP-Source-Data",
      jobRunAs: "Shrikanth M",
    },
    {
      id: "job-6197104400018-run-2845434",
      policy: "-",
      runtime: "14.3",
      activeMemory: "-",
      activeCores: "-",
      activeDBUs: "-",
      sourceType: "JOB",
      source: "Job-Ingest-Daily-Pricing-HTTP-Source-Data",
      jobRunAs: "Shrikanth M",
    },
  ]

  return (
    <div>
      <div className="flex flex-col gap-4 mb-4 sm:flex-row">
        <div className="flex gap-2">
          <Select defaultValue="created-by">
            <SelectTrigger className="w-[150px] bg-white">
              <SelectValue placeholder="Created by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created-by">Created by</SelectItem>
              <SelectItem value="me">Me</SelectItem>
              <SelectItem value="others">Others</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="source-type">
            <SelectTrigger className="w-[150px] bg-white">
              <SelectValue placeholder="Source type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="source-type">Source type</SelectItem>
              <SelectItem value="job">Job</SelectItem>
              <SelectItem value="notebook">Notebook</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">
                <Button variant="ghost" onClick={toggleSort} className="flex items-center font-semibold p-0">
                  State
                  {sortDirection === "asc" ? (
                    <ChevronDown className="ml-1 h-4 w-4" />
                  ) : (
                    <ChevronDown className="ml-1 h-4 w-4 rotate-180" />
                  )}
                </Button>
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Policy</TableHead>
              <TableHead>Runtime</TableHead>
              <TableHead>Active memory</TableHead>
              <TableHead>Active cores</TableHead>
              <TableHead>Active DBUs</TableHead>
              <TableHead>Source type</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Job run as</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobComputes.map((job) => (
              <TableRow key={job.id}>
                <TableCell>
                  <div className="h-4 w-4 rounded-full bg-gray-300"></div>
                </TableCell>
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    <span className="text-blue-600 hover:underline cursor-pointer">{job.id}</span>
                  </div>
                </TableCell>
                <TableCell>{job.policy}</TableCell>
                <TableCell>{job.runtime}</TableCell>
                <TableCell>{job.activeMemory}</TableCell>
                <TableCell>{job.activeCores}</TableCell>
                <TableCell>{job.activeDBUs}</TableCell>
                <TableCell>{job.sourceType}</TableCell>
                <TableCell className="text-blue-600 hover:underline cursor-pointer">{job.source}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-xs">S</div>
                    <span>{job.jobRunAs}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Play className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between mt-4">
        <div></div>
        <div className="flex items-center gap-4">
          <Button variant="outline" disabled>
            Previous
          </Button>
          <Button variant="outline">Next</Button>
          <Select defaultValue="20">
            <SelectTrigger className="w-[150px] bg-white">
              <SelectValue placeholder="20 / page" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10 / page</SelectItem>
              <SelectItem value="20">20 / page</SelectItem>
              <SelectItem value="50">50 / page</SelectItem>
              <SelectItem value="100">100 / page</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
