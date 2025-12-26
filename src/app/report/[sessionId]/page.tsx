"use client"

import { useParams } from "next/navigation"
import { useEffect, useState, useMemo } from "react"
import { createClient } from "@/lib/supabase/client"
import { diffLines, Change } from "diff"
import { motion } from "motion/react"
import {
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
    color: 'text-zinc-500',
    bg: 'bg-zinc-100 dark:bg-zinc-800'
  },
  unlisted: {
    icon: Link2,
    label: 'Unlisted',
    color: 'text-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-500/20'
  },
  public: {
    icon: Globe,
    label: 'Public',
    color: 'text-green-500',
    bg: 'bg-green-50 dark:bg-green-500/20'
  },
}

const recommendationConfig: Record<string, {
  bg: string
  text: string
  glow: string
  icon: typeof TrendingUp
}> = {
  'Strong Hire': {
    bg: 'bg-emerald-500/20',
    text: 'text-emerald-400',
    glow: 'glow-success',
    icon: TrendingUp
  },
  'Hire': {
    bg: 'bg-green-500/20',
    text: 'text-green-400',
    glow: 'glow-success',
    icon: TrendingUp
  },
  'Maybe': {
    bg: 'bg-yellow-500/20',
    text: 'text-yellow-400',
    glow: 'glow-warning',
    icon: Minus
  },
  'No Hire': {
    bg: 'bg-red-500/20',
    text: 'text-red-400',
    glow: 'glow-danger',
    icon: TrendingDown
  },
}

function VisibilityLabel({ visibility }: { visibility: Visibility }) {
  const config = visibilityConfig[visibility]
  const Icon = config.icon

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md ${config.bg}`}>
      <Icon size={14} className={config.color} />
      <span className={`text-sm font-medium ${config.color}`}>{config.label}</span>
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
    <div className="flex items-center gap-2">
      <Select
        value={currentVisibility}
        onValueChange={(v) => handleVisibilityChange(v as Visibility)}
        disabled={isUpdating}
      >
        <SelectTrigger className="w-[140px] h-9">
          <div className="flex items-center gap-2">
            <CurrentIcon size={14} className={`${current.color} shrink-0`} />
            <span className="text-sm">{current.label}</span>
          </div>
        </SelectTrigger>
        <SelectContent>
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
          className="h-9 px-3"
        >
          {copied ? (
            <>
              <Check size={14} className="mr-1.5 text-green-500" />
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
    <pre className="text-xs font-mono bg-muted p-3 rounded overflow-x-auto border border-border">
      {changes.map((change: Change, i: number) => {
        const lines = change.value.split('\n').filter((_, idx, arr) =>
          idx < arr.length - 1 || arr[idx] !== ''
        )
        return lines.map((line, j) => (
          <div
            key={`${i}-${j}`}
            className={
              change.added
                ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400"
                : change.removed
                  ? "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400"
                  : "text-muted-foreground"
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
  const scoreColor = score >= 4 ? 'text-emerald-400' : score >= 3 ? 'text-yellow-400' : 'text-red-400'
  const scoreBg = score >= 4 ? 'bg-emerald-500/20' : score >= 3 ? 'bg-yellow-500/20' : 'bg-red-500/20'

  return (
    <Collapsible open={isActive} onOpenChange={onToggle}>
      <CollapsibleTrigger className="w-full">
        <div className="flex items-center gap-3 py-3 px-4 hover:bg-accent/50 rounded-lg transition-colors cursor-pointer">
          <ChevronRight
            size={16}
            className={`text-muted-foreground transition-transform duration-200 ${isActive ? 'rotate-90' : ''}`}
          />
          <span className="text-sm font-medium text-foreground flex-1 text-left">{label}</span>
          <span className={`text-lg font-bold ${scoreColor}`}>{score}/5</span>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
        <div className={`mx-2 mb-3 p-6 rounded-xl border border-border/50 ${scoreBg}`}>
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2 opacity-70">Evidence</p>
              <p className="text-sm text-foreground leading-relaxed">{evidence}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2 opacity-70">Reasoning</p>
              <p className="text-sm text-foreground leading-relaxed">{reasoning}</p>
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
      className="glass-card rounded-2xl p-6 md:p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header with recommendation badge */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">AI Assessment</h2>
            <p className="text-sm text-muted-foreground">Performance Analysis</p>
          </div>
        </div>

        <motion.div
          className={`flex items-center gap-2 px-4 py-2 rounded-full ${recConfig.bg} ${recConfig.glow}`}
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
      <div className="grid md:grid-cols-2 gap-8 mb-6">
        {/* Radar Chart */}
        <div className="flex justify-center items-center">
          <RadarChart
            dimensions={radarData}
            size={280}
            animated={true}
            onDimensionClick={handleDimensionClick}
            activeDimension={activeDimension}
          />
        </div>

        {/* Summary and quick stats */}
        <div className="flex flex-col justify-center">
          <p className="text-sm text-muted-foreground leading-relaxed mb-6">
            {scorecard.summary}
          </p>

          {/* Quick score indicators */}
          <div className="grid grid-cols-2 gap-3">
            {dimensions.map((dim, i) => {
              const scoreColor = dim.data.score >= 4 ? 'text-emerald-400' : dim.data.score >= 3 ? 'text-yellow-400' : 'text-red-400'
              const isActive = activeDimension === i
              return (
                <button
                  key={dim.key}
                  onClick={() => handleDimensionClick(i)}
                  className={`text-left p-3 rounded-lg border transition-all ${isActive
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50 hover:bg-accent/50'
                    }`}
                >
                  <p className="text-xs text-muted-foreground mb-1">{dim.label}</p>
                  <p className={`text-xl font-bold ${scoreColor}`}>{dim.data.score}/5</p>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Expandable dimension details */}
      <div className="border-t border-border pt-4">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3 px-4">
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
        >
          <Card className="glass-card border-border hover:border-primary/50 transition-all cursor-pointer group">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400 group-hover:bg-blue-500/30 transition-colors">
                    <MessageSquare size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Interview Transcript</h3>
                    <p className="text-sm text-muted-foreground">
                      {messageCount > 0 ? `${messageCount} messages` : 'No messages'}
                    </p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-lg bg-background border-border p-0 flex flex-col">
        <SheetHeader className="p-4 border-b border-border bg-card">
          <SheetTitle className="text-foreground">Interview Transcript</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto p-4 bg-background">
          {messages.length === 0 ? (
            <p className="text-muted-foreground text-center py-12">No transcript available</p>
          ) : (
            <div className="space-y-3">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-md dark:bg-blue-500'
                      : 'bg-card text-foreground border border-border rounded-bl-md shadow-sm'
                      }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-medium ${msg.role === 'user' ? 'text-blue-200 dark:text-blue-100' : 'text-muted-foreground'
                        }`}>
                        {msg.role === 'user' ? 'Candidate' : 'AI Interviewer'}
                      </span>
                      {msg.timestamp && (
                        <span className={`text-xs ${msg.role === 'user' ? 'text-blue-300 dark:text-blue-200' : 'text-muted-foreground'
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
    <div className={`flex items-center gap-1.5 text-sm font-medium ${allPassed ? 'text-emerald-400' : 'text-red-400'}`}>
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
    >
      <Card className={`glass-card border-border overflow-hidden ${expanded ? 'ring-1 ring-primary/30' : ''}`}>
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between p-4 hover:bg-accent/30 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${allPassed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
              }`}>
              {index + 1}
            </div>
            <div className="text-left">
              <span className="font-medium text-foreground">Submission #{index + 1}</span>
              <span className="text-muted-foreground text-sm ml-2">{time}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <TestResultBadge results={submission.result_json.submissions} />
            <ChevronRight
              size={16}
              className={`text-muted-foreground transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`}
            />
          </div>
        </button>

        {expanded && (
          <CardContent className="pt-0 pb-4 border-t border-border">
            {aiComment && (
              <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg text-sm text-blue-400">
                <span className="font-medium">AI Feedback: </span>{aiComment}
              </div>
            )}

            <div className="mt-4">
              {prevCode ? (
                <>
                  <p className="text-xs text-muted-foreground mb-2">Changes from previous submission:</p>
                  <DiffView oldCode={prevCode} newCode={submission.code} />
                </>
              ) : (
                <>
                  <p className="text-xs text-muted-foreground mb-2">Initial submission:</p>
                  <pre className="text-xs font-mono bg-muted p-3 rounded overflow-x-auto text-foreground border border-border">
                    {submission.code}
                  </pre>
                </>
              )}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              {submission.result_json.submissions.map((result, i) => (
                <div
                  key={i}
                  className={`text-xs p-2 rounded border ${result.status.id === 3
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : 'bg-red-500/10 text-red-400 border-red-500/30'
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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Loading report...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          className="text-center glass-card p-8 rounded-2xl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Lock className="mx-auto mb-4 text-muted-foreground" size={48} />
          <p className="text-destructive font-medium text-lg">{error}</p>
          <p className="text-muted-foreground text-sm mt-1">You don&apos;t have permission to view this report</p>
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

  return (
    <div className="min-h-screen p-4 md:p-8 bg-background">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.header
          className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className="text-3xl font-bold text-foreground">Session Report</h1>
            <p className="text-muted-foreground mt-1">
              {submissions.length} submissions • {totalPassed}/{totalTests} tests passed
            </p>
          </div>
          <PrivacyDropdown
            sessionId={sessionId}
            currentVisibility={visibility}
            onVisibilityChange={setVisibility}
            isOwner={isOwner}
          />
        </motion.header>

        {/* Main Content */}
        <div className="space-y-6">
          {/* AI Assessment Hero */}
          {scorecard ? (
            <HeroScorecard scorecard={scorecard} />
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-2xl p-8 text-center"
            >
              <Sparkles className="mx-auto mb-4 text-muted-foreground" size={40} />
              <p className="text-muted-foreground">No AI assessment available for this session</p>
            </motion.div>
          )}

          {/* Secondary Row: Transcript + Submissions */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Transcript Card */}
            <div className="lg:col-span-1">
              {sessionData?.transcript?.items ? (
                <TranscriptCard transcript={sessionData.transcript.items} />
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Card className="glass-card p-5">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-muted">
                        <MessageSquare size={24} className="text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">Interview Transcript</h3>
                        <p className="text-sm text-muted-foreground">No transcript available</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}
            </div>

            {/* Submissions Timeline */}
            <div className="lg:col-span-2">
              {submissions.length > 0 ? (
                <div className="space-y-3">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-4">
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
                  className="flex items-center gap-4 p-5 glass-card rounded-xl"
                >
                  <div className="p-3 rounded-xl bg-muted">
                    <MessageSquare size={24} className="text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">No code submissions were made during this session.</p>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
