import type { GoogleReviewsPayload } from '@/lib/google-reviews';

type GoogleReviewsSectionProps = {
  title?: string;
  /** When provided, renders review cards (preferred). */
  reviewsData?: GoogleReviewsPayload | null;
  /** Fallback: map iframe embed if reviews API not configured. */
  iframeSrc?: string;
};

function Stars({ value }: { value: number }) {
  const safe = Math.max(0, Math.min(5, Math.round(value)));
  return (
    <span aria-label={`${safe} out of 5 stars`} className="inline-flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} aria-hidden className={i < safe ? 'opacity-100' : 'opacity-30'}>
          ★
        </span>
      ))}
    </span>
  );
}

export function GoogleReviewsSection({
  title = 'Google Reviews',
  reviewsData,
  iframeSrc,
}: GoogleReviewsSectionProps) {
  const src = typeof iframeSrc === 'string' ? iframeSrc.trim() : '';
  const hasCards = !!reviewsData && Array.isArray(reviewsData.reviews) && reviewsData.reviews.length > 0;
  if (!hasCards && !src) return null;

  return (
    <section className="section-padding" style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}>
      <div className="container-tight">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="display-3" style={{ color: 'var(--color-text)' }}>{title}</h2>
            <p className="mt-2 text-base" style={{ color: 'var(--color-text-muted)' }}>
              See what customers are saying about us.
            </p>
          </div>
          {reviewsData && (
            <div className="text-right">
              <div className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
                {typeof reviewsData.rating === 'number' ? reviewsData.rating.toFixed(1) : '—'} / 5
              </div>
              <div className="text-xs" style={{ color: 'var(--color-text-subtle)' }}>
                {typeof reviewsData.user_ratings_total === 'number' ? `${reviewsData.user_ratings_total} ratings` : ''}
              </div>
            </div>
          )}
        </div>

        {hasCards ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {reviewsData!.reviews.map((r, idx) => (
              <div
                key={`${r.author_name}-${idx}`}
                className="rounded-2xl border p-5"
                style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-elevated)' }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="h-10 w-10 overflow-hidden rounded-full border"
                    style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-muted)' }}
                  >
                    {r.profile_photo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={r.profile_photo_url} alt={r.author_name} className="h-full w-full object-cover" />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
                        {r.author_name}
                      </p>
                      {r.relative_time_description ? (
                        <p className="shrink-0 text-xs" style={{ color: 'var(--color-text-subtle)' }}>
                          {r.relative_time_description}
                        </p>
                      ) : null}
                    </div>
                    <div className="mt-1 text-sm" style={{ color: 'var(--color-accent-2)' }}>
                      <Stars value={r.rating} />
                    </div>
                  </div>
                </div>
                {r.text ? (
                  <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                    {r.text}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        ) : (
          <div
            className="overflow-hidden rounded-2xl border"
            style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-elevated)' }}
          >
            <iframe
              src={src}
              title="Google Reviews (Map Embed)"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-[520px] w-full"
            />
          </div>
        )}
      </div>
    </section>
  );
}

