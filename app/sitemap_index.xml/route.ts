import { NextResponse } from 'next/server';
import { getBaseUrl } from '@/lib/url-map';
import { buildSitemapIndexXml } from '@/lib/sitemap-yoast';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/** Yoast-style sitemap index: lists post, page, category, tag sitemaps. Structure preserved, no Yoast plugin. */
export async function GET() {
  const base = getBaseUrl();
  const now = new Date().toISOString().slice(0, 10);
  const children = [
    { loc: `${base}/post-sitemap.xml`, lastmod: now },
    { loc: `${base}/page-sitemap.xml`, lastmod: now },
    { loc: `${base}/category-sitemap.xml`, lastmod: now },
    { loc: `${base}/tag-sitemap.xml`, lastmod: now },
  ];
  const xml = buildSitemapIndexXml(children);
  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=60, s-maxage=60',
    },
  });
}
