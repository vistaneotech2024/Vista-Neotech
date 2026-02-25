'use client';

import { ReactNode } from 'react';

interface ServiceExplanationCardProps {
  icon?: ReactNode;
  emoji?: string;
  title: string;
  description: string;
  features: string[];
  accent?: 1 | 2 | 3 | 4 | 5;
  className?: string;
}

const accentVar = (n: number) => `var(--color-accent-${n})`;
const accentMutedVar = (n: number) => `var(--color-accent-${n}-muted)`;

export function ServiceExplanationCard({
  icon,
  emoji,
  title,
  description,
  features,
  accent = 1,
  className = '',
}: ServiceExplanationCardProps) {
  const accentColor = accentVar(accent);
  const mutedBg = accentMutedVar(accent);

  return (
    <div
      className={`group relative overflow-hidden rounded-3xl border p-8 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 md:p-10 ${className}`}
      style={{
        backgroundColor: 'var(--color-bg-elevated)',
        borderColor: 'var(--color-border)',
        borderLeftWidth: '4px',
        borderLeftColor: accentColor,
      }}
    >
      {/* Gradient background */}
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `linear-gradient(135deg, ${mutedBg} 0%, transparent 70%)`,
        }}
      />

      {/* Icon */}
      <div className="relative z-10 mb-6">
        <div
          className="flex h-16 w-16 items-center justify-center rounded-2xl text-3xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
          style={{
            backgroundColor: mutedBg,
            color: accentColor,
          }}
        >
          {emoji ?? icon}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <h3 className="mb-4 text-2xl font-bold tracking-tight" style={{ color: 'var(--color-text)' }}>
          {typeof title === 'string' ? title : ''}
        </h3>
        <p className="mb-6 text-base leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
          {typeof description === 'string' ? description : ''}
        </p>

        {/* Features */}
        {features.length > 0 && (
          <ul className="space-y-3">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <span
                  className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-all duration-300 group-hover:scale-110"
                  style={{
                    backgroundColor: mutedBg,
                    color: accentColor,
                  }}
                >
                  ✓
                </span>
                <span className="text-sm leading-relaxed" style={{ color: 'var(--color-text)' }}>
                  {typeof feature === 'string' ? feature : String(feature)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Shine effect */}
      <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-all duration-1000 group-hover:translate-x-full group-hover:opacity-100" />
    </div>
  );
}
