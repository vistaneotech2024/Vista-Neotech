import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getActiveBlogCategories, getPostsForBlogPaginated } from '@/lib/cms/pages-db';
import { getFeaturedImageByPath, toAbsoluteImageUrl } from '@/lib/blog-images';
import { BlogPostCard } from '@/components/ui/BlogPostCard';
import { isUuid } from '@/lib/parse-blog-category-id';

export const dynamic = 'force-dynamic';
// Keep blog dynamic in dev so pagination/searchParams are always fresh.
export const revalidate = process.env.NODE_ENV === 'development' ? 0 : 300;
const PAGE_SIZE = 10;

function toSafeText(v: unknown): string {
  if (v == null) return '';
  if (typeof v === 'string') return v;
  if (typeof v === 'number' || typeof v === 'boolean') return String(v);
  return '';
}

function normalizePostSlug(raw: string): string {
  const cleaned = raw.trim().replace(/^\/+|\/+$/g, '');
  if (!cleaned) return '';
  if (cleaned.startsWith('blog/')) return cleaned.slice('blog/'.length);
  return cleaned;
}

function toPostHref(slug: string): string {
  const encoded = slug
    .split('/')
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join('/');
  return `/${encoded}`;
}

function blogListPath(page: number, categoryId?: string): string {
  const params = new URLSearchParams();
  if (categoryId) params.set('category', categoryId);
  if (page > 1) params.set('page', String(page));
  const q = params.toString();
  return q ? `/blog?${q}` : '/blog';
}

function buildPaginationItems(currentPage: number, totalPages: number): Array<number | '...'> {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, '...', totalPages];
  }

  if (currentPage >= totalPages - 3) {
    return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
}

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams?: { page?: string; category?: string };
}) {
  const rawPage = searchParams?.page;
  const parsedPage = Number.parseInt(rawPage ?? '1', 10);
  const page = Number.isNaN(parsedPage) || parsedPage < 1 ? 1 : parsedPage;

  const rawCategory = typeof searchParams?.category === 'string' ? searchParams.category.trim() : '';
  const categoryFilter = rawCategory && isUuid(rawCategory) ? rawCategory : undefined;

  const [categories, { posts: dbPosts, total }] = await Promise.all([
    getActiveBlogCategories(),
    getPostsForBlogPaginated(page, PAGE_SIZE, { categoryId: categoryFilter }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  if (total > 0 && page > totalPages) {
    redirect(blogListPath(totalPages, categoryFilter));
  }
  const posts = dbPosts
    .slice(0, PAGE_SIZE)
    .map((p) => {
    const slug = normalizePostSlug(toSafeText(p.slug));
    if (!slug) return null;
    const old_url = toPostHref(slug);
    const dbImg = toSafeText((p as any).image_url);
    const dbOg = toSafeText(p.og_image);
    const featured_image_url = dbOg
      ? toAbsoluteImageUrl(dbOg) || undefined
      : dbImg
        ? toAbsoluteImageUrl(dbImg) || dbImg || undefined
      : getFeaturedImageByPath(slug) || undefined;
    return {
      old_url,
      meta_title: toSafeText(p.meta_title ?? p.title) || slug.replace(/-/g, ' ') || 'Post',
      slug,
      meta_description: toSafeText(p.meta_description ?? p.excerpt) || undefined,
      featured_image_url,
      category_name: toSafeText((p as any).category_name) || undefined,
      category_slug: toSafeText((p as any).category_slug) || undefined,
      published_at: p.published_at ?? null,
    };
  })
    .filter((post): post is NonNullable<typeof post> => post !== null);
  const hasPrev = page > 1;
  const hasNext = page < totalPages;
  const prevPage = page - 1;
  const nextPage = page + 1;
  const paginationItems = buildPaginationItems(page, totalPages);

  return (
    <div
      className="section-padding relative overflow-hidden"
      style={{ backgroundColor: 'var(--color-bg-muted)', color: 'var(--color-text)' }}
    >
      <div className="container-wide relative z-10">
        {/* Header — compact so the grid owns the fold */}
        <div className="mb-8 text-center md:mb-10">
          <p className="section-label mb-2">Blog</p>
          <h1 className="display-3 mb-3" style={{ color: 'var(--color-text)' }}>
            Insights & Updates
          </h1>
          <p
            className="mx-auto max-w-xl text-sm leading-relaxed md:text-base"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Expert insights, industry trends, and updates on MLM software, direct selling, and network marketing.
          </p>
        </div>

        {categories.length > 0 ? (
          <div
            className="mb-8 flex flex-wrap items-center justify-center gap-2 md:mb-10"
            role="navigation"
            aria-label="Filter by category"
          >
            <Link
              href={blogListPath(1)}
              className="rounded-full border px-3.5 py-1.5 text-sm font-semibold transition hover:opacity-90"
              style={{
                borderColor: !categoryFilter ? 'var(--color-accent-1)' : 'var(--color-border)',
                backgroundColor: !categoryFilter ? 'var(--color-accent-1-muted)' : 'transparent',
                color: !categoryFilter ? 'var(--color-accent-1)' : 'var(--color-text)',
              }}
            >
              All
            </Link>
            {categories.map((c) => {
              const active = categoryFilter === c.id;
              return (
                <Link
                  key={c.id}
                  href={blogListPath(1, c.id)}
                  className="rounded-full border px-3.5 py-1.5 text-sm font-semibold transition hover:opacity-90"
                  style={{
                    borderColor: active ? 'var(--color-accent-1)' : 'var(--color-border)',
                    backgroundColor: active ? 'var(--color-accent-1-muted)' : 'transparent',
                    color: active ? 'var(--color-accent-1)' : 'var(--color-text)',
                  }}
                >
                  {c.name}
                </Link>
              );
            })}
          </div>
        ) : null}

        {/* Blog Posts Grid — reference: 4 columns desktop, white cards on light gray */}
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg" style={{ color: 'var(--color-text-muted)' }}>
              {categoryFilter
                ? 'No posts in this category yet.'
                : 'No blog posts available yet.'}
            </p>
          </div>
        ) : (
          <>
            <div className="grid auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2">
              {posts.map((post) => (
                <BlogPostCard key={post.old_url} post={post} />
              ))}
            </div>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
              {hasPrev ? (
                <Link
                  href={blogListPath(prevPage, categoryFilter)}
                  className="rounded-full border px-4 py-2 text-sm font-semibold transition hover:opacity-90"
                  style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                >
                  Previous
                </Link>
              ) : (
                <span
                  className="rounded-full border px-4 py-2 text-sm font-semibold opacity-50"
                  style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                >
                  Previous
                </span>
              )}
              <span className="text-sm font-medium" style={{ color: 'var(--color-text-muted)' }}>
                Page {page} of {totalPages}
              </span>
              {hasNext ? (
                <Link
                  href={blogListPath(nextPage, categoryFilter)}
                  className="rounded-full border px-4 py-2 text-sm font-semibold transition hover:opacity-90"
                  style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                >
                  Next
                </Link>
              ) : (
                <span
                  className="rounded-full border px-4 py-2 text-sm font-semibold opacity-50"
                  style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                >
                  Next
                </span>
              )}
            </div>
            {totalPages > 1 && (
              <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                {paginationItems.map((item, index) => {
                  if (item === '...') {
                    return (
                      <span
                        key={`ellipsis-${index}`}
                        className="px-2 py-1 text-sm"
                        style={{ color: 'var(--color-text-muted)' }}
                      >
                        ...
                      </span>
                    );
                  }

                  const isActive = item === page;
                  return isActive ? (
                    <span
                      key={`page-${item}`}
                      className="rounded-full border px-3 py-1.5 text-sm font-semibold"
                      style={{
                        borderColor: 'var(--color-accent-1)',
                        backgroundColor: 'var(--color-accent-1-muted)',
                        color: 'var(--color-accent-1)',
                      }}
                    >
                      {item}
                    </span>
                  ) : (
                    <Link
                      key={`page-${item}`}
                      href={blogListPath(item, categoryFilter)}
                      className="rounded-full border px-3 py-1.5 text-sm font-semibold transition hover:opacity-90"
                      style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                    >
                      {item}
                    </Link>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
