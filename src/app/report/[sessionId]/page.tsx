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
  Clock3,
  ChevronRight,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Globe,
  Lock,
  Link2,
  Check,
  Copy,
  Sparkles,
  Terminal,
  TrendingUp,
  TrendingDown,
  Minus
} from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RadarChart } from "@/components/ui/radar-chart"


interface Submission {
  id: string
  code: string
  language: string
  created_at: string
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

type Visibility = 'private' | 'public' | 'unlisted'

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
  icon: typeof TrendingUp
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

function DimensionDetail({
  label,
  score,
  evidence,
  reasoning,
  isActive,
  onToggle
}: {
  label: string
  score: number
  evidence: string
  reasoning: string
  isActive: boolean
  onToggle: () => void
}) {
  const scoreColor = score >= 4 ? 'text-emerald-400' : score >= 3 ? 'text-amber-400' : 'text-rose-400'
  const scoreBg = score >= 4 ? 'border-emerald-500/20 bg-emerald-500/10' : score >= 3 ? 'border-amber-500/20 bg-amber-500/10' : 'border-rose-500/20 bg-rose-500/10'

  return (
    <Collapsible open={isActive} onOpenChange={onToggle}>
      <CollapsibleTrigger className="w-full">
        <div className="flex cursor-pointer items-center gap-3 rounded-[6px] px-3 py-3 transition-colors hover:bg-white/[0.045]">
          <ChevronRight
            size={16}
            className={`text-zinc-500 transition-transform duration-200 ${isActive ? 'rotate-90 text-blue-500' : ''}`}
          />
          <span className="flex-1 text-left text-sm font-medium text-zinc-100">{label}</span>
          <span className={`text-lg font-bold ${scoreColor}`}>{score}/5</span>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
        <div className={`mx-2 mb-3 rounded-[6px] border p-5 ${scoreBg}`}>
          <div className="space-y-4">
            <div>
              <p className="mb-2 font-opencode text-[10px] uppercase text-zinc-500">Evidence</p>
              <p className="text-sm leading-relaxed text-zinc-200">{evidence}</p>
            </div>
            <div>
              <p className="mb-2 font-opencode text-[10px] uppercase text-zinc-500">Reasoning</p>
              <p className="text-sm leading-relaxed text-zinc-200">{reasoning}</p>
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
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
  const [activeDimension, setActiveDimension] = useState<number | null>(null)

  const recConfig = recommendationConfig[scorecard.overallRecommendation] || {
    bg: 'bg-zinc-500/20',
    text: 'text-zinc-400',
    glow: '',
    icon: Minus
  }
  const RecIcon = recConfig.icon

  const dimensions = [
    { key: 'problemSolving', label: 'Problem Solving', data: scorecard.dimensions.problemSolving },
    { key: 'codeQuality', label: 'Code Quality', data: scorecard.dimensions.codeQuality },
    { key: 'communication', label: 'Communication', data: scorecard.dimensions.communication },
    { key: 'debugging', label: 'Debugging', data: scorecard.dimensions.debugging },
  ]

  const radarData = dimensions.map(d => ({
    label: d.label,
    score: d.data.score,
    maxScore: 5
  }))

  const handleDimensionClick = (index: number) => {
    setActiveDimension(activeDimension === index ? null : index)
  }

  return (
    <motion.div
      className="rounded-[8px] border border-white/10 bg-[#05070a]/90 p-5 shadow-[0_28px_90px_rgba(0,0,0,0.45)] md:p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header with recommendation badge */}
      <div className="mb-6 flex flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-[6px] border border-blue-500/25 bg-blue-500/10">
            <Sparkles className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <p className="font-opencode text-[11px] uppercase text-blue-500">AI Assessment</p>
            <h2 className="mt-1 text-lg font-semibold text-zinc-100">Performance analysis</h2>
          </div>
        </div>

        <motion.div
          className={`flex w-fit items-center gap-2 rounded-[4px] border px-3 py-2 ${recConfig.bg} ${recConfig.glow}`}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <RecIcon size={18} className={recConfig.text} />
          <span className={`font-semibold ${recConfig.text}`}>
            {scorecard.overallRecommendation}
          </span>
        </motion.div>
      </div>

      {/* Main content: Radar Chart + Summary */}
      <div className="mb-6 grid gap-5 md:grid-cols-[0.92fr_1.08fr]">
        {/* Radar Chart */}
        <div className="flex items-center justify-center overflow-hidden rounded-[8px] border border-white/10 bg-black/25 py-6 md:py-4">
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
              size={280}
              animated={true}
              onDimensionClick={handleDimensionClick}
              activeDimension={activeDimension}
            />
          </div>
        </div>

        {/* Summary and quick stats */}
        <div className="flex flex-col justify-center">
          <p className="mb-5 text-sm leading-6 text-zinc-400">
            {scorecard.summary}
          </p>

          {/* Quick score indicators */}
          <div className="grid grid-cols-2 gap-3">
            {dimensions.map((dim, i) => {
              const scoreColor = dim.data.score >= 4 ? 'text-emerald-400' : dim.data.score >= 3 ? 'text-amber-400' : 'text-rose-400'
              const isActive = activeDimension === i
              return (
                <button
                  key={dim.key}
                  onClick={() => handleDimensionClick(i)}
                  className={`rounded-[6px] border p-3 text-left transition-all ${isActive
                    ? 'border-blue-500/40 bg-blue-500/10'
                    : 'border-white/10 bg-white/[0.025] hover:border-blue-500/30 hover:bg-blue-500/[0.06]'
                    }`}
                >
                  <p className="mb-1 text-xs text-zinc-500">{dim.label}</p>
                  <p className={`font-opencode text-xl font-semibold ${scoreColor}`}>{dim.data.score}/5</p>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Expandable dimension details */}
      <div className="border-t border-white/10 pt-4">
        <p className="mb-3 px-3 font-opencode text-[10px] uppercase text-zinc-500">
          Detailed Breakdown
        </p>
        {dimensions.map((dim, i) => (
          <DimensionDetail
            key={dim.key}
            label={dim.label}
            score={dim.data.score}
            evidence={dim.data.evidence}
            reasoning={dim.data.reasoning}
            isActive={activeDimension === i}
            onToggle={() => handleDimensionClick(i)}
          />
        ))}
      </div>
    </motion.div>
  )
}

function TranscriptCard({ transcript }: { transcript: string }) {
  const messages = parseTranscript(transcript)
  const messageCount = messages.length

  return (
    <Sheet>
      <SheetTrigger asChild>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full"
        >
          <Card className="group cursor-pointer rounded-[8px] border-white/10 bg-[#05070a]/90 shadow-none transition-all hover:border-blue-500/35">
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
      <SheetContent side="right" className="flex w-full flex-col border-white/10 bg-[#020305] p-0 text-zinc-100 sm:max-w-lg">
        <SheetHeader className="border-b border-white/10 bg-[#05070a] p-4">
          <SheetTitle className="text-zinc-100">Interview Transcript</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto bg-[#020305] p-4">
          {messages.length === 0 ? (
            <p className="py-12 text-center text-zinc-500">No transcript available</p>
          ) : (
            <div className="space-y-3">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-[8px] px-4 py-2.5 ${msg.role === 'user'
                      ? 'rounded-br-[3px] bg-blue-600 text-white'
                      : 'rounded-bl-[3px] border border-white/10 bg-white/[0.035] text-zinc-100'
                      }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-medium ${msg.role === 'user' ? 'text-blue-100' : 'text-zinc-500'
                        }`}>
                        {msg.role === 'user' ? 'Candidate' : 'AI Interviewer'}
                      </span>
                      {msg.timestamp && (
                        <span className={`text-xs ${msg.role === 'user' ? 'text-blue-200' : 'text-zinc-500'
                          }`}>
                          {msg.timestamp}
                        </span>
                      )}
                    </div>
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
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
    : new Date(submission.created_at).toLocaleTimeString()

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
        const sessionVisibility = sessionRes.data?.visibility || 'private'
        const ownsSession = currentUserId === sessionRes.data?.user_id

        if (sessionVisibility === 'private' && !ownsSession) {
          setError('This report is private')
          setLoading(false)
          return
        }

        setSessionData(sessionRes.data)
        setSubmissions(submissionsRes.data || [])
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

          {/* Secondary Row: Transcript + Submissions */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Transcript Card */}
            <div className="lg:col-span-1 min-w-0">
              {sessionData?.transcript?.items ? (
                <TranscriptCard transcript={sessionData.transcript.items} />
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Card className="rounded-[8px] border-white/10 bg-[#05070a]/90 p-5 shadow-none">
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
            </div>

            {/* Submissions Timeline */}
            <div className="lg:col-span-2 min-w-0">
              {submissions.length > 0 ? (
                <div className="space-y-3">
                  <p className="mb-4 font-opencode text-[10px] uppercase text-zinc-500">
                    Submission Timeline
                  </p>
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
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="flex items-center gap-4 rounded-[8px] border border-white/10 bg-[#05070a]/90 p-5"
                >
                  <div className="grid h-11 w-11 place-items-center rounded-[6px] border border-white/10 bg-white/[0.035]">
                    <MessageSquare size={20} className="text-zinc-500" />
                  </div>
                  <p className="text-zinc-500">No code submissions were made during this session.</p>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
