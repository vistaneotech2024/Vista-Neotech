/**
 * Yoast-style sitemap data and XML builders (no Yoast plugin).
 * Preserves structure: sitemap_index.xml, post-sitemap.xml, page-sitemap.xml,
 * category-sitemap.xml, tag-sitemap.xml. Dynamic lastmod from DB when available.
 */

import { getBaseUrl } from '@/lib/url-map';
import { getAllPreservedUrls } from '@/lib/url-map';
import { createServerSupabase } from '@/lib/supabase-server';

const SITEMAP_NS = 'http://www.sitemaps.org/schemas/sitemap/0.9';

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function toLastmod(d: Date | string | null | undefined): string | null {
  if (!d) return null;
  const date = typeof d === 'string' ? new Date(d) : d;
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 10);
}

export type SitemapUrlEntry = {
  loc: string;
  lastmod?: string | null;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
};

/**
 * Build a sitemap <urlset> XML string.
 */
export function buildUrlsetXml(entries: SitemapUrlEntry[]): string {
  const urlEntries = entries
    .map((e) => {
      const loc = `<loc>${escapeXml(e.loc)}</loc>`;
      const lastmod = e.lastmod ? `\n    <lastmod>${e.lastmod}</lastmod>` : '';
      const changefreq = e.changefreq ? `\n    <changefreq>${e.changefreq}</changefreq>` : '';
      const priority = e.priority != null ? `\n    <priority>${Math.min(1, Math.max(0, e.priority))}</priority>` : '';
      return `  <url>\n    ${loc}${lastmod}${changefreq}${priority}\n  </url>`;
    })
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="${SITEMAP_NS}">\n${urlEntries}\n</urlset>`;
}

/**
 * Build a sitemap index XML string (lists child sitemaps).
 */
export function buildSitemapIndexXml(children: { loc: string; lastmod?: string | null }[]): string {
  const entries = children
    .map((c) => {
      const loc = `<loc>${escapeXml(c.loc)}</loc>`;
      const lastmod = c.lastmod ? `\n    <lastmod>${c.lastmod}</lastmod>` : '';
      return `  <sitemap>\n    ${loc}${lastmod}\n  </sitemap>`;
    })
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="${SITEMAP_NS}">\n${entries}\n</sitemapindex>`;
}

/**
 * Posts for post-sitemap: URL map + Supabase published posts. lastmod = updated_at ?? published_at.
 */
export async function getPostsForSitemap(): Promise<SitemapUrlEntry[]> {
  const base = getBaseUrl();
  const preserved = getAllPreservedUrls().filter((p) => p.content_type === 'post');
  const supabase = createServerSupabase();

  const bySlug = new Map<string, SitemapUrlEntry>();

  for (const p of preserved) {
    const url = p.old_url?.startsWith('/') ? p.old_url : `/${p.old_url || p.slug || ''}`;
    bySlug.set((p.old_url || '').replace(/^\//, ''), {
      loc: base + url,
      lastmod: null,
      changefreq: 'monthly',
      priority: 0.7,
    });
  }

  if (supabase) {
    // RLS restricts to published; do not filter by status (enum ContentStatus) in query.
    const { data: dbPosts } = await supabase
      .from('posts')
      .select('slug, published_at, updated_at');
    if (dbPosts) {
      for (const row of dbPosts as { slug: string; published_at: string | null; updated_at: string | null }[]) {
        const slug = row.slug;
        const lastmod = toLastmod(row.updated_at || row.published_at);
        const url = `/${slug}`;
        const existing = bySlug.get(slug);
        if (existing) {
          existing.lastmod = lastmod ?? existing.lastmod;
        } else {
          bySlug.set(slug, {
            loc: base + url,
            lastmod,
            changefreq: 'monthly',
            priority: 0.7,
          });
        }
      }
    }
  }

  return Array.from(bySlug.values());
}

/**
 * Pages for page-sitemap: homepage, /blog, then URL map pages + Supabase published pages.
 */
export async function getPagesForSitemap(): Promise<SitemapUrlEntry[]> {
  const base = getBaseUrl();
  const preserved = getAllPreservedUrls().filter(
    (p) => p.content_type === 'page' && p.old_url && p.old_url !== '/'
  );
  const supabase = createServerSupabase();

  const entries: SitemapUrlEntry[] = [
    { loc: base + '/', changefreq: 'weekly', priority: 1 },
    { loc: base + '/blog', changefreq: 'weekly', priority: 0.8 },
  ];

  const bySlug = new Map<string, SitemapUrlEntry>();
  for (const p of preserved) {
    const url = p.old_url!.startsWith('/') ? p.old_url : `/${p.old_url}`;
    bySlug.set((p.old_url || '').replace(/^\//, ''), {
      loc: base + url,
      lastmod: null,
      changefreq: 'monthly',
      priority: 0.9,
    });
  }

  if (supabase) {
    // RLS restricts to published; do not filter by status (enum) in query.
    const { data: dbPages } = await supabase
      .from('pages')
      .select('slug, published_at, updated_at')
      .eq('content_type', 'page');
    if (dbPages) {
      for (const row of dbPages as { slug: string; published_at: string | null; updated_at: string | null }[]) {
        const slug = row.slug;
        const lastmod = toLastmod(row.updated_at || row.published_at);
        const url = `/${slug}`;
        const existing = bySlug.get(slug);
        if (existing) {
          existing.lastmod = lastmod ?? existing.lastmod;
        } else {
          bySlug.set(slug, {
            loc: base + url,
            lastmod,
            changefreq: 'monthly',
            priority: 0.9,
          });
        }
      }
    }
  }

  entries.push(...Array.from(bySlug.values()));
  return entries;
}

/**
 * Category URLs for category-sitemap. Structure preserved; no categories in app yet → empty or minimal.
 */
export async function getCategoriesForSitemap(): Promise<SitemapUrlEntry[]> {
  const base = getBaseUrl();
  const entries: SitemapUrlEntry[] = [];
  const supabase = createServerSupabase();
  if (supabase) {
    const { data: cats } = await supabase.from('categories').select('slug, updated_at');
    if (cats && Array.isArray(cats)) {
      for (const c of cats as { slug: string; updated_at: string | null }[]) {
        entries.push({
          loc: `${base}/category/${c.slug}`,
          lastmod: toLastmod(c.updated_at),
          changefreq: 'weekly',
          priority: 0.6,
        });
      }
    }
  }
  return entries;
}

/**
 * Tag URLs for tag-sitemap. Structure preserved; no tags in app yet → empty or minimal.
 */
export async function getTagsForSitemap(): Promise<SitemapUrlEntry[]> {
  const base = getBaseUrl();
  const entries: SitemapUrlEntry[] = [];
  const supabase = createServerSupabase();
  if (supabase) {
    try {
      const { data: tags } = await supabase.from('tags').select('slug, created_at');
      if (tags && Array.isArray(tags)) {
        for (const t of tags as { slug: string; created_at: string | null }[]) {
          entries.push({
            loc: `${base}/tag/${t.slug}`,
            lastmod: toLastmod(t.created_at),
            changefreq: 'weekly',
            priority: 0.5,
          });
        }
      }
    } catch {
      // tags table may not exist
    }
  }
  return entries;
}
