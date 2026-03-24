"use client"

import { useState } from "react"
import { Database, Loader2, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCreateConnection } from "@/features/ingestion/api/use-create-connection"
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id"

export function ConnectionForm({ onSuccess }: { onSuccess?: () => void }) {
  const workspaceId = useWorkspaceId()
  const createConnection = useCreateConnection()

  const [name, setName] = useState("")
  const [host, setHost] = useState("localhost")
  const [port, setPort] = useState("5432")
  const [database, setDatabase] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [testStatus, setTestStatus] = useState<"idle" | "testing" | "success" | "error">("idle")
  const [testMessage, setTestMessage] = useState("")

  const handleTest = async () => {
    setTestStatus("testing")
    try {
      // First create, then test
      const conn = await createConnection.mutateAsync({
        workspaceId,
        name: name || `${host}:${port}/${database}`,
        host,
        port: parseInt(port, 10),
        database,
        username,
        password,
      })

      const response = await fetch(`/api/ingestion/connections/${conn.id}/test`, { method: "POST" })
      const result = await response.json()

      if (result.data?.success) {
        setTestStatus("success")
        setTestMessage("Connection successful!")
        onSuccess?.()
      } else {
        setTestStatus("error")
        setTestMessage(result.data?.message || "Connection failed")
      }
    } catch (error) {
      setTestStatus("error")
      setTestMessage(error instanceof Error ? error.message : "Connection failed")
    }
  }

  const handleSubmit = async () => {
    await createConnection.mutateAsync({
      workspaceId,
      name: name || `${host}:${port}/${database}`,
      host,
      port: parseInt(port, 10),
      database,
      username,
      password,
    })
    onSuccess?.()
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center gap-2">
        <Database className="h-5 w-5 text-blue-600" />
        <h2 className="text-xl font-semibold">Connect to PostgreSQL</h2>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium">Connection Name</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="My Database" className="mt-1" />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2">
            <label className="text-sm font-medium">Host</label>
            <Input value={host} onChange={(e) => setHost(e.target.value)} placeholder="localhost" className="mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium">Port</label>
            <Input value={port} onChange={(e) => setPort(e.target.value)} placeholder="5432" className="mt-1" />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">Database</label>
          <Input value={database} onChange={(e) => setDatabase(e.target.value)} placeholder="mydb" className="mt-1" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium">Username</label>
            <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="postgres" className="mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium">Password</label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1" />
          </div>
        </div>
      </div>

      {testStatus !== "idle" && (
        <div className={`flex items-center gap-2 text-sm ${testStatus === "success" ? "text-green-600" : testStatus === "error" ? "text-red-600" : "text-muted-foreground"}`}>
          {testStatus === "testing" && <Loader2 className="h-4 w-4 animate-spin" />}
          {testStatus === "success" && <CheckCircle className="h-4 w-4" />}
          {testStatus === "error" && <XCircle className="h-4 w-4" />}
          {testMessage}
        </div>
      )}

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={handleTest} disabled={!host || !database || !username || testStatus === "testing"}>
          {testStatus === "testing" ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Testing...</> : "Test Connection"}
        </Button>
        <Button onClick={handleSubmit} disabled={!host || !database || !username || createConnection.isPending}>
          Save Connection
        </Button>
      </div>
    </div>
  )
}
