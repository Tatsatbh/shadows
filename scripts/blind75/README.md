# Blind 75 question content

One file per question. Each exports the full record — metadata, `description_md`,
both starter-code triples (`imports` / `code` / `main`), reference solutions, a
deliberately wrong solution, and the test-case inputs.

**Expected outputs are never hand-written.** `verify-local.mjs` derives them by
running the Python and C++ reference solutions and requiring both to agree; the
agreed value is written to `.expected/<slug>.json`, and the seeder inserts only
what is in there.

## Workflow

```bash
node scripts/verify-local.mjs            # derive + cross-check expected outputs
node scripts/verify-judge0.mjs --direct  # run on real Judge0 (correct solutions)
node scripts/verify-judge0.mjs --direct --wrong   # wrong solutions must be REJECTED
node scripts/seed-blind75.mjs --dry      # preview
node scripts/seed-blind75.mjs            # insert (idempotent, skips existing slugs)

npm run dev                              # then, in another terminal:
node scripts/verify-r0.mjs               # end-to-end through /api/submission
```

`verify-r0.mjs` is the only check that proves a question is actually playable —
it drives the real route, including the authenticated RLS path. It creates and
deletes a temporary auth user (the `test_cases` SELECT policy is scoped to role
`authenticated`), starts no interview session, and writes no `submissions` rows.

## Conventions

Input is **raw stdin**, one named argument per line, LeetCode-style:

```
nums = [2,7,11,15]
target = 9
```

Shared parsers live in `_drivers.mjs` and are interpolated into every `main`, so
all 15 questions accept the same grammar. Output: `true`/`false` lowercase,
int arrays space-separated on one line. Where the answer can be empty or its
ordering is arbitrary (`3sum`, `group-anagrams`, `reverse-linked-list`,
`minimum-window-substring`), the driver prints a **count first** and
canonicalises ordering, so a correct answer is never failed for formatting.

## Toolchain notes

- Judge0 language 71 is **Python 3.8** — no builtin generics (`list[int]`), use
  `typing.List`.
- Judge0 language 54 is **GCC 9.2** (default `gnu++14`). `verify-local.mjs`
  compiles with `-std=c++14` to match.
- Do **not** use `#include <bits/stdc++.h>`: it is a GCC extension, so it works
  on Judge0 but not on local clang, which makes local verification impossible.
  `CPP_INCLUDES` lists headers explicitly instead.
- Judge0 CE on the RapidAPI BASIC plan has a **daily batch quota**. A full
  verification sweep is 15 x 2 x 12 = 360 submissions, so a correct-plus-wrong
  run in one day will exhaust it.

## Status

**All 70 questions are authored, locally verified and seeded.** The database
holds 76 questions (the original 6 plus these 70), numbered 1-76, each new one
with 2 starter languages and 12 test cases (4 visible, 8 hidden).

Local verification covers every question: 840 cases, Python and C++ agreeing on
each, both stubs compiling, and every wrong solution failing at least one case.

### Judge0 coverage is partial

Only the first 15 questions (numbers 7-21) have been run on Judge0 itself —
360/360 accepted, with the wrong-solution gate confirmed for 9 of them before
the RapidAPI daily quota ran out. **Questions 22-76 have never been executed on
Judge0.** Local clang/Python 3.9 is a good proxy but not the real judge; the
known divergences are Python 3.8 vs 3.9 syntax, GCC vs clang, and the 2s CPU
limit on stress cases.

To close that gap, spread across days because a full sweep is 70 x 2 x 12 =
1680 submissions:

```bash
node scripts/verify-r0.mjs <slug> [<slug> ...]           # preferred: real route
node scripts/verify-r0.mjs --wrong <slug> [<slug> ...]
```

Prefer `verify-r0.mjs` over `verify-judge0.mjs`: it exercises the same judge
*plus* routing, auth and the test-case lookup, so it subsumes the direct check
and does not spend quota twice.
