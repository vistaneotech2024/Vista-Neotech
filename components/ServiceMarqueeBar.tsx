'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { getServiceMenuLinksFlat } from '@/lib/service-menu-categories';

export function ServiceMarqueeBar() {
  const links = useMemo(() => getServiceMenuLinksFlat(), []);
  const summary = useMemo(() => links.map((l) => l.label).join(', '), [links]);

  return (
    <nav
      className="overflow-hidden border-y py-4"
      style={{ backgroundColor: 'var(--color-accent-1)', borderColor: 'var(--color-accent-1)' }}
      aria-label="Service shortcuts"
    >
      <p className="sr-only">
        Scrolling links to service pages: {summary}. Pause on hover or focus to click a link.
      </p>
      <div className="about-services-marquee-track">
        {[0, 1].map((row) => (
          <div key={row} className="flex items-center">
            {links.map((item) => (
              <span
                key={`${row}-${item.href}-${item.label}`}
                className="mx-6 flex items-center whitespace-nowrap"
              >
                <Link
                  href={item.href}
                  className="text-sm font-semibold uppercase tracking-widest text-white outline-none ring-offset-2 transition-opacity hover:opacity-90 focus-visible:rounded-sm focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-white"
                  style={{ fontFamily: 'var(--font-body, var(--font-primary))' }}
                >
                  {item.label}
                </Link>
                <span className="mx-6 opacity-40" aria-hidden>
                  ✦
                </span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </nav>
  );
}
