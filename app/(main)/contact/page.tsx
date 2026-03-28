import Link from 'next/link';
import { ContactForm } from '@/components/contact/ContactForm';
import { Button } from '@/components/Button';
import { IconArrowRight, IconFacebook, IconInstagram, IconLinkedIn, IconMail, IconPhone, IconYouTube } from '@/components/ui/Icons';

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
      {/* Hero — compact so the form owns attention */}
      <section className="relative overflow-hidden pt-20 pb-5 md:pt-22 md:pb-6" style={{ backgroundColor: 'var(--color-hero-bg)' }}>
        <div className="absolute inset-0 overflow-hidden opacity-30">
          <div className="absolute -right-40 -top-40 h-72 w-72 rounded-full blur-3xl md:h-80 md:w-80" style={{ backgroundColor: 'var(--color-accent-1-muted)' }} />
          <div className="absolute -left-40 bottom-0 h-72 w-72 rounded-full blur-3xl md:h-80 md:w-80" style={{ backgroundColor: 'var(--color-accent-2-muted)' }} />
        </div>

        <div className="container-wide relative z-10">
          <nav className="mb-3 flex items-center gap-2 text-xs md:text-sm" aria-label="Breadcrumb">
            <Link href="/" className="transition hover:opacity-80" style={{ color: 'var(--color-text-muted)' }}>
              Home
            </Link>
            <span style={{ color: 'var(--color-text-muted)' }}>/</span>
            <span style={{ color: 'var(--color-text)' }}>Contact</span>
          </nav>

          <span
            className="overline mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 backdrop-blur-sm"
            style={{
              borderColor: 'var(--color-border)',
              backgroundColor: 'var(--color-accent-1-muted)',
              color: 'var(--color-hero-text)',
            }}
          >
            <span className="h-1 w-1 rounded-full" style={{ backgroundColor: 'var(--color-accent-1)' }} />
            Contact Now
          </span>

          <h1 className="display-3 max-w-3xl" style={{ color: 'var(--color-hero-text)' }}>
            Let’s build, market, or design what your business needs next.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed md:text-base" style={{ color: 'var(--color-hero-text-muted)' }}>
            Share your requirements and select what you need—software, marketing, design, consulting, or support for our products. We’ll respond with a clear plan and next steps.
          </p>
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
            <aside className="lg:col-span-12 grid gap-3 md:grid-cols-2">
              <div className="rounded-3xl border p-7 h-full" style={{ backgroundColor: 'var(--color-bg-elevated)', borderColor: 'var(--color-border)' }}>
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

              <div className="rounded-3xl border p-7 h-full" style={{ backgroundColor: 'var(--color-bg-elevated)', borderColor: 'var(--color-border)' }}>
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

            <div className="lg:col-span-12">
              <div className="rounded-3xl border p-7" style={{ backgroundColor: 'var(--color-bg-elevated)', borderColor: 'var(--color-border)' }}>
                <div className="grid gap-5 lg:grid-cols-12 lg:items-stretch">
                  <div className="min-w-0 lg:col-span-4 xl:col-span-3">
                    <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-subtle)' }}>
                      Map
                    </p>
                    <p className="mt-2 text-base font-semibold" style={{ color: 'var(--color-text)' }}>
                      Vista Neotech Pvt Ltd
                    </p>
                    <p className="mt-1 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                      5th Floor, Jaina Tower 1, 517, Janakpuri District Center, Janakpuri, New Delhi, Delhi, 110058
                    </p>
                    <div className="mt-2 space-y-1.5 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                      <p>
                        <a
                          href="mailto:info@vistaneotech.com"
                          className="inline-flex items-center gap-2 font-semibold transition hover:opacity-80"
                          style={{ color: 'var(--color-text)' }}
                        >
                          <IconMail size="sm" style={{ color: 'var(--color-accent-2)' }} />
                          info@vistaneotech.com
                        </a>
                      </p>
                      <p>
                        <a
                          href="tel:+919811190082"
                          className="inline-flex items-center gap-2 font-semibold transition hover:opacity-80"
                          style={{ color: 'var(--color-text)' }}
                        >
                          <IconPhone size="sm" style={{ color: 'var(--color-accent-3)' }} />
                          098111 90082
                        </a>
                      </p>
                      <p>Open · Closes 7 pm</p>
                    </div>

                    <div className="mt-4">
                      <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-subtle)' }}>
                        Social
                      </p>
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        <a
                          href="https://www.linkedin.com/search/results/all/?keywords=Vista%20Neotech"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition hover:opacity-90"
                          style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                        >
                          <IconLinkedIn size="sm" style={{ color: 'var(--color-accent-2)' }} />
                          LinkedIn
                        </a>
                        <a
                          href="https://www.instagram.com/explore/search/keyword/?q=Vista%20Neotech"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition hover:opacity-90"
                          style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                        >
                          <IconInstagram size="sm" style={{ color: 'var(--color-accent-1)' }} />
                          Instagram
                        </a>
                        <a
                          href="https://www.facebook.com/search/top?q=Vista%20Neotech"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition hover:opacity-90"
                          style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                        >
                          <IconFacebook size="sm" style={{ color: 'var(--color-accent-2)' }} />
                          Facebook
                        </a>
                        <a
                          href="https://www.youtube.com/results?search_query=Vista%20Neotech"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition hover:opacity-90"
                          style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                        >
                          <IconYouTube size="sm" style={{ color: 'var(--color-accent-1)' }} />
                          YouTube
                        </a>
                      </div>
                    </div>
                    <a
                      href="https://www.google.com/maps?q=MLM%20Software%20%26%20MLM%20Consultant%20%7C%20Vista%20Neotech%20Pvt%20Ltd%2C%205th%20Floor%2C%20Jaina%20Tower%201%2C%20517%2C%20Janakpuri%20District%20Center%2C%20Janakpuri%2C%20New%20Delhi%2C%20Delhi%2C%20110058&z=16"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex w-full items-center justify-center rounded-full border px-5 py-2.5 text-sm font-semibold transition hover:opacity-90"
                      style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                    >
                      Open in Google Maps
                    </a>
                  </div>

                  <div className="relative overflow-hidden rounded-2xl border lg:col-span-8 xl:col-span-9" style={{ borderColor: 'var(--color-border)' }}>
                    <iframe
                      title="Vista Neotech location map"
                      src="https://www.google.com/maps?q=MLM%20Software%20%26%20MLM%20Consultant%20%7C%20Vista%20Neotech%20Pvt%20Ltd%2C%205th%20Floor%2C%20Jaina%20Tower%201%2C%20517%2C%20Janakpuri%20District%20Center%2C%20Janakpuri%2C%20New%20Delhi%2C%20Delhi%2C%20110058&z=16&output=embed"
                      className="h-[320px] w-full lg:h-[360px] xl:h-[400px]"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

