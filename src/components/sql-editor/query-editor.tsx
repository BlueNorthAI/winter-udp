"use client"


import { Input } from "@/components/ui/input"

interface QueryEditorProps {
  value: string
  onChange: (value: string) => void
  onRun: () => void
}

export function QueryEditor({ value, onChange }: QueryEditorProps) {
  function onRun() {
    throw new Error("Function not implemented.")
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 p-4">
        <Input
          type="text"
          placeholder="Enter your SQL query"
          className="w-full h-full"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
              onRun()
            }
          }}
        />
      </div>
    </div>
  )
}
