'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4"
      style={{
        background: 'var(--color-bg)',
        color: 'var(--color-text)',
      }}
    >
      <h1 className="text-2xl font-bold md:text-3xl">Something went wrong</h1>
      <p className="text-center text-sm" style={{ color: 'var(--color-text-muted)' }}>
        An error occurred. You can try again.
      </p>
      <button
        type="button"
        onClick={reset}
        className="rounded-full px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        style={{ backgroundColor: 'var(--color-accent-1)' }}
      >
        Try again
      </button>
    </div>
  );
}
