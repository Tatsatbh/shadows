#!/usr/bin/env node
// Seeds the Blind 75 questions in scripts/blind75/ into Supabase.
//
//   node scripts/seed-blind75.mjs [--dry] [slug ...]
//
// Requires SUPABASE_SERVICE_ROLE_KEY: RLS on questions/starter_codes/test_cases
// grants SELECT only, with no INSERT policy, so the anon key cannot write.
//
// Only inserts content that verify-local.mjs has already validated — the
// expected outputs come from scripts/blind75/.expected/<slug>.json, which is
// written only when both language implementations agree on every case.
//
// Idempotent: `questions` has no unique constraint on question_uri, and
// fetchQuestionByUri() uses .single(), so a duplicate slug would break the app
// at runtime. Every question is checked for existence before insert.

import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const HERE = dirname(fileURLToPath(import.meta.url))
const CONTENT_DIR = join(HERE, 'blind75')
const EXPECTED_DIR = join(CONTENT_DIR, '.expected')

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !serviceKey) {
  console.error('NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env')
  process.exit(2)
}

// Not importing supabaseAdmin() from src/lib/supabaseClient.ts because that is
// TypeScript and this is a plain node script; same client, same key.
const db = createClient(url, serviceKey, { auth: { persistSession: false } })

const args = process.argv.slice(2)
const dry = args.includes('--dry')
const refreshStarters = args.includes('--refresh-starters')
const only = args.filter((a) => !a.startsWith('--'))

const slugs = readdirSync(CONTENT_DIR)
  .filter((f) => f.endsWith('.mjs') && !f.startsWith('_'))
  .map((f) => f.replace(/\.mjs$/, ''))
  .filter((s) => only.length === 0 || only.includes(s))
  .sort()

let inserted = 0
let skipped = 0

for (const slug of slugs) {
  const q = (await import(pathToFileURL(join(CONTENT_DIR, `${slug}.mjs`)).href)).default

  const expectedPath = join(EXPECTED_DIR, `${slug}.json`)
  if (!existsSync(expectedPath)) {
    console.error(`✗ ${slug}: no verified expected output — run verify-local.mjs first`)
    process.exitCode = 1
    continue
  }
  const { cases } = JSON.parse(readFileSync(expectedPath, 'utf8'))

  const { data: existing, error: lookupError } = await db
    .from('questions')
    .select('id')
    .eq('question_uri', q.question_uri)
    .maybeSingle()
  if (lookupError) {
    console.error(`✗ ${slug}: lookup failed — ${lookupError.message}`)
    process.exitCode = 1
    continue
  }
  if (existing) {
    // --refresh-starters rewrites imports/code/main for a question that is
    // already seeded. Needed when a shared helper in _drivers.mjs changes after
    // insertion, so the stored starters keep matching the repo. Test cases are
    // left alone: changing them would invalidate recorded submissions.
    if (refreshStarters) {
      const { error: upErr } = await db.from('starter_codes').upsert(
        ['python', 'cpp'].map((lang) => ({
          question_id: existing.id,
          language: lang,
          code: q.starters[lang].code,
          imports: q.starters[lang].imports,
          main: q.starters[lang].main,
        })),
        { onConflict: 'question_id,language' }
      )
      if (upErr) {
        console.error(`✗ ${slug}: starter refresh failed — ${upErr.message}`)
        process.exitCode = 1
      } else {
        console.log(`↻ ${slug}: starters refreshed`)
      }
      continue
    }
    console.log(`· ${slug}: already present, skipping`)
    skipped++
    continue
  }

  if (dry) {
    const visible = cases.filter((c) => !c.hidden).length
    console.log(`would insert ${slug} (#${q.question_number}, ${q.difficulty}) — 2 starters, ${cases.length} cases (${visible} visible)`)
    continue
  }

  const { data: row, error: qErr } = await db
    .from('questions')
    .insert({
      question_number: q.question_number,
      title: q.title,
      description_md: q.description_md,
      difficulty: q.difficulty,
      question_uri: q.question_uri,
      summary: q.summary,
    })
    .select('id')
    .single()
  if (qErr) {
    console.error(`✗ ${slug}: question insert failed — ${qErr.message}`)
    process.exitCode = 1
    continue
  }

  const { error: scErr } = await db.from('starter_codes').insert(
    ['python', 'cpp'].map((lang) => ({
      question_id: row.id,
      language: lang,
      code: q.starters[lang].code,
      imports: q.starters[lang].imports,
      main: q.starters[lang].main,
    }))
  )
  if (scErr) {
    console.error(`✗ ${slug}: starter_codes insert failed — ${scErr.message}`)
    process.exitCode = 1
    continue
  }

  // created_at is set explicitly and strictly increasing. The column defaults to
  // now(), which is the TRANSACTION timestamp — a bulk insert would give every
  // row an identical value, leaving `.order('created_at')` ambiguous. Everything
  // downstream matches Judge0 results to test cases positionally in that order,
  // and the UI shows visible cases before hidden ones, so visible rows must sort
  // first.
  const base = Date.now()
  const ordered = [...cases.filter((c) => !c.hidden), ...cases.filter((c) => c.hidden)]
  const { error: tcErr } = await db.from('test_cases').insert(
    ordered.map((c, i) => ({
      question_id: row.id,
      input: c.input,
      expected_output: c.expected_output,
      hidden: c.hidden,
      created_at: new Date(base + i * 1000).toISOString(),
    }))
  )
  if (tcErr) {
    console.error(`✗ ${slug}: test_cases insert failed — ${tcErr.message}`)
    process.exitCode = 1
    continue
  }

  const visible = ordered.filter((c) => !c.hidden).length
  console.log(`✓ ${slug} (#${q.question_number}, ${q.difficulty}) — 2 starters, ${ordered.length} cases (${visible} visible)`)
  inserted++
}

console.log(`\ninserted ${inserted}, skipped ${skipped}, of ${slugs.length}`)
