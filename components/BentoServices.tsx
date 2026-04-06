import Link from 'next/link';
import { FeatureCard } from '@/components/ui/FeatureCard';
import {
  IconCpu,
  IconCode,
  IconChart,
  IconDeviceMobile,
  IconBriefcase,
  IconShield,
  IconRocket,
  IconGlobe,
  IconSparkles,
  IconHeadset,
} from '@/components/ui/Icons';

/** Order matches home “What we do” grid (01–12). */
const serviceCards = [
  {
    label: '01',
    title: 'Software Development',
    desc: 'Custom web and mobile applications built with modern technologies.',
    href: '/software-development',
    accent: 2 as const,
    icon: <IconCode size="lg" />,
  },
  {
    label: '02',
    title: 'MLM Software',
    desc: 'End-to-end MLM and direct selling software—compensation, genealogy, compliance, and distributor portals.',
    href: '/mlm-software',
    accent: 1 as const,
    icon: <IconChart size="lg" />,
  },
  {
    label: '03',
    title: 'Direct Selling Consultant',
    desc: 'Strategy, training, legal advisory, and business growth solutions.',
    href: '/direct-selling-consultant-mlm',
    accent: 3 as const,
    icon: <IconBriefcase size="lg" />,
  },
  {
    label: '04',
    title: 'Android & iOS App Development',
    desc: 'Native and cross-platform mobile apps for Android and iOS—design, build, and launch.',
    href: '/android-app-development',
    accent: 3 as const,
    icon: <IconDeviceMobile size="lg" />,
  },
  {
    label: '05',
    title: 'Travel Portal Development',
    desc: 'B2B and B2C travel portals for agencies, OTAs, and tour operators.',
    href: '/travel-portal-development',
    accent: 2 as const,
    icon: <IconGlobe size="lg" />,
  },
  {
    label: '06',
    title: 'Shopping Portal Development',
    desc: 'E-commerce and shopping portals with secure payments and order management.',
    href: '/shopping-portal-development',
    accent: 2 as const,
    icon: <IconCode size="lg" />,
  },
  {
    label: '07',
    title: 'API Integration',
    desc: 'Seamless third-party integrations, API development, and system connectivity.',
    href: '/api-integration',
    accent: 5 as const,
    icon: <IconCpu size="lg" />,
  },
  {
    label: '08',
    title: 'AI & ML Solutions',
    desc: 'Intelligent automation, predictive analytics, and AI-powered business tools.',
    href: '/ai-ml-solutions',
    accent: 4 as const,
    icon: <IconSparkles size="lg" />,
  },
  {
    label: '09',
    title: 'WhatsApp Marketing',
    desc: 'High-engagement campaigns, automation flows, and CRM-integrated messaging.',
    href: '/whatsapp-marketing',
    accent: 5 as const,
    icon: <IconHeadset size="lg" />,
  },
  {
    label: '10',
    title: 'Digital Marketing',
    desc: 'SEO, SEM, content marketing, and growth strategies for online presence.',
    href: '/seo-services',
    accent: 2 as const,
    icon: <IconGlobe size="lg" />,
  },
  {
    label: '11',
    title: 'Cloud Infrastructure',
    desc: 'DevOps, cloud migration, scalable architecture, and infrastructure management.',
    href: '/cloud-infrastructure',
    accent: 4 as const,
    icon: <IconRocket size="lg" />,
  },
  {
    label: '12',
    title: 'Compliance & Security',
    desc: 'KYC automation, regulatory compliance, security audits, and data protection.',
    href: '/compliance-security',
    accent: 5 as const,
    icon: <IconShield size="lg" />,
  },
];

export function BentoServices() {

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
          <h2
            id="what-we-do-title"
            className="animate-fade-in-up display-3 text-balance font-bold leading-tight"
            style={{ color: 'var(--color-text)' }}
          >
            What we do
          </h2>
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
                  icon={item.icon}
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
