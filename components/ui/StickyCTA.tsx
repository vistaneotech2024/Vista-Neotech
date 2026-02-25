'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

/** Sticky CTA button – appears after scroll, matches design system. Non-intrusive. */
export function StickyCTA() {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => {
      const y = window.scrollY;
      const threshold = 400;
      setVisible(y > threshold);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!mounted || !visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 md:bottom-8 md:right-8" aria-hidden="false">
      <Link
        href="/contact"
        className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2"
        style={{
          backgroundColor: 'var(--color-accent-1)',
          boxShadow: '0 4px 14px rgba(230, 81, 0, 0.35)',
        }}
      >
        Get Free Consultation
      </Link>
    </div>
  );
}
