import type { Metadata } from 'next';

export interface PreservedUrl {
  old_url: string;
  new_url: string;
  status: string;
  priority: string;
  content_type: string;
  post_id?: string;
  slug?: string;
  meta_title?: string;
  meta_description?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  canonical_url?: string;
  focus_keyword?: string;
}

export interface UrlMigrationMap {
  metadata: { total_urls: number; preserved_count: number };
  url_structure: { wordpress_base: string; nextjs_base: string };
  preserved: PreservedUrl[];
}

let urlMapCache: UrlMigrationMap | null = null;

function loadUrlMap(): UrlMigrationMap {
  if (urlMapCache) return urlMapCache;
  try {
    const path = process.cwd() + '/URL_MIGRATION_MAP.json';
    const fs = require('fs');
    urlMapCache = JSON.parse(fs.readFileSync(path, 'utf-8')) as UrlMigrationMap;
  } catch {
    urlMapCache = {
      metadata: { total_urls: 0, preserved_count: 0 },
      url_structure: { wordpress_base: 'https://vistaneotech.com', nextjs_base: 'https://vistaneotech.com' },
      preserved: [],
    };
  }
  return urlMapCache;
}

export function getBaseUrl(): string {
  return loadUrlMap().url_structure.nextjs_base.replace(/\/$/, '');
}

/** WordPress origin for media (images) – use so embedded content images load correctly */
export function getWordPressBaseUrl(): string {
  return loadUrlMap().url_structure.wordpress_base.replace(/\/$/, '');
}

export function getPageByPath(pathname: string): PreservedUrl | undefined {
  const normalized = pathname === '' || pathname === '/' ? '/' : '/' + pathname.replace(/^\//, '').replace(/\/$/, '');
  const { preserved } = loadUrlMap();
  // First try exact match
  let found = preserved.find((p) => {
    const old = p.old_url.replace(/\/$/, '') || '/';
    return old === normalized;
  });
  // If not found and path starts with /blog/, try without /blog/ prefix (for backward compatibility)
  if (!found && normalized.startsWith('/blog/')) {
    const withoutBlog = normalized.replace('/blog/', '/');
    found = preserved.find((p) => {
      const old = p.old_url.replace(/\/$/, '') || '/';
      return old === withoutBlog;
    });
  }
  return found;
}

export function getAllPreservedUrls(): PreservedUrl[] {
  return loadUrlMap().preserved;
}

export function getSlugsForContentType(type: 'page' | 'post'): string[] {
  const { preserved } = loadUrlMap();
  return preserved
    .filter((p) => p.content_type === type)
    .map((p) => p.old_url.replace(/^\//, '').replace(/\/$/, ''))
    .filter(Boolean);
}

export function buildMetadata(page: PreservedUrl | undefined, defaultTitle: string, defaultDescription: string): Metadata {
  const base = getBaseUrl();
  if (!page) {
    return {
      title: defaultTitle,
      description: defaultDescription,
      openGraph: { title: defaultTitle, description: defaultDescription, url: base },
    };
  }
  const title = (page.meta_title || page.meta_title || defaultTitle).replace(/%%title%%|%%page%%|%%sep%%/g, '').trim() || defaultTitle;
  const description = (page.meta_description || defaultDescription).slice(0, 160);
  const canonical = page.canonical_url || `${base}${page.old_url}`;
  const ogTitle = page.og_title || title;
  const ogDesc = page.og_description || description;
  const ogImage = page.og_image || '';

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title: ogTitle,
      description: ogDesc,
      url: canonical,
      ...(ogImage && { images: [{ url: ogImage }] }),
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: ogDesc,
      ...(ogImage && { images: [ogImage] }),
    },
  };
}
