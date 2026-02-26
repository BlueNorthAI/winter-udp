"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"



export function SqlWarehouses() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">SQL Warehouses</h1>
        <Button className="bg-blue-600 hover:bg-blue-700">Create SQL Warehouse</Button>
      </div>

      <div className="flex flex-col gap-4">
        <div className="relative">
          <Input
            type="search"
            placeholder="Filter warehouses"
            className="w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>State</TableHead>
                <TableHead>Auto-stop</TableHead>
                <TableHead>Created by</TableHead>
                <TableHead>Created at</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Serverless Starter Warehouse</TableCell>
                <TableCell>Serverless</TableCell>
                <TableCell>Running</TableCell>
                <TableCell>10 minutes</TableCell>
                <TableCell>Shrikanth M</TableCell>
                <TableCell>Apr 21, 2025, 2:07 PM</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
