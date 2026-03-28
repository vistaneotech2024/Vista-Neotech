-- Make RLS policies match status case-insensitively (e.g. 'Published' or 'published').
-- Run this if rows have status like 'Published' and still don't show for anon.

DROP POLICY IF EXISTS "Allow public read published pages" ON pages;
CREATE POLICY "Allow public read published pages" ON pages
  FOR SELECT
  TO anon, authenticated
  USING (LOWER(TRIM(COALESCE(status::text, ''))) = 'published');

DROP POLICY IF EXISTS "Allow public read published posts" ON posts;
CREATE POLICY "Allow public read published posts" ON posts
  FOR SELECT
  TO anon, authenticated
  USING (LOWER(TRIM(COALESCE(status::text, ''))) = 'published');

