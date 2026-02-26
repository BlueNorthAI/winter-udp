"use client"

import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"



export function PipelinesTable() {
  // Sample data
  const pipelines = [
    {
      id: "1",
      name: "Pipeline 1",
      recentUpdates: "2 hours ago",
      runAs: "John Doe"
    }
  ]

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40%]">
              <Button variant="ghost" className="flex items-center font-semibold p-0">
                Name
                <ArrowUpDown className="ml-1 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>Recent updates</TableHead>
            <TableHead>ID</TableHead>
            <TableHead>Run as</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pipelines.map((pipeline) => (
            <TableRow key={pipeline.id}>
              <TableCell className="font-medium">
                <span className="text-blue-600 hover:underline cursor-pointer">{pipeline.name}</span>
              </TableCell>
              <TableCell>{pipeline.recentUpdates}</TableCell>
              <TableCell>{pipeline.id}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-xs">
                    {pipeline.runAs.charAt(0)}
                  </div>
                  <span>{pipeline.runAs}</span>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
