export type GooglePlaceReview = {
  author_name: string;
  profile_photo_url?: string;
  rating: number;
  relative_time_description?: string;
  text?: string;
};

export type GoogleReviewsPayload = {
  rating: number | null;
  user_ratings_total: number | null;
  reviews: GooglePlaceReview[];
};

function toNumber(v: unknown): number | null {
  return typeof v === 'number' && Number.isFinite(v) ? v : null;
}

function toString(v: unknown): string | undefined {
  return typeof v === 'string' ? v : undefined;
}

export async function getGoogleReviewsFromPlacesAPI(params: {
  apiKey?: string | null;
  placeId?: string | null;
  limit?: number;
}): Promise<GoogleReviewsPayload | null> {
  const apiKey = (params.apiKey || '').trim();
  const placeId = (params.placeId || '').trim();
  const limit = typeof params.limit === 'number' && params.limit > 0 ? Math.min(params.limit, 10) : 6;

  if (!apiKey || !placeId) return null;

  const url =
    'https://maps.googleapis.com/maps/api/place/details/json' +
    `?place_id=${encodeURIComponent(placeId)}` +
    `&fields=${encodeURIComponent('rating,user_ratings_total,reviews')}` +
    `&reviews_sort=${encodeURIComponent('newest')}` +
    `&key=${encodeURIComponent(apiKey)}`;

  const res = await fetch(url, {
    // Avoid caching stale reviews in dev; in prod Next may cache by default.
    cache: 'no-store',
  });

  if (!res.ok) return null;

  const json = (await res.json()) as any;
  const result = json?.result;
  if (!result || typeof result !== 'object') return null;

  const reviewsRaw = Array.isArray(result.reviews) ? result.reviews : [];
  const reviews: GooglePlaceReview[] = reviewsRaw
    .map((r: any) => {
      const author_name = toString(r?.author_name) || '';
      const rating = toNumber(r?.rating) ?? 0;
      if (!author_name || rating <= 0) return null;
      return {
        author_name,
        profile_photo_url: toString(r?.profile_photo_url),
        rating,
        relative_time_description: toString(r?.relative_time_description),
        text: toString(r?.text),
      } satisfies GooglePlaceReview;
    })
    .filter(Boolean)
    .slice(0, limit) as GooglePlaceReview[];

  return {
    rating: toNumber(result.rating),
    user_ratings_total: toNumber(result.user_ratings_total),
    reviews,
  };
}

