/**
 * Wraps WordPress/builder HTML content with modern prose styling.
 * Preserves all existing content and links; improves typography and readability.
 * Strips WordPress shortcodes and block comments so they are not visible on the page.
 * In-content images: relative src rewritten to absolute WordPress URL so they load;
 * loading="lazy" and decoding="async" added for performance.
 */

import { getWordPressBaseUrl } from '@/lib/url-map';

/** Known wrapper shortcodes that only wrap content – we strip the tags and keep inner content. */
const WRAPPER_SHORTCODES = [
  'vc_row', 'vc_column', 'vc_column_inner', 'vc_row_inner', 'vc_column_text',
  'et_pb_section', 'et_pb_row', 'et_pb_column', 'et_pb_module',
  'vc_empty_space', 'vc_raw_html', 'vc_raw_js',
  'tc_cta_box', 'tc_text_style',
];

/**
 * Remove WordPress block comments and shortcodes so they are not shown as text.
 * Preserves all main content: only block comments and self-closing shortcodes are removed;
 * [caption]...[/caption] and known wrapper shortcodes are replaced by their inner content.
 */
function stripWordPressCode(html: string): string {
  let out = html;
  // Strip WordPress block comments (safe)
  out = out.replace(/<!--\s*wp:[\s\S]*?-->/g, '');
  out = out.replace(/<!--\s*\/wp:[\s\S]*?-->/g, '');
  out = out.replace(/<!--\s*more\s*-->/g, '');
  // Replace [caption]...[/caption] with inner content
  for (let i = 0; i < 3; i++) {
    const prev = out;
    out = out.replace(/\[caption\b[^\]]*\]([\s\S]*?)\[\/caption\]/gi, '$1');
    if (out === prev) break;
  }
  // Replace known wrapper shortcodes with inner content only (innermost first by name length desc)
  const wrapperNames = [...WRAPPER_SHORTCODES].sort((a, b) => b.length - a.length);
  for (const name of wrapperNames) {
    const re = new RegExp(`\\[${name}\\b[^\\]]*\\]([\\s\\S]*?)\\[\\/${name}\\]`, 'gi');
    for (let i = 0; i < 5; i++) {
      const prev = out;
      out = out.replace(re, '$1');
      if (out === prev) break;
    }
  }
  // Strip only self-closing shortcodes: [name] or [name attr="value"] (name starts with letter)
  out = out.replace(/\[[a-z][\w-]*(?:\s[^\]]*)?\]/gi, '');
  // Strip any remaining closing shortcode tags so they are never visible (e.g. [/vc_column_text], [/tc_cta_box])
  out = out.replace(/\[\/[\w-]+\]/g, '');
  return out;
}

/** Rewrite relative image URLs to absolute so images load from WordPress */
function rewriteProseImageUrls(html: string): string {
  const base = getWordPressBaseUrl();
  const toFull = (u: string) => {
    const url = u.trim();
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (url.startsWith('//')) return `https:${url}`;
    if (url.startsWith('/')) return `${base}${url}`;
    return `${base}/${url}`;
  };
  return html.replace(
    /<img(\s[\s\S]*?)>/gi,
    (match, rest) => {
      let attrs = rest || '';
      // src="/path" or src='/path' or src = "path" -> full URL
      attrs = attrs.replace(
        /\ssrc\s*=\s*["']([^"']+)["']/gi,
        (_: string, url: string) => ` src="${toFull(url)}"`
      );
      attrs = attrs.replace(
        /\sdata-src\s*=\s*["']([^"']+)["']/gi,
        (_: string, url: string) => ` data-src="${toFull(url)}"`
      );
      attrs = attrs.replace(
        /\ssrcset\s*=\s*["']([^"']+)["']/gi,
        (_: string, set: string) => {
          const parts = set.split(/\s*,/).map((p: string) => {
            const trimmed = p.trim();
            const url = trimmed.split(/\s+/)[0];
            if (!url) return trimmed;
            const rest = trimmed.slice(url.length).trim();
            return rest ? `${toFull(url)} ${rest}` : toFull(url);
          });
          return ` srcset="${parts.join(', ')}"`;
        }
      );
      return `<img${attrs}>`;
    }
  );
}

/** Add lazy loading and decoding to img tags */
function processProseImages(html: string): string {
  const withUrls = rewriteProseImageUrls(html);
  return withUrls.replace(
    /<img(\s[\s\S]*?)>/gi,
    (match, rest) => {
      const attrs = (rest || '').trim();
      if (/loading\s*=/i.test(attrs)) return match;
      if (/decoding\s*=/i.test(attrs)) return match;
      const extra = attrs ? `${attrs} loading="lazy" decoding="async"` : 'loading="lazy" decoding="async"';
      return `<img ${extra}>`;
    }
  );
}

interface ProsePageContentProps {
  html: string | null;
  /** Optional focus keyword to show in a subtle badge */
  focusKeyword?: string | null;
  /** Optional preserved URL note (for non-DB pages) */
  preservedUrl?: string | null;
  className?: string;
}

export function ProsePageContent({
  html,
  focusKeyword,
  preservedUrl,
  className = '',
}: ProsePageContentProps) {
  const processedHtml = html ? processProseImages(stripWordPressCode(html)) : null;
  return (
    <div className={`prose-page max-w-none ${className}`}>
      {processedHtml ? (
        <div dangerouslySetInnerHTML={{ __html: processedHtml }} />
      ) : (
        <p className="text-lg leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
          This page content will be loaded from the CMS or static source. The URL structure has been preserved for SEO.
        </p>
      )}
      {focusKeyword && typeof focusKeyword === 'string' && (
        <div
          className="mt-8 rounded-xl border p-4"
          style={{ backgroundColor: 'var(--color-bg-muted)', borderColor: 'var(--color-border)' }}
        >
          <p className="text-sm font-semibold mb-2" style={{ color: 'var(--color-text)' }}>
            Focus keyword
          </p>
          <p className="text-base" style={{ color: 'var(--color-accent-1)' }}>
            {focusKeyword}
          </p>
        </div>
      )}
      {preservedUrl && typeof preservedUrl === 'string' && (
        <p className="mt-6 text-sm" style={{ color: 'var(--color-text-subtle)' }}>
          <strong>Preserved URL:</strong>{' '}
          <code className="rounded px-2 py-1" style={{ backgroundColor: 'var(--color-bg-muted)' }}>
            {preservedUrl}
          </code>
        </p>
      )}
    </div>
  );
}
