"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import type { ReactNode } from "react"
import { Fragment, useEffect, useState } from "react"

import { AppSidebar } from "@/components/app-sidebar"
import { HeaderControls } from "@/components/header-controls"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { createClient } from "@/lib/supabase/client"

type BreadcrumbRoute = {
  label: string
  href?: string
}

export function AppShell({
  currentPage,
  breadcrumbs = [{ label: "Dashboard", href: "/dashboard" }],
  children,
}: {
  currentPage: string
  breadcrumbs?: BreadcrumbRoute[]
  children: ReactNode
}) {
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.replace("/")
        return
      }

      setIsChecking(false)
    }

    checkAuth()
  }, [router])

  if (isChecking) {
    return null
  }

  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-2 border-b border-border/60 bg-background/85 backdrop-blur-xl dark:bg-[#020305]/85">
          <div className="flex min-w-0 items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.map((item) => (
                  <Fragment key={`${item.label}-${item.href ?? "current"}`}>
                    <BreadcrumbItem className="hidden md:block">
                      {item.href ? (
                        <BreadcrumbLink asChild>
                          <Link href={item.href}>{item.label}</Link>
                        </BreadcrumbLink>
                      ) : (
                        <BreadcrumbPage>{item.label}</BreadcrumbPage>
                      )}
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                  </Fragment>
                ))}
                <BreadcrumbItem>
                  <BreadcrumbPage>{currentPage}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="px-4">
            <HeaderControls />
          </div>
        </header>
        <main className="relative flex flex-1 flex-col gap-5 overflow-hidden bg-background p-4 dark:bg-[#020305] md:p-6">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_5%,rgba(0,132,255,0.14),transparent_28%),radial-gradient(circle_at_15%_12%,rgba(255,255,255,0.05),transparent_24%)]" />
          <div className="relative">
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
