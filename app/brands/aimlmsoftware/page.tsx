import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/Button';
import { IconArrowRight } from '@/components/ui/Icons';

export const metadata: Metadata = {
  title: 'AIMLM Software - AI-Powered MLM Software | Vista Neotech',
  description:
    'AI-powered MLM Software dedicated to the Direct Selling Industry. Combining cutting-edge AI technology with 25 years of Vista\'s experience.',
  openGraph: {
    title: 'AIMLM Software - AI-Powered MLM Software',
    description: 'Revolutionizing network marketing with AI technology and 25 years of expertise.',
  },
};

const features = [
  {
    title: 'AI-Powered Compensation',
    description: 'Intelligent compensation plan calculation with predictive analytics and automated payouts.',
    icon: '🤖',
  },
  {
    title: 'Advanced Genealogy Management',
    description: 'Visual genealogy trees with real-time tracking, performance analytics, and team management tools.',
    icon: '🌳',
  },
  {
    title: 'Compliance & Legal Support',
    description: 'Built-in compliance checks, legal documentation, and regulatory adherence for direct selling.',
    icon: '⚖️',
  },
  {
    title: 'Distributor Portal',
    description: 'Comprehensive self-service portal with analytics, training resources, and commission tracking.',
    icon: '👥',
  },
  {
    title: 'Real-Time Analytics',
    description: 'Advanced reporting dashboards with AI insights, trend analysis, and performance metrics.',
    icon: '📊',
  },
  {
    title: 'Mobile-First Design',
    description: 'Fully responsive platform accessible on any device, ensuring your team stays connected.',
    icon: '📱',
  },
];

const benefits = [
  '25 Years of Vista\'s Industry Experience',
  'Cutting-Edge AI Technology',
  'Scalable Architecture',
  '24/7 Support & Training',
  'Customizable Solutions',
  'Enterprise-Grade Security',
];

export default function AIMLSoftwarePage() {
  return (
    <>
      {/* Hero Section */}
      <section
        className="relative min-h-[70vh] overflow-hidden pt-24 pb-16"
        style={{ backgroundColor: 'var(--color-hero-bg)' }}
      >
        <div className="absolute inset-0 overflow-hidden opacity-30">
          <div
            className="absolute -right-40 -top-40 h-96 w-96 rounded-full blur-3xl"
            style={{ backgroundColor: 'var(--color-accent-1-muted)' }}
          />
          <div
            className="absolute -left-40 bottom-0 h-96 w-96 rounded-full blur-3xl"
            style={{ backgroundColor: 'var(--color-accent-1-muted)' }}
          />
        </div>
        <div className="container-tight relative z-10 flex min-h-[60vh] flex-col items-center justify-center text-center">
          <div
            className="mb-8 flex h-40 w-40 items-center justify-center rounded-3xl transition-transform hover:scale-110"
            style={{ backgroundColor: 'color-mix(in srgb, var(--color-accent-1-muted) 82%, #000 18%)' }}
          >
            <Image
              src="/images/aimlmsoftware_logo.png"
              alt="AIMLM Software Logo"
              width={160}
              height={160}
              className="h-32 w-32 object-contain"
              unoptimized
            />
          </div>
          <h1 className="display-1 mb-6 max-w-4xl" style={{ color: 'var(--color-hero-text)' }}>
            AIMLM Software
          </h1>
          <p className="prose-lead mx-auto mb-8 max-w-3xl" style={{ color: 'var(--color-hero-text-muted)' }}>
            AI-powered MLM Software dedicated to the Direct Selling Industry. Combining cutting-edge AI technology with
            25 years of Vista&apos;s experience to revolutionize network marketing.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button
              href="https://www.aimlmsoftware.com"
              accent="orange"
              className="rounded-full px-8 py-4 text-base font-semibold text-white"
            >
              Visit Website
            </Button>
            <Button
              href="/contact"
              variant="outline-hero"
              className="rounded-full px-8 py-4 text-base font-semibold"
            >
              Get in Touch
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="section-padding" style={{ backgroundColor: 'var(--color-bg)' }}>
        <div className="container-wide">
          <div className="mb-16 text-center">
            <p className="section-label mb-4">Features</p>
            <h2 className="display-3 mb-6" style={{ color: 'var(--color-text)' }}>
              Powerful Tools for Direct Selling Success
            </h2>
            <p className="prose-lead mx-auto max-w-2xl" style={{ color: 'var(--color-text-muted)' }}>
              Everything you need to manage, grow, and scale your MLM business with AI-powered intelligence.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl border p-8 transition-all duration-300 hover:shadow-xl"
                style={{
                  backgroundColor: 'var(--color-bg-elevated)',
                  borderColor: 'var(--color-border)',
                  borderLeftWidth: '4px',
                  borderLeftColor: 'var(--color-accent-1)',
                }}
              >
                <div
                  className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl text-3xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                  style={{ backgroundColor: 'var(--color-accent-1-muted)' }}
                >
                  {feature.icon}
                </div>
                <h3 className="mb-3 text-xl font-bold" style={{ color: 'var(--color-text)' }}>
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section-padding" style={{ backgroundColor: 'var(--color-bg-muted)' }}>
        <div className="container-tight">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <div>
              <p className="section-label mb-4">Why Choose AIMLM Software</p>
              <h2 className="display-3 mb-6" style={{ color: 'var(--color-text)' }}>
                Built on Experience, Powered by Innovation
              </h2>
              <p className="prose-lead mb-8" style={{ color: 'var(--color-text-muted)' }}>
                Leverage 25 years of Vista&apos;s expertise in the direct selling industry, enhanced with modern AI
                capabilities for unprecedented performance.
              </p>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span
                      className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm font-semibold"
                      style={{
                        backgroundColor: 'var(--color-accent-1-muted)',
                        color: 'var(--color-accent-1)',
                      }}
                    >
                      ✓
                    </span>
                    <span className="text-base" style={{ color: 'var(--color-text)' }}>
                      {benefit}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div
              className="relative overflow-hidden rounded-3xl border p-8 md:p-12"
              style={{
                backgroundColor: 'var(--color-bg-elevated)',
                borderColor: 'var(--color-border)',
              }}
            >
              <div
                className="absolute -right-20 -top-20 h-64 w-64 rounded-full blur-3xl opacity-50"
                style={{ backgroundColor: 'var(--color-accent-1-muted)' }}
              />
              <div className="relative z-10">
                <h3 className="mb-6 text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
                  Experience the Future of MLM
                </h3>
                <p className="mb-8 text-base leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                  Join leading direct selling companies who trust AIMLM Software to power their network marketing
                  operations.
                </p>
                <Button
                  href="https://www.aimlmsoftware.com"
                  accent="orange"
                  className="rounded-full px-8 py-4 text-base font-semibold text-white"
                >
                  Explore Platform
                  <IconArrowRight size="sm" className="ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding" style={{ backgroundColor: 'var(--color-bg)' }}>
        <div className="container-tight">
          <div
            className="gradient-border relative overflow-hidden rounded-3xl p-8 md:p-12 lg:p-16"
            style={{ background: 'var(--color-bg-elevated)' }}
          >
            <div
              className="absolute inset-0 opacity-60"
              style={{
                background: `
                  radial-gradient(ellipse 80% 50% at 50% 50%, var(--color-accent-1-muted) 0%, transparent 50%)
                `,
              }}
            />
            <div className="relative text-center">
              <h2 className="display-2 mb-4" style={{ color: 'var(--color-text)' }}>
                Ready to Transform Your MLM Business?
              </h2>
              <p className="prose-lead mx-auto mb-8 max-w-xl" style={{ color: 'var(--color-text-muted)' }}>
                Discover how AIMLM Software can revolutionize your direct selling operations with AI-powered solutions.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Button
                  href="https://www.aimlmsoftware.com"
                  accent="orange"
                  className="rounded-full px-8 py-4 text-base font-semibold text-white"
                >
                  Visit Website
                </Button>
                <Button
                  href="/contact"
                  variant="outline"
                  accent="orange"
                  className="rounded-full px-8 py-4 text-base font-semibold"
                >
                  Contact Us
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
