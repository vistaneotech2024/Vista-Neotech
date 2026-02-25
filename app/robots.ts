import { getBaseUrl } from '@/lib/url-map';
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const base = getBaseUrl();
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/api/'] },
    sitemap: `${base}/sitemap.xml`,
  };
}
