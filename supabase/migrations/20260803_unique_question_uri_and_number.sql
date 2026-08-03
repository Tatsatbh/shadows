-- Applied to the remote project on 2026-08-03.
--
-- fetchQuestionByUri(), /api/submission, /api/report and /api/interview-sessions
-- all resolve a question with .eq('question_uri', ...).single(), which throws at
-- runtime if two rows ever share a slug — and nothing prevented that. The slug is
-- also the URL segment for /problems/[name], so a duplicate makes the route
-- ambiguous. question_number is the display order and the "#N" badge.
--
-- Verified clean before applying: 0 duplicate slugs, 0 duplicate numbers.
create unique index if not exists questions_question_uri_key
  on public.questions (question_uri);

create unique index if not exists questions_question_number_key
  on public.questions (question_number);
