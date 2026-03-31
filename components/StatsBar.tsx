'use client';

import { useEffect, useRef, useState } from 'react';
import { IconChart, IconHeadset, IconRocket, IconUsers } from '@/components/ui/Icons';

const accentVar = (n: number) => `var(--color-accent-${n})`;
const accentMutedVar = (n: number) => `var(--color-accent-${n}-muted)`;

const stats = [
  { value: '25+', label: 'Years', sub: 'experience', accent: 1 as const, icon: IconRocket },
  { value: '3000+', label: 'Projects', sub: 'delivered', accent: 2 as const, icon: IconChart },
  { value: '50+', label: 'Verticals', sub: 'industry', accent: 3 as const, icon: IconUsers },
  { value: '24/7', label: 'Support', sub: '& training', accent: 4 as const, icon: IconHeadset },
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
      className="statsbar-section border-y py-8 md:py-10"
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
              className="group relative flex min-h-[104px] items-center gap-3 overflow-hidden rounded-2xl border px-4 py-4 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl md:min-h-[116px] md:gap-4 md:px-6 md:py-6"
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
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 md:h-16 md:w-16"
                style={{ backgroundColor: accentMutedVar(s.accent), color: accentVar(s.accent) }}
              >
                <s.icon className="h-8 w-8 md:h-10 md:w-10" />
              </div>
              <div className="min-w-0">
                <span
                  className="block text-xl font-bold tracking-tight md:text-2xl"
                  style={{ color: 'var(--color-text)' }}
                >
                  {s.value}
                </span>
                <p className="mt-0.5 text-xs font-medium md:text-sm" style={{ color: 'var(--color-text-muted)' }}>
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
