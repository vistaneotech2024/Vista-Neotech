-- Standalone subcategories + many-to-many assignment to categories.
-- Migrates rows where blog_categories.parent_id was set (preserves ids for posts."Category").

create table if not exists public.blog_subcategories (
  id uuid not null default gen_random_uuid(),
  name text not null,
  is_active boolean not null default true,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint blog_subcategories_pkey primary key (id)
);

create index if not exists idx_blog_subcategories_active on public.blog_subcategories using btree (is_active);
create index if not exists idx_blog_subcategories_name on public.blog_subcategories using btree (name);

create table if not exists public.blog_category_subcategories (
  category_id uuid not null references public.blog_categories (id) on delete cascade,
  subcategory_id uuid not null references public.blog_subcategories (id) on delete cascade,
  constraint blog_category_subcategories_pkey primary key (category_id, subcategory_id)
);

create index if not exists idx_blog_category_subcategories_sub on public.blog_category_subcategories using btree (subcategory_id);

alter table if exists public.blog_subcategories enable row level security;
alter table if exists public.blog_category_subcategories enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'blog_subcategories'
      and policyname = 'Public read active blog subcategories'
  ) then
    create policy "Public read active blog subcategories"
      on public.blog_subcategories
      for select
      to anon, authenticated
      using (is_active = true);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'blog_category_subcategories'
      and policyname = 'Public read blog category subcategory links'
  ) then
    create policy "Public read blog category subcategory links"
      on public.blog_category_subcategories
      for select
      to anon, authenticated
      using (
        exists (
          select 1 from public.blog_categories c
          where c.id = category_id and c.is_active = true
        )
        and exists (
          select 1 from public.blog_subcategories s
          where s.id = subcategory_id and s.is_active = true
        )
      );
  end if;
end $$;

-- Migrate legacy parent_id rows into blog_subcategories + junction (same UUIDs).
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'blog_categories'
      and column_name = 'parent_id'
  ) then
    insert into public.blog_subcategories (id, name, is_active, created_at, updated_at)
    select id, name, is_active, created_at, updated_at
    from public.blog_categories
    where parent_id is not null
    on conflict (id) do nothing;

    insert into public.blog_category_subcategories (category_id, subcategory_id)
    select parent_id, id
    from public.blog_categories
    where parent_id is not null
    on conflict (category_id, subcategory_id) do nothing;

    delete from public.blog_categories where parent_id is not null;

    alter table public.blog_categories drop column parent_id;
  end if;
end $$;

drop index if exists public.blog_categories_unique_root_name;
drop index if exists public.blog_categories_unique_child_name;
drop index if exists public.idx_blog_categories_parent_id;

alter table public.blog_categories drop constraint if exists blog_categories_name_unique;

create unique index if not exists blog_categories_name_unique_idx on public.blog_categories (name);
