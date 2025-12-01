"use client"

import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { fetchProblems } from "@/lib/queries"
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
import { createClient } from "@/lib/supabase/client"

// Temporary company mapping for MVP - all companies for all problems
const ALL_COMPANIES = ['amazon', 'google', 'meta', 'microsoft', 'netflix']

export default function Page() {
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)
  
  const { data: problems, isLoading, error } = useQuery({
    queryKey: ["problems"],
    queryFn: fetchProblems,
  })

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.replace('/')
      } else {
        setIsChecking(false)
      }
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
        <header className="flex h-16 shrink-0 items-center gap-2">
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
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            {isLoading && <p>Loading problems...</p>}
            {error && <p>Error loading problems: {error.message}</p>}
            {problems?.map((problem) => (
              <InterviewCard
                key={problem.id}
                questionNumber={problem.question_number}
                title={problem.title}
                difficulty={problem.difficulty}
                questionUri={problem.question_uri}
                companies={ALL_COMPANIES}
                onClick={() => {
                  const sessionId = nanoid()
                  router.push(`/problems/${problem.question_uri}/${sessionId}`)
                }}
              />
            ))}
          </div>
          <div className="flex flex-col gap-4 p-6 rounded-xl bg-muted/50">
            <h2 className="text-2xl font-semibold">Recent Sessions</h2>
            <SessionsTable limit={10} />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
