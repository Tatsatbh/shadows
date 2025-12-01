"use client"

import { useState } from "react"
import { ResizablePanelGroup, ResizableHandle, ResizablePanel } from "@/components/ui/resizable"
import { TestCaseBadge } from "@/components/ui/testcase-badge"

type Language = "Python" | "JavaScript" | "C++"

// Code samples for each language
const CODE_SAMPLES: Record<Language, React.ReactElement> = {
  Python: (
    <>
      <span className="text-blue-600">def</span> <span className="text-yellow-700">twoSum</span>(<span className="text-neutral-700">nums</span>, <span className="text-neutral-700">target</span>):
      {'\n    '}<span className="text-neutral-700">map</span> = {'{'}
      {'}'}
      {'\n    '}
      {'\n    '}<span className="text-purple-600">for</span> <span className="text-neutral-700">i</span> <span className="text-purple-600">in</span> <span className="text-yellow-700">range</span>(<span className="text-yellow-700">len</span>(<span className="text-neutral-700">nums</span>)):
      {'\n        '}<span className="text-neutral-700">complement</span> = <span className="text-neutral-700">target</span> - <span className="text-neutral-700">nums</span>[<span className="text-neutral-700">i</span>]
      {'\n        '}
      {'\n        '}<span className="text-purple-600">if</span> <span className="text-neutral-700">complement</span> <span className="text-purple-600">in</span> <span className="text-neutral-700">map</span>:
      {'\n            '}<span className="text-purple-600">return</span> [<span className="text-neutral-700">map</span>[<span className="text-neutral-700">complement</span>], <span className="text-neutral-700">i</span>]
      {'\n        '}
      {'\n        '}<span className="text-neutral-700">map</span>[<span className="text-neutral-700">nums</span>[<span className="text-neutral-700">i</span>]] = <span className="text-neutral-700">i</span>
      {'\n    '}
      {'\n    '}<span className="text-purple-600">return</span> []
    </>
  ),
  JavaScript: (
    <>
      <span className="text-blue-600">function</span> <span className="text-yellow-700">twoSum</span>(<span className="text-neutral-700">nums</span>, <span className="text-neutral-700">target</span>) {'{'}
      {'\n  '}<span className="text-blue-600">const</span> <span className="text-neutral-700">map</span> = <span className="text-blue-600">new</span> <span className="text-yellow-700">Map</span>();
      {'\n  '}
      {'\n  '}<span className="text-purple-600">for</span> (<span className="text-blue-600">let</span> <span className="text-neutral-700">i</span> = <span className="text-green-600">0</span>; <span className="text-neutral-700">i</span> {'<'} <span className="text-neutral-700">nums</span>.<span className="text-neutral-700">length</span>; <span className="text-neutral-700">i</span>++) {'{'}
      {'\n    '}<span className="text-blue-600">const</span> <span className="text-neutral-700">complement</span> = <span className="text-neutral-700">target</span> - <span className="text-neutral-700">nums</span>[<span className="text-neutral-700">i</span>];
      {'\n    '}
      {'\n    '}<span className="text-purple-600">if</span> (<span className="text-neutral-700">map</span>.<span className="text-yellow-700">has</span>(<span className="text-neutral-700">complement</span>)) {'{'}
      {'\n      '}<span className="text-purple-600">return</span> [<span className="text-neutral-700">map</span>.<span className="text-yellow-700">get</span>(<span className="text-neutral-700">complement</span>), <span className="text-neutral-700">i</span>];
      {'\n    '}
      {'}'}
      {'\n    '}
      {'\n    '}<span className="text-neutral-700">map</span>.<span className="text-yellow-700">set</span>(<span className="text-neutral-700">nums</span>[<span className="text-neutral-700">i</span>], <span className="text-neutral-700">i</span>);
      {'\n  '}
      {'}'}
      {'\n  '}
      {'\n  '}<span className="text-purple-600">return</span> [];
      {'\n'}
      {'}'}
    </>
  ),
  "C++": (
    <>
      <span className="text-blue-600">vector</span>{'<'}<span className="text-blue-600">int</span>{'>'} <span className="text-yellow-700">twoSum</span>(<span className="text-blue-600">vector</span>{'<'}<span className="text-blue-600">int</span>{'>'} <span className="text-neutral-700">nums</span>, <span className="text-blue-600">int</span> <span className="text-neutral-700">target</span>) {'{'}
      {'\n  '}<span className="text-blue-600">unordered_map</span>{'<'}<span className="text-blue-600">int</span>, <span className="text-blue-600">int</span>{'>'} <span className="text-neutral-700">map</span>;
      {'\n  '}
      {'\n  '}<span className="text-purple-600">for</span> (<span className="text-blue-600">int</span> <span className="text-neutral-700">i</span> = <span className="text-green-600">0</span>; <span className="text-neutral-700">i</span> {'<'} <span className="text-neutral-700">nums</span>.<span className="text-yellow-700">size</span>(); <span className="text-neutral-700">i</span>++) {'{'}
      {'\n    '}<span className="text-blue-600">int</span> <span className="text-neutral-700">complement</span> = <span className="text-neutral-700">target</span> - <span className="text-neutral-700">nums</span>[<span className="text-neutral-700">i</span>];
      {'\n    '}
      {'\n    '}<span className="text-purple-600">if</span> (<span className="text-neutral-700">map</span>.<span className="text-yellow-700">find</span>(<span className="text-neutral-700">complement</span>) != <span className="text-neutral-700">map</span>.<span className="text-yellow-700">end</span>()) {'{'}
      {'\n      '}<span className="text-purple-600">return</span> {'{'}<span className="text-neutral-700">map</span>[<span className="text-neutral-700">complement</span>], <span className="text-neutral-700">i</span>{'}'};
      {'\n    '}
      {'}'}
      {'\n    '}
      {'\n    '}<span className="text-neutral-700">map</span>[<span className="text-neutral-700">nums</span>[<span className="text-neutral-700">i</span>]] = <span className="text-neutral-700">i</span>;
      {'\n  '}
      {'}'}
      {'\n  '}
      {'\n  '}<span className="text-purple-600">return</span> {'{}'};
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

export function HeroPreview() {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("Python")

  return (
    <div className="w-full h-full rounded-xl overflow-hidden shadow-2xl border border-black/10">
      <ResizablePanelGroup
        direction="horizontal"
        className="w-full h-full"
      >
        {/* Question Panel */}
        <ResizablePanel defaultSize={40}>
          <div className="flex h-full w-full flex-col bg-white">
            {/* Question Header */}
            <div className="border-b border-[#F0F0F0] px-6 py-4">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-xl font-semibold">{SAMPLE_QUESTION.title}</h2>
                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-700">
                  {SAMPLE_QUESTION.difficulty}
                </span>
              </div>
            </div>
            
            {/* Question Content */}
            <div className="flex-1 overflow-auto px-6 py-4">
              <div className="prose prose-sm max-w-none">
                <p className="text-sm text-neutral-700 leading-relaxed whitespace-pre-line">
                  {SAMPLE_QUESTION.description}
                </p>
                
                <div className="mt-6">
                  <h3 className="text-sm font-semibold mb-3">Example:</h3>
                  {SAMPLE_QUESTION.examples.map((example, idx) => (
                    <div key={idx} className="bg-neutral-50 rounded-lg p-4 space-y-2 text-xs">
                      <div>
                        <span className="font-medium">Input: </span>
                        <code className="text-neutral-700">{example.input}</code>
                      </div>
                      <div>
                        <span className="font-medium">Output: </span>
                        <code className="text-neutral-700">{example.output}</code>
                      </div>
                      {example.explanation && (
                        <div>
                          <span className="font-medium">Explanation: </span>
                          <span className="text-neutral-600">{example.explanation}</span>
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
              <div className="flex h-full w-full flex-col overflow-hidden bg-white">
                {/* Editor Toolbar */}
                <div className="border-b border-[#F0F0F0] px-4 py-2 flex items-center justify-between bg-white">
                  <div className="flex items-center gap-2">
                    <select 
                      className="text-sm border border-neutral-200 rounded px-2 py-1 bg-white cursor-pointer"
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value as Language)}
                    >
                      <option>Python</option>
                      <option>JavaScript</option>
                      <option>C++</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="text-sm px-3 py-1 rounded bg-neutral-100 hover:bg-neutral-200 transition-colors">
                      Run
                    </button>
                    <button className="text-sm px-3 py-1 rounded bg-black text-white hover:bg-neutral-800 transition-colors">
                      Submit
                    </button>
                  </div>
                </div>
                
                {/* Static Code Display */}
                <div className="min-h-0 flex-1 border-t border-[#F0F0F0] bg-white overflow-hidden">
                  <pre className="h-full p-4 font-mono text-sm leading-relaxed text-neutral-800 select-none">
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
              <div className="h-full w-full overflow-auto bg-white p-4 border-t border-[#F0F0F0]">
                <div className="space-y-3">
                  <h3 className="font-semibold text-sm mb-2">Test Cases</h3>
                  {SAMPLE_TEST_CASES.map((tc, idx) => (
                    <div key={tc.id} className="border rounded-md p-3 space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">Test Case {idx + 1}</div>
                        <TestCaseBadge name="" status={tc.status} />
                      </div>
                      <div>
                        <span className="text-muted-foreground">Input: </span>
                        <code className="bg-muted px-1 py-0.5 rounded text-xs">{tc.input}</code>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Expected: </span>
                        <code className="bg-muted px-1 py-0.5 rounded text-xs">{tc.expected_output}</code>
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
