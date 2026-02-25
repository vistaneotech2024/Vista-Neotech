import { NextResponse } from 'next/server';
import { getPagesForSitemap, buildUrlsetXml } from '@/lib/sitemap-yoast';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

/** Page sitemap: homepage, /blog, all published pages. lastmod from DB when available. */
export async function GET() {
  const entries = await getPagesForSitemap();
  const xml = buildUrlsetXml(entries);
  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=60, s-maxage=60',
    },
  });
}
