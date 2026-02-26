"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Database, FileText } from "lucide-react"

interface Catalog {
  id: string
  name: string
  type: string
  owner: string
  createdAt: string
}

interface CatalogTableProps {
  catalogs: Catalog[]
}

export function CatalogTable({ catalogs }: CatalogTableProps) {
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40%]">Name</TableHead>
            <TableHead className="w-[30%]">Owner</TableHead>
            <TableHead className="w-[30%]">Created at</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {catalogs.map((catalog) => (
            <TableRow key={catalog.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 bg-gray-100 rounded-md flex items-center justify-center">
                    {catalog.type === "catalog" ? (
                      <Database className="h-4 w-4 text-blue-600" />
                    ) : (
                      <FileText className="h-4 w-4 text-gray-600" />
                    )}
                  </div>
                  <span className="text-blue-600 hover:underline cursor-pointer">{catalog.name}</span>
                </div>
              </TableCell>
              <TableCell>{catalog.owner}</TableCell>
              <TableCell>{catalog.createdAt}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
