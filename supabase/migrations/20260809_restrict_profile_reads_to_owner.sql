-- profiles still carried the Supabase starter policy
-- `Public profiles are viewable by everyone.` — SELECT USING (true) for role
-- `public`, which includes `anon`. NEXT_PUBLIC_SUPABASE_ANON_KEY ships in the
-- client bundle and this repository is public, so anyone could read every row:
-- id, username, full_name, avatar_url, website and credits — the paid interview
-- balance — for every account, and map auth user ids to real names.
--
-- 20260803014725 closed the same hole on sessions and submissions but left
-- profiles untouched, and 20260803014758 only stopped credits being *written*.
--
-- Nothing in the app reads another user's profile. The single caller is
-- fetchUserCredits() in src/lib/queries.ts, always scoped .eq('id', <self>).
-- If public profile pages are added later, add a narrow policy that exposes the
-- display columns only — never credits.

drop policy if exists "Public profiles are viewable by everyone." on public.profiles;

create policy "Users can view their own profile"
  on public.profiles
  for select
  to authenticated
  using ((select auth.uid()) = id);

-- Drop the grant too, so profiles stops being discoverable in the anon GraphQL
-- schema (database linter 0026) rather than merely returning zero rows.
revoke select on public.profiles from anon;
