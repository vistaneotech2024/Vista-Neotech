# Database content not loading (pages + blogs)

Use this when **both** page content and blog content from Supabase are not loading.

**Important:** The `status` column on `pages` and `posts` is an **enum** (`ContentStatus`). The app does **not** filter by `status` in queries; RLS policies (using `status::text`) restrict to published rows. If you add `.in('status', ['published', 'Published'])` in code, Postgres can throw "invalid input value for enum" and break loading.

---

## 1. Check environment variables

The app needs at least:

| Variable | Where to set | Required for |
|----------|----------------|--------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `.env` / `.env.local` (local) or Vercel env (production) | All DB reads |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Same | All DB reads when using anon client |
| `SUPABASE_SERVICE_ROLE_KEY` | Same (do **not** expose to client in production) | Optional: bypasses RLS so content loads even if policies are wrong |

**Check:**

- Local: ensure `.env` or `.env.local` exists in the project root and contains `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (no typos, no extra spaces).
- Production (e.g. Vercel): Project → Settings → Environment Variables. Add both `NEXT_PUBLIC_*` and, if you want server to bypass RLS, `SUPABASE_SERVICE_ROLE_KEY` (server-only).

If either URL or anon key is missing, the Supabase client is never created and **all** DB fetches return empty. You should see in server logs:

`[Supabase] No client: set NEXT_PUBLIC_SUPABASE_URL and ...`

---

## 2. Apply RLS so anon can read published content

If you use only the **anon** key (no service role), Row Level Security must allow SELECT on published rows. Run this **once** in **Supabase Dashboard → SQL Editor** (copy the whole block):

```sql
-- Pages: allow public read of published rows (status is enum ContentStatus; cast to text)
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read published pages" ON pages;
CREATE POLICY "Allow public read published pages" ON pages
  FOR SELECT TO anon, authenticated
  USING (LOWER(TRIM(COALESCE(status::text, ''))) = 'published');

-- Posts: same for blog
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read published posts" ON posts;
CREATE POLICY "Allow public read published posts" ON posts
  FOR SELECT TO anon, authenticated
  USING (LOWER(TRIM(COALESCE(status::text, ''))) = 'published');
```

Or run the project migration file:

**`supabase/migrations/20250222200000_fix_rls_public_read_pages_posts.sql`**

Without these policies, anon requests get **zero rows** from `pages` and `posts`, so pages and blogs stay empty.

---

## 3. Confirm data exists

In Supabase SQL Editor:

```sql
-- status is enum ContentStatus; cast to text for comparison
SELECT 'pages' AS tbl, COUNT(*) AS n FROM pages WHERE LOWER(TRIM(COALESCE(status::text, ''))) = 'published'
UNION ALL
SELECT 'posts', COUNT(*) FROM posts WHERE LOWER(TRIM(COALESCE(status::text, ''))) = 'published';
```

If either count is 0, that table has no published content. Import data (e.g. `node scripts/migrate-to-supabase.js`) and ensure your source has pages/posts with `status = 'published'` (or `'Published'`).

---

## 4. Restart and check logs

- Restart the dev server or redeploy.
- Open a page and a blog URL, then check:
  - **Server logs** (terminal or Vercel function logs): look for `[Supabase]` messages.  
    - “No client” → fix env vars (step 1).  
    - “getPageBySlugFromDB” / “getPostsForBlog” errors → note the message (e.g. permission, column missing).
- If there are no `[Supabase]` errors but content is still empty, RLS or data is the cause: re-run step 2 and/or step 3.

---

## Quick checklist

- [ ] `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` set (local and production).
- [ ] RLS migration applied in Supabase (step 2).
- [ ] At least one row in `pages` and one in `posts` with published status (step 3).
- [ ] App restarted / redeployed; logs checked for `[Supabase]` errors.
