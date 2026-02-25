'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { IconArrowRight } from './Icons';
import { OptimizedBlogImage } from './OptimizedBlogImage';

/** Compatible with PreservedUrl (static) or DB post (old_url = /slug, meta_title, slug, meta_description) */
export type BlogPostCardPost = {
  old_url: string;
  meta_title?: string | null;
  slug?: string | null;
  meta_description?: string | null;
  /** Featured/og image URL – from DB or url-map; same as WordPress for image SEO */
  featured_image_url?: string | null;
};

interface BlogPostCardProps {
  post: BlogPostCardPost;
  index: number;
}

export function BlogPostCard({ post, index }: BlogPostCardProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, index * 50);
    return () => clearTimeout(timer);
  }, [index]);

  const title = typeof post.meta_title === 'string' ? post.meta_title : (post.slug && typeof post.slug === 'string' ? post.slug.replace(/-/g, ' ') : 'Blog Post');

  return (
    <Link
      href={post.old_url}
      className="group relative block overflow-hidden rounded-3xl border transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
      style={{
        backgroundColor: 'var(--color-bg-elevated)',
        borderColor: 'var(--color-border)',
        opacity: 1,
        transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.98)',
        transitionDelay: `${index * 50}ms`,
      }}
    >
      {/* Featured image as design element – fast loading, preserves ranking URL */}
      {post.featured_image_url && (
        <div className="relative h-48 w-full overflow-hidden rounded-t-3xl">
          <OptimizedBlogImage
            src={post.featured_image_url}
            alt=""
            quality={82}
            cover
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
          />
        </div>
      )}

      {/* Gradient background on hover */}
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `linear-gradient(135deg, var(--color-accent-1-muted) 0%, transparent 70%)`,
        }}
      />

      {/* Content */}
      <div className={`relative z-10 p-8 ${post.featured_image_url ? '' : ''}`}>
        {/* Category badge */}
        <span
          className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold mb-4"
          style={{
            backgroundColor: 'var(--color-accent-1-muted)',
            color: 'var(--color-accent-1)',
          }}
        >
          Article
        </span>

        {/* Title */}
        <h2 className="mb-3 text-2xl font-bold tracking-tight transition-colors duration-300 group-hover:text-[var(--color-accent-1)]" style={{ color: 'var(--color-text)' }}>
          {title}
        </h2>

        {/* Description */}
        {typeof post.meta_description === 'string' && post.meta_description && (
          <p className="mb-6 line-clamp-3 text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
            {post.meta_description}
          </p>
        )}

        {/* Read more */}
        <span
          className="inline-flex items-center gap-2 text-sm font-semibold transition-all duration-300 group-hover:gap-3"
          style={{ color: 'var(--color-accent-1)' }}
        >
          Read more
          <IconArrowRight size="sm" className="transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </div>

      {/* Shine effect */}
      <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-all duration-1000 group-hover:translate-x-full group-hover:opacity-100" />
    </Link>
  );
}
