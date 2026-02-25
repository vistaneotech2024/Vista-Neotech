/**
 * Page and post content from Supabase (CMS).
 * Used by [slug] page for DB-driven content and metadata.
 * Uses React cache() so generateMetadata and page share one DB call per slug.
 * Prefers service-role client when available so reads work even if RLS blocks anon.
 */

import { cache } from 'react';
import { createServerSupabase } from '@/lib/supabase-server';
import { createAdminSupabase } from '@/lib/supabase-admin';

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
      .select('id, slug, title, content, excerpt, status, meta_title, meta_description, published_at')
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
    } as PageFromDB;
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
      .select('id, slug, title, content, excerpt, status, meta_title, meta_description, published_at')
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
    return {
      ...row,
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
  published_at: string | null;
  updated_at: string | null;
};

export async function getPostsForBlog(): Promise<PostListItem[]> {
  try {
    const supabase = getSupabaseForContent();
    if (!supabase) return [];

    // Do not filter by status here: column is enum ContentStatus; RLS already restricts to published.
    const { data, error } = await supabase
      .from('posts')
      .select('slug, title, excerpt, meta_title, meta_description, published_at')
      .order('published_at', { ascending: false });

    if (error) {
      logContentError('getPostsForBlog', error);
      return [];
    }
    if (!data) return [];
    if (process.env.NODE_ENV === 'development') console.info('[Supabase] getPostsForBlog: returned', data.length, 'posts');
    if (data.length === 0 && process.env.NODE_ENV === 'development') {
      console.warn('[Supabase] getPostsForBlog: 0 posts. Ensure RLS policy "Allow public read published posts" is applied (status::text in policy).');
    }
    return data.map((row: Record<string, unknown>) => ({
      slug: row.slug as string,
      title: row.title as string | null,
      excerpt: row.excerpt as string | null,
      meta_title: row.meta_title as string | null,
      meta_description: row.meta_description as string | null,
      published_at: row.published_at as string | null,
      updated_at: null,
    })) as PostListItem[];
  } catch (e) {
    logContentError('getPostsForBlog throw', e);
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

