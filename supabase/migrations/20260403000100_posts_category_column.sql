-- Blog category id on posts (quoted "Category" matches common Supabase naming).
-- Idempotent: safe if the column already exists.

alter table if exists public.posts
  add column if not exists "Category" text null;

comment on column public.posts."Category" is 'UUID of row in blog_categories (text for legacy compatibility).';
