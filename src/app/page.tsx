"use client"

import { useEffect, useState } from "react"
import localFont from "next/font/local"
import {
  Activity,
  Bot,
  CheckCircle2,
  CircleHelp,
  Code2,
  DoorOpen,
  FileText,
  Link2,
  Menu,
  Mic2,
  Play,
  Plus,
  ShieldCheck,
  Terminal,
  X,
  type LucideIcon,
} from "lucide-react"

import { HeroPreview } from "@/components/app/HeroPreview"
import { SignInDialog } from "@/components/app/SignInDialog"
import { WaitlistDialog } from "@/components/app/WaitlistDialog"

const jetbrainsMono = localFont({
  src: "../../public/fonts/jetbrainsmono.ttf",
  variable: "--font-jetbrains-mono",
})

const minecraft = localFont({
  src: "../../public/fonts/minecraft.otf",
  variable: "--font-minecraft",
})

const features: Array<{ label: [string, string]; Icon: LucideIcon }> = [
  { label: ["Voice AI", "interviewer"], Icon: Mic2 },
  { label: ["Reads your", "code"], Icon: Code2 },
  { label: ["Runs", "tests"], Icon: ShieldCheck },
  { label: ["Post-interview", "report"], Icon: FileText },
]

const overviewFeatures: Array<{ title: string; body: string; Icon: LucideIcon }> = [
  {
    title: "Voice interviewer",
    body: "Speak naturally with the AI and interview at your own pace.",
    Icon: Mic2,
  },
  {
    title: "Reads your code",
    body: "Understands your code context to ask better, smarter questions.",
    Icon: Code2,
  },
  {
    title: "Judge0 execution",
    body: "Your code is executed securely with real-time results.",
    Icon: Terminal,
  },
  {
    title: "Detailed report",
    body: "Get structured feedback and insights to improve faster.",
    Icon: FileText,
  },
]

const overviewPills: Array<{ label: string; Icon: LucideIcon }> = [
  { label: "Live test results", Icon: Activity },
  { label: "Follow-up questions", Icon: CircleHelp },
  { label: "Shareable report links", Icon: Link2 },
]

const workflowSteps = [
  {
    number: "01",
    title: "Start the interview",
    body: "Pick a role or topic. The AI sets the context and asks the first question.",
  },
  {
    number: "02",
    title: "Code while it watches",
    body: "Solve problems in the built-in editor. It observes, adapts, and asks follow-ups.",
  },
  {
    number: "03",
    title: "Review what changed",
    body: "See test results, edge cases, and feedback that highlights what to improve next.",
  },
]

const testCases = [
  { id: 1, input: "[2,7,11,15], 9", output: "[0,1]", time: "12ms" },
  { id: 2, input: "[3,2,4], 6", output: "[1,2]", time: "8ms" },
  { id: 3, input: "[3,3], 6", output: "[0,1]", time: "6ms" },
  { id: 4, input: "[-1,-2,-3,-4,-5], -8", output: "[2,4]", time: "9ms" },
]

const waveform = [24, 38, 58, 31, 72, 47, 86, 66, 34, 76, 50, 61, 42, 80, 36, 54, 70, 43, 62, 88, 28, 45]

const codeLines = [
  { n: 1, code: <><span className="text-purple-300">from</span> typing <span className="text-purple-300">import</span> List</> },
  { n: 2, code: <>&nbsp;</> },
  { n: 3, code: <><span className="text-purple-300">class</span> <span className="text-blue-200">Solution</span>:</> },
  { n: 4, code: <><span className="pl-6 text-purple-300">def</span> <span className="text-yellow-200">two_sum</span>(<span className="text-zinc-200">self</span>, nums: List[<span className="text-blue-200">int</span>], target: <span className="text-blue-200">int</span>) -&gt; List[<span className="text-blue-200">int</span>]:</> },
  { n: 5, code: <><span className="pl-12 text-zinc-300">seen = {"{}"}</span></> },
  { n: 6, code: <>&nbsp;</> },
  { n: 7, code: <><span className="pl-12 text-pink-300">for</span> i, n <span className="text-pink-300">in</span> <span className="text-yellow-200">enumerate</span>(nums):</> },
  { n: 8, code: <><span className="pl-20 text-zinc-300">complement = target - n</span></> },
  { n: 9, code: <>&nbsp;</> },
  { n: 10, code: <><span className="pl-20 text-pink-300">if</span> complement <span className="text-pink-300">in</span> seen:</> },
  { n: 11, code: <><span className="pl-28 text-pink-300">return</span> [seen[complement], i]</> },
  { n: 12, code: <>&nbsp;</> },
  { n: 13, code: <><span className="pl-20 text-zinc-300">seen[n] = i</span></> },
]

function BrandMark() {
  return (
    <div className="flex items-center gap-2.5 text-white">
      <div className="relative h-8 w-8 border border-dashed border-white/70">
        <Terminal className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2" />
        <span className="absolute -left-1 -top-1 h-2 w-2 border-l border-t border-white" />
        <span className="absolute -bottom-1 -right-1 h-2 w-2 border-b border-r border-white" />
      </div>
      <span className="text-lg font-semibold md:text-xl">Shadows.sh</span>
    </div>
  )
}

function FeatureItem({ label, Icon }: { label: [string, string]; Icon: LucideIcon }) {
  return (
    <div className="relative flex min-h-20 flex-col items-center justify-start gap-2 px-3 pt-2 text-center text-[10px] uppercase leading-4 text-zinc-200 md:px-4">
      <div className="relative grid h-10 w-10 place-items-center text-blue-500">
        <span className="absolute left-0 top-0 h-2.5 w-2.5 border-l border-t border-blue-500" />
        <span className="absolute right-0 top-0 h-2.5 w-2.5 border-r border-t border-blue-500" />
        <span className="absolute bottom-0 left-0 h-2.5 w-2.5 border-b border-l border-blue-500" />
        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 border-b border-r border-blue-500" />
        <Icon className="h-5 w-5" strokeWidth={1.6} />
      </div>
      <span className="flex h-8 flex-col items-center justify-start leading-4">
        <span className="whitespace-nowrap">{label[0]}</span>
        <span className="whitespace-nowrap">{label[1]}</span>
      </span>
    </div>
  )
}

function CornerIcon({ Icon, className = "" }: { Icon: LucideIcon; className?: string }) {
  return (
    <div className={`relative grid h-10 w-10 place-items-center text-blue-500 ${className}`}>
      <span className="absolute left-0 top-0 h-3 w-3 border-l border-t border-blue-500" />
      <span className="absolute right-0 top-0 h-3 w-3 border-r border-t border-blue-500" />
      <span className="absolute bottom-0 left-0 h-3 w-3 border-b border-l border-blue-500" />
      <span className="absolute bottom-0 right-0 h-3 w-3 border-b border-r border-blue-500" />
      <Icon className="h-5 w-5" strokeWidth={1.7} />
    </div>
  )
}

function FeatureOverview() {
  return (
    <section id="features" className="relative min-h-[calc(100vh-76px)] scroll-mt-[76px] border-t border-white/10 px-5 py-12 md:px-8 md:py-16">
      <div className="mx-auto max-w-[1080px]">
        <div className="mx-auto max-w-[640px] text-center">
          <p className="mb-5 flex items-center justify-center gap-3 text-[11px] uppercase text-blue-500 md:text-xs">
            <span className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_24px_rgba(0,132,255,0.9)]" />
            Feature overview
          </p>

          <h2 className={`${minecraft.className} text-[24px] leading-[1.12] text-white md:text-[34px] lg:text-[40px]`}>
            Everything updates
            <br />
            in real time.
          </h2>

          <p className="mx-auto mt-4 max-w-[500px] text-sm leading-6 text-zinc-300 md:text-base">
            See your code, runs, and feedback as they happen.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {overviewFeatures.map(({ title, body, Icon }) => (
            <article
              key={title}
              className="min-h-[198px] rounded-[8px] border border-white/15 bg-black/18 p-5 shadow-[0_24px_70px_rgba(0,0,0,0.35)]"
            >
              <CornerIcon Icon={Icon} />
              <h3 className="mt-5 text-base leading-6 text-white">{title}</h3>
              <p className="mt-2 max-w-[230px] text-[13px] leading-6 text-zinc-400">{body}</p>
            </article>
          ))}
        </div>

        <div className="mx-auto mt-8 flex max-w-[760px] flex-col items-stretch justify-center gap-3 md:flex-row md:items-center">
          {overviewPills.map(({ label, Icon }, index) => (
            <div key={label} className="contents md:flex md:items-center md:gap-5">
              {index > 0 && <span className="hidden text-zinc-500 md:block">•</span>}
              <div className="flex min-h-14 flex-1 items-center justify-center gap-3 rounded-[6px] border border-white/15 bg-black/20 px-4 text-zinc-300">
                <Icon className="h-5 w-5 text-blue-500" strokeWidth={1.8} />
                <span className="whitespace-nowrap text-xs md:text-sm">{label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CodeLine({ line }: { line: (typeof codeLines)[number] }) {
  return (
    <div className="grid grid-cols-[30px_1fr] gap-3 text-[11px] leading-7 text-zinc-300 md:text-[12px]">
      <span className="select-none text-right text-zinc-600">{line.n}</span>
      <code className="whitespace-pre">{line.code}</code>
    </div>
  )
}

function Waveform() {
  return (
    <div className="flex h-20 items-center justify-center gap-1.5 py-3 text-blue-500">
      {waveform.map((height, index) => (
        <span
          key={`${height}-${index}`}
          className="w-0.5 rounded-full bg-blue-500 shadow-[0_0_14px_rgba(0,132,255,0.65)]"
          style={{ height: height * 0.82 }}
        />
      ))}
    </div>
  )
}

function DashboardSidenote() {
  return (
    <div className="absolute -left-28 bottom-28 hidden w-[300px] rotate-[2deg] overflow-hidden rounded-[6px] border border-blue-500/35 bg-[#05070a]/95 shadow-[0_24px_80px_rgba(0,0,0,0.75)] backdrop-blur xl:block">
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-2 text-[10px] uppercase text-blue-400">
        <span>Dashboard side note</span>
        <span className="text-zinc-500">current</span>
      </div>
      <div className="relative h-[174px] overflow-hidden bg-black">
        <div className="absolute left-2 top-2 h-[585px] w-[1040px] origin-top-left scale-[0.278]">
          <HeroPreview />
        </div>
      </div>
    </div>
  )
}

function InterviewConsole({ variant = "hero" }: { variant?: "hero" | "flat" }) {
  const isFlat = variant === "flat"

  return (
    <div className={`relative mx-auto w-full ${isFlat ? "max-w-[720px]" : "max-w-[760px] lg:-mr-8 xl:-mr-16"}`}>
      <div className={`relative overflow-hidden rounded-[10px] border border-white/10 bg-[#05070a]/95 shadow-[0_40px_120px_rgba(0,0,0,0.85)] ring-1 ring-blue-500/10 ${isFlat ? "min-h-[440px]" : "min-h-[500px] lg:rotate-[-3deg]"}`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_15%,rgba(0,132,255,0.12),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.08),transparent_34%)]" />
        <div className={`relative flex h-full flex-col ${isFlat ? "min-h-[440px]" : "min-h-[500px]"}`}>
          <div className={`flex items-center justify-between border-b border-white/10 px-4 ${isFlat ? "h-12 md:px-5" : "h-14 md:px-6"}`}>
            <div className="flex items-center gap-3 text-[11px] text-zinc-300">
              <span className="relative flex h-4 w-4 items-center justify-center rounded-full bg-blue-500/10">
                <span className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_18px_rgba(0,132,255,0.95)]" />
              </span>
              <span className="italic">Interview in progress</span>
              <span className="text-zinc-600">•</span>
              <span>24:37</span>
            </div>
            <div className="hidden items-center gap-4 text-[10px] text-zinc-400 md:flex">
              <span className="rounded border border-white/10 px-3 py-1.5">Role: Software Engineer</span>
              <span className="rounded border border-white/10 px-3 py-1.5">Difficulty: Medium ▃▅▆█</span>
              <button className="inline-flex items-center gap-2 rounded border border-red-500/50 px-3 py-2 text-red-400">
                <DoorOpen className="h-3.5 w-3.5" />
                Leave
              </button>
            </div>
          </div>

          <div className="grid flex-1 grid-cols-1 md:grid-cols-[0.86fr_1.42fr_0.78fr]">
            <aside className={`${isFlat ? "p-3.5" : "p-4"} border-b border-white/10 bg-black/18 md:border-b-0 md:border-r`}>
              <p className="mb-4 text-[11px] uppercase text-blue-400">AI interviewer</p>
              <div className="rounded-[4px] border border-white/5 bg-white/[0.045] p-3 text-[10px] leading-[1.85] text-zinc-300">
                <p>Let&apos;s start with a classic. Implement <span className="text-white">two_sum(nums, target)</span>.</p>
                <p className="mt-2">Return the indices of the two numbers such that they add up to target.</p>
                <p className="mt-2">You can assume each input would have exactly one solution.</p>
              </div>
              <div className="mt-3 rounded-[4px] border border-white/5 bg-white/[0.04] p-3 text-[10px] italic text-zinc-300">
                Walk me through your approach.
              </div>
              <p className="mt-3 text-[10px] text-zinc-600">Just now</p>
              <Waveform />
              <p className="text-[11px] text-blue-400">• AI is speaking...</p>
              <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-[4px] border border-white/10 bg-white/[0.045] py-2.5 text-[11px] text-zinc-200">
                <Mic2 className="h-4 w-4" />
                Tap to speak
              </button>
            </aside>

            <main className={`flex flex-col border-b border-white/10 bg-black/10 md:border-b-0 md:border-r ${isFlat ? "min-h-[300px]" : "min-h-[340px]"}`}>
              <div className={`flex items-center gap-6 border-b border-white/10 px-5 text-[11px] ${isFlat ? "h-10" : "h-12"}`}>
                <span className={`border-b border-blue-500 text-blue-400 ${isFlat ? "pb-3" : "pb-4"}`}>main.py</span>
                <X className="h-3.5 w-3.5 text-blue-400" />
                <Plus className="h-4 w-4 text-zinc-500" />
              </div>
              <div className="flex-1 overflow-hidden px-4 py-4">
                {codeLines.map((line) => (
                  <CodeLine key={line.n} line={line} />
                ))}
                <div className="mt-3 ml-12 h-7 w-0.5 bg-blue-500 shadow-[0_0_14px_rgba(0,132,255,0.8)]" />
              </div>
              <div className={`flex items-center justify-between border-t border-white/10 px-5 text-[11px] text-zinc-500 ${isFlat ? "h-10" : "h-12"}`}>
                <span>Python 3 • <span className="text-emerald-400">Saved</span></span>
                <span>Ln 13, Col 18 &nbsp; Spaces: 4</span>
              </div>
            </main>

            <aside className={`${isFlat ? "p-3.5" : "p-4"} bg-black/16`}>
              <p className="mb-4 text-[11px] uppercase text-blue-400">Tests</p>
              <div className="mb-4 flex items-center gap-2 text-[11px] text-zinc-300">
                <span>Judge0</span>
                <span className="text-zinc-600">•</span>
                <span className="text-emerald-400">● All tests passing</span>
              </div>
              <div className="space-y-3">
                {testCases.map((testCase) => (
                  <div key={testCase.id} className="rounded-[4px] border border-white/5 bg-white/[0.055] p-2.5 text-[10px] text-zinc-300">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-zinc-100">Test case {testCase.id}</span>
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    </div>
                    <p>Input: <span className="text-zinc-400">{testCase.input}</span></p>
                    <div className="mt-1 flex items-center justify-between">
                      <p>Output: <span className="text-zinc-400">{testCase.output}</span></p>
                      <span className="text-zinc-600">{testCase.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-[4px] border border-white/20 bg-black/25 py-2.5 text-[11px] text-zinc-100">
                <Play className="h-4 w-4 text-blue-400" />
                Run tests
              </button>
            </aside>
          </div>

          <div className="hidden grid-cols-[0.92fr_0.78fr_0.72fr] border-t border-white/10 md:grid">
            <div className={`${isFlat ? "min-h-20 p-3.5" : "min-h-24 p-4"} border-r border-white/10`}>
              <p className="mb-3 text-[11px] uppercase text-blue-400">Follow-up</p>
              <p className="text-[11px] text-zinc-300">Nice solution. What&apos;s the time and space complexity?</p>
              <p className="mt-3 text-[10px] text-zinc-500">How would your approach change if there could be multiple answers?</p>
            </div>
            <div className={`${isFlat ? "min-h-20 p-3.5" : "min-h-24 p-4"} border-r border-white/10`}>
              <p className="mb-3 text-[11px] uppercase text-blue-400">Notes</p>
              <p className="text-[11px] text-zinc-300">Optimal solution using hash map.</p>
              <p className="mt-3 text-[10px] text-zinc-500">Handles negative numbers and duplicates.</p>
            </div>
            <div className={isFlat ? "min-h-20 p-3.5" : "min-h-24 p-4"}>
              <p className="mb-3 text-[11px] uppercase text-blue-400">Interviewer</p>
              <div className="flex items-center justify-between text-[11px] text-zinc-400">
                <span>AI Interviewer v1.0</span>
                <Bot className="h-8 w-8 text-blue-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
      {!isFlat && <DashboardSidenote />}
    </div>
  )
}

function HowItWorksSection() {
  return (
    <section id="how-it-works" className="relative min-h-[calc(100vh-68px)] scroll-mt-[68px] border-t border-white/10 px-5 py-8 md:px-8 md:py-10">
      <div className="mx-auto grid max-w-[1320px] gap-10 lg:grid-cols-[0.76fr_1.08fr] lg:items-start">
        <div className="max-w-[500px]">
          <p className="mb-5 flex items-center gap-3 text-[11px] uppercase text-blue-500 md:text-xs">
            <span className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_24px_rgba(0,132,255,0.9)]" />
            How it works
          </p>

          <h2 className={`${minecraft.className} text-[24px] leading-[1.12] text-white md:text-[34px] lg:text-[40px]`}>
            TALK. CODE.
            <br />
            GET CHALLENGED.
          </h2>

          <p className="mt-5 max-w-[460px] text-sm leading-6 text-zinc-300 md:text-base">
            An AI interviewer that adapts to you in real time, asks smart follow-ups, and tests what matters.
          </p>

          <div className="mt-8">
            {workflowSteps.map((step, index) => (
              <div key={step.number} className="relative grid grid-cols-[56px_1fr] gap-4 pb-8 last:pb-0">
                {index < workflowSteps.length - 1 && (
                  <span className="absolute left-6 top-12 h-full w-px bg-white/15" />
                )}
                <div className="relative z-10 grid h-12 w-12 place-items-center rounded-full border border-white/20 bg-[#020305] text-sm text-blue-500">
                  {step.number}
                </div>
                <div className="pt-1">
                  <h3 className="text-base leading-6 text-white">{step.title}</h3>
                  <p className="mt-2 max-w-[390px] text-[13px] leading-6 text-zinc-400">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="hidden lg:block lg:pl-2">
          <InterviewConsole variant="flat" />
        </div>
      </div>
    </section>
  )
}

function FinalCtaSection() {
  return (
    <section id="pricing" className="relative flex min-h-screen scroll-mt-0 flex-col px-5 pt-24 md:px-8 md:pt-28">
      <div className="mx-auto flex flex-1 max-w-[1200px] flex-col items-center justify-center pb-16 text-center">
        <p className="mb-6 flex items-center justify-center gap-3 text-[11px] uppercase text-blue-500 md:text-xs">
          <span className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_24px_rgba(0,132,255,0.9)]" />
          Ready when you are
        </p>

        <h2 className={`${minecraft.className} max-w-[920px] text-[28px] leading-[1.14] text-white md:text-[48px] lg:text-[60px]`}>
          RUN YOUR NEXT
          <br />
          INTERVIEW OUT LOUD.
        </h2>

        <p className="mt-7 max-w-[720px] text-sm leading-6 text-zinc-300 md:text-base">
          Practice out loud. Get real-time feedback. Improve with every run.
        </p>

        <div className="mt-10 flex w-full max-w-[500px] flex-col gap-4 sm:flex-row sm:justify-center">
          <WaitlistDialog>
            <button className="inline-flex h-12 items-center justify-center gap-3 rounded-[4px] bg-blue-600 px-5 text-sm text-white shadow-[0_0_48px_rgba(0,104,255,0.35)] transition-colors hover:bg-blue-500 sm:min-w-[260px]">
              <Terminal className="h-4 w-4" />
              Start a mock interview
            </button>
          </WaitlistDialog>
          <button className="inline-flex h-12 items-center justify-center gap-3 rounded-[4px] border border-white/20 px-5 text-sm text-white transition-colors hover:border-white/45 hover:bg-white/[0.04] sm:min-w-[170px]">
            <Terminal className="h-4 w-4" />
            See demo
          </button>
        </div>

        <p className="mt-9 flex items-center justify-center gap-3 text-xs leading-6 text-zinc-400 md:text-sm">
          <ShieldCheck className="h-5 w-5 text-blue-500" strokeWidth={1.8} />
          No setup friction. Review your interview instantly.
        </p>
      </div>

      <footer className="mx-auto flex w-full max-w-[1400px] flex-col gap-8 border-t border-white/10 py-7 md:flex-row md:items-center md:justify-between">
        <BrandMark />
        <nav className="flex flex-col gap-4 text-sm text-zinc-400 sm:flex-row sm:items-center sm:gap-9">
          <a href="#features" className="transition-colors hover:text-white">Features</a>
          <a href="#how-it-works" className="transition-colors hover:text-white">How it works</a>
          <a href="#pricing" className="transition-colors hover:text-white">Pricing</a>
          <SignInDialog>
            <button className="rounded-[4px] border border-white/20 px-4 py-2.5 text-left text-zinc-300 transition-colors hover:border-white/50 hover:text-white">
              Sign in
            </button>
          </SignInDialog>
        </nav>
      </footer>
    </section>
  )
}

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<string | null>(null)

  useEffect(() => {
    const sectionIds = ["features", "how-it-works", "pricing"]
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section))

    if (!sections.length) return

    const syncActiveSectionFromHash = () => {
      const hashSection = window.location.hash.replace("#", "")

      if (sectionIds.includes(hashSection)) {
        setActiveSection(hashSection)
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const activeEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]

        if (activeEntry?.target.id) {
          setActiveSection(activeEntry.target.id)
        }
      },
      {
        rootMargin: "-38% 0px -44% 0px",
        threshold: [0.1, 0.35, 0.6],
      }
    )

    sections.forEach((section) => observer.observe(section))
    syncActiveSectionFromHash()
    window.addEventListener("hashchange", syncActiveSectionFromHash)

    return () => {
      observer.disconnect()
      window.removeEventListener("hashchange", syncActiveSectionFromHash)
    }
  }, [])

  const navLinkClass = (sectionId: string) =>
    `relative transition-colors hover:text-white ${
      activeSection === sectionId
        ? "text-blue-500 after:absolute after:-bottom-5 after:left-1/2 after:h-0.5 after:w-4 after:-translate-x-1/2 after:bg-blue-500"
        : ""
    }`

  return (
    <div className={`landing-stage min-h-screen overflow-hidden bg-[#020305] text-zinc-100 ${jetbrainsMono.className}`}>
      <header className={`fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-[#020305]/80 backdrop-blur-xl transition-all duration-300 ${activeSection === "pricing" ? "pointer-events-none -translate-y-full opacity-0" : ""}`}>
        <div className="mx-auto flex h-[60px] max-w-[1400px] items-center justify-between px-5 md:h-[68px] md:px-8">
          <BrandMark />

          <nav className="hidden items-center gap-9 text-sm text-zinc-400 md:flex">
            <a href="#features" className={navLinkClass("features")}>Features</a>
            <a href="#how-it-works" className={navLinkClass("how-it-works")}>How it works</a>
            <a href="#pricing" className={navLinkClass("pricing")}>Pricing</a>
            <SignInDialog>
              <button className="rounded-[4px] border border-white/20 px-4 py-2.5 text-zinc-300 transition-colors hover:border-white/50 hover:text-white">
                Sign in
              </button>
            </SignInDialog>
          </nav>

          <button
            aria-label="Toggle menu"
            className="grid h-10 w-10 place-items-center rounded-[4px] border border-white/15 text-zinc-300 md:hidden"
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            {mobileMenuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-white/10 bg-[#020305] px-5 py-4 md:hidden">
            <div className="flex flex-col gap-4 text-sm text-zinc-300">
              <a href="#features" className={activeSection === "features" ? "text-blue-500" : ""} onClick={() => setMobileMenuOpen(false)}>Features</a>
              <a href="#how-it-works" className={activeSection === "how-it-works" ? "text-blue-500" : ""} onClick={() => setMobileMenuOpen(false)}>How it works</a>
              <a href="#pricing" className={activeSection === "pricing" ? "text-blue-500" : ""} onClick={() => setMobileMenuOpen(false)}>Pricing</a>
              <SignInDialog>
                <button className="w-full rounded-[4px] border border-white/20 px-4 py-3 text-left">Sign in</button>
              </SignInDialog>
            </div>
          </div>
        )}
      </header>

      <main className="relative pt-[60px] md:pt-[68px]">
        <section className="relative overflow-hidden">
          <div className="mx-auto grid min-h-[calc(100vh-68px)] max-w-[1400px] grid-cols-1 items-start gap-8 px-5 py-7 md:px-8 md:py-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-0 lg:pb-0 lg:pt-8">
            <div className="relative z-10 max-w-[660px]">
              <p className="mb-5 flex items-center gap-3 text-[11px] uppercase text-blue-500 md:text-xs">
                <span className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_24px_rgba(0,132,255,0.9)]" />
                Live AI coding interviews
              </p>

              <h1 className="font-opencode max-w-[600px] text-[30px] font-bold leading-[1.06] text-white md:text-[42px] lg:text-[40px] xl:text-[48px] 2xl:text-[54px]">
                <span className="block md:whitespace-nowrap">A real interview</span>
                <span className="block md:whitespace-nowrap">that talks back.</span>
              </h1>

              <p className="mt-5 max-w-[540px] text-sm leading-6 text-zinc-300 md:text-base md:leading-7">
                Practice with an AI interviewer that watches your code, runs your tests, and challenges your thinking in real time.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <WaitlistDialog>
                  <button className="inline-flex h-12 items-center justify-center gap-3 rounded-[4px] bg-blue-600 px-5 text-sm text-white shadow-[0_0_48px_rgba(0,104,255,0.35)] transition-colors hover:bg-blue-500">
                    <Terminal className="h-4 w-4" />
                    Start a mock interview
                  </button>
                </WaitlistDialog>
                <button className="inline-flex h-12 items-center justify-center gap-3 rounded-[4px] border border-white/20 px-5 text-sm text-white transition-colors hover:border-white/45 hover:bg-white/[0.04]">
                  <Terminal className="h-4 w-4" />
                  Watch demo
                </button>
              </div>

              <div className="mt-10 grid max-w-[560px] grid-cols-2 divide-x divide-y divide-white/10 border-white/10 sm:grid-cols-4 sm:divide-y-0">
                {features.map((feature) => (
                  <FeatureItem key={feature.label.join("-")} {...feature} />
                ))}
              </div>
            </div>

            <div className="relative z-0 hidden lg:block lg:translate-x-4 xl:translate-x-8">
              <InterviewConsole />
            </div>
          </div>
        </section>

        <FeatureOverview />

        <HowItWorksSection />

        <FinalCtaSection />
      </main>
    </div>
  )
}
