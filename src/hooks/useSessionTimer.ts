'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import {
  calculateRemainingSeconds,
  formatTime,
  getTimerStyle,
  TimerStyle,
} from '@/lib/timer-utils'

export interface UseSessionTimerOptions {
  startedAt: Date | string
  durationMinutes?: number
  onTimeExpired: () => void
}

export interface UseSessionTimerReturn {
  remainingSeconds: number
  formattedTime: string
  timerStyle: TimerStyle
  isExpired: boolean
}

/**
 * Custom hook for managing session countdown timer
 * @param options - Timer configuration options
 * @returns Timer state including remaining time, formatted display, and style
 */
export function useSessionTimer({
  startedAt,
  durationMinutes = 30,
  onTimeExpired,
}: UseSessionTimerOptions): UseSessionTimerReturn {
  const startDate = typeof startedAt === 'string' ? new Date(startedAt) : startedAt
  
  const [remainingSeconds, setRemainingSeconds] = useState(() =>
    calculateRemainingSeconds(startDate, durationMinutes)
  )
  
  const hasExpiredRef = useRef(false)
  const onTimeExpiredRef = useRef(onTimeExpired)
  
  // Keep callback ref updated
  useEffect(() => {
    onTimeExpiredRef.current = onTimeExpired
  }, [onTimeExpired])

  // Handle expiration
  const handleExpiration = useCallback(() => {
    if (!hasExpiredRef.current) {
      hasExpiredRef.current = true
      onTimeExpiredRef.current()
    }
  }, [])

  // Check for immediate expiration on mount
  useEffect(() => {
    const initial = calculateRemainingSeconds(startDate, durationMinutes)
    if (initial <= 0) {
      handleExpiration()
    }
  }, [startDate, durationMinutes, handleExpiration])

  // Update timer every second
  useEffect(() => {
    const interval = setInterval(() => {
      const newRemaining = calculateRemainingSeconds(startDate, durationMinutes)
      setRemainingSeconds(newRemaining)
      
      if (newRemaining <= 0) {
        handleExpiration()
        clearInterval(interval)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [startDate, durationMinutes, handleExpiration])

  return {
    remainingSeconds,
    formattedTime: formatTime(remainingSeconds),
    timerStyle: getTimerStyle(remainingSeconds),
    isExpired: remainingSeconds <= 0,
  }
}
