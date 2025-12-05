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
  onRun?: () => void
  isRunning?: boolean
}

export default function EditorCommandBar({
  language,
  onLanguageChange,
  className,
  onRun,
  isRunning = false,
}: EditorCommandBarProps) {


  return (
    <Menubar
      className={cn(
        "h-9 w-full rounded-none border-none bg-void-elevated px-0 py-4 text-sm border-b border-edge-subtle",
        className
      )}
    >
      <div className="flex items-center gap-2 px-2">
        <Select value={language} onValueChange={onLanguageChange}>
          <SelectTrigger className="h-7 w-40 rounded-sm bg-transparent py-0 text-xs shadow-none border-none text-light-primary hover:bg-white/5 focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 ring-0 ring-offset-0 data-[state=open]:ring-0 data-[state=open]:ring-offset-0 [&>span]:font-semibold">
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
      <div className="ml-auto flex items-center gap-2 px-2">
        <Button
          size="sm"
          type="button"
          variant="ghost"
          className="h-7 px-3 text-light-primary text-xs bg-transparent hover:bg-white/5 focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:opacity-50 flex items-center gap-1.5"
          onClick={onRun}
          disabled={isRunning}
        >
          <Play className="h-3.5 w-3.5" />
          {isRunning ? "Running..." : "Run"}
        </Button>
      </div>
    </Menubar>
  )
}
