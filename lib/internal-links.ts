/**
 * Internal linking for SEO: related pages by topic/service group.
 * Used on builder/WordPress-imported pages to link between site pages.
 */

import { getAllPreservedUrls } from '@/lib/url-map';

// Group slugs by topic for relevant internal links (same group = higher relevance)
const SLUG_GROUPS: Record<string, string[]> = {
  mlm_software: [
    'mlm-software',
    'direct-selling-software',
    'software-development',
    'mlm-software-direct-selling-consultant',
    'mlm-consultant-software-developer-advisor',
    'api-integration',
    'data-analytics',
    'cloud-infrastructure',
    'compliance-security',
  ],
  consulting: [
    'direct-selling-consultant-mlm',
    'direct-selling-setup',
    'direct-selling-registration',
    'direct-selling-plans',
    'mlm-company-registration',
    'mlm-trainers-direct-selling-experts',
    'direct-selling-training',
    'how-to-start-mlm-company-in-india',
    'direct-selling-association',
  ],
  development: [
    'web-development-company',
    'web-designing-company',
    'android-app-development',
    'ios-app-development',
    'software-agency',
    'shopping-portal-development',
    'travel-portal-development',
  ],
  design: [
    'graphic-designing',
    'logo-designing',
    'web-designing-company',
    'corporate-identity-designing',
    'poster-designing-flyers-designers-in-delhi-ncr',
    'brochure-designing-2',
  ],
  marketing: [
    'seo-services',
    'sem-services',
    'smo-services',
    'sms-marketing',
    'email-marketing',
    'whatsapp-marketing',
  ],
  ai_tech: ['ai-ml-solutions', 'api-integration', 'data-analytics'],
  company: ['about-us'],
};

// Explicit related slugs for priority services – used to enforce
// SEO-focused internal linking between key offerings.
const RELATED_OVERRIDES: Record<string, string[]> = {
  'travel-portal-development': [
    'shopping-portal-development',
    'software-development',
    'whatsapp-marketing',
    'seo-services',
  ],
  'shopping-portal-development': [
    'travel-portal-development',
    'software-development',
    'whatsapp-marketing',
    'seo-services',
  ],
  'whatsapp-marketing': [
    'seo-services',
    'sem-services',
    'shopping-portal-development',
    'travel-portal-development',
    'mlm-software',
  ],
  'seo-services': [
    'whatsapp-marketing',
    'shopping-portal-development',
    'travel-portal-development',
    'software-development',
  ],
  'mlm-software': [
    'mlm-software-direct-selling-consultant',
    'software-development',
    'travel-portal-development',
    'shopping-portal-development',
  ],
};

const EXCLUDE_SLUGS = new Set([
  'contact',
  'sitemap',
  'privacy-policy',
  'terms-conditions',
  'bank-details-vista-testing',
  'faq',
  'gallery',
  'app-presentation',
]);

export type InternalLinkItem = {
  href: string;
  slug: string;
  title: string;
  description?: string;
};

function getGroupForSlug(slug: string): string[] | null {
  for (const group of Object.values(SLUG_GROUPS)) {
    if (group.includes(slug)) return group;
  }
  return null;
}

function cleanTitle(title: unknown, slug: string): string {
  if (title == null || typeof title !== 'string') return slug.replace(/-/g, ' ');
  const t = title.replace(/%%title%%|%%page%%|%%sep%%/g, '').trim();
  return t || slug.replace(/-/g, ' ');
}

/**
 * Returns related internal links for a given page slug (for SEO and UX).
 * Prefers same topic group, then other service pages, then general pages.
 */
export function getRelatedInternalLinks(
  currentSlug: string,
  limit: number = 6
): InternalLinkItem[] {
  const preserved = getAllPreservedUrls();
  const current = currentSlug.replace(/^\//, '').replace(/\/$/, '');

  const pageEntries = preserved
    .filter(
      (p) =>
        p.content_type === 'page' &&
        p.old_url &&
        p.old_url !== '/' &&
        p.old_url !== `/${current}` &&
        !EXCLUDE_SLUGS.has((p.old_url || '').replace(/^\//, '').replace(/\/$/, ''))
    )
    .map((p) => {
      const slug = (p.old_url || '').replace(/^\//, '').replace(/\/$/, '');
      return {
        href: p.old_url || `/${slug}`,
        slug,
        title: cleanTitle(p.meta_title, slug),
        description: typeof p.meta_description === 'string' ? p.meta_description.slice(0, 120) : undefined,
      };
    });

  const currentGroup = getGroupForSlug(current);
  const inGroup: InternalLinkItem[] = [];
  const rest: InternalLinkItem[] = [];

  for (const item of pageEntries) {
    if (EXCLUDE_SLUGS.has(item.slug)) continue;
    if (currentGroup && currentGroup.includes(item.slug)) {
      inGroup.push(item);
    } else {
      rest.push(item);
    }
  }

  // Apply manual overrides for priority slugs (ensuring no duplicates)
  const overrideSlugs = RELATED_OVERRIDES[current] ?? [];
  const overrideItems: InternalLinkItem[] = [];
  const seen = new Set<string>();

  for (const slug of overrideSlugs) {
    const match = pageEntries.find((p) => p.slug === slug);
    if (match && !seen.has(match.slug)) {
      overrideItems.push(match);
      seen.add(match.slug);
    }
  }

  const combined = [...overrideItems, ...inGroup.filter((i) => !seen.has(i.slug)), ...rest.filter((i) => !seen.has(i.slug))].slice(0, limit);
  return combined;
}

/** Priority conversion and service hub links for "Explore More" blocks (blog index, home). */
const EXPLORE_MORE_LINKS: InternalLinkItem[] = [
  {
    href: '/software-development',
    slug: 'software-development',
    title: 'Software Development',
    description: 'Web, mobile, and custom software solutions.',
  },
  {
    href: '/mlm-software-direct-selling-consultant',
    slug: 'mlm-software-direct-selling-consultant',
    title: 'MLM & Direct Selling Consultant',
    description: 'Expert software and consulting for MLM and direct selling businesses.',
  },
  {
    href: '/travel-portal-development',
    slug: 'travel-portal-development',
    title: 'Travel Portal Development',
    description: 'Custom B2B and B2C travel portals for agencies, OTAs, and tour operators.',
  },
  {
    href: '/shopping-portal-development',
    slug: 'shopping-portal-development',
    title: 'Shopping Portal Development',
    description: 'E-commerce and shopping portals with secure payments and order management.',
  },
  {
    href: '/whatsapp-marketing',
    slug: 'whatsapp-marketing',
    title: 'WhatsApp Marketing',
    description: 'High-engagement WhatsApp campaigns and automation for leads and customers.',
  },
  {
    href: '/about-us',
    slug: 'about-us',
    title: 'About Us',
    description: 'Full-service IT company with deep MLM and direct selling expertise.',
  },
];

export function getExploreMoreLinks(limit: number = 5): InternalLinkItem[] {
  return EXPLORE_MORE_LINKS.slice(0, limit);
}
