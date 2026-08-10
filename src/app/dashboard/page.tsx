"use client"

import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState, type ReactNode } from "react"
import { fetchAllSessions, fetchProblems, fetchUserCredits } from "@/lib/queries"
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
import { ArrowRight, ChevronRight, Code2, Coins, Terminal } from "lucide-react"
import { DifficultyFilter, type DifficultyLevel } from "@/components/difficulty-filter"
import { AmazonSmileLogo, GoogleGLogo, AppleLogo } from "@/components/company-logos"
import { asDifficulty, type Difficulty } from "@/lib/db-types"

type Problem = {
  id: string
  question_number: number
  question_uri: string
  title: string
  difficulty: Difficulty
  summary: string | null
}

/** Uppercase mono section label, numbered like the landing page kickers. */
function Kicker({ children }: { children: ReactNode }) {
  return (
    <p className="font-jetbrains inline-flex items-center gap-2 text-[11px] uppercase tracking-wide text-[#0877ff]">
      <Terminal className="h-3.5 w-3.5" />
      {children}
    </p>
  )
}

/** Navy glass panel — the landing page card surface. */
function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-[8px] border border-border bg-card dark:border-[#0b72ff]/28 dark:bg-[#061635]/24 dark:shadow-[0_0_38px_rgba(0,112,255,0.09)] ${className}`}
    >
      {children}
    </div>
  )
}

function StatTile({
  label,
  value,
  icon,
  accent = false,
}: {
  label: string
  value: ReactNode
  icon: ReactNode
  accent?: boolean
}) {
  return (
    <div className="rounded-[6px] border border-border bg-muted/35 px-3 py-2.5 dark:border-[#0b72ff]/24 dark:bg-[#061635]/34">
      <div className="flex items-center justify-between">
        <span className="font-jetbrains text-[10px] uppercase tracking-wider text-muted-foreground dark:text-zinc-500">
          {label}
        </span>
        {icon}
      </div>
      <p
        className={`font-pixel mt-2 text-xl leading-none ${
          accent ? "text-emerald-500 dark:text-emerald-400" : "text-foreground dark:text-white"
        }`}
      >
        {value}
      </p>
    </div>
  )
}

const targetLoops = [
  { name: "Amazon SDE Intern", Logo: AmazonSmileLogo },
  { name: "Google SWE Intern", Logo: GoogleGLogo },
  { name: "Apple SWE", Logo: AppleLogo },
]

export default function Page() {
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const [joinDialogOpen, setJoinDialogOpen] = useState(false)
  const [selectedProblem, setSelectedProblem] = useState<any>(null)
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyLevel>("All")

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

  // Same key as SessionsTable, so react-query serves both from one fetch.
  const { data: sessions } = useQuery({
    queryKey: ["allSessions", userId],
    queryFn: () => fetchAllSessions(userId!),
    enabled: !!userId,
  })

  const problemList = useMemo<Problem[]>(() => {
    if (!Array.isArray(problems)) return []
    // difficulty is CHECK-constrained text, which the generated types widen to
    // string; narrow it once here rather than at every consumer.
    return problems.map((problem) => ({
      ...problem,
      difficulty: asDifficulty(problem.difficulty),
    }))
  }, [problems])

  const filteredProblemList = useMemo(() => {
    if (difficultyFilter === "All") return problemList
    return problemList.filter(p => p.difficulty === difficultyFilter)
  }, [problemList, difficultyFilter])

  // Next-best-action: the first problem the user hasn't completed yet
  // (problems come back in question order). Falls back to the first problem.
  const recommendedProblem = useMemo(() => {
    if (problemList.length === 0) return null
    const completed = new Set(
      (sessions ?? [])
        .filter((s) => s.status === "completed")
        .flatMap((s) => (Array.isArray(s.questions) ? s.questions : [s.questions]))
        .map((q) => q?.question_number)
    )
    return problemList.find((p) => !completed.has(p.question_number)) ?? problemList[0]
  }, [problemList, sessions])

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
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-2 border-b border-border bg-background/85 backdrop-blur-xl dark:border-[#0b72ff]/22 dark:bg-[#020407]/82 dark:shadow-[0_0_28px_rgba(0,112,255,0.08)]">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4 dark:bg-[#0b72ff]/30" />
            <Breadcrumb>
              <BreadcrumbList className="font-jetbrains text-xs">
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#" className="text-muted-foreground transition hover:text-[#58a0ff] dark:text-zinc-500">
                    ~/problems
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden text-[#0877ff] md:block">
                  /
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-foreground dark:text-white">
                    all
                    <span className="cursor-blink text-[#0b72ff]">_</span>
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="px-4">
            <HeaderControls />
          </div>
        </header>

        <div className="relative flex flex-1 flex-col gap-6 overflow-hidden bg-background p-4 dark:bg-[#020305] md:p-6">
          {/* Brand backdrop: dot grid + blue glows, CRT scanlines on top */}
          <div className="console-backdrop pointer-events-none absolute inset-0" aria-hidden="true" />
          <div className="console-scanlines pointer-events-none absolute inset-0 z-10" aria-hidden="true" />

          {/* 01 / Command strip: one primary action + compact readouts, goal context right */}
          <section className="relative grid gap-4 xl:grid-cols-[1.45fr_0.55fr]">
            <Panel className="overflow-hidden">
              <div className="flex flex-col gap-6 p-5 md:p-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-2xl">
                  <Kicker>01 / Interview rooms live</Kicker>
                  <h1 className="font-pixel mt-3 text-2xl leading-tight text-foreground dark:text-white md:text-[28px]">
                    PICK A PROBLEM. <span className="text-[#0b72ff]">START THE ROOM<span className="cursor-blink">_</span></span>
                  </h1>
                  <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground dark:text-zinc-400">
                    Your command center for mock interviews, recent runs, and remaining credits.
                  </p>

                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      disabled={!recommendedProblem}
                      onClick={() => recommendedProblem && handleJoinClick(recommendedProblem)}
                      className="inline-flex h-11 max-w-full items-center gap-2.5 rounded-[7px] bg-[#0b72ff] px-5 text-sm font-semibold text-white shadow-[0_0_30px_rgba(0,112,255,0.42)] transition hover:bg-[#2482ff] focus:outline-none focus:ring-2 focus:ring-[#4a9bff] focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 dark:focus:ring-offset-black"
                    >
                      <span className="shrink-0">Start next:</span>
                      <span className="min-w-0 truncate">
                        {recommendedProblem ? recommendedProblem.title : "..."}
                      </span>
                      <ArrowRight className="h-4 w-4 shrink-0" />
                    </button>
                    <a
                      href="#problem-set"
                      className="font-jetbrains inline-flex h-11 items-center rounded-[7px] border border-border bg-muted/30 px-4 text-xs uppercase tracking-wide text-foreground transition hover:bg-muted/50 dark:border-[#0b72ff]/40 dark:bg-[#061635]/45 dark:text-[#58a0ff] dark:hover:border-[#58a0ff]/70 dark:hover:bg-[#0b72ff]/14"
                    >
                      Browse all
                    </a>
                  </div>
                </div>

                <div className="grid w-full shrink-0 grid-cols-3 gap-3 lg:w-[360px]">
                  <StatTile
                    label="Problems"
                    value={isLoading ? "--" : problemList.length}
                    icon={<Code2 className="h-3.5 w-3.5 text-[#0877ff]" />}
                  />
                  <StatTile
                    label="Credits"
                    value={credits ?? "--"}
                    icon={<Coins className="h-3.5 w-3.5 text-[#0877ff]" />}
                  />
                  <StatTile
                    label="Status"
                    value="READY"
                    accent
                    icon={
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.85)]" />
                      </span>
                    }
                  />
                </div>
              </div>
            </Panel>

            <Panel className="flex flex-col">
              <div className="p-5 pb-3">
                <Kicker>Target loops</Kicker>
              </div>
              <div className="flex flex-1 flex-col px-5 pb-5">
                <div className="flex flex-1 flex-col justify-between gap-2">
                  {targetLoops.map((loop) => (
                    <div
                      key={loop.name}
                      className="group flex cursor-pointer items-center justify-between rounded-[6px] border border-border bg-muted/30 px-3 py-2 transition hover:bg-muted/50 dark:border-[#0b72ff]/24 dark:bg-[#061635]/34 dark:hover:border-[#0b72ff]/50 dark:hover:bg-[#0b72ff]/12"
                    >
                      <div className="flex items-center gap-3">
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-[6px] border border-border bg-background dark:border-[#0b72ff]/40 dark:bg-[#04142d]">
                          <loop.Logo className="h-[18px] w-[18px] object-contain opacity-80 transition-opacity group-hover:opacity-100" />
                        </span>
                        <p className="text-sm font-medium text-foreground dark:text-zinc-200">{loop.name} Loop</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-[#58a0ff]" />
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  className="font-jetbrains mt-4 inline-flex h-9 w-full items-center justify-center rounded-[6px] border border-border bg-muted/30 text-xs font-medium uppercase tracking-wide text-foreground transition hover:bg-muted/50 dark:border-[#0b72ff]/40 dark:bg-[#061635]/45 dark:text-[#58a0ff] dark:shadow-[0_0_24px_rgba(0,112,255,0.12)] dark:hover:border-[#58a0ff]/70 dark:hover:bg-[#0b72ff]/14"
                >
                  View all loops
                </button>
              </div>
            </Panel>
          </section>

          {/* 02 / Problem set: the core browsing surface, full width */}
          <section id="problem-set" className="relative scroll-mt-24">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
              <div>
                <Kicker>02 / Problem set</Kicker>
                <h2 className="font-pixel mt-2 text-lg text-foreground dark:text-white">
                  AVAILABLE INTERVIEWS
                </h2>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <DifficultyFilter
                  value={difficultyFilter}
                  onChange={setDifficultyFilter}
                />
                <span className="font-jetbrains hidden rounded-[5px] border border-border bg-muted/30 px-2.5 py-1.5 text-[11px] uppercase tracking-wide text-muted-foreground dark:border-[#0b72ff]/28 dark:bg-[#061635]/34 dark:text-zinc-400 sm:inline-flex">
                  {isLoading ? "Syncing..." : `${problemList.length} rooms`}
                </span>
              </div>
            </div>

            {error && (
              <div className="font-jetbrains mb-4 rounded-[8px] border border-rose-500/35 bg-rose-500/10 p-4 text-sm text-rose-500 dark:text-rose-300">
                Error loading problems: {error.message}
              </div>
            )}

            <div className="grid auto-rows-fr gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {isLoading && [...Array(8)].map((_, i) => (
                <InterviewCardSkeleton key={i} />
              ))}
              {filteredProblemList.map((problem) => (
                <InterviewCard
                  key={problem.id}
                  questionNumber={problem.question_number}
                  title={problem.title}
                  difficulty={problem.difficulty}
                  summary={problem.summary}
                  onClick={() => handleJoinClick(problem)}
                />
              ))}
              {!isLoading && filteredProblemList.length === 0 && (
                <div className="font-jetbrains col-span-full rounded-[8px] border border-dashed border-border py-8 text-center text-sm text-muted-foreground dark:border-[#0b72ff]/30 dark:text-zinc-500">
                  No {difficultyFilter !== "All" ? difficultyFilter.toLowerCase() : ""} problems available right now.
                </div>
              )}
            </div>
          </section>

          {/* 03 / History: full-width progress band */}
          <section className="relative">
            <Panel className="min-w-0">
              <div className="flex flex-row items-center justify-between border-b border-border p-5 dark:border-[#0b72ff]/22">
                <div>
                  <Kicker>03 / History</Kicker>
                  <h2 className="font-pixel mt-2 text-lg text-foreground dark:text-white">
                    RECENT SESSIONS
                  </h2>
                </div>
                <span className="font-jetbrains rounded-[5px] border border-border bg-muted/30 px-2.5 py-1 text-[11px] uppercase tracking-wide text-muted-foreground dark:border-[#0b72ff]/28 dark:bg-[#061635]/34 dark:text-zinc-400">
                  Last 5
                </span>
              </div>
              <SessionsTable limit={5} variant="full" />
            </Panel>
          </section>
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
