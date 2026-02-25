'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';

// ─── When the popup appears (first match wins, then it won’t show again this session) ───
const TRIGGERS = {
  /** Show after this many seconds on page (reduced so users actually see it) */
  DELAY_SEC: 18,
  /** Show when user has scrolled this far down the page (0-1, e.g. 0.4 = 40%) */
  SCROLL_THRESHOLD: 0.4,
  /** Exit intent: show when mouse moves into top edge (pixels from top) */
  EXIT_INTENT_TOP_PX: 80,
};
const STORAGE_KEY = 'vista_lead_popup_seen';

/** ?vista_popup=1 in URL forces the popup to show (for testing). */
function useForceShow() {
  if (typeof window === 'undefined') return false;
  return window.location.search.includes('vista_popup=1');
}

export function LeadCapturePopup() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', mobile: '', message: '' });
  const startedAt = useMemo(() => Date.now(), []);
  const forceShow = useForceShow();

  const pathname = typeof window !== 'undefined' ? window.location.pathname || '/' : '/';

  const shouldShow = useCallback(() => {
    if (typeof window === 'undefined') return false;
    if (forceShow) return true;
    try {
      if (sessionStorage.getItem(STORAGE_KEY)) return false;
      return true;
    } catch {
      return true;
    }
  }, [forceShow]);

  const markSeen = useCallback(() => {
    if (forceShow) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, '1');
    } catch {}
  }, [forceShow]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (forceShow) {
      setOpen(true);
      return;
    }
    if (!shouldShow()) return;

    const delayMs = TRIGGERS.DELAY_SEC * 1000;
    const timer = setTimeout(() => {
      if (shouldShow() && !open) setOpen(true);
    }, delayMs);

    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const total = scrollHeight - clientHeight;
      const scrolled = total > 0 ? scrollTop / total : 0;
      if (scrolled >= TRIGGERS.SCROLL_THRESHOLD && shouldShow() && !open) setOpen(true);
    };

    const onMouseMove = (e: MouseEvent) => {
      if (e.clientY <= TRIGGERS.EXIT_INTENT_TOP_PX && shouldShow() && !open) setOpen(true);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('mousemove', onMouseMove);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('mousemove', onMouseMove);
    };
  }, [mounted, open, shouldShow, forceShow]);

  const close = () => {
    setOpen(false);
    markSeen();
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setStatus('submitting');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.mobile.trim(),
          message: form.message.trim() || undefined,
          services: [],
          source: 'popup',
          pagePath: pathname,
          timeToSubmitMs: Date.now() - startedAt,
          hp: '',
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || 'Submission failed');
      setStatus('success');
      markSeen();
      setTimeout(close, 2500);
    } catch (err: unknown) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    }
  };

  if (!mounted || !open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lead-popup-title"
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={close}
        onKeyDown={(e) => e.key === 'Escape' && close()}
        tabIndex={-1}
        aria-hidden="true"
      />
      <div
        className="relative w-full max-w-md rounded-3xl border-2 shadow-2xl overflow-hidden sm:max-w-lg"
        style={{
          backgroundColor: 'var(--color-bg-elevated)',
          borderColor: 'var(--color-accent-1)',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25), 0 0 0 1px var(--color-border)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handshake / welcome strip */}
        <div
          className="flex items-center justify-center gap-3 px-6 py-4 text-center"
          style={{
            background: 'linear-gradient(135deg, var(--color-accent-1-muted) 0%, var(--color-accent-2-muted) 100%)',
            borderBottom: '1px solid var(--color-border)',
          }}
        >
          <span className="text-3xl" aria-hidden>👋</span>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide" style={{ color: 'var(--color-accent-1)' }}>
              Let&apos;s connect
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
              Quick response · No commitment
            </p>
          </div>
        </div>

        <div className="relative p-6 sm:p-8">
          <button
            type="button"
            onClick={close}
            className="absolute right-4 top-4 rounded-full p-2 transition hover:opacity-80"
            style={{ color: 'var(--color-text-muted)' }}
            aria-label="Close"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          {status === 'success' ? (
            <div className="py-6 text-center">
              <span className="text-4xl" aria-hidden>✅</span>
              <p className="mt-3 text-xl font-semibold" style={{ color: 'var(--color-text)' }}>
                Thanks! We&apos;ll be in touch soon.
              </p>
              <p className="mt-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                Check your inbox — we respond within 24 hours.
              </p>
            </div>
          ) : (
            <>
              <h2 id="lead-popup-title" className="text-xl font-bold sm:text-2xl pr-10" style={{ color: 'var(--color-text)' }}>
                Start a conversation
              </h2>
              <p className="mt-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                Share your details and we&apos;ll get back with a personalised response — no spam, ever.
              </p>
              <form onSubmit={onSubmit} className="mt-6 space-y-4">
                <input type="text" name="hp" className="absolute -left-[9999px]" tabIndex={-1} autoComplete="off" />
                <label className="block">
                  <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>Name</span>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    className="mt-1 w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--color-accent-1)]"
                    style={{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                    placeholder="Your name"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>Email</span>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                    className="mt-1 w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--color-accent-1)]"
                    style={{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                    placeholder="name@company.com"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>Mobile</span>
                  <input
                    type="tel"
                    value={form.mobile}
                    onChange={(e) => setForm((p) => ({ ...p, mobile: e.target.value }))}
                    className="mt-1 w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--color-accent-1)]"
                    style={{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                    placeholder="+91 98765 43210"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>How can we help?</span>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                    rows={2}
                    className="mt-1 w-full resize-none rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--color-accent-1)]"
                    style={{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                    placeholder="Brief message (optional)"
                  />
                </label>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
                  <button
                    type="button"
                    onClick={close}
                    className="rounded-full border-2 px-6 py-3 text-sm font-semibold transition hover:opacity-90"
                    style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}
                  >
                    Maybe later
                  </button>
                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="flex-1 rounded-full px-6 py-3.5 text-sm font-semibold text-white transition hover:opacity-95 disabled:opacity-70"
                    style={{ backgroundColor: 'var(--color-accent-1)' }}
                  >
                    {status === 'submitting' ? 'Sending…' : "Yes, let's talk"}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
