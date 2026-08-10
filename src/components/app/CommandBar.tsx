import { Button, buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Mic, MicOff, PhoneOff, AlertCircle, Radio, Terminal, MessageSquare, Bot, UserRound } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useEditorStore, useQuestionStore } from "@/store"
import { useTranscript } from "@/app/contexts/TranscriptContext"
import { useParams } from "next/navigation"
import { useState, useRef, useEffect } from "react"
import { SelfContainedTimer } from "./TimerDisplay"
import { formatTime } from "@/lib/timer-utils"

type CommandBarProps = {
  testResults?: Array<{
    status: 'pending' | 'passed' | 'failed' | 'running';
    actualOutput?: string;
    stderr?: string;
    compileOutput?: string;
  }>;
  sessionStartedAt?: string | null;
  durationMinutes?: number;
  onTimeExpired?: () => void;
  onHangUp?: () => void;
}

export default function CommandBar({ testResults, sessionStartedAt, durationMinutes = 30, onTimeExpired, onHangUp }: CommandBarProps) {
  // Only subscribe to the specific store values we need - NOT code
  const micStatus = useEditorStore((s) => s.micStatus)
  const toggleMic = useEditorStore((s) => s.toggleMic)
  const questionText = useQuestionStore((s) => s.questionText)
  const { transcriptItems } = useTranscript()
  const params = useParams()
  const [isGeneratingReport, setIsGeneratingReport] = useState(false)

  // Extract problem title from question text (first line before parenthesis)
  const problemTitle = questionText
    ? questionText.split('\n')[0]?.replace(/\s*\(.*\)$/, '').trim()
    : params.name as string

  const handleHangUp = async () => {
    setIsGeneratingReport(true)
    
    // Get sessionId from URL params
    const sessionId = params.sessionId as string
    
    // Get code and language from store at submission time (not subscribed)
    const { code, language } = useEditorStore.getState()
    
    // Format transcript with elapsed time from session start
    const sessionStartMs = sessionStartedAt ? new Date(sessionStartedAt).getTime() : null
    const transcript = transcriptItems
      .filter(item => item.type === "MESSAGE" && !item.isHidden)
      .map(item => {
        if (sessionStartMs && item.createdAtMs) {
          const elapsedSeconds = Math.floor((item.createdAtMs - sessionStartMs) / 1000)
          const timestamp = formatTime(Math.max(0, elapsedSeconds))
          return `[${timestamp}] ${item.role}: ${item.title}`
        }
        return `${item.role}: ${item.title}`
      })
      .join("\n")
    
    // Calculate session duration
    const startTime = transcriptItems[0]?.createdAtMs || Date.now()
    const endTime = Date.now()
    const durationMs = endTime - startTime
    const calcDurationMinutes = Math.floor(durationMs / 60000)
    const durationSeconds = Math.floor((durationMs % 60000) / 1000)
    
    // Fire off the report generation (don't await - let it run in background)
    fetch('/api/report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        transcript,
        code,
        questionUri: params.name as string,
        testResults: testResults || [],
        metadata: {
          questionUri: params.name as string,
          language,
          duration: `${calcDurationMinutes}m ${durationSeconds}s`,
        }
      })
    }).catch(err => console.error('Report generation error:', err))
    
    // Disable the leave warning before redirecting
    onHangUp?.()
    
    // Redirect immediately to reports page
    window.location.href = `/reports`
  }

  return (
    <TooltipProvider delayDuration={200}>
      <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between gap-4 border-b border-border/60 bg-background/85 backdrop-blur-xl dark:bg-[#020305]/85 dark:border-white/10 px-4">
        {/* Left: Logo + Problem context */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative grid size-8 shrink-0 place-items-center border border-dashed border-white/25 text-blue-500 rounded-[4px]">
            <Terminal className="size-3.5" />
          </div>

          <Separator orientation="vertical" className="h-5 dark:bg-white/10" />

          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-[13px] text-muted-foreground hidden sm:inline truncate">
              Interview
            </span>
            <span className="text-muted-foreground hidden sm:inline">/</span>
            <span className="text-[13px] font-medium text-foreground truncate max-w-[200px] md:max-w-[300px]">
              {problemTitle || "Loading…"}
            </span>
          </div>

          <Badge
            variant="outline"
            className="ml-1 hidden md:inline-flex rounded-[4px] border-blue-500/25 bg-blue-500/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-blue-500 shrink-0"
          >
            <Radio className="h-2.5 w-2.5 mr-1" />
            Live
          </Badge>
        </div>

        {/* Center: Timer */}
        <div className="flex items-center">
          {sessionStartedAt ? (
            <SelfContainedTimer 
              startedAt={sessionStartedAt} 
              durationMinutes={durationMinutes}
              onTimeExpired={onTimeExpired}
            />
          ) : (
            <Badge variant="outline" className="rounded-[4px] border-white/10 bg-white/[0.035] px-3 py-1 text-xs text-muted-foreground font-mono">
              Connecting…
            </Badge>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Transcript sidebar */}
          <LiveTranscriptSidebar />

          {/* Mic button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="relative">
                <Button
                  variant={micStatus === "ENABLED" ? "outline" : "ghost"}
                  size="icon"
                  className={
                    micStatus === "ENABLED"
                      ? "h-9 w-9 rounded-[6px] border-emerald-500/25 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 hover:text-emerald-400"
                      : micStatus === "RESTRICTED"
                        ? "h-9 w-9 rounded-[6px] text-muted-foreground opacity-50 cursor-not-allowed"
                        : "h-9 w-9 rounded-[6px] border-white/10 bg-white/[0.035] text-muted-foreground hover:bg-white/[0.06] hover:text-foreground"
                  }
                  onClick={toggleMic}
                  disabled={micStatus === "RESTRICTED"}
                >
                  {micStatus === "ENABLED" ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                </Button>
                {micStatus === "RESTRICTED" && (
                  <AlertCircle className="absolute -bottom-1 -right-1 h-3.5 w-3.5 text-rose-500 fill-rose-500/20" />
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">
              {micStatus === "RESTRICTED"
                ? "Microphone access denied"
                : micStatus === "ENABLED"
                  ? "Mute microphone (⌘M)"
                  : "Unmute microphone (⌘M)"}
            </TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="h-5 dark:bg-white/10" />

          {/* Hang up */}
          <AlertDialog>
            <Tooltip>
              <TooltipTrigger asChild>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isGeneratingReport}
                    className="h-9 rounded-[4px] border-rose-500/25 bg-rose-500/10 px-3 text-xs font-medium text-rose-500 hover:bg-rose-500/20 hover:text-rose-400 hover:border-rose-500/40 gap-1.5"
                  >
                    <PhoneOff className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Hang Up</span>
                  </Button>
                </AlertDialogTrigger>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                End interview & generate report
              </TooltipContent>
            </Tooltip>
            <AlertDialogContent className="dark:bg-[#05070a] dark:border-white/10">
              <AlertDialogHeader>
                <AlertDialogTitle>End this interview?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will end the session and generate your evaluation report. You won&apos;t be able to resume.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="rounded-[4px] dark:border-white/10 dark:bg-white/[0.035]">
                  Keep going
                </AlertDialogCancel>
                <AlertDialogAction 
                  className={buttonVariants({ variant: "destructive" }) + " rounded-[4px]"}
                  onClick={handleHangUp}
                  disabled={isGeneratingReport}
                >
                  {isGeneratingReport ? "Generating…" : "End & Submit"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </header>
    </TooltipProvider>
  )
}

function StreamingText({ text, role, createdAtMs }: { text: string | undefined, role: string | undefined, createdAtMs: number }) {
  const isAssistant = role === 'assistant';
  const safeText = text || '';
  
  const [displayedLength, setDisplayedLength] = useState(() => {
    if (!isAssistant) return safeText.length;
    const elapsedMs = Date.now() - createdAtMs;
    // 35ms per character roughly matches the AI's speaking speed (~200 WPM)
    const expectedLength = Math.floor(elapsedMs / 35); 
    return expectedLength > safeText.length ? safeText.length : Math.max(0, expectedLength);
  });

  useEffect(() => {
    if (!isAssistant) {
      setDisplayedLength(safeText.length);
      return;
    }

    const interval = setInterval(() => {
      setDisplayedLength(prev => {
        if (prev < safeText.length) return prev + 1;
        return prev;
      });
    }, 35);

    return () => clearInterval(interval);
  }, [safeText, isAssistant]);

  return <>{safeText.slice(0, displayedLength)}</>;
}

function LiveTranscriptSidebar() {
  const { transcriptItems } = useTranscript()
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  const visibleMessages = transcriptItems
    .filter(item => item.type === "MESSAGE" && !item.isHidden)
    .sort((a, b) => a.createdAtMs - b.createdAtMs)

  const candidateCount = visibleMessages.filter(m => m.role === "user").length
  const interviewerCount = visibleMessages.filter(m => m.role === "assistant").length

  // Auto-scroll to bottom when new messages arrive while sidebar is open
  useEffect(() => {
    if (isOpen && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [visibleMessages.length, isOpen])

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-[6px] border-white/10 bg-white/[0.035] text-muted-foreground hover:bg-blue-500/10 hover:text-blue-400 hover:border-blue-500/30 relative"
            >
              <MessageSquare className="h-4 w-4" />
              {visibleMessages.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-blue-500 px-1 text-[9px] font-bold text-white">
                  {visibleMessages.length}
                </span>
              )}
            </Button>
          </SheetTrigger>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-xs">
          View live transcript
        </TooltipContent>
      </Tooltip>
      <SheetContent
        side="right"
        className="flex w-full flex-col border-white/10 bg-[#020305] p-0 text-zinc-100 sm:max-w-[720px] [&>button]:right-5 [&>button]:top-5 [&>button]:rounded-[6px] [&>button]:border [&>button]:border-white/10 [&>button]:bg-white/[0.045] [&>button]:text-zinc-400 [&>button]:hover:bg-blue-500/10 [&>button]:hover:text-blue-400"
      >
        <SheetHeader className="border-b border-white/10 bg-[#05070a]/95 p-5 pr-16">
          <div className="flex items-start gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-[6px] border border-blue-500/25 bg-blue-500/10 text-blue-500">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="font-opencode text-[10px] uppercase text-blue-500">Live conversation</p>
              <SheetTitle className="mt-1 text-xl text-zinc-100">Interview Transcript</SheetTitle>
              <SheetDescription className="mt-1 text-sm text-zinc-500">
                {visibleMessages.length} messages · streaming live
              </SheetDescription>
            </div>
          </div>

          <div className="mt-5 grid gap-2 sm:grid-cols-3">
            <div className="rounded-[6px] border border-white/10 bg-white/[0.035] px-3 py-2">
              <p className="font-opencode text-[10px] uppercase text-zinc-500">AI turns</p>
              <p className="mt-1 text-lg font-semibold text-zinc-100">{interviewerCount}</p>
            </div>
            <div className="rounded-[6px] border border-white/10 bg-white/[0.035] px-3 py-2">
              <p className="font-opencode text-[10px] uppercase text-zinc-500">Candidate turns</p>
              <p className="mt-1 text-lg font-semibold text-blue-400">{candidateCount}</p>
            </div>
            <div className="rounded-[6px] border border-white/10 bg-white/[0.035] px-3 py-2">
              <p className="font-opencode text-[10px] uppercase text-zinc-500">Status</p>
              <p className="mt-1 flex items-center gap-1.5 text-lg font-semibold text-emerald-400">
                <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" /></span>
                Live
              </p>
            </div>
          </div>
        </SheetHeader>
        <ScrollArea className="flex-1 bg-[#020305]" ref={scrollRef}>
          {visibleMessages.length === 0 ? (
            <div className="flex min-h-[320px] items-center justify-center p-5">
              <div className="max-w-sm rounded-[8px] border border-white/10 bg-white/[0.035] p-6 text-center">
                <MessageSquare className="mx-auto mb-3 h-8 w-8 text-zinc-500" />
                <p className="font-medium text-zinc-100">No messages yet</p>
                <p className="mt-1 text-sm leading-6 text-zinc-500">
                  Messages will appear here as the interview progresses.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4 p-5">
              {visibleMessages.map((msg) => (
                <div
                  key={msg.itemId}
                  className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role !== 'user' && (
                    <div className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-[6px] border border-white/10 bg-white/[0.035] text-zinc-400">
                      <Bot className="h-4 w-4" />
                    </div>
                  )}
                  <div className={`max-w-[78%] ${msg.role === 'user' ? 'order-first' : ''}`}>
                    <div
                      className={`rounded-[8px] border px-4 py-3 shadow-[0_14px_40px_rgba(0,0,0,0.22)] ${msg.role === 'user'
                        ? 'rounded-br-[3px] border-blue-500/30 bg-blue-600/90 text-white'
                        : 'rounded-bl-[3px] border-white/10 bg-white/[0.045] text-zinc-100'
                      }`}
                    >
                      <div className="mb-2 flex items-center gap-2">
                        <span className={`font-opencode text-[10px] uppercase ${msg.role === 'user' ? 'text-blue-100' : 'text-zinc-500'}`}>
                          {msg.role === 'user' ? 'Candidate' : 'AI Interviewer'}
                        </span>
                        <span className={`font-opencode text-[10px] ${msg.role === 'user' ? 'text-blue-200' : 'text-zinc-600'}`}>
                          {msg.timestamp}
                        </span>
                      </div>
                      <p className="text-[15px] leading-7 whitespace-pre-wrap">
                        <StreamingText text={msg.title} role={msg.role} createdAtMs={msg.createdAtMs} />
                      </p>
                    </div>
                  </div>
                  {msg.role === 'user' && (
                    <div className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-[6px] border border-blue-500/30 bg-blue-500/10 text-blue-400">
                      <UserRound className="h-4 w-4" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        <div className="border-t border-white/10 bg-[#05070a]/95 px-5 py-3">
          <p className="text-xs text-zinc-500">
            Live transcript from the active interview session.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  )
}
