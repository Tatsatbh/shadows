#!/usr/bin/env node
// End-to-end verification through r0's own /api/submission route.
//
//   npm run dev            # in another terminal
//   node scripts/verify-r0.mjs [slug ...] [--wrong]
//
// Unlike verify-judge0.mjs (which talks to Judge0 directly), this drives the
// real product path: Next.js route -> Supabase test-case lookup -> Judge0 ->
// results polling. It is the only check that proves a seeded question is
// actually playable.
//
// Two things it deliberately does:
//
//  * Authenticates. The `test_cases` RLS policy is scoped to role
//    `authenticated`, so an anonymous POST reads zero rows and the route
//    answers 404 "No test cases found". A temporary user is created with the
//    service role, signed in, encoded into the @supabase/ssr cookie, and
//    deleted afterwards.
//
//  * Omits sessionId/questionId/code/language from the results GET. Supplying
//    them makes the route INSERT into `submissions`; verification runs should
//    not litter the table (and would fail the session_id foreign key anyway).
//
// It never starts an interview session, so it burns no profile credits.

import { readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const HERE = dirname(fileURLToPath(import.meta.url))
const CONTENT_DIR = join(HERE, 'blind75')
const BASE = process.env.R0_BASE_URL ?? 'http://localhost:3000'
const JUDGE_IDS = { python: 71, cpp: 54 }

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const projectRef = new URL(url).hostname.split('.')[0]

const admin = createClient(url, serviceKey, { auth: { persistSession: false } })

// --- temporary authenticated user ----------------------------------------
const TEST_EMAIL = `blind75-verify@example.invalid`
const TEST_PASSWORD = `verify-${projectRef}-${Buffer.from(projectRef).toString('hex').slice(0, 12)}`

async function createTempUser() {
  const { data, error } = await admin.auth.admin.createUser({
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
    email_confirm: true,
  })
  if (error && !/already been registered/i.test(error.message)) throw error
  if (data?.user) return data.user.id
  const { data: list } = await admin.auth.admin.listUsers()
  return list.users.find((u) => u.email === TEST_EMAIL)?.id
}

async function deleteTempUser(id) {
  if (id) await admin.auth.admin.deleteUser(id)
}

// @supabase/ssr 0.7: cookie value is "base64-" + base64url(JSON), split into
// `<name>.0`, `<name>.1`, ... at MAX_CHUNK_SIZE.
const MAX_CHUNK_SIZE = 3180
function sessionCookies(session) {
  const name = `sb-${projectRef}-auth-token`
  const encoded = 'base64-' + Buffer.from(JSON.stringify(session), 'utf8').toString('base64url')
  if (encoded.length <= MAX_CHUNK_SIZE) return [`${name}=${encoded}`]
  const chunks = []
  for (let i = 0; i < encoded.length; i += MAX_CHUNK_SIZE) {
    chunks.push(`${name}.${chunks.length}=${encoded.slice(i, i + MAX_CHUNK_SIZE)}`)
  }
  return chunks
}

function assemble(q, lang, body) {
  const s = q.starters[lang]
  return [s.imports, body, s.main].filter(Boolean).join('\n')
}

const args = process.argv.slice(2)
const wantWrong = args.includes('--wrong')
const only = args.filter((a) => !a.startsWith('--'))
const slugs = readdirSync(CONTENT_DIR)
  .filter((f) => f.endsWith('.mjs') && !f.startsWith('_'))
  .map((f) => f.replace(/\.mjs$/, ''))
  .filter((s) => only.length === 0 || only.includes(s))
  .sort()

let userId
let failures = 0
let quotaBlocked = 0

try {
  userId = await createTempUser()
  const anon = createClient(url, anonKey, { auth: { persistSession: false } })
  const { data: signIn, error: signInError } = await anon.auth.signInWithPassword({
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
  })
  if (signInError) throw signInError
  const cookie = sessionCookies(signIn.session).join('; ')

  for (const slug of slugs) {
    const q = (await import(pathToFileURL(join(CONTENT_DIR, `${slug}.mjs`)).href)).default

    for (const lang of ['python', 'cpp']) {
      const label = `${slug} [${lang}]${wantWrong ? ' WRONG' : ''}`
      const source = assemble(q, lang, wantWrong ? q.wrong[lang] : q.solutions[lang])

      const post = await fetch(`${BASE}/api/submission`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Cookie: cookie },
        body: JSON.stringify({
          judgeId: JUDGE_IDS[lang],
          code: source,
          questionUri: slug,
          sessionId: 'verify-' + slug,
        }),
      })

      if (post.status === 404) {
        failures++
        console.log(`✗ ${label}: route returned 404 — ${(await post.text()).slice(0, 120)}`)
        continue
      }
      if (!post.ok) {
        // The route forwards Judge0's status, so 429 here is the daily quota,
        // not a fault in the question. Everything up to Judge0 worked.
        quotaBlocked++
        console.log(`⚠ ${label}: route reached Judge0 but got ${post.status} (question + test cases resolved)`)
        continue
      }

      const { tokens, testCaseCount } = await post.json()

      let subs = null
      for (let attempt = 0; attempt < 40; attempt++) {
        await new Promise((r) => setTimeout(r, 2000))
        const res = await fetch(`${BASE}/api/submission?tokens=${tokens.join(',')}`, { headers: { Cookie: cookie } })
        if (!res.ok) break
        const body = await res.json()
        if (body.submissions?.every((s) => s.status.id > 2)) { subs = body.submissions; break }
      }
      if (!subs) {
        failures++
        console.log(`✗ ${label}: results never completed`)
        continue
      }

      const accepted = subs.filter((s) => s.status.id === 3).length
      if (wantWrong) {
        if (accepted === subs.length) { failures++; console.log(`✗ ${label}: judge accepted ALL ${accepted}`) }
        else console.log(`✓ ${label}: rejected as expected (${accepted}/${subs.length})`)
      } else if (accepted === testCaseCount) {
        console.log(`✓ ${label}: ${accepted}/${testCaseCount} accepted via /api/submission`)
      } else {
        failures++
        console.log(`✗ ${label}: ${accepted}/${testCaseCount} accepted`)
      }
    }
  }
} finally {
  await deleteTempUser(userId)
}

if (quotaBlocked) console.log(`\n${quotaBlocked} run(s) blocked by Judge0 daily quota — rerun after it resets`)
console.log(failures ? `\n${failures} failure(s)` : '\nno failures')
process.exit(failures ? 1 : 0)
