"use client"

import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"
import { WorkspaceSwitcherHeader } from "@/components/workspace-switcherHeader";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { GlobalSearch } from "@/components/global-search";
interface TopNavBarProps {
  toggleSidebar: () => void
}

export function TopNavBar({ toggleSidebar }: TopNavBarProps) {
  const isMobile = useMediaQuery("(max-width: 768px)")

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b flex items-center justify-between p-2 bg-blue-900">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          <Menu className="h-5 w-5 text-white" />
        </Button>

        <Link href="/" className="flex items-center gap-2">
       {isMobile ? (
         <Image src="/assets/logo.png" alt="logo" width={60} height={60} />
       ) : (
         <>
           <Image src="/assets/logo.png" alt="logo" width={40} height={40} />
           <Image src="/assets/white-logo.png" alt="logo" width={180} height={180} />
         </>
       )}
      </Link>
        {/* <div className="flex items-center gap-2">
          <span className="font-semibold text-white">{isMobile ? "Azure" : "Microsoft Azure"}</span>
          <div className="h-6 w-px bg-gray-300 mx-2" />
          <span className="text-white">bnai</span>
        </div> */}
      </div>

      {/* {!isMobile ? (
        <div className="relative w-1/3">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-white" />
          <Input placeholder="Search data, notebooks, recents, and more..." className="pl-8 pr-4 " />
          <span className="absolute right-2 top-2 text-xs text-white">CTRL + P</span>
        </div>
      ) : (
        <Button variant="ghost" size="icon" className="md:hidden">
          <Search className="h-5 w-5" />
        </Button>
      )} */}
  <GlobalSearch />
      <div className="flex items-center gap-2">
        {!isMobile &&    <Suspense fallback={<div className="w-40 h-9 bg-neutral-200 rounded-md animate-pulse"></div>}>
        <WorkspaceSwitcherHeader />
      </Suspense>}
       
      </div>
    </header>
  )
}
