'use client';

/**
 * Optimized blog image: fast loading with compression (quality 82–85) without
 * losing resolution or detail. Uses Next/Image when possible; falls back to
 * native <img> so images are always visible (e.g. if Next Image fails or URL is external).
 */

import Image from 'next/image';
import { useState } from 'react';

export interface OptimizedBlogImageProps {
  src: string;
  alt: string;
  /** Use priority for LCP hero images (one per page) */
  priority?: boolean;
  /** Responsive sizes; default good for hero and cards */
  sizes?: string;
  /** 82–85 keeps detail, reduces file size; default 85 */
  quality?: number;
  /** Aspect ratio for layout stability (e.g. "16/9", "4/3"). Omit when using cover. */
  aspectRatio?: string;
  /** When true, image fills container (e.g. hero background) with object-cover, no aspect constraint */
  cover?: boolean;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
}

const DEFAULT_SIZES_HERO = '(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px';
const DEFAULT_SIZES_CARD = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px';

function NativeImgFallback({
  src,
  alt,
  priority,
  className,
  cover,
}: { src: string; alt: string; priority?: boolean; className?: string; cover?: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      className={cover ? 'absolute inset-0 h-full w-full object-cover' : className}
      style={cover ? { objectFit: 'cover' } : undefined}
    />
  );
}

export function OptimizedBlogImage({
  src,
  alt,
  priority = false,
  sizes,
  quality = 85,
  aspectRatio,
  cover = false,
  className = '',
  fill = false,
  width,
  height,
}: OptimizedBlogImageProps) {
  const [useFallback, setUseFallback] = useState(false);
  const isRemote = src.startsWith('http');
  const sizesAttr = sizes ?? (fill ? DEFAULT_SIZES_HERO : DEFAULT_SIZES_CARD);

  const useFill = fill || cover || (isRemote && width == null && height == null);
  const ratio = cover ? undefined : (aspectRatio ?? '16/9');

  if (!src || src.length < 5) return null;

  if (useFallback) {
    const wrapperClass = cover ? `absolute inset-0 overflow-hidden ${className}` : `relative block overflow-hidden ${className}`;
    return (
      <span className={wrapperClass} style={ratio && !cover ? { aspectRatio: ratio } : undefined}>
        <NativeImgFallback src={src} alt={alt} priority={priority} cover={cover} />
      </span>
    );
  }

  if (useFill) {
    return (
      <span
        className={cover ? `absolute inset-0 overflow-hidden ${className}` : `relative block overflow-hidden ${className}`}
        style={ratio ? { aspectRatio: ratio } : undefined}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizesAttr}
          quality={quality}
          priority={priority}
          className="object-cover"
          unoptimized={!isRemote}
          onError={() => setUseFallback(true)}
        />
      </span>
    );
  }

  const w = width ?? 1200;
  const h = height ?? 630;

  return (
    <Image
      src={src}
      alt={alt}
      width={w}
      height={h}
      sizes={sizesAttr}
      quality={quality}
      priority={priority}
      className={className}
      unoptimized={!isRemote}
      onError={() => setUseFallback(true)}
    />
  );
}
