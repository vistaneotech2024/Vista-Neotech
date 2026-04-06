import { getGooglePlaceReviews } from '@/lib/google-place-reviews';
import type { GoogleReviewCard } from '@/lib/google-reviews-shared';
import { GoogleReviewsCarousel } from '@/components/GoogleReviewsCarousel';

const FALLBACK_REVIEWS: GoogleReviewCard[] = [
  {
    id: 'fb-1',
    authorName: 'Esha Agrawal',
    profilePhotoUrl: null,
    rating: 5,
    relativeTime: '5 years ago',
    text: 'Reliable and trustworthy, very helpful attitude…',
  },
  {
    id: 'fb-2',
    authorName: 'Prem Singh',
    profilePhotoUrl: null,
    rating: 5,
    relativeTime: '7 years ago',
    text: 'TOP Direct Selling Consultant and Legal Advisor…',
  },
  {
    id: 'fb-3',
    authorName: 'P Aggarwal',
    profilePhotoUrl: null,
    rating: 5,
    relativeTime: '7 years ago',
    text: 'Best Binary Software Development company…',
  },
  {
    id: 'fb-4',
    authorName: 'Rajesh Goel',
    profilePhotoUrl: null,
    rating: 5,
    relativeTime: '7 years ago',
    text: 'Vista Neotech (P) Ltd: Management is: Client friendly. Reliable.',
  },
];

const FALLBACK_NAME = 'MLM Software & MLM Consultant | Vista Neotech Pvt Ltd';
const FALLBACK_RATING = 4.9;
const FALLBACK_COUNT = 32;

function GoogleGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden width={18} height={18}>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function SummaryStars({ rating }: { rating: number }) {
  const filled = Math.min(5, Math.max(0, Math.round(rating)));
  return (
    <div className="flex gap-0.5" aria-hidden>
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          className="h-4 w-4 shrink-0 md:h-[18px] md:w-[18px]"
          viewBox="0 0 24 24"
          fill={i < filled ? '#f59e0b' : 'none'}
          stroke="#f59e0b"
          strokeWidth="1.5"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export async function GoogleReviewsSection() {
  const api = await getGooglePlaceReviews();

  const displayName = api?.name ?? FALLBACK_NAME;
  const displayRating = api && api.rating > 0 ? api.rating : FALLBACK_RATING;
  const displayCount = api && api.userRatingsTotal > 0 ? api.userRatingsTotal : FALLBACK_COUNT;
  const reviews = api && api.reviews.length > 0 ? api.reviews : FALLBACK_REVIEWS;

  const reviewUrl =
    (process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL || '').trim() ||
    'https://www.google.com/maps/search/Vista+Neotech+Pvt+Ltd+New+Delhi+reviews';

  const ratingLabel = displayRating.toFixed(1);

  return (
    <section
      className="section-padding border-y"
      style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-muted)' }}
      aria-labelledby="google-reviews-heading"
    >
      <div className="container-wide">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-stretch lg:gap-10">
          <div className="shrink-0 lg:w-[min(100%,320px)] lg:pt-1">
            <h2 id="google-reviews-heading" className="sr-only">
              Google reviews
            </h2>
            <p className="text-base font-semibold leading-snug md:text-lg" style={{ color: 'var(--color-text)' }}>
              {displayName}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <span className="text-3xl font-bold tabular-nums" style={{ color: 'var(--color-text)' }}>
                {ratingLabel}
              </span>
              <SummaryStars rating={displayRating} />
            </div>
            <p className="mt-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>
              Based on {displayCount} reviews · powered by Google
              {api && reviews.length < displayCount ? (
                <span className="block mt-1 text-xs">
                  Showing {reviews.length} recent reviews from Google (API limit).
                </span>
              ) : null}
            </p>
            <a
              href={reviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition hover:opacity-90"
              style={{
                borderColor: 'var(--color-border)',
                backgroundColor: 'var(--color-bg-elevated)',
                color: 'var(--color-text)',
              }}
            >
              <GoogleGlyph />
              Review us on Google
            </a>
          </div>

          <GoogleReviewsCarousel reviews={reviews} />
        </div>
      </div>
    </section>
  );
}
