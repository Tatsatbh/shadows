"use client"

import { useCallback, useState, useRef } from "react"
import { useSubmissionStore, type TestCaseMetadata } from "@/store"

export type TestCaseStatus = "pending" | "passed" | "failed" | "running"

export interface TestCaseResult {
  status: TestCaseStatus
  actualOutput?: string
  stderr?: string
}

export interface StarterCode {
  code: string
  imports?: string
  main?: string
}

export interface UseCodeSubmissionOptions {
  sessionId: string
  questionUri: string
  sessionStartedAt: string | null
  testCaseMetadata?: TestCaseMetadata[]
  onTestsComplete?: (passed: number, total: number) => void
}

export interface UseCodeSubmissionReturn {
  testCaseResults: TestCaseResult[]
  isRunning: boolean
  output: string
  runCode: (code: string, language: string, starterCode: StarterCode | undefined) => Promise<void>
}

const LANGUAGE_META: Record<string, { judgeId: number }> = {
  javascript: { judgeId: 63 },
  python: { judgeId: 71 },
  cpp: { judgeId: 54 },
}

function fromBase64(base64: string): string {
  const binaryString = atob(base64)
  const bytes = Uint8Array.from(binaryString, (char) => char.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

export function useCodeSubmission({
  sessionId,
  questionUri,
  sessionStartedAt,
  testCaseMetadata = [],
  onTestsComplete,
}: UseCodeSubmissionOptions): UseCodeSubmissionReturn {
  const [testCaseResults, setTestCaseResults] = useState<TestCaseResult[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [output, setOutput] = useState("")
  const setLatestSubmission = useSubmissionStore((s) => s.setLatestSubmission)
  const testCaseMetadataRef = useRef(testCaseMetadata)

  const runCode = useCallback(
    async (code: string, language: string, starterCode: StarterCode | undefined) => {
      const languageMeta = LANGUAGE_META[language]
      if (!languageMeta) {
        setOutput(`Unsupported language: ${language}`)
        return
      }

      setIsRunning(true)
      setOutput("Submitting code...")

      const finalSource = [starterCode?.imports, code, starterCode?.main]
        .filter(Boolean)
        .join("\n")

      try {
        // Calculate elapsed time from session start
        const elapsedSeconds = sessionStartedAt
          ? Math.floor((Date.now() - new Date(sessionStartedAt).getTime()) / 1000)
          : 0

        const submitRes = await fetch("/api/submission", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            judgeId: languageMeta.judgeId,
            code: finalSource,
            questionUri,
            sessionId,
            timestamp: elapsedSeconds,
          }),
        })

        if (!submitRes.ok) {
          const errorText = await submitRes.text()
          setOutput(`Submission failed: ${submitRes.status}\n${errorText}`)
          return
        }

        const { tokens, testCaseCount, questionId, code: submittedCode } = await submitRes.json()

        if (!tokens || tokens.length === 0) {
          setOutput("Error: No tokens received")
          return
        }

        const initialResults: TestCaseResult[] = Array.from({ length: testCaseCount }, () => ({
          status: "running",
        }))
        setTestCaseResults(initialResults)

        const maxAttempts = 10
        const pollInterval = 1500

        for (let attempt = 0; attempt < maxAttempts; attempt++) {
          await new Promise((resolve) => setTimeout(resolve, pollInterval))

          // Pass all required data for saving submission
          const queryParams = new URLSearchParams({
            tokens: tokens.join(","),
            sessionId,
            questionId,
            code: submittedCode,
            language,
            timestamp: elapsedSeconds.toString(),
          })

          const resultsRes = await fetch(`/api/submission?${queryParams}`)

          if (!resultsRes.ok) {
            setOutput(`Failed to fetch results: ${resultsRes.status}`)
            return
          }

          const data = await resultsRes.json()
          const results: TestCaseResult[] = data.submissions.map((sub: any) => {
            const isDone = sub.status.id > 2
            if (!isDone) return { status: "running" as TestCaseStatus }

            const status: TestCaseStatus = sub.status?.id === 3 ? "passed" : "failed"

            // Truncate stderr to prevent massive error dumps
            const fullStderr = sub.stderr ? fromBase64(sub.stderr) : ""
            const MAX_STDERR_LENGTH = 500
            const stderr =
              fullStderr.length > MAX_STDERR_LENGTH
                ? fullStderr.slice(0, MAX_STDERR_LENGTH) + "\n\n... (error message truncated)"
                : fullStderr

            return {
              status,
              actualOutput: sub.stdout ? fromBase64(sub.stdout) : "",
              stderr,
            }
          })

          setTestCaseResults(results)
          const allDone = data.submissions.every((sub: any) => sub.status.id > 2)

          if (allDone) {
            // Sync to store for agent access
            const passed = results.filter((r) => r.status === "passed").length
            const summary = {
              total: results.length,
              passed,
              failed: results.filter((r) => r.status === "failed").length,
              running: results.filter((r) => r.status === "running").length,
            }
            setLatestSubmission({
              timestamp: Date.now(),
              results,
              testCases: testCaseMetadataRef.current,
              summary,
            })
            setOutput("")
            // Notify caller that tests are complete
            onTestsComplete?.(passed, results.length)
            return
          }

          if (attempt === maxAttempts - 1) {
            setOutput("Timeout - Partial results")
            return
          }
        }
        setOutput("Timeout: Results took too long")
      } catch (error) {
        console.error("runCode error:", error)
        setOutput("Error running code. Please try again.")
      } finally {
        setIsRunning(false)
      }
    },
    [sessionId, questionUri, sessionStartedAt, setLatestSubmission]
  )

  // Keep ref updated
  testCaseMetadataRef.current = testCaseMetadata

  return {
    testCaseResults,
    isRunning,
    output,
    runCode,
  }
}
