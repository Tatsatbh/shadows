"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  FileText,
  Home,
  Terminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useAuthStore } from "@/store"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useAuthStore((state) => state.user)
  const pathname = usePathname()

  const data = {
    navMain: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: Home,
        isActive: pathname === "/dashboard",
        items: [],
      },
      {
        title: "Reports",
        url: "/reports",
        icon: FileText,
        isActive: pathname === "/reports",
        items: [],
      },
    ],
  }

  const userData = {
    name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || "User",
    email: user?.email || "",
    avatar: user?.user_metadata?.avatar_url || "",
  }

  return (
    <Sidebar
      variant="inset"
      className="[--sidebar-background:240_10%_3.9%] [--sidebar-accent:240_6%_7%] [--sidebar-border:240_3.7%_15.9%] [--sidebar-foreground:0_0%_98%]"
      {...props}
    >
      <SidebarHeader className="border-b border-white/10 p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              className="h-11 rounded-[6px] px-1.5 text-white hover:bg-white/[0.04] data-[state=open]:bg-white/[0.04]"
            >
              <Link href="/dashboard">
                <div className="relative grid size-9 shrink-0 place-items-center border border-dashed border-white/55 text-blue-500">
                  <Terminal className="size-4" />
                  <span className="absolute -left-1 -top-1 h-2 w-2 border-l border-t border-blue-500" />
                  <span className="absolute -bottom-1 -right-1 h-2 w-2 border-b border-r border-blue-500" />
                </div>
                <div className="flex min-w-0 flex-1 items-center gap-2 text-left text-sm leading-tight">
                  <span className="truncate font-opencode font-semibold tracking-normal">Shadows</span>
                  <span className="rounded-[4px] border border-blue-500/25 bg-blue-500/10 px-1.5 py-0.5 text-[10px] font-medium text-blue-500">
                    BETA
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="gap-0 px-2 py-4">
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter className="border-t border-white/10 p-3">
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  )
}
