import { DotsLoader } from '@/components/ui/DotsLoader';

/**
 * Loading UI for [slug] – shows immediately while the page (and any heavy post content) loads.
 * Prevents "blank screen" on slow routes like long blog posts.
 */
export default function SlugLoading() {
  return (
    <div style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}>
      {/* Hero skeleton */}
      <section className="relative min-h-[60vh] overflow-hidden pt-24 pb-16" style={{ backgroundColor: 'var(--color-hero-bg)' }}>
        <div className="container-tight relative z-10 flex min-h-[50vh] flex-col justify-center">
          <div className="mb-10 flex justify-center">
            <DotsLoader size="lg" color="var(--color-accent-1)" />
          </div>
          <div className="mb-8 h-4 w-48 animate-pulse rounded" style={{ backgroundColor: 'var(--color-border)' }} />
          <div className="mb-6 h-12 w-full max-w-2xl animate-pulse rounded" style={{ backgroundColor: 'var(--color-border)' }} />
          <div className="h-6 w-full max-w-xl animate-pulse rounded" style={{ backgroundColor: 'var(--color-border)' }} />
        </div>
      </section>

      {/* Content skeleton */}
      <section className="section-padding" style={{ backgroundColor: 'var(--color-bg)' }}>
        <div className="container-tight">
          <div
            className="rounded-3xl border p-8 md:p-12"
            style={{ backgroundColor: 'var(--color-bg-elevated)', borderColor: 'var(--color-border)' }}
          >
            <div className="space-y-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div
                  key={i}
                  className="h-4 animate-pulse rounded"
                  style={{
                    backgroundColor: 'var(--color-border)',
                    width: i === 3 ? '75%' : i === 6 ? '60%' : '100%',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
