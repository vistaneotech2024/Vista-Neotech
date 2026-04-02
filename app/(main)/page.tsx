import { Button } from '@/components/Button';
import { HomeHeroCarousel } from '@/components/HomeHeroCarousel';
import { getHomeHeroConfig } from '@/lib/cms/hero';
import { getPageBySlugFromDB, type PageFaqItemField } from '@/lib/cms/pages-db';
import { TrustBar } from '@/components/TrustBar';
import { StatsBar } from '@/components/StatsBar';
import { ProcessTimeline } from '@/components/ProcessTimeline';
import { BentoServices } from '@/components/BentoServices';
import { BrandsSection } from '@/components/BrandsSection';
import { ProsePageContent } from '@/components/ui/ProsePageContent';
import { FaqSection, type FaqItem } from '@/components/ui/FaqSection';
import { getExploreMoreLinks } from '@/lib/internal-links';
import { RelatedInternalLinks } from '@/components/ui/RelatedInternalLinks';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  const [heroConfig, homePage] = await Promise.all([
    getHomeHeroConfig(),
    getPageBySlugFromDB('home'),
  ]);

  const homeContent =
    typeof homePage?.content === 'string' ? homePage.content : null;
  const customFields = homePage?.custom_fields ?? null;

  const faqItems =
    customFields &&
    Array.isArray(customFields.faq_items)
      ? customFields.faq_items
          .map((item: PageFaqItemField, index: number) => {
            const question =
              typeof item?.question === 'string' ? item.question.trim() : '';
            const answer =
              typeof item?.answer === 'string' ? item.answer.trim() : '';
            if (!question || !answer) return null;
            return {
              id: String(item.id || index),
              question,
              answer,
            };
          })
          .filter((item): item is FaqItem => item !== null)
      : [];

  const faqEnabled =
    !!customFields &&
    customFields.faq_enabled !== false &&
    faqItems.length > 0;

  return (
    <main className="home-page-compact">
      <HomeHeroCarousel config={heroConfig} />

      <TrustBar />

      <BrandsSection />

      <StatsBar />

      <ProcessTimeline />

      {/* Home page body content from CMS (optional) */}
      {homeContent && (
        <section
          className="section-padding"
          style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}
        >
          <div className="container-tight">
            <ProsePageContent html={homeContent} />
          </div>
        </section>
      )}

      {/* Mid-content CTA – strong conversion prompt */}
      <section
        className="section-padding tech-grid"
        style={{ backgroundColor: 'var(--color-bg)' }}
      >
        <div className="container-tight">
          <div
            className="rounded-2xl border px-6 py-8 text-center md:px-10 md:py-10"
            style={{
              backgroundColor: 'var(--color-bg-elevated)',
              borderColor: 'var(--color-border)',
            }}
          >
            <h2 className="display-3 mb-4" style={{ color: 'var(--color-text)' }}>
              Get Free Consultation
            </h2>
            <p className="prose-lead mx-auto mb-6 max-w-xl" style={{ color: 'var(--color-text-muted)' }}>
              Talk to our experts. We&apos;ll help you choose the right technology and strategy for your business.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button
                href="/contact"
                accent="orange"
                className="rounded-full px-8 py-4 text-base font-semibold text-white"
              >
                Request a Strategy Call
              </Button>
              <Button
                href="/mlm-software-direct-selling-consultant"
                variant="outline"
                accent="orange"
                className="rounded-full px-8 py-4 text-base font-semibold"
              >
                View All Services
              </Button>
            </div>
          </div>
        </div>
      </section>

      <BentoServices />

      {/* Explore More – internal linking to priority conversion pages */}
      <RelatedInternalLinks
        links={getExploreMoreLinks(5)}
        title="Explore More"
        description="Full-service IT, MLM software, direct selling consultancy, and digital solutions. Explore our core services."
      />

      {/* Home page FAQ – managed via Pages → slug `home` */}
      {faqEnabled && <FaqSection items={faqItems} />}

      {/* CTA – display typography, gradient border, international-creative */}
      <section
        className="section-padding tech-grid"
        style={{ backgroundColor: 'var(--color-bg-muted)' }}
      >
        <div className="container-tight relative z-10">
          <div
            className="gradient-border relative overflow-hidden rounded-3xl p-8 md:p-12 lg:p-16"
            style={{ background: 'var(--color-bg-elevated)' }}
          >
            <div
              className="absolute inset-0 opacity-60"
              style={{
                background: `
                  radial-gradient(ellipse 80% 50% at 50% 50%, var(--color-accent-1-muted) 0%, transparent 50%),
                  radial-gradient(ellipse 60% 40% at 80% 80%, var(--color-accent-2-muted) 0%, transparent 45%)
                `,
              }}
            />
            <div className="relative text-center">
              <span className="text-4xl md:text-5xl" aria-hidden>🚀</span>
              <h2 className="display-2 mt-4" style={{ color: 'var(--color-text)' }}>
                Ready to transform your business?
              </h2>
              <p className="prose-lead mx-auto mt-5 max-w-xl" style={{ color: 'var(--color-text-muted)' }}>
                Talk to our experts. We&apos;ll help you choose the right technology and strategy across MLM, travel, e-commerce, real estate and more.
              </p>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <Button
                  href="/contact"
                  accent="orange"
                  className="rounded-full px-8 py-4 text-base font-semibold text-white"
                >
                  Start a conversation
                </Button>
                <Button
                  href="/about-us"
                  accent="cyan"
                  variant="outline"
                  className="rounded-full px-8 py-4 text-base font-semibold"
                >
                  About us
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
