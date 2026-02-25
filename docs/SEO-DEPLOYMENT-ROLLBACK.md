# SEO Deployment Checklist & Rollback

---

## Deployment checklist

### Pre-deploy

- [ ] Run migration `20250221100000_add_bing_submission_logs.sql` in Supabase (if Bing integration is used).
- [ ] Set `BING_WEBMASTER_API_KEY` in production env (optional; if unset, Bing submission is no-op).
- [ ] Confirm `NEXT_PUBLIC_SITE_URL` or `VERCEL_URL` matches production domain (for sitemaps and Bing `siteUrl`).
- [ ] Ensure `URL_MIGRATION_MAP.json` is present and includes all preserved URLs (used by sitemap and URL map).

### Post-deploy

- [ ] **Sitemap index:** Open `https://<production>/sitemap_index.xml` → HTTP 200, valid XML, four child sitemaps listed.
- [ ] **Child sitemaps:** Open `post-sitemap.xml`, `page-sitemap.xml` → HTTP 200, `<loc>` and `<lastmod>` look correct.
- [ ] **Legacy sitemap:** Open `https://<production>/sitemap.xml` → still works (Next.js default).
- [ ] **Bing (if enabled):** Publish or update one post → check `bing_submission_logs` for a new row with `status: 'success'` or `'skipped'`.
- [ ] **Canonicals & robots:** Confirm no change to existing canonicals or `robots.txt` unless intended.

### Optional

- [ ] Submit `https://<production>/sitemap_index.xml` in Bing Webmaster Tools and Google Search Console once.
- [ ] Spot-check one post and one page for BreadcrumbList and Article/WebPage schema (e.g. Rich Results Test).

---

## Rollback (safe steps)

### Sitemap (Yoast-style routes)

- **Revert route handlers:** Remove or revert the route files under `app/sitemap_index.xml/`, `app/post-sitemap.xml/`, `app/page-sitemap.xml/`, `app/category-sitemap.xml/`, `app/tag-sitemap.xml/`.
- **Revert lib:** Restore previous `lib/sitemap-yoast.ts` or remove it if no longer referenced.
- **Result:** Only the default `app/sitemap.ts` (e.g. `/sitemap.xml`) remains. No change to permalinks or content.

### Bing integration

- **Stop triggering:** In `app/api/admin/blog/[id]/route.ts` and `app/api/admin/pages/[id]/route.ts`, remove the `submitUrlToBing(...)` call (and optional `import { submitUrlToBing } from '@/lib/bing-submit'`).
- **Optional:** Remove or comment out `lib/bing-submit.ts`. Table `bing_submission_logs` can remain; it is only written to, not read by critical paths.
- **Result:** Admin save behaviour back to previous; no Bing API calls.

### AI/SEO (Breadcrumb, dateModified, article, summary)

- **Revert slug page:** In `app/(main)/[slug]/page.tsx`, revert:
  - BreadcrumbList script and `breadcrumbSchema`.
  - `dateModified` in structured data.
  - `<header>` back to `<section>` for the hero if desired.
  - Summary block and `<article>` wrapper for blog content.
- **Result:** Same URLs and content; only structured data and semantic markup restored to prior state.

### CMS / DB

- **pages-db:** If you need to roll back `updated_at` usage, remove `updated_at` from selects and from types in `lib/cms/pages-db.ts`. Sitemaps will then omit or fall back to no `lastmod` for DB rows.
- **Migrations:** Do not drop `bing_submission_logs` unless you are sure you will not use logs; rolling back the *code* is enough to stop writes.

---

## Zero ranking disruption

- No URL or permalink changes.
- No removal of existing canonicals or meta.
- Sitemap index is additive (new URLs); existing `/sitemap.xml` unchanged.
- Bing submission is passive (notify only); no change to Google Search Console or indexing logic.
