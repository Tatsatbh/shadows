"use client"

import { useState } from "react"
import { TestCaseBadge } from "@/components/ui/testcase-badge"
import type { TestCaseResult } from "@/hooks/useCodeSubmission"

export interface TestCaseMetadata {
  id: string
  input: string
  expected_output: string
}

export interface HiddenTestCaseMetadata {
  id: string
}

export interface TestCasesPanelProps {
  visibleTestCases: TestCaseMetadata[]
  hiddenTestCases?: HiddenTestCaseMetadata[]
  results: TestCaseResult[]
  fallbackOutput?: string
}

export function TestCasesPanel({
  visibleTestCases,
  hiddenTestCases,
  results,
  fallbackOutput,
}: TestCasesPanelProps) {
  const [expandedTestCases, setExpandedTestCases] = useState<Set<number>>(new Set())

  const toggleTestCase = (idx: number) => {
    setExpandedTestCases((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(idx)) {
        newSet.delete(idx)
      } else {
        newSet.add(idx)
      }
      return newSet
    })
  }

  // If no test case metadata, show fallback output
  if (!visibleTestCases || visibleTestCases.length === 0) {
    return (
      <div className="h-full w-full overflow-auto bg-void-elevated p-4">
        <pre className="font-mono text-sm whitespace-pre-wrap text-light-primary">{fallbackOutput}</pre>
      </div>
    )
  }

  return (
    <div className="h-full w-full overflow-auto bg-void-elevated p-4">
      <div className="space-y-3">
        <h3 className="font-semibold text-sm mb-2 text-light-primary">Test Cases</h3>

        {/* Visible test cases */}
        {visibleTestCases.map((tc, idx) => {
          const result = results[idx]
          const isExpanded = expandedTestCases.has(idx)
          const isFailed = result?.status === "failed"

          return (
            <div key={tc.id} className="border border-edge-subtle rounded-md p-3 space-y-2 text-sm bg-void-card">
              <div className="flex items-center justify-between">
                <div className="font-medium text-light-primary">Test Case {idx + 1}</div>
                {result && (
                  <div
                    onClick={() => isFailed && toggleTestCase(idx)}
                    className={isFailed ? "cursor-pointer" : ""}
                  >
                    <TestCaseBadge name="" status={result.status} />
                  </div>
                )}
              </div>
              <div>
                <span className="text-light-muted">Input: </span>
                <code className="bg-void-elevated px-1 py-0.5 rounded text-xs text-light-primary">{tc.input}</code>
              </div>
              <div>
                <span className="text-light-muted">Expected: </span>
                <code className="bg-void-elevated px-1 py-0.5 rounded text-xs text-light-primary">{tc.expected_output}</code>
              </div>
              {isFailed && isExpanded && result.actualOutput && (
                <div className="mt-2 pt-2 border-t border-edge-subtle space-y-2">
                  <div>
                    <span className="text-indicator-danger font-medium">Your Output: </span>
                    <code className="bg-indicator-danger/10 px-1 py-0.5 rounded text-xs text-indicator-danger">
                      {result.actualOutput}
                    </code>
                  </div>
                  {result.stderr && (
                    <div>
                      <span className="text-indicator-danger font-medium">Error: </span>
                      <code className="bg-indicator-danger/10 px-1 py-0.5 rounded text-xs text-indicator-danger">{result.stderr}</code>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}

        {/* Hidden test cases */}
        {hiddenTestCases?.map((tc, i) => {
          const hiddenIdx = visibleTestCases.length + i
          const result = results[hiddenIdx]
          const isExpanded = expandedTestCases.has(hiddenIdx)
          const isFailed = result?.status === "failed"

          return (
            <div key={tc.id} className="border border-edge-subtle rounded-md p-3 space-y-2 text-sm bg-void-card/50">
              <div className="flex items-center justify-between">
                <div className="font-medium flex items-center gap-2 text-light-primary">
                  🔒 Hidden Test Case {hiddenIdx + 1}
                </div>
                {result && (
                  <div
                    onClick={() => isFailed && toggleTestCase(hiddenIdx)}
                    className={isFailed ? "cursor-pointer" : ""}
                  >
                    <TestCaseBadge name="" status={result.status} />
                  </div>
                )}
              </div>
              <div className="text-light-muted text-xs">Test case details are hidden</div>
              {isFailed && isExpanded && result.actualOutput && (
                <div className="mt-2 pt-2 border-t border-edge-subtle space-y-2">
                  <div>
                    <span className="text-indicator-danger font-medium">Your Output: </span>
                    <code className="bg-indicator-danger/10 px-1 py-0.5 rounded text-xs text-indicator-danger">
                      {result.actualOutput}
                    </code>
                  </div>
                  {result.stderr && (
                    <div>
                      <span className="text-indicator-danger font-medium">Error: </span>
                      <code className="bg-indicator-danger/10 px-1 py-0.5 rounded text-xs text-indicator-danger">{result.stderr}</code>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
