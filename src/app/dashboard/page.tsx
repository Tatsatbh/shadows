"use client"

import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
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
        <header className="flex h-16 shrink-0 items-center gap-2 justify-between">
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
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            {isLoading && [...Array(6)].map((_, i) => (
              <InterviewCardSkeleton key={i} />
            ))}
            {error && <p>Error loading problems: {error.message}</p>}
            {problems?.map((problem: any) => (
              <InterviewCard
                key={problem.id}
                questionNumber={problem.question_number}
                title={problem.title}
                difficulty={problem.difficulty}
                onClick={() => handleJoinClick(problem)}
              />
            ))}
          </div>
          <div className="rounded-xl border bg-card flex-1 flex flex-col">
            <SessionsTable limit={5} />
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
