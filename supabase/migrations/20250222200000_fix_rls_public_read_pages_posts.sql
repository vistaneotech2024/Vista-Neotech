-- One-shot fix: allow public (anon) to read published pages and posts.
-- Run this in Supabase SQL Editor if pages/posts/blogs from DB are not loading.
-- Status is matched case-insensitively. Cast to text so enum ContentStatus accepts the expression.

-- Pages
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read published pages" ON pages;
CREATE POLICY "Allow public read published pages" ON pages
  FOR SELECT
  TO anon, authenticated
  USING (LOWER(TRIM(COALESCE(status::text, ''))) = 'published');

-- Posts
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read published posts" ON posts;
CREATE POLICY "Allow public read published posts" ON posts
  FOR SELECT
  TO anon, authenticated
  USING (LOWER(TRIM(COALESCE(status::text, ''))) = 'published');
