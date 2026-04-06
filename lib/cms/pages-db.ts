/**
 * Page and post content from Supabase (CMS).
 * Used by [slug] page for DB-driven content and metadata.
 * Uses React cache() so generateMetadata and page share one DB call per slug.
 * Prefers service-role client when available so reads work even if RLS blocks anon.
 */

import { cache } from 'react';
import { createServerSupabase } from '@/lib/supabase-server';
import { createAdminSupabase } from '@/lib/supabase-admin';
import { isUuid } from '@/lib/parse-blog-category-id';
import {
  readUuidListFromCustomFields,
  BLOG_CF_CATEGORY_IDS,
  BLOG_CF_SUBCATEGORY_IDS,
} from '@/lib/blog-post-taxonomy';

let _loggedNoClient = false;
let _loggedClientType = false;
/** Prefer service-role so server can read published content; fallback to anon (subject to RLS). */
function getSupabaseForContent() {
  const admin = createAdminSupabase();
  const client = admin ?? createServerSupabase();
  if (!client && !_loggedNoClient) {
    _loggedNoClient = true;
    console.error(
      '[Supabase] No client: set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY (and SUPABASE_SERVICE_ROLE_KEY for server bypass of RLS).'
    );
  }
  if (client && process.env.NODE_ENV === 'development' && !_loggedClientType) {
    _loggedClientType = true;
    console.info('[Supabase] Content client:', admin ? 'service_role (RLS bypassed)' : 'anon (RLS applied)');
  }
  return client;
}

/** Log Supabase/DB errors so production (e.g. Vercel) logs show root cause. */
function logContentError(context: string, error: unknown) {
  const msg = error instanceof Error ? error.message : String(error);
  const details = error && typeof error === 'object' && 'details' in error ? (error as { details?: string }).details : undefined;
  console.error(`[Supabase] ${context}:`, msg, details ?? '');
}

function blogListCategoryDisplayName(
  cf: Record<string, unknown>,
  categoryCol: string | null,
  nameByCategoryId: Map<string, string>,
): string | null {
  const catIds = readUuidListFromCustomFields(cf, BLOG_CF_CATEGORY_IDS);
  const subIds = readUuidListFromCustomFields(cf, BLOG_CF_SUBCATEGORY_IDS);
  const names: string[] = [];
  for (const id of catIds) {
    const n = nameByCategoryId.get(id);
    if (n) names.push(n);
  }
  for (const id of subIds) {
    const n = nameByCategoryId.get(id);
    if (n) names.push(n);
  }
  if (names.length > 0) return names.join(', ');
  const cfCategory = typeof cf.category === 'string' ? cf.category.trim() : '';
  if (cfCategory) return cfCategory;
  if (categoryCol && nameByCategoryId.get(categoryCol)) return nameByCategoryId.get(categoryCol)!;
  return null;
}

/** Single FAQ row from `pages.custom_fields.faq_items` (JSONB). */
export type PageFaqItemField = {
  id?: string | number;
  question?: string;
  answer?: string;
};

/** `pages.custom_fields` JSONB — home FAQ and other CMS fields. */
export type PageCustomFields = {
  faq_enabled?: boolean;
  faq_items?: PageFaqItemField[];
  [key: string]: unknown;
};

export type PageFromDB = {
  id: string;
  slug: string;
  title: string | null;
  content: string | null;
  excerpt: string | null;
  status: string;
  content_type: string;
  meta_title: string | null;
  meta_description: string | null;
  focus_keyword: string | null;
  published_at: string | null;
  updated_at: string | null;
  custom_fields: PageCustomFields | null;
};

export type PostFromDB = {
  id: string;
  slug: string;
  title: string | null;
  content: string | null;
  excerpt: string | null;
  status: string;
  meta_title: string | null;
  meta_description: string | null;
  og_image: string | null;
  image_url?: string | null;
  category_name?: string | null;
  category_slug?: string | null;
  published_at: string | null;
  updated_at: string | null;
};

export type IndustryPageSummary = {
  slug: string;
  title: string | null;
};

/** Cached per request so generateMetadata + page share one call per slug */
export const getPageBySlugFromDB = cache(async (slug: string): Promise<PageFromDB | null> => {
  try {
    const supabase = getSupabaseForContent();
    if (!supabase) return null;

    // Do not filter by status here: column is enum ContentStatus; RLS already restricts to published.
    const { data, error } = await supabase
      .from('pages')
      .select('id, slug, title, content, excerpt, status, meta_title, meta_description, published_at, custom_fields')
      .eq('slug', slug)
      .maybeSingle();

    if (error) {
      logContentError('getPageBySlugFromDB', error);
      return null;
    }
    if (!data) {
      if (process.env.NODE_ENV === 'development') console.warn('[Supabase] getPageBySlugFromDB: no row for slug:', slug);
      return null;
    }
    if (process.env.NODE_ENV === 'development') console.info('[Supabase] page from DB:', slug);
    const row = data as Record<string, unknown>;
    const rawCf = row.custom_fields;
    const custom_fields: PageCustomFields | null =
      rawCf != null && typeof rawCf === 'object' && !Array.isArray(rawCf)
        ? (rawCf as PageCustomFields)
        : null;
    return {
      id: row.id as string,
      slug: row.slug as string,
      title: row.title as string | null,
      content: row.content as string | null,
      excerpt: row.excerpt as string | null,
      status: (row.status as string) || 'published',
      content_type: (row.content_type as string | undefined) || 'page',
      meta_title: row.meta_title as string | null,
      meta_description: row.meta_description as string | null,
      focus_keyword: (row.focus_keyword as string | null | undefined) ?? null,
      published_at: row.published_at as string | null,
      updated_at: null,
      custom_fields,
    };
  } catch (e) {
    logContentError('getPageBySlugFromDB throw', e);
    return null;
  }
});

/** Cached per request so generateMetadata + page share one call per slug */
export const getPostBySlugFromDB = cache(async (slug: string): Promise<PostFromDB | null> => {
  try {
    const supabase = getSupabaseForContent();
    if (!supabase) return null;

    // Do not filter by status here: column is enum ContentStatus; RLS already restricts to published.
    const { data, error } = await supabase
      .from('posts')
      .select(
        'id, slug, title, content, excerpt, status, meta_title, meta_description, og_image, image_url, published_at, custom_fields'
      )
      .eq('slug', slug)
      .maybeSingle();

    if (error) {
      logContentError('getPostBySlugFromDB', error);
      return null;
    }
    if (!data) {
      if (process.env.NODE_ENV === 'development') console.warn('[Supabase] getPostBySlugFromDB: no row for slug:', slug);
      return null;
    }
    if (process.env.NODE_ENV === 'development') console.info('[Supabase] post from DB:', slug);
    const row = data as Record<string, unknown>;
    const cf = (row.custom_fields as any) ?? {};
    const categoryName = typeof cf?.category === 'string' ? cf.category : null;
    return {
      ...row,
      category_name: categoryName,
      category_slug: null,
      updated_at: null,
    } as PostFromDB;
  } catch (e) {
    logContentError('getPostBySlugFromDB throw', e);
    return null;
  }
});

/** For blog listing: metadata only (no content) so /blog loads fast */
export type PostListItem = {
  slug: string;
  title: string | null;
  excerpt: string | null;
  meta_title: string | null;
  meta_description: string | null;
  og_image: string | null;
  image_url?: string | null;
  category_id?: string | null;
  category_name?: string | null;
  category_slug?: string | null;
  published_at: string | null;
  updated_at: string | null;
};

/** `displayName` for subcategories lists assigned categories when present. */
export type BlogCategoryPublic = { id: string; name: string; displayName: string };

/** Active categories + subcategories for public blog filter (RLS on all three tables). */
export const getActiveBlogCategories = cache(async (): Promise<BlogCategoryPublic[]> => {
  try {
    const supabase = getSupabaseForContent();
    if (!supabase) return [];

    const [catsRes, subsRes, linksRes] = await Promise.all([
      supabase.from('blog_categories').select('id, name').eq('is_active', true),
      supabase.from('blog_subcategories').select('id, name').eq('is_active', true),
      supabase.from('blog_category_subcategories').select('category_id, subcategory_id'),
    ]);

    if (catsRes.error) {
      logContentError('getActiveBlogCategories', catsRes.error);
      return [];
    }

    const cats = (catsRes.data ?? []) as Array<{ id: string; name: string }>;
    const out: BlogCategoryPublic[] = cats.map((c) => ({
      id: c.id,
      name: c.name,
      displayName: c.name,
    }));

    if (subsRes.error || linksRes.error) {
      if (subsRes.error) logContentError('getActiveBlogCategories subs', subsRes.error);
      if (linksRes.error) logContentError('getActiveBlogCategories links', linksRes.error);
      out.sort((a, b) => a.displayName.localeCompare(b.displayName));
      return out;
    }

    const subs = (subsRes.data ?? []) as Array<{ id: string; name: string }>;
    const nameByCatId = new Map(cats.map((c) => [c.id, c.name]));
    const subIds = new Set(subs.map((s) => s.id));
    const parentsBySub = new Map<string, string[]>();

    for (const row of linksRes.data ?? []) {
      const cid = row.category_id as string;
      const sid = row.subcategory_id as string;
      if (!subIds.has(sid) || !nameByCatId.has(cid)) continue;
      const list = parentsBySub.get(sid) ?? [];
      list.push(cid);
      parentsBySub.set(sid, list);
    }

    for (const s of subs) {
      const parentNames = (parentsBySub.get(s.id) ?? [])
        .map((id) => nameByCatId.get(id))
        .filter((n): n is string => !!n)
        .sort();
      const displayName = parentNames.length ? `${s.name} (${parentNames.join(', ')})` : s.name;
      out.push({ id: s.id, name: s.name, displayName });
    }

    out.sort((a, b) => a.displayName.localeCompare(b.displayName));
    return out;
  } catch (e) {
    logContentError('getActiveBlogCategories throw', e);
    return [];
  }
});

export type GetPostsForBlogPaginatedOptions = {
  /** Filter by `posts."Category"` (blog_categories.id or blog_subcategories.id). */
  categoryId?: string | null;
};

export async function getPostsForBlogPaginated(
  page: number,
  pageSize: number,
  options?: GetPostsForBlogPaginatedOptions
): Promise<{ posts: PostListItem[]; total: number }> {
  try {
    const supabase = getSupabaseForContent();
    if (!supabase) return { posts: [], total: 0 };

    const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
    const safePageSize = Number.isFinite(pageSize) && pageSize > 0 ? Math.floor(pageSize) : 10;
    const from = (safePage - 1) * safePageSize;
    const to = from + safePageSize - 1;

    const filterCategoryId =
      options?.categoryId && isUuid(options.categoryId) ? options.categoryId : null;

    const categories = await getActiveBlogCategories();
    const nameByCategoryId = new Map(categories.map((c) => [c.id, c.displayName]));

    const mapRowToPost = (row: Record<string, unknown>) => {
      const cf = (row.custom_fields as Record<string, unknown>) ?? {};
      const categoryCol =
        row.post_category != null && typeof row.post_category === 'string'
          ? row.post_category
          : row.Category != null && typeof row.Category === 'string'
            ? row.Category
            : row.category != null && typeof row.category === 'string'
              ? row.category
              : null;
      const category_name = blogListCategoryDisplayName(cf, categoryCol, nameByCategoryId);
      return {
        slug: row.slug as string,
        title: row.title as string | null,
        excerpt: row.excerpt as string | null,
        meta_title: row.meta_title as string | null,
        meta_description: row.meta_description as string | null,
        og_image: row.og_image as string | null,
        category_id: categoryCol,
        category_name,
        category_slug: null,
        published_at: row.published_at as string | null,
        updated_at: null,
      };
    };

    if (filterCategoryId) {
      const countRes = await supabase.rpc('blog_posts_matching_category_count', {
        p_category: filterCategoryId,
      });
      const pageRes = await supabase.rpc('blog_posts_matching_category_page', {
        p_category: filterCategoryId,
        p_limit: safePageSize,
        p_offset: from,
      });
      const rpcOk = !countRes.error && !pageRes.error && pageRes.data != null;
      if (rpcOk) {
        const rows = pageRes.data as Record<string, unknown>[];
        const total = Number(countRes.data ?? 0);
        if (process.env.NODE_ENV === 'development') {
          console.info('[Supabase] getPostsForBlogPaginated (rpc): returned', rows.length, 'posts');
        }
        return {
          total,
          posts: rows.map(mapRowToPost) as PostListItem[],
        };
      }
      logContentError('getPostsForBlogPaginated rpc', countRes.error ?? pageRes.error);
    }

    // Explicit filters are required because service-role bypasses RLS.
    let query = supabase
      .from('posts')
      .select(
        'slug, title, excerpt, meta_title, meta_description, og_image, image_url, published_at, created_at, custom_fields, Category',
        { count: 'exact' }
      )
      .eq('status', 'published');

    if (filterCategoryId) {
      query = query.eq('Category', filterCategoryId);
    }

    const { data, error, count } = await query
      .order('published_at', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      logContentError('getPostsForBlogPaginated', error);
      return { posts: [], total: 0 };
    }
    if (!data) return { posts: [], total: count ?? 0 };
    if (process.env.NODE_ENV === 'development') console.info('[Supabase] getPostsForBlogPaginated: returned', data.length, 'posts');
    if (data.length === 0 && process.env.NODE_ENV === 'development') {
      console.warn('[Supabase] getPostsForBlogPaginated: 0 posts. Ensure RLS policy "Allow public read published posts" is applied (status::text in policy).');
    }
    return {
      total: count ?? 0,
      posts: data.map(mapRowToPost) as PostListItem[],
    };
  } catch (e) {
    logContentError('getPostsForBlogPaginated throw', e);
    return { posts: [], total: 0 };
  }
}

export async function getPostsForBlog(): Promise<PostListItem[]> {
  const result = await getPostsForBlogPaginated(1, 1000);
  return result.posts;
}

/** Latest posts for sidebars/related sections (metadata only). */
export async function getLatestPosts(limit = 10, excludeSlug?: string): Promise<PostListItem[]> {
  try {
    const supabase = getSupabaseForContent();
    if (!supabase) return [];

    const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : 10;
    const fetchLimit = Math.min(50, safeLimit + (excludeSlug ? 1 : 0));

    // Explicit filters are required because service-role bypasses RLS.
    const nameByCategoryId = new Map(
      (await getActiveBlogCategories()).map((c) => [c.id, c.displayName]),
    );

    const { data, error } = await supabase
      .from('posts')
      .select(
        'slug, title, excerpt, meta_title, meta_description, og_image, image_url, published_at, created_at, custom_fields, Category'
      )
      .eq('status', 'published')
      .order('published_at', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false })
      .limit(fetchLimit);

    if (error) {
      logContentError('getLatestPosts', error);
      return [];
    }
    if (!data) return [];

    const mapped: PostListItem[] = data.map((row: Record<string, unknown>) => {
      const cf = (row.custom_fields as Record<string, unknown>) ?? {};
      const categoryCol =
        row.Category != null && typeof row.Category === 'string'
          ? row.Category
          : row.category != null && typeof row.category === 'string'
            ? row.category
            : null;
      const category_name = blogListCategoryDisplayName(cf, categoryCol, nameByCategoryId);
      return {
        slug: row.slug as string,
        title: row.title as string | null,
        excerpt: row.excerpt as string | null,
        meta_title: row.meta_title as string | null,
        meta_description: row.meta_description as string | null,
        og_image: row.og_image as string | null,
        category_name,
        category_slug: null,
        published_at: row.published_at as string | null,
        updated_at: null,
      };
    });

    const filtered = excludeSlug ? mapped.filter((p) => p.slug !== excludeSlug) : mapped;
    return filtered.slice(0, safeLimit);
  } catch (e) {
    logContentError('getLatestPosts throw', e);
    return [];
  }
}

/** Pages marked as industry pages (template = 'industry' or custom_fields.is_industry = true) */
export async function getIndustryPages(): Promise<IndustryPageSummary[]> {
  try {
    const supabase = getSupabaseForContent();
    if (!supabase) return [];

    // Do not filter by status here: column is enum ContentStatus; RLS already restricts to published.
    const { data, error } = await supabase
      .from('pages')
      .select('slug, title, template, custom_fields')
      .or('template.eq.industry,custom_fields->>is_industry.eq.true')
      .order('menu_order', { ascending: true });

    if (error) {
      logContentError('getIndustryPages', error);
      return [];
    }
    if (!data) return [];

    return data.map((row: any) => ({
      slug: typeof row.slug === 'string' ? row.slug : '',
      title: typeof row.title === 'string' ? row.title : (row.title == null ? null : ''),
    })) as IndustryPageSummary[];
  } catch {
    return [];
  }
}

