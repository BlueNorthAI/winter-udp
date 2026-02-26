"use client"

import { ArrowUpDown, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function ExperimentsTable() {
  // Empty state for the table
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[25%]">
              <Button variant="ghost" className="flex items-center font-semibold p-0">
                Name
              </Button>
            </TableHead>
            <TableHead className="w-[20%]">Created by</TableHead>
            <TableHead className="w-[20%]">
              <Button variant="ghost" className="flex items-center font-semibold p-0">
                Last modified <ArrowUpDown className="ml-1 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="w-[15%]">Location</TableHead>
            <TableHead className="w-[20%]">Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell colSpan={5} className="h-96">
              <div className="flex flex-col items-center justify-center h-full">
                <div className="mb-4 bg-gray-100 p-6 rounded-full">
                  <Search className="h-10 w-10 text-gray-400" />
                </div>
                <p className="text-muted-foreground">
                  No results. Try using a different keyword or adjusting your filters.
                </p>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}
