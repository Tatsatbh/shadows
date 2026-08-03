"use client"

import { cn } from "@/lib/utils"

export type DifficultyLevel = "All" | "Easy" | "Medium" | "Hard"

interface DifficultyFilterProps {
  value: DifficultyLevel
  onChange: (value: DifficultyLevel) => void
  className?: string
}

export function DifficultyFilter({ value, onChange, className }: DifficultyFilterProps) {
  const options: { label: DifficultyLevel; activeClass: string; inactiveClass: string }[] = [
    {
      label: "All",
      activeClass: "bg-black text-white dark:bg-white dark:text-black border-transparent shadow-sm",
      inactiveClass: "text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground border-transparent"
    },
    {
      label: "Easy",
      activeClass: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 ring-1 ring-emerald-500/20",
      inactiveClass: "text-muted-foreground hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 border-transparent"
    },
    {
      label: "Medium",
      activeClass: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 ring-1 ring-amber-500/20",
      inactiveClass: "text-muted-foreground hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400 border-transparent"
    },
    {
      label: "Hard",
      activeClass: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30 ring-1 ring-rose-500/20",
      inactiveClass: "text-muted-foreground hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400 border-transparent"
    }
  ]

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {options.map((opt) => {
        const isActive = value === opt.label
        return (
          <button
            key={opt.label}
            onClick={() => onChange(opt.label)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-[13px] font-medium transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              isActive ? opt.activeClass : opt.inactiveClass
            )}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
