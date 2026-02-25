'use client';

import Link from 'next/link';
import { Button } from '@/components/Button';
import { PageCTA } from '@/components/ui/PageCTA';
import { ProsePageContent } from '@/components/ui/ProsePageContent';
import { IconArrowRight } from '@/components/ui/Icons';

export interface AboutUsPageProps {
  title: string;
  description: string | null;
  html: string | null;
  canonicalUrl: string;
  focusKeyword?: string | null;
  preservedUrl?: string | null;
}

/** Curated internal links for About Us – SEO and discovery */
const ABOUT_INTERNAL_LINKS: { href: string; title: string; description: string }[] = [
  { href: '/contact', title: 'Contact Us', description: 'Get in touch for software, consulting, or support.' },
  { href: '/mlm-software-direct-selling-consultant', title: 'Services Overview', description: 'Software, consultancy, design & digital solutions across sectors.' },
  { href: '/software-development', title: 'Software Development', description: 'Custom web, mobile, and API development.' },
  { href: '/mlm-software', title: 'MLM & Direct Selling Software', description: 'Our expertise: end-to-end direct selling and MLM solutions.' },
  { href: '/direct-selling-consultant-mlm', title: 'Direct Selling Consultant', description: 'Strategy, compensation plans, and compliance advisory.' },
  { href: '/seo-services', title: 'SEO & Digital Marketing', description: 'On-page SEO, SEM, and SMO services.' },
];

export function AboutUsPage({
  title,
  description,
  html,
  canonicalUrl,
  focusKeyword,
  preservedUrl,
}: AboutUsPageProps) {
  const aboutPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: title,
    description: description || undefined,
    url: canonicalUrl,
    mainEntity: {
      '@type': 'Organization',
      name: 'Vista Neotech',
      url: canonicalUrl.replace(/\/about-us\/?$/, ''),
      description: description || undefined,
    },
  };

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description: description || undefined,
    url: canonicalUrl,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />

      {/* Hero – ultra-modern */}
      <section
        className="relative min-h-[65vh] overflow-hidden pt-24 pb-20"
        style={{ backgroundColor: 'var(--color-hero-bg)', color: 'var(--color-hero-text)' }}
      >
        <div className="absolute inset-0 overflow-hidden opacity-40">
          <div
            className="absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full blur-3xl"
            style={{ backgroundColor: 'var(--color-accent-1-muted)' }}
          />
          <div
            className="absolute -left-24 bottom-0 h-80 w-80 rounded-full blur-3xl"
            style={{ backgroundColor: 'var(--color-accent-2-muted)' }}
          />
        </div>

        <div className="container-tight relative z-10 flex min-h-[55vh] flex-col justify-center">
          <nav className="mb-8 flex items-center gap-2 text-sm" aria-label="Breadcrumb">
            <Link href="/" className="transition hover:opacity-80" style={{ color: 'var(--color-text-muted)' }}>
              Home
            </Link>
            <span style={{ color: 'var(--color-text-muted)' }}>/</span>
            <span style={{ color: 'var(--color-text)' }}>About Us</span>
          </nav>

          <span
            className="overline-lg mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-2.5"
            style={{
              borderColor: 'var(--color-border)',
              backgroundColor: 'var(--color-accent-1-muted)',
              color: 'var(--color-hero-text)',
            }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: 'var(--color-accent-1)' }} />
            Who we are
          </span>

          <h1 className="display-1 mb-6 max-w-4xl" style={{ color: 'var(--color-hero-text)' }}>
            {title}
          </h1>
          {description && (
            <p className="prose-lead mb-10 max-w-3xl" style={{ color: 'var(--color-hero-text-muted)' }}>
              {description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4">
            <Button
              href="/contact"
              accent="orange"
              className="rounded-full px-8 py-4 text-base font-semibold text-white"
            >
              Get in Touch
            </Button>
            <Button
              href="/mlm-software-direct-selling-consultant"
              variant="outline-hero"
              className="rounded-full px-8 py-4 text-base font-semibold"
            >
              View Our Services
            </Button>
          </div>
        </div>
      </section>

      {/* Value strip – optional stats / differentiators */}
      <section
        className="border-y py-12 md:py-16"
        style={{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)' }}
      >
        <div className="container-wide">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="text-center">
              <p className="display-3 mb-1" style={{ color: 'var(--color-accent-1)' }}>Excellence</p>
              <p className="text-sm font-medium" style={{ color: 'var(--color-text-muted)' }}>In pursuit of</p>
            </div>
            <div className="text-center">
              <p className="display-3 mb-1" style={{ color: 'var(--color-accent-2)' }}>Software</p>
              <p className="text-sm font-medium" style={{ color: 'var(--color-text-muted)' }}>Web, mobile & cloud</p>
            </div>
            <div className="text-center">
              <p className="display-3 mb-1" style={{ color: 'var(--color-accent-3)' }}>Consulting</p>
              <p className="text-sm font-medium" style={{ color: 'var(--color-text-muted)' }}>Direct selling & strategy</p>
            </div>
            <div className="text-center">
              <p className="display-3 mb-1" style={{ color: 'var(--color-accent-5)' }}>Support</p>
              <p className="text-sm font-medium" style={{ color: 'var(--color-text-muted)' }}>End-to-end</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main content – elevated card */}
      <section
        className="section-padding"
        style={{ backgroundColor: 'var(--color-bg-muted)', color: 'var(--color-text)' }}
      >
        <div className="container-tight">
          <div
            className="rounded-3xl border p-8 md:p-12 lg:p-16"
            style={{
              backgroundColor: 'var(--color-bg-elevated)',
              borderColor: 'var(--color-border)',
            }}
          >
            <ProsePageContent
              html={html}
              focusKeyword={focusKeyword}
              preservedUrl={preservedUrl}
            />
          </div>
        </div>
      </section>

      {/* Internal links – SEO: more internal links from About Us */}
      <section
        className="section-padding"
        style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}
      >
        <div className="container-tight">
          <p className="section-label mb-4">Explore</p>
          <h2 className="display-3 mb-4" style={{ color: 'var(--color-text)' }}>
            Our services & contact
          </h2>
          <p className="prose-lead mx-auto mb-10 max-w-2xl" style={{ color: 'var(--color-text-muted)' }}>
            We offer <Link href="/software-development" className="font-semibold underline underline-offset-2">software development</Link>,{' '}
            <Link href="/seo-services" className="font-semibold underline underline-offset-2">digital marketing</Link>, and{' '}
            <Link href="/graphic-designing" className="font-semibold underline underline-offset-2">design</Link> across sectors—with deep expertise in{' '}
            <Link href="/mlm-software" className="font-semibold underline underline-offset-2">MLM & direct selling</Link> and{' '}
            <Link href="/direct-selling-consultant-mlm" className="font-semibold underline underline-offset-2">consultancy</Link>.{' '}
            <Link href="/contact" className="font-semibold underline underline-offset-2">Contact us</Link> for a quote.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ABOUT_INTERNAL_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group flex items-start gap-4 rounded-2xl border p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                style={{
                  backgroundColor: 'var(--color-bg-elevated)',
                  borderColor: 'var(--color-border)',
                }}
              >
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110"
                  style={{
                    backgroundColor: 'var(--color-accent-1-muted)',
                    color: 'var(--color-accent-1)',
                  }}
                >
                  <IconArrowRight size="sm" className="rotate-[-90deg] sm:rotate-0" />
                </span>
                <div className="min-w-0 flex-1">
                  <h3
                    className="font-semibold transition-colors duration-300 group-hover:text-[var(--color-accent-1)]"
                    style={{ color: 'var(--color-text)' }}
                  >
                    {typeof link.title === 'string' ? link.title : ''}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                    {typeof link.description === 'string' ? link.description : ''}
                  </p>
                </div>
                <IconArrowRight
                  size="sm"
                  className="mt-1 shrink-0 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100"
                  style={{ color: 'var(--color-accent-1)' }}
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Strong CTA – gradient border, prominent */}
      <section
        className="section-padding"
        style={{ backgroundColor: 'var(--color-bg-muted)', color: 'var(--color-text)' }}
      >
        <div className="container-tight">
          <div className="gradient-border rounded-3xl p-8 md:p-12 lg:p-16">
            <PageCTA
              headline="Ready to build, market, or grow with us?"
              supportingText="Software, digital marketing, design, or direct selling and MLM solutions—we're a full-service IT partner. Get a clear proposal and next steps."
              primaryLabel="Start a conversation"
              primaryHref="/contact"
              secondaryLabel="View all services"
              secondaryHref="/mlm-software-direct-selling-consultant"
            />
          </div>
        </div>
      </section>
    </>
  );
}
