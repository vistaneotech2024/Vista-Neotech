'use client';

import { ReactNode } from 'react';

interface BenefitsStripProps {
  items: { icon?: ReactNode; label: string }[];
  /** Accent 1–5 for left border and icon tint */
  accent?: 1 | 2 | 3 | 4 | 5;
  className?: string;
}

const accentVar = (n: number) => `var(--color-accent-${n})`;
const accentMutedVar = (n: number) => `var(--color-accent-${n}-muted)`;

export function BenefitsStrip({
  items,
  accent = 1,
  className = '',
}: BenefitsStripProps) {
  const color = accentVar(accent);
  const muted = accentMutedVar(accent);

  if (items.length === 0) return null;

  return (
    <div
      className={`flex flex-wrap gap-6 rounded-2xl border-l-4 py-6 pl-6 pr-4 ${className}`}
      style={{
        backgroundColor: 'var(--color-bg-muted)',
        borderLeftColor: color,
      }}
    >
      {items.slice(0, 6).map((item, i) => (
        <div key={i} className="flex items-center gap-3">
          {item.icon ? (
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
              style={{ backgroundColor: muted, color }}
            >
              {item.icon}
            </span>
          ) : (
            <span
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm font-bold"
              style={{ backgroundColor: muted, color }}
            >
              ✓
            </span>
          )}
          <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
            {typeof item.label === 'string' ? item.label : (item.label != null ? String(item.label) : '')}
          </span>
        </div>
      ))}
    </div>
  );
}
