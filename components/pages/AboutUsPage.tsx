'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/Button';
import { PageCTA } from '@/components/ui/PageCTA';
import { IconArrowRight } from '@/components/ui/Icons';

export interface AboutUsPageProps {
  title: string;
  description: string | null;
  html: string | null;
  canonicalUrl: string;
  focusKeyword?: string | null;
  preservedUrl?: string | null;
}

/* ─────────────────────────────────────────
   Static data
───────────────────────────────────────── */
const ABOUT_INTERNAL_LINKS = [
  { href: '/contact', title: 'Contact Us', description: 'Get in touch for software, consulting, or support.' },
  { href: '/mlm-software-direct-selling-consultant', title: 'Services Overview', description: 'Software, consultancy, design & digital solutions across sectors.' },
  { href: '/software-development', title: 'Software Development', description: 'Custom web, mobile, and API development.' },
  { href: '/mlm-software', title: 'MLM & Direct Selling Software', description: 'Our expertise: end-to-end direct selling and MLM solutions.' },
  { href: '/direct-selling-consultant-mlm', title: 'Direct Selling Consultant', description: 'Strategy, compensation plans, and compliance advisory.' },
  { href: '/seo-services', title: 'SEO & Digital Marketing', description: 'On-page SEO, SEM, and SMO services.' },
];

const CORE_VALUES = [
  { title: 'Client-first delivery', description: 'We align strategy, execution, and reporting around measurable business outcomes.', icon: '◎' },
  { title: 'Technical excellence', description: 'Our engineering approach emphasizes scalability, security, and maintainability from day one.', icon: '⬡' },
  { title: 'Transparent collaboration', description: 'You get clear timelines, consistent updates, and direct communication with the delivery team.', icon: '⬟' },
];

const DELIVERY_PILLARS = [
  { step: '01', title: 'Discover', description: 'We audit goals, users, and constraints to build a practical execution roadmap.' },
  { step: '02', title: 'Build', description: 'Cross-functional teams deliver software, consulting, and growth services with quality standards.' },
  { step: '03', title: 'Scale', description: 'We optimize performance and support expansion through continuous improvement cycles.' },
];

const STATS = [
  { value: 'Software', label: 'Engineering', accent: 'var(--color-accent-1)' },
  { value: 'Consulting', label: 'Direct selling expertise', accent: 'var(--color-accent-2)' },
  { value: 'Marketing', label: 'SEO and digital growth', accent: 'var(--color-accent-1)' },
  { value: 'Support', label: 'Long-term partnership', accent: 'var(--color-accent-2)' },
];

/* ─────────────────────────────────────────
   Helpers
───────────────────────────────────────── */
function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function extractLegalDocs(html: string | null) {
  if (!html) return [];
  const docs: { href: string; label: string }[] = [];
  const seen = new Set<string>();
  const anchorRegex = /<a\b[^>]*href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  const legalPattern = /(legal|policy|privacy|terms|agreement|compliance|disclaimer|guideline|document)/i;
  let match: RegExpExecArray | null;
  while ((match = anchorRegex.exec(html)) !== null) {
    const href = decodeHtmlEntities((match[1] || '').trim());
    const label = decodeHtmlEntities((match[2] || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() || 'Legal Document');
    const isDoc = /\.(pdf|doc|docx)$/i.test(href) || legalPattern.test(href) || legalPattern.test(label);
    if (!href || !isDoc || seen.has(href)) continue;
    seen.add(href);
    docs.push({ href, label });
  }
  return docs.slice(0, 10);
}

/** Strip HTML tags so DB description renders as clean text in hero */
function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s{2,}/g, ' ').trim();
}

/** Known wrapper shortcodes that only wrap content – strip tags, keep inner content. */
const WRAPPER_SHORTCODES = [
  'vc_row',
  'vc_column',
  'vc_column_inner',
  'vc_row_inner',
  'vc_column_text',
  'et_pb_section',
  'et_pb_row',
  'et_pb_column',
  'et_pb_module',
  'vc_empty_space',
  'vc_raw_html',
  'vc_raw_js',
  'tc_cta_box',
  'tc_text_style',
];

/**
 * Remove WordPress block comments + shortcodes so they don't show as text.
 * Keeps the meaningful HTML content.
 */
function stripWordPressCode(html: string): string {
  let out = html;
  out = out.replace(/<!--\s*wp:[\s\S]*?-->/g, '');
  out = out.replace(/<!--\s*\/wp:[\s\S]*?-->/g, '');
  out = out.replace(/<!--\s*more\s*-->/g, '');

  // Replace [caption]...[/caption] with inner content
  for (let i = 0; i < 3; i++) {
    const prev = out;
    out = out.replace(/\[caption\b[^\]]*\]([\s\S]*?)\[\/caption\]/gi, '$1');
    if (out === prev) break;
  }

  // Replace known wrapper shortcodes with inner content only
  const wrapperNames = [...WRAPPER_SHORTCODES].sort((a, b) => b.length - a.length);
  for (const name of wrapperNames) {
    const re = new RegExp(`\\[${name}\\b[^\\]]*\\]([\\s\\S]*?)\\[\\/${name}\\]`, 'gi');
    for (let i = 0; i < 5; i++) {
      const prev = out;
      out = out.replace(re, '$1');
      if (out === prev) break;
    }
  }

  // Strip self-closing shortcodes: [name] or [name attr="value"]
  out = out.replace(/\[[a-z][\w-]*(?:\s[^\]]*)?\]/gi, '');
  // Strip any remaining closing shortcode tags
  out = out.replace(/\[\/[\w-]+\]/g, '');
  return out;
}

/** Add lazy loading and decoding to img tags (keeps existing attrs). */
function addLazyToImages(html: string): string {
  return html.replace(/<img(\s[\s\S]*?)>/gi, (_match, rest) => {
    const attrs = (rest || '').trim();
    const hasLoading = /loading\s*=/i.test(attrs);
    const hasDecoding = /decoding\s*=/i.test(attrs);
    if (hasLoading && hasDecoding) return `<img${rest}>`;

    const parts: string[] = [attrs].filter(Boolean);
    if (!hasLoading) parts.push('loading="lazy"');
    if (!hasDecoding) parts.push('decoding="async"');
    return `<img ${parts.join(' ')}>`;
  });
}

/**
 * About-us import often begins with a large "hero" image block (e.g. <center><img ...></center>).
 * Remove that opening photo section so the page starts with text, matching the new design.
 */
function removeOpeningPhotoSection(html: string): string {
  let out = html.trimStart();

  // Remove a leading <center>...</center> block containing an image.
  // (Common in migrated WordPress content.)
  out = out.replace(
    /^((?:<p>\s*)*(?:<center>\s*)?<br\s*\/?>\s*)?(<center\b[^>]*>[\s\S]*?<img\b[\s\S]*?<\/center>)(\s*(?:<\/p>\s*)*)/i,
    ''
  );

  // If still starts with an image (possibly wrapped), remove the first <img ...> tag only.
  out = out.replace(/^(?:<p>\s*)*(?:<br\s*\/?>\s*)*(?:<center\b[^>]*>\s*)?<img\b[\s\S]*?>\s*(?:<\/center>\s*)*(?:<\/p>\s*)*/i, '');

  return out.trimStart();
}

/* ─────────────────────────────────────────
   Component
───────────────────────────────────────── */
export function AboutUsPage({ title, description, html, canonicalUrl, focusKeyword, preservedUrl }: AboutUsPageProps) {
  const legalDocs = extractLegalDocs(html);
  const cleanDescription = description ? stripTags(description) : null;
  const processedHtml = html ? removeOpeningPhotoSection(addLazyToImages(stripWordPressCode(html))) : null;
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);

  useEffect(() => {
    if (!lightbox) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null);
    };

    document.addEventListener('keydown', onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [lightbox]);

  const aboutPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: title,
    description: cleanDescription || undefined,
    url: canonicalUrl,
    mainEntity: {
      '@type': 'Organization',
      name: 'Vista Neotech',
      url: canonicalUrl.replace(/\/about-us\/?$/, ''),
      description: cleanDescription || undefined,
    },
  };

  return (
    <>
      {/* ══════════════════════════════════
          GLOBAL STYLES
      ══════════════════════════════════ */}
      <style>{`
        .about-root {
          /* Use global site font tokens so typography matches other pages */
          --font-display: var(--font-primary);
          --font-body:    var(--font-primary);
          --ease-expo:    cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* Grain */
        .hero-grain::after {
          content: ''; position: absolute; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none; z-index: 1;
        }

        /* Marquee */
        @keyframes marquee { 0%{ transform:translateX(0) } 100%{ transform:translateX(-50%) } }
        .marquee-track { display:flex; width:max-content; animation:marquee 28s linear infinite; }
        .marquee-track:hover { animation-play-state:paused; }

        /* Stat card */
        .stat-card { transition:transform .35s var(--ease-expo),box-shadow .35s var(--ease-expo); position:relative; overflow:hidden; }
        .stat-card::before { content:''; position:absolute; inset:0; background:linear-gradient(135deg,var(--color-accent-1-muted),transparent 60%); opacity:0; transition:opacity .3s; }
        .stat-card:hover { transform:translateY(-4px); box-shadow:0 20px 40px -12px rgba(0,0,0,.12); }
        .stat-card:hover::before { opacity:1; }

        /* Value card */
        .value-card { position:relative; overflow:hidden; transition:transform .35s var(--ease-expo),box-shadow .35s var(--ease-expo); }
        .value-card::after { content:''; position:absolute; bottom:0;left:0;right:0; height:3px; background:linear-gradient(90deg,var(--color-accent-1),var(--color-accent-2)); transform:scaleX(0); transform-origin:left; transition:transform .4s var(--ease-expo); }
        .value-card:hover { transform:translateY(-5px); box-shadow:0 24px 48px -16px rgba(0,0,0,.14); }
        .value-card:hover::after { transform:scaleX(1); }
        .value-icon { font-size:2rem; line-height:1; transition:transform .4s var(--ease-expo); }
        .value-card:hover .value-icon { transform:scale(1.2) rotate(15deg); }

        /* Process connector */
        .process-connector { position:absolute; top:28px; left:calc(100% + 8px); width:calc(100% - 16px); height:1px; background:linear-gradient(90deg,var(--color-accent-1),transparent); display:none; }
        @media(min-width:768px){ .process-connector{ display:block; } }

        /* Link card */
        .link-card { transition:transform .3s var(--ease-expo),box-shadow .3s var(--ease-expo); }
        .link-card:hover { transform:translateY(-4px); box-shadow:0 16px 32px -10px rgba(0,0,0,.1); }
        .link-icon-wrap { transition:background .3s,transform .3s var(--ease-expo); }
        .link-card:hover .link-icon-wrap { background-color:var(--color-accent-1)!important; color:white!important; transform:scale(1.08); }
        .link-card:hover .link-title { color:var(--color-accent-1)!important; }

        /* CTA glow */
        .cta-glow { position:relative; }
        .cta-glow::before { content:''; position:absolute; inset:-2px; border-radius:1.75rem; background:linear-gradient(135deg,var(--color-accent-1),var(--color-accent-2),var(--color-accent-1)); background-size:200% 200%; animation:grad-shift 5s ease infinite; z-index:0; }
        .cta-glow > * { position:relative; z-index:1; }
        @keyframes grad-shift { 0%,100%{background-position:0 50%} 50%{background-position:100% 50%} }

        /* Divider */
        .section-divider { height:1px; background:linear-gradient(90deg,transparent,var(--color-accent-1),var(--color-accent-2),transparent); opacity:.4; }

        /* Breadcrumb sep */
        .bc-sep { width:16px; height:1px; background:var(--color-text-muted); opacity:.4; display:inline-block; vertical-align:middle; }

        /* ════════════════════════════════════════
           DB CONTENT CARD
        ════════════════════════════════════════ */
        .db-content-card {
          position: relative;
          background: var(--color-bg-elevated);
          border: 1px solid var(--color-border);
          border-radius: 1.5rem;
          overflow: hidden;
        }
        /* Animated rainbow top stripe */
        .db-content-card::before {
          content: '';
          display: block;
          height: 3px;
          background: linear-gradient(90deg,var(--color-accent-1),var(--color-accent-2),var(--color-accent-1));
          background-size: 200% 100%;
          animation: grad-shift 6s ease infinite;
        }

        /* ── Prose base ── */
        .db-prose {
          font-family: var(--font-body);
          font-size: 1rem;
          line-height: 1.8;
          color: var(--color-text-muted);
        }

        /* ── Headings ── */
        .db-prose h1,.db-prose h2,.db-prose h3,
        .db-prose h4,.db-prose h5,.db-prose h6 {
          font-family: var(--font-display);
          color: var(--color-text);
          letter-spacing: -0.02em;
          line-height: 1.15;
          margin-top: 2.5rem;
          margin-bottom: 0.85rem;
        }
        .db-prose h1 { font-size:clamp(1.7rem,3vw,2.4rem); font-weight:800; }
        .db-prose h2 {
          font-size:clamp(1.35rem,2.2vw,1.9rem); font-weight:700;
          padding-bottom:0.5rem;
          border-bottom:1px solid var(--color-border);
          position:relative;
        }
        .db-prose h2::after {
          content:''; position:absolute; bottom:-1px; left:0;
          width:3rem; height:2px;
          background:var(--color-accent-1); border-radius:2px;
        }
        .db-prose h3 { font-size:clamp(1.1rem,1.7vw,1.4rem); font-weight:700; }
        .db-prose h4 { font-size:1.05rem; font-weight:600; }

        /* ── Paragraphs ── */
        .db-prose p { margin:0 0 1.35rem; }
        .db-prose > p:first-of-type { font-size:1.06rem; color:var(--color-text); }

        /* ── Links ── */
        .db-prose a {
          color:var(--color-accent-1); font-weight:500;
          text-decoration:underline; text-underline-offset:3px;
          text-decoration-thickness:1px; transition:opacity .2s;
        }
        .db-prose a:hover { opacity:.72; }

        /* ── Strong / Em ── */
        .db-prose strong { color:var(--color-text); font-weight:600; }
        .db-prose em { font-style:italic; opacity:.85; }

        /* ── Lists — card style ── */
        .db-prose ul,.db-prose ol {
          margin:0 0 1.35rem; padding:0;
          list-style:none; display:flex; flex-direction:column; gap:0.5rem;
        }
        .db-prose li {
          display:flex; align-items:flex-start; gap:0.65rem;
          padding:0.6rem 0.85rem; border-radius:0.65rem;
          background:var(--color-bg); border:1px solid var(--color-border);
          font-size:0.95rem; line-height:1.65;
          transition:border-color .2s,background .2s;
        }
        .db-prose li:hover { border-color:var(--color-accent-1); background:var(--color-accent-1-muted); }
        /* UL bullet */
        .db-prose ul li::before {
          content:''; flex-shrink:0; width:7px; height:7px;
          border-radius:50%; background:var(--color-accent-1); margin-top:0.48rem;
        }
        /* OL counter */
        .db-prose ol { counter-reset:db-ol; }
        .db-prose ol li { counter-increment:db-ol; }
        .db-prose ol li::before {
          content:counter(db-ol,decimal-leading-zero);
          flex-shrink:0; font-family:var(--font-display);
          font-size:0.75rem; font-weight:700;
          color:var(--color-accent-1); min-width:1.5rem; margin-top:0.1rem;
        }

        /* ── Blockquote ── */
        .db-prose blockquote {
          margin:2rem 0; padding:1.25rem 1.5rem;
          border-left:3px solid var(--color-accent-1);
          border-radius:0 0.75rem 0.75rem 0;
          background:var(--color-accent-1-muted);
          position:relative;
        }
        .db-prose blockquote::before {
          content:'"'; position:absolute; top:-0.5rem; left:1rem;
          font-size:3.5rem; font-family:var(--font-display);
          color:var(--color-accent-1); opacity:.3; line-height:1;
        }
        .db-prose blockquote p { margin:0; font-style:italic; font-size:1.05rem; color:var(--color-text); }

        /* ── Tables ── */
        .db-prose table { width:100%; border-collapse:collapse; margin-bottom:1.5rem; font-size:0.9rem; border-radius:0.75rem; overflow:hidden; border:1px solid var(--color-border); }
        .db-prose thead tr { background:var(--color-accent-1-muted); }
        .db-prose thead th { padding:0.75rem 1rem; text-align:left; font-family:var(--font-display); font-size:0.75rem; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; color:var(--color-accent-1); border-bottom:1px solid var(--color-border); }
        .db-prose tbody tr { border-bottom:1px solid var(--color-border); transition:background .15s; }
        .db-prose tbody tr:last-child { border-bottom:none; }
        .db-prose tbody tr:hover { background:var(--color-bg-muted); }
        .db-prose tbody td { padding:0.7rem 1rem; color:var(--color-text-muted); vertical-align:top; }

        /* ── Code ── */
        .db-prose code { font-family:'Fira Code','Cascadia Code',monospace; font-size:0.85em; background:var(--color-bg-muted); border:1px solid var(--color-border); border-radius:0.35rem; padding:0.15em 0.45em; color:var(--color-accent-2); }
        .db-prose pre { background:var(--color-bg); border:1px solid var(--color-border); border-radius:0.85rem; padding:1.25rem 1.5rem; overflow-x:auto; margin-bottom:1.5rem; }
        .db-prose pre code { background:none; border:none; padding:0; font-size:0.875rem; color:var(--color-text); }

        /* ── Images ── */
        .db-prose img { max-width:100%; height:auto; border-radius:1rem; border:1px solid var(--color-border); margin:1.5rem 0; display:block; cursor: zoom-in; }

        /* Lightbox */
        .about-lightbox-backdrop {
          position: fixed;
          inset: 0;
          z-index: 50;
          background: rgba(0,0,0,0.75);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }
        .about-lightbox-dialog {
          width: min(100%, 1100px);
          max-height: calc(100vh - 48px);
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.14);
          background: rgba(10,10,10,0.85);
          backdrop-filter: blur(10px);
          box-shadow: 0 28px 80px rgba(0,0,0,0.45);
        }
        .about-lightbox-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 10px 12px;
          border-bottom: 1px solid rgba(255,255,255,0.12);
          color: rgba(255,255,255,0.9);
        }
        .about-lightbox-close {
          appearance: none;
          border: 1px solid rgba(255,255,255,0.18);
          background: rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.95);
          border-radius: 999px;
          padding: 8px 12px;
          font-weight: 700;
          font-size: 12px;
          cursor: pointer;
        }
        .about-lightbox-close:hover { background: rgba(255,255,255,0.1); }
        .about-lightbox-body {
          padding: 14px;
          overflow: auto;
          max-height: calc(100vh - 48px - 44px);
        }
        .about-lightbox-body img {
          width: 100%;
          height: auto;
          display: block;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.03);
          cursor: zoom-out;
        }

        /* ── HR ── */
        .db-prose hr { border:none; height:1px; background:linear-gradient(90deg,transparent,var(--color-border),transparent); margin:2.5rem 0; }

        /* ── Mark / focus highlight ── */
        .db-prose mark { background:linear-gradient(120deg,var(--color-accent-1-muted),var(--color-accent-2-muted)); color:var(--color-text); border-radius:0.2em; padding:0.05em 0.25em; }
      `}</style>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'WebPage', name: title, description: cleanDescription || undefined, url: canonicalUrl }) }} />

      <div className="about-root">

        {/* ══════════ HERO ══════════ */}
        <section
          className="hero-grain relative min-h-[64vh] overflow-hidden pt-24 pb-20"
          style={{ backgroundColor: 'var(--color-hero-bg)', color: 'var(--color-hero-text)' }}
        >
          <div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ zIndex: 0 }}>
            <div className="absolute -right-40 -top-40 h-[36rem] w-[36rem] rounded-full blur-[120px] opacity-25" style={{ backgroundColor: 'var(--color-accent-1)' }} />
            <div className="absolute -left-32 bottom-0 h-96 w-96 rounded-full blur-[100px] opacity-20" style={{ backgroundColor: 'var(--color-accent-2)' }} />
          </div>
          <div className="pointer-events-none absolute inset-0 opacity-[0.035]" style={{ backgroundImage: 'linear-gradient(var(--color-hero-text) 1px,transparent 1px),linear-gradient(90deg,var(--color-hero-text) 1px,transparent 1px)', backgroundSize: '80px 80px', zIndex: 0 }} />

          <div className="container-wide relative flex min-h-[52vh] flex-col justify-center" style={{ zIndex: 2 }}>
            <nav className="mb-8 flex items-center gap-3 text-sm" aria-label="Breadcrumb">
              <Link href="/" className="transition-opacity hover:opacity-70" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>Home</Link>
              <span className="bc-sep" />
              <span style={{ color: 'var(--color-hero-text)', fontFamily: 'var(--font-body)', fontWeight: 500 }}>About Us</span>
            </nav>

            <div className="mb-6">
              <span className="inline-flex items-center gap-2.5 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-widest"
                style={{ borderColor: 'var(--color-accent-1)', backgroundColor: 'var(--color-accent-1-muted)', color: 'var(--color-accent-1)', fontFamily: 'var(--font-body)' }}>
                <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ backgroundColor: 'var(--color-accent-1)' }} />
                Vista Neotech
              </span>
            </div>

            {/* ★ DB: title */}
            <h1
              className="display-1 mb-5 max-w-4xl"
              style={{ color: 'var(--color-hero-text)' }}
            >
              {title}
            </h1>

            {/* ★ DB: description */}
            {cleanDescription && (
              <p
                className="prose-lead mb-10 max-w-2xl"
                style={{ color: 'var(--color-hero-text-muted)', opacity: 0.9 }}
              >
                {cleanDescription}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4">
              <Button href="/contact" accent="orange" className="rounded-full px-8 py-4 text-base font-semibold text-white shadow-lg">
                Get in Touch
              </Button>
              <Button href="/mlm-software-direct-selling-consultant" variant="outline-hero" className="rounded-full px-8 py-4 text-base font-semibold">
                View Our Services →
              </Button>
            </div>
          </div>

          <div className="pointer-events-none absolute bottom-10 right-8 hidden rotate-90 select-none text-xs font-semibold uppercase tracking-[0.2em] opacity-20 lg:block"
            style={{ color: 'var(--color-hero-text)', fontFamily: 'var(--font-body)' }}>
            Est. Vista Neotech
          </div>
        </section>

        {/* ══════════ MARQUEE ══════════ */}
        <div className="overflow-hidden border-y py-4" style={{ backgroundColor: 'var(--color-accent-1)', borderColor: 'var(--color-accent-1)' }}>
          <div className="marquee-track select-none">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-center">
                {['Software Engineering','MLM Solutions','Direct Selling','SEO & Marketing','UI/UX Design','Custom APIs','Consulting','Full Support'].map((item) => (
                  <span key={item} className="mx-6 whitespace-nowrap text-sm font-semibold uppercase tracking-widest text-white" style={{ fontFamily: 'var(--font-body)' }}>
                    {item}<span className="mx-6 opacity-40">✦</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* ══════════ STATS ══════════ */}
        <section className="py-14 md:py-16" style={{ backgroundColor: 'var(--color-bg)' }}>
          <div className="container-wide">
            <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
              {STATS.map(({ value, label, accent }) => (
                <div key={value} className="stat-card rounded-2xl border p-6" style={{ backgroundColor: 'var(--color-bg-elevated)', borderColor: 'var(--color-border)' }}>
                  <p className="mb-2 font-bold leading-none" style={{ color: accent, fontFamily: 'var(--font-display)', fontSize: 'clamp(1.1rem,2vw,1.5rem)' }}>{value}</p>
                  <p className="text-sm" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="container-wide"><div className="section-divider" /></div>

        {/* ══════════ CORE VALUES ══════════ */}
        <section className="py-16 md:py-20" style={{ backgroundColor: 'var(--color-bg-muted)' }}>
          <div className="container-wide">
            <div className="mb-12 text-center">
              <p
                className="mb-3 text-xs font-semibold uppercase tracking-[0.18em]"
                style={{ color: 'var(--color-accent-1)', fontFamily: 'var(--font-body)' }}
              >
                What defines us
              </p>
              <h2 className="display-3 mx-auto max-w-3xl" style={{ color: 'var(--color-text)' }}>
                Built on clarity, quality, and long-term partnership
              </h2>
              <p
                className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed"
                style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}
              >
                We combine software engineering, direct selling domain expertise, and growth services to help businesses launch faster and scale with confidence.
              </p>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {CORE_VALUES.map((v, i) => (
                <article key={v.title} className="value-card rounded-2xl border p-7" style={{ backgroundColor: 'var(--color-bg-elevated)', borderColor: 'var(--color-border)' }}>
                  <div className="mb-5 flex items-start justify-between">
                    <span className="value-icon" style={{ color: i % 2 === 0 ? 'var(--color-accent-1)' : 'var(--color-accent-2)' }}>{v.icon}</span>
                    <p className="text-xs font-semibold tabular-nums" style={{ color: 'var(--color-text-subtle)', fontFamily: 'var(--font-body)' }}>0{i + 1}</p>
                  </div>
                  <h3 className="mb-3 font-bold leading-snug" style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', color: 'var(--color-text)' }}>{v.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>{v.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════
            ★★★  DYNAMIC DB CONTENT  ★★★
            Structured: header row · legal bar · two-col layout
        ════════════════════════════════════════════════ */}
        <section className="py-16 md:py-20" style={{ backgroundColor: 'var(--color-bg)' }}>
          <div className="container-wide">

            {/* ── Row 2: Legal Documents — FULL HORIZONTAL BAR ── */}
            {legalDocs.length > 0 && (
              <div
                className="mb-10 overflow-hidden rounded-2xl border"
                style={{ backgroundColor: 'var(--color-bg-elevated)', borderColor: 'var(--color-border)' }}
              >
                {/* Bar header */}
                <div
                  className="flex items-center justify-between border-b px-6 py-4"
                  style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-muted)' }}
                >
                  <div className="flex items-center gap-3">
                    {/* Coloured icon block */}
                    <span
                      className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-sm"
                      style={{ backgroundColor: 'var(--color-accent-1-muted)', color: 'var(--color-accent-1)' }}
                    >
                      ⊞
                    </span>
                    <p
                      className="text-xs font-semibold uppercase tracking-widest"
                      style={{ color: 'var(--color-text)', fontFamily: 'var(--font-body)' }}
                    >
                      Legal Documents
                    </p>
                  </div>
                  <span
                    className="rounded-full px-2.5 py-0.5 text-xs font-bold tabular-nums"
                    style={{
                      backgroundColor: 'var(--color-accent-1-muted)',
                      color: 'var(--color-accent-1)',
                      fontFamily: 'var(--font-display)',
                    }}
                  >
                    {legalDocs.length}
                  </span>
                </div>

                {/* Horizontal scroll row — all chips in one line */}
                <div className="px-6 py-5">
                  <div
                    className="legal-scroll-row"
                    style={{
                      display: 'grid',
                      gridAutoFlow: 'column',
                      gridAutoColumns: 'max-content',
                      gap: '0.625rem',
                      overflowX: 'auto',
                      paddingBottom: '4px',
                      scrollbarWidth: 'none',
                      msOverflowStyle: 'none',
                    }}
                  >
                    {legalDocs.map((doc, idx) => (
                      <a
                        key={doc.href}
                        href={doc.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="legal-chip"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          whiteSpace: 'nowrap',
                          borderRadius: '0.625rem',
                          border: '1px solid var(--color-border)',
                          padding: '0.5rem 1rem',
                          fontSize: '0.85rem',
                          fontWeight: 500,
                          fontFamily: 'var(--font-body)',
                          backgroundColor: 'var(--color-bg)',
                          color: 'var(--color-text)',
                          textDecoration: 'none',
                          transition: 'border-color .2s, background .2s, transform .2s, box-shadow .2s',
                          cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => {
                          const el = e.currentTarget as HTMLAnchorElement;
                          el.style.borderColor = 'var(--color-accent-1)';
                          el.style.backgroundColor = 'var(--color-accent-1-muted)';
                          el.style.transform = 'translateY(-2px)';
                          el.style.boxShadow = '0 6px 16px -4px rgba(0,0,0,0.1)';
                        }}
                        onMouseLeave={(e) => {
                          const el = e.currentTarget as HTMLAnchorElement;
                          el.style.borderColor = 'var(--color-border)';
                          el.style.backgroundColor = 'var(--color-bg)';
                          el.style.transform = 'translateY(0)';
                          el.style.boxShadow = 'none';
                        }}
                      >
                        {/* Index badge */}
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '18px',
                            height: '18px',
                            borderRadius: '4px',
                            backgroundColor: 'var(--color-accent-1)',
                            color: '#fff',
                            fontSize: '0.6rem',
                            fontWeight: 700,
                            fontFamily: 'var(--font-display)',
                            flexShrink: 0,
                          }}
                        >
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        {doc.label}
                        {/* External arrow */}
                        <span style={{ opacity: 0.45, fontSize: '0.75rem' }}>↗</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── Row 3: Main prose ── */}
            {processedHtml && (
              <div
                className="db-content-layout"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr',
                  gap: '1.5rem',
                }}
              >
                {/* ── Main prose card ── */}
                <div className="db-content-card" style={{ minWidth: 0 }}>
                  <div className="px-7 py-10 md:px-10 md:py-12">
                    <div
                      className="db-prose"
                      onClick={(e) => {
                        const target = e.target as HTMLElement | null;
                        if (!target) return;

                        if (target instanceof HTMLImageElement) {
                          const src = target.currentSrc || target.src;
                          if (!src) return;
                          const alt = target.alt || 'Document preview';

                          const parentLink = target.closest('a') as HTMLAnchorElement | null;
                          if (parentLink) e.preventDefault();

                          setLightbox({ src, alt });
                        }
                      }}
                      dangerouslySetInnerHTML={{ __html: processedHtml }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Two-col responsive rule */}
        <style>{`
          .legal-scroll-row::-webkit-scrollbar { display: none; }
        `}</style>

        {/* ══════════ PROCESS ══════════ */}
        <section className="py-16 md:py-20" style={{ backgroundColor: 'var(--color-bg-muted)' }}>
          <div className="container-tight">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: 'var(--color-accent-1)', fontFamily: 'var(--font-body)' }}>How we work</p>
            <h2 className="display-3 mb-12" style={{ color: 'var(--color-text)' }}>
              Structured delivery from idea to scale
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {DELIVERY_PILLARS.map((p, i) => (
                <article key={p.title} className="relative rounded-2xl border p-7" style={{ backgroundColor: 'var(--color-bg-elevated)', borderColor: 'var(--color-border)' }}>
                  <p className="absolute right-6 top-5 select-none text-6xl font-bold leading-none opacity-[0.06]"
                    style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }} aria-hidden>{p.step}</p>
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold"
                    style={{ backgroundColor: i === 1 ? 'var(--color-accent-2-muted)' : 'var(--color-accent-1-muted)', color: i === 1 ? 'var(--color-accent-2)' : 'var(--color-accent-1)', fontFamily: 'var(--font-display)' }}>
                    {p.step}
                  </div>
                  <h3 className="mb-2 font-bold" style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--color-text)' }}>{p.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>{p.description}</p>
                  {i < DELIVERY_PILLARS.length - 1 && <div className="process-connector" />}
                </article>
              ))}
            </div>
          </div>
        </section>

        <div className="container-wide"><div className="section-divider" /></div>

        {/* ══════════ INTERNAL LINKS ══════════ */}
        <section className="py-16 md:py-20" style={{ backgroundColor: 'var(--color-bg)' }}>
          <div className="container-tight">
            <div className="mb-10 text-center">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: 'var(--color-accent-1)', fontFamily: 'var(--font-body)' }}>
                Explore
              </p>
              <h2 className="display-3 mx-auto" style={{ color: 'var(--color-text)' }}>
                Our services & contact
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
                Deep expertise in{' '}
                <Link href="/mlm-software" className="font-semibold underline underline-offset-2">MLM & direct selling</Link>,{' '}
                <Link href="/seo-services" className="underline underline-offset-2">digital marketing</Link>, and{' '}
                <Link href="/software-development" className="underline underline-offset-2">software</Link>.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {ABOUT_INTERNAL_LINKS.map((link) => (
                <Link key={link.href} href={link.href}
                  className="link-card group flex items-start gap-4 rounded-2xl border p-5"
                  style={{ backgroundColor: 'var(--color-bg-elevated)', borderColor: 'var(--color-border)', textDecoration: 'none' }}>
                  <span className="link-icon-wrap flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                    style={{ backgroundColor: 'var(--color-accent-1-muted)', color: 'var(--color-accent-1)' }}>
                    <IconArrowRight size="sm" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="link-title mb-1 font-semibold transition-colors duration-300"
                      style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', color: 'var(--color-text)' }}>
                      {link.title}
                    </h3>
                    <p className="line-clamp-2 text-sm" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>{link.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════ CTA ══════════ */}
        <section className="py-16 md:py-20" style={{ backgroundColor: 'var(--color-bg-muted)' }}>
          <div className="container-tight">
            <div className="cta-glow">
              <div className="relative rounded-3xl p-8 md:p-12 lg:p-14" style={{ backgroundColor: 'var(--color-bg-elevated)' }}>
                <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-[0.03]"
                  style={{ backgroundImage: 'radial-gradient(var(--color-accent-1) 1px,transparent 1px)', backgroundSize: '28px 28px' }} />
                <PageCTA
                  headline="Ready to build, market, or grow with us?"
                  supportingText="Software, digital marketing, design, or direct selling and MLM solutions—we're a full-service IT partner. Get a clear proposal and next steps."
                  primaryLabel="Start a conversation"
                  primaryHref="/contact"
                  secondaryLabel="View all services"
                  secondaryHref="/mlm-software-direct-selling-consultant"
                />
              </div>
            </div>
          </div>
        </section>

        {lightbox && (
          <div
            className="about-lightbox-backdrop"
            role="dialog"
            aria-modal="true"
            aria-label="Document preview"
            onClick={() => setLightbox(null)}
          >
            <div className="about-lightbox-dialog" onClick={(e) => e.stopPropagation()}>
              <div className="about-lightbox-toolbar">
                <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Document preview
                </div>
                <button className="about-lightbox-close" type="button" onClick={() => setLightbox(null)}>
                  Close (Esc)
                </button>
              </div>
              <div className="about-lightbox-body">
                <img src={lightbox.src} alt={lightbox.alt} onClick={() => setLightbox(null)} />
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}