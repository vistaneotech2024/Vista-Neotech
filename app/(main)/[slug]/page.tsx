import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getPageByPath, buildMetadata, getAllPreservedUrls, getBaseUrl } from '@/lib/url-map';
import { getPageBySlugFromDB, getPostBySlugFromDB } from '@/lib/cms/pages-db';
import { getFeaturedImageByPath, getFeaturedImageForPost, toAbsoluteImageUrl } from '@/lib/blog-images';
import { OptimizedBlogImage } from '@/components/ui/OptimizedBlogImage';
import { getRelatedInternalLinks } from '@/lib/internal-links';
import { ModernToolPost } from '@/components/blog/ModernToolPost';
import { AboutUsPage } from '@/components/pages/AboutUsPage';
import { ServiceExplanationCard } from '@/components/ui/ServiceExplanationCard';
import { PageCTA } from '@/components/ui/PageCTA';
import { RelatedInternalLinks } from '@/components/ui/RelatedInternalLinks';
import { ProsePageContent } from '@/components/ui/ProsePageContent';
import { BenefitsStrip } from '@/components/ui/BenefitsStrip';
import { Button } from '@/components/Button';
import { IconArrowRight } from '@/components/ui/Icons';
import {
  IconCode,
  IconBriefcase,
  IconChart,
  IconShield,
  IconRocket,
  IconGlobe,
  IconSparkles,
  IconCpu,
  IconHeadset,
} from '@/components/ui/Icons';

const BASE_TITLE = 'Vista Neotech';
const BASE_DESC = 'Vista Neotech – MLM software developers, direct selling consultants. In pursuit of excellence.';

/** Coerce DB/API values to string so we never render objects (e.g. style objects) as React children */
function toSafeString(value: unknown, fallback = ''): string {
  if (value == null) return fallback;
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return fallback;
}

// ISR: cache so heavy posts load fast. Longer in dev (local + Supabase) to reduce DB hits while testing
export const revalidate = process.env.NODE_ENV === 'development' ? 3600 : 300;
// Vercel only: allow up to 60s for heavy posts (ignored when running locally)
export const maxDuration = 60;

// Service definitions with explanation cards - matching WordPress slugs exactly
const serviceDefinitions: Record<string, {
  icon: React.ReactNode;
  emoji?: string;
  features: string[];
  accent: 1 | 2 | 3 | 4 | 5;
}> = {
  'mlm-software': {
    icon: <IconRocket size="lg" />,
    emoji: '⚡',
    features: [
      'Advanced compensation plan calculation',
      'Real-time genealogy tree management',
      'Automated commission processing',
      'Distributor portal with analytics',
      'Compliance and legal documentation',
      'Multi-level plan support (Binary, Matrix, Board)',
    ],
    accent: 1,
  },
  'direct-selling-software': {
    icon: <IconRocket size="lg" />,
    emoji: '🚀',
    features: [
      'Registration and inventory management',
      'Franchise management system',
      'Sales management tools',
      'Incentive reports and analytics',
      'Direct selling compliance features',
      'Distributor management portal',
    ],
    accent: 1,
  },
  'software-development': {
    icon: <IconCode size="lg" />,
    emoji: '💻',
    features: [
      'Custom web application development',
      'Mobile app development (iOS & Android)',
      'Full-stack development services',
      'API integration and development',
      'Cloud infrastructure setup',
      'Maintenance and support',
    ],
    accent: 2,
  },
  'web-development-company': {
    icon: <IconCode size="lg" />,
    emoji: '🌐',
    features: [
      'Responsive web design',
      'E-commerce development',
      'CMS integration',
      'Web application development',
      'Performance optimization',
      'SEO-friendly development',
    ],
    accent: 2,
  },
  'android-app-development': {
    icon: <IconCode size="lg" />,
    emoji: '📱',
    features: [
      'Native Android app development',
      'Material Design implementation',
      'Play Store optimization',
      'App maintenance and updates',
      'Performance optimization',
      'Third-party API integration',
    ],
    accent: 2,
  },
  'ios-app-development': {
    icon: <IconCode size="lg" />,
    emoji: '🍎',
    features: [
      'Native iOS app development',
      'Swift and Objective-C expertise',
      'App Store optimization',
      'UI/UX design implementation',
      'Performance optimization',
      'App maintenance and support',
    ],
    accent: 2,
  },
  'direct-selling-consultant-mlm': {
    icon: <IconBriefcase size="lg" />,
    emoji: '💼',
    features: [
      'MLM business strategy development',
      'Compensation plan design',
      'Legal compliance advisory',
      'Training and team building',
      'Market analysis and planning',
      'Business growth strategies',
    ],
    accent: 3,
  },
  'direct-selling-setup': {
    icon: <IconBriefcase size="lg" />,
    emoji: '⚙️',
    features: [
      'Complete MLM setup guidance',
      'Business model consultation',
      'Registration assistance',
      'Documentation support',
      'Legal advisor coordination',
      'Initial training programs',
    ],
    accent: 3,
  },
  'direct-selling-registration': {
    icon: <IconBriefcase size="lg" />,
    emoji: '📋',
    features: [
      'MLM company registration support',
      'Documentation preparation',
      'Legal compliance guidance',
      'Registration process management',
      'Post-registration support',
      'Compliance monitoring',
    ],
    accent: 3,
  },
  'direct-selling-plans': {
    icon: <IconBriefcase size="lg" />,
    emoji: '📈',
    features: [
      'MLM plan selection guidance',
      'Binary plan consultation',
      'Generation percentage plans',
      'Party plan recommendations',
      'Custom plan development',
      'Plan optimization strategies',
    ],
    accent: 3,
  },
  'mlm-company-registration': {
    icon: <IconBriefcase size="lg" />,
    emoji: '🏢',
    features: [
      'Company registration assistance',
      'Legal documentation support',
      'Compliance advisory',
      'Registration process management',
      'Post-registration guidance',
      'Ongoing compliance support',
    ],
    accent: 3,
  },
  'seo-services': {
    icon: <IconGlobe size="lg" />,
    emoji: '🌐',
    features: [
      'On-page and off-page SEO',
      'Keyword research and optimization',
      'Content marketing strategies',
      'Link building campaigns',
      'Technical SEO audits',
      'Local SEO optimization',
    ],
    accent: 2,
  },
  'sem-services': {
    icon: <IconGlobe size="lg" />,
    emoji: '📢',
    features: [
      'Google Ads management',
      'Bing Ads optimization',
      'PPC campaign management',
      'Ad copywriting and optimization',
      'Conversion rate optimization',
      'ROI tracking and reporting',
    ],
    accent: 2,
  },
  'smo-services': {
    icon: <IconGlobe size="lg" />,
    emoji: '📱',
    features: [
      'Social media strategy development',
      'Content creation and scheduling',
      'Community management',
      'Social media advertising',
      'Analytics and reporting',
      'Brand reputation management',
    ],
    accent: 2,
  },
  'graphic-designing': {
    icon: <IconSparkles size="lg" />,
    emoji: '🎨',
    features: [
      'Logo design and branding',
      'Website graphics and UI design',
      'App interface design',
      'Brochure and flyer design',
      'Social media graphics',
      'Print design services',
    ],
    accent: 4,
  },
  'logo-designing': {
    icon: <IconSparkles size="lg" />,
    emoji: '✨',
    features: [
      'Custom logo design',
      'Brand identity development',
      'Logo variations and formats',
      'Brand guidelines creation',
      'Logo refinement and optimization',
      'Multiple design concepts',
    ],
    accent: 4,
  },
  'web-designing-company': {
    icon: <IconSparkles size="lg" />,
    emoji: '🖥️',
    features: [
      'Responsive web design',
      'UI/UX design services',
      'Wireframing and prototyping',
      'Design system development',
      'User experience optimization',
      'Design-to-code handoff',
    ],
    accent: 4,
  },
  'ai-ml-solutions': {
    icon: <IconSparkles size="lg" />,
    emoji: '🤖',
    features: [
      'AI-powered business automation',
      'Predictive analytics and insights',
      'Machine learning model development',
      'Intelligent data processing',
      'Chatbot and virtual assistant integration',
      'Custom AI solution development',
    ],
    accent: 4,
  },
  'api-integration': {
    icon: <IconCpu size="lg" />,
    emoji: '🔌',
    features: [
      'Third-party API integration',
      'RESTful and GraphQL API development',
      'Payment gateway integration',
      'Social media API connections',
      'Database integration services',
      'API documentation and testing',
    ],
    accent: 5,
  },
  'data-analytics': {
    icon: <IconChart size="lg" />,
    emoji: '📊',
    features: [
      'Business intelligence dashboards',
      'Real-time reporting and analytics',
      'Data visualization solutions',
      'Performance metrics tracking',
      'Custom reporting tools',
      'Data warehousing solutions',
    ],
    accent: 3,
  },
  'cloud-infrastructure': {
    icon: <IconRocket size="lg" />,
    emoji: '☁️',
    features: [
      'Cloud migration services',
      'DevOps implementation',
      'Scalable architecture design',
      'Infrastructure automation',
      'Cloud security setup',
      '24/7 monitoring and support',
    ],
    accent: 4,
  },
  'travel-portal-development': {
    icon: <IconGlobe size="lg" />,
    emoji: '✈️',
    features: [
      'B2B and B2C travel portal development',
      'Flight, hotel, bus and holiday booking engines',
      'Supplier and API integrations for real-time availability',
      'Multi-currency and multi-language support',
      'Secure payments and booking management',
      'Agent and sub-agent portals with mark-up controls',
    ],
    accent: 2,
  },
  'shopping-portal-development': {
    icon: <IconCode size="lg" />,
    emoji: '🛒',
    features: [
      'Custom shopping and e-commerce portal development',
      'Product catalog and inventory management',
      'Cart, checkout and payment integrations',
      'Multi-vendor and marketplace capabilities',
      'Promotions, coupons and loyalty features',
      'Order management and reporting dashboards',
    ],
    accent: 2,
  },
  'shopify-development': {
    icon: <IconCode size="lg" />,
    emoji: '🛍️',
    features: [
      'Shopify store setup and configuration',
      'Custom theme design and implementation',
      'App selection and integration',
      'Store migration to Shopify',
      'Conversion-focused UX and checkout optimization',
      'Ongoing support and enhancements',
    ],
    accent: 2,
  },
  'whatsapp-marketing': {
    icon: <IconHeadset size="lg" />,
    emoji: '💬',
    features: [
      'WhatsApp campaign strategy and planning',
      'Broadcasts and segmented audience lists',
      'Automation flows for carts, reminders and follow-ups',
      'Integration with portals, CRM and landing pages',
      'Compliance-focused opt-in and template guidance',
      'Reporting on delivery, engagement and conversions',
    ],
    accent: 5,
  },
  'digital-marketing': {
    icon: <IconChart size="lg" />,
    emoji: '📈',
    features: [
      'Integrated SEO, paid media and social campaigns',
      'Content strategy and landing page optimization',
      'Lead generation and performance funnels',
      'Marketing automation and nurture journeys',
      'Analytics and attribution reporting',
      'Industry-specific strategies for IT, MLM and real estate',
    ],
    accent: 3,
  },
  'compliance-security': {
    icon: <IconShield size="lg" />,
    emoji: '🛡️',
    features: [
      'KYC automation solutions',
      'Regulatory compliance management',
      'Security audits and assessments',
      'Data protection implementation',
      'GDPR and privacy compliance',
      'Risk management solutions',
    ],
    accent: 5,
  },
};

// Strong contextual CTA copy per service/page – prompts contact for services
const contextualCTA: Record<string, { headline: string; supporting: string; primaryLabel: string }> = {
  'mlm-software': {
    headline: 'Get Your MLM Software Quote',
    supporting: 'Tell us your requirements. We’ll design and deliver the right MLM software for your business.',
    primaryLabel: 'Request a Quote',
  },
  'direct-selling-software': {
    headline: 'Discuss Your Direct Selling Software Needs',
    supporting: 'From registration to distributor portals—we build end-to-end direct selling solutions.',
    primaryLabel: 'Contact Our Team',
  },
  'software-development': {
    headline: 'Start Your Software Project',
    supporting: 'Custom web and mobile apps, APIs, and cloud infrastructure. Get a free consultation.',
    primaryLabel: 'Get a Consultation',
  },
  'web-development-company': {
    headline: 'Build Your Next Web Project',
    supporting: 'Responsive, fast, and SEO-friendly websites. Let’s discuss your goals.',
    primaryLabel: 'Discuss Your Project',
  },
  'android-app-development': {
    headline: 'Get Your Android App Built',
    supporting: 'Native Android apps with modern UX. Share your idea and we’ll bring it to life.',
    primaryLabel: 'Request a Quote',
  },
  'ios-app-development': {
    headline: 'Launch Your iOS App',
    supporting: 'Native iOS development and App Store optimization. Talk to our experts.',
    primaryLabel: 'Contact Us',
  },
  'direct-selling-consultant-mlm': {
    headline: 'Work With MLM & Direct Selling Experts',
    supporting: 'Strategy, compensation plans, and compliance. Schedule a consultation today.',
    primaryLabel: 'Book a Consultation',
  },
  'direct-selling-setup': {
    headline: 'Set Up Your Direct Selling Business',
    supporting: 'End-to-end setup guidance, documentation, and training. Get started with us.',
    primaryLabel: 'Get Started',
  },
  'direct-selling-registration': {
    headline: 'Register Your MLM Company the Right Way',
    supporting: 'We help with documentation, compliance, and registration process.',
    primaryLabel: 'Contact for Registration Help',
  },
  'direct-selling-plans': {
    headline: 'Choose the Right MLM Plan',
    supporting: 'Binary, matrix, or custom plans. Our consultants will guide you.',
    primaryLabel: 'Discuss Your Plan',
  },
  'mlm-company-registration': {
    headline: 'Register Your MLM Company',
    supporting: 'Legal and compliance support for MLM company registration in India.',
    primaryLabel: 'Get Registration Support',
  },
  'seo-services': {
    headline: 'Boost Your Visibility With SEO',
    supporting: 'On-page, technical, and content SEO. Get a free audit and proposal.',
    primaryLabel: 'Get a Free SEO Audit',
  },
  'sem-services': {
    headline: 'Scale With Paid Search',
    supporting: 'Google Ads, Bing Ads, and conversion optimization. Let’s grow your leads.',
    primaryLabel: 'Discuss SEM Strategy',
  },
  'smo-services': {
    headline: 'Grow Your Brand on Social',
    supporting: 'Strategy, content, and paid social. We’ll create a plan that works.',
    primaryLabel: 'Contact for SMO',
  },
  'graphic-designing': {
    headline: 'Get Professional Graphic Design',
    supporting: 'Logos, UI, brochures, and social assets. Share your brief and we’ll deliver.',
    primaryLabel: 'Request Design Quote',
  },
  'logo-designing': {
    headline: 'Get a Logo That Stands Out',
    supporting: 'Custom logo and brand identity. Multiple concepts and revisions included.',
    primaryLabel: 'Start Logo Project',
  },
  'web-designing-company': {
    headline: 'Design Your Website With Us',
    supporting: 'UI/UX, wireframes, and design systems. Tell us about your project.',
    primaryLabel: 'Discuss Design',
  },
  'ai-ml-solutions': {
    headline: 'Explore AI & ML for Your Business',
    supporting: 'Automation, analytics, and custom AI solutions. Schedule a discovery call.',
    primaryLabel: 'Book a Discovery Call',
  },
  'api-integration': {
    headline: 'Integrate Your Systems Seamlessly',
    supporting: 'APIs, payment gateways, and third-party integrations. Get a technical quote.',
    primaryLabel: 'Get Integration Quote',
  },
  'data-analytics': {
    headline: 'Turn Data Into Decisions',
    supporting: 'Dashboards, reports, and BI. We’ll help you measure what matters.',
    primaryLabel: 'Discuss Analytics',
  },
  'cloud-infrastructure': {
    headline: 'Move to the Cloud With Confidence',
    supporting: 'Migration, DevOps, and 24/7 support. Let’s plan your infrastructure.',
    primaryLabel: 'Contact Infrastructure Team',
  },
  'travel-portal-development': {
    headline: 'Launch Your Travel Portal',
    supporting: 'From B2C booking engines to B2B agent portals—we design and build travel platforms that scale.',
    primaryLabel: 'Discuss Travel Portal Project',
  },
  'shopping-portal-development': {
    headline: 'Build Your E-Commerce or Shopping Portal',
    supporting: 'Get a modern, conversion-focused shopping portal with seamless payments and order management.',
    primaryLabel: 'Start Your E-Commerce Project',
  },
  'shopify-development': {
    headline: 'Grow With a High-Converting Shopify Store',
    supporting: 'Theme customization, app integrations and ongoing support tailored to your brand.',
    primaryLabel: 'Talk to a Shopify Expert',
  },
  'whatsapp-marketing': {
    headline: 'Scale Your Communication With WhatsApp',
    supporting: 'Engage leads and customers with compliant, automated WhatsApp journeys.',
    primaryLabel: 'Plan WhatsApp Campaigns',
  },
  'digital-marketing': {
    headline: 'Plan Your Digital Growth Strategy',
    supporting: 'SEO, paid media, content and automation—all aligned with your revenue goals.',
    primaryLabel: 'Request a Digital Marketing Plan',
  },
  'compliance-security': {
    headline: 'Strengthen Compliance & Security',
    supporting: 'KYC, regulatory compliance, and security audits. Protect your business.',
    primaryLabel: 'Get Compliance Help',
  },
};

function getCTACopy(slug: string, displayTitle: string) {
  const cleanTitle = displayTitle.replace(/%%title%%|%%page%%|%%sep%%/g, '').trim() || slug.replace(/-/g, ' ');
  return (
    contextualCTA[slug] ?? {
      headline: `Ready to Get Started With ${cleanTitle}?`,
      supporting: "Let's discuss how we can help. Contact us for a free consultation.",
      primaryLabel: 'Contact Us',
    }
  );
}

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  const preserved = getAllPreservedUrls();
  return preserved
    .filter((p) => {
      const u = (p.old_url || '').replace(/\/$/, '');
      if (u === '' || u === '/') return false;
      const slug = u.replace(/^\//, '').trim();
      return slug.length > 0;
    })
    .map((p) => ({ slug: (p.old_url || '').replace(/^\//, '').replace(/\/$/, '') }));
}

const ABOUT_US_META = {
  title: 'About Us | Full-Service IT Company & Direct Selling Experts | Vista Neotech',
  description: 'Vista Neotech is a full-service IT company across versatile sectors. Software development, digital marketing, design & consulting—with deep expertise in MLM and direct selling solutions.',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const pathname = (slug || '').trim();
  if (!pathname) return { title: BASE_TITLE, description: BASE_DESC };
  const path = `/${pathname}`;
  const base = getBaseUrl();
  const dbPage = await getPageBySlugFromDB(pathname);
  const dbPost = dbPage ? null : await getPostBySlugFromDB(pathname);
  if (pathname === 'about-us' && (dbPage || getPageByPath(path))) {
    const canonical = `${base}/about-us`;
    const title = ABOUT_US_META.title;
    const description = ABOUT_US_META.description.slice(0, 160);
    return { title, description, alternates: { canonical }, openGraph: { title, description, url: canonical }, twitter: { card: 'summary_large_image', title, description } };
  }
  if (dbPage) {
    const title = toSafeString(dbPage.meta_title || dbPage.title, BASE_TITLE).replace(/%%title%%|%%page%%|%%sep%%/g, '').trim() || BASE_TITLE;
    const description = toSafeString(dbPage.meta_description || dbPage.excerpt, BASE_DESC).slice(0, 160);
    const canonical = `${base}/${dbPage.slug}`;
    return { title, description, alternates: { canonical }, openGraph: { title, description, url: canonical }, twitter: { card: 'summary_large_image', title, description } };
  }
  if (dbPost) {
    const title = toSafeString(dbPost.meta_title || dbPost.title, BASE_TITLE).replace(/%%title%%|%%page%%|%%sep%%/g, '').trim() || BASE_TITLE;
    const description = toSafeString(dbPost.meta_description || dbPost.excerpt, BASE_DESC).slice(0, 160);
    const canonical = `${base}/${dbPost.slug}`;
    return { title, description, alternates: { canonical }, openGraph: { title, description, url: canonical }, twitter: { card: 'summary_large_image', title, description } };
  }
  const page = getPageByPath(path);
  return buildMetadata(page, BASE_TITLE, BASE_DESC);
}

export default async function SlugPage({ params }: Props) {
  const { slug } = await params;
  const pathname = (slug || '').trim();
  if (!pathname) notFound();
  const path = `/${pathname}`;
  const base = getBaseUrl();

  const dbPage = await getPageBySlugFromDB(pathname);
  const dbPost = dbPage ? null : await getPostBySlugFromDB(pathname);
  const urlMapPage = getPageByPath(path);

  const fromDb = !!dbPage || !!dbPost;
  const isBlogPost = !!dbPost || (urlMapPage?.content_type === 'post');
  const rawTitle = (dbPage?.meta_title ?? dbPage?.title) || (dbPost?.meta_title ?? dbPost?.title) || urlMapPage?.meta_title || pathname.replace(/-/g, ' ') || 'Page';
  const rawDesc = dbPage?.meta_description ?? dbPage?.excerpt ?? dbPost?.meta_description ?? dbPost?.excerpt ?? urlMapPage?.meta_description ?? BASE_DESC;
  const displayTitle = toSafeString(rawTitle, pathname.replace(/-/g, ' ') || 'Page').replace(/%%title%%|%%page%%|%%sep%%/g, '').trim() || pathname.replace(/-/g, ' ') || 'Page';
  const displayDescription = toSafeString(rawDesc, BASE_DESC).slice(0, 500);
  const pageUrl = fromDb ? `${base}/${pathname}` : (urlMapPage?.old_url ? `${base}${urlMapPage.old_url}` : `${base}/${pathname}`);
  const rawContent = dbPage?.content ?? dbPost?.content ?? null;
  const bodyContent = typeof rawContent === 'string' ? rawContent : (rawContent != null ? String(rawContent) : null);
  const focusKeyword = toSafeString(dbPage?.focus_keyword ?? urlMapPage?.focus_keyword ?? null) || null;

  if (!fromDb && !urlMapPage) notFound();

  // Special ultra-modern template for specific high-priority post (keep slug/SEO unchanged)
  if (isBlogPost && pathname === 'top-mlm-network-marketing-software-tools' && bodyContent) {
    return (
      <ModernToolPost
        title={displayTitle}
        description={displayDescription}
        html={bodyContent}
        canonicalUrl={pageUrl}
        publishedAt={dbPost?.published_at ?? null}
        focusKeyword={focusKeyword}
      />
    );
  }

  // Ultra-modern About Us layout with strong CTA; positioning as full-service IT company, direct selling expertise
  if (pathname === 'about-us' && (dbPage || urlMapPage)) {
    return (
      <AboutUsPage
        title="We are a full-service IT company. Direct selling is our expertise."
        description="Vista Neotech delivers software development, digital marketing, design, and consulting across versatile sectors—with deep expertise in MLM and direct selling solutions."
        html={bodyContent}
        canonicalUrl={pageUrl}
        focusKeyword={focusKeyword}
        preservedUrl={!fromDb && urlMapPage ? urlMapPage.old_url : null}
      />
    );
  }

  const serviceDef = serviceDefinitions[pathname];
  const isServicePage = !!serviceDef && !isBlogPost;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': isBlogPost ? 'BlogPosting' : 'WebPage',
    headline: displayTitle,
    description: displayDescription,
    url: pageUrl,
    ...(isBlogPost && (dbPost?.published_at || urlMapPage?.post_id) && {
      datePublished: dbPost?.published_at ?? new Date().toISOString(),
      ...(dbPost?.updated_at && { dateModified: dbPost.updated_at }),
      author: { '@type': 'Organization', name: 'Vista Neotech' },
      publisher: { '@type': 'Organization', name: 'Vista Neotech' },
    }),
  };

  const breadcrumbItems = [
    { name: 'Home', url: base + '/' },
    ...(isBlogPost ? [{ name: 'Blog', url: base + '/blog' }] : []),
    { name: displayTitle, url: pageUrl },
  ];
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };

  const featuredImageUrl = isBlogPost ? getFeaturedImageForPost(pathname, bodyContent) : null;

  function normalizePreservedToRootSlug(oldUrl: string): string {
    const cleaned = (oldUrl || '').trim().replace(/^\/+|\/+$/g, '');
    if (!cleaned) return '';
    // Some preserved URLs are stored like "/blog/slug"
    return cleaned.startsWith('blog/') ? cleaned.slice('blog/'.length) : cleaned;
  }

  function formatPostDate(iso: string | null | undefined): string | null {
    if (!iso || typeof iso !== 'string') return null;
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return null;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  const relatedSidebarPosts = isBlogPost
    ? await (async () => {
        const preserved = getAllPreservedUrls().filter((p) => p.content_type === 'post');
        const preservedBySlug = new Map<string, (typeof preserved)[number]>();
        for (const p of preserved) {
          const s = normalizePreservedToRootSlug(p.old_url);
          if (s) preservedBySlug.set(s, p);
        }

        const candidates = preserved
          .map((p) => normalizePreservedToRootSlug(p.old_url))
          .filter((s) => s && s !== pathname);

        const uniqueSlugs = Array.from(new Set(candidates)).slice(0, 3);
        if (uniqueSlugs.length === 0) return [];

        const rows = await Promise.all(
          uniqueSlugs.map(async (slug) => {
            const db = await getPostBySlugFromDB(slug);
            const preserved = preservedBySlug.get(slug);
            const title = db?.meta_title ?? db?.title ?? preserved?.meta_title ?? preserved?.slug ?? slug;
            const excerpt = db?.meta_description ?? db?.excerpt ?? preserved?.meta_description ?? null;
            const publishedAt = db?.published_at ?? null;
            const dateLabel = formatPostDate(publishedAt);

            const dbOg = db?.og_image ?? null;
            const featured_image_url =
              dbOg ? toAbsoluteImageUrl(dbOg) : (getFeaturedImageByPath(slug) ?? null);

            return {
              slug,
              old_url: `/${slug}`,
              title: toSafeString(title),
              excerpt,
              dateLabel,
              featured_image_url,
            };
          })
        );

        return rows.filter((r) => r.old_url);
      })()
    : [];

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {/* Hero / Header */}
      <header
        role="banner"
        className="relative min-h-[55vh] overflow-hidden pt-20 pb-12 md:min-h-[58vh] md:pt-24 md:pb-14"
        style={{ backgroundColor: 'var(--color-hero-bg)', color: 'var(--color-hero-text)' }}
      >
        <div className="absolute inset-0 overflow-hidden opacity-30">
          <div
            className="absolute -right-40 -top-40 h-96 w-96 rounded-full blur-3xl"
            style={{
              backgroundColor: isServicePage
                ? `var(--color-accent-${serviceDef.accent}-muted)`
                : 'var(--color-accent-1-muted)',
            }}
          />
        </div>

        {/* Blog post hero image as design element – same URLs as WordPress for image SEO */}
        {isBlogPost && featuredImageUrl && (
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-[var(--color-hero-bg)]/60" />
            <OptimizedBlogImage
              src={featuredImageUrl}
              alt=""
              priority
              quality={85}
              cover
              sizes="100vw"
              className="opacity-50"
            />
          </div>
        )}

        <div className="container-wide relative z-10 flex min-h-[45vh] flex-col justify-center md:min-h-[48vh]">
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center gap-2 text-sm" aria-label="Breadcrumb">
            <Link href="/" className="transition hover:opacity-80" style={{ color: 'var(--color-text-muted)' }}>
              Home
            </Link>
            {isBlogPost && (
              <>
                <span style={{ color: 'var(--color-text-muted)' }}>/</span>
                <Link href="/blog" className="transition hover:opacity-80" style={{ color: 'var(--color-text-muted)' }}>
                  Blog
                </Link>
              </>
            )}
            <span style={{ color: 'var(--color-text-muted)' }}>/</span>
            <span style={{ color: 'var(--color-text)' }}>
              {toSafeString(displayTitle)}
            </span>
          </nav>

          {/* Blog Post Badge */}
          {isBlogPost && (
            <span
              className="inline-flex items-center rounded-full px-4 py-2 text-xs font-semibold mb-6"
              style={{
                backgroundColor: 'var(--color-accent-1-muted)',
                color: 'var(--color-accent-1)',
              }}
            >
              Blog Article
            </span>
          )}

          <h1 className="display-1 mb-6 max-w-4xl" style={{ color: 'var(--color-hero-text)' }}>
            {toSafeString(displayTitle)}
          </h1>
          {toSafeString(displayDescription) && (
            <p className="prose-lead mb-8 max-w-3xl" style={{ color: 'var(--color-hero-text-muted)' }}>
              {toSafeString(displayDescription)}
            </p>
          )}
          {!isBlogPost && (
            <div className="flex flex-wrap items-center gap-4">
              <Button href="/contact" accent="orange" className="rounded-full px-8 py-4 text-base font-semibold text-white">
                Get in Touch
              </Button>
              <Button
                href="/mlm-software-direct-selling-consultant"
                variant="outline-hero"
                className="rounded-full px-8 py-4 text-base font-semibold"
              >
                View Services
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Service Explanation Cards */}
      {isServicePage && (
        <section className="section-padding" style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}>
          <div className="container-wide">
            <div className="mb-12 text-center">
              <p className="section-label mb-4">What We Offer</p>
              <h2 className="display-3 mb-6" style={{ color: 'var(--color-text)' }}>
                Comprehensive {toSafeString(displayTitle)} Solutions
              </h2>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <ServiceExplanationCard
                icon={serviceDef.icon}
                emoji={serviceDef.emoji}
                title={toSafeString(displayTitle)}
                description={toSafeString(displayDescription) || `Expert ${toSafeString(displayTitle)} services tailored to your business needs.`}
                features={serviceDef.features}
                accent={serviceDef.accent}
                className="md:col-span-2 lg:col-span-3"
              />
            </div>
          </div>
        </section>
      )}

      {/* Compact CTA strip for service pages – strong prompt to contact */}
      {isServicePage && (
        <section className="section-padding pt-0" style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}>
          <div className="container-wide">
            <PageCTA
              variant="compact"
              headline={toSafeString(getCTACopy(pathname, displayTitle).headline)}
              supportingText={toSafeString(getCTACopy(pathname, displayTitle).supporting)}
              primaryLabel={toSafeString(getCTACopy(pathname, displayTitle).primaryLabel)}
              primaryHref="/contact"
              secondaryLabel="View All Services"
              secondaryHref="/mlm-software-direct-selling-consultant"
            />
          </div>
        </section>
      )}

      {/* Content Section – modern prose styling for WordPress/builder content; article for blog for semantic/AI clarity */}
      <section className={`section-padding ${isServicePage ? '' : 'pt-0'}`} style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}>
        <div className="container-wide">
          {isServicePage && serviceDef.features.length > 0 && (
            <div className="mb-10">
              <BenefitsStrip
                accent={serviceDef.accent}
                items={serviceDef.features.map((label) => ({ label }))}
              />
            </div>
          )}
          {/* Summary section removed (matches requested UI). */}
          {isBlogPost ? (
            <div className="grid gap-6 lg:grid-cols-[1fr_360px] items-start">
              <article
                className="rounded-3xl border p-6 md:p-8"
                style={{
                  backgroundColor: 'var(--color-bg-elevated)',
                  borderColor: 'var(--color-border)',
                }}
              >
                <div className="mb-3">
                  <a
                    href="/blog"
                    className="inline-flex items-center gap-2 text-sm font-semibold"
                    style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}
                  >
                    <IconArrowRight size="sm" className="rotate-180" />
                    Back
                  </a>
                </div>

                {featuredImageUrl ? (
                  <div className="relative mb-5 overflow-hidden rounded-2xl bg-[var(--color-hero-bg)]" style={{ height: '260px' }}>
                    <OptimizedBlogImage
                      src={featuredImageUrl}
                      alt=""
                      priority
                      quality={85}
                      cover
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="opacity-50"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background: 'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.55) 100%)',
                      }}
                    />
                    <div className="relative p-5">
                      <p
                        className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em]"
                        style={{ color: 'rgba(255,255,255,0.9)' }}
                      >
                        BLOG SPOTLIGHT
                      </p>
                      <h1
                        className="line-clamp-3 text-2xl font-bold leading-snug"
                        style={{ color: 'white' }}
                      >
                        {toSafeString(displayTitle)}
                      </h1>
                    </div>
                  </div>
                ) : null}

                <ProsePageContent
                  html={bodyContent}
                  focusKeyword={focusKeyword}
                  preservedUrl={!fromDb && urlMapPage ? urlMapPage.old_url : null}
                />
              </article>

              {relatedSidebarPosts.length > 0 ? (
                <aside
                  className="lg:sticky lg:top-24"
                  style={{
                    backgroundColor: 'var(--color-bg-muted)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '1rem',
                    padding: '1rem',
                    color: 'var(--color-text)',
                  }}
                >
                  <h2 className="mb-3 text-xl font-bold" style={{ color: 'var(--color-text)' }}>
                    Explore more.
                  </h2>

                  <div className="space-y-3">
                    {relatedSidebarPosts.map((p) => (
                      <a
                        key={p.old_url}
                        href={p.old_url}
                        className="group block"
                        style={{ textDecoration: 'none' }}
                      >
                        <div className="flex gap-3">
                          <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-[var(--color-bg-elevated)]">
                            {p.featured_image_url ? (
                              <OptimizedBlogImage
                                src={p.featured_image_url}
                                alt=""
                                quality={75}
                                cover
                                sizes="112px"
                              />
                            ) : (
                              <div className="absolute inset-0 bg-[var(--color-accent-1-muted)]" />
                            )}
                          </div>

                          <div className="min-w-0">
                            {p.dateLabel ? (
                              <div className="mb-0 text-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>
                                {p.dateLabel}
                              </div>
                            ) : null}

                            <div
                              className="line-clamp-2 text-sm font-bold leading-snug group-hover:text-[var(--color-accent-1)]"
                              style={{ color: 'var(--color-text)' }}
                            >
                              {p.title}
                            </div>

                            {p.excerpt ? (
                              <div className="mt-1 line-clamp-2 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                                {p.excerpt}
                              </div>
                            ) : null}

                            <div
                              className="mt-2 inline-flex items-center gap-2 text-sm font-semibold"
                              style={{ color: 'var(--color-accent-1)' }}
                            >
                              Read more
                              <IconArrowRight size="sm" />
                            </div>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </aside>
              ) : null}
            </div>
          ) : (
            <div
              className="rounded-3xl border p-8 md:p-12"
              style={{
                backgroundColor: 'var(--color-bg-elevated)',
                borderColor: 'var(--color-border)',
              }}
            >
              <ProsePageContent
                html={bodyContent}
                focusKeyword={focusKeyword}
                preservedUrl={!fromDb && urlMapPage ? urlMapPage.old_url : null}
              />
            </div>
          )}
        </div>
      </section>

      {/* Internal links – SEO and discovery of related pages */}
      {!isBlogPost && (() => {
        const relatedLinks = getRelatedInternalLinks(pathname, 6);
        return relatedLinks.length > 0 ? (
          <RelatedInternalLinks
            links={relatedLinks}
            title="Explore related services"
            description="Discover more solutions that can help your business grow."
          />
        ) : null;
      })()}

      {/* (Removed) bottom related posts list; related blogs now show in the right sidebar */}

      {/* Internal links for blog – link to key service pages for SEO */}
      {isBlogPost && (() => {
        const serviceLinks = getRelatedInternalLinks(pathname, 4);
        return serviceLinks.length > 0 ? (
          <RelatedInternalLinks
            links={serviceLinks}
            title="Explore our services"
            description="MLM software, direct selling consultancy, and digital solutions."
          />
        ) : null;
      })()}

      {/* Strong CTA Section – contextual headline and contact prompt (pages) */}
      {!isBlogPost && (() => {
        const cta = getCTACopy(pathname, displayTitle);
        return (
          <section className="section-padding" style={{ backgroundColor: 'var(--color-bg-muted)', color: 'var(--color-text)' }}>
            <div className="container-tight">
              <div className="gradient-border">
                <PageCTA
                  headline={toSafeString(cta.headline)}
                  supportingText={toSafeString(cta.supporting)}
                  primaryLabel={toSafeString(cta.primaryLabel)}
                  primaryHref="/contact"
                  secondaryLabel="View All Services"
                  secondaryHref="/mlm-software-direct-selling-consultant"
                />
              </div>
            </div>
          </section>
        );
      })()}

      {/* Blog CTA – after article content */}
      {isBlogPost && (
        <section className="section-padding" style={{ backgroundColor: 'var(--color-bg-muted)', color: 'var(--color-text)' }}>
          <div className="container-tight">
            <PageCTA
              headline="Start Your Growth Journey"
              supportingText="Get a free consultation. Our experts will help you choose the right MLM software and strategy."
              primaryLabel="Get Free Consultation"
              primaryHref="/contact"
              secondaryLabel="Explore Services"
              secondaryHref="/mlm-software-direct-selling-consultant"
            />
          </div>
        </section>
      )}
    </>
  );
}
