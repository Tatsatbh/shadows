-- Applied to the remote project on 2026-08-03.
--
-- profiles.credits is the paid interview balance, but `anon` and `authenticated`
-- both held UPDATE on the table, and the update policy allowed a user to write
-- their own row. A signed-in user could therefore run
--
--   await supabase.from('profiles').update({ credits: 1000000 }).eq('id', <self>)
--
-- and grant themselves unlimited interviews.
--
-- Note: `REVOKE UPDATE (credits)` is a no-op against a table-level GRANT UPDATE —
-- Postgres cannot subtract a single column from a table-wide grant. The grant has
-- to be dropped and re-issued per column.
--
-- `credits` moves only via the start_session RPC / service role. `id` is the
-- identity and is never user-writable.

revoke update on public.profiles from anon, authenticated;

grant update (updated_at, username, full_name, avatar_url, website)
  on public.profiles to authenticated;
