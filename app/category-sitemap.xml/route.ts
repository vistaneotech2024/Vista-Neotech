import { NextResponse } from 'next/server';
import { getCategoriesForSitemap, buildUrlsetXml } from '@/lib/sitemap-yoast';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

/** Category sitemap: structure preserved. Empty if no categories. */
export async function GET() {
  const entries = await getCategoriesForSitemap();
  const xml = buildUrlsetXml(entries);
  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=60, s-maxage=60',
    },
  });
}
