"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { TranscriptProvider, useTranscript } from "@/app/contexts/TranscriptContext"
import { EventProvider, useEvent } from "@/app/contexts/EventContext"
import { useRealtimeSession } from "@/app/hooks/useRealtimeSession"
import { createModerationGuardrail } from "@/app/agentConfigs/guardrails"
import type { SessionStatus } from "@/app/types"
import type { RealtimeAgent } from "@openai/agents/realtime"
import { ResizablePanelGroup, ResizableHandle, ResizablePanel } from "@/components/ui/resizable"
import { useHotkeys } from "react-hotkeys-hook"
import { useSessionTimer } from "@/hooks/useSessionTimer"
import TimeExpiredModal from "@/components/app/TimeExpiredModal"
import { createInterviewerScenario, interviewerCompanyName } from "@/app/agentConfigs/myAgent"
import { defaultSnippet, useEditorStore, useQuestionStore } from "@/store"
import QuestionBar from "@/components/app/QuestionBar"
import CommandBar from "@/components/app/CommandBar"
import { useParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { fetchStarterCode, fetchTestCasesMetadata } from "@/lib/queries"

// Extracted hooks and components
import { useSessionManagement } from "@/hooks/useSessionManagement"
import { useCodeSubmission } from "@/hooks/useCodeSubmission"
import { LeaveWarningDialog } from "@/components/app/LeaveWarningDialog"
import { TestCasesPanel } from "@/components/app/TestCasesPanel"
import { EditorPanel } from "@/components/app/EditorPanel"

const SESSION_DURATION_MINUTES = 15

function EditorWithRealtime() {
  const params = useParams()
  const sessionId = params.sessionId as string
  const questionUri = params.name as string

  // Zustand stores
  const language = useEditorStore((s) => s.language)
  const setLanguage = useEditorStore((s) => s.setLanguage)
  const code = useEditorStore((s) => s.code)
  const setCode = useEditorStore((s) => s.setCode)
  const micStatus = useEditorStore((s) => s.micStatus)
  const setMicStatus = useEditorStore((s) => s.setMicStatus)
  const toggleMic = useEditorStore((s) => s.toggleMic)
  const questionText = useQuestionStore((s) => s.questionText)

  // Transcript context
  const { addTranscriptBreadcrumb, transcriptItems } = useTranscript()
  const { logClientEvent, logServerEvent } = useEvent()

  // Session management hook
  const {
    sessionValidated,
    sessionStartedAt,
    showLeaveWarning,
    setShowLeaveWarning,
    handleConfirmLeave,
    handleCancelLeave,
  } = useSessionManagement({ sessionId, questionUri })

  // Data queries
  const { data: testCasesMetadata } = useQuery({
    queryKey: ["testCases", questionUri],
    queryFn: () => fetchTestCasesMetadata(questionUri),
    enabled: sessionValidated,
  })

  // Build test case metadata for agent store
  const testCaseMetadataForStore = useMemo(() => {
    if (!testCasesMetadata) return []
    const visible = testCasesMetadata.visibleTestCases.map((tc) => ({
      input: tc.input,
      expectedOutput: tc.expected_output,
      hidden: false,
    }))
    const hidden = testCasesMetadata.hiddenTestCases.map(() => ({
      input: "[Hidden]",
      expectedOutput: "[Hidden]",
      hidden: true,
    }))
    return [...visible, ...hidden]
  }, [testCasesMetadata])

  // Code submission hook
  const { testCaseResults, isRunning, output, runCode } = useCodeSubmission({
    sessionId,
    questionUri,
    sessionStartedAt,
    testCaseMetadata: testCaseMetadataForStore,
  })

  // Starter code query
  const { data: starterCode } = useQuery({
    queryKey: ["language", language],
    queryFn: () => fetchStarterCode(language, questionUri),
    enabled: sessionValidated,
  })

  // Update code when language/starter code changes
  useEffect(() => {
    setCode(starterCode?.code ?? defaultSnippet)
  }, [language, starterCode?.code, setCode])

  // Auto-submit state
  const [isAutoSubmitting, setIsAutoSubmitting] = useState(false)

  // Auto-submit handler for when timer expires
  const handleAutoSubmit = useCallback(async () => {
    if (isAutoSubmitting) return
    setIsAutoSubmitting(true)

    try {
      const sessionStartMs = sessionStartedAt ? new Date(sessionStartedAt).getTime() : null
      const transcript = transcriptItems
        .filter((item) => item.type === "MESSAGE" && !item.isHidden)
        .map((item) => {
          if (sessionStartMs && item.createdAtMs) {
            const elapsedSeconds = Math.floor((item.createdAtMs - sessionStartMs) / 1000)
            const mins = Math.floor(elapsedSeconds / 60)
            const secs = elapsedSeconds % 60
            const timestamp = `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
            return `[${timestamp}] ${item.role}: ${item.title}`
          }
          return `${item.role}: ${item.title}`
        })
        .join("\n")

      const response = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          transcript,
          code: useEditorStore.getState().code,
          questionUri,
          testResults: testCaseResults || [],
          metadata: {
            questionUri,
            language: useEditorStore.getState().language,
            duration: "30m 0s",
            autoSubmitted: true,
          },
        }),
      })

      if (response.ok) {
        window.location.href = `/report/${sessionId}`
      } else {
        console.error("Failed to generate report:", await response.text())
        setIsAutoSubmitting(false)
      }
    } catch (error) {
      console.error("Error during auto-submit:", error)
      setIsAutoSubmitting(false)
    }
  }, [isAutoSubmitting, sessionId, questionUri, testCaseResults, transcriptItems, sessionStartedAt])

  // Timer hook
  const timerEnabled = sessionValidated && sessionStartedAt !== null
  const { isExpired } = useSessionTimer({
    startedAt: sessionStartedAt || new Date().toISOString(),
    durationMinutes: SESSION_DURATION_MINUTES,
    onTimeExpired: handleAutoSubmit,
  })

  // Realtime connection state
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>("DISCONNECTED")
  const [isPTTActive, setIsPTTActive] = useState(false)

  const handleConnectionChange = useCallback((status: SessionStatus) => {
    setSessionStatus(status)
  }, [])

  const sessionCallbacks = useMemo(
    () => ({ onConnectionChange: handleConnectionChange }),
    [handleConnectionChange]
  )

  const { connect, disconnect, sendEvent, mute } = useRealtimeSession(sessionCallbacks)

  // Check mic permission on mount
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(() => {})
      .catch((err) => {
        console.error("Microphone permission check failed:", err)
        setMicStatus("RESTRICTED")
      })
  }, [setMicStatus])

  // Audio element for realtime SDK
  const sdkAudioElement = useMemo(() => {
    if (typeof window === "undefined") return undefined
    const el = document.createElement("audio")
    el.autoplay = true
    el.style.display = "none"
    document.body.appendChild(el)
    return el
  }, [])

  useEffect(() => {
    return () => {
      if (sdkAudioElement && document.body.contains(sdkAudioElement)) {
        document.body.removeChild(sdkAudioElement)
      }
    }
  }, [sdkAudioElement])

  const guardrail = useMemo(() => createModerationGuardrail(interviewerCompanyName), [])
  const scenarioAgents = useMemo<RealtimeAgent[]>(
    () => createInterviewerScenario(questionText),
    [questionText]
  )

  // Refs for stable callbacks
  const isPTTActiveRef = useRef(isPTTActive)
  useEffect(() => {
    isPTTActiveRef.current = isPTTActive
  }, [isPTTActive])

  const addTranscriptBreadcrumbRef = useRef(addTranscriptBreadcrumb)
  const safeAddTranscriptBreadcrumb = useCallback(
    (...args: Parameters<typeof addTranscriptBreadcrumb>) => {
      addTranscriptBreadcrumbRef.current?.(...args)
    },
    []
  )

  const logClientEventRef = useRef(logClientEvent)
  const logServerEventRef = useRef(logServerEvent)

  useEffect(() => {
    addTranscriptBreadcrumbRef.current = addTranscriptBreadcrumb
  }, [addTranscriptBreadcrumb])

  useEffect(() => {
    logClientEventRef.current = logClientEvent
  }, [logClientEvent])

  useEffect(() => {
    logServerEventRef.current = logServerEvent
  }, [logServerEvent])

  // Connect to realtime session
  useEffect(() => {
    if (!sdkAudioElement) return

    let cancelled = false

    const fetchEphemeralKey = async (): Promise<string | null> => {
      logClientEventRef.current?.({ url: "/session" }, "fetch_session_token_request")
      const tokenResponse = await fetch("/api/session")
      const data = await tokenResponse.json()
      logServerEventRef.current?.(data, "fetch_session_token_response")

      if (!data.client_secret?.value) {
        logClientEventRef.current?.(data, "error.no_ephemeral_key")
        console.error("No ephemeral key provided by the server")
        setSessionStatus("DISCONNECTED")
        return null
      }

      return data.client_secret.value
    }

    const connectSession = async () => {
      setSessionStatus("CONNECTING")
      try {
        const key = await fetchEphemeralKey()
        if (!key || cancelled) return

        await connect({
          getEphemeralKey: async () => key,
          initialAgents: scenarioAgents,
          audioElement: sdkAudioElement,
          outputGuardrails: [guardrail],
          extraContext: { addTranscriptBreadcrumb: safeAddTranscriptBreadcrumb },
        })

        if (cancelled) {
          disconnect()
          return
        }

        const turnDetection = isPTTActiveRef.current
          ? null
          : { type: "server_vad" as const, threshold: 0.9, prefix_padding_ms: 300, silence_duration_ms: 1200, create_response: true }

        sendEvent({ type: "session.update", session: { turn_detection: turnDetection } })
        setTimeout(() => {
          if (!cancelled) sendEvent({ type: "response.create" })
        }, 500)
      } catch (err) {
        if (cancelled) return
        console.error("Realtime connect failed:", err)
        setSessionStatus("DISCONNECTED")
      }
    }

    connectSession()
    return () => {
      cancelled = true
      disconnect()
    }
  }, [connect, disconnect, guardrail, scenarioAgents, sdkAudioElement, sendEvent, safeAddTranscriptBreadcrumb])

  // Update turn detection when PTT changes
  useEffect(() => {
    if (sessionStatus !== "CONNECTED") return
    const turnDetection = isPTTActive
      ? null
      : { type: "server_vad" as const, threshold: 0.9, prefix_padding_ms: 300, silence_duration_ms: 1200, create_response: true }
    sendEvent({ type: "session.update", session: { turn_detection: turnDetection } })
  }, [isPTTActive, sessionStatus, sendEvent])

  // Handle mic status changes
  useEffect(() => {
    if (sessionStatus !== "CONNECTED") return
    if (micStatus === "ENABLED") {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(() => {
          setMicStatus("ENABLED")
          mute(false)
        })
        .catch((err) => {
          console.error("Microphone permission denied:", err)
          setMicStatus("RESTRICTED")
        })
    } else {
      mute(true)
    }
  }, [micStatus, sessionStatus, mute, setMicStatus])

  // Run code handler
  const handleRunCode = useCallback(() => {
    runCode(code, language, starterCode)
  }, [runCode, code, language, starterCode])

  // Hotkeys
  useHotkeys("mod+enter", (e) => { e.preventDefault(); handleRunCode() }, { enableOnFormTags: true })
  useHotkeys("mod+m", (e) => { e.preventDefault(); toggleMic() }, { enableOnFormTags: true })

  // Loading state
  if (!sessionValidated) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="text-muted-foreground">Loading session...</div>
      </div>
    )
  }

  return (
    <div className="h-screen w-full flex flex-col">
      <LeaveWarningDialog
        open={showLeaveWarning}
        onOpenChange={setShowLeaveWarning}
        onConfirm={handleConfirmLeave}
        onCancel={handleCancelLeave}
      />
      <TimeExpiredModal isOpen={isExpired && timerEnabled} onAutoSubmit={handleAutoSubmit} />
      <CommandBar
        testResults={testCaseResults}
        sessionStartedAt={timerEnabled ? sessionStartedAt : null}
        durationMinutes={SESSION_DURATION_MINUTES}
        onTimeExpired={handleAutoSubmit}
      />
      <ResizablePanelGroup direction="horizontal" className="w-full h-screen rounded-lg border md:min-w-[450px]">
        <ResizablePanel defaultSize={40}>
          <div className="flex h-full w-full items-center justify-center">
            <QuestionBar />
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={60}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={75}>
              <EditorPanel
                code={code}
                language={language}
                micStatus={micStatus}
                isRunning={isRunning}
                onCodeChange={setCode}
                onLanguageChange={setLanguage}
                onRun={handleRunCode}
                onSubmit={handleRunCode}
              />
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={25}>
              <TestCasesPanel
                visibleTestCases={testCasesMetadata?.visibleTestCases || []}
                hiddenTestCases={testCasesMetadata?.hiddenTestCases}
                results={testCaseResults}
                fallbackOutput={output}
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

export default function EditorPage() {
  return (
    <TranscriptProvider>
      <EventProvider>
        <EditorWithRealtime />
      </EventProvider>
    </TranscriptProvider>
  )
}
