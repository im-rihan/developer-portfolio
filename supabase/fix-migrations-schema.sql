-- Optional: run ONLY if Supabase Dashboard → Database → Migrations shows
-- "relation supabase_migrations.schema_migrations does not exist"
-- Safe to run; does not affect your app.

create schema if not exists supabase_migrations;

create table if not exists supabase_migrations.schema_migrations (
  version text primary key,
  statements text[],
  name text
);
