"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { ArrowUpRight, PhoneCall } from "lucide-react"

interface InterviewCardProps {
  questionNumber: number
  title: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  /** One-line description of the problem. Falls back to generic copy when absent. */
  summary?: string | null
  onClick?: () => void
}

const DEFAULT_SUMMARY = "Start a voice-led room with live code review and tests."

const difficultyStyles = {
  Easy: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  Medium: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  Hard: "bg-rose-500/10 text-rose-500 border-rose-500/20",
}

export function InterviewCard({
  questionNumber,
  title,
  difficulty,
  summary,
  onClick,
}: InterviewCardProps) {
  return (
    <Card className="group h-full overflow-hidden rounded-[8px] border-border/70 bg-card/90 shadow-none transition-all hover:-translate-y-0.5 hover:border-blue-500/35 hover:shadow-[0_20px_70px_rgba(0,0,0,0.12)] dark:border-white/10 dark:bg-[#05070a]/90 dark:hover:shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
      <CardContent className="flex h-full min-h-[188px] flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="rounded-[4px] border-border/70 bg-muted/30 font-opencode text-[11px]">
              #{questionNumber}
            </Badge>
            <Badge
              variant="outline"
              className="rounded-[4px] border-blue-500/25 bg-blue-500/10 text-[11px] text-blue-500"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-500 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500" />
              </span>
              Live
            </Badge>
          </div>
          <Badge variant="outline" className={cn("rounded-[4px] text-[11px]", difficultyStyles[difficulty])}>
            {difficulty}
          </Badge>
        </div>

        <div className="mt-5 flex-1">
          <h3 className="line-clamp-2 text-base font-semibold leading-6 text-foreground">
            {title}
          </h3>
          <p className="mt-2 line-clamp-3 text-xs leading-5 text-muted-foreground">
            {summary || DEFAULT_SUMMARY}
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-5 h-9 w-full rounded-[4px] border-border/80 bg-muted/30 text-xs hover:border-blue-500/45 hover:bg-blue-500/10 hover:text-blue-500 dark:border-white/10 dark:bg-white/[0.035]"
          onClick={onClick}
        >
          <PhoneCall className="h-3 w-3" />
          Join Room
          <ArrowUpRight className="ml-auto h-3.5 w-3.5 opacity-60 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Button>
      </CardContent>
    </Card>
  )
}
