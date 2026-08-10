"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useQuery } from "@tanstack/react-query"
import { fetchAllSessions } from "@/lib/queries"
import { createClient } from "@/lib/supabase/client"
import { useEffect, useState, useMemo } from "react"
import { SessionsTableSkeleton } from "@/components/skeletons"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, Check, FileText, Loader2, X } from "lucide-react"
import { asSessionStatus } from "@/lib/db-types"

type QuestionInfo = {
  question_number: number
  title: string
  difficulty: "Easy" | "Medium" | "Hard"
}

type SessionFromDB = {
  id: string
  status: "in_progress" | "completed" | "abandoned"
  started_at: string
  ended_at: string | null
  questions: QuestionInfo | QuestionInfo[] | null
}

type Session = Omit<SessionFromDB, 'questions'> & {
  questions: QuestionInfo | null
}

interface SessionsTableProps {
  limit?: number
  /**
   * 'compact' is for narrow containers such as the dashboard history rail.
   *
   * The column hiding below uses sm:/md:, which are VIEWPORT breakpoints. On a
   * wide screen they never trigger, so every column stayed visible even when the
   * table was rendered into a ~330px rail: the problem title clamped to "1....",
   * the date wrapped onto three lines, and the card scrolled sideways. Tailwind
   * container queries would be the general fix; this is an explicit opt-in that
   * needs no new dependency.
   */
  variant?: 'full' | 'compact'
}

export function SessionsTable({ limit, variant = 'full' }: SessionsTableProps) {
  const compact = variant === 'compact'
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const getUserId = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setUserId(user.id)
    }
    getUserId()
  }, [])

  const { data: allSessions, isLoading } = useQuery({
    queryKey: ["allSessions", userId],
    queryFn: () => fetchAllSessions(userId!),
    enabled: !!userId,
  })

  const sessions: Session[] = useMemo(() => {
    if (!allSessions) return []
    const normalized = allSessions.map((session): Session => ({
      ...session,
      status: asSessionStatus(session.status),
      questions: Array.isArray(session.questions)
        ? session.questions[0] ?? null
        : session.questions
    }))
    return limit ? normalized.slice(0, limit) : normalized
  }, [allSessions, limit])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getDuration = (startedAt: string, endedAt: string | null) => {
    if (!endedAt) return 'In Progress'
    const start = new Date(startedAt)
    const end = new Date(endedAt)
    const durationMs = end.getTime() - start.getTime()
    const minutes = Math.floor(durationMs / 60000)
    return `${minutes}m`
  }

  const getDifficultyBadge = (difficulty: string) => {
    const difficultyColors = {
      Easy: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300',
      Medium: 'border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-300',
      Hard: 'border-rose-500/30 bg-rose-500/10 text-rose-500 dark:text-rose-300'
    }
    return (
      <Badge variant="outline" className={`font-jetbrains rounded-[5px] text-[10px] uppercase tracking-wide ${difficultyColors[difficulty as keyof typeof difficultyColors]}`}>
        {difficulty}
      </Badge>
    )
  }

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      completed: 'bg-emerald-500/12 text-emerald-600 dark:text-emerald-300 border-emerald-500/30',
      abandoned: 'bg-rose-500/10 text-rose-500 dark:text-rose-300 border-rose-500/30',
      in_progress: 'bg-[#0b72ff]/10 text-[#0b72ff] dark:text-[#58a0ff] border-[#0b72ff]/30',
    }

    const iconWrapperStyles: Record<string, string> = {
      completed: 'bg-emerald-500/20',
      abandoned: 'bg-rose-500/20',
      in_progress: 'bg-[#0b72ff]/20',
    }

    const displayStatus = status.replace('_', ' ')

    return (
      <Badge variant="outline" className={`rounded-[5px] py-1 pl-1 pr-2.5 text-[11px] capitalize ${statusColors[status] || 'bg-gray-500/10 text-gray-500 border-gray-500/20'} flex items-center gap-2 w-fit`}>
        <span className={`rounded-[3px] p-1 ${iconWrapperStyles[status] || 'bg-gray-500/20'} flex items-center justify-center`}>
          {status === 'completed' && <Check className="w-3 h-3" />}
          {status === 'in_progress' && <Loader2 className="w-3 h-3 animate-spin" />}
          {status === 'abandoned' && <X className="w-3 h-3" />}
        </span>
        {displayStatus}
      </Badge>
    )
  }

  if (isLoading) {
    return <SessionsTableSkeleton />
  }

  if (!sessions || sessions.length === 0) {
    return (
      <div className="flex min-h-[360px] flex-col items-center justify-center px-6 py-16 text-center">
        <div className="mb-4 grid h-12 w-12 place-items-center rounded-[6px] border border-[#0b72ff]/40 bg-[#0b72ff]/10 text-[#0877ff] dark:bg-[#04142d] dark:shadow-[0_0_24px_rgba(0,112,255,0.18)]">
          <FileText className="h-5 w-5" />
        </div>
        <h3 className="mb-1 text-base font-semibold text-foreground dark:text-white">No sessions yet</h3>
        <p className="max-w-xs text-sm leading-6 text-muted-foreground dark:text-zinc-400">
          Pick a problem above and start your first coding interview session
        </p>
      </div>
    )
  }

  return (
    <div className="min-w-0">
      <Table>
        <TableHeader className="bg-muted/25 dark:bg-[#0b72ff]/[0.05]">
          <TableRow className="hover:bg-transparent dark:border-[#0b72ff]/18">
            {!compact && <TableHead className="font-jetbrains h-11 px-4 text-[10px] uppercase tracking-wider dark:text-zinc-500">Difficulty</TableHead>}
            <TableHead className="font-jetbrains h-11 px-4 text-[10px] uppercase tracking-wider dark:text-zinc-500">Problem</TableHead>
            <TableHead className={`font-jetbrains h-11 px-4 text-[10px] uppercase tracking-wider dark:text-zinc-500 ${compact ? '' : 'hidden sm:table-cell'}`}>Status</TableHead>
            <TableHead className="font-jetbrains h-11 whitespace-nowrap px-4 text-[10px] uppercase tracking-wider dark:text-zinc-500">Started</TableHead>
            {!compact && <TableHead className="font-jetbrains hidden h-11 px-4 text-right text-[10px] uppercase tracking-wider dark:text-zinc-500 md:table-cell">Duration</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sessions.map((session) => {
            const isDisabled = session.status === 'abandoned' || session.status === 'in_progress'
            return (
              <TableRow
                key={session.id}
                className={`dark:border-[#0b72ff]/14 ${isDisabled ? 'h-16 cursor-not-allowed opacity-55' : 'group h-16 cursor-pointer hover:bg-[#0b72ff]/[0.05]'}`}
                onClick={() => {
                  if (isDisabled) return
                  if (session.status === 'completed') {
                    window.open(`/report/${session.id}`, '_blank', 'noopener,noreferrer')
                  }
                }}
              >
                {!compact && (
                  <TableCell className="px-4 py-4">
                    {session.questions?.difficulty && getDifficultyBadge(session.questions.difficulty)}
                  </TableCell>
                )}
                <TableCell className="w-full max-w-0 px-4 py-4">
                  {/* min-w-0 on both the flex row and the span: without it a flex
                      child refuses to shrink below its content and the clamp
                      never gets a chance to work. */}
                  <div className="flex min-w-0 items-center gap-2 font-medium">
                    <span className="min-w-0 truncate">
                      {session.questions?.question_number}. {session.questions?.title}
                    </span>
                    {!isDisabled && <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-[#0b72ff] opacity-0 transition-opacity group-hover:opacity-100 dark:text-[#58a0ff]" />}
                  </div>
                </TableCell>
                <TableCell className={`px-4 py-4 ${compact ? '' : 'hidden sm:table-cell'}`}>
                  {getStatusBadge(session.status)}
                </TableCell>
                <TableCell className="whitespace-nowrap px-4 py-4 text-muted-foreground">
                  {formatDate(session.started_at)}
                </TableCell>
                {!compact && (
                  <TableCell className="font-jetbrains hidden px-4 py-4 text-right text-muted-foreground md:table-cell dark:text-zinc-400">
                    {getDuration(session.started_at, session.ended_at)}
                  </TableCell>
                )}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
