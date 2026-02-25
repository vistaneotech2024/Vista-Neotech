# SEO Preservation Audit – Vista Neotech Refinement

**Purpose:** Confirm all SEO elements are preserved during UI/CRO refinement. No URLs, H1s, or ranking content are changed.

---

## ✅ Preserved Elements

### Meta & Canonicals
| Location | What's Preserved |
|---------|------------------|
| `app/layout.tsx` | Default `siteMetadata()` from `lib/seo.ts` – title template, description, OpenGraph, robots |
| `app/(main)/[slug]/page.tsx` | `generateMetadata()` – per-page title, description from DB or `URL_MIGRATION_MAP`, canonical from `buildMetadata()` / DB |
| `lib/url-map.ts` | `buildMetadata()` – canonical_url, meta_title, meta_description, OG/twitter |
| `app/(main)/contact/page.tsx` | Static metadata (title, description) |
| `app/blog/page.tsx` | Uses root layout meta; H1 "Insights & Updates" preserved |

### URL Structure
- **No URL changes.** All routes remain: `/`, `/[slug]`, `/blog`, `/contact`, `/about-us`, etc.
- `next.config.mjs` redirects `/blog/{slug}` → `/{slug}` kept as-is.
- `URL_MIGRATION_MAP.json` and `getBaseUrl()` unchanged.

### Heading Hierarchy
- **Home:** Hero title from CMS (no single H1 in static HTML; hero is H1-equivalent in carousel).
- **Slug pages:** Single `<h1 className="display-1">` with `displayTitle` (from meta_title/title).
- **Blog listing:** H1 "Insights & Updates"; blog posts: H1 = post title.
- **Contact:** H1 preserved as per contact page.
- H2/H3 only added for new sections (e.g. "Related Articles", "Explore our services") – no existing H2/H3 removed.

### Schema & Technical SEO
- **Organization schema:** `lib/seo.ts` `organizationSchema()` injected in root layout as `application/ld+json`.
- **Per-slug:** WebPage or BlogPosting in `[slug]/page.tsx` with headline, description, url, datePublished/author/publisher for posts.
- **Sitemap:** `app/sitemap.ts` – home, /blog, all preserved pages and posts from URL_MIGRATION_MAP.
- **Robots:** `app/robots.ts` – allow `/`, disallow `/api/`, sitemap URL.

### Content & Keywords
- No removal of ranking content or keyword dilution.
- Internal linking additions use keyword-rich anchor text and same URL structure; no new URLs.

### Core Web Vitals
- No heavy new render-blocking scripts.
- Lead popup is lazy-triggered (exit intent / delay / scroll); images already use Next/Image and existing optimization.

---

## Enhancement (Non-Breaking)

- **Internal linking:** Added contextual links (blogs → pages, pages → blogs, home → conversion pages), "Related Articles", "Explore More" – anchor text natural, same domains/URLs.
- **Semantic structure:** Existing sections keep current markup; new sections use proper heading levels (H2 for "Related Articles", etc.).

---

## Don’ts (Strict)

- Do not change URLs.
- Do not change or remove H1s.
- Do not delete ranking content or alter focus keywords in content.
- Do not add aggressive popups that block content or harm readability.
- Do not over-optimize internal links (keep natural density).
