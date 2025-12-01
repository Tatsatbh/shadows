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

  const { data: sessions, isLoading, error } = useQuery({
    queryKey: ["recentSessions", userId, limit],
    queryFn: () => fetchRecentSessions(userId!, limit),
    enabled: !!userId,
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric',
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
    return `${minutes} min`
  }

  const getStatusBadge = (status: string) => {
    const statusColors = {
      completed: 'bg-green-100 text-green-800',
      in_progress: 'bg-blue-100 text-blue-800',
      abandoned: 'bg-gray-100 text-gray-800'
    }
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}>
        {status.replace('_', ' ')}
      </span>
    )
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
    return <div className="text-sm text-muted-foreground">Loading sessions...</div>
  }

  if (error) {
    return <div className="text-sm text-destructive">Error loading sessions</div>
  }

  if (!sessions || sessions.length === 0) {
    return <div className="text-sm text-muted-foreground">No recent sessions found</div>
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Problem</TableHead>
            <TableHead>Difficulty</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Started</TableHead>
            <TableHead>Duration</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sessions.map((session: any) => (
            <TableRow 
              key={session.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => router.push(`/problems/${session.questions?.title?.toLowerCase().replace(/\s+/g, '-')}/${session.id}`)}
            >
              <TableCell className="font-medium">
                {session.questions?.question_number}. {session.questions?.title}
              </TableCell>
              <TableCell>
                {session.questions?.difficulty && getDifficultyBadge(session.questions.difficulty)}
              </TableCell>
              <TableCell>{getStatusBadge(session.status)}</TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDate(session.started_at)}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {getDuration(session.started_at, session.ended_at)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
