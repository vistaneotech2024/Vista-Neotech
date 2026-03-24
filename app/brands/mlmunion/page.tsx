import type { Metadata } from 'next';
import Image from 'next/image';
import { Button } from '@/components/Button';
import { IconArrowRight } from '@/components/ui/Icons';

export const metadata: Metadata = {
  title: 'MLM Union - Direct Selling Directory | Vista Neotech',
  description:
    'MLM Union is a direct selling companies and direct sellers directory platform for discovery, listing visibility, and networking.',
  openGraph: {
    title: 'MLM Union - Direct Selling Directory Platform',
    description: 'Discover direct selling companies and direct sellers on MLM Union.',
  },
};

const highlights = [
  'Direct sellers directory',
  'Direct selling companies listing',
  'Industry networking visibility',
  'Business discovery platform',
  'Simple profile discovery',
  'Category-based browsing',
];

const useCases = [
  {
    title: 'Company Discovery',
    description: 'Find and explore direct selling companies and their services in one place.',
    icon: '🏢',
  },
  {
    title: 'Seller Visibility',
    description: 'Improve visibility for direct sellers through searchable profile listings.',
    icon: '👥',
  },
  {
    title: 'Industry Networking',
    description: 'Connect with professionals and organizations in the direct selling ecosystem.',
    icon: '🤝',
  },
];

export default function MlmUnionPage() {
  return (
    <>
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
              src="/images/mlm_union (2).png"
              alt="MLM Union Logo"
              width={160}
              height={160}
              className="h-32 w-32 object-contain"
              unoptimized
            />
          </div>
          <h1 className="display-1 mb-6 max-w-4xl" style={{ color: 'var(--color-hero-text)' }}>
            MLM Union
          </h1>
          <p className="prose-lead mx-auto mb-8 max-w-3xl" style={{ color: 'var(--color-hero-text-muted)' }}>
            A direct selling companies and direct sellers directory for better discovery, industry networking, and
            business visibility.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button
              href="https://www.mlmunion.in/"
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

      <section className="section-padding" style={{ backgroundColor: 'var(--color-bg)' }}>
        <div className="container-wide">
          <div className="mb-16 text-center">
            <p className="section-label mb-4">Platform Highlights</p>
            <h2 className="display-3 mb-6" style={{ color: 'var(--color-text)' }}>
              Built for Direct Selling Discovery
            </h2>
            <p className="prose-lead mx-auto max-w-2xl" style={{ color: 'var(--color-text-muted)' }}>
              MLM Union helps companies and sellers improve discoverability and connect with a focused audience.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {useCases.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border p-8 transition-all duration-300 hover:shadow-xl"
                style={{
                  backgroundColor: 'var(--color-bg-elevated)',
                  borderColor: 'var(--color-border)',
                  borderLeftWidth: '4px',
                  borderLeftColor: 'var(--color-accent-1)',
                }}
              >
                <div
                  className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl text-3xl"
                  style={{ backgroundColor: 'var(--color-accent-1-muted)' }}
                >
                  {item.icon}
                </div>
                <h3 className="mb-3 text-xl font-bold" style={{ color: 'var(--color-text)' }}>
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding" style={{ backgroundColor: 'var(--color-bg-muted)' }}>
        <div className="container-tight">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <div>
              <p className="section-label mb-4">Why MLM Union</p>
              <h2 className="display-3 mb-6" style={{ color: 'var(--color-text)' }}>
                Directory + Visibility + Networking
              </h2>
              <ul className="space-y-4">
                {highlights.map((item) => (
                  <li key={item} className="flex items-start gap-3">
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
                      {item}
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
              <div className="relative z-10">
                <div className="mb-6 flex items-center gap-4">
                  <Image
                    src="/images/logo_black.png"
                    alt="Vista Neotech"
                    width={170}
                    height={40}
                    className="h-8 w-auto dark:hidden"
                  />
                  <Image
                    src="/images/logo_white.png"
                    alt="Vista Neotech"
                    width={170}
                    height={40}
                    className="hidden h-8 w-auto dark:block"
                  />
                </div>
                <p className="mb-8 text-base leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                  Explore MLM Union and discover direct selling opportunities, listings, and partnerships.
                </p>
                <Button
                  href="https://www.mlmunion.in/"
                  accent="cyan"
                  className="rounded-full px-8 py-4 text-base font-semibold text-white"
                >
                  Explore MLM Union
                  <IconArrowRight size="sm" className="ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
