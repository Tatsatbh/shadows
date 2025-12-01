
// export default function Editor(){
//     return (
//             <main className="min-h-screen bg-[#0b0a14] px-6 py-10 text-gray-100">
//       <div className="mx-auto flex max-w-6xl flex-col gap-8">
//         <section>
//           <p className="text-sm uppercase tracking-[0.3em] text-white/50">
//             Playground
//           </p>
//           <h1 className="text-3xl font-semibold text-white">
//             Minimal editor to test snippets
//           </h1>
//           <p className="text-sm text-white/60">
//             Pick a language, edit your code, and run it to preview the output.
//           </p>
//           <p className="text-xs uppercase tracking-[0.3em] text-white/40">
//             Realtime session: {sessionStatus.toLowerCase()}
//           </p>
//           <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-white/70">
//             <label className="flex items-center gap-2">
//               <input
//                 type="checkbox"
//                 className="h-4 w-4 rounded border-white/30 bg-transparent"
//                 checked={isPTTActive}
//                 onChange={(e) => handlePTTToggle(e.target.checked)}
//                 disabled={sessionStatus !== "CONNECTED"}
//               />
//               Push to talk
//             </label>
//             <button
//               onMouseDown={handleTalkButtonDown}
//               onMouseUp={handleTalkButtonUp}
//               onMouseLeave={handleTalkButtonUp}
//               onTouchStart={(e) => {
//                 e.preventDefault()
//                 handleTalkButtonDown()
//               }}
//               onTouchEnd={(e) => {
//                 e.preventDefault()
//                 handleTalkButtonUp()
//               }}
//               disabled={sessionStatus !== "CONNECTED" || !isPTTActive}
//               className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
//                 sessionStatus === "CONNECTED" && isPTTActive
//                   ? isPTTUserSpeaking
//                     ? "bg-emerald-500 text-black"
//                     : "bg-white/10 text-white hover:bg-white/20"
//                   : "bg-white/10 text-white/40"
//               }`}
//             >
//               {isPTTUserSpeaking ? "Listening…" : "Hold to Talk"}
//             </button>
//           </div>
//         </section>

//         <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
//           <section className="rounded-3xl border border-white/5 bg-[#151228] p-6 shadow-[0_35px_80px_rgba(0,0,0,0.45)]">
//             <div className="flex flex-wrap items-center justify-between gap-4">
//               <div>
//                 <p className="text-xs uppercase tracking-[0.4em] text-white/50">
//                   Language
//                 </p>
//                 <p className="text-lg font-semibold text-white">
//                   {selectedLanguageLabel}
//                 </p>
//               </div>
//               <LanguageSelector
//                 value={language}
//                 onChange={setLanguage}
//                 className="w-48"
//               />
//             </div>
//             <div className="mt-6 h-[520px] overflow-hidden rounded-2xl border border-white/10 bg-black/30">
//               <Editor
//                 language={language === "cpp" ? "cpp" : language}
//                 value={code}
//                 onChange={(value) => setCode(value ?? "")}
//                 theme="vs-dark"
//                 height="100%"
//                 options={{
//                   fontSize: 14,
//                   fontLigatures: true,
//                   minimap: { enabled: false },
//                   scrollBeyondLastLine: false,
//                   smoothScrolling: true,
//                   wordWrap: "on",
//                   automaticLayout: true,
//                 }}
//               />
//             </div>
//           </section>

//           <section className="flex flex-col rounded-3xl border border-white/5 bg-[#151228] p-6 shadow-[0_35px_80px_rgba(0,0,0,0.45)]">
//             <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
//               <div>
//                 <p className="text-base font-semibold text-white">Output</p>
//                 <p className="text-xs uppercase tracking-[0.3em] text-white/50">
//                   Preview
//                 </p>
//               </div>
//               <Button
//                 onClick={runCode}
//                 disabled={isRunning}
//                 variant="outline"
//                 className="rounded-full border-emerald-400/60 bg-emerald-500/10 px-6 text-emerald-100 transition hover:bg-emerald-500/20 disabled:border-white/20 disabled:bg-white/5"
//                 aria-label="Run the current code snippet"
//               >
//                 {isRunning ? "Running..." : "Run Code"}
//               </Button>
//             </div>
//             <div className="h-[520px] overflow-auto rounded-2xl border border-white/10 bg-black/30 p-4 font-mono text-sm text-green-300">
//               <pre className="whitespace-pre-wrap">{output}</pre>
//             </div>
//           </section>
//         </div>
//       </div>
//     </main>
//     )
// }
