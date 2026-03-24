"use client"

import dynamic from "next/dynamic"
import { useCallback } from "react"

const CodeMirror = dynamic(() => import("@uiw/react-codemirror"), { ssr: false })

interface QueryEditorProps {
  value: string
  onChange: (value: string) => void
  onRun: () => void
}

export function QueryEditor({ value, onChange, onRun }: QueryEditorProps) {
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault()
        onRun()
      }
    },
    [onRun]
  )

  return (
    <div className="flex flex-col h-full" onKeyDown={handleKeyDown}>
      <CodeMirror
        value={value}
        onChange={onChange}
        height="100%"
        className="h-full overflow-auto text-sm"
        basicSetup={{
          lineNumbers: true,
          foldGutter: true,
          highlightActiveLine: true,
          autocompletion: true,
        }}
        theme="light"
      />
    </div>
  )
}
