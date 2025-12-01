"use client"

import { Menubar } from "@/components/ui/menubar"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { LANGUAGE_OPTIONS } from "@/app/components/LanguageSelector"
import { Play } from "lucide-react"
import { cn } from "@/lib/utils"
type EditorCommandBarProps = {
  language: string
  onLanguageChange: (value: string) => void
  className?: string
  onSubmit?: () => void
  onRun?: () => void
  isRunning?: boolean
}

export default function EditorCommandBar({
  language,
  onLanguageChange,
  className,
  onSubmit,
  onRun,
  isRunning = false,
}: EditorCommandBarProps) {


  return (
    <Menubar
      className={cn(
        "h-9 w-full rounded-none border-none bg-white px-0 py-4 text-sm",
        className
      )}
    >
      <div className="flex items-center gap-2 px-2">
        <Select value={language} onValueChange={onLanguageChange}>
          <SelectTrigger className="h-7 w-40 rounded-sm bg-white py-0 text-xs shadow-none border-none text-[#007ACC] hover:bg-[#007ACC]/10 focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 ring-0 ring-offset-0 data-[state=open]:ring-0 data-[state=open]:ring-offset-0 [&>span]:font-semibold">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {LANGUAGE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} className="capitalize">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <Button
          size="icon"
          type="button"
          variant="ghost"
          className="h-7 w-7 p-0 text-[#007ACC] bg-transparent hover:bg-[#007ACC]/10 focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:opacity-50"
          aria-label="Run"
          onClick={onRun}
          disabled={isRunning}
        >
          <Play className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          type="button"
          variant="ghost"
          className="h-7 px-3 text-[#007ACC] text-xs bg-white hover:bg-[#007ACC]/10 focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:opacity-50"
          onClick={onSubmit}
          disabled={isRunning}
        >
          {isRunning ? "Running..." : "Submit"}
        </Button>
      </div>
    </Menubar>
  )
}
