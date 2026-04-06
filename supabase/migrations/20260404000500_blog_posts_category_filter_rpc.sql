-- Paginated blog list when filtering by category or subcategory id (includes custom_fields taxonomy arrays).

create or replace function public.blog_posts_matching_category_count(p_category text)
returns bigint
language sql
stable
security invoker
set search_path = public
as $$
  select count(*)::bigint
  from public.posts p
  where lower(trim(coalesce(p.status::text, ''))) = 'published'
    and (
      p_category is null
      or btrim(p_category) = ''
      or p."Category" is not distinct from p_category
      or coalesce(p.custom_fields->'blog_category_ids', '[]'::jsonb) @> jsonb_build_array(p_category)
      or coalesce(p.custom_fields->'blog_subcategory_ids', '[]'::jsonb) @> jsonb_build_array(p_category)
    );
$$;

create or replace function public.blog_posts_matching_category_page(
  p_category text,
  p_limit int default 10,
  p_offset int default 0
)
returns table (
  slug text,
  title text,
  excerpt text,
  meta_title text,
  meta_description text,
  og_image text,
  image_url text,
  published_at timestamptz,
  created_at timestamptz,
  custom_fields jsonb,
  post_category text
)
language sql
stable
security invoker
set search_path = public
as $$
  select
    p.slug::text,
    p.title::text,
    p.excerpt::text,
    p.meta_title::text,
    p.meta_description::text,
    p.og_image::text,
    p.image_url::text,
    p.published_at,
    p.created_at,
    p.custom_fields,
    p."Category"::text as post_category
  from public.posts p
  where lower(trim(coalesce(p.status::text, ''))) = 'published'
    and (
      p_category is null
      or btrim(p_category) = ''
      or p."Category" is not distinct from p_category
      or coalesce(p.custom_fields->'blog_category_ids', '[]'::jsonb) @> jsonb_build_array(p_category)
      or coalesce(p.custom_fields->'blog_subcategory_ids', '[]'::jsonb) @> jsonb_build_array(p_category)
    )
  order by p.published_at desc nulls last, p.created_at desc
  limit p_limit
  offset p_offset;
$$;

grant execute on function public.blog_posts_matching_category_count(text) to anon, authenticated, service_role;
grant execute on function public.blog_posts_matching_category_page(text, int, int) to anon, authenticated, service_role;
