import type { MetadataRoute } from 'next';
import { getPagesForSitemap, getPostsForSitemap } from '@/lib/sitemap-yoast';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [pageEntries, postEntries] = await Promise.all([
    getPagesForSitemap(),
    getPostsForSitemap(),
  ]);

  const toSitemapEntry = (entry: {
    loc: string;
    lastmod?: string | null;
    changefreq?: MetadataRoute.Sitemap[number]['changeFrequency'];
    priority?: number;
  }): MetadataRoute.Sitemap[number] => ({
    url: entry.loc,
    lastModified: entry.lastmod ? new Date(entry.lastmod) : undefined,
    changeFrequency: entry.changefreq,
    priority: entry.priority,
  });

  return [...pageEntries.map(toSitemapEntry), ...postEntries.map(toSitemapEntry)];
}
