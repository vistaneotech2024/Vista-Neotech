# Database content not loading (pages / posts / blog)

If **pages**, **posts**, or **blog** content from the database stop loading after an update (blank body, empty blog list, or 404s that used to work), do the following.

## 1. Use the service role key (recommended)

The app reads content with the **service role** client when the key is set, so **RLS does not apply** and content always loads.

In your environment (e.g. `.env` or Vercel), set:

- `SUPABASE_SERVICE_ROLE_KEY` (or `SUPABASE_SERVICE_KEY`)

You can copy the **service_role** key from: Supabase Dashboard → Project Settings → API → `service_role` (secret).  
Do **not** expose it in the browser; use it only on the server (Next.js API and server components already run on the server).

## 2. If you cannot use the service role key: fix RLS

When the service role key is **not** set, the app uses the **anon** key to read from Supabase. Then **Row Level Security (RLS)** applies. If RLS is enabled but policies are wrong or case-sensitive, reads return no rows and content looks “not loading”.

**Fix:** run this SQL once in the Supabase SQL Editor (Dashboard → SQL Editor → New query):

```sql
-- Allow public read for published pages and posts (status case-insensitive)

ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read published pages" ON pages;
CREATE POLICY "Allow public read published pages" ON pages
  FOR SELECT TO anon, authenticated
  USING (LOWER(TRIM(COALESCE(status::text, ''))) = 'published');

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read published posts" ON posts;
CREATE POLICY "Allow public read published posts" ON posts
  FOR SELECT TO anon, authenticated
  USING (LOWER(TRIM(COALESCE(status::text, ''))) = 'published');
```

Or run the migration file:

`supabase/migrations/20250222200000_fix_rls_public_read_pages_posts.sql`

After this, anon users can read rows where `status` is `'published'` or `'Published'`.

## 3. Check env and redeploy

- Confirm **Supabase** env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and (if possible) `SUPABASE_SERVICE_ROLE_KEY`.
- Redeploy or restart the dev server so the app picks up the correct client (service role vs anon) and RLS behavior.

Summary: set **service role key** so DB content loads without RLS; otherwise, run the **RLS policy SQL** above so anon can read published pages and posts.
