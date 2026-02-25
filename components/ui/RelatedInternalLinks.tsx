import Link from 'next/link';
import { IconArrowRight } from '@/components/ui/Icons';
import type { InternalLinkItem } from '@/lib/internal-links';

interface RelatedInternalLinksProps {
  links: InternalLinkItem[];
  title?: string;
  description?: string;
  className?: string;
}

export function RelatedInternalLinks({
  links,
  title = 'Explore related services',
  description = 'Discover more solutions that can help your business grow.',
  className = '',
}: RelatedInternalLinksProps) {
  if (links.length === 0) return null;

  return (
    <section
      className={`section-padding ${className}`}
      style={{ backgroundColor: 'var(--color-bg-muted)' }}
    >
      <div className="container-tight">
        <div className="mb-10 text-center">
          <p className="section-label mb-4">Internal links</p>
          <h2 className="display-3 mb-4" style={{ color: 'var(--color-text)' }}>
            {title}
          </h2>
          {description && (
            <p className="prose-lead mx-auto max-w-2xl" style={{ color: 'var(--color-text-muted)' }}>
              {description}
            </p>
          )}
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {links.map((link) => (
            <Link
              key={link.slug}
              href={link.href}
              className="group flex items-start gap-4 rounded-2xl border p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
              style={{
                backgroundColor: 'var(--color-bg-elevated)',
                borderColor: 'var(--color-border)',
              }}
            >
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110"
                style={{
                  backgroundColor: 'var(--color-accent-1-muted)',
                  color: 'var(--color-accent-1)',
                }}
              >
                <IconArrowRight size="sm" className="rotate-[-90deg] sm:rotate-0" />
              </span>
              <div className="min-w-0 flex-1">
                <h3
                  className="font-semibold transition-colors duration-300 group-hover:text-[var(--color-accent-1)]"
                  style={{ color: 'var(--color-text)' }}
                >
                  {typeof link.title === 'string' ? link.title : link.slug.replace(/-/g, ' ')}
                </h3>
                {typeof link.description === 'string' && link.description && (
                  <p className="mt-1 line-clamp-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                    {link.description}
                  </p>
                )}
              </div>
              <IconArrowRight
                size="sm"
                className="mt-1 shrink-0 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100"
                style={{ color: 'var(--color-accent-1)' }}
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
