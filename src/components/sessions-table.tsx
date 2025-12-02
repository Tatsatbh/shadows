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
import { fetchRecentSessions } from "@/lib/queries"
import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

type Session = {
  id: string
  status: "in_progress" | "completed" | "abandoned"
  started_at: string
  ended_at: string | null
  questions: {
    question_number: number
    title: string
    difficulty: "Easy" | "Medium" | "Hard"
  } | null
}

interface SessionsTableProps {
  limit?: number
}

export function SessionsTable({ limit = 10 }: SessionsTableProps) {
  const [userId, setUserId] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const getUserId = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
      }
    }
    getUserId()
  }, [])

  const { data: sessions, isLoading } = useQuery({
    queryKey: ["recentSessions", userId, limit],
    queryFn: () => fetchRecentSessions(userId!, limit),
    enabled: !!userId,
  })

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

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Loading...</div>
  }

  if (!sessions || sessions.length === 0) {
    return <div className="text-sm text-muted-foreground">No sessions yet. Start solving problems!</div>
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
          {sessions.map((session: any) => {
            const isAbandoned = session.status === 'abandoned'
            return (
              <TableRow 
                key={session.id}
                className={isAbandoned ? 'opacity-50 cursor-not-allowed h-16' : 'cursor-pointer hover:bg-muted/50 h-16'}
                onClick={() => {
                  if (isAbandoned) return
                  if (session.status === 'completed') {
                    window.open(`/report/${session.id}`, '_blank', 'noopener,noreferrer')
                  } else {
                    const questionUri = session.questions?.title?.toLowerCase().replace(/\s+/g, '-') || ''
                    router.push(`/problems/${questionUri}/${session.id}`)
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
                <TableCell className="capitalize py-4 hidden sm:table-cell">
                  {session.status.replace('_', ' ')}
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
