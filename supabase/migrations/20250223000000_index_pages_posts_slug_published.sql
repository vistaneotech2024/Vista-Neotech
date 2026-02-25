-- Indexes for pages and posts to improve slug lookups and listing performance.
-- Run after RLS is fixed so content loads; these speed up SELECT by slug and ORDER BY published_at.

-- Pages: slug lookup (used by getPageBySlugFromDB and sitemap)
CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages (slug);

-- Pages: ordering by published_at for future listing/sitemap
CREATE INDEX IF NOT EXISTS idx_pages_published_at ON pages (published_at DESC NULLS LAST);

-- Posts: slug lookup (used by getPostBySlugFromDB and sitemap)
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts (slug);

-- Posts: blog listing and sitemap order by published_at
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON posts (published_at DESC NULLS LAST);

COMMENT ON INDEX idx_pages_slug IS 'Fast slug lookup for page reads';
COMMENT ON INDEX idx_posts_slug IS 'Fast slug lookup for post reads';
COMMENT ON INDEX idx_posts_published_at IS 'Blog listing and sitemap ordering';
