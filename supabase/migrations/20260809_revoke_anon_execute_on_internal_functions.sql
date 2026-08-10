-- Two SECURITY DEFINER functions were reachable over the public REST API by
-- callers that have no business invoking them (database linter 0028/0029).
--
-- handle_new_user() is the trigger body behind auth.users inserts. It is not an
-- API surface at all, but it sat at the PostgREST default of EXECUTE for public,
-- anon and authenticated, so /rest/v1/rpc/handle_new_user was callable by
-- anyone. It references NEW, so a direct call errors rather than doing damage —
-- this closes the door regardless, since a trigger function has no reason to be
-- invocable.
--
-- question_test_case_counts() intentionally stays available to signed-in users:
-- the test-case panel needs the hidden-case count to render its lock
-- placeholders without the contents. 20260803_hide_hidden_test_cases_from_clients
-- did `revoke all ... from public` and granted only `authenticated`, but Supabase's
-- default privileges had already issued anon its own explicit EXECUTE, which a
-- revoke from the PUBLIC pseudo-role does not remove. Revoke it by name.

revoke all on function public.handle_new_user() from public, anon, authenticated;

revoke all on function public.question_test_case_counts(text) from anon;
