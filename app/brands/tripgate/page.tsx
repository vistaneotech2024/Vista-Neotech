import type { Metadata } from 'next';
import Image from 'next/image';
import { Button } from '@/components/Button';
import { IconArrowRight } from '@/components/ui/Icons';

export const metadata: Metadata = {
  title: 'Tripgate.in - Tours & Travels Services | Vista Neotech',
  description:
    'Comprehensive Tours and Travels Services for B2B and B2C, MICE solutions, and API providers for Airlines, Hotels, Visas, Bus, and Activities.',
  openGraph: {
    title: 'Tripgate.in - Complete Travel Solutions',
    description: 'Your one-stop solution for all travel needs - B2B, B2C, MICE, and API services.',
  },
};

const services = [
  {
    title: 'B2B Travel Solutions',
    description: 'Enterprise travel management with bulk booking, corporate rates, and dedicated account management.',
    icon: '🏢',
  },
  {
    title: 'B2C Travel Services',
    description: 'Consumer-friendly platform for individual travelers with best prices and 24/7 customer support.',
    icon: '✈️',
  },
  {
    title: 'MICE Solutions',
    description: 'End-to-end Meetings, Incentives, Conferences, and Exhibitions management and planning.',
    icon: '🎯',
  },
  {
    title: 'API Integration',
    description: 'Seamless API access to airlines, hotels, visas, bus, and activity booking systems.',
    icon: '🔌',
  },
  {
    title: 'Hotel Booking',
    description: 'Access to millions of hotels worldwide with competitive pricing and instant confirmation.',
    icon: '🏨',
  },
  {
    title: 'Visa Services',
    description: 'Streamlined visa application process with document verification and status tracking.',
    icon: '📋',
  },
];

const apiFeatures = [
  'Airlines API Integration',
  'Hotel Booking APIs',
  'Visa Processing APIs',
  'Bus & Transport APIs',
  'Activity & Tour APIs',
  'Real-time Availability',
];

export default function TripgatePage() {
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
            style={{ backgroundColor: 'var(--color-accent-2-muted)' }}
          />
          <div
            className="absolute -left-40 bottom-0 h-96 w-96 rounded-full blur-3xl"
            style={{ backgroundColor: 'var(--color-accent-2-muted)' }}
          />
        </div>
        <div className="container-tight relative z-10 flex min-h-[60vh] flex-col items-center justify-center text-center">
          <div
            className="mb-8 flex h-40 w-40 items-center justify-center rounded-3xl transition-transform hover:scale-110"
            style={{ backgroundColor: 'color-mix(in srgb, var(--color-accent-2-muted) 82%, #000 18%)' }}
          >
            <Image
              src="/images/tripgate-logo.png"
              alt="Tripgate.in Logo"
              width={160}
              height={160}
              className="h-32 w-32 object-contain"
              unoptimized
            />
          </div>
          <h1 className="display-1 mb-6 max-w-4xl" style={{ color: 'var(--color-hero-text)' }}>
            Tripgate.in
          </h1>
          <p className="prose-lead mx-auto mb-8 max-w-3xl" style={{ color: 'var(--color-hero-text-muted)' }}>
            Comprehensive Tours and Travels Services for B2B and B2C, MICE solutions, and API providers for Airlines,
            Hotels, Visas, Bus, and Activities.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button
              href="https://tripgate.in"
              accent="cyan"
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
            <p className="section-label mb-4">Our Services</p>
            <h2 className="display-3 mb-6" style={{ color: 'var(--color-text)' }}>
              Complete Travel Solutions
            </h2>
            <p className="prose-lead mx-auto max-w-2xl" style={{ color: 'var(--color-text-muted)' }}>
              From individual bookings to enterprise solutions, we cover all your travel needs.
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
                  borderLeftColor: 'var(--color-accent-2)',
                }}
              >
                <div
                  className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl text-3xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                  style={{ backgroundColor: 'var(--color-accent-2-muted)' }}
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

      {/* API Features Section */}
      <section className="section-padding" style={{ backgroundColor: 'var(--color-bg-muted)' }}>
        <div className="container-tight">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <div>
              <p className="section-label mb-4">API Integration</p>
              <h2 className="display-3 mb-6" style={{ color: 'var(--color-text)' }}>
                Powerful APIs for Seamless Integration
              </h2>
              <p className="prose-lead mb-8" style={{ color: 'var(--color-text-muted)' }}>
                Integrate travel booking capabilities into your platform with our comprehensive API suite. Real-time
                availability, instant booking, and seamless payment processing.
              </p>
              <ul className="space-y-4">
                {apiFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span
                      className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm font-semibold"
                      style={{
                        backgroundColor: 'var(--color-accent-2-muted)',
                        color: 'var(--color-accent-2)',
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
                style={{ backgroundColor: 'var(--color-accent-2-muted)' }}
              />
              <div className="relative z-10">
                <h3 className="mb-6 text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
                  Trusted by Travel Partners
                </h3>
                <p className="mb-8 text-base leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                  Join thousands of travel agencies, corporate clients, and platforms using Tripgate.in APIs to power
                  their travel services.
                </p>
                <Button
                  href="https://tripgate.in"
                  accent="cyan"
                  className="rounded-full px-8 py-4 text-base font-semibold text-white"
                >
                  Explore APIs
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
                  radial-gradient(ellipse 80% 50% at 50% 50%, var(--color-accent-2-muted) 0%, transparent 50%)
                `,
              }}
            />
            <div className="relative text-center">
              <h2 className="display-2 mb-4" style={{ color: 'var(--color-text)' }}>
                Start Your Travel Journey Today
              </h2>
              <p className="prose-lead mx-auto mb-8 max-w-xl" style={{ color: 'var(--color-text-muted)' }}>
                Whether you&apos;re planning a business trip or a vacation, Tripgate.in has everything you need.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Button
                  href="https://tripgate.in"
                  accent="cyan"
                  className="rounded-full px-8 py-4 text-base font-semibold text-white"
                >
                  Visit Website
                </Button>
                <Button
                  href="/contact"
                  variant="outline"
                  accent="cyan"
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
