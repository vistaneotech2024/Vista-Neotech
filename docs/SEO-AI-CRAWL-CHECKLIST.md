# AI-Readable SEO & Crawl Budget Checklist

---

## AI / LLM compatibility (Phase 4 & 6)

- [x] **Structured summaries:** Blog posts show a visible “Summary” block at the top (meta description) for quick parsing.
- [x] **Schema:** BlogPosting with `datePublished` and `dateModified`; WebPage for non-blog.
- [x] **BreadcrumbList:** JSON-LD on slug pages (Home → [Blog] → Current).
- [x] **Author / Publisher:** Organization “Vista Neotech” in Article/BlogPosting.
- [x] **Organization:** Global organization schema in layout (`lib/seo.ts`).
- [x] **Semantic HTML:** Hero as `<header role="banner">`; blog content in `<article>`; `<section>` and `<nav aria-label="Breadcrumb">` used.
- [ ] **FAQ schema:** Add where applicable (e.g. FAQ pages or blocks); existing helper in `lib/cms/seo-helper.ts` (`generateFAQSchema`).
- [x] **Open Graph & Twitter Cards:** Handled in metadata and `buildMetadata` (url-map); images where available.

---

## Internal linking (Phase 4)

- [x] **2–3 contextual links per blog:** “Related Articles” and “Explore our services” on blog posts; `getRelatedInternalLinks` and `getExploreMoreLinks` in `lib/internal-links.ts`.
- [x] **Service ↔ blog cross-linking:** Service pages link to related services; blog posts link to key service pages via Related Internal Links.
- [x] **Explore More:** Home and blog index use `getExploreMoreLinks()` for priority conversion pages.

---

## Crawl budget & depth (Phase 5)

- **Max 3-click depth:** Important pages (home, services, blog index, key posts) are at most 3 clicks from homepage (home → blog → post; home → service).
- **Thin archives:** Category/tag sitemaps only include existing categories/tags; if you add noindex for low-value tag archives later, do it via `metadata.robots` on those routes.
- **No duplicate sitemaps:** Single index at `sitemap_index.xml`; no duplicate index URLs.
- **Internal anchors:** Prose and CTAs use descriptive anchor text; “Explore our services” and “Related Articles” clusters are in place.

---

## Entity & topic clarity (Phase 6)

- Clear H1 per page (display title).
- Meta title and description on all pages.
- Organization and author (Organization) in schema.
- Modified dates in schema and sitemap for fresher content signals.
