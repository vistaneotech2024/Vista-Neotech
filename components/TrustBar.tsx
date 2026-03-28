'use client';

import { useEffect, useRef, useState } from 'react';

const items = [
  { label: 'MLM Software', accent: 1, emoji: '⚡' },
  { label: 'Direct Selling', accent: 2, emoji: '🤝' },
  { label: 'Consultancy', accent: 3, emoji: '💼' },
  { label: 'Technology', accent: 4, emoji: '🔧' },
  { label: 'Excellence', accent: 5, emoji: '✨' },
];

export function TrustBar() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={sectionRef}
      className="trustbar-section border-y py-5 md:py-6"
      style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg)' }}
    >
      <div className="container-wide">
        <p
          className="overline-lg mb-6 text-center transition-all duration-500"
          style={{
            color: 'var(--color-text-subtle)',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(-10px)',
          }}
        >
          Trusted for
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
          {items.map((item, index) => (
            <div
              key={item.label}
              className="flex items-center gap-2 rounded-full border px-4 py-2.5 transition-all duration-500 hover:shadow-lg hover:scale-105 md:px-5 md:py-3"
              style={{
                backgroundColor: 'var(--color-bg-elevated)',
                borderColor: 'var(--color-border)',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.9)',
                transitionDelay: `${index * 100}ms`,
              }}
            >
              <span className="text-lg" aria-hidden>{item.emoji}</span>
              <span className="text-sm font-semibold md:text-base" style={{ color: 'var(--color-text-muted)' }}>
                {item.label}
              </span>
              <span
                className="h-2 w-2 rounded-full shrink-0"
                style={{ backgroundColor: `var(--color-accent-${item.accent})` }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
