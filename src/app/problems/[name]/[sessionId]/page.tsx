"use client"

import {
  LANGUAGE_OPTIONS,
  LanguageSelector,
} from "@/app/components/LanguageSelector"
import { Button } from "@/components/ui/button"
import { Editor } from "@monaco-editor/react"
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import {
  TranscriptProvider,
  useTranscript,
} from "@/app/contexts/TranscriptContext"
import { EventProvider, useEvent } from "@/app/contexts/EventContext"
import { useRealtimeSession } from "@/app/hooks/useRealtimeSession"
import { createModerationGuardrail } from "@/app/agentConfigs/guardrails"
import type { SessionStatus } from "@/app/types"
import type { RealtimeAgent } from "@openai/agents/realtime"
import { ResizablePanelGroup, ResizableHandle, ResizablePanel } from "@/components/ui/resizable"
import {useHotkeys} from 'react-hotkeys-hook'
type LanguageMeta = {
  judgeId: number
}
import {
  createInterviewerScenario,
  interviewerCompanyName,
} from "@/app/agentConfigs/myAgent"
import { defaultSnippet, useEditorStore, useQuestionStore } from "@/store"
import QuestionBar from "@/components/app/QuestionBar"
import CommandBar from "@/components/app/CommandBar"
import EditorCommandBar from "@/components/app/EditorCommandBar"
import { useParams, useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { fetchStarterCode, fetchTestCasesMetadata } from "@/lib/queries"
import { Badge } from "@/components/ui/badge"
import { TestCaseBadge } from "@/components/ui/testcase-badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
const LANGUAGE_META: Record<string, LanguageMeta> = {
  javascript: {
    judgeId: 63,
  },
  python: {
    judgeId: 71,
  },
  cpp: {
    judgeId: 54,
  },
}

type TestCaseStatus = "pending" | "passed" | "failed" | "running";

type TestCaseResult = {
  status: TestCaseStatus;
  actualOutput?: string;
  stderr?: string;
}

function EditorWithRealtime() {

  const [testCaseResults, setTestCaseResults] = useState<TestCaseResult[]>([])
  const [expandedTestCases, setExpandedTestCases] = useState<Set<number>>(new Set())
  const [showLeaveWarning, setShowLeaveWarning] = useState(false)
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null)
  const params = useParams()
  const router = useRouter()
  const sessionId = params.sessionId as string
  const language = useEditorStore((s) => s.language)
  const questionText = useQuestionStore((s) => s.questionText)

  const { data: starterCode, isLoading, isError, error } = useQuery({
    queryKey: ['language', language],
    queryFn: () => fetchStarterCode(language, params.name as string)
  })

  const { data: testCasesMetadata } = useQuery({
    queryKey: ['testCases', params.name],
    queryFn: () => fetchTestCasesMetadata(params.name as string)
  })

  useEffect(() => {
    setCode(starterCode?.code ?? defaultSnippet)
  }, [language, starterCode?.code])

  // Create session on mount
  useEffect(() => {
    const createSession = async () => {
      try {
        const response = await fetch('/api/interview-sessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            questionUri: params.name as string
          })
        })

        if (!response.ok) {
          const errorData = await response.json()
          console.error('Failed to create session:', errorData)
        } else {
          const data = await response.json()
          console.log('Session created successfully:', data)
        }
      } catch (error) {
        console.error('Error creating session:', error)
      }
    }

    createSession()
  }, [sessionId, params.name])

  // Warn user before leaving page during active session
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = "Are you sure you want to leave? Your session will be marked as abandoned."
      return "Are you sure you want to leave? Your session will be marked as abandoned."
    }

    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
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

  const handleConfirmLeave = async () => {
    // Mark session as abandoned
    try {
      await fetch('/api/interview-sessions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          status: 'abandoned'
        })
      })
    } catch (error) {
      console.error('Error updating session:', error)
    }

    // Navigate back
    setShowLeaveWarning(false)
    window.removeEventListener("beforeunload", () => {})
    router.push('/dashboard')
  }

  const handleCancelLeave = () => {
    setShowLeaveWarning(false)
    setPendingNavigation(null)
  }

  const setLanguage = useEditorStore((s) => s.setLanguage)
  const code = useEditorStore((s) => s.code)
  const output = useEditorStore((s) => s.output)
  const setCode = useEditorStore((s) => s.setCode)
  const setOutput = useEditorStore((s) => s.setOutput)
  const [isRunning, setIsRunning] = useState(false)
  const micStatus = useEditorStore((s) => s.micStatus)
  const setMicStatus = useEditorStore((s) => s.setMicStatus)
  const toggleMic = useEditorStore((s) => s.toggleMic)
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>(
    "DISCONNECTED"
  )
  const [isPTTActive, setIsPTTActive] = useState(false)
  const [isPTTUserSpeaking, setIsPTTUserSpeaking] = useState(false)

  const { addTranscriptBreadcrumb } = useTranscript()
  const { logClientEvent, logServerEvent } = useEvent()

  const handleConnectionChange = useCallback(
    (status: SessionStatus) => {
      setSessionStatus(status)
    },
    []
  )

  const sessionCallbacks = useMemo(
    () => ({ onConnectionChange: handleConnectionChange }),
    [handleConnectionChange]
  )

  const { connect, disconnect, sendEvent, interrupt, mute } =
    useRealtimeSession(sessionCallbacks)

  // Check mic permission on mount
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(() => {
        // Permission granted, keep as DISABLED initially
      })
      .catch((err) => {
        console.error("Microphone permission check failed:", err)
        setMicStatus("RESTRICTED")
      })
  }, [setMicStatus])

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

  const guardrail = useMemo(
    () => createModerationGuardrail(interviewerCompanyName),
    []
  )

  const scenarioAgents = useMemo<RealtimeAgent[]>(
    () => createInterviewerScenario(questionText),
    [questionText]
  )

  const isPTTActiveRef = useRef(isPTTActive)
  useEffect(() => {
    isPTTActiveRef.current = isPTTActive
  }, [isPTTActive])

  const addTranscriptBreadcrumbRef = useRef(addTranscriptBreadcrumb)
  type AddBreadcrumbArgs = Parameters<typeof addTranscriptBreadcrumb>
  const safeAddTranscriptBreadcrumb = useCallback(
    (...args: AddBreadcrumbArgs) => {
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

  useEffect(() => {
    if (!sdkAudioElement) return

    let cancelled = false

    const fetchEphemeralKey = async (): Promise<string | null> => {
      logClientEventRef.current?.(
        { url: "/session" },
        "fetch_session_token_request"
      )
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
          extraContext: {
            addTranscriptBreadcrumb: safeAddTranscriptBreadcrumb,
          },
        })

        const turnDetection = isPTTActiveRef.current
          ? null
          : {
              type: "server_vad" as const,
              threshold: 0.9,
              prefix_padding_ms: 300,
              silence_duration_ms: 1200,
              create_response: true,
            }

        sendEvent({
          type: "session.update",
          session: {
            turn_detection: turnDetection,
          },
        })

        // Trigger the agent to speak first
        setTimeout(() => {
          sendEvent({
            type: "response.create",
          })
        }, 500)
      } catch (err) {
        console.error("Realtime connect (editor) failed:", err)
        setSessionStatus("DISCONNECTED")
      }
    }

    connectSession()

    return () => {
      cancelled = true
      disconnect()
    }
  }, [
    connect,
    disconnect,
    guardrail,
    scenarioAgents,
    sdkAudioElement,
    sendEvent,
  ])

  useEffect(() => {
    if (sessionStatus !== "CONNECTED") return

    const turnDetection = isPTTActive
      ? null
      : {
        type: "server_vad" as const,
        threshold: 0.9,
        prefix_padding_ms: 300,
        silence_duration_ms: 1200,
        create_response: true,
      }

    sendEvent({
      type: "session.update",
      session: {
        turn_detection: turnDetection,
      },
    })
  }, [isPTTActive, sessionStatus, sendEvent])

  useEffect(() => {
    if (sessionStatus !== "CONNECTED") return
    
    // Check mic permission when trying to enable
    if (micStatus === "ENABLED") {
      navigator.mediaDevices.getUserMedia({ audio: true })
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

  // const handleTalkButtonDown = useCallback(() => {
  //   if (sessionStatus !== "CONNECTED" || !isPTTActive) return

  //   interrupt()
  //   setIsPTTUserSpeaking(true)
  //   sendEvent({ type: "input_audio_buffer.clear" })
  // }, [interrupt, isPTTActive, sendEvent, sessionStatus])

  // const handleTalkButtonUp = useCallback(() => {
  //   if (
  //     sessionStatus !== "CONNECTED" ||
  //     !isPTTActive ||
  //     !isPTTUserSpeaking
  //   ) {
  //     return
  //   }

  //   setIsPTTUserSpeaking(false)
  //   sendEvent({ type: "input_audio_buffer.commit" })
  //   sendEvent({ type: "response.create" })
  // }, [isPTTActive, isPTTUserSpeaking, sendEvent, sessionStatus])

  // const handlePTTToggle = useCallback(
  //   (checked: boolean) => {
  //     setIsPTTActive(checked)
  //     if (!checked) {
  //       setIsPTTUserSpeaking(false)
  //     }
  //   },
  //   []
  // )

  // const selectedLanguageLabel = useMemo(
  //   () => LANGUAGE_OPTIONS.find((option) => option.value === language)?.label,
  //   [language]
  // )

  function toBase64(str: string): string {
    const utf8Bytes = new TextEncoder().encode(str);
    const binaryString = Array.from(utf8Bytes, byte => String.fromCharCode(byte)).join('');
    return btoa(binaryString);
  }

  function fromBase64(base64: string): string {
    const binaryString = atob(base64);
    const bytes = Uint8Array.from(binaryString, char => char.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  }

  const toggleTestCase = (idx: number) => {
    setExpandedTestCases(prev => {
      const newSet = new Set(prev);
      if (newSet.has(idx)) {
        newSet.delete(idx);
      } else {
        newSet.add(idx);
      }
      return newSet;
    });
  };

  const runCode = async () => {
    const languageMeta = LANGUAGE_META[language];
    setIsRunning(true);
    setOutput("Submitting code...");

    const finalSource = [starterCode?.imports, code, starterCode?.main]
      .filter(Boolean)
      .join("\n");

    try {

      const submitRes = await fetch('/api/submission', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          judgeId: languageMeta.judgeId,
          code: finalSource,
          questionUri: params.name as string,
          sessionId: sessionId
        })
      });

      if (!submitRes.ok) {
        const errorText = await submitRes.text();
        setOutput(`Submission failed: ${submitRes.status}\n${errorText}`);
        return;
      }

      const { tokens, testCaseCount, questionId, code: submittedCode } = await submitRes.json();

      if (!tokens || tokens.length === 0) {
        setOutput("Error: No tokens received");
        return;
      }

      const initialResults: TestCaseResult[] = Array.from({ length: testCaseCount }, () => ({ status: 'running' }));
      setTestCaseResults(initialResults);
      const maxAttempts = 10;
      const pollInterval = 1500;

      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        await new Promise(resolve => setTimeout(resolve, pollInterval));

        // Pass all required data for saving submission
        const queryParams = new URLSearchParams({
          tokens: tokens.join(','),
          sessionId,
          questionId,
          code: submittedCode,
          language
        });

        const resultsRes = await fetch(`/api/submission?${queryParams}`);

        if (!resultsRes.ok) {
          setOutput(`Failed to fetch results: ${resultsRes.status}`);
          return;
        }

        const data = await resultsRes.json();
        const results: TestCaseResult[] = data.submissions.map((sub: any) => {
          const isDone = sub.status.id > 2;
          if (!isDone) return { status: 'running' as TestCaseStatus };
          
          const status: TestCaseStatus = sub.status?.id === 3 ? 'passed' : 'failed';
          
          // Truncate stderr to prevent massive error dumps from brute force test cases
          const fullStderr = sub.stderr ? fromBase64(sub.stderr) : "";
          const MAX_STDERR_LENGTH = 500;
          const stderr = fullStderr.length > MAX_STDERR_LENGTH 
            ? fullStderr.slice(0, MAX_STDERR_LENGTH) + "\n\n... (error message truncated)"
            : fullStderr;
          
          return {
            status,
            actualOutput: sub.stdout ? fromBase64(sub.stdout) : "",
            stderr
          };
        });

        setTestCaseResults(results);
        const allDone = data.submissions.every((sub: any) => sub.status.id > 2);

        if (allDone) {
          return;
        }

        if (attempt === maxAttempts - 1) {
          setOutput("Timeout - Partial results");
          return;
        }
      }
      setOutput("Timeout: Results took too long");
    } catch (error) {
      console.error("runCode error:", error);
      setOutput("Error running code. Please try again.");
    } finally {
      setIsRunning(false);
    }
  };

  useHotkeys('mod+enter', (event) => {
    event.preventDefault();
    runCode();
  }, {enableOnFormTags: true})

  useHotkeys('mod+m', (event) => {
    event.preventDefault();
    toggleMic();
  }, {enableOnFormTags: true})
  return (
    <div className="h-screen w-full flex flex-col">
      <AlertDialog open={showLeaveWarning} onOpenChange={setShowLeaveWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to leave?</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div>
                <p>If you leave now:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Your credits will be used</li>
                  <li>The session will be marked as abandoned</li>
                  <li>You will not be able to resume your progress</li>
                  <li>No evaluation report will be generated</li>
                </ul>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelLeave}>
              Stay in Session
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmLeave}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Leave Session
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <CommandBar testResults={testCaseResults} />
      <ResizablePanelGroup
        direction="horizontal"
        className="w-full h-screen rounded-lg border md:min-w-[450px]"
      >
        <ResizablePanel defaultSize={40}>
          <div className="flex h-full w-full items-center justify-center">
            <QuestionBar />
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={60}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={75}>
              <div className="flex h-full w-full flex-col overflow-hidden">
                <EditorCommandBar
                  language={language}
                  onLanguageChange={setLanguage}
                  onRun={runCode}
                  onSubmit={runCode}
                />
                {micStatus === "RESTRICTED" && (
                  <Alert variant="destructive" className="border-0 rounded-none">
                    <AlertCircle className=""/>
                    <AlertTitle>Microphone Permission Denied</AlertTitle>
                    <AlertDescription>
                      Please enable microphone access in your browser settings to use voice features.
                    </AlertDescription>
                  </Alert>
                )}
                <div className="min-h-0 flex-1 border-t border-[#F0F0F0]">
                  <Editor
                    language={language === "cpp" ? "cpp" : language}
                    value={code}
                    onChange={(value) => setCode(value ?? "")}
                    theme="vs"
                    height="100%"
                    options={{
                      fontSize: 14,
                      fontLigatures: true,
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                      smoothScrolling: true,
                      wordWrap: "on",
                      automaticLayout: true,
                      padding: { top: 6 },
                    }}
                  />
                </div>
              </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={25}>
              <div className="h-full w-full overflow-auto bg-background p-4">
                {testCasesMetadata ? (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-sm mb-2">Test Cases</h3>
                    {testCasesMetadata.visibleTestCases.map((tc, idx) => {
                      const result = testCaseResults[idx];
                      const isExpanded = expandedTestCases.has(idx);
                      const isFailed = result?.status === 'failed';
                      
                      return (
                        <div key={tc.id} className="border rounded-md p-3 space-y-2 text-sm">
                          <div className="flex items-center justify-between">
                            <div className="font-medium">Test Case {idx + 1}</div>
                            {result && (
                              <div 
                                onClick={() => isFailed && toggleTestCase(idx)}
                                className={isFailed ? "cursor-pointer" : ""}
                              >
                                <TestCaseBadge 
                                  name="" 
                                  status={result.status}
                                />
                              </div>
                            )}
                          </div>
                          <div>
                            <span className="text-muted-foreground">Input: </span>
                            <code className="bg-muted px-1 py-0.5 rounded text-xs">{tc.input}</code>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Expected: </span>
                            <code className="bg-muted px-1 py-0.5 rounded text-xs">{tc.expected_output}</code>
                          </div>
                          {isFailed && isExpanded && result.actualOutput && (
                            <div className="mt-2 pt-2 border-t space-y-2">
                              <div>
                                <span className="text-red-600 font-medium">Your Output: </span>
                                <code className="bg-red-50 px-1 py-0.5 rounded text-xs">{result.actualOutput}</code>
                              </div>
                              {result.stderr && (
                                <div>
                                  <span className="text-red-600 font-medium">Error: </span>
                                  <code className="bg-red-50 px-1 py-0.5 rounded text-xs">{result.stderr}</code>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                    {testCasesMetadata.hiddenTestCases?.map((tc, i) => {
                        const hiddenIdx = testCasesMetadata.visibleTestCases.length + i;
                        const result = testCaseResults[hiddenIdx];
                        const isExpanded = expandedTestCases.has(hiddenIdx);
                        const isFailed = result?.status === 'failed';
                        
                        return (
                          <div key={tc.id} className="border rounded-md p-3 space-y-2 text-sm bg-muted/30">
                            <div className="flex items-center justify-between">
                              <div className="font-medium flex items-center gap-2">
                                🔒 Hidden Test Case {hiddenIdx + 1}
                              </div>
                              {result && (
                                <div 
                                  onClick={() => isFailed && toggleTestCase(hiddenIdx)}
                                  className={isFailed ? "cursor-pointer" : ""}
                                >
                                  <TestCaseBadge 
                                    name="" 
                                    status={result.status}
                                  />
                                </div>
                              )}
                            </div>
                            <div className="text-muted-foreground text-xs">
                              Test case details are hidden
                            </div>
                            {isFailed && isExpanded && result.actualOutput && (
                              <div className="mt-2 pt-2 border-t space-y-2">
                                <div>
                                  <span className="text-red-600 font-medium">Your Output: </span>
                                  <code className="bg-red-50 px-1 py-0.5 rounded text-xs">{result.actualOutput}</code>
                                </div>
                                {result.stderr && (
                                  <div>
                                    <span className="text-red-600 font-medium">Error: </span>
                                    <code className="bg-red-50 px-1 py-0.5 rounded text-xs">{result.stderr}</code>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                ) : (
                  <pre className="font-mono text-sm whitespace-pre-wrap">{output}</pre>
                )}
              </div>
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

