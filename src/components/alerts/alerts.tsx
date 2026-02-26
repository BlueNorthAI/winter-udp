"use client"

import { useState } from "react"
import { Search, Bell, ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { EmptyState } from "./empty-state"

interface Alert {
  id: string
  name: string
  status: "Active" | "Inactive" | "Triggered"
  lastUpdated: string
  createdBy: string
  createdAt: string
}

export function Alerts() {
  const [activeTab, setActiveTab] = useState("my-alerts")
  const [searchQuery, setSearchQuery] = useState("")

  // Sample data - empty for now to match the screenshots
  const alerts: Alert[] = []

  // Filter alerts based on search input and active tab
  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch = alert.name.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeTab === "my-alerts") {
      // In a real app, you would filter by the current user
      return matchesSearch
    }

    return matchesSearch
  })

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Alerts</h1>
        <Button className="bg-blue-600 hover:bg-blue-700">Create alert</Button>
      </div>

      <div className="flex flex-col gap-4 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Filter alerts"
            className="pl-9 h-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Tabs defaultValue="my-alerts" onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-[250px] grid-cols-2">
            <TabsTrigger value="my-alerts">My alerts</TabsTrigger>
            <TabsTrigger value="all-alerts">All alerts</TabsTrigger>
          </TabsList>

          <TabsContent value="my-alerts" className="mt-4">
            <AlertsTable alerts={filteredAlerts} activeTab={activeTab} />
          </TabsContent>

          <TabsContent value="all-alerts" className="mt-4">
            <AlertsTable alerts={filteredAlerts} activeTab={activeTab} />
          </TabsContent>
        </Tabs>
      </div>

      <div className="flex justify-end mt-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled>
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  )
}

function AlertsTable({ alerts, activeTab }: { alerts: Alert[]; activeTab: string }) {
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40px]">
              <Bell className="h-4 w-4" />
            </TableHead>
            <TableHead className="w-[30%]">
              <Button variant="ghost" className="flex items-center font-semibold p-0">
                Name
                <ArrowUpDown className="ml-1 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>Status</TableHead>
            <TableHead>
              <Button variant="ghost" className="flex items-center font-semibold p-0">
                Last updated
                <ArrowUpDown className="ml-1 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>Created by</TableHead>
            <TableHead>
              <Button variant="ghost" className="flex items-center font-semibold p-0">
                Created at
                <ArrowUpDown className="ml-1 h-4 w-4" />
              </Button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {alerts.length > 0 ? (
            alerts.map((alert) => (
              <TableRow key={alert.id}>
                <TableCell>
                  <Bell className="h-4 w-4 text-muted-foreground" />
                </TableCell>
                <TableCell className="font-medium">
                  <span className="text-blue-600 hover:underline cursor-pointer">{alert.name}</span>
                </TableCell>
                <TableCell>
                  <StatusBadge status={alert.status} />
                </TableCell>
                <TableCell>{alert.lastUpdated}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-xs">
                      {alert.createdBy.charAt(0)}
                    </div>
                    <span>{alert.createdBy}</span>
                  </div>
                </TableCell>
                <TableCell>{alert.createdAt}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                <EmptyState type={activeTab} />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

function StatusBadge({ status }: { status: Alert["status"] }) {
  const getStatusColor = () => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-600"
      case "Inactive":
        return "bg-gray-100 text-gray-600"
      case "Triggered":
        return "bg-red-100 text-red-600"
      default:
        return "bg-gray-100 text-gray-600"
    }
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor()}`}>
      {status}
    </span>
  )
}
