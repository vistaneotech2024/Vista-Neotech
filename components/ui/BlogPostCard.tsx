'use client';

import { IconArrowRight } from './Icons';
import { OptimizedBlogImage } from './OptimizedBlogImage';

/** Compatible with PreservedUrl (static) or DB post */
export type BlogPostCardPost = {
  old_url: string;
  meta_title?: string | null;
  slug?: string | null;
  meta_description?: string | null;
  featured_image_url?: string | null;
  category_name?: string | null;
  category_slug?: string | null;
  /** ISO date string for display (e.g. Mar 17, 2026) */
  published_at?: string | null;
};

interface BlogPostCardProps {
  post: BlogPostCardPost;
}

function formatPostDate(iso: string | null | undefined): string | null {
  if (!iso || typeof iso !== 'string') return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  const title =
    typeof post.meta_title === 'string'
      ? post.meta_title
      : post.slug && typeof post.slug === 'string'
        ? post.slug.replace(/-/g, ' ')
        : 'Blog Post';

  const excerpt =
    typeof post.meta_description === 'string' && post.meta_description.trim()
      ? post.meta_description.trim()
      : null;

  const dateLabel = formatPostDate(post.published_at);
  const categoryLabel = typeof post.category_name === 'string' && post.category_name.trim() ? post.category_name.trim() : null;

  return (
    <a
      href={post.old_url}
      className="group flex h-full min-h-[330px] flex-col overflow-hidden rounded-2xl border bg-[var(--color-bg-elevated)] shadow-sm transition-shadow duration-200 hover:shadow-md"
      style={{ borderColor: 'var(--color-border)' }}
    >
      {/* Featured image — fixed aspect for uniform card height */}
      <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden bg-[var(--color-bg-muted)]">
        <span
          className="absolute left-4 top-3 z-10 text-[10px] font-bold uppercase tracking-[0.22em] text-white drop-shadow"
          style={{ color: 'rgba(255,255,255,0.95)' }}
        >
          BLOG
        </span>
        {post.featured_image_url ? (
          <OptimizedBlogImage
            src={post.featured_image_url}
            alt=""
            quality={82}
            cover
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center px-4 text-center"
            style={{
              background: 'linear-gradient(145deg, #1e3a5f 0%, #0f172a 100%)',
            }}
          >
            {/* Keep layout consistent even if image is missing */}
            <span className="text-xs font-bold uppercase tracking-[0.22em] text-white/90">BLOG</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          {categoryLabel ? (
            <span
              className="inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]"
              style={{ backgroundColor: 'var(--color-accent-1-muted)', color: 'var(--color-accent-1)' }}
            >
              {categoryLabel}
            </span>
          ) : null}
          {dateLabel ? (
            <time
              dateTime={post.published_at ?? undefined}
              className="text-xs font-normal leading-none"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {dateLabel}
            </time>
          ) : null}
        </div>

        <h2
          className="mb-2 line-clamp-2 text-[16px] font-bold leading-6 tracking-tight transition-colors group-hover:text-[var(--color-accent-1)]"
          style={{ color: 'var(--color-text)' }}
        >
          {title}
        </h2>

        {excerpt ? (
          <p
            className="mb-4 line-clamp-3 flex-1 text-xs leading-5"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {excerpt}
          </p>
        ) : (
          <div className="mb-4 flex-1" />
        )}

        <span
          className="mt-auto inline-flex items-center gap-2 text-sm font-semibold"
          style={{ color: 'var(--color-accent-1)' }}
        >
          Read More
          <IconArrowRight size="sm" className="transition-transform duration-200 group-hover:translate-x-0.5" />
        </span>
      </div>
    </a>
  );
}
