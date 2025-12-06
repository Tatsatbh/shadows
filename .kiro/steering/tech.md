# tech.md

**Project**: Shadows (working name)

**Assets**: [design screenshot](/mnt/data/Screenshot 2025-11-14 at 8.03.15 PM.png)

---

# 1. One line
We run AI technical phone screens for software engineers so companies do not need engineers doing first round interviews.
Currently aiming to develop a mock interview offering (D2C) to gain quick feedback 
around DX

---

# 2. Goal of this doc
A compact technical reference for engineers, ops and pilot customers describing the core architecture, data flow, integration points, persistence, and operational notes for the MVP and the production rollout on Kiro.

---

# 3. High level architecture

- Frontend: Next.js 15 app (client) with Monaco editor and realtime components.
- Realtime layer: WebRTC for low latency voice and signalling for agent events. Local realtime client connects to a realtime LLM endpoint for conversational turn taking.
- Backend API: FastAPI for session orchestration, REST endpoints, and tooling hooks (Judge0, Supabase).
- State Management: Zustand
- Frontend Queries: Tanstack ReactQuery
- Short term judge: Judge0 API for code execution and unit tests.

# 4. Core components and responsibilities

## Frontend
- Real time audio I/O and microphone permissions via the forked realtime demo. Use the forked WebRTC plumbing only for media; keep all business logic in the page code.
- Monaco editor integration: capture code diffs and push snapshot events to the backend in small deltas.
- Local buffer: Zustand store holds the current editor, code, output and a short event buffer for UI. Persist minimal state to avoid data loss.
- UX flow: start session -> agent introduces question -> candidate codes -> run tests -> end session -> confirmation to flush logs.

## Realtime agent
- Lightweight realtime model using gpt-realtime-mini (low-cost, low-latency) handles live conversation and followups.
- The realtime agent exposes tools: getEditorSnapshot, 
- The realtime model should NOT do final scoring. After session end, a stronger model is invoked for grading.

## Judge0
- For MVP, call hosted Judge0 via RapidAPI for single-run testing. 
- Production path: self-host Judge0 or run a small runner in Docker to eliminate per-submission costs and allow many testcases per compilation.

## Supabase
- Postgres tables for: sessions, events (summary), transcripts, scorecards, users, embeddings
- Storage bucket for audio blobs and raw session dumps
- pgvector extension for chunk retrieval

## Offline Evaluator
- Once session is completed, backend bundles: final code, code timeline, test history, chronological transcript, metadata.
- Send to stronger model for scoring and report generation. The result is a scorecard with per-dimension scores, evidence links to timestamps, and recommended actions.

---

# 5. Data model in Supabase (VERY IMPORTANT!)

- Questions Table (Which Stores the Questions on our platform): 

create table public.questions (
  id uuid not null default extensions.uuid_generate_v4 (),
  question_number integer not null,
  title text not null,
  description_md text not null,
  difficulty text not null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  question_uri text not null,
  constraint questions_pkey primary key (id),
  constraint questions_difficulty_check check (
    (
      difficulty = any (array['Easy'::text, 'Medium'::text, 'Hard'::text])
    )
  )
) TABLESPACE pg_default;

- Starter Code Table (Which stores the starter code - (imports + main))

create table public.starter_codes (
  id uuid not null default extensions.uuid_generate_v4 (),
  question_id uuid null,
  language text not null,
  code text not null,
  created_at timestamp with time zone null default now(),
  main text not null,
  imports text null,
  constraint starter_codes_pkey primary key (id),
  constraint starter_codes_question_id_fkey foreign KEY (question_id) references questions (id) on delete CASCADE
) TABLESPACE pg_default;

create unique INDEX IF not exists starter_codes_question_lang_idx on public.starter_codes using btree (question_id, language) TABLESPACE pg_default;

-- Submissions Table (Stores the submissions by the user)

create table public.submissions (
  id uuid not null default extensions.uuid_generate_v4 (),
  user_id uuid null,
  question_id uuid null,
  language text not null,
  code text not null,
  result_json jsonb null,
  created_at timestamp with time zone null default now(),
  session_id text null,
  constraint submissions_pkey primary key (id),
  constraint submissions_question_id_fkey foreign KEY (question_id) references questions (id) on delete CASCADE,
  constraint submissions_session_id_fkey foreign KEY (session_id) references sessions (id) on delete CASCADE,
  constraint submissions_user_id_fkey foreign KEY (user_id) references auth.users (id) on delete set null
) TABLESPACE pg_default;

-- Testcases Table for our questions. 

create table public.test_cases (
  id uuid not null default extensions.uuid_generate_v4 (),
  question_id uuid null,
  input text not null,
  expected_output text not null,
  hidden boolean null default false,
  created_at timestamp with time zone null default now(),
  constraint test_cases_pkey primary key (id),
  constraint test_cases_question_id_fkey foreign KEY (question_id) references questions (id) on delete CASCADE
) TABLESPACE pg_default;

Table for session creation - 

create table public.sessions (
  id text not null,
  user_id uuid null,
  question_id uuid null,
  status text not null default 'in_progress'::text,
  started_at timestamp with time zone not null default now(),
  ended_at timestamp with time zone null,
  transcript jsonb null,
  events jsonb null,
  final_code text null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  visibility text not null default 'private'::text,
  constraint sessions_pkey primary key (id),
  constraint sessions_question_id_fkey foreign KEY (question_id) references questions (id) on delete CASCADE,
  constraint sessions_user_id_fkey foreign KEY (user_id) references auth.users (id) on delete set null,
  constraint sessions_status_check check (
    (
      status = any (
        array[
          'in_progress'::text,
          'completed'::text,
          'abandoned'::text
        ]
      )
    )
  ),
  constraint sessions_visibility_check check (
    (
      visibility = any (
        array[
          'private'::text,
          'public'::text,
          'unlisted'::text
        ]
      )
    )
  )
) TABLESPACE pg_default;

---


