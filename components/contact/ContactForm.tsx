'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/Button';
import { IconCheck, IconSparkles } from '@/components/ui/Icons';

type ServiceOption = { id: string; label: string; description: string; group: string };

const SERVICES: ServiceOption[] = [
  // Software Development (listed first in the Services UI)
  { id: 'custom_software', label: 'Custom Software Development', description: 'Web apps, portals, automation, integrations.', group: 'Software Development' },
  { id: 'web_development', label: 'Web Development', description: 'Fast websites, landing pages, performance + SEO foundations.', group: 'Software Development' },
  { id: 'mobile_apps', label: 'Mobile App Development', description: 'Android/iOS apps for customers, distributors, and admins.', group: 'Software Development' },
  { id: 'portals_ecommerce', label: 'Shopping/Travel Portals', description: 'Shopping portal & travel portal development with integrations.', group: 'Software Development' },
  { id: 'api_integrations', label: 'API & Payment Integrations', description: 'Payment gateways, SMS/WhatsApp, e-commerce, analytics, CRMs.', group: 'Software Development' },

  // MLM & Direct Selling
  { id: 'mlm_software', label: 'MLM Software', description: 'Binary/Matrix/Board plans, genealogy, wallets, dashboards, apps.', group: 'MLM & Direct Selling' },
  { id: 'direct_selling_software', label: 'Direct Selling Software', description: 'Distributor onboarding, inventory, franchise, incentives, compliance.', group: 'MLM & Direct Selling' },
  { id: 'consulting_launch', label: 'Consulting & Business Setup', description: 'Company registration, plan design, SOPs, training & rollout support.', group: 'MLM & Direct Selling' },

  // Digital Marketing
  { id: 'seo', label: 'SEO Services', description: 'On-page, technical SEO, content, reporting.', group: 'Digital Marketing' },
  { id: 'sem_smo', label: 'SEM / SMO', description: 'Ads + social growth with measurable ROI.', group: 'Digital Marketing' },
  { id: 'messaging_marketing', label: 'WhatsApp / SMS / Email Marketing', description: 'Automations, templates, campaigns, segmentation.', group: 'Digital Marketing' },
  { id: 'content_writing', label: 'Content Writing', description: 'Blogs, landing pages, website copy aligned to SEO intent.', group: 'Digital Marketing' },

  // Design
  { id: 'uiux', label: 'UI/UX & Web Design', description: 'Modern UI, conversions, accessibility, brand consistency.', group: 'Design & Creative' },
  { id: 'graphic_brand', label: 'Graphic / Logo / Brand', description: 'Logo, corporate identity, creatives, print-ready assets.', group: 'Design & Creative' },
  { id: 'brochure_print', label: 'Brochure / Posters / Printing', description: 'Brochures, flyers, posters, digital printing services.', group: 'Design & Creative' },

  // Products / Brands
  { id: 'aiml', label: 'AIMLM Software (Product)', description: 'Existing product—support, onboarding, upgrades, customization.', group: 'Products / Brands' },
  { id: 'tripgate', label: 'Tripgate.in (Product)', description: 'Travel product—setup, integrations, or business onboarding.', group: 'Products / Brands' },
  { id: 'verifizy', label: 'Verifizy (Product)', description: 'Verification product—integrations, onboarding, support.', group: 'Products / Brands' },

  // Other
  { id: 'support_maintenance', label: 'Support & Maintenance', description: 'Monitoring, updates, security hardening, SLA.', group: 'Other' },
  { id: 'not_sure', label: 'Not sure (Help me choose)', description: 'Tell us your goal—we’ll recommend the best service stack.', group: 'Other' },
];

const BUDGETS = ['< ₹50k', '₹50k–₹2L', '₹2L–₹10L', '₹10L+', 'Not sure'];
const TIMELINES = ['ASAP', '2–4 weeks', '1–2 months', '3+ months', 'Not sure'];

export function ContactForm() {
  const introRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const el = introRef.current;
    if (!el) return;
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    el.focus({ preventScroll: true });
  }, []);

  const [form, setForm] = useState({
    name: '',
    email: '',
    countryCode: '+91',
    phone: '',
    company: '',
    website: '',
    message: '',
    budgetRange: '',
    timeline: '',
    consent: true,
    hp: '', // honeypot (must stay empty)
  });

  const startedAt = useMemo(() => Date.now(), []);

  function toggleService(id: string) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    setStatus('submitting');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          phone: form.phone ? `${form.countryCode} ${form.phone}` : '',
          // Send service IDs so backend can normalize into DB tables
          services: selected,
          timeToSubmitMs: Date.now() - startedAt,
          pagePath: '/contact',
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        const fieldErrors: Record<string, string[]> | undefined = body?.details?.fieldErrors;
        const allFieldMessages = fieldErrors
          ? Object.values(fieldErrors).flat().filter((m: unknown): m is string => typeof m === 'string' && m.trim().length > 0)
          : [];
        const msg =
          (typeof body?.error === 'string' && body.error.trim()) ||
          allFieldMessages[0] ||
          'Submission failed';
        throw new Error(msg);
      }

      setStatus('success');
    } catch (err: any) {
      setStatus('error');
      setError(err?.message || 'Something went wrong. Please try again.');
    }
  }

  const selectedLabels = selected
    .map((id) => SERVICES.find((s) => s.id === id)?.label || id)
    .filter(Boolean);

  if (status === 'success') {
    return (
      <div
        className="relative overflow-hidden rounded-3xl border p-6 md:p-8"
        style={{ backgroundColor: 'var(--color-bg-elevated)', borderColor: 'var(--color-border)' }}
      >
        <div className="pointer-events-none absolute inset-0 opacity-40">
          <div className="absolute -right-32 -top-32 h-72 w-72 rounded-full blur-3xl" style={{ backgroundColor: 'var(--color-accent-1-muted)' }} />
          <div className="absolute -left-32 bottom-0 h-72 w-72 rounded-full blur-3xl" style={{ backgroundColor: 'var(--color-accent-2-muted)' }} />
        </div>

        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg)' }}>
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full" style={{ backgroundColor: 'var(--color-accent-3-muted)', color: 'var(--color-accent-3)' }}>
              <IconCheck size="sm" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-subtle)' }}>
              Submitted
            </span>
          </div>

          <div className="mt-4 flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h2 className="text-3xl font-bold" style={{ color: 'var(--color-text)' }}>
                Thanks — we’ll get back quickly.
              </h2>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                We’ve received your request. A specialist will respond with next steps and a recommended service stack.
              </p>
            </div>
            <div className="hidden shrink-0 sm:block" style={{ color: 'var(--color-accent-4)' }}>
              <IconSparkles size="lg" />
            </div>
          </div>

          {selectedLabels.length > 0 && (
            <div className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-subtle)' }}>
                Selected
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedLabels.slice(0, 10).map((label) => (
                  <span
                    key={label}
                    className="rounded-full border px-3 py-1 text-xs font-semibold"
                    style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}
                  >
                    {label}
                  </span>
                ))}
                {selectedLabels.length > 10 && (
                  <span className="text-xs" style={{ color: 'var(--color-text-subtle)' }}>
                    +{selectedLabels.length - 10} more
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border px-4 py-3" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg)' }}>
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-subtle)' }}>Next</p>
              <p className="mt-1 text-sm font-semibold" style={{ color: 'var(--color-text)' }}>We review</p>
              <p className="mt-0.5 text-xs" style={{ color: 'var(--color-text-muted)' }}>Your goals and requirements</p>
            </div>
            <div className="rounded-2xl border px-4 py-3" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg)' }}>
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-subtle)' }}>Then</p>
              <p className="mt-1 text-sm font-semibold" style={{ color: 'var(--color-text)' }}>We recommend</p>
              <p className="mt-0.5 text-xs" style={{ color: 'var(--color-text-muted)' }}>Modules and integrations</p>
            </div>
            <div className="rounded-2xl border px-4 py-3" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg)' }}>
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-subtle)' }}>You get</p>
              <p className="mt-1 text-sm font-semibold" style={{ color: 'var(--color-text)' }}>A clear plan</p>
              <p className="mt-0.5 text-xs" style={{ color: 'var(--color-text-muted)' }}>Scope + timeline + demo</p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button href="/mlm-software" variant="outline" accent="orange" className="rounded-full px-7 py-3">
              Explore MLM Software
            </Button>
            <Button href="/" variant="outline" accent="cyan" className="rounded-full px-7 py-3">
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-3xl border p-4 md:p-5" style={{ backgroundColor: 'var(--color-bg-elevated)', borderColor: 'var(--color-border)' }}>
      <style>{`
        details[open] .contact-dd-chevron { transform: rotate(180deg); }
      `}</style>
      <div
        ref={introRef}
        id="contact-form-intro"
        tabIndex={-1}
        className="text-center scroll-mt-24 outline-none focus:outline-none md:scroll-mt-[5.5rem]"
        role="region"
        aria-labelledby="contact-form-heading"
      >
        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-subtle)' }}>
          Contact
        </p>
        <h2 id="contact-form-heading" className="mt-2 text-3xl font-bold" style={{ color: 'var(--color-text)' }}>
          Tell us what you need.
        </h2>
        <p className="mx-auto mt-2 max-w-3xl text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
          Share your details — services, requirements, budget, and timeline are optional. We will reply with the best next step.
        </p>
      </div>

      {/* Honeypot (hidden) */}
      <div className="hidden" aria-hidden="true">
        <label>
          Website
          <input value={form.hp} onChange={(e) => setForm((p) => ({ ...p, hp: e.target.value }))} />
        </label>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div className="space-y-2.5">
          <div className="mb-1">
            <p className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>Your details</p>
            <p className="mt-1 text-xs" style={{ color: 'var(--color-text-muted)' }}>
              Share your contact details so we can reply quickly.
            </p>
          </div>

          <label className="block">
            <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>Full name</span>
            <input
              required
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              className="mt-1 w-full rounded-2xl border px-3.5 py-2 text-sm outline-none focus:ring-2"
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
              className="mt-1 w-full rounded-2xl border px-3.5 py-2 text-sm outline-none focus:ring-2"
              style={{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
              placeholder="name@company.com"
            />
          </label>

          <div className="grid gap-2.5 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                Budget <span className="font-normal" style={{ color: 'var(--color-text-muted)' }}>(optional)</span>
              </span>
              <select
                value={form.budgetRange}
                onChange={(e) => setForm((p) => ({ ...p, budgetRange: e.target.value }))}
                className="mt-1 w-full rounded-2xl border px-3.5 py-2 text-sm outline-none focus:ring-2"
                style={{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
              >
                <option value="">No preference</option>
                {BUDGETS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                Timeline <span className="font-normal" style={{ color: 'var(--color-text-muted)' }}>(optional)</span>
              </span>
              <select
                value={form.timeline}
                onChange={(e) => setForm((p) => ({ ...p, timeline: e.target.value }))}
                className="mt-1 w-full rounded-2xl border px-3.5 py-2 text-sm outline-none focus:ring-2"
                style={{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
              >
                <option value="">No preference</option>
                {TIMELINES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="block">
            <span className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
              Requirements <span className="font-normal" style={{ color: 'var(--color-text-muted)' }}>(optional)</span>
            </span>
            <textarea
              value={form.message}
              onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
              className="mt-1 w-full min-h-[96px] rounded-2xl border px-3.5 py-2 text-sm outline-none focus:ring-2"
              style={{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
              placeholder="Share your goals, required features, and integrations."
            />
          </label>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
                  Services <span className="font-normal" style={{ color: 'var(--color-text-muted)' }}>(optional)</span>
                </p>
                <p className="mt-1 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                  Choose any that apply — you can leave this blank.
                </p>
              </div>
              {selected.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSelected([])}
                  className="shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition hover:opacity-90"
                  style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                >
                  Clear
                </button>
              )}
            </div>
            {selectedLabels.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {selectedLabels.slice(0, 8).map((label) => (
                  <span
                    key={label}
                    className="rounded-full border px-3 py-1 text-xs font-semibold"
                    style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-muted)', color: 'var(--color-text)' }}
                  >
                    {label}
                  </span>
                ))}
                {selectedLabels.length > 8 && (
                  <span className="text-xs" style={{ color: 'var(--color-text-subtle)' }}>
                    +{selectedLabels.length - 8} more
                  </span>
                )}
              </div>
            )}
            <div className="mt-3 space-y-3.5">
              {Array.from(new Set(SERVICES.map((s) => s.group)))
                .filter((group) => group !== 'Other')
                .map((group) => (
                <div key={group}>
                  <details
                    className="rounded-2xl border p-3"
                    style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg)' }}
                  >
                    <summary
                      className="cursor-pointer list-none select-none"
                      style={{ color: 'var(--color-text)' }}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-sm font-semibold">
                          {group}
                        </span>
                        <span className="inline-flex items-center gap-3">
                          <span className="text-xs font-semibold" style={{ color: 'var(--color-text-subtle)' }}>
                            {SERVICES.filter((s) => s.group === group).filter((s) => selected.includes(s.id)).length} selected
                          </span>
                          <svg
                            className="contact-dd-chevron h-4 w-4 transition-transform duration-200"
                            viewBox="0 0 20 20"
                            fill="none"
                            aria-hidden="true"
                            style={{ color: 'var(--color-text-subtle)' }}
                          >
                            <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                      </div>
                    </summary>

                    <div className="mt-3 grid gap-2">
                      {SERVICES.filter((s) => s.group === group).map((s) => {
                        const active = selected.includes(s.id);
                        return (
                          <label
                            key={s.id}
                            className="flex items-start gap-2.5 rounded-xl border px-3 py-2.5 transition"
                            style={{
                              borderColor: active ? 'var(--color-accent-1)' : 'var(--color-border)',
                              backgroundColor: active ? 'var(--color-accent-1-muted)' : 'transparent',
                              cursor: 'pointer',
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={active}
                              onChange={() => toggleService(s.id)}
                              className="mt-1 h-4 w-4"
                            />
                            <span className="min-w-0">
                              <span className="block text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
                                {s.label}
                              </span>
                              <span className="mt-0.5 block text-xs" style={{ color: 'var(--color-text-muted)' }}>
                                {s.description}
                              </span>
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </details>
                </div>
              ))}
            </div>
          </div>

          <label className="flex items-start gap-3 text-sm">
            <input
              type="checkbox"
              checked={form.consent}
              onChange={(e) => setForm((p) => ({ ...p, consent: e.target.checked }))}
              className="mt-1 h-4 w-4"
            />
            <span style={{ color: 'var(--color-text-muted)' }}>
              I agree to be contacted about my request. (We never share your details.)
            </span>
          </label>
        </div>
      </div>

      {status === 'error' && (
        <div className="mt-5 rounded-2xl border px-4 py-3 text-sm" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-muted)', color: 'var(--color-text)' }}>
          {error || 'Please check the form and try again.'}
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs" style={{ color: 'var(--color-text-subtle)' }}>
          Protected against automated submissions. If you have trouble submitting, email us from the footer.
        </p>
        <Button
          type="submit"
          accent="orange"
          className="rounded-full px-7 py-3 text-sm font-semibold text-white"
        >
          {status === 'submitting' ? 'Submitting…' : 'Send message'}
        </Button>
      </div>
    </form>
  );
}

