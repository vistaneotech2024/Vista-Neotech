'use client';

import { Button } from '@/components/Button';

interface PageCTAProps {
  /** Main headline – e.g. "Get Your MLM Software Quote" */
  headline: string;
  /** Supporting line – e.g. "Discuss your requirements with our experts." */
  supportingText?: string;
  /** Primary CTA label */
  primaryLabel?: string;
  /** Primary CTA href (default /contact) */
  primaryHref?: string;
  /** Secondary CTA label */
  secondaryLabel?: string;
  /** Secondary CTA href (default services hub) */
  secondaryHref?: string;
  /** Optional variant: default (gradient card) or compact (inline strip) */
  variant?: 'default' | 'compact';
  className?: string;
}

export function PageCTA({
  headline,
  supportingText = "Let's discuss how we can help. Get in touch for a free consultation.",
  primaryLabel = 'Contact Us',
  primaryHref = '/contact',
  secondaryLabel = 'View All Services',
  secondaryHref = '/mlm-software-direct-selling-consultant',
  variant = 'default',
  className = '',
}: PageCTAProps) {
  if (variant === 'compact') {
    return (
      <div
        className={`flex flex-wrap items-center justify-between gap-4 rounded-2xl border px-6 py-5 ${className}`}
        style={{
          backgroundColor: 'var(--color-bg-elevated)',
          borderColor: 'var(--color-border)',
        }}
      >
        <div>
          <p className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>
            {typeof headline === 'string' ? headline : ''}
          </p>
          {typeof supportingText === 'string' && supportingText && (
            <p className="mt-1 text-sm" style={{ color: 'var(--color-text-muted)' }}>
              {supportingText}
            </p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button href={primaryHref} accent="orange" className="rounded-full px-6 py-3 text-sm font-semibold text-white">
            {typeof primaryLabel === 'string' ? primaryLabel : 'Contact'}
          </Button>
          <Button
            href={secondaryHref}
            variant="outline"
            accent="orange"
            className="rounded-full px-6 py-3 text-sm font-semibold"
          >
            {typeof secondaryLabel === 'string' ? secondaryLabel : 'View more'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <section
      className={`relative overflow-hidden rounded-3xl p-8 md:p-12 lg:p-16 ${className}`}
      style={{ background: 'var(--color-bg-elevated)' }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background: `radial-gradient(ellipse 80% 50% at 50% 50%, var(--color-accent-1-muted) 0%, transparent 50%)`,
        }}
      />
      <div className="relative text-center">
        <h2 className="display-2 mb-4" style={{ color: 'var(--color-text)' }}>
          {typeof headline === 'string' ? headline : ''}
        </h2>
        {typeof supportingText === 'string' && supportingText && (
          <p className="prose-lead mx-auto mb-8 max-w-xl" style={{ color: 'var(--color-text-muted)' }}>
            {supportingText}
          </p>
        )}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button
            href={primaryHref}
            accent="orange"
            className="rounded-full px-8 py-4 text-base font-semibold text-white"
          >
            {typeof primaryLabel === 'string' ? primaryLabel : 'Contact'}
          </Button>
          <Button
            href={secondaryHref}
            variant="outline"
            accent="orange"
            className="rounded-full px-8 py-4 text-base font-semibold"
          >
            {typeof secondaryLabel === 'string' ? secondaryLabel : 'View more'}
          </Button>
        </div>
      </div>
    </section>
  );
}
