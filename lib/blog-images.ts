/**
 * Blog image helpers: preserve WordPress/SEO image traffic while supporting
 * design elements and fast loading. Uses og_image from URL map and first
 * image from content as fallback so existing ranking images are never lost.
 */

import { getPageByPath, getWordPressBaseUrl } from '@/lib/url-map';

/** Decode common HTML entities in URL so requests work */
function decodeUrl(url: string): string {
  return url
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .trim();
}

/** Turn relative or protocol-relative URL into absolute using WordPress origin */
export function toAbsoluteImageUrl(src: string): string {
  const s = decodeUrl(src.trim());
  if (s.startsWith('http://') || s.startsWith('https://')) return s;
  const normalized = s.replace(/\\/g, '/');

  // Support DB-stored local paths like \public\blog\covers\file.jpg
  if (normalized.startsWith('/public/')) {
    return normalized.slice('/public'.length);
  }
  if (normalized.startsWith('public/')) {
    return `/${normalized.slice('public/'.length)}`;
  }

  // Already a site-relative path (dynamic base handled by browser/Next)
  if (normalized.startsWith('/')) return normalized;

  const base = getWordPressBaseUrl();
  if (normalized.startsWith('//')) return `https:${normalized}`;
  return `${base}/${normalized}`;
}

/** True if URL looks like a real image, not a placeholder */
function isRealImageUrl(url: string): boolean {
  const u = url.trim();
  if (!u) return false;
  if (/^data:image\//i.test(u)) return false;
  if (/placeholder|1x1|pixel|blank|spacer|loading/i.test(u)) return false;
  return true;
}

/** Extract first image URL from any img tag (flexible attribute order and spacing) */
function extractFromImgTag(tag: string): string | null {
  // src= "..." or '...' (allow whitespace around =)
  let m = tag.match(/\ssrc\s*=\s*["']([^"']+)["']/i);
  if (m?.[1] && isRealImageUrl(m[1])) return m[1].trim();
  m = tag.match(/\sdata-src\s*=\s*["']([^"']+)["']/i);
  if (m?.[1] && isRealImageUrl(m[1])) return m[1].trim();
  const srcset = tag.match(/\ssrcset\s*=\s*["']([^"']+)["']/i)?.[1];
  if (srcset) {
    const first = srcset.split(/\s*,/)[0]?.trim().split(/\s+/)[0];
    if (first && isRealImageUrl(first)) return first.trim();
  }
  m = tag.match(/\ssrc\s*=\s*["']([^"']+)["']/i);
  if (m?.[1]) return m[1].trim();
  return null;
}

/** Max chars to scan for first image (avoids slow regex over huge posts) */
const FIRST_IMAGE_SCAN_LIMIT = 50000;

/** Extract first image URL from post/page HTML; accepts relative URLs (normalized to absolute) */
export function getFirstImageFromContent(html: string | null): string | null {
  if (!html || typeof html !== 'string') return null;
  const toScan = html.length > FIRST_IMAGE_SCAN_LIMIT ? html.slice(0, FIRST_IMAGE_SCAN_LIMIT) : html;
  const normalized = toScan.replace(/\s+/g, ' ');

  // 1) First <img ...> tag (any attribute order)
  const imgTagMatch = normalized.match(/<img\s[^>]+>/i);
  if (imgTagMatch?.[0]) {
    const fromTag = extractFromImgTag(imgTagMatch[0]);
    if (fromTag) return toAbsoluteImageUrl(fromTag);
  }

  // 2) background-image: url(...) or url("...")
  const bgMatch = normalized.match(/background-image\s*:\s*url\s*\(\s*["']?([^"')]+)["']?\s*\)/i);
  if (bgMatch?.[1]) {
    const u = bgMatch[1].trim();
    if (u && (u.includes('upload') || /\.(jpe?g|png|webp|gif)(\?|$)/i.test(u)))
      return toAbsoluteImageUrl(u);
  }

  // 3) Any src="..." or src='...' that looks like an image URL (catch malformed tags)
  const srcMatch = normalized.match(/\ssrc\s*=\s*["']([^"']+)["']/gi);
  if (srcMatch) {
    for (const part of srcMatch) {
      const m = part.match(/\ssrc\s*=\s*["']([^"']+)["']/i);
      const url = m?.[1]?.trim();
      if (url && isRealImageUrl(url)) return toAbsoluteImageUrl(url);
    }
  }

  // 4) href to image file (e.g. link wrapping an image)
  const hrefMatch = normalized.match(/href\s*=\s*["']([^"']+\.(?:jpe?g|png|webp|gif)(?:\?[^"']*)?)["']/gi);
  if (hrefMatch?.[0]) {
    const m = hrefMatch[0].match(/href\s*=\s*["']([^"']+)["']/i);
    if (m?.[1]) return toAbsoluteImageUrl(m[1].trim());
  }

  return null;
}

/** Get all image URLs from content (absolute); for optional gallery or design use */
export function getAllImagesFromContent(html: string | null): string[] {
  if (!html || typeof html !== 'string') return [];
  const urls: string[] = [];
  const re = /<img\s[^>]+>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    const fromTag = extractFromImgTag(m[0]);
    if (fromTag) {
      const abs = toAbsoluteImageUrl(fromTag);
      if (!urls.includes(abs)) urls.push(abs);
    }
  }
  return urls;
}

/**
 * Get featured/hero image URL for a blog post: prefers og_image (SEO/social),
 * then first image in content. Same URLs as WordPress so image search traffic is preserved.
 */
export function getFeaturedImageForPost(slug: string, content: string | null): string | null {
  const path = slug.startsWith('/') ? slug : `/${slug}`;
  const page = getPageByPath(path);
  const ogImage = page?.og_image?.trim();
  if (ogImage) return ogImage;
  return getFirstImageFromContent(content);
}

/**
 * Get featured image for a post by path (e.g. from url-map only, no content).
 * Use when content is not available (e.g. blog listing).
 */
export function getFeaturedImageByPath(pathname: string): string | null {
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const page = getPageByPath(path);
  return page?.og_image?.trim() || null;
}
