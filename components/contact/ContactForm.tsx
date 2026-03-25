'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/Button';
import { DotsLoader } from '@/components/ui/DotsLoader';

type ServiceOption = { id: string; label: string; description: string; group: string };

const SERVICES: ServiceOption[] = [
  // MLM & Direct Selling
  { id: 'mlm_software', label: 'MLM Software', description: 'Binary/Matrix/Board plans, genealogy, wallets, dashboards, apps.', group: 'MLM & Direct Selling' },
  { id: 'direct_selling_software', label: 'Direct Selling Software', description: 'Distributor onboarding, inventory, franchise, incentives, compliance.', group: 'MLM & Direct Selling' },
  { id: 'consulting_launch', label: 'Consulting & Business Setup', description: 'Company registration, plan design, SOPs, training & rollout support.', group: 'MLM & Direct Selling' },

  // Software Development
  { id: 'custom_software', label: 'Custom Software Development', description: 'Web apps, portals, automation, integrations.', group: 'Software Development' },
  { id: 'web_development', label: 'Web Development', description: 'Fast websites, landing pages, performance + SEO foundations.', group: 'Software Development' },
  { id: 'mobile_apps', label: 'Mobile App Development', description: 'Android/iOS apps for customers, distributors, and admins.', group: 'Software Development' },
  { id: 'portals_ecommerce', label: 'Shopping/Travel Portals', description: 'Shopping portal & travel portal development with integrations.', group: 'Software Development' },
  { id: 'api_integrations', label: 'API & Payment Integrations', description: 'Payment gateways, SMS/WhatsApp, e-commerce, analytics, CRMs.', group: 'Software Development' },

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
  const [selected, setSelected] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string>('');

  const [form, setForm] = useState({
    name: '',
    email: '',
    countryCode: '+91',
    phone: '',
    company: '',
    website: '',
    message: '',
    budgetRange: 'Not sure',
    timeline: 'Not sure',
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

    if (selected.length === 0) {
      setStatus('error');
      setError('Please select at least 1 service you need.');
      return;
    }

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
        throw new Error(body?.error || 'Submission failed');
      }

      setStatus('success');
    } catch (err: any) {
      setStatus('error');
      setError(err?.message || 'Something went wrong. Please try again.');
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-3xl border p-8 md:p-10" style={{ backgroundColor: 'var(--color-bg-elevated)', borderColor: 'var(--color-border)' }}>
        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-subtle)' }}>
          Submitted
        </p>
        <h2 className="mt-2 text-3xl font-bold" style={{ color: 'var(--color-text)' }}>
          Thanks — we’ll get back quickly.
        </h2>
        <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
          We’ve received your request. A specialist will respond with next steps and a recommended service stack.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button href="/mlm-software" variant="outline" accent="orange" className="rounded-full px-7 py-3">
            Explore MLM Software
          </Button>
          <Button href="/" variant="outline" accent="cyan" className="rounded-full px-7 py-3">
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const selectedLabels = selected
    .map((id) => SERVICES.find((s) => s.id === id)?.label || id)
    .filter(Boolean);

  return (
    <form onSubmit={onSubmit} className="rounded-3xl border p-6 md:p-8" style={{ backgroundColor: 'var(--color-bg-elevated)', borderColor: 'var(--color-border)' }}>
      <style>{`
        details[open] .contact-dd-chevron { transform: rotate(180deg); }
      `}</style>
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-subtle)' }}>
          Contact now
        </p>
        <h2 className="mt-2 text-3xl font-bold" style={{ color: 'var(--color-text)' }}>
          Tell us what you need — services or products.
        </h2>
        <p className="mx-auto mt-2 max-w-3xl text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
          Choose what you need (software, marketing, design, consulting, or an existing product). We’ll respond with the best next step.
        </p>
      </div>

      {/* Honeypot (hidden) */}
      <div className="hidden" aria-hidden="true">
        <label>
          Website
          <input value={form.hp} onChange={(e) => setForm((p) => ({ ...p, hp: e.target.value }))} />
        </label>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <div className="space-y-3">
          <div className="mb-2">
            <p className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>Your details</p>
            <p className="mt-1 text-xs" style={{ color: 'var(--color-text-muted)' }}>
              Share the best contact information so we can reply quickly.
            </p>
          </div>

          <label className="block">
            <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>Full name</span>
            <input
              required
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              className="mt-1.5 w-full rounded-2xl border px-4 py-2.5 text-sm outline-none focus:ring-2"
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
              className="mt-1.5 w-full rounded-2xl border px-4 py-2.5 text-sm outline-none focus:ring-2"
              style={{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
              placeholder="name@company.com"
            />
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>Phone (optional)</span>
              <div className="mt-1.5 flex gap-2">
                <select
                  value={form.countryCode}
                  onChange={(e) => setForm((p) => ({ ...p, countryCode: e.target.value }))}
                  className="w-28 rounded-2xl border px-3 py-2.5 text-sm outline-none focus:ring-2"
                  style={{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                >
                  <option value="+91">🇮🇳 +91</option>
                  <option value="+1">🇺🇸 +1</option>
                  <option value="+44">🇬🇧 +44</option>
                  <option value="+971">🇦🇪 +971</option>
                  <option value="+61">🇦🇺 +61</option>
                  <option value="+65">🇸🇬 +65</option>
                  <option value="+other">Other</option>
                </select>
                <input
                  value={form.phone}
                  onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                  className="flex-1 rounded-2xl border px-4 py-2.5 text-sm outline-none focus:ring-2"
                  style={{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                  placeholder="Phone number"
                />
              </div>
            </label>
            <label className="block">
              <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>Company (optional)</span>
              <input
                value={form.company}
                onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))}
                className="mt-1.5 w-full rounded-2xl border px-4 py-2.5 text-sm outline-none focus:ring-2"
                style={{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                placeholder="Company name"
              />
            </label>
          </div>

          <label className="block">
            <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>Website (optional)</span>
            <input
              value={form.website}
              onChange={(e) => setForm((p) => ({ ...p, website: e.target.value }))}
              className="mt-1.5 w-full rounded-2xl border px-4 py-2.5 text-sm outline-none focus:ring-2"
              style={{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
              placeholder="https://"
            />
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>Budget</span>
              <select
                value={form.budgetRange}
                onChange={(e) => setForm((p) => ({ ...p, budgetRange: e.target.value }))}
                className="mt-1.5 w-full rounded-2xl border px-4 py-2.5 text-sm outline-none focus:ring-2"
                style={{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
              >
                {BUDGETS.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>Timeline</span>
              <select
                value={form.timeline}
                onChange={(e) => setForm((p) => ({ ...p, timeline: e.target.value }))}
                className="mt-1.5 w-full rounded-2xl border px-4 py-2.5 text-sm outline-none focus:ring-2"
                style={{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
              >
                {TIMELINES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </label>
          </div>

          <label className="block">
            <span className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>Project details</span>
            <textarea
              value={form.message}
              onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
              className="mt-1.5 w-full min-h-[120px] rounded-2xl border px-4 py-2.5 text-sm outline-none focus:ring-2"
              style={{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
              placeholder="Example: compensation plan, distributor levels, required integrations (payment/SMS/WhatsApp), admin dashboard needs..."
            />
          </label>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>What you need</p>
                <p className="mt-1 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                  Pick one or more. This helps us route your request to the right specialist team.
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
              <div className="mt-3 flex flex-wrap gap-2">
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
            <div className="mt-4 space-y-5">
              {Array.from(new Set(SERVICES.map((s) => s.group))).map((group) => (
                <div key={group}>
                  <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-subtle)' }}>
                    {group}
                  </p>
                  <details
                    className="mt-3 rounded-2xl border p-4"
                    style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg)' }}
                    open={group === 'MLM & Direct Selling'}
                  >
                    <summary
                      className="cursor-pointer list-none select-none"
                      style={{ color: 'var(--color-text)' }}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-sm font-semibold">
                          Select from {group}
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

                    <div className="mt-4 grid gap-3">
                      {SERVICES.filter((s) => s.group === group).map((s) => {
                        const active = selected.includes(s.id);
                        return (
                          <label
                            key={s.id}
                            className="flex items-start gap-3 rounded-xl border px-4 py-3 transition"
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
                              <span className="mt-1 block text-xs" style={{ color: 'var(--color-text-muted)' }}>
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

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <p className="text-xs" style={{ color: 'var(--color-text-subtle)' }}>
          Protected against automated submissions. If you have trouble submitting, email us from the footer.
        </p>
        <Button
          type="submit"
          accent="orange"
          className="rounded-full px-8 py-3.5 text-sm font-semibold text-white"
        >
          {status === 'submitting' ? (
            <span className="inline-flex items-center gap-3">
              <DotsLoader size="sm" color="currentColor" label="Submitting" />
              Submitting…
            </span>
          ) : (
            'Send message'
          )}
        </Button>
      </div>
    </form>
  );
}

