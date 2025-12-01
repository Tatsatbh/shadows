import { create } from "zustand"
import type { User } from '@supabase/supabase-js'

const defaultSnippet = `bhosdike`

const defaultOutput = "Run your code to see the output here."

const defaultLanguage = "cpp"

export type MicStatus = "ENABLED" | "DISABLED" | "RESTRICTED"

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
