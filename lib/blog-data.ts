import { getAllPreservedUrls, type PreservedUrl } from './url-map';

export function getBlogPosts(): PreservedUrl[] {
  if (typeof window === 'undefined') {
    // Server-side
    return getAllPreservedUrls().filter((p) => p.content_type === 'post' && p.old_url.startsWith('/blog/'));
  }
  // Client-side - return empty array, will be populated via props
  return [];
}

export function getServicePages(): PreservedUrl[] {
  if (typeof window === 'undefined') {
    // Server-side
    const services = [
      'mlm-software',
      'software-development',
      'direct-selling-consultant-mlm',
      'seo-services',
      'ai-ml-solutions',
      'api-integration',
      'data-analytics',
      'cloud-infrastructure',
      'compliance-security',
    ];
    return getAllPreservedUrls().filter((p) => services.some((s) => p.old_url.includes(s)));
  }
  return [];
}
