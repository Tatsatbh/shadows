#!/usr/bin/env node
// Local verification for the Blind 75 seed content.
//
//   node scripts/verify-local.mjs [slug ...]
//
// For every question it:
//   1. compiles/runs `imports + reference solution + main` in BOTH languages
//      against every test input;
//   2. requires the two languages to produce identical output — that agreement
//      is what defines `expected_output`, rather than hand-written values;
//   3. compiles `imports + stub + main` to prove a candidate's blank editor
//      still builds;
//   4. runs the deliberately-wrong solution and requires it to disagree on at
//      least one case, proving the tests actually discriminate.
//
// Derived expected outputs are written to scripts/blind75/.expected/<slug>.json,
// which is what the seeder inserts.
//
// C++ is compiled with -std=c++14: Judge0 language 54 is GCC 9.2 whose default
// is gnu++14, so anything newer would pass here and fail on the judge.

import { spawnSync } from 'node:child_process'
import { mkdirSync, writeFileSync, readdirSync, mkdtempSync, rmSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { tmpdir } from 'node:os'
import { fileURLToPath, pathToFileURL } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const CONTENT_DIR = join(HERE, 'blind75')
const OUT_DIR = join(CONTENT_DIR, '.expected')

const RUN_TIMEOUT_MS = 15000

function assemble(q, lang, body) {
  const s = q.starters[lang]
  return [s.imports, body, s.main].filter(Boolean).join('\n')
}

function runPython(source, input) {
  const dir = mkdtempSync(join(tmpdir(), 'b75py-'))
  try {
    const file = join(dir, 'main.py')
    writeFileSync(file, source)
    const r = spawnSync('python3', [file], {
      input,
      encoding: 'utf8',
      timeout: RUN_TIMEOUT_MS,
      maxBuffer: 64 * 1024 * 1024,
    })
    if (r.error) return { ok: false, err: String(r.error.message) }
    if (r.status !== 0) return { ok: false, err: (r.stderr || '').trim().slice(-600) }
    return { ok: true, out: trimTrailing(r.stdout) }
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
}

function compileCpp(source) {
  const dir = mkdtempSync(join(tmpdir(), 'b75cpp-'))
  const src = join(dir, 'main.cpp')
  const bin = join(dir, 'main')
  writeFileSync(src, source)
  const r = spawnSync('g++', ['-std=c++14', '-O2', '-o', bin, src], {
    encoding: 'utf8',
    timeout: 120000,
  })
  if (r.status !== 0) {
    rmSync(dir, { recursive: true, force: true })
    return { ok: false, err: (r.stderr || '').trim().slice(-1200) }
  }
  return { ok: true, bin, cleanup: () => rmSync(dir, { recursive: true, force: true }) }
}

function runBin(bin, input) {
  const r = spawnSync(bin, [], {
    input,
    encoding: 'utf8',
    timeout: RUN_TIMEOUT_MS,
    maxBuffer: 64 * 1024 * 1024,
  })
  if (r.error) return { ok: false, err: String(r.error.message) }
  if (r.status !== 0) return { ok: false, err: (r.stderr || '').trim().slice(-600) }
  return { ok: true, out: trimTrailing(r.stdout) }
}

// Judge0 trims trailing whitespace before comparing; mirror that exactly.
function trimTrailing(s) {
  return (s ?? '').replace(/[ \t\r\n]+$/, '')
}

function short(s, n = 70) {
  const one = String(s).replace(/\n/g, '\\n')
  return one.length > n ? one.slice(0, n) + `…(${one.length})` : one
}

async function verify(q) {
  const slug = q.question_uri
  const inputs = [
    ...q.visible.map((input) => ({ input, hidden: false })),
    ...q.hidden.map((input) => ({ input, hidden: true })),
  ]
  const problems = []

  // --- reference solutions, both languages -------------------------------
  const pySource = assemble(q, 'python', q.solutions.python)
  const cppSource = assemble(q, 'cpp', q.solutions.cpp)

  const cppBuild = compileCpp(cppSource)
  if (!cppBuild.ok) {
    return { slug, problems: [`cpp reference failed to compile:\n${cppBuild.err}`] }
  }

  const cases = []
  for (let i = 0; i < inputs.length; i++) {
    const { input, hidden } = inputs[i]
    const py = runPython(pySource, input)
    const cpp = runBin(cppBuild.bin, input)

    if (!py.ok) problems.push(`case ${i + 1} python errored: ${py.err}`)
    if (!cpp.ok) problems.push(`case ${i + 1} cpp errored: ${cpp.err}`)
    if (!py.ok || !cpp.ok) continue

    if (py.out !== cpp.out) {
      problems.push(
        `case ${i + 1} LANGUAGE DISAGREEMENT\n    input:  ${short(input)}\n    python: ${short(py.out)}\n    cpp:    ${short(cpp.out)}`
      )
      continue
    }
    cases.push({ input, expected_output: py.out, hidden })
  }

  // --- stubs must at least build ----------------------------------------
  const stubBuild = compileCpp(assemble(q, 'cpp', q.starters.cpp.code))
  if (!stubBuild.ok) problems.push(`cpp STUB does not compile:\n${stubBuild.err}`)
  else stubBuild.cleanup()

  const pyStub = spawnSync('python3', ['-c', 'import ast,sys; ast.parse(sys.stdin.read())'], {
    input: assemble(q, 'python', q.starters.python.code),
    encoding: 'utf8',
  })
  if (pyStub.status !== 0) problems.push(`python STUB is not valid syntax: ${(pyStub.stderr || '').trim()}`)

  // --- the wrong solution must actually fail something -------------------
  if (q.wrong) {
    const wrongBuild = compileCpp(assemble(q, 'cpp', q.wrong.cpp))
    if (!wrongBuild.ok) {
      problems.push(`cpp WRONG solution does not compile:\n${wrongBuild.err}`)
    } else {
      let discriminated = false
      for (const c of cases) {
        const r = runBin(wrongBuild.bin, c.input)
        if (!r.ok || r.out !== c.expected_output) { discriminated = true; break }
      }
      wrongBuild.cleanup()
      if (!discriminated) problems.push('WRONG cpp solution passes every test — tests do not discriminate')
    }

    const wrongPy = assemble(q, 'python', q.wrong.python)
    let pyDiscriminated = false
    for (const c of cases) {
      const r = runPython(wrongPy, c.input)
      if (!r.ok || r.out !== c.expected_output) { pyDiscriminated = true; break }
    }
    if (!pyDiscriminated) problems.push('WRONG python solution passes every test — tests do not discriminate')
  }

  cppBuild.cleanup()

  if (problems.length === 0) {
    mkdirSync(OUT_DIR, { recursive: true })
    writeFileSync(
      join(OUT_DIR, `${slug}.json`),
      JSON.stringify({ question_uri: slug, cases }, null, 2)
    )
  }
  return { slug, problems, count: cases.length }
}

const only = process.argv.slice(2)
const files = readdirSync(CONTENT_DIR)
  .filter((f) => f.endsWith('.mjs') && !f.startsWith('_'))
  .filter((f) => only.length === 0 || only.includes(f.replace(/\.mjs$/, '')))
  .sort()

let failed = 0
for (const f of files) {
  const mod = await import(pathToFileURL(join(CONTENT_DIR, f)).href)
  const q = mod.default
  const { slug, problems, count } = await verify(q)
  if (problems.length) {
    failed++
    console.log(`\n✗ ${slug}`)
    for (const p of problems) console.log(`  - ${p}`)
  } else {
    console.log(`✓ ${slug.padEnd(48)} ${count} cases verified (py == cpp)`)
  }
}

console.log(`\n${files.length - failed}/${files.length} questions verified`)
process.exit(failed ? 1 : 0)
