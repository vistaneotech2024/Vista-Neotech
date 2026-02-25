-- Allow anonymous read access to published pages and posts so the website can load DB content.
-- Run this if database-driven pages and blog are not loading (RLS was blocking anon SELECT).

-- Pages: allow anyone to SELECT rows where status = 'published'
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read published pages" ON pages;
CREATE POLICY "Allow public read published pages" ON pages
  FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

-- Posts: allow anyone to SELECT rows where status = 'published'
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read published posts" ON posts;
CREATE POLICY "Allow public read published posts" ON posts
  FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

COMMENT ON POLICY "Allow public read published pages" ON pages IS 'Website needs to read published pages without auth';
COMMENT ON POLICY "Allow public read published posts" ON posts IS 'Website needs to read published posts for /blog and slug pages';
