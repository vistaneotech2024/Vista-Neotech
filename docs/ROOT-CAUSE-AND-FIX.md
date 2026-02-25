# Root Cause & Fix: Supabase Content Not Rendering

**Status:** Diagnosis complete. Follow the checklist below to restore content and keep SEO intact.

---

## 1. Root cause diagnosis

### Most likely: RLS blocking anon reads

- **What happens:** Row Level Security on `pages` and `posts` was allowing SELECT only when `status = 'published'` (exact match). Migrated WordPress data often uses `status = 'Published'` (capital P). With that policy, anon (and thus the server when using the anon key) gets **zero rows** for those records.
- **Result:** `getPageBySlugFromDB` / `getPostBySlugFromDB` / `getPostsForBlog` return `null` or `[]`. The site may still render from `URL_MIGRATION_MAP.json`, but **database content is empty** (no body, no DB-driven metadata).

### Secondary: Service role key not set in production

- **What happens:** `lib/cms/pages-db.ts` uses `createAdminSupabase() ?? createServerSupabase()`. If `SUPABASE_SERVICE_ROLE_KEY` is not set in Vercel (or your host), the app uses only the anon client and is **fully subject to RLS**.
- **Result:** Same as above if RLS is strict. Setting the service role key in production (server-only) bypasses RLS for server-side reads and restores content even before RLS is fixed; fixing RLS is still required for anon (e.g. sitemap, future client use).

### Other checked (and OK)

- **Env:** `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are used correctly in `lib/supabase-server.ts`; no client-side misuse.
- **Data fetch:** All content is fetched **server-side** in App Router (generateMetadata + page component); no client-only fetch, no hydration mismatch from DB.
- **Slug/path:** `[slug]` comes from route params; pathname is passed correctly to `getPageBySlugFromDB(pathname)` / `getPostBySlugFromDB(pathname)`.
- **URL structure:** No change to URLs; WordPress-style `/post-name/` and structure preserved.

---

## 2. Exact failure location

- **RLS:** Policies on `pages` and `posts` that use `USING (status = 'published')` block rows where `status = 'Published'`.
- **Code:** When Supabase returns an error or empty result, `lib/cms/pages-db.ts` previously logged only in development, so production failures were silent (return `null`/`[]`).

---

## 3. Code and config fixes applied

### 3.1 RLS (run in Supabase)

**Ensure the case-insensitive policy is applied.** Use the migration that matches your project:

- **Recommended (idempotent):**  
  `supabase/migrations/20250222200000_fix_rls_public_read_pages_posts.sql`

It:

- Enables RLS on `pages` and `posts`.
- Replaces the SELECT policy with a **case-insensitive** condition:  
  `LOWER(TRIM(COALESCE(status::text, ''))) = 'published'` (use `status::text` when `status` is an enum).

**Apply in production:**

1. Supabase Dashboard → SQL Editor, or  
2. `supabase db push` (or your usual migration path).

After this, anon (and thus the app when using the anon key) can read all published rows regardless of `status` casing.

**If pages load but blog/posts do not:**

1. The same migration above applies to both `pages` and `posts`. Re-run the full migration so the **posts** policy is definitely applied.
2. In Supabase SQL Editor, verify posts exist and RLS:
   - `SELECT id, slug, status FROM posts LIMIT 5;` — you should see rows. If empty, run the WordPress→Supabase posts import (`node scripts/migrate-to-supabase.js` or ensure `wordpress_file/processed/posts.json` or URL_MIGRATION_MAP has `content_type: 'post'` entries).
   - Then run the RLS fix migration again (the block that drops and recreates the policy on `posts`).
3. If you use the **anon** key (no service role in production), the policy name must be exactly `"Allow public read published posts"` and the USING expression must be case-insensitive as in the migration.

### 3.2 App code (already done in repo)

- **`lib/cms/pages-db.ts`**
  - Prefer service-role client when `SUPABASE_SERVICE_ROLE_KEY` is set; otherwise anon (subject to RLS).
  - **Production logging:** All Supabase/DB errors are logged with `[Supabase]` prefix so Vercel (or any server log) shows the exact failure.
  - **Pages mapping:** `content_type` and `focus_keyword` are defaulted in the return object when not present from the row (no schema change required).
- **`lib/sitemap-yoast.ts`**
  - Posts and pages sitemap queries use `.in('status', ['published', 'Published'])` so DB-driven sitemap entries match WordPress-style status.

### 3.3 Environment (Vercel / production)

- **Required (already typical):**
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Strongly recommended for reliable server-side reads:**
  - `SUPABASE_SERVICE_ROLE_KEY` (or `SUPABASE_SERVICE_KEY`)  
  Set in Vercel → Project → Settings → Environment Variables, **only for server** (do not expose to client). This bypasses RLS for server-side CMS reads and avoids dependency on policy details.

---

## 4. Index optimization (optional but recommended)

Run after RLS is fixed:

- **Migration:**  
  `supabase/migrations/20250223000000_index_pages_posts_slug_published.sql`

Adds:

- `idx_pages_slug`, `idx_posts_slug` — fast slug lookups for page/post reads.
- `idx_pages_published_at`, `idx_posts_published_at` — for listing/ordering by `published_at`.

---

## 5. SSR/ISR strategy (no change to URLs)

- **Current (keep):** App Router server components; `revalidate = 300` (5 min ISR) in production for `[slug]` and `/blog`; no client-only fetch for SEO-critical content.
- **Recommendation:** Keep SSR/ISR as is. Do not switch to client-only rendering for pages/posts.

---

## 6. SEO preservation

- **URLs:** No change to WordPress-style structure (`/post-name/`, etc.).
- **Metadata:** title, description, canonical, OG/twitter still driven by DB or URL map.
- **Sitemap:** Dynamic sitemap uses DB when available; status filter fixed so `Published` rows are included.
- **Robots/canonical:** No change.

---

## 7. Deployment checklist

- [ ] Apply RLS migration `20250222200000_fix_rls_public_read_pages_posts.sql` in production Supabase.
- [ ] Set `SUPABASE_SERVICE_ROLE_KEY` (or `SUPABASE_SERVICE_KEY`) in Vercel (server-only).
- [ ] Confirm `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel.
- [ ] Deploy app (existing code with logging + select + sitemap status fix).
- [ ] (Optional) Run index migration `20250223000000_index_pages_posts_slug_published.sql`.
- [ ] Smoke-test: open a known DB-driven page and a post; check Vercel logs for any `[Supabase]` errors.

---

## 8. Rollback plan

- **RLS:** Revert to previous policy only if you must (e.g. restore `status = 'published'`). Prefer normalizing `status` to lowercase in DB and keeping the case-insensitive policy.
- **App:** Revert commits for `lib/cms/pages-db.ts` and `lib/sitemap-yoast.ts`; redeploy. Content will depend again on RLS + env; fix RLS and env first before rolling back code.
- **Env:** Removing `SUPABASE_SERVICE_ROLE_KEY` is safe (app falls back to anon); ensure RLS allows anon read as above.

---

## 9. Hydration & stability

- **No client fetch for content:** The `[slug]` and `/blog` routes are server components; data is fetched in the server tree and sent as props. There is no `useEffect`-based fetch that could conflict with SSR or cause hydration mismatch.
- **Optional:** Add an error boundary (e.g. `error.tsx` in the route segment) to catch render errors and show a fallback without breaking the shell. Log errors to your monitoring so you see any future failures.

## 10. Monitoring

- **Logs:** Search production logs for `[Supabase]` to see any DB/auth errors.
- **Vercel:** Functions/logs for the server routes that render `[slug]` and `/blog`.
- **Supabase:** Dashboard → Logs for API errors and slow queries.

After applying the RLS fix and (optionally) the service role key, database content should render again with WordPress-style SEO URLs preserved and no ranking disruption.
