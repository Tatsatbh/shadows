"use client"

import { useParams } from "next/navigation"
import { useEffect, useState, useMemo } from "react"
import { createClient } from "@/lib/supabase/client"
import { diffLines, Change } from "diff"
import { ChevronRight, CheckCircle2, XCircle, MessageSquare } from "lucide-react"
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
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"


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

function DimensionScore({ 
  label, 
  score, 
  evidence, 
  reasoning 
}: { 
  label: string
  score: number
  evidence: string
  reasoning: string
}) {
  const [isOpen, setIsOpen] = useState(false)
  const color = score >= 4 ? 'bg-green-500' : score >= 3 ? 'bg-yellow-500' : 'bg-red-500'
  
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="w-full">
        <div className="flex items-center gap-3 py-2 hover:bg-accent rounded-lg px-2 -mx-2 transition-colors cursor-pointer">
          <ChevronRight 
            size={16} 
            className={`text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} 
          />
          <span className="text-sm text-foreground w-32 text-left">{label}</span>
          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
            <div className={`h-full ${color} transition-all`} style={{ width: `${(score / 5) * 100}%` }} />
          </div>
          <span className="text-sm text-muted-foreground w-10 text-right">{score}/5</span>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
        <div className="mt-2 p-4 bg-muted rounded-lg border border-border space-y-3">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Evidence</p>
            <p className="text-sm text-foreground leading-relaxed">{evidence}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Reasoning</p>
            <p className="text-sm text-foreground leading-relaxed">{reasoning}</p>
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

function AIAssessmentPanel({ scorecard }: { scorecard: Scorecard }) {
  const recColor = {
    'Strong Hire': 'text-green-700 bg-green-100 border-green-300',
    'Hire': 'text-green-600 bg-green-50 border-green-200',
    'Maybe': 'text-yellow-700 bg-yellow-100 border-yellow-300',
    'No Hire': 'text-red-700 bg-red-100 border-red-300'
  }[scorecard.overallRecommendation] || 'text-zinc-600 bg-zinc-100 border-zinc-300'

  const dimensions = [
    { key: 'problemSolving', label: 'Problem Solving', data: scorecard.dimensions.problemSolving },
    { key: 'codeQuality', label: 'Code Quality', data: scorecard.dimensions.codeQuality },
    { key: 'communication', label: 'Communication', data: scorecard.dimensions.communication },
    { key: 'debugging', label: 'Debugging', data: scorecard.dimensions.debugging },
  ]

  return (
    <Card className="bg-card border-border shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">AI Assessment</CardTitle>
          <span className={`px-3 py-1.5 rounded-full text-sm font-semibold border ${recColor}`}>
            {scorecard.overallRecommendation}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-sm text-muted-foreground leading-relaxed">{scorecard.summary}</p>
        
        <div className="space-y-3">
          {dimensions.map(({ key, label, data }) => (
            <DimensionScore
              key={key}
              label={label}
              score={data.score}
              evidence={data.evidence}
              reasoning={data.reasoning}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function TranscriptCard({ transcript }: { transcript: string }) {
  const messages = parseTranscript(transcript)
  const messageCount = messages.length
  
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Card className="bg-card border-border shadow-sm hover:bg-accent transition-colors cursor-pointer group">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-blue-100 text-blue-600 group-hover:bg-blue-200 transition-colors dark:bg-blue-500/20 dark:text-blue-400 dark:group-hover:bg-blue-500/30">
                  <MessageSquare size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Interview Transcript</h3>
                  <p className="text-sm text-muted-foreground">
                    {messageCount > 0 ? `${messageCount} messages` : 'No messages'}
                  </p>
                </div>
              </div>
              <ChevronRight size={20} className="text-muted-foreground group-hover:text-foreground transition-colors" />
            </div>
          </CardContent>
        </Card>
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
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white rounded-br-md dark:bg-blue-500'
                        : 'bg-card text-foreground border border-border rounded-bl-md shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-medium ${
                        msg.role === 'user' ? 'text-blue-200 dark:text-blue-100' : 'text-muted-foreground'
                      }`}>
                        {msg.role === 'user' ? 'Candidate' : 'AI Interviewer'}
                      </span>
                      {msg.timestamp && (
                        <span className={`text-xs ${
                          msg.role === 'user' ? 'text-blue-300 dark:text-blue-200' : 'text-muted-foreground'
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
    <div className={`flex items-center gap-1.5 text-sm ${allPassed ? 'text-green-600' : 'text-red-600'}`}>
      {allPassed ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
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
  
  return (
    <Card className="bg-card border-border shadow-sm overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-accent transition-colors"
      >
        <div className="flex items-center gap-3">
          <ChevronRight 
            size={16} 
            className={`text-muted-foreground transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`}
          />
          <span className="font-medium text-foreground">Submission #{index + 1}</span>
          <span className="text-muted-foreground text-sm">{time}</span>
        </div>
        <TestResultBadge results={submission.result_json.submissions} />
      </button>
      
      {expanded && (
        <CardContent className="pt-3 border-t border-border">
          {aiComment && (
            <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700 dark:bg-blue-500/20 dark:border-blue-500/50 dark:text-blue-400">
              <span className="font-medium">AI: </span>{aiComment}
            </div>
          )}
          
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
          
          <div className="mt-3 grid grid-cols-2 gap-2">
            {submission.result_json.submissions.map((result, i) => (
              <div 
                key={i}
                className={`text-xs p-2 rounded border ${
                  result.status.id === 3 
                    ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-500/20 dark:text-green-400 dark:border-green-500/50' 
                    : 'bg-red-100 text-red-700 border-red-200 dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/50'
                }`}
              >
                Test {i + 1}: {result.status.description}
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  )
}

export default function ReportPage() {
  const params = useParams()
  const sessionId = params.sessionId as string
  const [sessionData, setSessionData] = useState<SessionData | null>(null)
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = createClient()
        
        const [sessionRes, submissionsRes] = await Promise.all([
          supabase
            .from('sessions')
            .select('*')
            .eq('id', sessionId)
            .single(),
          supabase
            .from('submissions')
            .select('*')
            .eq('session_id', sessionId)
            .order('created_at', { ascending: true })
        ])

        if (sessionRes.error) throw sessionRes.error
        if (submissionsRes.error) throw submissionsRes.error

        setSessionData(sessionRes.data)
        setSubmissions(submissionsRes.data || [])
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
        <p className="text-muted-foreground">Loading report...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-destructive">Error: {error}</p>
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
    <div className="min-h-screen p-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Session Report</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {submissions.length} submissions • {totalPassed}/{totalTests} total test runs passed
          </p>
        </div>

        <div className="hidden lg:flex gap-6">
          <div className="w-[32%] shrink-0">
            <div className="sticky top-6 space-y-6">
              {scorecard ? (
                <AIAssessmentPanel scorecard={scorecard} />
              ) : (
                <Card className="bg-card border-border shadow-sm">
                  <CardContent className="p-6 text-center text-muted-foreground">
                    No AI assessment available
                  </CardContent>
                </Card>
              )}
              
              {sessionData?.transcript?.items && (
                <TranscriptCard transcript={sessionData.transcript.items} />
              )}
            </div>
          </div>

          <div className="flex-1">
            <div>
                <div className="space-y-3">
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

                {submissions.length === 0 && (
                  <Card className="bg-card border-border shadow-sm">
                    <CardContent className="p-6 text-center text-muted-foreground">
                      No submissions found for this session.
                    </CardContent>
                  </Card>
                )}
            </div>
          </div>
        </div>

        <div className="lg:hidden space-y-6">
          {scorecard ? (
            <AIAssessmentPanel scorecard={scorecard} />
          ) : (
            <Card className="bg-card border-border shadow-sm">
              <CardContent className="p-6 text-center text-muted-foreground">
                No AI assessment available
              </CardContent>
            </Card>
          )}

          {sessionData?.transcript?.items && (
            <TranscriptCard transcript={sessionData.transcript.items} />
          )}

          <div>
            <h2 className="text-lg font-semibold mb-4 text-foreground">Submission Timeline</h2>
            <div className="space-y-3">
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

            {submissions.length === 0 && (
              <Card className="bg-card border-border shadow-sm">
                <CardContent className="p-6 text-center text-muted-foreground">
                  No submissions found for this session.
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
