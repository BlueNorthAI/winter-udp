"use client"

import { useState } from "react"
import { Search, ChevronDown, Play, MoreVertical, ChevronUp, Pin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function AllPurposeComputeTab() {
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  const toggleSort = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc")
  }

  return (
    <div>
      <div className="flex flex-col gap-4 mb-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Filter compute you have access to" className="pl-8 bg-white" />
        </div>

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

          <div className="flex items-center gap-2 border rounded-md px-3 bg-white">
            <Checkbox id="only-pinned" />
            <label htmlFor="only-pinned" className="text-sm">
              Only pinned
            </label>
          </div>

          <div className="ml-auto">
            <Button className="h-10">
              Create with Personal Compute
              <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
          </div>
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
                    <ChevronUp className="ml-1 h-4 w-4" />
                  ) : (
                    <ChevronDown className="ml-1 h-4 w-4" />
                  )}
                </Button>
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Policy</TableHead>
              <TableHead>Runtime</TableHead>
              <TableHead>Active memory</TableHead>
              <TableHead>Active cores</TableHead>
              <TableHead>Active DBUs</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Creator</TableHead>
              <TableHead>Notebooks</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Pin className="h-4 w-4 text-gray-400" />
                  <div className="h-4 w-4 rounded-full bg-gray-300"></div>
                </div>
              </TableCell>
              <TableCell className="font-medium">
                <div className="flex items-center">
                  <span className="text-blue-600 hover:underline cursor-pointer">Single_Node_Dev_Cluster</span>
                </div>
              </TableCell>
              <TableCell>-</TableCell>
              <TableCell>14.3</TableCell>
              <TableCell>-</TableCell>
              <TableCell>-</TableCell>
              <TableCell>-</TableCell>
              <TableCell>UI</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-xs">S</div>
                  <span>Shrikanth M</span>
                </div>
              </TableCell>
              <TableCell>-</TableCell>
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
