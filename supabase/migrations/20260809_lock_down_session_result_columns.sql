-- sessions carries an ALL policy for `authenticated` USING (auth.uid() =
-- user_id) sitting on top of a table-wide UPDATE grant, so nothing restricted
-- *which* columns an owner could write. A signed-in user could PostgREST-update
-- their own session directly:
--
--   await supabase.from('sessions')
--     .update({ events: { scorecard: { overallRecommendation: 'Strong Hire' } } })
--     .eq('id', <own session>)
--
-- `events` holds the AI scorecard, and `final_code` / `transcript` are the
-- evidence behind it. Flipping `visibility` to 'public' or 'unlisted' then
-- shares that forged verdict through the report-sharing feature added in
-- 20260803014725. A report is only worth something to a third party if the
-- candidate cannot author it.
--
-- Columns a user legitimately changes, each through a route that has already
-- verified ownership:
--   status, ended_at  -> /api/interview-sessions (PATCH and the resume path),
--                        /api/session-abandon
--   visibility        -> the share control in src/app/report/[sessionId]/page.tsx
--
-- Everything else is server-authored. /api/report writes its verdict with the
-- service-role client, which bypasses these grants; it checks session ownership
-- before grading, so narrowing the caller's own privileges costs it nothing.
--
-- submissions.result_json is Judge0's verdict on a run. Nothing in the app
-- updates a submission after insert, so UPDATE is removed outright rather than
-- narrowed — otherwise a user could rewrite a failing run into a passing one.
--
-- As established in 20260803014758: a column-level REVOKE cannot subtract from
-- a table-wide GRANT, so the grant is dropped and re-issued per column.

revoke update on public.sessions from anon, authenticated;

grant update (status, ended_at, visibility)
  on public.sessions to authenticated;

revoke update on public.submissions from anon, authenticated;
