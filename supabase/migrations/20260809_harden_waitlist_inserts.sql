-- waitlist is the one table an unauthenticated caller can write to: `anon` holds
-- INSERT and the policy has no WITH CHECK beyond existing, which is what the
-- public landing-page form needs. Two things made that writable surface wider
-- than intended.
--
-- The uniqueness that WaitlistDialog relies on — it catches 23505 and reports
-- "already on the list" — was UNIQUE (email) over raw text, so it is defeated by
-- changing capitalisation. Tatsat@x.com and tatsat@x.com are the same inbox and
-- both used to insert. Uniqueness moves to lower(email); the column keeps
-- whatever case the visitor typed, and the dialog's 23505 handling is unchanged
-- because a unique index raises the same SQLSTATE.
--
-- `email` was also unbounded text with no format check, so the same anonymous
-- endpoint accepted a multi-megabyte string as an address. 254 is the RFC 5321
-- maximum for a forward path.
--
-- Verified before applying against the 43 existing rows: 43 distinct addresses
-- under lower(), longest 28 characters, none malformed, none untrimmed — so
-- every constraint below is satisfied by the current data.
--
-- Note this bounds what a single caller can store, not how often they can call.
-- Volumetric signup flooding from many distinct addresses still needs a rate
-- limit at the edge (Vercel WAF or Supabase network restrictions); Postgres is
-- the wrong layer for that.

alter table public.waitlist drop constraint if exists waitlist_email_key;

create unique index if not exists waitlist_email_lower_key
  on public.waitlist (lower(email));

alter table public.waitlist
  add constraint waitlist_email_length_check
  check (length(email) between 3 and 254);

alter table public.waitlist
  add constraint waitlist_email_format_check
  check (email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$');
