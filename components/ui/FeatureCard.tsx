'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import { IconArrowRight } from './Icons';

const accentVar = (n: number) => `var(--color-accent-${n})`;
const accentMutedVar = (n: number) => `var(--color-accent-${n}-muted)`;

export type FeatureCardProps = {
  /** Icon component (e.g. from Icons.tsx) */
  icon?: ReactNode;
  /** Optional emoji for personality (e.g. "🚀") */
  emoji?: string;
  /** Accent 1–5 for border/icon/cta color */
  accent?: 1 | 2 | 3 | 4 | 5;
  /** Step or index label (e.g. "01") – also used as big stat in large size */
  label?: string;
  title: string;
  description: string;
  href?: string | null;
  ctaText?: string;
  /** 'default' | 'large' for bento hero card */
  size?: 'default' | 'large';
  className?: string;
  /** Hide the left accent border for a softer card */
  noBorderAccent?: boolean;
};

export function FeatureCard({
  icon,
  emoji,
  accent = 1,
  label,
  title,
  description,
  href,
  ctaText = 'Explore',
  size = 'default',
  className = '',
  noBorderAccent = false,
}: FeatureCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement | HTMLAnchorElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const currentRef = cardRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  const accentColor = accentVar(accent);
  const mutedBg = accentMutedVar(accent);

  const iconOrEmoji = (
    <span
      className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
      style={{
        backgroundColor: mutedBg,
        color: accentColor,
        boxShadow: isHovered ? `0 8px 24px -4px ${accentColor}40` : 'none',
      }}
    >
      {emoji ?? icon}
      {/* Animated glow effect */}
      <span
        className="absolute inset-0 rounded-2xl opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-50"
        style={{ backgroundColor: accentColor }}
      />
    </span>
  );

  const content = (
    <>
      {/* Background gradient on hover */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `linear-gradient(135deg, ${mutedBg} 0%, transparent 70%)`,
        }}
      />

      {/* Animated border glow */}
      {!noBorderAccent && (
        <div
          className="absolute left-0 top-0 h-full w-1 rounded-l-2xl opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:w-1.5"
          style={{ backgroundColor: accentColor, boxShadow: `0 0 12px ${accentColor}` }}
        />
      )}

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            {(icon != null || emoji != null) && iconOrEmoji}
            {label && size !== 'large' && (
              <span
                className="overline transition-all duration-300 group-hover:scale-105"
                style={{ color: accentColor }}
              >
                {label}
              </span>
            )}
          </div>
          {size === 'large' && label && (
            <span
              className="text-5xl font-bold opacity-10 transition-all duration-500 md:text-6xl group-hover:opacity-20 group-hover:scale-105"
              style={{ color: accentColor }}
            >
              {label}
            </span>
          )}
        </div>
        <h3
          className={`mt-6 font-bold tracking-tight transition-colors duration-300 ${
            size === 'large' ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl'
          }`}
          style={{ color: 'var(--color-text)' }}
        >
          {title}
        </h3>
        <p
          className={`mt-3 leading-relaxed transition-colors duration-300 ${
            size === 'large' ? 'max-w-md text-base' : 'text-sm'
          }`}
          style={{ color: 'var(--color-text-muted)' }}
        >
          {description}
        </p>
        {(href || ctaText) && (
          <span
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold transition-all duration-300 group-hover:gap-3"
            style={{ color: accentColor }}
          >
            {ctaText}
            <IconArrowRight
              size="sm"
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </span>
        )}
      </div>

      {/* Shine effect */}
      <div
        className="pointer-events-none absolute inset-0 -translate-x-full rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-all duration-1000 group-hover:translate-x-full group-hover:opacity-100"
        style={{ transform: isHovered ? 'translateX(100%)' : 'translateX(-100%)' }}
      />
    </>
  );

  const cardClassName = `group relative overflow-hidden rounded-3xl border p-8 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl md:p-10 ${className}`;
  const cardStyle = {
    backgroundColor: 'var(--color-bg-elevated)',
    borderColor: 'var(--color-border)',
    transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.98)',
    opacity: isVisible ? 1 : 0,
    transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
    ...(noBorderAccent ? {} : { borderLeftWidth: '4px', borderLeftColor: accentColor }),
  };

  const commonProps = {
    ref: cardRef as any,
    className: cardClassName,
    style: cardStyle,
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
  };

  if (href) {
    return (
      <Link href={href} {...commonProps}>
        {content}
      </Link>
    );
  }
  return (
    <div {...commonProps}>
      {content}
    </div>
  );
}
