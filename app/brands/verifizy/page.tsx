import type { Metadata } from 'next';
import Image from 'next/image';
import { Button } from '@/components/Button';
import { IconArrowRight } from '@/components/ui/Icons';

export const metadata: Metadata = {
  title: 'Verifizy - KYC & Digital Identity Verification | Vista Neotech',
  description:
    'KYC, Fintech automation, digital identity verification, and compliance onboarding system. API providers for PAN, Aadhar, Voter Card, Passport, and Bank Account Verification.',
  openGraph: {
    title: 'Verifizy - Digital Identity Verification Platform',
    description: 'Streamline KYC and compliance with automated digital identity verification.',
  },
};

const services = [
  {
    title: 'PAN Verification',
    description: 'Instant PAN card verification with real-time validation and fraud detection.',
    icon: '🆔',
  },
  {
    title: 'Aadhar Verification',
    description: 'Secure Aadhar card verification with biometric authentication support.',
    icon: '📱',
  },
  {
    title: 'Voter Card Verification',
    description: 'Quick voter ID verification for electoral and identity validation purposes.',
    icon: '🗳️',
  },
  {
    title: 'Passport Verification',
    description: 'Comprehensive passport verification with document authenticity checks.',
    icon: '📘',
  },
  {
    title: 'Bank Account Verification',
    description: 'Secure bank account verification with instant validation and KYC compliance.',
    icon: '🏦',
  },
  {
    title: 'Compliance Onboarding',
    description: 'Automated compliance workflows for seamless customer onboarding processes.',
    icon: '✅',
  },
];

const features = [
  'Real-time Verification',
  'API-First Architecture',
  'Bank-Grade Security',
  'GDPR & Data Privacy Compliant',
  '99.9% Uptime SLA',
  '24/7 Support',
];

export default function VerifizyPage() {
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
            style={{ backgroundColor: 'var(--color-accent-3-muted)' }}
          />
          <div
            className="absolute -left-40 bottom-0 h-96 w-96 rounded-full blur-3xl"
            style={{ backgroundColor: 'var(--color-accent-3-muted)' }}
          />
        </div>
        <div className="container-tight relative z-10 flex min-h-[60vh] flex-col items-center justify-center text-center">
          <div
            className="mb-8 flex h-24 w-24 items-center justify-center rounded-3xl transition-transform hover:scale-110"
            style={{ backgroundColor: 'var(--color-accent-3-muted)' }}
          >
            <Image
              src="/images/verifizy_logo.png"
              alt="Verifizy Logo"
              width={80}
              height={80}
              className="object-contain"
              unoptimized
            />
          </div>
          <h1 className="display-1 mb-6 max-w-4xl" style={{ color: 'var(--color-hero-text)' }}>
            Verifizy
          </h1>
          <p className="prose-lead mx-auto mb-8 max-w-3xl" style={{ color: 'var(--color-hero-text-muted)' }}>
            KYC, Fintech automation, digital identity verification, and compliance onboarding system. API providers for
            PAN, Aadhar, Voter Card, Passport, and Bank Account Verification.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button
              href="https://www.verifizy.com"
              accent="green"
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

      {/* Services Grid */}
      <section className="section-padding" style={{ backgroundColor: 'var(--color-bg)' }}>
        <div className="container-wide">
          <div className="mb-16 text-center">
            <p className="section-label mb-4">Verification Services</p>
            <h2 className="display-3 mb-6" style={{ color: 'var(--color-text)' }}>
              Complete Identity Verification Suite
            </h2>
            <p className="prose-lead mx-auto max-w-2xl" style={{ color: 'var(--color-text-muted)' }}>
              Comprehensive digital identity verification solutions for fintech, banking, and compliance needs.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl border p-8 transition-all duration-300 hover:shadow-xl"
                style={{
                  backgroundColor: 'var(--color-bg-elevated)',
                  borderColor: 'var(--color-border)',
                  borderLeftWidth: '4px',
                  borderLeftColor: 'var(--color-accent-3)',
                }}
              >
                <div
                  className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl text-3xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                  style={{ backgroundColor: 'var(--color-accent-3-muted)' }}
                >
                  {service.icon}
                </div>
                <h3 className="mb-3 text-xl font-bold" style={{ color: 'var(--color-text)' }}>
                  {service.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding" style={{ backgroundColor: 'var(--color-bg-muted)' }}>
        <div className="container-tight">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <div>
              <p className="section-label mb-4">Why Verifizy</p>
              <h2 className="display-3 mb-6" style={{ color: 'var(--color-text)' }}>
                Enterprise-Grade Verification Platform
              </h2>
              <p className="prose-lead mb-8" style={{ color: 'var(--color-text-muted)' }}>
                Built for fintech companies, banks, and enterprises requiring robust KYC and compliance solutions. Fast,
                secure, and reliable identity verification at scale.
              </p>
              <ul className="space-y-4">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span
                      className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm font-semibold"
                      style={{
                        backgroundColor: 'var(--color-accent-3-muted)',
                        color: 'var(--color-accent-3)',
                      }}
                    >
                      ✓
                    </span>
                    <span className="text-base" style={{ color: 'var(--color-text)' }}>
                      {feature}
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
                style={{ backgroundColor: 'var(--color-accent-3-muted)' }}
              />
              <div className="relative z-10">
                <h3 className="mb-6 text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
                  Trusted by Leading Companies
                </h3>
                <p className="mb-8 text-base leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                  Join fintech startups, banks, and enterprises using Verifizy to streamline their KYC and compliance
                  processes.
                </p>
                <Button
                  href="https://www.verifizy.com"
                  accent="green"
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
                  radial-gradient(ellipse 80% 50% at 50% 50%, var(--color-accent-3-muted) 0%, transparent 50%)
                `,
              }}
            />
            <div className="relative text-center">
              <h2 className="display-2 mb-4" style={{ color: 'var(--color-text)' }}>
                Streamline Your KYC Process
              </h2>
              <p className="prose-lead mx-auto mb-8 max-w-xl" style={{ color: 'var(--color-text-muted)' }}>
                Experience fast, secure, and compliant identity verification with Verifizy&apos;s comprehensive platform.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Button
                  href="https://www.verifizy.com"
                  accent="green"
                  className="rounded-full px-8 py-4 text-base font-semibold text-white"
                >
                  Visit Website
                </Button>
                <Button
                  href="/contact"
                  variant="outline"
                  accent="green"
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
