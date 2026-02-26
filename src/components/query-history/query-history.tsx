"use client"

import { useState } from "react"
import { RefreshCw, CheckCircle, FileText, ChevronRight, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface QueryHistoryItem {
  id: string
  query: string
  startedAt: string
  duration: number
  source: {
    type: string
    name: string
    id: string
  }
  compute: string
  user: string
  status: "success" | "failed" | "running"
}

export function QueryHistory() {
  const [selectedUser, setSelectedUser] = useState("me")
  const [timeRange, setTimeRange] = useState("7days")
  const [compute, setCompute] = useState("all")
  const [duration, setDuration] = useState("all")
  const [status, setStatus] = useState("all")
  const [statement, setStatement] = useState("all")
  const [statementId, setStatementId] = useState("")

  // Sample data
  const queryHistory: QueryHistoryItem[] = [
    {
      id: "1",
      query: "INSERT INTO pricing_analytics.processrunlogs.deltalakehouse_process_runs VALUES (...)",
      startedAt: "4/21/2025, 10:42 AM",
      duration: 8.33,
      source: {
        type: "notebook",
        name: "01-Trans...TA-Table",
        id: "Cell(ID:...9467854)",
      },
      compute: "Serverless compute",
      user: "Shrikanth M",
      status: "success",
    },
  ]

  const resetFilters = () => {
    setSelectedUser("me")
    setTimeRange("7days")
    setCompute("all")
    setDuration("all")
    setStatus("all")
    setStatement("all")
    setStatementId("")
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Query History</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="h-9 w-9">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-9 w-9">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <div className="relative min-w-[300px]">
          <Select value={selectedUser} onValueChange={setSelectedUser}>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="User: Me (bluenorthai@outlook.com)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="me">User: Me (bluenorthai@outlook.com)</SelectItem>
              <SelectItem value="all">All users</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="relative">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Last 7 days" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="custom">Custom range</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="relative">
          <Select value={compute} onValueChange={setCompute}>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Compute" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All compute</SelectItem>
              <SelectItem value="serverless">Serverless compute</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="relative">
          <Select value={duration} onValueChange={setDuration}>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All durations</SelectItem>
              <SelectItem value="under1s">Under 1s</SelectItem>
              <SelectItem value="1to10s">1s to 10s</SelectItem>
              <SelectItem value="over10s">Over 10s</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="relative">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="running">Running</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="relative">
          <Select value={statement} onValueChange={setStatement}>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Statement" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statements</SelectItem>
              <SelectItem value="select">SELECT</SelectItem>
              <SelectItem value="insert">INSERT</SelectItem>
              <SelectItem value="update">UPDATE</SelectItem>
              <SelectItem value="delete">DELETE</SelectItem>
              <SelectItem value="create">CREATE</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="relative">
          <Input
            type="text"
            placeholder="Statement ID"
            className="h-10 bg-white"
            value={statementId}
            onChange={(e) => setStatementId(e.target.value)}
          />
        </div>

        <div className="ml-auto flex items-center">
          <span className="text-sm font-medium">{queryHistory.length} query</span>
        </div>
      </div>

      <div className="mb-4">
        <Button variant="primary" className="text-blue-600 p-0 h-auto" onClick={resetFilters}>
          Reset filters
        </Button>
      </div>

      <div className="border rounded-md flex-1 overflow-auto">
        <Table>
          <TableHeader className="bg-muted/50 sticky top-0">
            <TableRow>
              <TableHead className="w-[40%]">Query</TableHead>
              <TableHead>Started at</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Compute</TableHead>
              <TableHead>User</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {queryHistory.map((item) => (
              <TableRow key={item.id} className="hover:bg-muted/30">
                <TableCell className="font-medium">
                  <div className="flex items-start gap-2">
                    <div className="mt-1">
                      {item.status === "success" ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : item.status === "failed" ? (
                        <div className="h-5 w-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                          ✕
                        </div>
                      ) : (
                        <div className="h-5 w-5 rounded-full border-2 border-blue-300 border-t-transparent animate-spin"></div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center">
                        <ChevronRight className="h-4 w-4 mr-1 text-muted-foreground" />
                        <code className="text-xs text-blue-600 font-mono">{item.query}</code>
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{item.startedAt}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-blue-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500"
                        style={{ width: `${Math.min(100, (item.duration / 10) * 100)}%` }}
                      ></div>
                    </div>
                    <span>{item.duration} s</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-500" />
                    <span className="text-blue-600">{item.source.name}</span>
                    <span className="text-muted-foreground text-xs">/</span>
                    <span className="text-blue-600">{item.source.id}</span>
                  </div>
                </TableCell>
                <TableCell>{item.compute}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-xs">S</div>
                    <span>{item.user}</span>
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
