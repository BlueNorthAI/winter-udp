"use client"

import { Search, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function PoliciesTab() {
  const policies = [
    {
      id: "1",
      name: "Job Compute",
      definitions: 9,
      policyFamily: "Job Compute",
      computeType: "job",
    },
    {
      id: "2",
      name: "Legacy Shared Compute",
      definitions: 13,
      policyFamily: "Legacy Shared Compute",
      computeType: "all-purpose",
    },
    {
      id: "3",
      name: "Personal Compute",
      definitions: 11,
      policyFamily: "Personal Compute",
      computeType: "all-purpose",
    },
    {
      id: "4",
      name: "Power User Compute",
      definitions: 12,
      policyFamily: "Power User Compute",
      computeType: "all-purpose",
    },
    {
      id: "5",
      name: "Shared Compute",
      definitions: 13,
      policyFamily: "Shared Compute",
      computeType: "all-purpose",
    },
  ]

  return (
    <div>
      <div className="flex flex-col gap-4 mb-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Filter policies" className="pl-8 bg-white" />
        </div>

        <div className="ml-auto">
          <Button className="h-10">Create policy</Button>
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button variant="ghost" className="flex items-center font-semibold p-0">
                  Name
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Definitions</TableHead>
              <TableHead>Policy Family</TableHead>
              <TableHead>Compute type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {policies.map((policy) => (
              <TableRow key={policy.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    <span className="text-blue-600 hover:underline cursor-pointer">{policy.name}</span>
                  </div>
                </TableCell>
                <TableCell>{policy.definitions}</TableCell>
                <TableCell>{policy.policyFamily}</TableCell>
                <TableCell>{policy.computeType}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
