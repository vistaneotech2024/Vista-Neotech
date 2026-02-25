import { createServerSupabase } from '@/lib/supabase-server';

export type HeroMediaType = 'none' | 'image' | 'video';

export type HeroSlide = {
  id: string;
  eyebrow?: string | null;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  mediaType: HeroMediaType;
  mediaUrl?: string | null;
  mediaAlt?: string | null;
  ctaLabel?: string | null;
  ctaUrl?: string | null;
  secondaryCtaLabel?: string | null;
  secondaryCtaUrl?: string | null;
  alignment?: 'left' | 'center';
  enabled?: boolean;
};

export type HomeHeroConfig = {
  autoplay: boolean;
  autoplayDelayMs: number;
  showIndicators: boolean;
  showArrows: boolean;
  slides: HeroSlide[];
};

export const DEFAULT_HOME_HERO_CONFIG: HomeHeroConfig = {
  autoplay: true,
  autoplayDelayMs: 7000,
  showIndicators: true,
  showArrows: true,
  slides: [
    {
      id: 'default-hero',
      eyebrow: 'In pursuit of excellence',
      title: 'Full-Service IT Company with MLM & Direct Selling Expertise',
      subtitle: null,
      description:
        'Vista Neotech builds MLM platforms, travel portals, e-commerce solutions, Shopify stores, real estate software and custom applications—with deep experience in direct selling consultancy and digital growth.',
      mediaType: 'none',
      mediaUrl: null,
      mediaAlt: null,
      ctaLabel: 'Get in touch',
      ctaUrl: '/contact',
      secondaryCtaLabel: 'View all services',
      secondaryCtaUrl: '/mlm-software-direct-selling-consultant',
      alignment: 'center',
      enabled: true,
    },
  ],
};

/** Coerce to string so DB/CMS never passes style objects or other non-strings as React children. */
function toText(v: unknown): string | null {
  if (v == null) return null;
  if (typeof v === 'string') return v.trim() || null;
  if (typeof v === 'number' || typeof v === 'boolean') return String(v);
  return null;
}

function normalizeConfig(raw: any): HomeHeroConfig {
  if (!raw || typeof raw !== 'object') return DEFAULT_HOME_HERO_CONFIG;

  const slidesRaw = Array.isArray((raw as any).slides) ? (raw as any).slides : [];

  const slides: HeroSlide[] = slidesRaw
    .map((s: any, index: number) => {
      if (!s || typeof s !== 'object') return null;

      const title = toText(s.title) ?? '';
      if (!title) return null;

      const mediaType: HeroMediaType =
        s.mediaType === 'image' || s.mediaType === 'video' || s.mediaType === 'none' ? s.mediaType : 'none';

      return {
        id: String(s.id || `slide-${index}`),
        eyebrow: toText(s.eyebrow),
        title,
        subtitle: toText(s.subtitle),
        description: toText(s.description),
        mediaType,
        mediaUrl: typeof s.mediaUrl === 'string' ? s.mediaUrl : null,
        mediaAlt: toText(s.mediaAlt),
        ctaLabel: toText(s.ctaLabel),
        ctaUrl: typeof s.ctaUrl === 'string' ? s.ctaUrl : null,
        secondaryCtaLabel: toText(s.secondaryCtaLabel),
        secondaryCtaUrl: typeof s.secondaryCtaUrl === 'string' ? s.secondaryCtaUrl : null,
        alignment: s.alignment === 'left' ? 'left' : 'center',
        enabled: s.enabled !== false,
      };
    })
    .filter(Boolean) as HeroSlide[];

  if (!slides.length) return DEFAULT_HOME_HERO_CONFIG;

  return {
    autoplay: typeof raw.autoplay === 'boolean' ? raw.autoplay : DEFAULT_HOME_HERO_CONFIG.autoplay,
    autoplayDelayMs:
      typeof raw.autoplayDelayMs === 'number' && raw.autoplayDelayMs > 1000
        ? raw.autoplayDelayMs
        : DEFAULT_HOME_HERO_CONFIG.autoplayDelayMs,
    showIndicators:
      typeof raw.showIndicators === 'boolean' ? raw.showIndicators : DEFAULT_HOME_HERO_CONFIG.showIndicators,
    showArrows: typeof raw.showArrows === 'boolean' ? raw.showArrows : DEFAULT_HOME_HERO_CONFIG.showArrows,
    slides,
  };
}

export async function getHomeHeroConfig(): Promise<HomeHeroConfig> {
  try {
    const supabase = createServerSupabase();
    if (!supabase) return DEFAULT_HOME_HERO_CONFIG;

    const { data } = await supabase
      .from('content_blocks')
      .select('content')
      .eq('slug', 'home-hero')
      .maybeSingle();

    if (!data || !(data as any).content) {
      return DEFAULT_HOME_HERO_CONFIG;
    }

    return normalizeConfig((data as any).content);
  } catch {
    return DEFAULT_HOME_HERO_CONFIG;
  }
}

