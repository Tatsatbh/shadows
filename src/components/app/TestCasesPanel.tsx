"use client"

import { useState } from "react"
import { TestCaseBadge } from "@/components/ui/testcase-badge"
import { Terminal } from "lucide-react"
import type { TestCaseResult } from "@/hooks/useCodeSubmission"

// Shared with the agent store, which previously declared a different shape
// under the same name.
import type { TestCaseMetadata } from "@/lib/db-types"
export type { TestCaseMetadata }

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
      <div className="h-full w-full overflow-auto bg-card/85 dark:bg-[#05070a]/90 p-4">
        <pre className="font-mono text-sm whitespace-pre-wrap text-foreground">{fallbackOutput}</pre>
      </div>
    )
  }

  return (
    <div className="h-full w-full overflow-auto bg-card/85 dark:bg-[#05070a]/90 p-4">
      <div className="space-y-3">
        <h3 className="font-semibold text-sm mb-2 text-foreground flex items-center gap-2">
          <Terminal className="h-3.5 w-3.5 text-emerald-500" />
          Test Cases
        </h3>

        {/* Visible test cases */}
        {visibleTestCases.map((tc, idx) => {
          const result = results[idx]
          const isExpanded = expandedTestCases.has(idx)
          const isFailed = result?.status === "failed"

          return (
            <div key={tc.id} className="border border-border/60 dark:border-white/10 rounded-[6px] p-3 space-y-2 text-sm bg-muted/30 dark:bg-white/[0.035]">
              <div className="flex items-center justify-between">
                <div className="font-medium text-foreground">Test Case {idx + 1}</div>
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
                <span className="text-muted-foreground">Input: </span>
                <code className="bg-muted/30 dark:bg-white/[0.035] px-1 py-0.5 rounded text-xs text-foreground">{tc.input}</code>
              </div>
              <div>
                <span className="text-muted-foreground">Expected: </span>
                <code className="bg-muted/30 dark:bg-white/[0.035] px-1 py-0.5 rounded text-xs text-foreground">{tc.expected_output}</code>
              </div>
              {isFailed && isExpanded && result.actualOutput && (
                <div className="mt-2 pt-2 border-t border-border/60 dark:border-white/10 space-y-2">
                  <div>
                    <span className="text-rose-500 font-medium">Your Output: </span>
                    <code className="bg-rose-500/10 px-1 py-0.5 rounded text-xs text-rose-500">
                      {result.actualOutput}
                    </code>
                  </div>
                  {result.stderr && (
                    <div>
                      <span className="text-rose-500 font-medium">Error: </span>
                      <code className="bg-rose-500/10 px-1 py-0.5 rounded text-xs text-rose-500">{result.stderr}</code>
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
            <div key={tc.id} className="border border-border/60 dark:border-white/10 rounded-[6px] p-3 space-y-2 text-sm bg-muted/20 dark:bg-white/[0.02]">
              <div className="flex items-center justify-between">
                <div className="font-medium flex items-center gap-2 text-foreground">
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
              <div className="text-muted-foreground text-xs">Test case details are hidden</div>
              {isFailed && isExpanded && result.actualOutput && (
                <div className="mt-2 pt-2 border-t border-border/60 dark:border-white/10 space-y-2">
                  <div>
                    <span className="text-rose-500 font-medium">Your Output: </span>
                    <code className="bg-rose-500/10 px-1 py-0.5 rounded text-xs text-rose-500">
                      {result.actualOutput}
                    </code>
                  </div>
                  {result.stderr && (
                    <div>
                      <span className="text-rose-500 font-medium">Error: </span>
                      <code className="bg-rose-500/10 px-1 py-0.5 rounded text-xs text-rose-500">{result.stderr}</code>
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
