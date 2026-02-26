"use client"

import { Star, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface ModelsListProps {
  activeTab: string
  onlyMyModels: boolean
  legacyServing: boolean
}

export function ModelsList({ activeTab }: ModelsListProps) {
  // Sample data for Unity Catalog models
  const unityCatalogModels = [
    {
      id: "1",
      name: "meta_llama_v3_1_8b",
      catalog: "system",
      schema: "ai",
      lastModified: "Apr 05, 2025, 03:56 AM GMT+530",
      owner: "",
      isFavorite: true,
    },
    {
      id: "2",
      name: "meta_llama_3_70b_instruct",
      catalog: "system",
      schema: "ai",
      lastModified: "Apr 05, 2025, 03:56 AM GMT+530",
      owner: "",
      isFavorite: false,
    },
    {
      id: "3",
      name: "whisper_large_v3",
      catalog: "system",
      schema: "ai",
      lastModified: "Apr 05, 2025, 03:56 AM GMT+530",
      owner: "",
      isFavorite: false,
    },
    {
      id: "4",
      name: "dbrx_instruct",
      catalog: "system",
      schema: "ai",
      lastModified: "Apr 05, 2025, 03:56 AM GMT+530",
      owner: "",
      isFavorite: false,
    },
    {
      id: "5",
      name: "mixtral_8x7b_v0_1",
      catalog: "system",
      schema: "ai",
      lastModified: "Apr 05, 2025, 03:56 AM GMT+530",
      owner: "",
      isFavorite: false,
    },
    {
      id: "6",
      name: "meta_llama_v3_1_405b",
      catalog: "system",
      schema: "ai",
      lastModified: "Apr 05, 2025, 03:56 AM GMT+530",
      owner: "",
      isFavorite: false,
    },
    {
      id: "7",
      name: "gte_large_en_v1_5",
      catalog: "system",
      schema: "ai",
      lastModified: "Apr 05, 2025, 03:56 AM GMT+530",
      owner: "",
      isFavorite: false,
    },
    {
      id: "8",
      name: "meta_llama_v3_1_405b_instruct_fp8",
      catalog: "system",
      schema: "ai",
      lastModified: "Apr 05, 2025, 03:56 AM GMT+530",
      owner: "",
      isFavorite: false,
    },
    {
      id: "9",
      name: "meta_llama_v3_1_70b",
      catalog: "system",
      schema: "ai",
      lastModified: "Apr 05, 2025, 03:56 AM GMT+530",
      owner: "",
      isFavorite: false,
    },
    {
      id: "10",
      name: "llama_v3_flash_preview",
      catalog: "system",
      schema: "ai",
      lastModified: "Apr 05, 2025, 03:56 AM GMT+530",
      owner: "",
      isFavorite: false,
    },
  ]

  // Sample data for Workspace Registry models
  const workspaceModels: never[] = []

  const models = activeTab === "unity-catalog" ? unityCatalogModels : workspaceModels

  if (activeTab === "unity-catalog") {
    return (
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]"></TableHead>
              <TableHead className="w-[30%]">
                <Button variant="ghost" className="flex items-center font-semibold p-0">
                  Name <ArrowUpDown className="ml-1 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Catalog</TableHead>
              <TableHead>Schema</TableHead>
              <TableHead>
                <Button variant="ghost" className="flex items-center font-semibold p-0">
                  Last modified <ArrowUpDown className="ml-1 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Owner</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {models.map((model) => (
              <TableRow key={model.id}>
                <TableCell>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Star className={`h-4 w-4 ${model.isFavorite ? "fill-yellow-400 text-yellow-400" : ""}`} />
                  </Button>
                </TableCell>
                <TableCell className="font-medium text-blue-600 hover:underline cursor-pointer">{model.name}</TableCell>
                <TableCell className="text-blue-600 hover:underline cursor-pointer">{model.catalog}</TableCell>
                <TableCell className="text-blue-600 hover:underline cursor-pointer">{model.schema}</TableCell>
                <TableCell>{model.lastModified}</TableCell>
                <TableCell>{model.owner}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  } else {
    return (
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[25%]">
                <Button variant="ghost" className="flex items-center font-semibold p-0">
                  Name <ArrowUpDown className="ml-1 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Latest version</TableHead>
              <TableHead>Staging</TableHead>
              <TableHead>Production</TableHead>
              <TableHead>Created by</TableHead>
              <TableHead>
                <Button variant="ghost" className="flex items-center font-semibold p-0">
                  Last modified <ArrowUpDown className="ml-1 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Tags</TableHead>
              <TableHead>Legacy serving</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {models.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-96">
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="mb-4 text-gray-300">
                      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M12 4V20M4 12H20"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <p className="text-muted-foreground">
                      No models registered yet.{" "}
                      <a href="#" className="text-blue-600">
                        Learn more about registering models.
                      </a>
                    </p>
                    <Button className="bg-blue-600 hover:bg-blue-700 mt-4">Create a model</Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              models.map((model) => (
                <TableRow key={model.id}>
                  <TableCell className="font-medium text-blue-600 hover:underline cursor-pointer">
                    {model.name}
                  </TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>{model.lastModified}</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>-</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    )
  }
}
