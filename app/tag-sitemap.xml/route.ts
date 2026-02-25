import { NextResponse } from 'next/server';
import { getTagsForSitemap, buildUrlsetXml } from '@/lib/sitemap-yoast';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

/** Tag sitemap: structure preserved. Empty if no tags table/rows. */
export async function GET() {
  const entries = await getTagsForSitemap();
  const xml = buildUrlsetXml(entries);
  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=60, s-maxage=60',
    },
  });
}
