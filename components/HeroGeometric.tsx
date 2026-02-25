'use client';

export function HeroGeometric() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary-orange/10 blur-3xl" />
      <div className="absolute right-1/4 top-1/4 h-48 w-48 rounded-full bg-accent-cyan/10 blur-2xl" />
      <div className="absolute bottom-1/4 -left-20 h-64 w-64 rounded-full bg-accent-green/10 blur-3xl" />
      <svg className="absolute bottom-0 left-0 right-0 h-32 w-full text-neutral-lighter" preserveAspectRatio="none" viewBox="0 0 1200 120" fill="currentColor">
        <path d="M0 120L50 90C100 60 200 0 300 30C400 60 500 120 600 90C700 60 800 0 900 30C1000 60 1100 90 1150 105L1200 120V0H0V120Z" opacity="0.5" />
      </svg>
      <div className="absolute inset-0 geometric-bg" />
    </div>
  );
}
