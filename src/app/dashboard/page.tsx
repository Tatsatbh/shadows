"use client"

import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { fetchProblems, fetchUserCredits } from "@/lib/queries"
import { nanoid } from "nanoid"
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
import { InterviewCard } from "@/components/interview-card"
import { SessionsTable } from "@/components/sessions-table"
import { InterviewCardSkeleton } from "@/components/skeletons"
import { createClient } from "@/lib/supabase/client"
import { HeaderControls } from "@/components/header-controls"
import { JoinSessionDialog } from "@/components/app/JoinSessionDialog"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, Code2, Coins, Radio, Terminal } from "lucide-react"

type Problem = {
  id: string
  question_number: number
  question_uri: string
  title: string
  difficulty: "Easy" | "Medium" | "Hard"
}

const difficultyCopy = {
  Easy: "Warm-up",
  Medium: "Core loop",
  Hard: "Deep focus",
} as const

export default function Page() {
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const [joinDialogOpen, setJoinDialogOpen] = useState(false)
  const [selectedProblem, setSelectedProblem] = useState<any>(null)

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.replace('/')
      } else {
        setUserId(user.id)
        setIsChecking(false)
      }
    }

    checkAuth()
  }, [router])

  const { data: problems, isLoading, error } = useQuery({
    queryKey: ["problems"],
    queryFn: () => fetchProblems(),
    enabled: !!userId,
  })

  const { data: credits } = useQuery({
    queryKey: ["credits", userId],
    queryFn: () => fetchUserCredits(userId!),
    enabled: !!userId,
  })

  const problemList = useMemo<Problem[]>(() => {
    return Array.isArray(problems) ? problems : []
  }, [problems])

  const difficultyCounts = useMemo(() => {
    return problemList.reduce(
      (acc, problem) => {
        acc[problem.difficulty] += 1
        return acc
      },
      { Easy: 0, Medium: 0, Hard: 0 }
    )
  }, [problemList])

  const handleJoinClick = (problem: any) => {
    setSelectedProblem(problem)
    setJoinDialogOpen(true)
  }

  const handleConfirmJoin = () => {
    if (!selectedProblem) return

    const sessionId = nanoid()
    // Store session creation token to prevent direct URL access
    sessionStorage.setItem(`session_token_${sessionId}`, Date.now().toString())
    router.push(`/problems/${selectedProblem.question_uri}/${sessionId}`)
    setJoinDialogOpen(false)
  }

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
                  <BreadcrumbLink href="#">
                    Problems
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>All Problems</BreadcrumbPage>
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

          <section className="relative grid gap-4 xl:grid-cols-[1.45fr_0.55fr]">
            <Card className="overflow-hidden rounded-[8px] border-border/70 bg-card/85 shadow-none backdrop-blur dark:border-white/10 dark:bg-[#05070a]/90 dark:shadow-[0_28px_90px_rgba(0,0,0,0.45)]">
              <CardContent className="p-5 md:p-6">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                  <div className="max-w-2xl">
                    <Badge variant="outline" className="mb-4 rounded-[4px] border-blue-500/30 bg-blue-500/10 px-2.5 py-1 text-[11px] uppercase tracking-normal text-blue-500">
                      <Radio className="h-3 w-3" />
                      Interview rooms live
                    </Badge>
                    <h1 className="font-opencode text-2xl font-semibold leading-tight tracking-normal text-foreground md:text-3xl">
                      Pick a problem and start the room.
                    </h1>
                    <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
                      A tighter command center for your mock interviews, recent runs, and remaining credits.
                    </p>
                  </div>

                  <div className="grid min-w-0 gap-3 sm:grid-cols-3 lg:min-w-[460px]">
                    <div className="rounded-[6px] border border-border/70 bg-muted/35 p-3 dark:border-white/10 dark:bg-white/[0.035]">
                      <div className="flex items-center justify-between text-muted-foreground">
                        <span className="text-[11px] uppercase">Problems</span>
                        <Code2 className="h-4 w-4 text-blue-500" />
                      </div>
                      <p className="mt-3 text-2xl font-semibold">{isLoading ? "--" : problemList.length}</p>
                    </div>
                    <div className="rounded-[6px] border border-border/70 bg-muted/35 p-3 dark:border-white/10 dark:bg-white/[0.035]">
                      <div className="flex items-center justify-between text-muted-foreground">
                        <span className="text-[11px] uppercase">Credits</span>
                        <Coins className="h-4 w-4 text-blue-500" />
                      </div>
                      <p className="mt-3 text-2xl font-semibold">{credits ?? "--"}</p>
                    </div>
                    <div className="rounded-[6px] border border-border/70 bg-muted/35 p-3 dark:border-white/10 dark:bg-white/[0.035]">
                      <div className="flex items-center justify-between text-muted-foreground">
                        <span className="text-[11px] uppercase">Mode</span>
                        <Activity className="h-4 w-4 text-emerald-500" />
                      </div>
                      <p className="mt-3 text-sm font-medium text-emerald-500">Ready</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[8px] border-border/70 bg-card/85 shadow-none backdrop-blur dark:border-white/10 dark:bg-[#05070a]/90">
              <CardHeader className="p-5 pb-3">
                <CardTitle className="flex items-center gap-2 font-opencode text-sm font-medium">
                  <Terminal className="h-4 w-4 text-blue-500" />
                  Difficulty mix
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 px-5 pb-5">
                {(["Easy", "Medium", "Hard"] as const).map((difficulty) => (
                  <div key={difficulty} className="flex items-center justify-between rounded-[6px] border border-border/60 bg-muted/30 px-3 py-2 dark:border-white/10 dark:bg-white/[0.035]">
                    <div>
                      <p className="text-sm font-medium">{difficulty}</p>
                      <p className="text-xs text-muted-foreground">{difficultyCopy[difficulty]}</p>
                    </div>
                    <span className="font-opencode text-lg text-blue-500">{difficultyCounts[difficulty]}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>

          <div className="relative grid flex-1 gap-5 xl:grid-cols-[1fr_420px]">
            <section className="min-w-0">
              <div className="mb-3 flex items-end justify-between gap-4">
                <div>
                  <p className="text-[11px] uppercase text-blue-500">Problem set</p>
                  <h2 className="mt-1 text-lg font-semibold">Available interviews</h2>
                </div>
                <Badge variant="outline" className="hidden rounded-[4px] border-border/70 bg-muted/30 text-muted-foreground sm:inline-flex">
                  {isLoading ? "Syncing" : `${problemList.length} rooms`}
                </Badge>
              </div>

              {error && (
                <div className="rounded-[8px] border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-500">
                  Error loading problems: {error.message}
                </div>
              )}

              <div className="grid auto-rows-fr gap-3 sm:grid-cols-2 2xl:grid-cols-3">
                {isLoading && [...Array(6)].map((_, i) => (
                  <InterviewCardSkeleton key={i} />
                ))}
                {problemList.map((problem) => (
                  <InterviewCard
                    key={problem.id}
                    questionNumber={problem.question_number}
                    title={problem.title}
                    difficulty={problem.difficulty}
                    onClick={() => handleJoinClick(problem)}
                  />
                ))}
              </div>
            </section>

            <Card className="min-w-0 rounded-[8px] border-border/70 bg-card/85 shadow-none backdrop-blur dark:border-white/10 dark:bg-[#05070a]/90">
              <CardHeader className="flex-row items-center justify-between space-y-0 border-b border-border/70 p-5 dark:border-white/10">
                <div>
                  <p className="text-[11px] uppercase text-blue-500">History</p>
                  <CardTitle className="mt-1 text-lg font-semibold">Recent sessions</CardTitle>
                </div>
                <Badge variant="outline" className="rounded-[4px] border-border/70 bg-muted/30 text-muted-foreground">
                  Last 5
                </Badge>
              </CardHeader>
              <CardContent className="p-0">
                <SessionsTable limit={5} />
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>

      <JoinSessionDialog
        open={joinDialogOpen}
        onOpenChange={setJoinDialogOpen}
        onConfirm={handleConfirmJoin}
        onCancel={() => setJoinDialogOpen(false)}
        credits={credits ?? 0}
      />
    </SidebarProvider>
  )
}
