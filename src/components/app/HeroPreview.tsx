"use client"

import { useState, useEffect } from "react"
import { ResizablePanelGroup, ResizableHandle, ResizablePanel } from "@/components/ui/resizable"
import { TestCaseBadge } from "@/components/ui/testcase-badge"
import { Mic, PhoneOff } from "lucide-react"

type Language = "Python" | "C++"

// Code samples for each language
const CODE_SAMPLES: Record<Language, React.ReactElement> = {
  Python: (
    <>
      <span className="text-blue-400">def</span> <span className="text-yellow-300">twoSum</span>(<span className="text-light-primary">nums</span>, <span className="text-light-primary">target</span>):
      {'\n    '}<span className="text-light-primary">map</span> = {'{'}
      {'}'}
      {'\n    '}
      {'\n    '}<span className="text-purple-400">for</span> <span className="text-light-primary">i</span> <span className="text-purple-400">in</span> <span className="text-yellow-300">range</span>(<span className="text-yellow-300">len</span>(<span className="text-light-primary">nums</span>)):
      {'\n        '}<span className="text-light-primary">complement</span> = <span className="text-light-primary">target</span> - <span className="text-light-primary">nums</span>[<span className="text-light-primary">i</span>]
      {'\n        '}
      {'\n        '}<span className="text-purple-400">if</span> <span className="text-light-primary">complement</span> <span className="text-purple-400">in</span> <span className="text-light-primary">map</span>:
      {'\n            '}<span className="text-purple-400">return</span> [<span className="text-light-primary">map</span>[<span className="text-light-primary">complement</span>], <span className="text-light-primary">i</span>]
      {'\n        '}
      {'\n        '}<span className="text-light-primary">map</span>[<span className="text-light-primary">nums</span>[<span className="text-light-primary">i</span>]] = <span className="text-light-primary">i</span>
      {'\n    '}
      {'\n    '}<span className="text-purple-400">return</span> []
    </>
  ),

  "C++": (
    <>
      <span className="text-blue-400">vector</span>{'<'}<span className="text-blue-400">int</span>{'>'} <span className="text-yellow-300">twoSum</span>(<span className="text-blue-400">vector</span>{'<'}<span className="text-blue-400">int</span>{'>'} <span className="text-light-primary">nums</span>, <span className="text-blue-400">int</span> <span className="text-light-primary">target</span>) {'{'}
      {'\n  '}<span className="text-blue-400">unordered_map</span>{'<'}<span className="text-blue-400">int</span>, <span className="text-blue-400">int</span>{'>'} <span className="text-light-primary">map</span>;
      {'\n  '}
      {'\n  '}<span className="text-purple-400">for</span> (<span className="text-blue-400">int</span> <span className="text-light-primary">i</span> = <span className="text-green-400">0</span>; <span className="text-light-primary">i</span> {'<'} <span className="text-light-primary">nums</span>.<span className="text-yellow-300">size</span>(); <span className="text-light-primary">i</span>++) {'{'}
      {'\n    '}<span className="text-blue-400">int</span> <span className="text-light-primary">complement</span> = <span className="text-light-primary">target</span> - <span className="text-light-primary">nums</span>[<span className="text-light-primary">i</span>];
      {'\n    '}
      {'\n    '}<span className="text-purple-400">if</span> (<span className="text-light-primary">map</span>.<span className="text-yellow-300">find</span>(<span className="text-light-primary">complement</span>) != <span className="text-light-primary">map</span>.<span className="text-yellow-300">end</span>()) {'{'}
      {'\n      '}<span className="text-purple-400">return</span> {'{'}<span className="text-light-primary">map</span>[<span className="text-light-primary">complement</span>], <span className="text-light-primary">i</span>{'}'};
      {'\n    '}
      {'}'}
      {'\n    '}
      {'\n    '}<span className="text-light-primary">map</span>[<span className="text-light-primary">nums</span>[<span className="text-light-primary">i</span>]] = <span className="text-light-primary">i</span>;
      {'\n  '}
      {'}'}
      {'\n  '}
      {'\n  '}<span className="text-purple-400">return</span> {'{}'};
      {'\n'}
      {'}'}
    </>
  )
}

const SAMPLE_QUESTION = {
  title: "Two Sum",
  difficulty: "Easy",
  description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
  examples: [
    {
      input: "nums = [2,7,11,15], target = 9",
      output: "[0,1]",
      explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
    }
  ]
}

const SAMPLE_TEST_CASES = [
  { id: 1, input: "[2,7,11,15], 9", expected_output: "[0,1]", status: "passed" as const },
  { id: 2, input: "[3,2,4], 6", expected_output: "[1,2]", status: "passed" as const },
  { id: 3, input: "[3,3], 6", expected_output: "[0,1]", status: "running" as const },
]

function MockTimer() {
  const [seconds, setSeconds] = useState(127) // Start at 2:07
  
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(s => s + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])
  
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-indicator-success/20 border border-indicator-success/50">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indicator-success opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-indicator-success"></span>
      </span>
      <span className="text-indicator-success font-mono text-sm font-medium">
        {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
      </span>
    </div>
  )
}

export function HeroPreview() {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("Python")
  const [isMuted, setIsMuted] = useState(false)

  return (
    <div className="w-full h-full rounded-xl overflow-hidden shadow-2xl border border-edge-subtle flex flex-col">
      {/* Mock Command Bar */}
      <div className="w-full h-12 flex items-center justify-between px-4 bg-void-elevated border-b border-edge-subtle shrink-0">
        <MockTimer />
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-indicator-danger text-white text-sm font-medium hover:bg-indicator-danger/90 transition-colors">
            Hang Up <PhoneOff className="h-4 w-4" />
          </button>
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className={`p-2 rounded-md transition-colors ${
              isMuted 
                ? 'bg-indicator-danger text-white' 
                : 'bg-void-card border border-edge-subtle text-light-primary hover:bg-white/5'
            }`}
          >
            <Mic className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <ResizablePanelGroup
        direction="horizontal"
        className="w-full h-full"
      >
        {/* Question Panel */}
        <ResizablePanel defaultSize={40}>
          <div className="flex h-full w-full flex-col bg-void-page">
            {/* Question Header */}
            <div className="border-b border-edge-subtle px-6 py-4">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-xl font-semibold text-light-primary">{SAMPLE_QUESTION.title}</h2>
                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-indicator-success/20 text-indicator-success">
                  {SAMPLE_QUESTION.difficulty}
                </span>
              </div>
            </div>
            
            {/* Question Content */}
            <div className="flex-1 overflow-auto px-6 py-4">
              <div className="prose prose-sm max-w-none prose-invert">
                <p className="text-sm text-light-muted leading-relaxed whitespace-pre-line">
                  {SAMPLE_QUESTION.description}
                </p>
                
                <div className="mt-6">
                  <h3 className="text-sm font-semibold mb-3 text-light-primary">Example:</h3>
                  {SAMPLE_QUESTION.examples.map((example, idx) => (
                    <div key={idx} className="bg-void-elevated rounded-lg p-4 space-y-2 text-xs border border-edge-subtle">
                      <div>
                        <span className="font-medium text-light-primary">Input: </span>
                        <code className="text-light-muted">{example.input}</code>
                      </div>
                      <div>
                        <span className="font-medium text-light-primary">Output: </span>
                        <code className="text-light-muted">{example.output}</code>
                      </div>
                      {example.explanation && (
                        <div>
                          <span className="font-medium text-light-primary">Explanation: </span>
                          <span className="text-light-muted">{example.explanation}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </ResizablePanel>
        
        <ResizableHandle />
        
        {/* Editor Panel */}
        <ResizablePanel defaultSize={60}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={75}>
              <div className="flex h-full w-full flex-col overflow-hidden bg-void-elevated">
                {/* Editor Toolbar */}
                <div className="border-b border-edge-subtle px-4 py-2 flex items-center justify-between bg-void-elevated">
                  <div className="flex items-center gap-2">
                    <select 
                      className="text-sm border border-edge-subtle rounded px-2 py-1 bg-void-card text-light-primary cursor-pointer"
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value as Language)}
                    >
                      <option>Python</option>
                      <option>C++</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="text-sm px-3 py-1 rounded bg-void-card text-light-muted hover:bg-white/5 transition-colors border border-edge-subtle">
                      Run
                    </button>
                    <button className="text-sm px-3 py-1 rounded bg-white text-black hover:bg-white/90 transition-colors">
                      Submit
                    </button>
                  </div>
                </div>
                
                {/* Static Code Display */}
                <div className="min-h-0 flex-1 border-t border-edge-subtle bg-void-elevated overflow-hidden">
                  <pre className="h-full p-4 font-mono text-sm leading-relaxed text-light-primary select-none">
                    <code>
                      {CODE_SAMPLES[selectedLanguage]}
                    </code>
                  </pre>
                </div>
              </div>
            </ResizablePanel>
            
            <ResizableHandle />
            
            {/* Test Cases Panel */}
            <ResizablePanel defaultSize={25}>
              <div className="h-full w-full overflow-auto bg-void-elevated p-4 border-t border-edge-subtle">
                <div className="space-y-3">
                  <h3 className="font-semibold text-sm mb-2 text-light-primary">Test Cases</h3>
                  {SAMPLE_TEST_CASES.map((tc, idx) => (
                    <div key={tc.id} className="border border-edge-subtle rounded-md p-3 space-y-2 text-sm bg-void-card">
                      <div className="flex items-center justify-between">
                        <div className="font-medium text-light-primary">Test Case {idx + 1}</div>
                        <TestCaseBadge name="" status={tc.status} />
                      </div>
                      <div>
                        <span className="text-light-muted">Input: </span>
                        <code className="bg-void-elevated px-1 py-0.5 rounded text-xs text-light-primary">{tc.input}</code>
                      </div>
                      <div>
                        <span className="text-light-muted">Expected: </span>
                        <code className="bg-void-elevated px-1 py-0.5 rounded text-xs text-light-primary">{tc.expected_output}</code>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
