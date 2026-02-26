"use client"

import { Search, MoreVertical, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

export function SqlWarehousesTab() {
  const warehouses = [
    {
      id: "1",
      status: "stopped",
      name: "Serverless Starter Warehouse",
      createdBy: "Shrikanth M",
      size: "Small",
      activeMax: "0 / 1",
      type: "Serverless",
    },
  ]

  return (
    <div>
      <div className="flex flex-col gap-4 mb-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Filter SQL warehouses" className="pl-8 bg-white" />
        </div>

        <div className="flex gap-2">
          <div className="flex items-center gap-2 border rounded-md px-3 bg-white">
            <Checkbox id="only-my-warehouses" />
            <label htmlFor="only-my-warehouses" className="text-sm">
              Only my SQL warehouses
            </label>
          </div>

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

          <Select defaultValue="size">
            <SelectTrigger className="w-[100px] bg-white">
              <SelectValue placeholder="Size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="size">Size</SelectItem>
              <SelectItem value="small">Small</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="large">Large</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="status">
            <SelectTrigger className="w-[120px] bg-white">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="status">Status</SelectItem>
              <SelectItem value="running">Running</SelectItem>
              <SelectItem value="stopped">Stopped</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="type">
            <SelectTrigger className="w-[100px] bg-white">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="type">Type</SelectItem>
              <SelectItem value="serverless">Serverless</SelectItem>
              <SelectItem value="pro">Pro</SelectItem>
            </SelectContent>
          </Select>

          <div className="ml-auto">
            <Button className="h-10">Create SQL warehouse</Button>
          </div>
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Created by</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Active / Max</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {warehouses.map((warehouse) => (
              <TableRow key={warehouse.id}>
                <TableCell>
                  <div className="h-4 w-4 rounded-full bg-gray-300"></div>
                </TableCell>
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    <span className="text-blue-600 hover:underline cursor-pointer">{warehouse.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-xs">S</div>
                    <span>{warehouse.createdBy}</span>
                  </div>
                </TableCell>
                <TableCell>{warehouse.size}</TableCell>
                <TableCell>{warehouse.activeMax}</TableCell>
                <TableCell>
                  <span className="text-blue-600 hover:underline cursor-pointer">{warehouse.type}</span>
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
    </div>
  )
}
