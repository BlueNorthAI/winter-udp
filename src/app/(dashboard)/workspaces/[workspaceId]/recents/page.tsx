"use client"

import { useState } from "react"
import { RecentsHeader, RecentsList } from "@/components/recents"

export default function RecentsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <main className="flex-1 overflow-auto">
      <RecentsHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-6">Recents</h1>
        <RecentsList searchQuery={searchQuery} />
      </div>
    </main>
  )
}
