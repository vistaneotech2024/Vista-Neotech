'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { IconChat, IconCode, IconScale, IconHeadset } from '@/components/ui/Icons';
import { IconArrowRight } from '@/components/ui/Icons';

const accentVar = (n: number) => `var(--color-accent-${n})`;
const accentMutedVar = (n: number) => `var(--color-accent-${n}-muted)`;

const steps = [
  {
    step: '01',
    title: 'Consult',
    desc: 'We map your MLM and direct selling goals, compliance, and tech stack.',
    href: null,
    accent: 1 as const,
    icon: <IconChat size="lg" />,
    emoji: '💬',
  },
  {
    step: '02',
    title: 'Build',
    desc: 'Custom software, portals, and apps for your business model.',
    href: '/software-development',
    accent: 2 as const,
    icon: <IconCode size="lg" />,
    emoji: '🛠️',
  },
  {
    step: '03',
    title: 'Scale',
    desc: 'Training, plans, and strategies to grow network and revenue.',
    href: '/direct-selling-plans',
    accent: 3 as const,
    icon: <IconScale size="lg" />,
    emoji: '📈',
  },
  {
    step: '04',
    title: 'Support',
    desc: 'Ongoing support, legal advisory, and optimisation.',
    href: '/contact',
    accent: 5 as const,
    icon: <IconHeadset size="lg" />,
    emoji: '🎧',
  },
];

export function ProcessTimeline() {
  const visibleItems = useMemo(() => new Array(steps.length).fill(true), []);
  const [activeStep, setActiveStep] = useState<number | null>(null);

  return (
    <section
      className="section-padding relative overflow-hidden"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 overflow-hidden opacity-40">
        <div
          className="absolute left-1/4 top-0 h-96 w-96 rounded-full blur-3xl transition-all duration-1000"
          style={{
            backgroundColor: 'var(--color-accent-1-muted)',
            transform: visibleItems[0] ? 'scale(1.2)' : 'scale(1)',
          }}
        />
        <div
          className="absolute right-1/4 bottom-0 h-96 w-96 rounded-full blur-3xl transition-all duration-1000"
          style={{
            backgroundColor: 'var(--color-accent-3-muted)',
            transform: visibleItems[2] ? 'scale(1.2)' : 'scale(1)',
            transitionDelay: '0.3s',
          }}
        />
      </div>

      <div className="container-wide relative z-10">
        <div className="mb-10">
          <p className="section-label mb-4 animate-fade-in-up">Your journey</p>
          <h2 className="display-3 max-w-3xl animate-fade-in-up" style={{ color: 'var(--color-text)', animationDelay: '0.1s' }}>
            From consultation to scale—a clear path to growth.
          </h2>
        </div>

        {/* Desktop: Horizontal layout with animated connecting lines */}
        <div className="hidden lg:block relative">
          {/* SVG connecting path */}
          <svg
            className="absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2 pointer-events-none"
            style={{ height: '2px' }}
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="journeyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={accentVar(1)} stopOpacity={visibleItems[0] ? 1 : 0} />
                <stop offset="33%" stopColor={accentVar(2)} stopOpacity={visibleItems[1] ? 1 : 0} />
                <stop offset="66%" stopColor={accentVar(3)} stopOpacity={visibleItems[2] ? 1 : 0} />
                <stop offset="100%" stopColor={accentVar(5)} stopOpacity={visibleItems[3] ? 1 : 0} />
              </linearGradient>
            </defs>
            <path
              d="M 0 1 Q 25% 1, 25% 1 T 50% 1 T 75% 1 T 100% 1"
              stroke="url(#journeyGradient)"
              strokeWidth="2"
              fill="none"
              style={{
                strokeDasharray: visibleItems.every((v) => v) ? '1000' : '0',
                strokeDashoffset: visibleItems.every((v) => v) ? '0' : '1000',
                transition: 'stroke-dashoffset 2s ease-in-out',
              }}
            />
          </svg>

          <div className="grid grid-cols-4 gap-8 relative">
            {steps.map((s, i) => {
              const accentColor = accentVar(s.accent);
              const mutedBg = accentMutedVar(s.accent);
              const isVisible = visibleItems[i];

              return (
                <div
                  key={s.step}
                  className="relative group"
                  onMouseEnter={() => setActiveStep(i)}
                  onMouseLeave={() => setActiveStep(null)}
                >
                  {/* Animated connecting dot */}
                  <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-4 h-4 rounded-full transition-all duration-500"
                    style={{
                      backgroundColor: accentColor,
                      boxShadow: activeStep === i ? `0 0 20px ${accentColor}` : `0 0 0px ${accentColor}`,
                      transform: isVisible
                        ? 'translate(-50%, -50%) scale(1)'
                        : 'translate(-50%, -50%) scale(0)',
                      transitionDelay: `${i * 150}ms`,
                    }}
                  />

                  {/* Card */}
                  <div
                    className="relative overflow-hidden rounded-3xl border p-8 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
                    style={{
                      backgroundColor: 'var(--color-bg-elevated)',
                      borderColor: activeStep === i ? accentColor : 'var(--color-border)',
                      borderWidth: activeStep === i ? '2px' : '1px',
                      opacity: isVisible ? 1 : 0,
                      transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(50px) scale(0.9)',
                      transitionDelay: `${i * 150}ms`,
                    }}
                  >
                    {/* Gradient background on hover */}
                    <div
                      className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      style={{
                        background: `linear-gradient(135deg, ${mutedBg} 0%, transparent 70%)`,
                      }}
                    />

                    {/* Icon container */}
                    <div className="relative z-10 mb-6">
                      <div
                        className="relative flex h-16 w-16 items-center justify-center rounded-2xl text-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
                        style={{
                          backgroundColor: mutedBg,
                          color: accentColor,
                          boxShadow: activeStep === i ? `0 8px 24px -4px ${accentColor}40` : 'none',
                        }}
                      >
                        {s.emoji}
                        {/* Glow effect */}
                        <span
                          className="absolute inset-0 rounded-2xl opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-50"
                          style={{ backgroundColor: accentColor }}
                        />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="relative z-10">
                      <span
                        className="overline mb-3 block transition-all duration-300 group-hover:scale-105"
                        style={{ color: accentColor }}
                      >
                        {s.step}
                      </span>
                      <h3 className="mb-3 text-2xl font-bold tracking-tight" style={{ color: 'var(--color-text)' }}>
                        {s.title}
                      </h3>
                      <p className="mb-6 text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                        {s.desc}
                      </p>
                      {s.href && (
                        <Link
                          href={s.href}
                          className="inline-flex items-center gap-2 text-sm font-semibold transition-all duration-300 group-hover:gap-3"
                          style={{ color: accentColor }}
                        >
                          Learn more
                          <IconArrowRight size="sm" className="transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                      )}
                    </div>

                    {/* Shine effect */}
                    <div
                      className="pointer-events-none absolute inset-0 -translate-x-full rounded-3xl bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-all duration-1000 group-hover:translate-x-full group-hover:opacity-100"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile/Tablet: Vertical layout */}
        <div className="lg:hidden space-y-8">
          {steps.map((s, i) => {
            const accentColor = accentVar(s.accent);
            const mutedBg = accentMutedVar(s.accent);
            const isVisible = visibleItems[i];

            return (
              <div
                key={s.step}
                className="relative group"
                onMouseEnter={() => setActiveStep(i)}
                onMouseLeave={() => setActiveStep(null)}
              >
                {/* Connecting line */}
                {i < steps.length - 1 && (
                  <div
                    className="absolute left-8 top-full h-8 w-0.5 transition-all duration-500"
                    style={{
                      backgroundColor: accentColor,
                      opacity: isVisible ? 1 : 0,
                      transform: isVisible ? 'scaleY(1)' : 'scaleY(0)',
                      transformOrigin: 'top',
                    }}
                  />
                )}

                {/* Card */}
                <div
                  className="relative overflow-hidden rounded-3xl border p-6 transition-all duration-500 hover:shadow-xl hover:-translate-y-1 md:p-8"
                  style={{
                    backgroundColor: 'var(--color-bg-elevated)',
                    borderColor: activeStep === i ? accentColor : 'var(--color-border)',
                    borderLeftWidth: '4px',
                    borderLeftColor: accentColor,
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.95)',
                    transitionDelay: `${i * 150}ms`,
                  }}
                >
                  {/* Gradient background */}
                  <div
                    className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{
                      background: `linear-gradient(135deg, ${mutedBg} 0%, transparent 70%)`,
                    }}
                  />

                  <div className="relative z-10 flex items-start gap-4">
                    {/* Icon */}
                    <div
                      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
                      style={{
                        backgroundColor: mutedBg,
                        color: accentColor,
                      }}
                    >
                      {s.emoji}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <span
                        className="overline mb-2 block"
                        style={{ color: accentColor }}
                      >
                        {s.step}
                      </span>
                      <h3 className="mb-2 text-xl font-bold" style={{ color: 'var(--color-text)' }}>
                        {s.title}
                      </h3>
                      <p className="mb-4 text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                        {s.desc}
                      </p>
                      {s.href && (
                        <Link
                          href={s.href}
                          className="inline-flex items-center gap-2 text-sm font-semibold transition-all duration-300 group-hover:gap-3"
                          style={{ color: accentColor }}
                        >
                          Learn more
                          <IconArrowRight size="sm" className="transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
