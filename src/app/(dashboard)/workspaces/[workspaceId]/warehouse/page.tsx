"use client"

import { SqlWarehouses } from "@/components/sql-warehouses/sql-warehouses"

export default function WarehousePage() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <SqlWarehouses />
    </div>
  )
}
