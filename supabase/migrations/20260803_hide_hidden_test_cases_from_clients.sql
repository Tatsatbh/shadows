-- Applied to the remote project on 2026-08-03.
--
-- test_cases had SELECT for role `authenticated` with USING (true), so any
-- signed-in user could read every hidden test case's input and expected_output
-- straight from the REST API. The app only hid them in fetchTestCasesMetadata,
-- which is presentation, not a security boundary.
--
-- Clients now see visible cases only. The two server routes that genuinely need
-- the hidden cases use the service-role client, which bypasses RLS:
--   /api/submission  runs every case on Judge0
--   /api/report      grades against them, masking inputs to '[Hidden]' first
--
-- Verified after applying: an authenticated user sees 300 of 891 rows and 0 of
-- the 591 hidden ones; a signed-out user sees none.

drop policy if exists "Authenticated users can see all test cases" on public.test_cases;

create policy "Visible test cases are readable by authenticated users"
  on public.test_cases
  for select
  to authenticated
  using (hidden = false);

-- The panel still renders a lock placeholder per hidden case, so it needs the
-- count without the contents. SECURITY DEFINER to see past the policy above,
-- returning only aggregates.
create or replace function public.question_test_case_counts(p_question_uri text)
returns table (total_count integer, hidden_count integer)
language sql
security definer
set search_path = public
stable
as $$
  select
    count(*)::integer as total_count,
    count(*) filter (where tc.hidden)::integer as hidden_count
  from public.test_cases tc
  join public.questions q on q.id = tc.question_id
  where q.question_uri = p_question_uri;
$$;

revoke all on function public.question_test_case_counts(text) from public;
grant execute on function public.question_test_case_counts(text) to authenticated;
