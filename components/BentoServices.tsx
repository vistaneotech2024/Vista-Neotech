import Link from 'next/link';
import { FeatureCard } from '@/components/ui/FeatureCard';
import {
  IconCpu,
  IconCode,
  IconBriefcase,
  IconChart,
  IconShield,
  IconRocket,
  IconGlobe,
  IconSparkles,
  IconHeadset,
} from '@/components/ui/Icons';

const featured = {
  title: 'MLM Software',
  description:
    'End-to-end MLM and direct selling software—compensation, genealogy, compliance, and distributor portals.',
  href: '/mlm-software',
  accent: 1 as const,
  className: 'h-full',
  label: '01',
  emoji: '⚡',
};

const items = [
  {
    title: 'Software Development',
    desc: 'Custom web and mobile applications built with modern technologies.',
    href: '/software-development',
    label: '02',
    accent: 2 as const,
    icon: <IconCode size="lg" />,
  },
  {
    title: 'Direct Selling Consultant',
    desc: 'Strategy, training, legal advisory, and business growth solutions.',
    href: '/direct-selling-consultant-mlm',
    label: '03',
    accent: 3 as const,
    icon: <IconBriefcase size="lg" />,
  },
  {
    title: 'AI & ML Solutions',
    desc: 'Intelligent automation, predictive analytics, and AI-powered business tools.',
    href: '/ai-ml-solutions',
    label: '04',
    accent: 4 as const,
    icon: <IconSparkles size="lg" />,
  },
  {
    title: 'Digital Marketing',
    desc: 'SEO, SEM, content marketing, and growth strategies for online presence.',
    href: '/seo-services',
    label: '05',
    accent: 2 as const,
    icon: <IconGlobe size="lg" />,
  },
  {
    title: 'Travel Portal Development',
    desc: 'B2B and B2C travel portals for agencies, OTAs, and tour operators.',
    href: '/travel-portal-development',
    label: '06',
    accent: 2 as const,
    icon: <IconGlobe size="lg" />,
  },
  {
    title: 'Shopping Portal Development',
    desc: 'E-commerce and shopping portals with secure payments and order management.',
    href: '/shopping-portal-development',
    label: '07',
    accent: 2 as const,
    icon: <IconCode size="lg" />,
  },
  {
    title: 'WhatsApp Marketing',
    desc: 'High-engagement campaigns, automation flows, and CRM-integrated messaging.',
    href: '/whatsapp-marketing',
    label: '08',
    accent: 5 as const,
    icon: <IconHeadset size="lg" />,
  },
  {
    title: 'API Integration',
    desc: 'Seamless third-party integrations, API development, and system connectivity.',
    href: '/api-integration',
    label: '09',
    accent: 5 as const,
    icon: <IconCpu size="lg" />,
  },
  {
    title: 'Data Analytics',
    desc: 'Business intelligence, reporting dashboards, and data-driven insights.',
    href: '/data-analytics',
    label: '10',
    accent: 3 as const,
    icon: <IconChart size="lg" />,
  },
  {
    title: 'Cloud Infrastructure',
    desc: 'DevOps, cloud migration, scalable architecture, and infrastructure management.',
    href: '/cloud-infrastructure',
    label: '11',
    accent: 4 as const,
    icon: <IconRocket size="lg" />,
  },
  {
    title: 'Compliance & Security',
    desc: 'KYC automation, regulatory compliance, security audits, and data protection.',
    href: '/compliance-security',
    label: '12',
    accent: 5 as const,
    icon: <IconShield size="lg" />,
  },
];

export function BentoServices() {
  const serviceCards = [
    {
      title: featured.title,
      desc: featured.description,
      href: featured.href,
      label: featured.label,
      accent: featured.accent,
      emoji: featured.emoji,
      icon: null,
    },
    ...items.map((item) => ({
      title: item.title,
      desc: item.desc,
      href: item.href,
      label: item.label,
      accent: item.accent,
      icon: item.icon,
      emoji: null,
    })),
  ];

  return (
    <section
      className="section-padding relative overflow-hidden"
      style={{ backgroundColor: 'var(--color-bg-muted)' }}
      aria-labelledby="what-we-do-title"
    >
      {/* Background accents */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <div
          className="absolute -right-40 -top-40 h-96 w-96 rounded-full blur-3xl"
          style={{
            backgroundColor: 'var(--color-accent-1-muted)',
            animation: 'float 20s ease-in-out infinite',
          }}
        />
        <div
          className="absolute -left-40 bottom-0 h-96 w-96 rounded-full blur-3xl"
          style={{
            backgroundColor: 'var(--color-accent-3-muted)',
            animation: 'float 25s ease-in-out infinite',
            animationDelay: '2s',
          }}
        />
        <div
          className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
          style={{
            backgroundColor: 'var(--color-accent-2-muted)',
            opacity: 0.2,
          }}
        />
      </div>

      <div className="container-wide relative z-10">
        <div className="mb-8 flex flex-col items-center gap-4 text-center lg:mb-10">
          <div className="animate-fade-in-up max-w-4xl">
            <p className="section-label mb-4">What we do</p>
            <h2 id="what-we-do-title" className="display-3" style={{ color: 'var(--color-text)' }}>
              Full-service IT solutions—with deep MLM and direct selling expertise.
            </h2>
            <p
              className="mx-auto mt-3 max-w-3xl text-sm md:text-base"
              style={{ color: 'var(--color-text-muted)' }}
            >
              From MLM platforms and travel portals to e-commerce, WhatsApp automation and real estate software, we design and build the digital systems that power your business.
            </p>
          </div>
          <Link
            href="/mlm-software-direct-selling-consultant"
            className="group inline-flex w-fit shrink-0 items-center gap-2 text-sm font-semibold transition-all hover:gap-3 hover:opacity-90 animate-fade-in-up"
            style={{ display: 'flex', color: 'var(--color-accent-2)', animationDelay: '0.2s' }}
          >
            View all services
            <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>

        {/* Uniform card grid like "Your journey" */}
        <div className="grid auto-rows-fr gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {serviceCards.map((item, index) => {
            return (
              <div
                key={item.href}
                className="relative"
                style={{
                  display: 'flex',
                  opacity: 1,
                  transform: 'translateY(0)',
                }}
              >
                <FeatureCard
                  icon={item.icon ?? undefined}
                  emoji={item.emoji ?? undefined}
                  label={item.label}
                  title={item.title}
                  description={item.desc}
                  href={item.href}
                  accent={item.accent}
                  className="h-full p-6 md:p-8 hover:-translate-y-0 hover:shadow-lg"
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
