import { Suspense } from 'react';

/**
 * Main content layout – wraps pages in Suspense so the shell (header/footer)
 * and critical CSS stay visible while page content loads or streams.
 * Loading fallback uses design tokens from critical CSS so it's always visible.
 */
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div
          className="flex flex-col items-center justify-center gap-6 px-4"
          style={{
            minHeight: '50vh',
            background: 'var(--color-bg)',
            color: 'var(--color-text-muted)',
          }}
        >
          <div
            className="h-12 w-12 animate-spin rounded-full border-2 border-[var(--color-border)] border-t-[var(--color-accent-1)]"
            aria-hidden
          />
          <p className="text-sm font-medium" style={{ color: 'var(--color-text-muted)' }}>
            Loading…
          </p>
        </div>
      }
    >
      {children}
    </Suspense>
  );
}
