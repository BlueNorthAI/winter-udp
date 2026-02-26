import { SqlEditor } from "@/components/sql-editor/sql-editor"

export default function SqlEditorPage() {
  return (
    <div className="flex flex-col h-screen bg-background">
      <main className="flex-1 overflow-hidden">
        <SqlEditor />
      </main>
    </div>
  )
}
