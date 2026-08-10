-- Applied to the remote project on 2026-08-03.
--
-- sessions and submissions each carried `SELECT USING (true)` for role `public`,
-- which includes `anon`. Since NEXT_PUBLIC_SUPABASE_ANON_KEY ships in the client
-- bundle, anyone could read every user's interview transcript, final_code and
-- scorecard straight from the REST API. Ownership was only ever enforced by a
-- client-side .eq('user_id', ...) filter, which an attacker simply omits.
--
-- The replacement policies keep report sharing working: a session stays readable
-- when its owner asks for it (visibility 'public' or 'unlisted').

drop policy if exists "Enable read access for all users" on public.sessions;

create policy "Owner or shared sessions are readable"
  on public.sessions
  for select
  using (
    auth.uid() = user_id
    or visibility in ('public', 'unlisted')
  );

drop policy if exists "Enable read access for all users" on public.submissions;

create policy "Owner or shared submissions are readable"
  on public.submissions
  for select
  using (
    auth.uid() = user_id
    or exists (
      select 1
      from public.sessions s
      where s.id = submissions.session_id
        and s.visibility in ('public', 'unlisted')
    )
  );

-- No WITH CHECK on the profiles update policy meant a user could rewrite their
-- row's id and take over another profile.
drop policy if exists "Users can update own profile." on public.profiles;

create policy "Users can update own profile."
  on public.profiles
  for update
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);
