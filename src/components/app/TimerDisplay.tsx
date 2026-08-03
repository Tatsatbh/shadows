'use client'

import { memo, useSyncExternalStore, useCallback, useRef, useEffect } from "react"
import { TimerStyle, calculateRemainingSeconds, formatTime, getTimerStyle } from "@/lib/timer-utils"
import { cn } from "@/lib/utils"

interface TimerDisplayProps {
  formattedTime: string
  timerStyle: TimerStyle
}

const containerStyles: Record<TimerStyle, string> = {
  neutral: "bg-card dark:bg-[#05070a]/90 text-foreground border border-border/70 dark:border-white/10",
  warning: "bg-amber-500/10 text-amber-500 border border-amber-500/25",
  urgent: "bg-rose-500/10 text-rose-500 border border-rose-500/25",
}

const dotStyles: Record<TimerStyle, string> = {
  neutral: "bg-emerald-500",
  warning: "bg-amber-500",
  urgent: "bg-rose-500",
}

function TimerDisplayInner({ formattedTime, timerStyle }: TimerDisplayProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 px-3 py-1 rounded-[4px] font-mono text-xs font-semibold transition-colors",
        containerStyles[timerStyle]
      )}
    >
      {/* Pulsating live dot */}
      <span className="relative flex h-2 w-2">
        <span
          className={cn(
            "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
            dotStyles[timerStyle]
          )}
        />
        <span
          className={cn(
            "relative inline-flex rounded-full h-2 w-2",
            dotStyles[timerStyle]
          )}
        />
      </span>
      <span className="tracking-widest tabular-nums">{formattedTime}</span>
    </div>
  )
}

// Memoize to prevent re-renders when parent re-renders but props haven't changed
const TimerDisplay = memo(TimerDisplayInner)

// Self-contained timer that manages its own state independently of React re-renders
interface SelfContainedTimerProps {
  startedAt: string
  durationMinutes?: number
  onTimeExpired?: () => void
}

export function SelfContainedTimer({ startedAt, durationMinutes = 30, onTimeExpired }: SelfContainedTimerProps) {
  const startDate = new Date(startedAt)
  const hasExpiredRef = useRef(false)
  const onTimeExpiredRef = useRef(onTimeExpired)
  
  useEffect(() => {
    onTimeExpiredRef.current = onTimeExpired
  }, [onTimeExpired])
  
  // Create a stable external store for the timer
  const subscribe = useCallback((callback: () => void) => {
    const interval = setInterval(callback, 1000)
    return () => clearInterval(interval)
  }, [])
  
  const getSnapshot = useCallback(() => {
    const remaining = calculateRemainingSeconds(startDate, durationMinutes)
    // Handle expiration
    if (remaining <= 0 && !hasExpiredRef.current) {
      hasExpiredRef.current = true
      // Defer callback to avoid calling during render
      setTimeout(() => onTimeExpiredRef.current?.(), 0)
    }
    return remaining
  }, [startDate, durationMinutes])
  
  const getServerSnapshot = useCallback(() => {
    return calculateRemainingSeconds(startDate, durationMinutes)
  }, [startDate, durationMinutes])
  
  const remainingSeconds = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  
  return (
    <TimerDisplay 
      formattedTime={formatTime(remainingSeconds)} 
      timerStyle={getTimerStyle(remainingSeconds)} 
    />
  )
}

export default TimerDisplay
