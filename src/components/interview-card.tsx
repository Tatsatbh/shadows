"use client"

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
  Easy: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
  Medium: "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-300",
  Hard: "border-rose-500/30 bg-rose-500/10 text-rose-500 dark:text-rose-300",
}

export function InterviewCard({
  questionNumber,
  title,
  difficulty,
  summary,
  onClick,
}: InterviewCardProps) {
  return (
    <div className="group h-full overflow-hidden rounded-[8px] border border-border bg-card transition hover:-translate-y-0.5 hover:border-[#0b72ff]/45 hover:shadow-[0_16px_50px_rgba(0,0,0,0.1)] dark:border-[#0b72ff]/24 dark:bg-[#061635]/24 dark:hover:border-[#0b72ff]/55 dark:hover:shadow-[0_0_42px_rgba(0,112,255,0.16)]">
      <div className="flex h-full min-h-[188px] flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-pixel grid h-8 min-w-8 place-items-center rounded-[6px] border border-border bg-muted/30 px-1.5 text-xs text-muted-foreground dark:border-[#0b72ff]/40 dark:bg-[#04142d] dark:text-[#0877ff]">
              {questionNumber}
            </span>
            <span className="font-jetbrains inline-flex items-center gap-1.5 rounded-[5px] border border-[#0b72ff]/30 bg-[#0b72ff]/10 px-2 py-1 text-[10px] uppercase tracking-wide text-[#0b72ff] dark:text-[#58a0ff]">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#0b72ff] opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#0b72ff] dark:shadow-[0_0_10px_rgba(11,114,255,0.9)]" />
              </span>
              Live
            </span>
          </div>
          <span
            className={cn(
              "font-jetbrains rounded-[5px] border px-2 py-1 text-[10px] uppercase tracking-wide",
              difficultyStyles[difficulty]
            )}
          >
            {difficulty}
          </span>
        </div>

        <div className="mt-5 flex-1">
          <h3 className="line-clamp-2 text-base font-semibold leading-6 text-foreground dark:text-white">
            {title}
          </h3>
          <p className="mt-2 line-clamp-3 text-xs leading-5 text-muted-foreground dark:text-zinc-400">
            {summary || DEFAULT_SUMMARY}
          </p>
        </div>

        <button
          type="button"
          onClick={onClick}
          className="font-jetbrains mt-5 inline-flex h-9 w-full items-center gap-2 rounded-[6px] border border-border bg-muted/30 px-3 text-xs uppercase tracking-wide text-foreground transition hover:border-[#0b72ff]/50 hover:bg-[#0b72ff]/10 hover:text-[#0b72ff] dark:border-[#0b72ff]/35 dark:bg-[#061635]/45 dark:text-[#58a0ff] dark:hover:border-[#58a0ff]/70 dark:hover:bg-[#0b72ff]/16 dark:hover:shadow-[0_0_24px_rgba(0,112,255,0.2)]"
        >
          <PhoneCall className="h-3 w-3" />
          Join Room
          <ArrowUpRight className="ml-auto h-3.5 w-3.5 opacity-60 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  )
}
