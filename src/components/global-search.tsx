"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  BarChart2,
  Box,
  CreditCard,
  LayoutDashboard,
  Package,
  Search,
  Settings,
  Truck,
  X,
  Clock,
  ArrowRight,
  Zap,
} from "lucide-react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Skeleton } from "@/components/ui/skeleton"

const recentSearches = [
  { id: "ORD-5498", type: "order", title: "Customer 123 Order" },
  { id: "SHP-ID-9876", type: "shipment", title: "Carrier 1 Shipment" },
  { id: "Marble Mosaic", type: "customer", title: "Denver DC Stockout" },
]

const quickLinks = [
  { id: "dashboard", title: "Dashboard", icon: LayoutDashboard },
  { id: "control-tower", title: "Control Tower", icon: Settings },
  { id: "order-management", title: "Order Management", icon: Package },
  { id: "track-trace", title: "Track & Trace", icon: Truck },
  { id: "order-fulfillment", title: "Order Fulfillment", icon: Box },
  { id: "service-analytics", title: "Service Level Analytics", icon: BarChart2 },
]

type SearchResult = {
  id: string
  title: string
  type: string
  description?: string
  route?: string
}

const typeConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  order: { label: "Order", color: "bg-blue-100 text-blue-700", icon: Package },
  shipment: { label: "Shipment", color: "bg-amber-100 text-amber-700", icon: Truck },
  customer: { label: "Customer", color: "bg-emerald-100 text-emerald-700", icon: CreditCard },
  page: { label: "Page", color: "bg-purple-100 text-purple-700", icon: LayoutDashboard },
}

export function GlobalSearch() {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [results, setResults] = React.useState<SearchResult[]>([])

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const handleSearch = React.useCallback(async (searchQuery: string) => {
    if (!searchQuery) {
      setResults([])
      return
    }
    setIsLoading(true)
    setTimeout(() => {
      const searchResults: SearchResult[] = []
      if (searchQuery.toUpperCase().startsWith("ORD")) {
        searchResults.push({
          id: searchQuery.toUpperCase(),
          title: `Order ${searchQuery.toUpperCase()}`,
          type: "order",
          description: "View order details",
          route: `/orders/${searchQuery.toUpperCase()}`,
        })
      }
      if (searchQuery.toUpperCase().startsWith("SHP")) {
        searchResults.push({
          id: searchQuery.toUpperCase(),
          title: `Shipment ${searchQuery.toUpperCase()}`,
          type: "shipment",
          description: "View shipment details",
          route: `/shipments/${searchQuery.toUpperCase()}`,
        })
      }
      const pageMatches = quickLinks.filter((link) =>
        link.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
      pageMatches.forEach((match) => {
        searchResults.push({
          id: match.id,
          title: match.title,
          type: "page",
          description: `Navigate to ${match.title}`,
          route: `/${match.id.toLowerCase().replace(/\s+/g, "-")}`,
        })
      })
      setResults(searchResults)
      setIsLoading(false)
    }, 400)
  }, [])

  React.useEffect(() => {
    handleSearch(query)
  }, [query, handleSearch])

  const handleSelect = (result: SearchResult) => {
    setOpen(false)
    if (result.route) router.push(result.route)
  }

  return (
    <>
      {/* Search trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="group flex items-center gap-2.5 h-9 lg:w-[420px] w-[160px] px-3 rounded-lg border border-white/20 bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-200 text-sm text-white/60 hover:text-white/80"
      >
        <Search className="h-4 w-4 shrink-0 text-white/50 group-hover:text-white/70 transition-colors" />
        <span className="flex-1 text-left truncate text-white/50 group-hover:text-white/70 transition-colors">Search anything...</span>
        <kbd className="hidden sm:flex items-center gap-0.5 rounded border border-white/20 bg-white/10 px-1.5 py-0.5 font-mono text-[10px] text-white/40">
          <span>⌘</span>K
        </kbd>
      </button>

      {/* Command dialog */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <div className="flex items-center gap-2 border-b border-neutral-100 px-4 py-1">
          <CommandInput
            placeholder="Search orders, shipments, pages..."
            value={query}
            onValueChange={setQuery}
            className="flex-1 border-0 bg-transparent text-sm outline-none placeholder:text-neutral-400 focus:ring-0 h-11"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="shrink-0 rounded-md p-1 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <CommandList className="max-h-[420px] overflow-y-auto p-2">
          {isLoading ? (
            <div className="p-3 space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded-lg" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3 w-2/5" />
                    <Skeleton className="h-2.5 w-3/5" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {query.length > 0 && results.length === 0 && (
                <CommandEmpty>
                  <div className="flex flex-col items-center gap-2 py-8 text-neutral-400">
                    <Search className="h-8 w-8 opacity-40" />
                    <p className="text-sm">No results for &ldquo;{query}&rdquo;</p>
                    <p className="text-xs text-neutral-300">Try searching for orders (ORD-), shipments (SHP-), or pages</p>
                  </div>
                </CommandEmpty>
              )}

              {query.length > 0 && results.length > 0 && (
                <CommandGroup heading={
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-neutral-500 uppercase tracking-wider px-1 pb-1">
                    <Zap className="h-3 w-3" /> Results
                  </span>
                }>
                  {results.map((result) => {
                    const config = typeConfig[result.type] ?? typeConfig.page
                    const Icon = config.icon
                    return (
                      <CommandItem
                        key={result.id}
                        value={result.id}
                        onSelect={() => handleSelect(result)}
                        className="group flex items-center gap-3 rounded-lg px-3 py-2.5 cursor-pointer hover:bg-neutral-50 aria-selected:bg-blue-50"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neutral-100 group-aria-selected:bg-white">
                          <Icon className="h-4 w-4 text-neutral-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-neutral-800 truncate">{result.title}</p>
                          {result.description && (
                            <p className="text-xs text-neutral-400 truncate">{result.description}</p>
                          )}
                        </div>
                        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${config.color}`}>
                          {config.label}
                        </span>
                        <ArrowRight className="h-3.5 w-3.5 text-neutral-300 opacity-0 group-aria-selected:opacity-100 transition-opacity" />
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              )}

              {query.length === 0 && (
                <>
                  <CommandGroup heading={
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-neutral-500 uppercase tracking-wider px-1 pb-1">
                      <Clock className="h-3 w-3" /> Recent
                    </span>
                  }>
                    {recentSearches.map((item) => {
                      const config = typeConfig[item.type] ?? typeConfig.page
                      const Icon = config.icon
                      return (
                        <CommandItem
                          key={item.id}
                          value={item.id}
                          onSelect={() => {
                            setOpen(false)
                            const route =
                              item.type === "order"
                                ? `/orders/${item.id}`
                                : item.type === "shipment"
                                  ? `/shipments/${item.id}`
                                  : `/customers/${item.id}`
                            router.push(route)
                          }}
                          className="group flex items-center gap-3 rounded-lg px-3 py-2.5 cursor-pointer hover:bg-neutral-50 aria-selected:bg-blue-50"
                        >
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neutral-100 group-aria-selected:bg-white">
                            <Icon className="h-4 w-4 text-neutral-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-neutral-800 truncate">{item.title}</p>
                            <p className="text-xs text-neutral-400 truncate">{item.id}</p>
                          </div>
                          <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${config.color}`}>
                            {config.label}
                          </span>
                        </CommandItem>
                      )
                    })}
                  </CommandGroup>

                  <CommandSeparator className="my-2" />

                  <CommandGroup heading={
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-neutral-500 uppercase tracking-wider px-1 pb-1">
                      <Zap className="h-3 w-3" /> Quick Links
                    </span>
                  }>
                    <div className="grid grid-cols-2 gap-1 px-1 pb-1">
                      {quickLinks.map((link) => (
                        <CommandItem
                          key={link.id}
                          value={link.id}
                          onSelect={() => {
                            setOpen(false)
                            router.push(`/${link.id.toLowerCase().replace(/\s+/g, "-")}`)
                          }}
                          className="group flex items-center gap-2.5 rounded-lg px-3 py-2 cursor-pointer hover:bg-neutral-50 aria-selected:bg-blue-50"
                        >
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-neutral-100 group-aria-selected:bg-white">
                            <link.icon className="h-3.5 w-3.5 text-neutral-500" />
                          </div>
                          <span className="text-xs font-medium text-neutral-700 truncate">{link.title}</span>
                        </CommandItem>
                      ))}
                    </div>
                  </CommandGroup>
                </>
              )}
            </>
          )}
        </CommandList>

        {/* Footer hint */}
        <div className="flex items-center border-t border-neutral-100 px-4 py-2.5">
          <div className="flex items-center gap-3 text-[11px] text-neutral-400">
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-neutral-200 bg-neutral-100 px-1 font-mono">↑↓</kbd> navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-neutral-200 bg-neutral-100 px-1 font-mono">↵</kbd> select
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-neutral-200 bg-neutral-100 px-1 font-mono">esc</kbd> close
            </span>
          </div>
        </div>
      </CommandDialog>
    </>
  )
}
