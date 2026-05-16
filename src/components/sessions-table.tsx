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
}

export function SessionsTable({ limit }: SessionsTableProps) {
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
      Easy: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-500',
      Medium: 'border-amber-500/20 bg-amber-500/10 text-amber-500',
      Hard: 'border-rose-500/20 bg-rose-500/10 text-rose-500'
    }
    return (
      <Badge variant="outline" className={`rounded-[4px] text-[11px] ${difficultyColors[difficulty as keyof typeof difficultyColors]}`}>
        {difficulty}
      </Badge>
    )
  }

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      completed: 'bg-green-500/15 text-green-500 border-green-500/20',
      abandoned: 'bg-red-500/10 text-red-500 border-red-500/20',
      in_progress: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    }

    const iconWrapperStyles: Record<string, string> = {
      completed: 'bg-green-500/20',
      abandoned: 'bg-red-500/20',
      in_progress: 'bg-blue-500/20',
    }

    const displayStatus = status.replace('_', ' ')

    return (
      <Badge variant="outline" className={`rounded-[4px] py-1 pl-1 pr-2.5 text-[11px] capitalize ${statusColors[status] || 'bg-gray-500/10 text-gray-500 border-gray-500/20'} flex items-center gap-2 w-fit`}>
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
        <div className="mb-4 grid h-12 w-12 place-items-center rounded-[6px] border border-blue-500/25 bg-blue-500/10 text-blue-500">
          <FileText className="h-5 w-5" />
        </div>
        <h3 className="mb-1 text-base font-semibold text-foreground">No sessions yet</h3>
        <p className="max-w-xs text-sm leading-6 text-muted-foreground">
          Pick a problem above and start your first coding interview session
        </p>
      </div>
    )
  }

  return (
    <div className="min-w-0">
      <Table>
        <TableHeader className="bg-muted/25 dark:bg-white/[0.02]">
          <TableRow className="hover:bg-transparent">
            <TableHead className="h-11 px-4 text-[11px] uppercase">Difficulty</TableHead>
            <TableHead className="h-11 px-4 text-[11px] uppercase">Problem</TableHead>
            <TableHead className="hidden h-11 px-4 text-[11px] uppercase sm:table-cell">Status</TableHead>
            <TableHead className="h-11 px-4 text-[11px] uppercase">Started</TableHead>
            <TableHead className="hidden h-11 px-4 text-right text-[11px] uppercase md:table-cell">Duration</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sessions.map((session) => {
            const isDisabled = session.status === 'abandoned' || session.status === 'in_progress'
            return (
              <TableRow
                key={session.id}
                className={isDisabled ? 'h-16 cursor-not-allowed opacity-55' : 'group h-16 cursor-pointer hover:bg-blue-500/[0.045]'}
                onClick={() => {
                  if (isDisabled) return
                  if (session.status === 'completed') {
                    window.open(`/report/${session.id}`, '_blank', 'noopener,noreferrer')
                  }
                }}
              >
                <TableCell className="px-4 py-4">
                  {session.questions?.difficulty && getDifficultyBadge(session.questions.difficulty)}
                </TableCell>
                <TableCell className="px-4 py-4">
                  <div className="flex items-center gap-2 font-medium">
                    <span className="line-clamp-1">
                      {session.questions?.question_number}. {session.questions?.title}
                    </span>
                    {!isDisabled && <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-blue-500 opacity-0 transition-opacity group-hover:opacity-100" />}
                  </div>
                </TableCell>
                <TableCell className="hidden px-4 py-4 sm:table-cell">
                  {getStatusBadge(session.status)}
                </TableCell>
                <TableCell className="px-4 py-4 text-muted-foreground">{formatDate(session.started_at)}</TableCell>
                <TableCell className="hidden px-4 py-4 text-right font-opencode text-muted-foreground md:table-cell">
                  {getDuration(session.started_at, session.ended_at)}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
