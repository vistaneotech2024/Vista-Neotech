-- Blog categories for admin-managed taxonomy.
-- Fields requested: id, name, is_active.
-- Safe to run multiple times.

create extension if not exists pgcrypto;

create table if not exists public.blog_categories (
  id uuid not null default gen_random_uuid(),
  name text not null,
  is_active boolean not null default true,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint blog_categories_pkey primary key (id),
  constraint blog_categories_name_unique unique (name)
);

create index if not exists idx_blog_categories_active on public.blog_categories using btree (is_active);
create index if not exists idx_blog_categories_name on public.blog_categories using btree (name);

-- Optional RLS: allow public read of active categories (for dropdowns),
-- while still allowing admin/server to manage via service role.
alter table if exists public.blog_categories enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'blog_categories'
      and policyname = 'Public read active blog categories'
  ) then
    create policy "Public read active blog categories"
      on public.blog_categories
      for select
      to anon, authenticated
      using (is_active = true);
  end if;
end $$;

