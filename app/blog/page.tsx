import { getPostsForBlog } from '@/lib/cms/pages-db';
import { getFeaturedImageByPath } from '@/lib/blog-images';
import { getExploreMoreLinks } from '@/lib/internal-links';
import { BlogPostCard } from '@/components/ui/BlogPostCard';
import { RelatedInternalLinks } from '@/components/ui/RelatedInternalLinks';

// Longer cache in dev (local + Supabase) so /blog listing doesn't hit DB on every refresh
export const revalidate = process.env.NODE_ENV === 'development' ? 3600 : 300;

function toSafeText(v: unknown): string {
  if (v == null) return '';
  if (typeof v === 'string') return v;
  if (typeof v === 'number' || typeof v === 'boolean') return String(v);
  return '';
}

export default async function BlogIndexPage() {
  const dbPosts = await getPostsForBlog();
  const posts = dbPosts.map((p) => {
    const slug = toSafeText(p.slug) || '';
    const old_url = `/${slug}`;
    const featured_image_url = getFeaturedImageByPath(slug) ?? undefined;
    return {
      old_url,
      meta_title: toSafeText(p.meta_title ?? p.title) || slug.replace(/-/g, ' ') || 'Post',
      slug,
      meta_description: toSafeText(p.meta_description ?? p.excerpt) || undefined,
      featured_image_url,
    };
  });

  return (
    <div
      className="section-padding relative overflow-hidden"
      style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div
          className="absolute -right-40 -top-40 h-96 w-96 rounded-full blur-3xl animate-float"
          style={{
            backgroundColor: 'var(--color-accent-1-muted)',
            animation: 'float 20s ease-in-out infinite',
          }}
        />
        <div
          className="absolute -left-40 bottom-0 h-96 w-96 rounded-full blur-3xl animate-float"
          style={{
            backgroundColor: 'var(--color-accent-2-muted)',
            animation: 'float 25s ease-in-out infinite',
            animationDelay: '2s',
          }}
        />
      </div>

      <div className="container-tight relative z-10">
        {/* Header */}
        <div className="mb-16 text-center">
          <p className="section-label mb-4">Blog</p>
          <h1 className="display-1 mb-6" style={{ color: 'var(--color-text)' }}>
            Insights & Updates
          </h1>
          <p className="prose-lead mx-auto max-w-2xl" style={{ color: 'var(--color-text-muted)' }}>
            Expert insights, industry trends, and updates on MLM software, direct selling, and network marketing.
          </p>
        </div>

        {/* Blog Posts Grid */}
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg" style={{ color: 'var(--color-text-muted)' }}>
              No blog posts available yet.
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, index) => (
                <BlogPostCard key={post.old_url} post={post} index={index} />
              ))}
            </div>
            <RelatedInternalLinks
              links={getExploreMoreLinks(5)}
              title="Explore More"
              description="Discover our services and get in touch for MLM software, direct selling consultancy, and digital solutions."
              className="mt-16"
            />
          </>
        )}
      </div>
    </div>
  );
}
