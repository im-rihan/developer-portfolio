-- Run in Supabase → SQL Editor (NOT the Migrations tab)
-- Creates the visits table for portfolio analytics

create table if not exists public.visits (
  id text primary key,
  "countryCode" text not null,
  "countryName" text not null,
  city text not null default '',
  region text not null default '',
  "deviceType" text not null,
  "deviceLabel" text not null,
  browser text not null,
  os text not null,
  page text not null,
  timestamp timestamptz not null default now()
);

alter table public.visits enable row level security;

drop policy if exists "Allow anonymous read" on public.visits;
create policy "Allow anonymous read"
  on public.visits for select
  to anon
  using (true);

drop policy if exists "Allow anonymous insert" on public.visits;
create policy "Allow anonymous insert"
  on public.visits for insert
  to anon
  with check (true);
