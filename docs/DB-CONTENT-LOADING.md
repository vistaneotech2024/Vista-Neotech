# Database pages and blog not loading

If pages and blog content from Supabase still don’t load after RLS is set up, use one of these:

---

## Option 1: Use the service role key (recommended)

The app prefers the **service role** client for reading `pages` and `posts`. That bypasses RLS so the server can always read published content.

1. In **Supabase Dashboard** go to **Project Settings** → **API**.
2. Copy the **service_role** secret (not the anon key).
3. In your project add to **`.env`** or **`.env.local`**:
   ```env
   SUPABASE_SERVICE_ROLE_KEY="your_service_role_secret_here"
   ```
4. Restart the dev server (`npm run dev`).

**Important:** Keep this key secret and use it only on the server (never expose it in the browser). It is already only used in server-side code (`lib/cms/pages-db.ts`).

---

## Option 2: Rely only on RLS (anon key)

If you don’t set the service role key, the app uses the **anon** key and RLS applies.

1. **Run the RLS policy (case-insensitive)** in the Supabase SQL Editor:
   - See `supabase/migrations/20250222100000_rls_policy_case_insensitive_status.sql`
   - Or run:
   ```sql
   DROP POLICY IF EXISTS "Allow public read published pages" ON pages;
   CREATE POLICY "Allow public read published pages" ON pages
     FOR SELECT TO anon, authenticated
     USING (LOWER(TRIM(COALESCE(status::text, ''))) = 'published');

   DROP POLICY IF EXISTS "Allow public read published posts" ON posts;
   CREATE POLICY "Allow public read published posts" ON posts
     FOR SELECT TO anon, authenticated
     USING (LOWER(TRIM(COALESCE(status::text, ''))) = 'published');
   ```

2. **Check row status:** In Table Editor, ensure the rows you want on the site have **status** = `published` or `Published` (or run the case-insensitive policy above).

---

## Check in development

With `npm run dev`, if the DB call fails you’ll see in the terminal:

- `[pages-db] getPageBySlugFromDB error: ...`
- `[pages-db] getPostsForBlog error: ...`

Use that message to see if the problem is a missing column, RLS, or something else.
