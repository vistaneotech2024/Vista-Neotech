/**
 * Root loading UI – shows a designed loading state (not only plain text)
 * so design is visible while the page/route loads.
 */
export default function Loading() {
  return (
    <div
      className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4"
      style={{
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
  );
}
