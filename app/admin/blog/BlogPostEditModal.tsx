'use client';

import { useEffect, useState } from 'react';

export function BlogPostEditModal({ id }: { id: string }) {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    setLoaded(false);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition hover:opacity-90"
        style={{ backgroundColor: 'var(--color-accent-1-muted)', color: 'var(--color-accent-1)' }}
      >
        Edit
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6"
          role="dialog"
          aria-modal="true"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
          style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
        >
          <div
            className="w-full max-w-6xl overflow-hidden rounded-3xl border shadow-xl"
            style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-elevated)' }}
          >
            <div
              className="flex items-center justify-between gap-3 border-b p-3 sm:p-4"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <div className="min-w-0">
                <p className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
                  Edit blog post
                </p>
                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                  Post ID: {id}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full border px-3 py-1.5 text-xs font-semibold transition hover:opacity-90"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
              >
                Close
              </button>
            </div>

            <div className="relative h-[82vh] bg-[var(--color-bg)]">
              {!loaded ? (
                <div className="absolute inset-0 grid place-items-center">
                  <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                    Loading editor…
                  </p>
                </div>
              ) : null}
              <iframe
                src={`/admin/blog/${encodeURIComponent(id)}`}
                className="h-full w-full"
                onLoad={() => setLoaded(true)}
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

