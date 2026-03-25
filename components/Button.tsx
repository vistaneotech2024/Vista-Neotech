import Link from 'next/link';
import React from 'react';
import { safeText } from '@/lib/safe-react-children';

type Accent = 'orange' | 'cyan' | 'green' | 'amber' | 'teal';

/** Ensure children are safe to render (no plain objects like style). */
function safeChildren(children: React.ReactNode): React.ReactNode {
  return React.Children.map(children, (child) => {
    if (child == null) return child;
    if (typeof child === 'string' || typeof child === 'number' || typeof child === 'boolean') return child;
    if (React.isValidElement(child)) return child;
    return safeText(child);
  });
}

const accentClasses = {
  orange: 'bg-[var(--color-accent-1)] hover:opacity-90 focus:ring-[var(--color-accent-1)]',
  cyan: 'bg-[var(--color-accent-2)] hover:opacity-90 focus:ring-[var(--color-accent-2)]',
  green: 'bg-[var(--color-accent-3)] hover:opacity-90 focus:ring-[var(--color-accent-3)]',
  amber: 'bg-[var(--color-accent-4)] hover:opacity-90 focus:ring-[var(--color-accent-4)]',
  teal: 'bg-[var(--color-accent-5)] hover:opacity-90 focus:ring-[var(--color-accent-5)]',
};

const outlineAccentClasses = {
  orange: 'border-2 border-[var(--color-accent-1)] text-[var(--color-accent-1)] hover:bg-[var(--color-accent-1-muted)] focus:ring-[var(--color-accent-1)]',
  cyan: 'border-2 border-[var(--color-accent-2)] text-[var(--color-accent-2)] hover:bg-[var(--color-accent-2-muted)] focus:ring-[var(--color-accent-2)]',
  green: 'border-2 border-[var(--color-accent-3)] text-[var(--color-accent-3)] hover:bg-[var(--color-accent-3-muted)] focus:ring-[var(--color-accent-3)]',
  amber: 'border-2 border-[var(--color-accent-4)] text-[var(--color-accent-4)] hover:bg-[var(--color-accent-4-muted)] focus:ring-[var(--color-accent-4)]',
  teal: 'border-2 border-[var(--color-accent-5)] text-[var(--color-accent-5)] hover:bg-[var(--color-accent-5-muted)] focus:ring-[var(--color-accent-5)]',
};

type ButtonProps = {
  href?: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline-light' | 'outline' | 'outline-hero' | 'dark';
  accent?: Accent;
  className?: string;
  type?: 'button' | 'submit';
  prefetch?: boolean;
};

export function Button({ href, children, variant = 'primary', accent = 'orange', className = '', type = 'button', prefetch }: ButtonProps) {
  const safe = safeChildren(children);
  const isFilled = variant === 'primary';
  const isOutline = variant === 'outline';
  const isOutlineHero = variant === 'outline-hero';
  const isDark = variant === 'dark';
  const isOutlineLight = variant === 'outline-light';

  const variantClasses =
    isFilled
      ? `text-white ${accentClasses[accent]}`
      : isOutline
        ? outlineAccentClasses[accent]
        : isOutlineHero
          ? 'border-2 border-[var(--color-border)] bg-[var(--color-accent-1-muted)] text-[var(--color-hero-text)] hover:bg-[var(--color-accent-1-muted)] hover:opacity-90'
          : isDark
            ? 'border-2 border-white/30 bg-white/5 text-white hover:bg-white/10 hover:border-white/50 focus:ring-white/30'
            : isOutlineLight
              ? 'border-2 border-white/50 text-white hover:bg-white/10 hover:border-white focus:ring-white/50 focus:ring-offset-[var(--color-bg-elevated)]'
              : 'border-2 border-[var(--color-accent-1)] text-[var(--color-accent-1)] hover:bg-[var(--color-accent-1)] hover:text-white focus:ring-[var(--color-accent-1)]';

  const base =
    'inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-medium transition focus:outline focus:ring-2 focus:ring-offset-2 ' +
    variantClasses +
    ' ' +
    className;

  if (href) {
    const shouldPrefetch = prefetch ?? (href === '/contact' ? false : undefined);
    return <Link href={href} prefetch={shouldPrefetch} className={base}>{safe}</Link>;
  }
  return <button type={type} className={base}>{safe}</button>;
}
