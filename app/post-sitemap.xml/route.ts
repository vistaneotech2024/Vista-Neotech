import { NextResponse } from 'next/server';
import { getPostsForSitemap, buildUrlsetXml } from '@/lib/sitemap-yoast';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

/** Post sitemap: all published posts. lastmod from DB updated_at/published_at. */
export async function GET() {
  const entries = await getPostsForSitemap();
  const xml = buildUrlsetXml(entries);
  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=60, s-maxage=60',
    },
  });
}
