-- Run in Supabase SQL Editor if pages load but blog/posts do not.
-- This re-applies the posts RLS policy (case-insensitive status) and lets you verify data.

-- 1) Optional: see if posts exist and their status (run separately if you want)
-- SELECT id, slug, status, published_at FROM posts ORDER BY published_at DESC NULLS LAST LIMIT 10;

-- 2) Ensure RLS is enabled on posts
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- 3) Replace policy so both 'published' and 'Published' (and similar) are allowed
DROP POLICY IF EXISTS "Allow public read published posts" ON posts;
CREATE POLICY "Allow public read published posts" ON posts
  FOR SELECT
  TO anon, authenticated
  USING (LOWER(TRIM(COALESCE(status::text, ''))) = 'published');

COMMENT ON POLICY "Allow public read published posts" ON posts IS 'Blog listing and post pages need to read published posts without auth';
