"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { DottedSeparator } from "@/components/dotted-separator";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { usePathname, useRouter } from "next/navigation";
import {
  GoHome, GoHomeFill,
  GoBell, GoHistory
} from "react-icons/go";
import { LuNotebook,LuClock3  } from "react-icons/lu";


import { RiFlowChart,RiDashboardLine  } from "react-icons/ri";
import { MdOutlineCloud } from "react-icons/md";
import { BsShop } from "react-icons/bs";
import { BiCodeBlock } from "react-icons/bi";
import { PiCodeBlock,PiShapes,PiTreeStructureLight } from "react-icons/pi";
import { TbDeviceIpadHorizontalStar,TbRobotFace } from "react-icons/tb";
import { AiOutlineCloudServer,AiOutlineExperiment,AiOutlineDatabase } from "react-icons/ai";
import { FaListCheck } from "react-icons/fa6";
import { TiTabsOutline } from "react-icons/ti";
import { TfiServer } from "react-icons/tfi";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";


const routes = [
  {
    label: "Workspace",
    href: "/workspacedata",
    icon: LuNotebook,
    activeIcon: LuNotebook,
  },
  {
    label: "Data Platform",
    href: "/supplyChainData",
    icon: AiOutlineDatabase,
    activeIcon: AiOutlineDatabase,
  },
  {
    label: "Recents",
    href: "/recents",
    icon: LuClock3,
    activeIcon: LuClock3,
  },
  {
    label: "Catalog",
    href: "/catalog",
    icon: PiShapes,
    activeIcon: PiShapes,
  },
  {
    label: "Workflows",
    href: "/workflows",
    icon: RiFlowChart,
    activeIcon: RiFlowChart,
  },
  {
    label: "Compute",
    href: "/compute",
    icon: MdOutlineCloud,
    activeIcon: MdOutlineCloud,
  },
  {
    label: "Marketplace",
    href: "/marketplace",
    icon: BsShop,
    activeIcon: BsShop,
  },
];

const sql = [
  {
    label: "SQL Editor",
    href: "/sql",
    icon: BiCodeBlock,
    activeIcon: BiCodeBlock,
  },

  {
    label: "Queries",
    href: "/queries",
    icon: PiCodeBlock,
    activeIcon: PiCodeBlock,
  },
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: RiDashboardLine,
    activeIcon: RiDashboardLine,
  },
  {
    label: "Genie",
    href: "/genie",
    icon: TbDeviceIpadHorizontalStar ,
    activeIcon: TbDeviceIpadHorizontalStar,
  },
  {
    label: "Alerts",
    href: "/alerts",
    icon: GoBell,
    activeIcon: GoBell,
  },
  {
    label: "Query History",
    href: "/query",
    icon: GoHistory,
    activeIcon: GoHistory,
  },
  {
    label: "SQL Warehouse",
    href: "/warehouse",
    icon: AiOutlineCloudServer,
    activeIcon: AiOutlineCloudServer,
  },
];

const dataEng = [
  {
    label: "Job Runs",
    href: "/job",
    icon: FaListCheck,
    activeIcon: FaListCheck,
  },

  {
    label: "Data Ingestion",
    href: "/ingestion",
    icon: PiTreeStructureLight ,
    activeIcon: PiTreeStructureLight ,
  },
  {
    label: "Pipelines",
    href: "/pipelines",
    icon: GoHome,
    activeIcon: GoHomeFill,
  },
];

const machineLearning = [
  {
    label: "Playground",
    href: "/playground",
    icon: TbRobotFace,
    activeIcon: TbRobotFace,
  },

  {
    label: "Experiments",
    href: "/experiments",
    icon: AiOutlineExperiment ,
    activeIcon: AiOutlineExperiment ,
  },
  {
    label: "Features",
    href: "/features",
    icon: TiTabsOutline,
    activeIcon: TiTabsOutline,
  },
  {
    label: "Models",
    href: "/models",
    icon: GoHome,
    activeIcon: GoHomeFill,
  },
  {
    label: "Serving",
    href: "/serving",
    icon: TfiServer ,
    activeIcon: TfiServer ,
  },
];

interface SidebarProps {
  collapsed: boolean;
}

export function Sidebar({ collapsed }: SidebarProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const workspaceId = useWorkspaceId();
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  if (isMobile) {
    return (
      <Sheet>
        <SheetContent side="left" className="p-0 w-[280px]">
          <div className="h-full bg-gray-50 flex flex-col">
            <div className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search"
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="flex-1 overflow-auto">
              <SidebarSection
                title=""
                items={routes.map((item) => ({
                  icon: <item.icon className="h-5 w-5" />,
                  label: item.label,
                  href: `/workspaces/${workspaceId}${item.href}`,
                  isActive:
                    pathname === `/workspaces/${workspaceId}${item.href}`,
                  onClick: () =>
                    router.push(`/workspaces/${workspaceId}${item.href}`),
                }))}
                collapsed={false}
                
              />
              <DottedSeparator className="my-2" />

              <SidebarSection
                title="SQL"
                items={sql.map((item) => ({
                  icon: <item.icon className="h-5 w-5" />,
                  label: item.label,
                  href: `/workspaces/${workspaceId}${item.href}`,
                  isActive:
                    pathname === `/workspaces/${workspaceId}${item.href}`,
                  onClick: () =>
                    router.push(`/workspaces/${workspaceId}${item.href}`),
                }))}
                collapsed={false}
               
              />
              <DottedSeparator className="my-2" />

              <SidebarSection
                title="Data Engineering"
                items={dataEng.map((item) => ({
                  icon: <item.icon className="h-5 w-5" />,
                  label: item.label,
                  href: `/workspaces/${workspaceId}${item.href}`,
                  isActive:
                    pathname === `/workspaces/${workspaceId}${item.href}`,
                  onClick: () =>
                    router.push(`/workspaces/${workspaceId}${item.href}`),
                }))}
                collapsed={false}
              />
              <DottedSeparator className="my-2" />
              <SidebarSection
                title="Machine Learning"
                items={machineLearning.map((item) => ({
                  icon: <item.icon className="h-5 w-5" />,
                  label: item.label,
                  href: `/workspaces/${workspaceId}${item.href}`,
                  isActive:
                    pathname === `/workspaces/${workspaceId}${item.href}`,
                  onClick: () =>
                    router.push(`/workspaces/${workspaceId}${item.href}`),
                }))}
                collapsed={false}
              />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <aside
      className={`${
        collapsed ? "w-16" : "w-56"
      } border-r bg-gray-50 flex flex-col transition-all duration-300 md:flex h-full`}
    >
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search"
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <SidebarSection
          title=""
          items={routes.map((item) => ({
            icon: <item.icon className="h-5 w-5" />,
            label: item.label,
            href: `/workspaces/${workspaceId}${item.href}`,
            isActive: pathname === `/workspaces/${workspaceId}${item.href}`,
            onClick: () =>
              router.push(`/workspaces/${workspaceId}${item.href}`),
          }))}
          collapsed={collapsed}
        />
        <DottedSeparator className="my-2" />
        <SidebarSection
          title="SQL"
          items={sql.map((item) => ({
            icon: <item.icon className="h-5 w-5" />,
            label: item.label,
            href: `/workspaces/${workspaceId}${item.href}`,
            isActive: pathname === `/workspaces/${workspaceId}${item.href}`,
            onClick: () =>
              router.push(`/workspaces/${workspaceId}${item.href}`),
          }))}
          collapsed={collapsed}
        />
        <DottedSeparator className="my-2" />
        <SidebarSection
          title="Data Engineering"
          items={dataEng.map((item) => ({
            icon: <item.icon className="h-5 w-5" />,
            label: item.label,
            href: `/workspaces/${workspaceId}${item.href}`,
            isActive: pathname === `/workspaces/${workspaceId}${item.href}`,
            onClick: () =>
              router.push(`/workspaces/${workspaceId}${item.href}`),
          }))}
          collapsed={collapsed}
        />
        <DottedSeparator className="my-2" />
        <SidebarSection
          title="Machine Learning "
          items={machineLearning.map((item) => ({
            icon: <item.icon className="h-5 w-5" />,
            label: item.label,
            href: `/workspaces/${workspaceId}${item.href}`,
            isActive: pathname === `/workspaces/${workspaceId}${item.href}`,
            onClick: () =>
              router.push(`/workspaces/${workspaceId}${item.href}`),
          }))}
          collapsed={collapsed}
        />
      </div>
    </aside>
  );
}

interface SidebarSectionProps {
  title: string;
  items: Array<{
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    isActive?: boolean;
  }>;
  collapsed: boolean;
}

function SidebarSection({
  title,
  items,
  collapsed,
}: SidebarSectionProps) {
  return (
    <>
      {!collapsed && (
        <div className="px-4 py-2 text-sm font-medium text-gray-500">
          {title}
        </div>
      )}
      <nav className="space-y-1 p-2">
        {items.map((item, i) => (
          <Button
            key={i}
            variant={item.isActive ? "outline" : "ghost"}
            className={`w-full ${
              collapsed ? "justify-center px-2" : "justify-start gap-2"
            }`}
            title={collapsed ? item.label : undefined}
            onClick={item.onClick}
          >
            {item.icon}
            {!collapsed && <span>{item.label}</span>}
          </Button>
        ))}
      </nav>
    </>
  );
}
