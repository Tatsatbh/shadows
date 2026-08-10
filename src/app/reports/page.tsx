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
import { HeaderControls } from "@/components/header-controls"
import { Spinner } from "@/components/ui/spinner"
import { useQuery } from "@tanstack/react-query"
import { fetchAllSessions } from "@/lib/queries"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, FileText, Radio } from "lucide-react"

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
      // Each poll refetches every session row plus its joined question, so the
      // cost grows with a user's history. A session that never leaves
      // in_progress (an abandon beacon that failed to send, say) polls for as
      // long as the page is open, so this runs at 5s rather than 2s — still
      // prompt for a status flip, at 60% fewer queries.
      return hasInProgress ? 5000 : false
    },
    // Don't keep polling a tab nobody is looking at.
    refetchIntervalInBackground: false,
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
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-2 border-b border-border/60 bg-background/85 backdrop-blur-xl dark:bg-[#020305]/85">
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
            <HeaderControls />
          </div>
        </header>
        <div className="relative flex flex-1 flex-col gap-5 overflow-hidden bg-background p-4 dark:bg-[#020305] md:p-6">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_5%,rgba(0,132,255,0.14),transparent_28%),radial-gradient(circle_at_15%_12%,rgba(255,255,255,0.05),transparent_24%)]" />

          <Card className="relative overflow-hidden rounded-[8px] border-border/70 bg-card/85 shadow-none backdrop-blur dark:border-white/10 dark:bg-[#05070a]/90">
            <CardContent className="p-5 md:p-6">
              <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                <div className="max-w-2xl">
                  <Badge variant="outline" className="mb-4 rounded-[4px] border-blue-500/30 bg-blue-500/10 px-2.5 py-1 text-[11px] uppercase text-blue-500">
                    <Radio className="h-3 w-3" />
                    Report archive
                  </Badge>
                  <h1 className="font-opencode text-2xl font-semibold leading-tight text-foreground md:text-3xl">
                    Review every interview run.
                  </h1>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
                    Open completed reports, watch in-progress sessions, and track how your mock interviews are developing.
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 md:min-w-[320px]">
                  <div className="rounded-[6px] border border-border/70 bg-muted/35 p-3 dark:border-white/10 dark:bg-white/[0.035]">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span className="text-[11px] uppercase">Reports</span>
                      <FileText className="h-4 w-4 text-blue-500" />
                    </div>
                    <p className="mt-3 text-2xl font-semibold">{sessions?.length ?? "--"}</p>
                  </div>
                  <div className="rounded-[6px] border border-border/70 bg-muted/35 p-3 dark:border-white/10 dark:bg-white/[0.035]">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span className="text-[11px] uppercase">Processing</span>
                      <Activity className="h-4 w-4 text-emerald-500" />
                    </div>
                    <p className="mt-3 text-2xl font-semibold">{hasInProgressSessions ? "Live" : "0"}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {hasInProgressSessions && (
            <div className="relative flex items-center gap-3 rounded-[8px] border border-blue-500/25 bg-blue-500/10 p-4">
              <Spinner className="h-5 w-5" />
              <div>
                <p className="font-medium">Processing your interview...</p>
                <p className="text-sm text-muted-foreground">
                  Your report is being generated. This may take a minute.
                </p>
              </div>
            </div>
          )}
          <Card className="relative min-w-0 rounded-[8px] border-border/70 bg-card/85 shadow-none backdrop-blur dark:border-white/10 dark:bg-[#05070a]/90">
            <CardHeader className="flex-row items-center justify-between space-y-0 border-b border-border/70 p-5 dark:border-white/10">
              <div>
                <p className="text-[11px] uppercase text-blue-500">History</p>
                <CardTitle className="mt-1 text-lg font-semibold">All sessions</CardTitle>
              </div>
              <Badge variant="outline" className="rounded-[4px] border-border/70 bg-muted/30 text-muted-foreground">
                Reports
              </Badge>
            </CardHeader>
            <CardContent className="p-0">
              <SessionsTable />
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
