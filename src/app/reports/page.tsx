"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
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
import { SessionsTable } from "@/components/sessions-table"
import { createClient } from "@/lib/supabase/client"
import { ThemeToggle } from "@/components/theme-toggle"
import { Spinner } from "@/components/ui/spinner"
import { useQuery } from "@tanstack/react-query"
import { fetchAllSessions } from "@/lib/queries"

export default function ReportsPage() {
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.replace("/")
      } else {
        setUserId(user.id)
        setIsChecking(false)
      }
    }

    checkAuth()
  }, [router])

  // Poll for in-progress sessions
  const { data: sessions } = useQuery({
    queryKey: ["allSessions", userId],
    queryFn: () => fetchAllSessions(userId!),
    enabled: !!userId,
    refetchInterval: (query) => {
      // Check if any sessions are in_progress
      const hasInProgress = query.state.data?.some(
        (session: any) => session.status === "in_progress"
      )
      // Poll every 2 seconds if there are in-progress sessions, otherwise don't poll
      return hasInProgress ? 2000 : false
    },
  })

  const hasInProgressSessions = sessions?.some(
    (session: any) => session.status === "in_progress"
  )

  if (isChecking) {
    return null
  }

  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 justify-between">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>All Reports</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="px-4">
            <ThemeToggle />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">All Reports</h1>
            <p className="text-muted-foreground text-sm">View all your interview sessions and reports</p>
          </div>
          {hasInProgressSessions && (
            <div className="rounded-xl border bg-card p-4 flex items-center gap-3">
              <Spinner className="h-5 w-5" />
              <div>
                <p className="font-medium">Processing your interview...</p>
                <p className="text-sm text-muted-foreground">
                  Your report is being generated. This may take a minute.
                </p>
              </div>
            </div>
          )}
          <div className="rounded-xl border bg-card">
            <SessionsTable />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
