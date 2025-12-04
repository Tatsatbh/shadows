"use client"

import { Editor } from "@monaco-editor/react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import EditorCommandBar from "@/components/app/EditorCommandBar"

export type MicStatus = "ENABLED" | "DISABLED" | "RESTRICTED"

export interface EditorPanelProps {
  code: string
  language: string
  micStatus: MicStatus
  isRunning?: boolean
  onCodeChange: (code: string) => void
  onLanguageChange: (language: string) => void
  onRun: () => void
  onSubmit: () => void
}

export function EditorPanel({
  code,
  language,
  micStatus,
  isRunning = false,
  onCodeChange,
  onLanguageChange,
  onRun,
  onSubmit,
}: EditorPanelProps) {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-void-elevated">
      <EditorCommandBar
        language={language}
        onLanguageChange={onLanguageChange}
        onRun={onRun}
        onSubmit={onSubmit}
        isRunning={isRunning}
      />
      {micStatus === "RESTRICTED" && (
        <Alert variant="destructive" className="border-0 rounded-none">
          <AlertCircle className="" />
          <AlertTitle>Microphone Permission Denied</AlertTitle>
          <AlertDescription>
            Please enable microphone access in your browser settings to use voice features.
          </AlertDescription>
        </Alert>
      )}
      <div className="min-h-0 flex-1 border-t border-edge-subtle">
        <Editor
          language={language === "cpp" ? "cpp" : language}
          value={code}
          onChange={(value) => onCodeChange(value ?? "")}
          theme="vs-dark"
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
  )
}
