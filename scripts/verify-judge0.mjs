#!/usr/bin/env node
// Judge0 verification for the Blind 75 seed content.
//
//   node scripts/verify-judge0.mjs                 # correct solutions, all cases
//   node scripts/verify-judge0.mjs --profile smoke # 2 cases per pair (cheap)
//   node scripts/verify-judge0.mjs --wrong         # wrong solutions must be rejected
//   node scripts/verify-judge0.mjs --reset         # discard resume state
//   node scripts/verify-judge0.mjs --dry           # plan only, spend no quota
//
// This is a VERIFICATION tool. It does not touch the runtime path — a real user
// submission still goes through /api/submission, one Judge0 submission per test
// case, which is what gives the UI a per-case verdict.
//
// == Why it is shaped like this ==
//
// Measured against the live API (see about/config_info):
//
//   x-ratelimit-batched-submissions-limit : 50 per day
//   max_submission_batch_size             : 20 submissions per POST
//
// The quota counts REQUESTS, not submissions: a POST carrying 20 submissions
// decrements the counter by exactly 1, and polling GETs decrement it by 0.
// Verified empirically. So the real daily budget is 50 x 20 = 1000 submissions,
// and the only thing that matters is filling every POST to 20.
//
// The previous version sent one question+language per POST — 12 submissions in
// a 20-slot request, burning 40% of each one. This packs work items across
// question boundaries so every request is full:
//
//   full  70 questions x 2 languages x 12 cases = 1680 subs =  84 requests
//   smoke 70 x 2 x 2 cases                      =  280 subs =  14 requests
//   wrong 70 x 2 x 1 discriminating case        =  140 subs =   7 requests
//
// `full` needs two days, so progress is checkpointed to .judge0-state.json and
// the run stops cleanly when quota runs low rather than dying on a 429. Re-run
// tomorrow and it picks up where it stopped.

import { readFileSync, writeFileSync, existsSync, readdirSync, unlinkSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import 'dotenv/config'

const HERE = dirname(fileURLToPath(import.meta.url))
const CONTENT_DIR = join(HERE, 'blind75')
const EXPECTED_DIR = join(CONTENT_DIR, '.expected')
const STATE_FILE = join(HERE, '.judge0-state.json')

const HOST = 'judge0-ce.p.rapidapi.com'
const JUDGE_IDS = { python: 71, cpp: 54 }
const MAX_BATCH = 20
// Judge0 accepts large payloads but a batch of 20 stress cases can be several MB;
// cap the request body and start a new batch rather than risk a 413.
const MAX_BATCH_BYTES = 3 * 1024 * 1024
// Leave a request in reserve so a run never ends on a 429.
const QUOTA_FLOOR = 1

const KEY = process.env.JUDGE0_API_KEY
if (!KEY) {
  console.error('JUDGE0_API_KEY is not set (expected in .env)')
  process.exit(2)
}

const args = process.argv.slice(2)
const wantWrong = args.includes('--wrong')
const dryRun = args.includes('--dry')
const profile = args.includes('--profile') ? args[args.indexOf('--profile') + 1] : (wantWrong ? 'wrong' : 'full')
const onlySlugs = args.filter((a) => !a.startsWith('--') && a !== profile)

if (args.includes('--reset') && existsSync(STATE_FILE)) {
  unlinkSync(STATE_FILE)
  console.log('resume state cleared')
}

const b64 = (s) => Buffer.from(s, 'utf8').toString('base64')
const unb64 = (s) => (s ? Buffer.from(s, 'base64').toString('utf8') : '')
const headers = (extra = {}) => ({ 'X-RapidAPI-Key': KEY, 'X-RapidAPI-Host': HOST, ...extra })

function assemble(q, lang, body) {
  const s = q.starters[lang]
  return [s.imports, body, s.main].filter(Boolean).join('\n')
}

// ---------------------------------------------------------------- work list

const slugs = readdirSync(CONTENT_DIR)
  .filter((f) => f.endsWith('.mjs') && !f.startsWith('_'))
  .map((f) => f.replace(/\.mjs$/, ''))
  .filter((s) => onlySlugs.length === 0 || onlySlugs.includes(s))
  .sort()

const state = existsSync(STATE_FILE) ? JSON.parse(readFileSync(STATE_FILE, 'utf8')) : { done: {}, failures: [] }
const stateKey = (item) => `${profile}:${item.slug}:${item.lang}:${item.caseIdx}`

const items = []
for (const slug of slugs) {
  const q = (await import(pathToFileURL(join(CONTENT_DIR, `${slug}.mjs`)).href)).default
  const expectedPath = join(EXPECTED_DIR, `${slug}.json`)
  if (!existsSync(expectedPath)) {
    console.error(`✗ ${slug}: no verified expected output — run verify-local.mjs first`)
    continue
  }
  const { cases, wrongFailsOn = {} } = JSON.parse(readFileSync(expectedPath, 'utf8'))

  // Which cases to send.
  //   full  every case
  //   smoke first visible case + the largest input (the stress case), which is
  //         where a CPU-limit or toolchain difference actually shows up
  //   wrong the exact case that local verification saw this wrong solution fail
  //         on, recorded per language in wrongFailsOn. Guessing "largest input"
  //         does not work: stress cases are often degenerate (a uniform grid, a
  //         sorted array) and a wrong solution gets them right by accident.
  let largest = 0
  cases.forEach((c, i) => {
    if (c.input.length > cases[largest].input.length) largest = i
  })

  for (const lang of ['python', 'cpp']) {
    const body = wantWrong ? q.wrong?.[lang] : q.solutions[lang]
    if (!body) continue

    let indices
    if (profile === 'full') {
      indices = cases.map((_, i) => i)
    } else if (profile === 'wrong') {
      const known = wrongFailsOn[lang]
      if (known === undefined) {
        console.error(`✗ ${slug} [${lang}]: no recorded discriminating case — re-run verify-local.mjs`)
        continue
      }
      indices = [known]
    } else {
      indices = [...new Set([0, largest])]
    }

    const source = assemble(q, lang, body)
    for (const caseIdx of indices) {
      const item = { slug, lang, caseIdx, source, ...cases[caseIdx] }
      if (state.done[stateKey(item)]) continue
      items.push(item)
    }
  }
}

if (items.length === 0) {
  console.log(`nothing to do — profile "${profile}" already complete (use --reset to redo)`)
  process.exit(0)
}

// ------------------------------------------------------------------ batching

const batches = []
let current = []
let currentBytes = 0
for (const item of items) {
  const size = item.source.length + item.input.length + item.expected_output.length
  if (current.length >= MAX_BATCH || (current.length > 0 && currentBytes + size > MAX_BATCH_BYTES)) {
    batches.push(current)
    current = []
    currentBytes = 0
  }
  current.push(item)
  currentBytes += size
}
if (current.length) batches.push(current)

console.log(`profile "${profile}"${wantWrong ? ' (wrong solutions)' : ''}`)
console.log(`${items.length} submissions to run, packed into ${batches.length} request(s) of up to ${MAX_BATCH}`)

async function quotaRemaining() {
  const res = await fetch(`https://${HOST}/about`, { headers: headers() })
  const remaining = Number(res.headers.get('x-ratelimit-batched-submissions-remaining'))
  const resetIn = Number(res.headers.get('x-ratelimit-batched-submissions-reset'))
  return { remaining, resetIn }
}

const { remaining, resetIn } = await quotaRemaining()
const hours = Math.floor(resetIn / 3600)
const mins = Math.round((resetIn % 3600) / 60)
console.log(`quota: ${remaining} request(s) left today, resets in ${hours}h${mins}m`)

if (batches.length > remaining - QUOTA_FLOOR) {
  console.log(`→ only ${Math.max(0, remaining - QUOTA_FLOOR)} will run now; the rest resume on the next invocation`)
}

if (dryRun) {
  console.log('\n--dry: nothing sent.')
  process.exit(0)
}

// ------------------------------------------------------------------- running

async function pollBatch(tokens) {
  for (let attempt = 0; attempt < 60; attempt++) {
    await new Promise((r) => setTimeout(r, 2000))
    // GETs do not consume quota.
    const res = await fetch(
      `https://${HOST}/submissions/batch?tokens=${tokens.join(',')}&base64_encoded=true`,
      { headers: headers() }
    )
    if (!res.ok) throw new Error(`batch GET ${res.status}: ${(await res.text()).slice(0, 300)}`)
    const { submissions } = await res.json()
    if (submissions.every((s) => s && s.status && s.status.id > 2)) return submissions
  }
  throw new Error('timed out waiting for Judge0')
}

let sent = 0
let accepted = 0
let rejected = 0
const failures = []

for (const [i, batch] of batches.entries()) {
  const { remaining: left } = await quotaRemaining()
  if (left <= QUOTA_FLOOR) {
    console.log(`\nstopping: ${left} request(s) left. Progress saved — re-run after the reset.`)
    break
  }

  const res = await fetch(`https://${HOST}/submissions/batch?base64_encoded=true`, {
    method: 'POST',
    headers: headers({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({
      submissions: batch.map((item) => ({
        language_id: JUDGE_IDS[item.lang],
        source_code: b64(item.source),
        stdin: b64(item.input),
        expected_output: b64(item.expected_output),
        cpu_time_limit: 2.0,
      })),
    }),
  })

  if (!res.ok) {
    console.log(`request ${i + 1}: HTTP ${res.status} — ${(await res.text()).slice(0, 200)}`)
    break
  }
  sent++

  const tokens = (await res.json()).map((s) => s.token)
  const subs = await pollBatch(tokens)

  subs.forEach((sub, k) => {
    const item = batch[k]
    const ok = sub.status.id === 3
    // A wrong solution is supposed to be rejected, so the pass condition flips.
    const asExpected = wantWrong ? !ok : ok
    if (asExpected) accepted++
    else {
      rejected++
      failures.push({
        slug: item.slug,
        lang: item.lang,
        caseIdx: item.caseIdx,
        status: sub.status.description,
        expected: item.expected_output.slice(0, 60),
        got: unb64(sub.stdout).slice(0, 60),
        error: (unb64(sub.compile_output) || unb64(sub.stderr) || '').slice(0, 200),
      })
    }
    state.done[stateKey(item)] = asExpected ? 'ok' : 'fail'
  })

  writeFileSync(STATE_FILE, JSON.stringify(state, null, 2))
  const done = accepted + rejected
  process.stdout.write(`\rrequest ${i + 1}/${batches.length} · ${done}/${items.length} submissions · ${rejected} unexpected`)
}

console.log('\n')
if (failures.length) {
  console.log(`${failures.length} unexpected result(s):`)
  for (const f of failures.slice(0, 40)) {
    console.log(`  ✗ ${f.slug} [${f.lang}] case ${f.caseIdx + 1}: ${f.status}`)
    if (!wantWrong) {
      console.log(`      expected ${JSON.stringify(f.expected)}  got ${JSON.stringify(f.got)}`)
      if (f.error) console.log(`      ${f.error.replace(/\n/g, '\n      ')}`)
    }
  }
  if (failures.length > 40) console.log(`  ...and ${failures.length - 40} more`)
} else {
  console.log(wantWrong ? 'every wrong solution was rejected, as expected' : 'all submissions accepted')
}

const doneCount = Object.keys(state.done).filter((k) => k.startsWith(`${profile}:`)).length
const outstanding = items.length - (accepted + rejected)
console.log(`\n${sent} request(s) spent · ${doneCount} submissions recorded for profile "${profile}"`)
if (outstanding > 0) {
  console.log(`${outstanding} submission(s) still outstanding — re-run after the quota reset to finish.`)
}
process.exit(failures.length ? 1 : 0)
