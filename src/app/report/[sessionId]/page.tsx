"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useState, useMemo } from "react"
import { createClient } from "@/lib/supabase/client"
import { diffLines, Change } from "diff"
import { motion } from "motion/react"
import {
  ArrowLeft,
  BarChart3,
  Bot,
  Brain,
  Bug,
  Clock3,
  ChevronRight,
  CheckCircle2,
  Code2,
  FileCode2,
  XCircle,
  MessageSquare,
  Globe,
  Lock,
  Link2,
  ListChecks,
  Check,
  Copy,
  Sparkles,
  Terminal,
  TrendingUp,
  TrendingDown,
  UserRound,
  Minus,
  type LucideIcon
} from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { RadarChart } from "@/components/ui/radar-chart"


interface Submission {
  id: string
  code: string
  language: string
  created_at: string | null
  timestamp: number | null
  result_json: {
    submissions: Array<{
      status: { id: number; description: string }
      stdout: string | null
      stderr: string | null
    }>
  }
}

interface Scorecard {
  dimensions: {
    problemSolving: { score: number; evidence: string; reasoning: string }
    codeQuality: { score: number; evidence: string; reasoning: string }
    communication: { score: number; evidence: string; reasoning: string }
    debugging: { score: number; evidence: string; reasoning: string }
  }
  overallRecommendation: string
  summary: string
  submissionComments?: { submissionNumber: number; comment: string }[]
}

type DimensionKey = keyof Scorecard["dimensions"]

interface TranscriptMessage {
  role: 'user' | 'assistant'
  text: string
  timestamp?: string
}

interface SessionData {
  id: string
  status: string
  started_at: string
  ended_at: string | null
  final_code: string | null
  transcript: { items: string } | null
  events: {
    scorecard?: Scorecard
    testResults?: any[]
  } | null
  visibility?: 'private' | 'public' | 'unlisted'
}

import { asVisibility, type Visibility } from '@/lib/db-types'

const visibilityConfig = {
  private: {
    icon: Lock,
    label: 'Private',
    color: 'text-zinc-400',
    bg: 'border-white/10 bg-white/[0.035]'
  },
  unlisted: {
    icon: Link2,
    label: 'Unlisted',
    color: 'text-blue-500',
    bg: 'border-blue-500/25 bg-blue-500/10'
  },
  public: {
    icon: Globe,
    label: 'Public',
    color: 'text-emerald-500',
    bg: 'border-emerald-500/25 bg-emerald-500/10'
  },
}

const recommendationConfig: Record<string, {
  bg: string
  text: string
  glow: string
  icon: LucideIcon
}> = {
  'Strong Hire': {
    bg: 'border-emerald-500/25 bg-emerald-500/10',
    text: 'text-emerald-400',
    glow: '',
    icon: TrendingUp
  },
  'Hire': {
    bg: 'border-emerald-500/25 bg-emerald-500/10',
    text: 'text-emerald-400',
    glow: '',
    icon: TrendingUp
  },
  'Maybe': {
    bg: 'border-amber-500/25 bg-amber-500/10',
    text: 'text-amber-400',
    glow: '',
    icon: Minus
  },
  'No Hire': {
    bg: 'border-rose-500/25 bg-rose-500/10',
    text: 'text-rose-400',
    glow: '',
    icon: TrendingDown
  },
}

const dimensionMeta: Record<DimensionKey, {
  label: string
  shortLabel: string
  description: string
  icon: LucideIcon
}> = {
  problemSolving: {
    label: "Problem Solving",
    shortLabel: "Problem",
    description: "Approach, tradeoffs, and ability to find the path.",
    icon: Brain,
  },
  codeQuality: {
    label: "Code Quality",
    shortLabel: "Code",
    description: "Structure, clarity, correctness, and maintainability.",
    icon: Code2,
  },
  communication: {
    label: "Communication",
    shortLabel: "Comms",
    description: "How clearly the candidate explained decisions.",
    icon: MessageSquare,
  },
  debugging: {
    label: "Debugging",
    shortLabel: "Debug",
    description: "Testing instincts and response to failing cases.",
    icon: Bug,
  },
}

function getScoreTone(score: number) {
  if (score >= 4) {
    return {
      label: "Strong",
      text: "text-emerald-400",
      border: "border-emerald-500/25",
      bg: "bg-emerald-500/10",
      bar: "bg-emerald-500",
    }
  }

  if (score >= 3) {
    return {
      label: "Developing",
      text: "text-amber-400",
      border: "border-amber-500/25",
      bg: "bg-amber-500/10",
      bar: "bg-amber-500",
    }
  }

  return {
    label: "Risk",
    text: "text-rose-400",
    border: "border-rose-500/25",
    bg: "bg-rose-500/10",
    bar: "bg-rose-500",
  }
}

function VisibilityLabel({ visibility }: { visibility: Visibility }) {
  const config = visibilityConfig[visibility]
  const Icon = config.icon

  return (
    <div className={`flex w-fit items-center gap-2 rounded-[4px] border px-3 py-1.5 ${config.bg}`}>
      <Icon size={14} className={config.color} />
      <span className={`text-xs font-medium ${config.color}`}>{config.label}</span>
    </div>
  )
}

function PrivacyDropdown({
  sessionId,
  currentVisibility,
  onVisibilityChange,
  isOwner
}: {
  sessionId: string
  currentVisibility: Visibility
  onVisibilityChange: (visibility: Visibility) => void
  isOwner: boolean
}) {
  const [isUpdating, setIsUpdating] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleVisibilityChange = async (value: Visibility) => {
    setIsUpdating(true)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('sessions')
        .update({ visibility: value })
        .eq('id', sessionId)

      if (error) throw error
      onVisibilityChange(value)
    } catch (err) {
      console.error('Failed to update visibility:', err)
    } finally {
      setIsUpdating(false)
    }
  }

  const copyShareLink = async () => {
    const url = `${window.location.origin}/report/${sessionId}`
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const current = visibilityConfig[currentVisibility]
  const CurrentIcon = current.icon

  if (!isOwner) {
    return <VisibilityLabel visibility={currentVisibility} />
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select
        value={currentVisibility}
        onValueChange={(v) => handleVisibilityChange(v as Visibility)}
        disabled={isUpdating}
      >
        <SelectTrigger className="h-9 w-[140px] rounded-[4px] border-white/10 bg-white/[0.035] text-zinc-200 shadow-none">
          <div className="flex items-center gap-2">
            <CurrentIcon size={14} className={`${current.color} shrink-0`} />
            <span className="text-sm">{current.label}</span>
          </div>
        </SelectTrigger>
        <SelectContent className="rounded-[8px] border-white/10 bg-[#05070a] text-zinc-200">
          {Object.entries(visibilityConfig).map(([key, config]) => {
            const Icon = config.icon
            return (
              <SelectItem key={key} value={key}>
                <div className="flex items-center gap-2">
                  <Icon size={14} className={`${config.color} shrink-0`} />
                  <span>{config.label}</span>
                </div>
              </SelectItem>
            )
          })}
        </SelectContent>
      </Select>

      {currentVisibility !== 'private' && (
        <Button
          variant="outline"
          size="sm"
          onClick={copyShareLink}
          className="h-9 rounded-[4px] border-white/10 bg-white/[0.035] px-3 text-zinc-200 hover:border-blue-500/40 hover:bg-blue-500/10 hover:text-blue-400"
        >
          {copied ? (
            <>
              <Check size={14} className="mr-1.5 text-emerald-500" />
              Copied
            </>
          ) : (
            <>
              <Copy size={14} className="mr-1.5" />
              Copy Link
            </>
          )}
        </Button>
      )}
    </div>
  )
}

function DiffView({ oldCode, newCode }: { oldCode: string; newCode: string }) {
  const changes = useMemo(() => diffLines(oldCode, newCode), [oldCode, newCode])

  return (
    <pre className="overflow-x-auto rounded-[6px] border border-white/10 bg-black/35 p-3 font-mono text-xs">
      {changes.map((change: Change, i: number) => {
        const lines = change.value.split('\n').filter((_, idx, arr) =>
          idx < arr.length - 1 || arr[idx] !== ''
        )
        return lines.map((line, j) => (
          <div
            key={`${i}-${j}`}
            className={
              change.added
                ? "bg-emerald-500/10 text-emerald-300"
                : change.removed
                  ? "bg-rose-500/10 text-rose-300"
                  : "text-zinc-400"
            }
          >
            <span className="select-none opacity-50 mr-2">
              {change.added ? "+" : change.removed ? "-" : " "}
            </span>
            {line || " "}
          </div>
        ))
      })}
    </pre>
  )
}

function parseTranscript(transcriptString: string): TranscriptMessage[] {
  if (!transcriptString) return []

  const messages: TranscriptMessage[] = []
  const lines = transcriptString.split('\n')

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue

    const match = trimmed.match(/^\[(\d{1,2}:\d{2}(?::\d{2})?)\]\s*(user|assistant|AI|Candidate):\s*(.+)$/i)
    if (match) {
      const [, timestamp, role, text] = match
      const normalizedRole = role.toLowerCase() === 'candidate' || role.toLowerCase() === 'user' ? 'user' : 'assistant'
      messages.push({ role: normalizedRole, text, timestamp })
    } else {
      const simpleMatch = trimmed.match(/^(user|assistant|AI|Candidate):\s*(.+)$/i)
      if (simpleMatch) {
        const [, role, text] = simpleMatch
        const normalizedRole = role.toLowerCase() === 'candidate' || role.toLowerCase() === 'user' ? 'user' : 'assistant'
        messages.push({ role: normalizedRole, text })
      }
    }
  }

  return messages
}

function HeroScorecard({ scorecard }: { scorecard: Scorecard }) {
  const [activeDimension, setActiveDimension] = useState(0)

  const recConfig = recommendationConfig[scorecard.overallRecommendation] || {
    bg: 'border-white/10 bg-white/[0.035]',
    text: 'text-zinc-400',
    glow: '',
    icon: Minus
  }
  const RecIcon = recConfig.icon

  const dimensions = (Object.entries(scorecard.dimensions) as Array<[DimensionKey, Scorecard["dimensions"][DimensionKey]]>)
    .map(([key, data]) => ({
      key,
      ...dimensionMeta[key],
      data,
    }))

  const radarData = dimensions.map(d => ({
    label: d.label,
    score: d.data.score,
    maxScore: 5
  }))

  const averageScore = Math.round(
    dimensions.reduce((total, dimension) => total + dimension.data.score, 0) /
    (dimensions.length * 5) *
    100
  )
  const rankedDimensions = [...dimensions].sort((a, b) => b.data.score - a.data.score)
  const strongestDimension = rankedDimensions[0]
  const focusDimension = rankedDimensions[rankedDimensions.length - 1]
  const selectedDimension = dimensions[activeDimension] ?? dimensions[0]
  const selectedTone = getScoreTone(selectedDimension.data.score)
  const SelectedIcon = selectedDimension.icon

  const handleDimensionClick = (index: number) => {
    setActiveDimension(index)
  }

  return (
    <motion.section
      className="space-y-5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="grid gap-5 xl:grid-cols-[1.08fr_0.92fr]">
        <div className="relative overflow-hidden rounded-[8px] border border-white/10 bg-[#05070a]/95 p-5 shadow-[0_28px_90px_rgba(0,0,0,0.45)] md:p-6">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_88%_12%,rgba(0,132,255,0.18),transparent_32%)]" />
          <div className="relative">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-opencode text-[11px] uppercase text-blue-500">Final verdict</p>
                <h2 className="mt-3 max-w-xl text-3xl font-semibold leading-tight text-white md:text-4xl">
                  {scorecard.overallRecommendation}
                </h2>
              </div>
              <div className={`flex w-fit items-center gap-2 rounded-[4px] border px-3 py-2 ${recConfig.bg}`}>
                <RecIcon size={18} className={recConfig.text} />
                <span className={`text-sm font-semibold ${recConfig.text}`}>
                  {averageScore}% overall
                </span>
              </div>
            </div>

            <p className="mt-5 max-w-2xl text-sm leading-6 text-zinc-400">
              {scorecard.summary}
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-[6px] border border-white/10 bg-white/[0.035] p-3">
                <p className="font-opencode text-[10px] uppercase text-zinc-500">Strongest signal</p>
                <p className="mt-3 text-sm font-medium text-zinc-100">{strongestDimension.label}</p>
                <p className="mt-1 font-opencode text-lg text-emerald-400">{strongestDimension.data.score}/5</p>
              </div>
              <div className="rounded-[6px] border border-white/10 bg-white/[0.035] p-3">
                <p className="font-opencode text-[10px] uppercase text-zinc-500">Needs focus</p>
                <p className="mt-3 text-sm font-medium text-zinc-100">{focusDimension.label}</p>
                <p className={`mt-1 font-opencode text-lg ${getScoreTone(focusDimension.data.score).text}`}>
                  {focusDimension.data.score}/5
                </p>
              </div>
              <div className="rounded-[6px] border border-white/10 bg-white/[0.035] p-3">
                <p className="font-opencode text-[10px] uppercase text-zinc-500">Assessment</p>
                <p className="mt-3 text-sm font-medium text-zinc-100">AI interview review</p>
                <p className="mt-1 font-opencode text-lg text-blue-400">4 signals</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[8px] border border-white/10 bg-[#05070a]/95 p-5 shadow-[0_28px_90px_rgba(0,0,0,0.35)]">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="font-opencode text-[11px] uppercase text-blue-500">Signal map</p>
              <h3 className="mt-1 text-lg font-semibold text-zinc-100">Score distribution</h3>
            </div>
            <Badge variant="outline" className="rounded-[4px] border-white/10 bg-white/[0.035] text-zinc-400">
              Click a signal
            </Badge>
          </div>
          <div className="flex items-center justify-center overflow-hidden rounded-[8px] border border-white/10 bg-black/25 py-6">
            <div className="block md:hidden">
              <RadarChart
                dimensions={radarData}
                size={220}
                animated={true}
                onDimensionClick={handleDimensionClick}
                activeDimension={activeDimension}
              />
            </div>
            <div className="hidden md:block">
              <RadarChart
                dimensions={radarData}
                size={300}
                animated={true}
                onDimensionClick={handleDimensionClick}
                activeDimension={activeDimension}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {dimensions.map((dimension, index) => {
          const Icon = dimension.icon
          const tone = getScoreTone(dimension.data.score)
          const isActive = activeDimension === index

          return (
            <button
              key={dimension.key}
              onClick={() => handleDimensionClick(index)}
              className={`group rounded-[8px] border p-4 text-left transition-all ${isActive
                ? 'border-blue-500/45 bg-blue-500/10 shadow-[0_18px_60px_rgba(0,0,0,0.35)]'
                : 'border-white/10 bg-[#05070a]/90 hover:border-blue-500/30 hover:bg-blue-500/[0.055]'
                }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className={`grid h-10 w-10 place-items-center rounded-[6px] border ${tone.border} ${tone.bg}`}>
                  <Icon className={`h-5 w-5 ${tone.text}`} />
                </div>
                <div className="text-right">
                  <p className={`font-opencode text-2xl font-semibold ${tone.text}`}>
                    {dimension.data.score}
                  </p>
                  <p className="text-[11px] text-zinc-500">/5</p>
                </div>
              </div>
              <p className="mt-4 text-sm font-semibold text-zinc-100">{dimension.label}</p>
              <p className="mt-2 min-h-10 text-xs leading-5 text-zinc-500">{dimension.description}</p>
              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div
                  className={`h-full rounded-full ${tone.bar}`}
                  style={{ width: `${dimension.data.score * 20}%` }}
                />
              </div>
            </button>
          )
        })}
      </div>

      <div className="grid gap-5 rounded-[8px] border border-white/10 bg-[#05070a]/95 p-5 lg:grid-cols-[260px_1fr]">
        <div className="rounded-[6px] border border-white/10 bg-white/[0.035] p-4">
          <div className={`mb-5 grid h-12 w-12 place-items-center rounded-[6px] border ${selectedTone.border} ${selectedTone.bg}`}>
            <SelectedIcon className={`h-6 w-6 ${selectedTone.text}`} />
          </div>
          <p className="font-opencode text-[10px] uppercase text-zinc-500">Selected signal</p>
          <h3 className="mt-2 text-xl font-semibold text-white">{selectedDimension.label}</h3>
          <div className="mt-4 flex items-end gap-2">
            <span className={`font-opencode text-4xl font-semibold ${selectedTone.text}`}>
              {selectedDimension.data.score}
            </span>
            <span className="pb-1 text-sm text-zinc-500">/5 · {selectedTone.label}</span>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-[6px] border border-white/10 bg-black/20 p-4">
            <p className="mb-3 font-opencode text-[10px] uppercase text-blue-500">Evidence</p>
            <p className="text-sm leading-6 text-zinc-300">{selectedDimension.data.evidence}</p>
          </div>
          <div className="rounded-[6px] border border-white/10 bg-black/20 p-4">
            <p className="mb-3 font-opencode text-[10px] uppercase text-blue-500">Reasoning</p>
            <p className="text-sm leading-6 text-zinc-300">{selectedDimension.data.reasoning}</p>
          </div>
        </div>
      </div>
    </motion.section>
  )
}

function FinalCodeCard({ code }: { code: string }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Card className="group h-full cursor-pointer rounded-[8px] border-white/10 bg-[#05070a]/90 shadow-none transition-all hover:border-blue-500/35">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="grid h-11 w-11 place-items-center rounded-[6px] border border-blue-500/25 bg-blue-500/10 text-blue-500">
                  <FileCode2 size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-100">Final Code</h3>
                  <p className="text-sm text-zinc-500">{code.split("\n").length} lines captured</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-zinc-500 transition-all group-hover:translate-x-1 group-hover:text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="flex w-full flex-col border-white/10 bg-[#020305] p-0 text-zinc-100 sm:max-w-2xl [&>button]:right-5 [&>button]:top-5 [&>button]:rounded-[6px] [&>button]:border [&>button]:border-white/10 [&>button]:bg-white/[0.045] [&>button]:text-zinc-400 [&>button]:hover:bg-blue-500/10 [&>button]:hover:text-blue-400"
      >
        <SheetHeader className="border-b border-white/10 bg-[#05070a] p-5 pr-16">
          <div className="flex items-start gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-[6px] border border-blue-500/25 bg-blue-500/10 text-blue-500">
              <FileCode2 className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="font-opencode text-[10px] uppercase text-blue-500">Captured artifact</p>
              <SheetTitle className="mt-1 text-xl text-zinc-100">Final Code</SheetTitle>
              <SheetDescription className="mt-1 text-sm text-zinc-500">
                {code.split("\n").length} lines captured from the final interview state.
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>
        <ScrollArea className="flex-1 bg-[#020305]">
          <div className="p-4">
            <pre className="min-h-full rounded-[8px] border border-white/10 bg-black/35 p-4 font-mono text-xs leading-6 text-zinc-200">
              {code}
            </pre>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

function TranscriptCard({ transcript }: { transcript: string }) {
  const messages = parseTranscript(transcript)
  const messageCount = messages.length
  const candidateCount = messages.filter((message) => message.role === "user").length
  const interviewerCount = messageCount - candidateCount
  const lastTimestamp = [...messages].reverse().find((message) => message.timestamp)?.timestamp

  return (
    <Sheet>
      <SheetTrigger asChild>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="h-full w-full"
        >
          <Card className="group h-full cursor-pointer rounded-[8px] border-white/10 bg-[#05070a]/90 shadow-none transition-all hover:border-blue-500/35">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="grid h-11 w-11 place-items-center rounded-[6px] border border-blue-500/25 bg-blue-500/10 text-blue-500 transition-colors group-hover:bg-blue-500/15">
                    <MessageSquare size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-zinc-100">Interview Transcript</h3>
                    <p className="text-sm text-zinc-500">
                      {messageCount > 0 ? `${messageCount} messages` : 'No messages'}
                    </p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-zinc-500 transition-all group-hover:translate-x-1 group-hover:text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </SheetTrigger>
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
              <p className="font-opencode text-[10px] uppercase text-blue-500">Conversation log</p>
              <SheetTitle className="mt-1 text-xl text-zinc-100">Interview Transcript</SheetTitle>
              <SheetDescription className="mt-1 text-sm text-zinc-500">
                {messageCount} messages
                {lastTimestamp ? ` · last exchange ${lastTimestamp}` : ""}
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
              <p className="font-opencode text-[10px] uppercase text-zinc-500">Mode</p>
              <p className="mt-1 text-lg font-semibold text-emerald-400">Read-only</p>
            </div>
          </div>
        </SheetHeader>
        <ScrollArea className="flex-1 bg-[#020305]">
          {messages.length === 0 ? (
            <p className="py-12 text-center text-zinc-500">No transcript available</p>
          ) : (
            <div className="space-y-4 p-5">
              {messages.map((msg, i) => (
                <div
                  key={i}
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
                        <span className={`font-opencode text-[10px] uppercase ${msg.role === 'user' ? 'text-blue-100' : 'text-zinc-500'
                          }`}>
                          {msg.role === 'user' ? 'Candidate' : 'AI Interviewer'}
                        </span>
                        {msg.timestamp && (
                          <span className={`font-opencode text-[10px] ${msg.role === 'user' ? 'text-blue-200' : 'text-zinc-600'
                            }`}>
                            {msg.timestamp}
                          </span>
                        )}
                      </div>
                      <p className="text-[15px] leading-7">{msg.text}</p>
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
            Transcript content is generated from the recorded interview session.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  )
}

function TestResultBadge({ results }: { results: Submission['result_json']['submissions'] }) {
  const passed = results.filter(r => r.status.id === 3).length
  const total = results.length
  const allPassed = passed === total

  return (
    <div className={`flex items-center gap-1.5 text-sm font-medium ${allPassed ? 'text-emerald-400' : 'text-rose-400'}`}>
      {allPassed ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
      <span>{passed}/{total} tests</span>
    </div>
  )
}

function SubmissionCard({
  submission,
  index,
  prevCode,
  aiComment
}: {
  submission: Submission
  index: number
  prevCode: string | null
  aiComment?: string
}) {
  const [expanded, setExpanded] = useState(index === 0)

  const time = submission.timestamp !== null
    ? `T+${String(Math.floor(submission.timestamp / 60)).padStart(2, '0')}:${String(submission.timestamp % 60).padStart(2, '0')}`
    : submission.created_at ? new Date(submission.created_at).toLocaleTimeString() : '--'

  const passed = submission.result_json.submissions.filter(r => r.status.id === 3).length
  const total = submission.result_json.submissions.length
  const allPassed = passed === total

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 * index }}
      className="w-full"
    >
      <Card className={`overflow-hidden rounded-[8px] border-white/10 bg-[#05070a]/90 shadow-none ${expanded ? 'ring-1 ring-blue-500/30' : ''}`}>
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex w-full items-center justify-between p-4 transition-colors hover:bg-white/[0.045]"
        >
          <div className="flex items-center gap-3">
            <div className={`flex h-8 w-8 items-center justify-center rounded-[6px] border text-sm font-bold ${allPassed ? 'border-emerald-500/25 bg-emerald-500/10 text-emerald-400' : 'border-rose-500/25 bg-rose-500/10 text-rose-400'
              }`}>
              {index + 1}
            </div>
            <div className="text-left">
              <span className="font-medium text-zinc-100">Submission #{index + 1}</span>
              <span className="ml-2 font-opencode text-xs text-zinc-500">{time}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <TestResultBadge results={submission.result_json.submissions} />
            <ChevronRight
              size={16}
              className={`text-zinc-500 transition-transform duration-200 ${expanded ? 'rotate-90 text-blue-500' : ''}`}
            />
          </div>
        </button>

        {expanded && (
          <CardContent className="overflow-hidden border-t border-white/10 pb-4 pt-0">
            {aiComment && (
              <div className="mt-4 break-words rounded-[6px] border border-blue-500/25 bg-blue-500/10 p-3 text-sm text-blue-300">
                <span className="font-medium">AI Feedback: </span>{aiComment}
              </div>
            )}

            <div className="mt-4 overflow-x-auto">
              {prevCode ? (
                <>
                  <p className="mb-2 font-opencode text-[10px] uppercase text-zinc-500">Changes from previous submission</p>
                  <DiffView oldCode={prevCode} newCode={submission.code} />
                </>
              ) : (
                <>
                  <p className="mb-2 font-opencode text-[10px] uppercase text-zinc-500">Initial submission</p>
                  <pre className="max-w-full overflow-x-auto rounded-[6px] border border-white/10 bg-black/35 p-3 font-mono text-xs text-zinc-200">
                    {submission.code}
                  </pre>
                </>
              )}
            </div>

            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {submission.result_json.submissions.map((result, i) => (
                <div
                  key={i}
                  className={`truncate rounded-[4px] border p-2 text-xs ${result.status.id === 3
                    ? 'border-emerald-500/25 bg-emerald-500/10 text-emerald-400'
                    : 'border-rose-500/25 bg-rose-500/10 text-rose-400'
                    }`}
                >
                  Test {i + 1}: {result.status.description}
                </div>
              ))}
            </div>
          </CardContent>
        )}
      </Card>
    </motion.div>
  )
}

function SubmissionTimelineDrawer({
  submissions,
  scorecard,
}: {
  submissions: Submission[]
  scorecard?: Scorecard
}) {
  const totalPassed = submissions.reduce((acc, submission) =>
    acc + submission.result_json.submissions.filter(r => r.status.id === 3).length, 0
  )
  const totalTests = submissions.reduce((acc, submission) =>
    acc + submission.result_json.submissions.length, 0
  )
  const passRate = totalTests > 0 ? Math.round((totalPassed / totalTests) * 100) : 0
  const latestSubmission = submissions[submissions.length - 1]
  const latestLabel = latestSubmission
    ? latestSubmission.timestamp !== null
      ? `T+${String(Math.floor(latestSubmission.timestamp / 60)).padStart(2, '0')}:${String(latestSubmission.timestamp % 60).padStart(2, '0')}`
      : latestSubmission.created_at ? new Date(latestSubmission.created_at).toLocaleTimeString() : '--'
    : "No attempts"

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Card className="group h-full cursor-pointer rounded-[8px] border-white/10 bg-[#05070a]/90 shadow-none transition-all hover:border-blue-500/35">
          <CardContent className="p-5">
            <div className="flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-4">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-[6px] border border-blue-500/25 bg-blue-500/10 text-blue-500 transition-colors group-hover:bg-blue-500/15">
                  <ListChecks size={20} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-zinc-100">Submission Timeline</h3>
                  <p className="truncate text-sm text-zinc-500">
                    {submissions.length > 0
                      ? `${submissions.length} attempts · ${totalPassed}/${totalTests} tests`
                      : "No submissions"}
                  </p>
                </div>
              </div>
              <ChevronRight size={20} className="shrink-0 text-zinc-500 transition-all group-hover:translate-x-1 group-hover:text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="flex w-full flex-col border-white/10 bg-[#020305] p-0 text-zinc-100 sm:max-w-[760px] [&>button]:right-5 [&>button]:top-5 [&>button]:rounded-[6px] [&>button]:border [&>button]:border-white/10 [&>button]:bg-white/[0.045] [&>button]:text-zinc-400 [&>button]:hover:bg-blue-500/10 [&>button]:hover:text-blue-400"
      >
        <SheetHeader className="border-b border-white/10 bg-[#05070a]/95 p-5 pr-16">
          <div className="flex items-start gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-[6px] border border-blue-500/25 bg-blue-500/10 text-blue-500">
              <ListChecks className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="font-opencode text-[10px] uppercase text-blue-500">Attempt history</p>
              <SheetTitle className="mt-1 text-xl text-zinc-100">Submission Timeline</SheetTitle>
              <SheetDescription className="mt-1 text-sm text-zinc-500">
                Review code changes, AI feedback, and test outcomes without crowding the report.
              </SheetDescription>
            </div>
          </div>

          <div className="mt-5 grid gap-2 sm:grid-cols-3">
            <div className="rounded-[6px] border border-white/10 bg-white/[0.035] px-3 py-2">
              <p className="font-opencode text-[10px] uppercase text-zinc-500">Attempts</p>
              <p className="mt-1 text-lg font-semibold text-zinc-100">{submissions.length}</p>
            </div>
            <div className="rounded-[6px] border border-white/10 bg-white/[0.035] px-3 py-2">
              <p className="font-opencode text-[10px] uppercase text-zinc-500">Tests passed</p>
              <p className="mt-1 text-lg font-semibold text-emerald-400">{totalPassed}/{totalTests}</p>
            </div>
            <div className="rounded-[6px] border border-white/10 bg-white/[0.035] px-3 py-2">
              <p className="font-opencode text-[10px] uppercase text-zinc-500">Latest</p>
              <p className="mt-1 text-lg font-semibold text-blue-400">{latestLabel}</p>
            </div>
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1 bg-[#020305]">
          {submissions.length > 0 ? (
            <div className="space-y-3 p-5">
              <div className="rounded-[8px] border border-white/10 bg-white/[0.035] p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-opencode text-[10px] uppercase text-zinc-500">Aggregate result</p>
                    <p className="mt-1 text-sm text-zinc-300">
                      {passRate}% pass rate across all recorded attempts.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 rounded-[4px] border border-blue-500/25 bg-blue-500/10 px-3 py-1.5 text-sm font-medium text-blue-400">
                    <Terminal className="h-4 w-4" />
                    {submissions.length} attempts
                  </div>
                </div>
              </div>

              {submissions.map((submission, i) => {
                const comment = scorecard?.submissionComments?.find(
                  (c) => c.submissionNumber === i + 1
                )?.comment

                return (
                  <SubmissionCard
                    key={submission.id}
                    submission={submission}
                    index={i}
                    prevCode={i > 0 ? submissions[i - 1].code : null}
                    aiComment={comment}
                  />
                )
              })}
            </div>
          ) : (
            <div className="flex min-h-[320px] items-center justify-center p-5">
              <div className="max-w-sm rounded-[8px] border border-white/10 bg-white/[0.035] p-6 text-center">
                <ListChecks className="mx-auto mb-3 h-8 w-8 text-zinc-500" />
                <p className="font-medium text-zinc-100">No submissions recorded</p>
                <p className="mt-1 text-sm leading-6 text-zinc-500">
                  Code attempts will appear here when the interview includes submitted solutions.
                </p>
              </div>
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

export default function ReportPage() {
  const params = useParams()
  const sessionId = params.sessionId as string
  const [sessionData, setSessionData] = useState<SessionData | null>(null)
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [visibility, setVisibility] = useState<Visibility>('private')
  const [isOwner, setIsOwner] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = createClient()

        const [sessionRes, submissionsRes, userRes] = await Promise.all([
          supabase
            .from('sessions')
            .select('*')
            .eq('id', sessionId)
            .single(),
          supabase
            .from('submissions')
            .select('*')
            .eq('session_id', sessionId)
            .order('created_at', { ascending: true }),
          supabase.auth.getUser()
        ])

        if (sessionRes.error) throw sessionRes.error
        if (submissionsRes.error) throw submissionsRes.error

        const currentUserId = userRes.data?.user?.id
        const sessionVisibility = asVisibility(sessionRes.data?.visibility)
        const ownsSession = currentUserId === sessionRes.data?.user_id

        if (sessionVisibility === 'private' && !ownsSession) {
          setError('This report is private')
          setLoading(false)
          return
        }

        // transcript/events/result_json are jsonb, so the generated types hand
        // back Json. Narrow just those fields; the rest of each row stays checked.
        setSessionData({
          ...sessionRes.data,
          transcript: sessionRes.data.transcript as SessionData['transcript'],
          events: sessionRes.data.events as SessionData['events'],
          visibility: sessionVisibility,
        })
        setSubmissions(
          (submissionsRes.data || []).map((row) => ({
            ...row,
            result_json: row.result_json as Submission['result_json'],
          }))
        )
        setVisibility(sessionVisibility)
        setIsOwner(ownsSession)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [sessionId])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#020305] text-zinc-100">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          <p className="text-zinc-500">Loading report...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#020305] px-4 text-zinc-100">
        <motion.div
          className="rounded-[8px] border border-white/10 bg-[#05070a]/90 p-8 text-center shadow-[0_28px_90px_rgba(0,0,0,0.45)]"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Lock className="mx-auto mb-4 text-zinc-500" size={48} />
          <p className="text-lg font-medium text-rose-400">{error}</p>
          <p className="mt-1 text-sm text-zinc-500">You don&apos;t have permission to view this report</p>
        </motion.div>
      </div>
    )
  }

  const scorecard = sessionData?.events?.scorecard
  const totalPassed = submissions.reduce((acc, sub) =>
    acc + sub.result_json.submissions.filter(r => r.status.id === 3).length, 0
  )
  const totalTests = submissions.reduce((acc, sub) =>
    acc + sub.result_json.submissions.length, 0
  )
  const passRate = totalTests > 0 ? Math.round((totalPassed / totalTests) * 100) : 0
  const durationLabel = sessionData?.started_at
    ? (() => {
      const start = new Date(sessionData.started_at).getTime()
      const end = sessionData.ended_at ? new Date(sessionData.ended_at).getTime() : Date.now()
      const minutes = Math.max(0, Math.round((end - start) / 60000))
      return `${minutes}m`
    })()
    : "--"

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#020305] text-zinc-100">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_76%_10%,rgba(0,132,255,0.16),transparent_28%),radial-gradient(circle_at_18%_18%,rgba(255,255,255,0.045),transparent_24%),radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.04)_1px,transparent_0)] [background-size:auto,auto,34px_34px]" />
      <div className="relative mx-auto max-w-[1180px] px-4 py-5 md:px-8 md:py-7">
        {/* Header */}
        <motion.header
          className="mb-6 flex flex-col gap-4 border-b border-white/10 pb-5 lg:flex-row lg:items-center lg:justify-between"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex min-w-0 items-start gap-4">
            <Link href={isOwner ? "/reports" : "/"} className="relative mt-1 grid h-10 w-10 shrink-0 place-items-center border border-dashed border-white/55 text-blue-500">
              <Terminal className="h-5 w-5" />
              <span className="absolute -left-1 -top-1 h-2 w-2 border-l border-t border-blue-500" />
              <span className="absolute -bottom-1 -right-1 h-2 w-2 border-b border-r border-blue-500" />
            </Link>
            <div className="min-w-0">
              <Badge variant="outline" className="mb-3 rounded-[4px] border-blue-500/25 bg-blue-500/10 text-[11px] uppercase text-blue-500">
                <BarChart3 className="h-3 w-3" />
                Session report
              </Badge>
              <h1 className="font-opencode text-2xl font-semibold leading-tight text-white md:text-3xl">
                Interview performance report.
              </h1>
              <p className="mt-2 text-sm text-zinc-500">
                {submissions.length} submissions · {totalPassed}/{totalTests} tests passed · {durationLabel}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {isOwner && (
              <Button asChild variant="outline" size="sm" className="h-9 rounded-[4px] border-white/10 bg-white/[0.035] text-zinc-200 hover:border-blue-500/40 hover:bg-blue-500/10 hover:text-blue-400">
                <Link href="/reports">
                  <ArrowLeft className="h-4 w-4" />
                  Reports
                </Link>
              </Button>
            )}
            <PrivacyDropdown
              sessionId={sessionId}
              currentVisibility={visibility}
              onVisibilityChange={setVisibility}
              isOwner={isOwner}
            />
          </div>
        </motion.header>

        <section className="mb-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-[8px] border border-white/10 bg-[#05070a]/90 p-4">
            <div className="flex items-center justify-between text-zinc-500">
              <span className="font-opencode text-[10px] uppercase">Pass rate</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </div>
            <p className="mt-3 text-2xl font-semibold text-white">{passRate}%</p>
          </div>
          <div className="rounded-[8px] border border-white/10 bg-[#05070a]/90 p-4">
            <div className="flex items-center justify-between text-zinc-500">
              <span className="font-opencode text-[10px] uppercase">Submissions</span>
              <Terminal className="h-4 w-4 text-blue-500" />
            </div>
            <p className="mt-3 text-2xl font-semibold text-white">{submissions.length}</p>
          </div>
          <div className="rounded-[8px] border border-white/10 bg-[#05070a]/90 p-4">
            <div className="flex items-center justify-between text-zinc-500">
              <span className="font-opencode text-[10px] uppercase">Duration</span>
              <Clock3 className="h-4 w-4 text-blue-500" />
            </div>
            <p className="mt-3 text-2xl font-semibold text-white">{durationLabel}</p>
          </div>
        </section>

        {/* Main Content */}
        <div className="space-y-6">
          {/* AI Assessment Hero */}
          {scorecard ? (
            <HeroScorecard scorecard={scorecard} />
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-[8px] border border-white/10 bg-[#05070a]/90 p-8 text-center"
            >
              <Sparkles className="mx-auto mb-4 text-zinc-500" size={40} />
              <p className="text-zinc-500">No AI assessment available for this session</p>
            </motion.div>
          )}

          <section className="space-y-3">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="font-opencode text-[10px] uppercase text-zinc-500">
                  Artifacts
                </p>
                <h2 className="mt-1 text-lg font-semibold text-zinc-100">Review details</h2>
              </div>
              <p className="max-w-md text-sm leading-6 text-zinc-500">
                Open the heavier session records in side drawers so the report stays focused on the assessment.
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              {sessionData?.transcript?.items ? (
                <TranscriptCard transcript={sessionData.transcript.items} />
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="h-full"
                >
                  <Card className="h-full rounded-[8px] border-white/10 bg-[#05070a]/90 p-5 shadow-none">
                    <div className="flex items-center gap-4">
                      <div className="grid h-11 w-11 place-items-center rounded-[6px] border border-white/10 bg-white/[0.035]">
                        <MessageSquare size={20} className="text-zinc-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-zinc-100">Interview Transcript</h3>
                        <p className="text-sm text-zinc-500">No transcript available</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}

              {sessionData?.final_code ? (
                <FinalCodeCard code={sessionData.final_code} />
              ) : (
                <Card className="h-full rounded-[8px] border-white/10 bg-[#05070a]/90 p-5 shadow-none">
                  <div className="flex items-center gap-4">
                    <div className="grid h-11 w-11 place-items-center rounded-[6px] border border-white/10 bg-white/[0.035]">
                      <FileCode2 size={20} className="text-zinc-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-zinc-100">Final Code</h3>
                      <p className="text-sm text-zinc-500">No final code captured</p>
                    </div>
                  </div>
                </Card>
              )}

              <SubmissionTimelineDrawer submissions={submissions} scorecard={scorecard || undefined} />
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
