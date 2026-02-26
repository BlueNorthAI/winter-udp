"use client"

import { Search, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function AppsTab() {
  return (
    <div>
      <div className="flex flex-col gap-4 mb-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Filter by keyword" className="pl-8 bg-white" />
        </div>

        <div className="flex gap-2">
          <div className="flex items-center gap-2 border rounded-md px-3 bg-white">
            <Checkbox id="owned-by-me" />
            <label htmlFor="owned-by-me" className="text-sm">
              Owned by me
            </label>
          </div>

          <Select defaultValue="compute-status">
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder="Compute status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="compute-status">Compute status</SelectItem>
              <SelectItem value="running">Running</SelectItem>
              <SelectItem value="stopped">Stopped</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="creator">
            <SelectTrigger className="w-[120px] bg-white">
              <SelectValue placeholder="Creator" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="creator">Creator</SelectItem>
              <SelectItem value="me">Me</SelectItem>
              <SelectItem value="others">Others</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="last-updated">
            <SelectTrigger className="w-[150px] bg-white">
              <SelectValue placeholder="Last updated" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last-updated">Last updated</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="this-week">This week</SelectItem>
              <SelectItem value="this-month">This month</SelectItem>
            </SelectContent>
          </Select>

          <div className="text-sm text-muted-foreground flex items-center ml-2">0 matches</div>

          <div className="ml-auto flex gap-2">
            <Button variant="outline" className="flex items-center gap-1">
              <MessageCircle className="h-4 w-4" />
              Send feedback
            </Button>
            <Button className="h-10">Create app</Button>
          </div>
        </div>
      </div>

      <div className="border rounded-md">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-3 font-medium">Name</th>
              <th className="text-left p-3 font-medium">Compute</th>
              <th className="text-left p-3 font-medium">Creator</th>
              <th className="text-left p-3 font-medium">Last update</th>
              <th className="text-left p-3 font-medium">App URL</th>
            </tr>
          </thead>
        </table>
      </div>

      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-6">
          <div className="flex flex-col items-center mb-4">
            <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-2">
              <div className="h-8 w-8 bg-gray-300 rounded-md"></div>
            </div>
            <div className="h-2 w-32 bg-gray-200 rounded-full mb-1"></div>
            <div className="h-2 w-24 bg-gray-200 rounded-full mb-1"></div>
            <div className="h-2 w-28 bg-gray-200 rounded-full mb-1"></div>
            <div className="h-2 w-20 bg-gray-200 rounded-full"></div>
          </div>
          <h3 className="text-xl font-medium mb-1">No apps found</h3>
        </div>
      </div>
    </div>
  )
}
