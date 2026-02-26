"use client"

import { MessageSquare, Users, Clock, Layers, Settings, Cpu } from "lucide-react"
import { Button } from "@/components/ui/button"

export function UtilitySidebar() {
  return (
    <div className="w-[40px] border-l flex flex-col items-center py-4">
      <Button variant="ghost" size="icon" className="h-8 w-8 mb-2">
        <MessageSquare className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" className="h-8 w-8 mb-2">
        <Users className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" className="h-8 w-8 mb-2">
        <Clock className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" className="h-8 w-8 mb-2">
        <Layers className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" className="h-8 w-8 mb-2">
        <Settings className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" className="h-8 w-8 mb-2">
        <Cpu className="h-4 w-4" />
      </Button>
    </div>
  )
}
