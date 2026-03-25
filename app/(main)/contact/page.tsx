import Link from 'next/link';
import { ContactForm } from '@/components/contact/ContactForm';
import { Button } from '@/components/Button';
import { IconArrowRight } from '@/components/ui/Icons';

export const metadata = {
  title: 'Contact – Vista Neotech',
  description: 'Contact Vista Neotech for software development, MLM & direct selling solutions, digital marketing, design services, and product support. Get a quick response and a tailored proposal.',
};

function InfoCard({ label, value, hint }: { label: unknown; value: unknown; hint: unknown }) {
  const s = (x: unknown) => (typeof x === 'string' ? x : '');
  return (
    <div className="rounded-3xl border p-6 transition hover:-translate-y-0.5 hover:shadow-lg" style={{ backgroundColor: 'var(--color-bg-elevated)', borderColor: 'var(--color-border)' }}>
      <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-subtle)' }}>{s(label)}</p>
      <p className="mt-2 text-base font-semibold" style={{ color: 'var(--color-text)' }}>{s(value)}</p>
      <p className="mt-1 text-sm" style={{ color: 'var(--color-text-muted)' }}>{s(hint)}</p>
    </div>
  );
}

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden pt-24 pb-10" style={{ backgroundColor: 'var(--color-hero-bg)' }}>
        <div className="absolute inset-0 overflow-hidden opacity-30">
          <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full blur-3xl" style={{ backgroundColor: 'var(--color-accent-1-muted)' }} />
          <div className="absolute -left-40 bottom-0 h-96 w-96 rounded-full blur-3xl" style={{ backgroundColor: 'var(--color-accent-2-muted)' }} />
        </div>

        <div className="container-tight relative z-10">
          <nav className="mb-8 flex items-center gap-2 text-sm" aria-label="Breadcrumb">
            <Link href="/" className="transition hover:opacity-80" style={{ color: 'var(--color-text-muted)' }}>
              Home
            </Link>
            <span style={{ color: 'var(--color-text-muted)' }}>/</span>
            <span style={{ color: 'var(--color-text)' }}>Contact</span>
          </nav>

          <span
            className="overline-lg mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-2.5 backdrop-blur-sm"
            style={{
              borderColor: 'var(--color-border)',
              backgroundColor: 'var(--color-accent-1-muted)',
              color: 'var(--color-hero-text)',
            }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: 'var(--color-accent-1)' }} />
            Contact Now
          </span>

          <h1 className="display-1 max-w-4xl" style={{ color: 'var(--color-hero-text)' }}>
            Let’s build, market, or design what your business needs next.
          </h1>
          <p className="prose-lead mt-6 max-w-3xl" style={{ color: 'var(--color-hero-text-muted)' }}>
            Share your requirements and select what you need—software, marketing, design, consulting, or support for our products. We’ll respond with a clear plan and next steps.
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <InfoCard label="Response time" value="Fast" hint="Typically within the same business day." />
            <InfoCard label="Covers" value="All services + products" hint="Software, marketing, design, consulting, support." />
            <InfoCard label="You get" value="Clear next step" hint="Recommendation, scope, timeline, demo/proposal." />
          </div>
        </div>
      </section>

      {/* Form + Side content */}
      <section className="section-padding" style={{ backgroundColor: 'var(--color-bg)' }}>
        <div className="container-wide">
          <div className="grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-12">
              <ContactForm />
            </div>

            {/* Move sidebar below form so the form can use full width */}
            <aside className="lg:col-span-12 h-fit space-y-3">
              <div className="rounded-3xl border p-7" style={{ backgroundColor: 'var(--color-bg-elevated)', borderColor: 'var(--color-border)' }}>
                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-subtle)' }}>
                  What happens next
                </p>
                <ol className="mt-4 space-y-3 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  <li><span className="font-semibold" style={{ color: 'var(--color-text)' }}>1.</span> We review your goals and required services.</li>
                  <li><span className="font-semibold" style={{ color: 'var(--color-text)' }}>2.</span> We recommend modules, integrations, and plan fit.</li>
                  <li><span className="font-semibold" style={{ color: 'var(--color-text)' }}>3.</span> You receive a scope + timeline + demo plan.</li>
                </ol>
                <div className="mt-6 rounded-2xl p-4" style={{ backgroundColor: 'var(--color-bg-muted)' }}>
                  <p className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
                    Prefer WhatsApp?
                  </p>
                  <p className="mt-1 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                    Message us your requirement and the services/products you need.
                  </p>
                  <a
                    href="https://api.whatsapp.com/send/?phone=918800681384&text=Hi%20Vista%20Neotech%2C%20I%20want%20to%20enquire%20about%20your%20services%20and%20products."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex w-full items-center justify-center rounded-full px-6 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
                    style={{ backgroundColor: 'var(--color-accent-3)' }}
                  >
                    WhatsApp Us
                  </a>
                </div>
              </div>

              <div className="rounded-3xl border p-7" style={{ backgroundColor: 'var(--color-bg-elevated)', borderColor: 'var(--color-border)' }}>
                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-subtle)' }}>
                  Explore
                </p>
                <div className="mt-4 space-y-3">
                  <Link
                    href="/mlm-software"
                    className="group flex items-center justify-between rounded-2xl border px-4 py-3 transition hover:shadow-lg"
                    style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                  >
                    <span className="text-sm font-semibold">MLM Software</span>
                    <IconArrowRight size="sm" className="transition-transform group-hover:translate-x-1" />
                  </Link>
                  <Link
                    href="/software-development"
                    className="group flex items-center justify-between rounded-2xl border px-4 py-3 transition hover:shadow-lg"
                    style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                  >
                    <span className="text-sm font-semibold">Software Development</span>
                    <IconArrowRight size="sm" className="transition-transform group-hover:translate-x-1" />
                  </Link>
                  <Link
                    href="/seo-services"
                    className="group flex items-center justify-between rounded-2xl border px-4 py-3 transition hover:shadow-lg"
                    style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                  >
                    <span className="text-sm font-semibold">SEO Services</span>
                    <IconArrowRight size="sm" className="transition-transform group-hover:translate-x-1" />
                  </Link>
                  <Link
                    href="/graphic-designing"
                    className="group flex items-center justify-between rounded-2xl border px-4 py-3 transition hover:shadow-lg"
                    style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                  >
                    <span className="text-sm font-semibold">Design Services</span>
                    <IconArrowRight size="sm" className="transition-transform group-hover:translate-x-1" />
                  </Link>
                  <Link
                    href="/brands/aimlmsoftware"
                    className="group flex items-center justify-between rounded-2xl border px-4 py-3 transition hover:shadow-lg"
                    style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                  >
                    <span className="text-sm font-semibold">AIMLM Software (Product)</span>
                    <IconArrowRight size="sm" className="transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
                <div className="mt-6">
                  <Button href="/mlm-software-direct-selling-consultant" variant="outline" accent="orange" className="w-full rounded-full py-3">
                    View service overview
                  </Button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}

