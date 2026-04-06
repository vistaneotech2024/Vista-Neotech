'use client';

import { usePathname } from 'next/navigation';
import { useLayoutEffect, useRef } from 'react';
import { VISTA_OPEN_LEAD_POPUP_EVENT } from '@/lib/vista-lead-popup-event';

const CSS_VAR_BAR_H = '--sticky-help-bar-height';

function openLeadForm() {
  window.dispatchEvent(new Event(VISTA_OPEN_LEAD_POPUP_EVENT));
}

const PHONE_DISPLAY = '+91 98111 90082';
const PHONE_HREF = 'tel:+919811190082';

function PhoneRingIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      <path d="M14.05 2a9 9 0 0 1 8 8" />
      <path d="M14.05 6a5 5 0 0 1 4 4" />
    </svg>
  );
}

function ExternalArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M2 10L10 2M10 2H5M10 2v5" />
    </svg>
  );
}

export function StickyHelpFooter() {
  const pathname = usePathname() ?? '';
  const hidden = pathname.startsWith('/admin') || pathname.startsWith('/secureadmin');
  const barRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (hidden) return;
    const el = barRef.current;
    if (!el) return;
    const prevPb = document.body.style.paddingBottom;
    const apply = () => {
      const h = Math.ceil(el.getBoundingClientRect().height);
      document.documentElement.style.setProperty(CSS_VAR_BAR_H, `${h}px`);
      document.body.style.paddingBottom = `${h}px`;
    };
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(el);
    return () => {
      ro.disconnect();
      document.documentElement.style.removeProperty(CSS_VAR_BAR_H);
      document.body.style.paddingBottom = prevPb;
    };
  }, [hidden]);

  if (hidden) return null;

  return (
    <>
      <button
        type="button"
        onClick={openLeadForm}
        className="fixed z-[60] flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg transition-transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-accent-1)] md:h-[3.75rem] md:w-[3.75rem]"
        style={{
          backgroundColor: 'var(--color-accent-1)',
          boxShadow: '0 6px 20px color-mix(in srgb, var(--color-accent-1) 45%, transparent)',
          right: 'max(1rem, env(safe-area-inset-right))',
          bottom: 'calc(var(--sticky-help-bar-height, 56px) + 0.75rem)',
        }}
        aria-label="Request a callback — open contact form"
      >
        <PhoneRingIcon className="h-7 w-7 md:h-8 md:w-8" />
      </button>

      <div
        ref={barRef}
        className="fixed inset-x-0 bottom-0 z-[55] flex items-center justify-center px-3 py-3 text-center text-sm text-white md:text-[0.9375rem]"
        style={{
          backgroundColor: 'var(--color-accent-1)',
          paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))',
        }}
        role="region"
        aria-label="Contact help"
      >
        <p className="flex max-w-4xl flex-wrap items-center justify-center gap-x-2 gap-y-1.5 leading-snug sm:gap-x-3">
          <span>
            <strong className="font-semibold">Need Help?</strong>{' '}
            <span className="font-normal opacity-95">Talk to us at </span>
            <a href={PHONE_HREF} className="font-medium underline-offset-2 hover:underline">
              {PHONE_DISPLAY}
            </a>
          </span>
          <span className="hidden text-white/75 sm:inline" aria-hidden>
            |
          </span>
          <span className="text-white/90">or</span>
          <button
            type="button"
            onClick={openLeadForm}
            className="inline-flex cursor-pointer items-center gap-1 rounded-sm border-0 bg-transparent p-0 font-semibold tracking-wide text-white underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-accent-1)]"
          >
            REQUEST CALLBACK
            <ExternalArrowIcon className="h-3 w-3 shrink-0 opacity-90" />
          </button>
        </p>
      </div>
    </>
  );
}
