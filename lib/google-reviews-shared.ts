export type GoogleReviewCard = {
  id: string;
  authorName: string;
  profilePhotoUrl: string | null;
  rating: number;
  relativeTime: string;
  text: string;
};

export type GooglePlaceReviewsData = {
  name: string;
  rating: number;
  userRatingsTotal: number;
  reviews: GoogleReviewCard[];
};

function fallbackAvatar(name: string): { initial: string; hue: number } {
  const trimmed = name.trim();
  const initial = (trimmed.charAt(0) || '?').toUpperCase();
  const hue = trimmed.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;
  return { initial, hue };
}

export function reviewCardDisplay(
  r: GoogleReviewCard
): GoogleReviewCard & { initial: string; hue: number } {
  const fb = fallbackAvatar(r.authorName);
  return { ...r, initial: fb.initial, hue: fb.hue };
}
