'use client'

import { memo, useSyncExternalStore, useCallback, useRef, useEffect } from "react"
import { TimerStyle, calculateRemainingSeconds, formatTime, getTimerStyle } from "@/lib/timer-utils"
import { cn } from "@/lib/utils"

interface TimerDisplayProps {
  formattedTime: string
  timerStyle: TimerStyle
}

const containerStyles: Record<TimerStyle, string> = {
  neutral: "bg-gray-900 text-white",
  warning: "bg-amber-500 text-white",
  urgent: "bg-red-600 text-white",
}

const dotStyles: Record<TimerStyle, string> = {
  neutral: "bg-green-500",
  warning: "bg-white",
  urgent: "bg-white",
}

function TimerDisplayInner({ formattedTime, timerStyle }: TimerDisplayProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2.5 px-3 py-1.5 rounded-md font-mono text-sm font-semibold shadow-sm",
        containerStyles[timerStyle]
      )}
    >
      {/* Pulsating live dot */}
      <span className="relative flex h-2.5 w-2.5">
        <span
          className={cn(
            "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
            dotStyles[timerStyle]
          )}
        />
        <span
          className={cn(
            "relative inline-flex rounded-full h-2.5 w-2.5",
            dotStyles[timerStyle]
          )}
        />
      </span>
      <span className="tracking-wider">{formattedTime}</span>
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
