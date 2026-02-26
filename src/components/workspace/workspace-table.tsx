"use client"

import type React from "react"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { MoreVertical, ChevronUp, ChevronDown, FileText, FolderIcon } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface WorkspaceItem {
  id: string
  name: string
  type: "Folder" | "Notebook" | "Query"
  owner: string
  createdAt: string
  icon: React.ReactNode
}

export function WorkspaceTable() {
  const [sortField, setSortField] = useState<keyof WorkspaceItem>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  const handleSort = (field: keyof WorkspaceItem) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const items: WorkspaceItem[] = [
    {
      id: "1",
      name: "01-Ingestion",
      type: "Folder",
      owner: "Shrikanth M",
      createdAt: "Apr 08, 2025, 01:36 PM",
      icon: <FolderIcon className="h-5 w-5 text-blue-500" />,
    },
    {
      id: "2",
      name: "02-Transform",
      type: "Folder",
      owner: "Shrikanth M",
      createdAt: "Apr 09, 2025, 11:42 AM",
      icon: <FolderIcon className="h-5 w-5 text-blue-500" />,
    },
    {
      id: "3",
      name: "PySpark-Introduction",
      type: "Folder",
      owner: "Shrikanth M",
      createdAt: "Apr 07, 2025, 03:09 PM",
      icon: <FolderIcon className="h-5 w-5 text-blue-500" />,
    },
    {
      id: "4",
      name: "Sample Dashboards",
      type: "Folder",
      owner: "Shrikanth M",
      createdAt: "Apr 21, 2025, 02:06 PM",
      icon: <FolderIcon className="h-5 w-5 text-blue-500" />,
    },
    {
      id: "5",
      name: "sparkSQL-Introduction",
      type: "Folder",
      owner: "Shrikanth M",
      createdAt: "Apr 07, 2025, 05:49 PM",
      icon: <FolderIcon className="h-5 w-5 text-blue-500" />,
    },
    {
      id: "6",
      name: "01-Notebook-Introduction",
      type: "Notebook",
      owner: "Shrikanth M",
      createdAt: "Apr 07, 2025, 02:25 PM",
      icon: <FileText className="h-5 w-5 text-gray-500" />,
    },
    {
      id: "7",
      name: "02-Create-and-Configure-Dev-Cluster",
      type: "Notebook",
      owner: "Shrikanth M",
      createdAt: "Apr 07, 2025, 02:36 PM",
      icon: <FileText className="h-5 w-5 text-gray-500" />,
    },
    {
      id: "8",
      name: "02-Deltalakehouse-bronze-layer-tables-setup",
      type: "Query",
      owner: "Shrikanth M",
      createdAt: "Apr 15, 2025, 01:02 PM",
      icon: <FileText className="h-5 w-5 text-green-500" />,
    },
    {
      id: "9",
      name: "03-Deltalakehouse-silver-layer-table",
      type: "Query",
      owner: "Shrikanth M",
      createdAt: "Apr 16, 2025, 10:57 AM",
      icon: <FileText className="h-5 w-5 text-green-500" />,
    },
    {
      id: "10",
      name: "04-Deltalakehouse-gold-layer-reporting-table",
      type: "Query",
      owner: "Shrikanth M",
      createdAt: "Apr 15, 2025, 10:04 PM",
      icon: <FileText className="h-5 w-5 text-green-500" />,
    },
  ]

  // Sort items
  const sortedItems = [...items].sort((a, b) => {
    if (sortDirection === "asc") {
      return (a[sortField] ?? '').toString().localeCompare((b[sortField] ?? '').toString())
    } else {
      return (b[sortField] ?? '').toString().localeCompare((a[sortField] ?? '').toString()) 
    }
  })

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[400px]">
              <Button variant="ghost" onClick={() => handleSort("name")} className="flex items-center font-semibold">
                Name
                {sortField === "name" &&
                  (sortDirection === "asc" ? (
                    <ChevronUp className="ml-1 h-4 w-4" />
                  ) : (
                    <ChevronDown className="ml-1 h-4 w-4" />
                  ))}
              </Button>
            </TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Created at</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedItems.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">
                <div className="flex items-center space-x-2">
                  {item.icon}
                  <span>{item.name}</span>
                </div>
              </TableCell>
              <TableCell>{item.type}</TableCell>
              <TableCell>{item.owner}</TableCell>
              <TableCell>{item.createdAt}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Open</DropdownMenuItem>
                    <DropdownMenuItem>Rename</DropdownMenuItem>
                    <DropdownMenuItem>Delete</DropdownMenuItem>
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
