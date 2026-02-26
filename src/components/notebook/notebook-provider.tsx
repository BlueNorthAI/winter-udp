"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface NotebookContextType {
  cells: {
    id: string
    type: "code" | "markdown"
    content: string
    language?: string
    output?: string
    isExecuted: boolean
    executionTime?: string
  }[]
  addCell: (type: "code" | "markdown", content: string) => void
  updateCell: (id: string, content: string) => void
  executeCell: (id: string) => void
  deleteCell: (id: string) => void
}

const NotebookContext = createContext<NotebookContextType | undefined>(undefined)

export function useNotebook() {
  const context = useContext(NotebookContext)
  if (!context) {
    throw new Error("useNotebook must be used within a NotebookProvider")
  }
  return context
}

interface NotebookProviderProps {
  children: ReactNode
  initialCells?: NotebookContextType["cells"]
}

export function NotebookProvider({ children, initialCells = [] }: NotebookProviderProps) {
  const [cells, setCells] = useState(initialCells)

  const addCell = (type: "code" | "markdown", content: string) => {
    setCells([
      ...cells,
      {
        id: Math.random().toString(36).substring(2, 9),
        type,
        content,
        isExecuted: false,
      },
    ])
  }

  const updateCell = (id: string, content: string) => {
    setCells(cells.map((cell) => (cell.id === id ? { ...cell, content, isExecuted: false } : cell)))
  }

  const executeCell = (id: string) => {
    // In a real implementation, this would execute the code and update the output
    setCells(
      cells.map((cell) =>
        cell.id === id
          ? {
              ...cell,
              isExecuted: true,
              executionTime: "<1s",
              output: cell.type === "code" ? "Execution result would go here" : undefined,
            }
          : cell,
      ),
    )
  }

  const deleteCell = (id: string) => {
    setCells(cells.filter((cell) => cell.id !== id))
  }

  return (
    <NotebookContext.Provider value={{ cells, addCell, updateCell, executeCell, deleteCell }}>
      {children}
    </NotebookContext.Provider>
  )
}
