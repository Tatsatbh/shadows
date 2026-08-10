"use client"

import localFont from "next/font/local"
import { GeistSans } from "geist/font/sans"
import { useState, type ReactNode } from "react"
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Bot,
  Check,
  ChevronDown,
  Code2,
  FileText,
  FlaskConical,
  Github,
  Headphones,
  LockKeyhole,
  Menu,
  Mic2,
  ShieldCheck,
  Sparkles,
  Terminal,
  Users,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react"

import { SignInDialog } from "@/components/app/SignInDialog"
import { WaitlistDialog } from "@/components/app/WaitlistDialog"

const departureMono = localFont({
  src: "../../public/fonts/departure-mono.woff2",
  variable: "--font-departure-mono",
  display: "swap",
})

const jetbrainsMono = localFont({
  src: "../../public/fonts/jetbrainsmono.ttf",
  variable: "--font-jetbrains-mono",
  display: "swap",
})

const navItems = [
  { href: "#product", label: "Product" },
  { href: "#features", label: "Solutions" },
  { href: "#faq", label: "Resources" },
  { href: "#pricing", label: "Pricing" },
  { href: "#enterprise", label: "Enterprise" },
]

const heroProof: Array<{ title: string; body: string; Icon: LucideIcon }> = [
  { title: "Voice Interview", body: "Talk naturally with AI", Icon: Mic2 },
  { title: "Real Editor", body: "Code like in real life", Icon: Code2 },
  { title: "Instant Feedback", body: "Report with diffs and notes", Icon: BarChart3 },
]

const valueProps: Array<{ title: string; body: string; Icon: LucideIcon }> = [
  {
    title: "Realistic and Adaptive",
    body: "Interviews adapt to your answers just like in real life.",
    Icon: ShieldCheck,
  },
  {
    title: "Deep Technical Evaluation",
    body: "We evaluate not just what you code, but how you think.",
    Icon: Bot,
  },
  {
    title: "Instant Feedback",
    body: "Know where you stand and what to improve immediately.",
    Icon: BarChart3,
  },
  {
    title: "Private and Secure",
    body: "Your data stays yours. Always encrypted.",
    Icon: LockKeyhole,
  },
]

const featureCards: Array<{
  eyebrow: string
  title: string
  body: string
  Icon: LucideIcon
  points?: string[]
}> = [
  {
    eyebrow: "01",
    title: "Voice AI Interviewer",
    body: "Talk naturally. Our AI interviewer listens, understands your code, and asks smart follow-ups in real time.",
    Icon: Mic2,
    points: ["Natural voice conversation", "Reads your IDE and reasoning", "Context-aware follow-ups"],
  },
  {
    eyebrow: "02",
    title: "Live Code + Judge0 Sandbox",
    body: "Write, run, and test your code in a secure sandbox. Get instant results as you go.",
    Icon: Code2,
  },
  {
    eyebrow: "03",
    title: "Smart Follow-Ups",
    body: "Adaptive questions based on your solution, approach, and edge cases.",
    Icon: Sparkles,
  },
  {
    eyebrow: "04",
    title: "Post-Interview Report",
    body: "Get a detailed report with code diffs, complexity analysis, feedback, and a scorecard.",
    Icon: FileText,
  },
]

const workflowSteps = [
  {
    number: "01",
    title: "Choose a role or problem",
    body: "Pick a role, difficulty, and topic. We tailor the interview to match.",
  },
  {
    number: "02",
    title: "Talk and code in real time",
    body: "Discuss your approach, ask questions, and code while the AI listens.",
  },
  {
    number: "03",
    title: "Run tests and get follow-up",
    body: "Run your code, see results instantly, and get follow-up questions that go deeper.",
  },
  {
    number: "04",
    title: "Get a report with actions",
    body: "Receive a detailed report with scores, strengths, gaps, and personalized next steps.",
  },
]

const codeLines: Array<{ n: number; code: ReactNode }> = [
  {
    n: 1,
    code: (
      <>
        <span className="text-fuchsia-300">from</span> typing <span className="text-fuchsia-300">import</span> List
      </>
    ),
  },
  { n: 2, code: <>&nbsp;</> },
  {
    n: 3,
    code: (
      <>
        <span className="text-fuchsia-300">def</span>{" "}
        <span className="text-sky-300">longest_subarray</span>(nums: List[<span className="text-cyan-300">int</span>], k:{" "}
        <span className="text-cyan-300">int</span>) -&gt; <span className="text-cyan-300">int</span>:
      </>
    ),
  },
  { n: 4, code: <span className="pl-6 text-zinc-300">left = 0</span> },
  { n: 5, code: <span className="pl-6 text-zinc-300">current_sum = 0</span> },
  { n: 6, code: <span className="pl-6 text-zinc-300">max_len = 0</span> },
  { n: 7, code: <>&nbsp;</> },
  {
    n: 8,
    code: (
      <>
        <span className="pl-6 text-fuchsia-300">for</span> right <span className="text-fuchsia-300">in</span>{" "}
        <span className="text-sky-300">range</span>(<span className="text-sky-300">len</span>(nums)):
      </>
    ),
  },
  { n: 9, code: <span className="pl-12 text-zinc-300">current_sum += nums[right]</span> },
  {
    n: 10,
    code: (
      <>
        <span className="pl-12 text-fuchsia-300">while</span> current_sum &gt; k{" "}
        <span className="text-fuchsia-300">and</span> left &lt;= right:
      </>
    ),
  },
  { n: 11, code: <span className="pl-16 text-zinc-300">current_sum -= nums[left]</span> },
  { n: 12, code: <span className="pl-16 text-zinc-300">left += 1</span> },
  { n: 13, code: <span className="pl-12 text-zinc-300">max_len = max(max_len, right - left + 1)</span> },
  { n: 14, code: <>&nbsp;</> },
  {
    n: 15,
    code: (
      <>
        <span className="pl-6 text-fuchsia-300">return</span> max_len
      </>
    ),
  },
]

const testCases = [
  { label: "Test case 1", input: "[1,2,3,4,5], k = 7", time: "12ms" },
  { label: "Test case 2", input: "[2,-1,2,1,-5,4], k = 3", time: "16ms" },
  { label: "Test case 3", input: "[10,5,2,7,1,9], k = 15", time: "14ms" },
  { label: "Test case 4", input: "[-1,-2,-3,-4,5], k = -1", time: "11ms" },
  { label: "Test case 5", input: "[1], k = 0", time: "8ms" },
]

const followUps = [
  "Can you optimize for space?",
  "What if the input is a stream?",
  "How would you test this?",
]

// Counted out of the production database on 2026-08-09. These are static, so
// they go stale — re-check before quoting them anywhere else.
const stats: Array<{ value: string; label: string; Icon: LucideIcon }> = [
  { value: "76", label: "Questions in the library, seeded from the Blind 75", Icon: FileText },
  { value: "891", label: "Test cases behind them, visible and hidden", Icon: FlaskConical },
  { value: "47", label: "Interviews run end to end on Shadows.sh", Icon: Users },
  { value: "31", label: "Finished with a full AI scorecard", Icon: BarChart3 },
]

const faqs = [
  {
    question: "Do I need to install anything?",
    answer: "No installation required. Shadows runs in your browser, so you can sign in and start your interview.",
  },
  {
    question: "Can it read my IDE while I code?",
    answer: "No. Shadows only sees what you choose to share. Your code editor stays private.",
  },
  {
    question: "Does it execute my code?",
    answer: "Your code runs only in the controlled interview sandbox. The page never needs access to your local machine.",
  },
  {
    question: "How does the report work?",
    answer: "After the interview, you get a structured report with scores, strengths, and actionable feedback.",
  },
  {
    question: "Is it for individual prep or also for teams?",
    answer: "Both. Individuals use it to level up. Teams use it to evaluate candidates consistently.",
  },
  {
    question: "Is my data secure?",
    answer: "Yes. Sessions are designed around explicit sharing, encryption, and minimal data exposure.",
  },
]

const waveform = [18, 34, 22, 44, 28, 58, 36, 66, 30, 52, 24, 48, 32, 70, 42, 36, 56, 26, 44, 62, 30, 50]

function Pixel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span className={`${departureMono.className} tracking-normal ${className}`} style={{ fontFamily: '"Departure Mono", monospace' }}>
      {children}
    </span>
  )
}

function Mono({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span className={`${jetbrainsMono.className} tracking-normal ${className}`} style={{ fontFamily: '"JetBrains Mono Local", monospace' }}>
      {children}
    </span>
  )
}

function BrandMark() {
  return (
    <a href="#product" className="flex items-center gap-3 text-white" aria-label="Shadows.sh home">
      <span className="grid h-8 w-8 place-items-center rounded-[6px] border border-[#0a6cff]/60 bg-[#04142d] text-[#0877ff] shadow-[0_0_24px_rgba(0,112,255,0.32)]">
        <Terminal className="h-4 w-4" strokeWidth={2} />
      </span>
      <span className="text-lg font-semibold tracking-normal md:text-xl">shadows.sh</span>
    </a>
  )
}

function PrimaryCta({ className = "" }: { className?: string }) {
  return (
    <WaitlistDialog>
      <button
        type="button"
        className={`inline-flex h-12 items-center justify-center gap-3 rounded-[7px] bg-[#0b72ff] px-6 text-sm font-semibold text-white shadow-[0_0_30px_rgba(0,112,255,0.42)] transition hover:bg-[#2482ff] focus:outline-none focus:ring-2 focus:ring-[#4a9bff] focus:ring-offset-2 focus:ring-offset-black ${className}`}
      >
        Start Free Interview
        <ArrowRight className="h-4 w-4" />
      </button>
    </WaitlistDialog>
  )
}

function SecondaryCta({ className = "" }: { className?: string }) {
  return (
    <a
      href="#how-it-works"
      className={`inline-flex h-12 items-center justify-center rounded-[7px] border border-[#0b72ff]/45 bg-[#061635]/55 px-6 text-sm font-semibold text-white shadow-[0_0_24px_rgba(0,112,255,0.14)] transition hover:border-[#58a0ff]/80 hover:bg-[#0b72ff]/14 focus:outline-none focus:ring-2 focus:ring-[#4a9bff]/70 focus:ring-offset-2 focus:ring-offset-black ${className}`}
    >
      Book a Demo
    </a>
  )
}

function SectionKicker({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <Mono className={`inline-flex items-center gap-2 text-xs uppercase text-[#0877ff] ${className}`}>
      <Terminal className="h-4 w-4" />
      {children}
    </Mono>
  )
}

function BlueIcon({ Icon, className = "" }: { Icon: LucideIcon; className?: string }) {
  return (
    <span
      className={`grid h-12 w-12 shrink-0 place-items-center rounded-[6px] border border-[#0b72ff]/45 bg-[#061635] text-[#0877ff] shadow-[0_0_28px_rgba(0,112,255,0.18)] ${className}`}
    >
      <Icon className="h-6 w-6" strokeWidth={1.8} />
    </span>
  )
}

function Waveform({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`flex items-center gap-1 text-[#0877ff] ${compact ? "h-7" : "h-9"}`} aria-hidden="true">
      {waveform.map((height, index) => (
        <span
          key={`${height}-${index}`}
          className="w-1 rounded-full bg-[#0877ff] shadow-[0_0_12px_rgba(0,112,255,0.65)]"
          style={{ height: `${compact ? Math.max(8, height * 0.38) : Math.max(10, height * 0.52)}px` }}
        />
      ))}
    </div>
  )
}

function CodeLine({ line }: { line: (typeof codeLines)[number] }) {
  return (
    <div className="grid grid-cols-[28px_minmax(0,1fr)] gap-3 text-[10px] leading-6 text-zinc-300 md:text-[11px]">
      <span className="select-none text-right text-zinc-600">{line.n}</span>
      <code className="min-w-0 overflow-hidden whitespace-pre">{line.code}</code>
    </div>
  )
}

function Rail() {
  const icons = [Bot, Code2, BarChart3, FileText, FlaskConical, Github, ShieldCheck]

  return (
    <aside className="hidden border-r border-[#0b72ff]/20 bg-[#061635]/20 px-2.5 py-4 lg:flex lg:flex-col lg:items-center lg:gap-4">
      {icons.map((Icon, index) => (
        <span
          key={index}
          className={`grid h-7 w-7 place-items-center rounded-[6px] ${
            index === 0
              ? "border border-[#0b72ff]/35 bg-[#0b72ff]/15 text-[#58a0ff]"
              : "text-zinc-500"
          }`}
        >
          <Icon className="h-3.5 w-3.5" strokeWidth={1.8} />
        </span>
      ))}
    </aside>
  )
}

function InterviewChat() {
  return (
    <aside className="overflow-hidden border-b border-[#0b72ff]/20 bg-[#061635]/20 p-4 lg:border-b-0 lg:border-r">
      <div className="flex items-center gap-2 text-xs font-semibold text-white xl:text-sm">
        <Bot className="h-4 w-4 text-[#0877ff]" />
        AI Interviewer
      </div>

      <div className="mt-4 rounded-[7px] border border-[#0b72ff]/24 bg-[#061635]/34 p-3.5 text-[11px] leading-5 text-zinc-200 shadow-[0_16px_40px_rgba(0,0,0,0.22),0_0_24px_rgba(0,112,255,0.08)] xl:text-xs xl:leading-6">
        <p>Let&apos;s solve a problem together.</p>
        <p className="mt-4">
          Given an array of integers, return the length of the longest subarray with a sum less than or equal to k.
        </p>
        <p className="mt-4">How would you approach this?</p>
        <p className="mt-3 text-right text-[10px] text-zinc-500">10:02 AM</p>
      </div>

      <div className="mt-4">
        <Waveform compact />
        <p className="mt-2 text-xs text-zinc-500">AI is speaking...</p>
      </div>

      <div className="mt-4 rounded-[7px] border border-[#0b72ff]/24 bg-[#061635]/34 p-3.5 text-[11px] leading-5 text-zinc-200 xl:text-xs xl:leading-6">
        Nice approach. What&apos;s the time complexity of your solution?
        <p className="mt-2 text-right text-[10px] text-zinc-500">10:05 AM</p>
      </div>

      <div className="mt-5 flex items-center gap-3 rounded-[7px] border border-[#0b72ff]/26 bg-[#061635]/34 p-3">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-[#0b72ff]/15 text-[#58a0ff]">
          <Mic2 className="h-5 w-5" />
        </span>
        <div>
          <p className="text-sm text-white">Tap to speak</p>
          <p className="text-xs text-zinc-500">or type your response...</p>
        </div>
      </div>
    </aside>
  )
}

function EditorPane() {
  return (
    <main className="min-w-0 border-b border-[#0b72ff]/20 bg-[#05070c] lg:border-b-0 lg:border-r">
      <div className="flex h-12 items-center justify-between border-b border-[#0b72ff]/20 px-4">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-8 items-center gap-2 rounded-[6px] border border-[#0b72ff]/26 bg-[#061635]/40 px-3 text-xs text-white">
            <Code2 className="h-4 w-4 text-[#0877ff]" />
            solution.py
            <X className="h-3 w-3 text-zinc-500" />
          </span>
          <span className="text-xl text-zinc-500">+</span>
        </div>
        <div className="hidden items-center gap-4 text-zinc-500 sm:flex">
          <Sparkles className="h-4 w-4" />
          <BadgeCheck className="h-4 w-4" />
        </div>
      </div>

      <div className="min-h-[340px] overflow-hidden p-4 xl:min-h-[380px]">
        <div className={`${jetbrainsMono.className} min-w-0`}>
          {codeLines.map((line) => (
            <CodeLine key={line.n} line={line} />
          ))}
        </div>
      </div>
    </main>
  )
}

function TestResults() {
  return (
    <aside className="overflow-hidden bg-[#061635]/20 p-3.5 xl:p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-white xl:text-sm">
          <FlaskConical className="h-4 w-4" />
          Test Results
        </div>
        <span className="rounded-[5px] bg-emerald-400/15 px-2 py-1 text-xs font-semibold text-emerald-300">5/5 passed</span>
      </div>

      <p className="mb-3 text-xs text-zinc-500">Custom Test Cases</p>

      <div className="space-y-2">
        {testCases.map((testCase) => (
          <div key={testCase.label} className="rounded-[7px] border border-[#0b72ff]/22 bg-[#061635]/28 px-3 py-2.5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-semibold text-zinc-200">{testCase.label}</p>
                <p className="mt-1 truncate text-xs text-zinc-500">{testCase.input}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold text-emerald-300">Passed</p>
                <p className="text-[10px] text-zinc-500">{testCase.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-[7px] border border-[#0b72ff]/24 bg-[#061635]/32 p-4">
        <p className="mb-3 text-xs font-semibold text-white">Complexity</p>
        <div className="grid grid-cols-[54px_1fr] gap-y-2 text-xs">
          <span className="text-zinc-500">Time</span>
          <span className="text-white">O(n)</span>
          <span className="text-zinc-500">Space</span>
          <span className="text-white">O(1)</span>
        </div>
      </div>
    </aside>
  )
}

function ReportStrip() {
  return (
    <div className="grid gap-4 rounded-[8px] border border-[#0b72ff]/35 bg-[#061635]/35 p-4 shadow-[0_0_34px_rgba(0,112,255,0.12)] md:grid-cols-[180px_1fr_1fr_1fr]">
      <div className="flex items-center gap-4">
        <div className="grid h-16 w-16 place-items-center rounded-full border-4 border-[#0b72ff] bg-black text-xl font-semibold text-white shadow-[0_0_28px_rgba(0,112,255,0.25)]">
          <Pixel>86</Pixel>
        </div>
        <div>
          <p className="text-xs text-zinc-500">Overall</p>
          <p className="text-sm font-semibold text-white">Score</p>
        </div>
      </div>
      <ReportColumn title="Strengths" items={["Sliding window approach", "Time complexity optimal", "Clear explanation"]} />
      <ReportColumn title="Areas to Improve" items={["Edge case handling", "Variable naming clarity"]} />
      <ReportColumn title="Next Steps" items={["Practice similar problems", "Review two-pointer patterns"]} />
    </div>
  )
}

function ReportColumn({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="border-[#0b72ff]/20 md:border-l md:pl-5">
      <p className="text-xs font-semibold text-white">{title}</p>
      <div className="mt-3 space-y-2">
        {items.map((item) => (
          <p key={item} className="flex items-center gap-2 text-xs text-zinc-400">
            <Check className="h-3.5 w-3.5 text-[#0877ff]" />
            {item}
          </p>
        ))}
      </div>
    </div>
  )
}

function ProductMock({ compact = false, showReport = false }: { compact?: boolean; showReport?: boolean }) {
  return (
    <div className="relative">
      <div className="absolute -inset-3 rounded-[12px] bg-[#0b72ff]/10 blur-2xl" aria-hidden="true" />
      <div
        className={`relative flex flex-col overflow-hidden rounded-[8px] border border-[#22406b] bg-[#070910] shadow-[0_0_0_1px_rgba(61,130,255,0.18),0_30px_90px_rgba(0,0,0,0.55),0_0_60px_rgba(0,112,255,0.16)] ${
          compact ? "" : "lg:h-[620px] xl:h-[640px] 2xl:h-[660px]"
        }`}
      >
        <div className="flex h-12 items-center justify-between border-b border-[#0b72ff]/20 bg-[#061635]/20 px-4">
          <div className="flex min-w-0 items-center gap-3 text-xs text-zinc-400">
            <Terminal className="h-4 w-4 shrink-0" />
            <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.85)]" />
            <span className="truncate text-white">Interview in progress</span>
            <span className="hidden text-zinc-600 sm:inline">|</span>
            <Mono className="hidden text-zinc-500 sm:inline">00:18:42</Mono>
          </div>
          <div className="flex items-center gap-3">
            <button className="hidden h-8 items-center gap-2 rounded-[6px] border border-rose-400/35 bg-rose-400/10 px-3 text-xs text-rose-200 sm:inline-flex">
              <span className="h-2 w-2 rounded-sm border border-current" />
              End Interview
            </button>
            <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-zinc-200 to-zinc-600 text-xs font-semibold text-black">
              A
            </span>
          </div>
        </div>

        <div
          className={`grid min-h-0 flex-1 ${
            compact
              ? "grid-cols-1 lg:grid-cols-[44px_minmax(190px,0.88fr)_minmax(280px,1.2fr)] xl:grid-cols-[44px_minmax(190px,0.88fr)_minmax(300px,1.15fr)_minmax(190px,0.75fr)]"
              : "grid-cols-1 lg:grid-cols-[44px_minmax(200px,0.82fr)_minmax(300px,1.35fr)_minmax(190px,0.75fr)]"
          }`}
        >
          <Rail />
          <InterviewChat />
          <EditorPane />
          <div className={compact ? "hidden xl:block" : ""}>
            <TestResults />
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-[#0b72ff]/20 bg-[#061635]/20 px-4 py-3 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-[5px] bg-emerald-400/15 px-3 py-1.5 text-emerald-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              All tests passed
            </span>
            <span>Runtime: 14ms</span>
            <span>Memory: 18.4MB</span>
          </div>
          <span>
            Powered by <span className="text-[#0877ff]">Judge0</span>
          </span>
        </div>
      </div>

      {showReport && (
        <div className="mt-5">
          <ReportStrip />
        </div>
      )}
    </div>
  )
}

function HeroSection() {
  return (
    <section id="product" className="relative px-5 pb-14 pt-10 md:px-8 md:pb-16 md:pt-12">
      <div className="mx-auto grid max-w-[1560px] gap-9 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
        <div className="max-w-[620px]">
          <SectionKicker>Live AI coding interviews</SectionKicker>
          <h1 className="mt-6 text-[42px] leading-[1.08] text-white md:text-[50px] lg:text-[42px] xl:text-[50px] 2xl:text-[58px]">
            <Pixel>
              <span className="lg:whitespace-nowrap">LEETCODE ALONE</span>
              <br />
              <span className="lg:whitespace-nowrap">ISN&apos;T ENOUGH.</span>
              <br />
              <span className="text-[#0b72ff]">
                <span className="lg:whitespace-nowrap">A REAL INTERVIEW</span>
                <br />
                <span className="lg:whitespace-nowrap">THAT TALKS BACK._</span>
              </span>
            </Pixel>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-300 md:text-lg md:leading-8">
            Practice with an adaptive AI interviewer that watches you code, runs your solution, checks edge cases, and
            evaluates how you think.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <PrimaryCta className="sm:min-w-[240px]" />
            <SecondaryCta className="sm:min-w-[150px]" />
          </div>

          <div className="mt-7 grid max-w-[660px] gap-0 overflow-hidden rounded-[7px] border border-[#0b72ff]/35 bg-[#061635]/30 shadow-[0_0_34px_rgba(0,112,255,0.12)] sm:grid-cols-3">
            {heroProof.map(({ title, body, Icon }) => (
              <div key={title} className="flex items-center gap-3 border-[#0b72ff]/20 p-3.5 sm:border-r sm:last:border-r-0">
                <BlueIcon Icon={Icon} className="h-9 w-9" />
                <div>
                  <p className="text-sm font-semibold text-white">{title}</p>
                  <p className="text-xs text-zinc-500">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="min-w-0">
          <ProductMock />
        </div>
      </div>
    </section>
  )
}

function FeaturesSection() {
  return (
    <section id="features" className="px-5 py-16 md:px-8 md:py-20">
      <div className="mx-auto max-w-[1320px]">
        <div className="mx-auto max-w-5xl text-center">
          <SectionKicker>Features</SectionKicker>
          <h2 className="mt-5 text-3xl leading-tight text-white md:text-5xl">
            <Pixel>
              BUILT FOR <span className="text-[#0b72ff]">REAL INTERVIEWS</span>
            </Pixel>
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-zinc-300 md:text-lg">
            Shadows.sh simulates how senior engineers actually interview: live conversation, real-time coding, instant
            feedback, and deep analysis.
          </p>
        </div>

        <div className="mt-11 grid gap-5 lg:grid-cols-3">
          <article className="rounded-[8px] border border-[#0b72ff]/45 bg-[#061635]/35 p-6 shadow-[0_0_50px_rgba(0,112,255,0.16)]">
            <span className="inline-grid h-10 w-10 place-items-center rounded-[6px] border border-[#0b72ff]/45 text-[#0877ff]">
              <Pixel>01</Pixel>
            </span>
            <div className="mt-8">
              <BlueIcon Icon={Mic2} />
              <h3 className="mt-6 text-xl font-semibold text-white">Voice AI Interviewer</h3>
              <p className="mt-4 max-w-md text-sm leading-6 text-zinc-400">
                Talk naturally. Our AI interviewer listens, understands your code and asks smart follow-ups in real time.
              </p>
              <div className="mt-7 space-y-4 text-sm">
                {featureCards[0].points?.map((point) => (
                  <p key={point} className="flex items-center gap-3 text-zinc-300">
                    <Check className="h-4 w-4 text-[#0877ff]" />
                    {point}
                  </p>
                ))}
              </div>
            </div>
          </article>

          <FeatureCard feature={featureCards[1]} />
          <FeatureCard feature={featureCards[2]} />
          <FeatureCard feature={featureCards[3]} wide />
        </div>
      </div>
    </section>
  )
}

function FeatureCard({ feature, wide = false }: { feature: (typeof featureCards)[number]; wide?: boolean }) {
  return (
    <article className={`min-w-0 overflow-hidden rounded-[8px] border border-[#0b72ff]/32 bg-[#061635]/30 p-6 shadow-[0_0_42px_rgba(0,112,255,0.12)] ${wide ? "lg:col-span-3" : ""}`}>
      <span className="inline-grid h-10 w-10 place-items-center rounded-[6px] border border-[#0b72ff]/45 text-[#0877ff]">
        <Pixel>{feature.eyebrow}</Pixel>
      </span>
      <div className={`mt-7 ${wide ? "grid min-w-0 gap-6 lg:grid-cols-[0.72fr_1.28fr] lg:items-center" : ""}`}>
        <div className="min-w-0">
          <feature.Icon className="h-8 w-8 text-[#0877ff]" />
          <h3 className="mt-5 text-xl font-semibold text-white">{feature.title}</h3>
          <p className="mt-4 max-w-lg text-sm leading-6 text-zinc-400">{feature.body}</p>
        </div>
        {feature.eyebrow === "02" && (
          <div className="mt-6 rounded-[7px] border border-[#0b72ff]/30 bg-[#020b19]/70 p-4 shadow-[inset_0_0_24px_rgba(0,112,255,0.08)]">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-semibold text-white">Test Results</p>
              <span className="rounded-[5px] bg-emerald-400/15 px-2 py-1 text-xs text-emerald-300">5/5 passed</span>
            </div>
            {testCases.slice(0, 3).map((testCase) => (
              <div key={testCase.label} className="flex items-center justify-between border-t border-[#0b72ff]/18 py-2 text-xs">
                <span className="text-zinc-400">{testCase.label}</span>
                <span className="text-emerald-300">Passed</span>
              </div>
            ))}
          </div>
        )}
        {feature.eyebrow === "03" && (
          <div className="mt-6 space-y-3">
            {followUps.map((followUp) => (
              <div key={followUp} className="flex items-center gap-3 rounded-[6px] border border-[#0b72ff]/28 bg-[#061635]/45 px-4 py-3 text-sm text-zinc-300">
                <Bot className="h-4 w-4 text-[#0877ff]" />
                {followUp}
              </div>
            ))}
          </div>
        )}
        {feature.eyebrow === "04" && (
          <div className="mt-6 min-w-0 rounded-[7px] border border-[#0b72ff]/28 bg-[#020b19]/60 p-4 shadow-[inset_0_0_24px_rgba(0,112,255,0.08)] lg:mt-0">
            <CompactReportPreview />
            <div className="mt-4 overflow-hidden rounded-[6px] border border-[#0b72ff]/24">
              <div className={`${jetbrainsMono.className} bg-rose-500/10 px-4 py-2 text-[11px] text-rose-200`}>
                - for i in range(len(nums)):
              </div>
              <div className={`${jetbrainsMono.className} bg-emerald-500/10 px-4 py-2 text-[11px] text-emerald-200`}>
                + for right, num in enumerate(nums):
              </div>
            </div>
          </div>
        )}
      </div>
    </article>
  )
}

function CompactReportPreview() {
  const reportItems = [
    { title: "Strengths", items: ["Sliding window approach", "Time complexity optimal"] },
    { title: "Areas to Improve", items: ["Edge case coverage", "Variable naming"] },
    { title: "Next Steps", items: ["Practice two-pointer patterns", "Review boundary cases"] },
  ]

  return (
    <div className="grid min-w-0 gap-4 rounded-[7px] border border-[#0b72ff]/32 bg-[#061635]/36 p-4 shadow-[0_0_30px_rgba(0,112,255,0.1)] md:grid-cols-[150px_1fr]">
      <div className="flex items-center gap-4">
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full border-4 border-[#0b72ff] bg-black text-lg font-semibold text-white shadow-[0_0_28px_rgba(0,112,255,0.25)]">
          <Pixel>86</Pixel>
        </div>
        <div>
          <p className="text-xs text-zinc-500">Overall</p>
          <p className="text-sm font-semibold text-white">Score</p>
        </div>
      </div>

      <div className="grid min-w-0 gap-4 sm:grid-cols-3">
        {reportItems.map((column) => (
          <div key={column.title} className="min-w-0 border-[#0b72ff]/20 sm:border-l sm:pl-4">
            <p className="text-xs font-semibold text-white">{column.title}</p>
            <div className="mt-3 space-y-2">
              {column.items.map((item) => (
                <p key={item} className="flex min-w-0 items-start gap-2 text-xs leading-5 text-zinc-400">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#0877ff]" />
                  <span className="min-w-0">{item}</span>
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function HowItWorksSection() {
  return (
    <section id="how-it-works" className="px-5 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-[1560px]">
        <div className="grid gap-10 lg:grid-cols-[0.56fr_1.44fr]">
          <div>
            <SectionKicker>03 / 6</SectionKicker>
            <h2 className="mt-5 text-4xl leading-tight text-white md:text-5xl">
              <Pixel>HOW IT WORKS</Pixel>
            </h2>
            <p className="mt-3 text-[#0877ff]">
              <Mono>A LIVE INTERVIEW, STEP BY STEP.</Mono>
            </p>
            <p className="mt-4 max-w-lg text-base leading-7 text-zinc-300 md:text-lg">
              From first question to final feedback, Shadows simulates real interviews so you can practice with purpose.
            </p>

            <div className="mt-10 space-y-10">
              {workflowSteps.map((step, index) => (
                <div key={step.number} className="relative grid grid-cols-[74px_1fr] gap-6">
                  {index < workflowSteps.length - 1 && (
                    <span className="absolute left-8 top-14 h-[calc(100%+28px)] w-px border-l border-dotted border-[#0b72ff]/45" />
                  )}
                  <span className="relative z-10 grid h-12 w-12 place-items-center rounded-[6px] border border-[#0b72ff]/45 bg-[#031126] text-[#0877ff] shadow-[0_0_22px_rgba(0,112,255,0.28)]">
                    <Pixel>{step.number}</Pixel>
                  </span>
                  <div>
                    <h3 className="text-base text-[#0877ff]">
                      <Mono>{step.title.toUpperCase()}</Mono>
                    </h3>
                  <p className="mt-3 max-w-md text-base leading-7 text-zinc-300">{step.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="min-w-0">
            <div className="mb-7 grid gap-4 md:grid-cols-4">
              {valueProps.map(({ title, body, Icon }) => (
                <div key={title} className="flex gap-4 border-[#0b72ff]/20 md:border-r md:pr-5 md:last:border-r-0">
                  <BlueIcon Icon={Icon} className="h-11 w-11" />
                  <div>
                    <p className="text-sm font-semibold text-white">{title}</p>
                    <p className="mt-2 text-xs leading-5 text-zinc-400">{body}</p>
                  </div>
                </div>
              ))}
            </div>
            <ProductMock compact />
            <div className="mt-5">
              <ReportStrip />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function SocialProofSection() {
  return (
    <section id="social-proof" className="px-5 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-[1480px]">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_0.7fr] lg:items-end">
          <div>
            <SectionKicker>04. By the numbers</SectionKicker>
            <h2 className="mt-5 max-w-5xl text-3xl leading-tight text-white md:text-5xl">
              <Pixel>
                WHAT IS ACTUALLY <span className="text-[#0b72ff]">IN THE BOX._</span>
              </Pixel>
            </h2>
          </div>
          <p className="max-w-lg text-lg leading-8 text-zinc-300">
            The question bank, the test cases behind it, and what has been run through Shadows.sh so far.
          </p>
        </div>

        <div className="mt-9 grid gap-5 rounded-[8px] border border-[#0b72ff]/30 bg-[#061635]/28 p-6 shadow-[0_0_38px_rgba(0,112,255,0.1)] md:grid-cols-2 lg:grid-cols-4">
          {stats.map(({ value, label, Icon }, index) => (
            <div key={value} className={`flex gap-5 ${index > 0 ? "lg:border-l lg:border-[#0b72ff]/24 lg:pl-10" : ""}`}>
              <Icon className="mt-2 h-9 w-9 shrink-0 text-[#0877ff]" strokeWidth={1.8} />
              <div>
                <p className="text-2xl text-white">
                  <Pixel>{value}</Pixel>
                </p>
                <p className="mt-2 max-w-[230px] text-sm leading-6 text-zinc-400">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FaqSection() {
  return (
    <section id="faq" className="px-5 py-16 md:px-8 md:py-24">
      <div className="mx-auto grid max-w-[1440px] gap-10 lg:grid-cols-[0.52fr_1.1fr]">
        <div className="flex flex-col justify-between gap-12">
          <div>
            <Mono className="text-[#0877ff]">05 / FAQ</Mono>
            <h2 className="mt-6 text-5xl leading-none text-white md:text-6xl">
              <Pixel>
                FAQ<span className="text-[#0b72ff]">_</span>
              </Pixel>
            </h2>
            <p className="mt-7 max-w-md text-lg leading-8 text-zinc-300">
              Straight answers to common questions so you can move forward with confidence.
            </p>
          </div>

          <a href="mailto:support@shadows.sh" className="flex max-w-xs items-center gap-5 text-[#0b72ff]">
            <BlueIcon Icon={Headphones} />
            <span>
              <span className="block text-sm text-zinc-400">Still have questions?</span>
              <span className="mt-1 flex items-center gap-2 text-base">
                Contact support <ArrowRight className="h-4 w-4" />
              </span>
            </span>
          </a>
        </div>

        <div className="space-y-4">
          {faqs.map((faq) => (
            <details key={faq.question} className="group rounded-[8px] border border-[#0b72ff]/30 bg-[#061635]/28 p-5 shadow-[0_0_32px_rgba(0,112,255,0.09)]">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-lg font-semibold text-white">
                <span>{faq.question}</span>
                <span className="text-3xl font-light leading-none text-[#0b72ff] transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-4 max-w-4xl text-base leading-7 text-zinc-400">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

function FinalCtaSection() {
  return (
    <section id="pricing" className="px-5 pb-12 pt-14 md:px-8 md:pb-16 md:pt-20">
      <div className="mx-auto max-w-5xl text-center">
        <SectionKicker>Final step</SectionKicker>
        <h2 className="mt-6 text-4xl leading-tight text-white md:text-6xl">
          <Pixel>
            RUN YOUR NEXT
            <br />
            INTERVIEW OUT LOUD<span className="text-[#0b72ff]">.</span>
          </Pixel>
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-zinc-300">
          Stop practicing in silence. Start thinking in public with AI feedback that hears what you mean.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          <PrimaryCta className="sm:min-w-[260px]" />
          <SecondaryCta className="sm:min-w-[200px]" />
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm text-zinc-400">
          <span className="inline-flex items-center gap-2">
            <BadgeCheck className="h-5 w-5 text-[#0877ff]" />
            No credit card required
          </span>
          <span className="hidden h-6 w-px bg-[#0b72ff]/30 shadow-[0_0_12px_rgba(0,112,255,0.22)] sm:block" />
          <span className="inline-flex items-center gap-2">
            <LockKeyhole className="h-5 w-5 text-[#0877ff]" />
            Private by design
          </span>
          <span className="hidden h-6 w-px bg-[#0b72ff]/30 shadow-[0_0_12px_rgba(0,112,255,0.22)] sm:block" />
          <span className="inline-flex items-center gap-2">
            <Zap className="h-5 w-5 text-[#0877ff]" />
            Takes 60 seconds
          </span>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer id="enterprise" className="border-t border-[#0b72ff]/24 px-5 py-9 md:px-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-7 md:flex-row md:items-center md:justify-between">
        <BrandMark />
        <nav className="flex flex-wrap gap-x-10 gap-y-4 text-base text-zinc-400">
          <a href="#product" className="transition hover:text-white">
            Product
          </a>
          <a href="#faq" className="transition hover:text-white">
            Docs
          </a>
          <a href="#pricing" className="transition hover:text-white">
            Pricing
          </a>
          <a href="https://github.com" className="inline-flex items-center gap-2 transition hover:text-white">
            GitHub <ArrowRight className="h-4 w-4" />
          </a>
        </nav>
      </div>
      <div className="mx-auto mt-8 max-w-5xl border-t border-[#0b72ff]/20 pt-6 text-center text-sm text-zinc-600">
        (c) 2026 Shadows.sh. All rights reserved.
      </div>
    </footer>
  )
}

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div
      className={`${GeistSans.className} ${departureMono.variable} ${jetbrainsMono.variable} landing-stage min-h-screen overflow-hidden bg-[#020407] text-zinc-100`}
    >
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-[#0b72ff]/22 bg-[#020407]/82 backdrop-blur-xl shadow-[0_0_28px_rgba(0,112,255,0.08)]">
        <div className="mx-auto flex h-[72px] max-w-[1560px] items-center justify-between px-5 md:px-8">
          <BrandMark />

          <nav className="hidden items-center gap-8 text-sm text-white md:flex">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="transition hover:text-[#58a0ff]">
                {item.label}
                {item.label === "Solutions" || item.label === "Resources" ? (
                  <ChevronDown className="ml-1 inline h-4 w-4 align-[-2px]" />
                ) : null}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-6 md:flex">
            <SignInDialog>
              <button type="button" className="text-sm font-medium text-white transition hover:text-[#58a0ff]">
                Sign in
              </button>
            </SignInDialog>
            <PrimaryCta className="h-11 px-5 text-sm" />
          </div>

          <button
            type="button"
            aria-label="Toggle menu"
            className="grid h-11 w-11 place-items-center rounded-[6px] border border-[#0b72ff]/35 bg-[#061635]/35 text-white shadow-[0_0_22px_rgba(0,112,255,0.12)] md:hidden"
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-[#0b72ff]/22 bg-[#020407] px-5 py-5 md:hidden">
            <nav className="flex flex-col gap-4 text-base text-zinc-200">
              {navItems.map((item) => (
                <a key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)}>
                  {item.label}
                </a>
              ))}
              <SignInDialog>
                <button type="button" className="mt-2 h-11 rounded-[6px] border border-[#0b72ff]/30 bg-[#061635]/28 text-left">
                  Sign in
                </button>
              </SignInDialog>
              <PrimaryCta className="w-full" />
            </nav>
          </div>
        )}
      </header>

      <main className="pt-[72px]">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <SocialProofSection />
        <FaqSection />
        <FinalCtaSection />
      </main>

      <Footer />
    </div>
  )
}
