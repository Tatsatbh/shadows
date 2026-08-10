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
      activeClass: "border-[#0b72ff]/50 bg-[#0b72ff]/12 text-[#0b72ff] dark:text-[#58a0ff] dark:shadow-[0_0_20px_rgba(0,112,255,0.18)]",
      inactiveClass: "border-transparent text-muted-foreground hover:border-[#0b72ff]/30 hover:text-[#0b72ff] dark:hover:text-[#58a0ff]"
    },
    {
      label: "Easy",
      activeClass: "border-emerald-500/40 bg-emerald-500/12 text-emerald-600 dark:text-emerald-300 dark:shadow-[0_0_20px_rgba(16,185,129,0.14)]",
      inactiveClass: "border-transparent text-muted-foreground hover:border-emerald-500/30 hover:text-emerald-600 dark:hover:text-emerald-300"
    },
    {
      label: "Medium",
      activeClass: "border-amber-500/40 bg-amber-500/12 text-amber-600 dark:text-amber-300 dark:shadow-[0_0_20px_rgba(245,158,11,0.14)]",
      inactiveClass: "border-transparent text-muted-foreground hover:border-amber-500/30 hover:text-amber-600 dark:hover:text-amber-300"
    },
    {
      label: "Hard",
      activeClass: "border-rose-500/40 bg-rose-500/12 text-rose-500 dark:text-rose-300 dark:shadow-[0_0_20px_rgba(244,63,94,0.14)]",
      inactiveClass: "border-transparent text-muted-foreground hover:border-rose-500/30 hover:text-rose-500 dark:hover:text-rose-300"
    }
  ]

  return (
    <div
      className={cn(
        "inline-flex flex-wrap items-center gap-1 rounded-[7px] border border-border bg-muted/25 p-1 dark:border-[#0b72ff]/24 dark:bg-[#061635]/28",
        className
      )}
    >
      {options.map((opt) => {
        const isActive = value === opt.label
        return (
          <button
            key={opt.label}
            onClick={() => onChange(opt.label)}
            className={cn(
              "font-jetbrains rounded-[5px] border px-3.5 py-1.5 text-[11px] uppercase tracking-wide transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[#4a9bff]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
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
