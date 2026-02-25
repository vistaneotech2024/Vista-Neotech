'use client';

export function TechHeroBg() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {/* Base uses theme variable */}
      <div className="absolute inset-0 bg-[var(--color-hero-bg)]" />
      {/* Multi-accent gradient mesh – visible in both themes */}
      <div
        className="absolute inset-0 opacity-100"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% -10%, var(--color-accent-1-muted) 0%, transparent 50%),
            radial-gradient(ellipse 60% 40% at 100% 40%, var(--color-accent-2-muted) 0%, transparent 45%),
            radial-gradient(ellipse 50% 35% at 0% 60%, var(--color-accent-3-muted) 0%, transparent 45%),
            radial-gradient(ellipse 70% 30% at 50% 100%, var(--color-accent-5-muted) 0%, transparent 50%)
          `,
        }}
      />
      {/* Dot grid – theme-aware via opacity */}
      <div
        className="absolute inset-0 opacity-[0.4] dark:opacity-40"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, var(--color-border) 1px, transparent 0)',
          backgroundSize: '28px 28px',
        }}
      />
      {/* Accent orbs – orange, cyan, green */}
      <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full opacity-30 dark:opacity-20" style={{ backgroundColor: 'var(--color-accent-1)' }} />
      <div className="absolute bottom-0 left-1/2 h-64 w-[500px] -translate-x-1/2 rounded-full opacity-20 dark:opacity-10" style={{ backgroundColor: 'var(--color-accent-2)' }} />
      <div className="absolute right-1/4 top-1/3 h-48 w-48 rounded-full opacity-20 dark:opacity-10" style={{ backgroundColor: 'var(--color-accent-3)' }} />
    </div>
  );
}
