import { unstable_cache } from 'next/cache';
import type { GooglePlaceReviewsData, GoogleReviewCard } from '@/lib/google-reviews-shared';

export type { GooglePlaceReviewsData, GoogleReviewCard } from '@/lib/google-reviews-shared';

function devWarn(...args: unknown[]) {
  if (process.env.NODE_ENV === 'development') {
    console.warn('[google-place-reviews]', ...args);
  }
}

function mapLegacyReviews(
  raw: Array<{
    author_name?: string;
    profile_photo_url?: string;
    rating?: number;
    relative_time_description?: string;
    text?: string;
    time?: number;
  }>
): GoogleReviewCard[] {
  return raw.map((rev, i) => ({
    id: `g-${rev.time ?? i}-${i}`,
    authorName: typeof rev.author_name === 'string' ? rev.author_name : 'Anonymous',
    profilePhotoUrl:
      typeof rev.profile_photo_url === 'string' && rev.profile_photo_url.startsWith('http')
        ? rev.profile_photo_url
        : null,
    rating:
      typeof rev.rating === 'number' && rev.rating >= 1 && rev.rating <= 5 ? rev.rating : 5,
    relativeTime:
      typeof rev.relative_time_description === 'string' ? rev.relative_time_description : '',
    text: typeof rev.text === 'string' ? rev.text : '',
  }));
}

/** Places API (New) — often enabled when Legacy Place Details is not. */
async function fetchFromPlacesApiNew(
  key: string,
  placeId: string
): Promise<GooglePlaceReviewsData | null> {
  // Path is `v1/places/{placeId}` — place id is typically `ChIJ…` (no `places/` prefix).
  const pathId = encodeURIComponent(placeId.replace(/^places\//, ''));
  const url = `https://places.googleapis.com/v1/places/${pathId}`;

  try {
    // Request top-level `reviews` only; nested review field paths often trigger 400 INVALID_ARGUMENT.
    const fieldMask = 'id,displayName,rating,userRatingCount,reviews';

    const res = await fetch(url, {
      headers: {
        'X-Goog-Api-Key': key,
        'X-Goog-FieldMask': fieldMask,
      },
      cache: 'no-store',
    });

    const body = (await res.json()) as {
      error?: { code?: number; message?: string; status?: string; details?: unknown };
      displayName?: { text?: string };
      rating?: number;
      userRatingCount?: number;
      reviews?: Array<{
        name?: string;
        relativePublishTimeDescription?: string;
        text?: { text?: string };
        rating?: number;
        publishTime?: string;
        authorAttribution?: { displayName?: string; photoUri?: string };
      }>;
    };

    if (!res.ok || body.error) {
      devWarn(
        'Places API (New)',
        res.status,
        body.error?.message ?? body.error?.status ?? res.statusText
      );
      return null;
    }

    const raw = Array.isArray(body.reviews) ? body.reviews : [];
    const reviews: GoogleReviewCard[] = raw.map((rev, i) => {
      const author =
        typeof rev.authorAttribution?.displayName === 'string'
          ? rev.authorAttribution.displayName
          : 'Anonymous';
      const photo = rev.authorAttribution?.photoUri;
      return {
        id: typeof rev.name === 'string' && rev.name ? rev.name : `gn-${rev.publishTime ?? i}-${i}`,
        authorName: author,
        profilePhotoUrl:
          typeof photo === 'string' && photo.startsWith('http') ? photo : null,
        rating:
          typeof rev.rating === 'number' && rev.rating >= 1 && rev.rating <= 5 ? rev.rating : 5,
        relativeTime:
          typeof rev.relativePublishTimeDescription === 'string'
            ? rev.relativePublishTimeDescription
            : '',
        text: typeof rev.text?.text === 'string' ? rev.text.text : '',
      };
    });

    const displayName =
      typeof body.displayName?.text === 'string' && body.displayName.text.trim()
        ? body.displayName.text.trim()
        : 'Google reviews';

    return {
      name: displayName,
      rating: typeof body.rating === 'number' && !Number.isNaN(body.rating) ? body.rating : 0,
      userRatingsTotal:
        typeof body.userRatingCount === 'number' && body.userRatingCount >= 0
          ? body.userRatingCount
          : reviews.length,
      reviews,
    };
  } catch (e) {
    devWarn('Places API (New) fetch failed', e);
    return null;
  }
}

/** Legacy Place Details (maps.googleapis.com). */
async function fetchFromLegacyPlaceDetails(
  key: string,
  placeId: string
): Promise<GooglePlaceReviewsData | null> {
  const url = new URL('https://maps.googleapis.com/maps/api/place/details/json');
  url.searchParams.set('place_id', placeId);
  url.searchParams.set('fields', 'name,rating,user_ratings_total,reviews');
  url.searchParams.set('reviews_sort', 'newest');
  url.searchParams.set('key', key);

  try {
    const res = await fetch(url.toString(), { cache: 'no-store' });
    const body = (await res.json()) as {
      status?: string;
      error_message?: string;
      result?: {
        name?: string;
        rating?: number;
        user_ratings_total?: number;
        reviews?: Array<{
          author_name?: string;
          profile_photo_url?: string;
          rating?: number;
          relative_time_description?: string;
          text?: string;
          time?: number;
        }>;
      };
    };

    if (body.status !== 'OK' || !body.result) {
      devWarn('Legacy Place Details', body.status, body.error_message);
      return null;
    }

    const r = body.result;
    const raw = Array.isArray(r.reviews) ? r.reviews : [];
    const reviews = mapLegacyReviews(raw);

    return {
      name: typeof r.name === 'string' && r.name.trim() ? r.name.trim() : 'Google reviews',
      rating: typeof r.rating === 'number' && !Number.isNaN(r.rating) ? r.rating : 0,
      userRatingsTotal:
        typeof r.user_ratings_total === 'number' && r.user_ratings_total >= 0
          ? r.user_ratings_total
          : reviews.length,
      reviews,
    };
  } catch (e) {
    devWarn('Legacy Place Details fetch failed', e);
    return null;
  }
}

function envTrim(v: string | undefined): string {
  if (!v) return '';
  return v.replace(/^\uFEFF/, '').trim().replace(/^["']|["']$/g, '');
}

async function fetchPlaceReviewsUncached(): Promise<GooglePlaceReviewsData | null> {
  const key = envTrim(process.env.GOOGLE_PLACES_API_KEY);
  const placeId = envTrim(process.env.GOOGLE_PLACE_ID);
  if (!key || !placeId) return null;

  const fromNew = await fetchFromPlacesApiNew(key, placeId);
  if (fromNew) return fromNew;

  return fetchFromLegacyPlaceDetails(key, placeId);
}

/**
 * Live Google reviews (incl. profile photos when provided). Successful responses are cached 1h.
 * Failures are not cached (avoids sticky fallback after a bad key or transient error).
 * Requires GOOGLE_PLACES_API_KEY + GOOGLE_PLACE_ID. At most 5 reviews per Google response.
 */
export async function getGooglePlaceReviews(): Promise<GooglePlaceReviewsData | null> {
  const placeId = envTrim(process.env.GOOGLE_PLACE_ID);
  const key = envTrim(process.env.GOOGLE_PLACES_API_KEY);
  if (!placeId || !key) return null;

  try {
    return await unstable_cache(
      async () => {
        const data = await fetchPlaceReviewsUncached();
        if (!data) throw new Error('PLACE_REVIEWS_UNAVAILABLE');
        return data;
      },
      ['google-place-reviews', placeId],
      { revalidate: 3600, tags: ['google-place-reviews'] }
    )();
  } catch {
    return null;
  }
}
