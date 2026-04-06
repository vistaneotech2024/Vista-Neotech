-- Subcategories: one optional parent per row (single level: parent must be root).

alter table public.blog_categories
  add column if not exists parent_id uuid null references public.blog_categories (id) on delete cascade;

create index if not exists idx_blog_categories_parent_id on public.blog_categories using btree (parent_id);

alter table public.blog_categories drop constraint if exists blog_categories_name_unique;

-- Root names unique among roots; child names unique per parent
create unique index if not exists blog_categories_unique_root_name
  on public.blog_categories (name)
  where parent_id is null;

create unique index if not exists blog_categories_unique_child_name
  on public.blog_categories (parent_id, name)
  where parent_id is not null;
