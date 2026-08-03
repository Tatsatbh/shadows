#!/usr/bin/env node
// Judge0 verification for the Blind 75 seed content.
//
//   node scripts/verify-judge0.mjs --direct <slug> [--lang python|cpp] [--wrong]
//
// Calls the Judge0 CE batch API exactly the way src/app/api/submission/route.ts
// does — same language ids, same base64 encoding, same cpu_time_limit — so a
// pass here means a pass in the product. Used before the rows exist in the DB;
// once they do, verify-r0.mjs drives the real /api/submission route instead.
//
// Reads JUDGE0_API_KEY from .env via dotenv and never prints it.

import { readFileSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import 'dotenv/config'

const HERE = dirname(fileURLToPath(import.meta.url))
const CONTENT_DIR = join(HERE, 'blind75')
const EXPECTED_DIR = join(CONTENT_DIR, '.expected')

const JUDGE_IDS = { python: 71, cpp: 54 }
const HOST = 'judge0-ce.p.rapidapi.com'

const KEY = process.env.JUDGE0_API_KEY
if (!KEY) {
  console.error('JUDGE0_API_KEY is not set (expected in .env)')
  process.exit(2)
}

const b64 = (s) => Buffer.from(s, 'utf8').toString('base64')
const unb64 = (s) => (s ? Buffer.from(s, 'base64').toString('utf8') : '')

function headers(extra = {}) {
  return { 'X-RapidAPI-Key': KEY, 'X-RapidAPI-Host': HOST, ...extra }
}

function reportQuota(res) {
  const remaining = res.headers.get('x-ratelimit-requests-remaining')
  const limit = res.headers.get('x-ratelimit-requests-limit')
  if (remaining !== null) console.log(`   [quota] ${remaining}/${limit ?? '?'} requests remaining`)
}

async function submitBatch(source, cases, judgeId) {
  const res = await fetch(`https://${HOST}/submissions/batch?base64_encoded=true`, {
    method: 'POST',
    headers: headers({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({
      submissions: cases.map((c) => ({
        language_id: judgeId,
        source_code: b64(source),
        stdin: b64(c.input),
        expected_output: b64(c.expected_output),
        cpu_time_limit: 2.0,
      })),
    }),
  })
  reportQuota(res)
  if (!res.ok) throw new Error(`batch POST ${res.status}: ${(await res.text()).slice(0, 400)}`)
  return (await res.json()).map((s) => s.token)
}

async function pollBatch(tokens) {
  for (let attempt = 0; attempt < 40; attempt++) {
    await new Promise((r) => setTimeout(r, 2000))
    const res = await fetch(
      `https://${HOST}/submissions/batch?tokens=${tokens.join(',')}&base64_encoded=true`,
      { headers: headers() }
    )
    if (!res.ok) throw new Error(`batch GET ${res.status}: ${(await res.text()).slice(0, 400)}`)
    const { submissions } = await res.json()
    if (submissions.every((s) => s.status.id > 2)) return submissions
  }
  throw new Error('timed out waiting for Judge0')
}

function assemble(q, lang, body) {
  const s = q.starters[lang]
  return [s.imports, body, s.main].filter(Boolean).join('\n')
}

const args = process.argv.slice(2)
const slugs = args.filter((a) => !a.startsWith('--'))
const wantWrong = args.includes('--wrong')
const langArg = args.includes('--lang') ? args[args.indexOf('--lang') + 1] : null
const langs = langArg ? [langArg] : ['python', 'cpp']

const targets = slugs.length
  ? slugs
  : readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.mjs') && !f.startsWith('_')).map((f) => f.replace(/\.mjs$/, '')).sort()

let failures = 0

for (const slug of targets) {
  const q = (await import(pathToFileURL(join(CONTENT_DIR, `${slug}.mjs`)).href)).default
  const { cases } = JSON.parse(readFileSync(join(EXPECTED_DIR, `${slug}.json`), 'utf8'))

  for (const lang of langs) {
    const body = wantWrong ? q.wrong[lang] : q.solutions[lang]
    const source = assemble(q, lang, body)
    const label = `${slug} [${lang}]${wantWrong ? ' WRONG' : ''}`

    try {
      const tokens = await submitBatch(source, cases, JUDGE_IDS[lang])
      const subs = await pollBatch(tokens)
      const accepted = subs.filter((s) => s.status.id === 3).length

      if (wantWrong) {
        // A wrong solution must be rejected by at least one case.
        if (accepted === subs.length) {
          failures++
          console.log(`✗ ${label}: judge accepted ALL ${accepted} cases — tests do not discriminate`)
        } else {
          console.log(`✓ ${label}: rejected as expected (${accepted}/${subs.length} accepted)`)
        }
      } else if (accepted === subs.length) {
        console.log(`✓ ${label}: ${accepted}/${subs.length} accepted`)
      } else {
        failures++
        console.log(`✗ ${label}: ${accepted}/${subs.length} accepted`)
        subs.forEach((s, i) => {
          if (s.status.id === 3) return
          console.log(`    case ${i + 1}: ${s.status.description}`)
          console.log(`      stdin:    ${JSON.stringify(cases[i].input.slice(0, 60))}`)
          console.log(`      expected: ${JSON.stringify(cases[i].expected_output.slice(0, 60))}`)
          console.log(`      stdout:   ${JSON.stringify(unb64(s.stdout).slice(0, 60))}`)
          const err = unb64(s.compile_output) || unb64(s.stderr)
          if (err) console.log(`      error:    ${err.slice(0, 300).replace(/\n/g, '\n                ')}`)
        })
      }
    } catch (e) {
      failures++
      console.log(`✗ ${label}: ${e.message}`)
    }
  }
}

process.exit(failures ? 1 : 0)
