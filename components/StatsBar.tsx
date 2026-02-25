'use client';

import { useEffect, useRef, useState } from 'react';
import { IconRocket, IconChart, IconGlobe, IconHeadset } from '@/components/ui/Icons';

const accentVar = (n: number) => `var(--color-accent-${n})`;
const accentMutedVar = (n: number) => `var(--color-accent-${n}-muted)`;

const stats = [
  { value: '15+', label: 'Years', sub: 'experience', accent: 1 as const, icon: <IconRocket className="shrink-0" size="lg" />, emoji: '🚀' },
  { value: '500+', label: 'Projects', sub: 'delivered', accent: 2 as const, icon: <IconChart className="shrink-0" size="lg" />, emoji: '📊' },
  { value: '50+', label: 'Verticals', sub: 'industry', accent: 3 as const, icon: <IconGlobe className="shrink-0" size="lg" />, emoji: '🌍' },
  { value: '24/7', label: 'Support', sub: '& training', accent: 4 as const, icon: <IconHeadset className="shrink-0" size="lg" />, emoji: '🎧' },
];

export function StatsBar() {
  const [visibleItems, setVisibleItems] = useState<boolean[]>(new Array(stats.length).fill(false));
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers = refs.current.map((ref, index) => {
      if (!ref) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setVisibleItems((prev) => {
                const newState = [...prev];
                newState[index] = true;
                return newState;
              });
            }, index * 100);
            observer.unobserve(ref);
          }
        },
        { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
      );

      observer.observe(ref);
      return observer;
    });

    return () => {
      observers.forEach((observer) => observer?.disconnect());
    };
  }, []);

  return (
    <section
      className="border-y py-8 md:py-10"
      style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-muted)' }}
    >
      <div className="container-wide">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
          {stats.map((s, index) => (
            <div
              key={s.label}
              ref={(el) => {
                refs.current[index] = el;
              }}
              className="group relative flex overflow-hidden rounded-2xl border py-6 pl-6 pr-6 shadow-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-1 md:py-8 md:pl-8"
              style={{
                backgroundColor: 'var(--color-bg)',
                borderColor: 'var(--color-border)',
                borderLeftWidth: '4px',
                borderLeftColor: accentVar(s.accent),
                opacity: visibleItems[index] ? 1 : 0,
                transform: visibleItems[index] ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.95)',
              }}
            >
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: accentMutedVar(s.accent), color: accentVar(s.accent) }}
              >
                {s.emoji}
              </div>
              <div className="ml-4 min-w-0">
                <span
                  className="block text-2xl font-bold tracking-tight md:text-3xl"
                  style={{ color: 'var(--color-text)' }}
                >
                  {s.value}
                </span>
                <p className="mt-0.5 text-sm font-medium" style={{ color: 'var(--color-text-muted)' }}>
                  {s.label} <span style={{ color: 'var(--color-text-subtle)' }}>{s.sub}</span>
                </p>
              </div>
              <div
                className="absolute -bottom-8 -right-8 h-24 w-24 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
                style={{ backgroundColor: accentMutedVar(s.accent), transform: 'translate(20%, 20%)' }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
