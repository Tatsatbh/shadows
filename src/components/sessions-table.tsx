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
import { useRouter } from "next/navigation"
import { SessionsTableSkeleton } from "@/components/skeletons"
import { Check, Loader2, X } from "lucide-react"

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
      Easy: 'bg-green-100 text-green-800',
      Medium: 'bg-yellow-100 text-yellow-800',
      Hard: 'bg-red-100 text-red-800'
    }
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyColors[difficulty as keyof typeof difficultyColors]}`}>
        {difficulty}
      </span>
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
      <span className={`pl-1 pr-2.5 py-1 rounded-full text-xs font-medium capitalize border ${statusColors[status] || 'bg-gray-500/10 text-gray-500 border-gray-500/20'} flex items-center gap-2 w-fit`}>
        <div className={`p-1 rounded-full ${iconWrapperStyles[status] || 'bg-gray-500/20'} flex items-center justify-center`}>
          {status === 'completed' && <Check className="w-3 h-3" />}
          {status === 'in_progress' && <Loader2 className="w-3 h-3 animate-spin" />}
          {status === 'abandoned' && <X className="w-3 h-3" />}
        </div>
        {displayStatus}
      </span>
    )
  }

  if (isLoading) {
    return <SessionsTableSkeleton />
  }

  if (!sessions || sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 h-full">
        <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
          <svg
            className="w-8 h-8 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-1">No sessions yet</h3>
        <p className="text-sm text-muted-foreground text-center max-w-xs">
          Pick a problem above and start your first coding interview session
        </p>
      </div>
    )
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Difficulty</TableHead>
            <TableHead>Problem</TableHead>
            <TableHead className="hidden sm:table-cell">Status</TableHead>
            <TableHead>Started</TableHead>
            <TableHead className="text-right hidden md:table-cell">Duration</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sessions.map((session) => {
            const isDisabled = session.status === 'abandoned' || session.status === 'in_progress'
            return (
              <TableRow
                key={session.id}
                className={isDisabled ? 'opacity-50 cursor-not-allowed h-16' : 'cursor-pointer hover:bg-muted/50 h-16'}
                onClick={() => {
                  if (isDisabled) return
                  if (session.status === 'completed') {
                    window.open(`/report/${session.id}`, '_blank', 'noopener,noreferrer')
                  }
                }}
              >
                <TableCell className="py-4">
                  {session.questions?.difficulty && getDifficultyBadge(session.questions.difficulty)}
                </TableCell>
                <TableCell className="py-4">
                  <div className="font-medium">
                    {session.questions?.question_number}. {session.questions?.title}
                  </div>
                </TableCell>
                <TableCell className="py-4 hidden sm:table-cell">
                  {getStatusBadge(session.status)}
                </TableCell>
                <TableCell className="py-4">{formatDate(session.started_at)}</TableCell>
                <TableCell className="text-right py-4 hidden md:table-cell">
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
