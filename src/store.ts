import { create } from "zustand"
import type { User } from '@supabase/supabase-js'

const defaultSnippet = `default`

const defaultOutput = "Run your code to see the output here."

const defaultLanguage = "cpp"

export type MicStatus = "ENABLED" | "DISABLED" | "RESTRICTED"

// Test case result types for agent access
export type TestCaseStatus = "pending" | "passed" | "failed" | "running"

export interface TestCaseResult {
  status: TestCaseStatus
  actualOutput?: string
  stderr?: string
}

export interface TestCaseMetadata {
  input: string
  expectedOutput: string
  hidden: boolean
}

export interface LatestSubmissionResult {
  timestamp: number
  results: TestCaseResult[]
  testCases: TestCaseMetadata[]
  summary: {
    total: number
    passed: number
    failed: number
    running: number
  }
}

type SubmissionStore = {
  latestSubmission: LatestSubmissionResult | null
  setLatestSubmission: (submission: LatestSubmissionResult | null) => void
  // Agent tool: get formatted test results for LLM consumption
  getTestResultsForAgent: () => string
}

export const useSubmissionStore = create<SubmissionStore>((set, get) => ({
  latestSubmission: null,
  setLatestSubmission: (submission) => set({ latestSubmission: submission }),
  getTestResultsForAgent: () => {
    const { latestSubmission } = get()
    if (!latestSubmission) {
      return "No submissions yet. The candidate has not run any code."
    }

    const { summary, results, testCases } = latestSubmission
    
    let output = `Latest Submission Results (${summary.passed}/${summary.total} passed):\n`
    
    results.forEach((result, idx) => {
      const tc = testCases[idx]
      const statusEmoji = result.status === "passed" ? "✓" : result.status === "failed" ? "✗" : "⏳"
      
      if (tc?.hidden) {
        output += `\n${statusEmoji} Test ${idx + 1} (Hidden): ${result.status}`
      } else {
        output += `\n${statusEmoji} Test ${idx + 1}: ${result.status}`
        output += `\n   Input: ${tc?.input || "N/A"}`
        output += `\n   Expected: ${tc?.expectedOutput || "N/A"}`
        if (result.status === "failed" && result.actualOutput) {
          output += `\n   Actual: ${result.actualOutput}`
        }
        if (result.stderr) {
          output += `\n   Error: ${result.stderr}`
        }
      }
    })

    return output
  }
}))

type EditorStore = {
  code: string
  output: string
  language: string
  micStatus: MicStatus
  setCode: (code: string) => void
  setOutput: (output: string) => void
  setLanguage: (language: string) => void
  setMicStatus: (status: MicStatus) => void
  toggleMic: () => void
}

type AuthStore = {
  user: User | null
  isLoading: boolean
  setUser: (user: User | null) => void
  clearUser: () => void
  setLoading: (loading: boolean) => void
}


type QuestionStore = {
  questionText: string
  setQuestionText: (text: string) => void
}

export const useQuestionStore = create<QuestionStore>((set) => ({
  questionText: "",
  setQuestionText: (text) => set({ questionText: text }),
}))

export const useEditorStore = create<EditorStore>((set) => ({
  code: defaultSnippet,
  output: defaultOutput,
  micStatus: "DISABLED",
  language: defaultLanguage,
  setCode: (code) => set({ code }),
  setOutput: (output) => set({ output }),
  setLanguage: (language) => set({language}),
  setMicStatus: (status) => set({ micStatus: status }),
  toggleMic: () => set((state) => ({ 
    micStatus: state.micStatus === "ENABLED" ? "DISABLED" : "ENABLED" 
  }))
}))

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user, isLoading: false }),
  clearUser: () => set({ user: null, isLoading: false }),
  setLoading: (loading) => set({ isLoading: loading })
}))

export { defaultSnippet, defaultOutput, defaultLanguage }
