/**
 * SEO Helper Utilities
 * Functions for SEO optimization and preservation
 */

import { prisma } from '../db/prisma';

export interface SEOData {
  metaTitle?: string;
  metaDescription?: string;
  focusKeyword?: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  schemaMarkup?: any;
}

/**
 * Generate meta title with site name
 */
export function generateMetaTitle(title: string, siteName?: string): string {
  if (!siteName) return title;
  return `${title} | ${siteName}`;
}

/**
 * Validate meta description length
 */
export function validateMetaDescription(description: string): {
  valid: boolean;
  length: number;
  warning?: string;
} {
  const length = description.length;
  const maxLength = 160;
  const optimalLength = 155;

  if (length > maxLength) {
    return {
      valid: false,
      length,
      warning: `Meta description exceeds ${maxLength} characters. It may be truncated in search results.`,
    };
  }

  if (length < optimalLength) {
    return {
      valid: true,
      length,
      warning: `Meta description is shorter than optimal (${optimalLength} characters). Consider adding more detail.`,
    };
  }

  return {
    valid: true,
    length,
  };
}

/**
 * Generate slug from title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Check if slug is unique
 */
export async function isSlugUnique(slug: string, excludeId?: string): Promise<boolean> {
  const [pageExists, postExists] = await Promise.all([
    prisma.page.findFirst({
      where: {
        slug,
        ...(excludeId && { id: { not: excludeId } }),
      },
    }),
    prisma.post.findFirst({
      where: {
        slug,
        ...(excludeId && { id: { not: excludeId } }),
      },
    }),
  ]);

  return !pageExists && !postExists;
}

/**
 * Generate canonical URL
 */
export function generateCanonicalUrl(slug: string, baseUrl: string): string {
  const cleanSlug = slug.startsWith('/') ? slug : `/${slug}`;
  return `${baseUrl.replace(/\/$/, '')}${cleanSlug}`;
}

/**
 * Generate Article schema markup
 */
export function generateArticleSchema(data: {
  title: string;
  description?: string;
  url: string;
  image?: string;
  author: string;
  publishedAt: string;
  modifiedAt?: string;
}): any {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data.title,
    description: data.description,
    url: data.url,
    ...(data.image && {
      image: {
        '@type': 'ImageObject',
        url: data.image,
      },
    }),
    author: {
      '@type': 'Person',
      name: data.author,
    },
    datePublished: data.publishedAt,
    ...(data.modifiedAt && { dateModified: data.modifiedAt }),
  };
}

/**
 * Generate Organization schema markup
 */
export function generateOrganizationSchema(data: {
  name: string;
  url: string;
  logo?: string;
  description?: string;
  socialProfiles?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
  };
}): any {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: data.name,
    url: data.url,
    ...(data.logo && {
      logo: {
        '@type': 'ImageObject',
        url: data.logo,
      },
    }),
    ...(data.description && { description: data.description }),
    ...(data.socialProfiles && {
      sameAs: [
        ...(data.socialProfiles.facebook ? [data.socialProfiles.facebook] : []),
        ...(data.socialProfiles.twitter ? [data.socialProfiles.twitter] : []),
        ...(data.socialProfiles.linkedin ? [data.socialProfiles.linkedin] : []),
      ],
    }),
  };
}

/**
 * Generate Breadcrumb schema markup
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>): any {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generate FAQ schema markup
 */
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>): any {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Calculate SEO score
 */
export function calculateSEOScore(data: SEOData): {
  score: number;
  maxScore: number;
  breakdown: Array<{ item: string; score: number; maxScore: number; passed: boolean }>;
} {
  const breakdown: Array<{ item: string; score: number; maxScore: number; passed: boolean }> = [];
  let totalScore = 0;
  let maxTotalScore = 0;

  // Meta Title (20 points)
  const titleMax = 20;
  let titleScore = 0;
  if (data.metaTitle) {
    const titleLength = data.metaTitle.length;
    if (titleLength >= 30 && titleLength <= 60) {
      titleScore = titleMax;
    } else if (titleLength > 0 && titleLength < 30) {
      titleScore = titleMax * 0.7;
    } else if (titleLength > 60) {
      titleScore = titleMax * 0.5;
    }
  }
  breakdown.push({
    item: 'Meta Title',
    score: titleScore,
    maxScore: titleMax,
    passed: titleScore >= titleMax * 0.7,
  });
  totalScore += titleScore;
  maxTotalScore += titleMax;

  // Meta Description (20 points)
  const descMax = 20;
  let descScore = 0;
  if (data.metaDescription) {
    const descLength = data.metaDescription.length;
    if (descLength >= 120 && descLength <= 160) {
      descScore = descMax;
    } else if (descLength > 0 && descLength < 120) {
      descScore = descMax * 0.7;
    } else if (descLength > 160) {
      descScore = descMax * 0.5;
    }
  }
  breakdown.push({
    item: 'Meta Description',
    score: descScore,
    maxScore: descMax,
    passed: descScore >= descMax * 0.7,
  });
  totalScore += descScore;
  maxTotalScore += descMax;

  // Focus Keyword (15 points)
  const keywordMax = 15;
  const keywordScore = data.focusKeyword ? keywordMax : 0;
  breakdown.push({
    item: 'Focus Keyword',
    score: keywordScore,
    maxScore: keywordMax,
    passed: keywordScore > 0,
  });
  totalScore += keywordScore;
  maxTotalScore += keywordMax;

  // Canonical URL (10 points)
  const canonicalMax = 10;
  const canonicalScore = data.canonicalUrl ? canonicalMax : 0;
  breakdown.push({
    item: 'Canonical URL',
    score: canonicalScore,
    maxScore: canonicalMax,
    passed: canonicalScore > 0,
  });
  totalScore += canonicalScore;
  maxTotalScore += canonicalMax;

  // Open Graph (15 points)
  const ogMax = 15;
  let ogScore = 0;
  if (data.ogTitle) ogScore += 5;
  if (data.ogDescription) ogScore += 5;
  if (data.ogImage) ogScore += 5;
  breakdown.push({
    item: 'Open Graph Tags',
    score: ogScore,
    maxScore: ogMax,
    passed: ogScore >= ogMax * 0.7,
  });
  totalScore += ogScore;
  maxTotalScore += ogMax;

  // Schema Markup (20 points)
  const schemaMax = 20;
  const schemaScore = data.schemaMarkup ? schemaMax : 0;
  breakdown.push({
    item: 'Schema Markup',
    score: schemaScore,
    maxScore: schemaMax,
    passed: schemaScore > 0,
  });
  totalScore += schemaScore;
  maxTotalScore += schemaMax;

  return {
    score: totalScore,
    maxScore: maxTotalScore,
    breakdown,
  };
}

/**
 * Get global SEO settings
 */
export async function getGlobalSEOSettings() {
  const settings = await prisma.seoSettings.findFirst({
    orderBy: { updatedAt: 'desc' },
  });

  return settings || {
    siteName: 'Vista Neotech',
    siteDescription: 'MLM Software Developers, Direct Selling Consultants',
    defaultMetaTitle: 'Vista Neotech – MLM Software & Direct Selling Solutions',
    defaultMetaDescription: 'Expert MLM software and direct selling consultant offering tailored solutions for network marketing success.',
  };
}

/**
 * Generate robots.txt content
 */
export async function generateRobotsTxt(baseUrl: string): Promise<string> {
  const settings = await getGlobalSEOSettings();

  const fromSettings = (settings as any).robotsTxt as string | null | undefined;

  let robotsTxt = fromSettings || `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml
`;

  return robotsTxt;
}
