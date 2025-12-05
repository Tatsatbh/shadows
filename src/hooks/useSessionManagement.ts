"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"

export interface UseSessionManagementOptions {
  sessionId: string
  questionUri: string
}

export interface UseSessionManagementReturn {
  sessionValidated: boolean
  sessionStartedAt: string | null
  showLeaveWarning: boolean
  setShowLeaveWarning: (show: boolean) => void
  handleConfirmLeave: () => Promise<void>
  handleCancelLeave: () => void
  disableLeaveWarning: () => void
}

export function useSessionManagement({
  sessionId,
  questionUri,
}: UseSessionManagementOptions): UseSessionManagementReturn {
  const [sessionValidated, setSessionValidated] = useState(false)
  const [sessionStartedAt, setSessionStartedAt] = useState<string | null>(null)
  const [showLeaveWarning, setShowLeaveWarning] = useState(false)
  const leaveWarningEnabledRef = useRef(true)
  const router = useRouter()

  // Validate and create session on mount
  useEffect(() => {
    const validateAndCreateSession = async () => {
      try {
        // First check if session already exists and belongs to user
        const validateRes = await fetch(`/api/interview-sessions?sessionId=${sessionId}`)
        const validateData = await validateRes.json()

        if (validateData.valid) {
          // Session exists and belongs to user - check if it's not abandoned/completed
          const sessionStatus = validateData.session?.status
          if (sessionStatus === "abandoned" || sessionStatus === "completed") {
            console.log(`Session is ${sessionStatus} - redirecting to dashboard`)
            router.replace("/dashboard")
            return
          }
          // Session is in_progress - allow access (e.g., page refresh)
          setSessionStartedAt(validateData.session?.started_at)
          setSessionValidated(true)
          return
        }

        // Session doesn't exist - check for creation token from dashboard
        const sessionToken = sessionStorage.getItem(`session_token_${sessionId}`)
        if (!sessionToken) {
          // No token = user tried to access URL directly without going through dashboard
          console.error("No session token found - direct URL access not allowed")
          router.replace("/dashboard")
          return
        }

        // Token exists - verify it's not too old (5 minute window)
        const tokenTime = parseInt(sessionToken, 10)
        const now = Date.now()
        const fiveMinutes = 5 * 60 * 1000
        if (now - tokenTime > fiveMinutes) {
          console.error("Session token expired")
          sessionStorage.removeItem(`session_token_${sessionId}`)
          router.replace("/dashboard")
          return
        }

        // Valid token - create the session
        const response = await fetch("/api/interview-sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            questionUri,
          }),
        })

        const responseData = await response.json()

        if (!response.ok) {
          console.error("Failed to create session:", responseData)
          sessionStorage.removeItem(`session_token_${sessionId}`)
          router.replace("/dashboard")
          return
        }

        // Clear the token after successful creation (one-time use)
        sessionStorage.removeItem(`session_token_${sessionId}`)
        setSessionStartedAt(responseData.session?.started_at || new Date().toISOString())
        setSessionValidated(true)
      } catch (error) {
        console.error("Error validating/creating session:", error)
        router.replace("/dashboard")
      }
    }

    validateAndCreateSession()
  }, [sessionId, questionUri, router])

  // Warn user before leaving page during active session and mark as abandoned if they leave
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Check ref synchronously - if disabled (intentional hang up), don't show warning or mark abandoned
      if (!leaveWarningEnabledRef.current) return
      
      // Mark session as abandoned using sendBeacon (works even when page is closing)
      navigator.sendBeacon(
        "/api/session-abandon",
        JSON.stringify({ sessionId })
      )
      
      e.preventDefault()
    }

    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [sessionId])

  const disableLeaveWarning = useCallback(() => {
    leaveWarningEnabledRef.current = false
  }, [])

  // Handle browser back button
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault()
      setShowLeaveWarning(true)
      // Push state back to prevent immediate navigation
      window.history.pushState(null, "", window.location.href)
    }

    // Push initial state
    window.history.pushState(null, "", window.location.href)
    window.addEventListener("popstate", handlePopState)

    return () => {
      window.removeEventListener("popstate", handlePopState)
    }
  }, [])

  const handleConfirmLeave = useCallback(async () => {
    // Mark session as abandoned
    try {
      await fetch("/api/interview-sessions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          status: "abandoned",
        }),
      })
    } catch (error) {
      console.error("Error updating session:", error)
    }

    // Navigate back
    setShowLeaveWarning(false)
    router.push("/dashboard")
  }, [sessionId, router])

  const handleCancelLeave = useCallback(() => {
    setShowLeaveWarning(false)
  }, [])

  return {
    sessionValidated,
    sessionStartedAt,
    showLeaveWarning,
    setShowLeaveWarning,
    handleConfirmLeave,
    handleCancelLeave,
    disableLeaveWarning,
  }
}
