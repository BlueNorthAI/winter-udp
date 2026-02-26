"use client"

import { MoreHorizontal, Trash2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface ServingEndpoint {
  id: string
  name: string
  state: string
  servedEntities: string
  tags: string[]
  task: string
  createdBy: string
  lastModified: string
}

interface ServingTableProps {
  endpoints: ServingEndpoint[]
}

export function ServingTable({ endpoints }: ServingTableProps) {
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[25%]">Name</TableHead>
            <TableHead className="w-[10%]">State</TableHead>
            <TableHead className="w-[20%]">Served entities</TableHead>
            <TableHead className="w-[10%]">Tags</TableHead>
            <TableHead className="w-[10%]">Task</TableHead>
            <TableHead className="w-[10%]">Created by</TableHead>
            <TableHead className="w-[15%]">Last modified</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {endpoints.map((endpoint) => (
            <TableRow key={endpoint.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 bg-red-100 rounded-md flex items-center justify-center">
                    <div className="h-3 w-3 bg-red-500 rounded-sm"></div>
                  </div>
                  <span className="text-blue-600 hover:underline cursor-pointer">{endpoint.name}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="h-3 w-3 text-green-600" />
                  </div>
                  <span>{endpoint.state}</span>
                </div>
              </TableCell>
              <TableCell>{endpoint.servedEntities}</TableCell>
              <TableCell>{endpoint.tags.join(", ")}</TableCell>
              <TableCell>{endpoint.task}</TableCell>
              <TableCell>{endpoint.createdBy}</TableCell>
              <TableCell>{endpoint.lastModified}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Duplicate</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
