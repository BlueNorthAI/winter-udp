"use client"

import { useState } from "react"
import { Search, ChevronDown, Play, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function JobsTab() {
  const [filterType, setFilterType] = useState("accessible")

  const jobs = [
    {
      id: "1",
      name: "Job-Ingest-Daily-Pricing-HTTP-Source-Data",
      tags: [],
      createdBy: "Shrikanth M",
      trigger: "Scheduled",
      recentRuns: [
        { status: "failed" },
        { status: "failed" },
        { status: "failed" },
        { status: "failed" },
        { status: "failed" },
      ],
    },
    {
      id: "2",
      name: "Job-Ingest-Pricing-Reference-DB-Source-Data",
      tags: [],
      createdBy: "Shrikanth M",
      trigger: "",
      recentRuns: [
        { status: "success" },
        { status: "failed" },
        { status: "failed" },
        { status: "success" },
        { status: "success" },
      ],
    },
    {
      id: "3",
      name: "Job-Transform-Daily-Pricing-CSV-to-DELTA-Table",
      tags: [],
      createdBy: "Shrikanth M",
      trigger: "Scheduled",
      recentRuns: [
        { status: "failed" },
        { status: "failed" },
        { status: "failed" },
        { status: "failed" },
        { status: "failed" },
      ],
    },
  ]

  return (
    <div>
      <div className="flex flex-col gap-4 mb-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Filter jobs" className="pl-8 bg-white" />
        </div>

        <div className="flex gap-2">
          <div className="flex border rounded-md overflow-hidden">
            <Button
              variant={filterType === "owned" ? "secondary" : "ghost"}
              className="rounded-none border-0 h-10"
              onClick={() => setFilterType("owned")}
            >
              Owned by me
            </Button>
            <Button
              variant={filterType === "accessible" ? "secondary" : "ghost"}
              className="rounded-none border-0 h-10"
              onClick={() => setFilterType("accessible")}
            >
              Accessible by me
            </Button>
            <Button
              variant={filterType === "favorites" ? "secondary" : "ghost"}
              className="rounded-none border-0 h-10"
              onClick={() => setFilterType("favorites")}
            >
              Favorites
            </Button>
          </div>

          <Button variant="outline" className="h-10">
            Tags <ChevronDown className="ml-1 h-4 w-4" />
          </Button>

          <div className="ml-auto">
            <Button variant="outline" className="h-10 mr-2">
              Load tutorial
            </Button>
            <Button className="h-10">Create job</Button>
          </div>
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">
                Name <ChevronDown className="inline-block h-4 w-4" />
              </TableHead>
              <TableHead>Tags</TableHead>
              <TableHead>Created by</TableHead>
              <TableHead>Trigger</TableHead>
              <TableHead>Recent runs</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.map((job) => (
              <TableRow key={job.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    <span className="text-blue-600 hover:underline cursor-pointer">{job.name}</span>
                  </div>
                </TableCell>
                <TableCell>{job.tags.length > 0 ? job.tags.join(", ") : ""}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-xs">S</div>
                    <span>{job.createdBy}</span>
                  </div>
                </TableCell>
                <TableCell>{job.trigger}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {job.recentRuns.map((run, index) => (
                      <div
                        key={index}
                        className={`h-5 w-5 rounded-full flex items-center justify-center ${
                          run.status === "success" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                        }`}
                      >
                        {run.status === "success" ? "✓" : "✕"}
                      </div>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Play className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
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
