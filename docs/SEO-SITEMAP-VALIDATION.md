# Sitemap Validation Report & Yoast-Structure Preservation

**Project:** Vista Neotech (Next.js)  
**Requirement:** Yoast-style sitemap structure preserved **without** using Yoast SEO plugin.

---

## 1. Sitemap structure (preserved)

| URL | Purpose | Dynamic |
|-----|---------|--------|
| `/sitemap_index.xml` | Index listing all child sitemaps | Yes |
| `/post-sitemap.xml` | All published blog posts | Yes |
| `/page-sitemap.xml` | Homepage, /blog, all published pages | Yes |
| `/category-sitemap.xml` | Category archive URLs (if any) | Yes |
| `/tag-sitemap.xml` | Tag archive URLs (if any) | Yes |
| `/sitemap.xml` | Legacy flat sitemap (Next.js default) | Yes |

- **No custom static XML override.** All sitemaps are generated at request time.
- **No duplicate sitemap generation.** Index points to the four child sitemaps; `app/sitemap.ts` remains the default Next.js sitemap at `/sitemap.xml` for backward compatibility.
- **Permalink structure unchanged.** Post and page URLs are unchanged (root-level and /blog redirects preserved).

---

## 2. Validation checklist

### 2.1 Availability

- [ ] All sitemap URLs return **HTTP 200** (no 404/500).
- [ ] `sitemap_index.xml` is linked in `robots.txt` (optional; crawlers also discover via `sitemap.xml` or direct link).
- [ ] No caching layer (e.g. CDN) is serving stale sitemap for > 60s; routes use `Cache-Control: public, max-age=60`.

### 2.2 lastmod

- [ ] **Posts:** `lastmod` comes from Supabase `posts.updated_at` or `published_at`; merged with URL map entries.
- [ ] **Pages:** `lastmod` from `pages.updated_at` or `published_at` where available.
- [ ] When content is published/updated, the corresponding sitemap reflects it on next request (within revalidate window, e.g. 60s).

### 2.3 Canonical & orphans

- [ ] Every URL in the sitemaps is a valid, canonical URL on the site (no test/staging URLs in production).
- [ ] No orphan URLs: all listed URLs should resolve (200 or intended redirect).

### 2.4 Caching

- [ ] No long-lived cache on `/sitemap_index.xml`, `/post-sitemap.xml`, `/page-sitemap.xml` that would block updates (e.g. > 5 min).
- [ ] If using ISR/static, ensure sitemap routes use `export const dynamic = 'force-dynamic'` or low `revalidate` (implemented in route handlers).

---

## 3. How to validate

1. **HTTP 200:**  
   `curl -I https://vistaneotech.com/sitemap_index.xml`  
   Same for `post-sitemap.xml`, `page-sitemap.xml`, `category-sitemap.xml`, `tag-sitemap.xml`.

2. **Content:**  
   Open each URL in a browser; confirm XML is valid and `<loc>` URLs match site base URL.

3. **lastmod:**  
   Publish or update a post, then fetch `post-sitemap.xml` and confirm that entry’s `<lastmod>` is updated (within revalidate window).

4. **Orphans:**  
   Spot-check several `<loc>` URLs; each should 200 or redirect as intended.

---

## 4. Files involved

| File | Role |
|------|------|
| `lib/sitemap-yoast.ts` | Data + XML builders for index and urlsets |
| `app/sitemap_index.xml/route.ts` | Serves sitemap index |
| `app/post-sitemap.xml/route.ts` | Post sitemap |
| `app/page-sitemap.xml/route.ts` | Page sitemap |
| `app/category-sitemap.xml/route.ts` | Category sitemap |
| `app/tag-sitemap.xml/route.ts` | Tag sitemap |
| `app/sitemap.ts` | Default Next.js sitemap at `/sitemap.xml` (unchanged) |

---

## 5. Don’ts (confirmed)

- Sitemap URL format not changed (e.g. no new path pattern).
- No custom static sitemap file replacing the dynamic routes.
- No removal of the above structure; no duplicate sitemap index at a different path.
- Permalink structure unchanged.
