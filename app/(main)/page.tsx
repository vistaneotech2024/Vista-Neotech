import { Button } from '@/components/Button';
import { HomeHeroCarousel } from '@/components/HomeHeroCarousel';
import { getHomeHeroConfig } from '@/lib/cms/hero';
import { getPageBySlugFromDB, type PageFaqItemField } from '@/lib/cms/pages-db';
import { TrustBar } from '@/components/TrustBar';
import { StatsBar } from '@/components/StatsBar';
import { ProcessTimeline } from '@/components/ProcessTimeline';
import { BentoServices } from '@/components/BentoServices';
import { BrandsSection } from '@/components/BrandsSection';
import { GoogleReviewsSection } from '@/components/GoogleReviewsSection';
import { ProsePageContent } from '@/components/ui/ProsePageContent';
import { FaqSection, type FaqItem } from '@/components/ui/FaqSection';
import { getExploreMoreLinks } from '@/lib/internal-links';
import { RelatedInternalLinks } from '@/components/ui/RelatedInternalLinks';
import { getGoogleReviewsFromPlacesAPI } from '@/lib/google-reviews';

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
  const googleReviewsIframeSrcFromCMS =
    customFields && typeof (customFields as any).google_reviews_iframe_src === 'string'
      ? String((customFields as any).google_reviews_iframe_src)
      : '';
  const googleReviewsIframeSrc =
    googleReviewsIframeSrcFromCMS ||
    process.env.NEXT_PUBLIC_GOOGLE_REVIEWS_IFRAME_SRC ||
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3169.1199045945223!2d77.0809865!3d28.630017100000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d03e0fdda324b%3A0x32910c4d5dd6a6' +
      '77!2sMLM%20Software%20%26%20MLM%20Consultant%20%7C%20Vista%20Neotech%20Pvt%20Ltd!5e1!3m2!1sen!2sin!4v1774868138450!5m2!1sen!2sin';

  const googlePlaceIdFromCMS =
    customFields && typeof (customFields as any).google_place_id === 'string'
      ? String((customFields as any).google_place_id)
      : '';
  const googlePlaceId = googlePlaceIdFromCMS || process.env.GOOGLE_PLACE_ID || '';
  const reviewsData = await getGoogleReviewsFromPlacesAPI({
    apiKey: process.env.GOOGLE_PLACES_API_KEY,
    placeId: googlePlaceId,
    limit: 6,
  });

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

      <section className="section-padding" style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}>
        <div className="container-wide">
          <div
            className="overflow-hidden rounded-3xl border"
            style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-elevated)' }}
          >
            <div className="relative aspect-video w-full bg-black">
              <video
                src="/uploads/blog/7791993-hd_1920_1080_25fps.mp4"
                className="absolute inset-0 h-full w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                controls
                preload="metadata"
              />
            </div>
          </div>
        </div>
      </section>

      <TrustBar />

      <BrandsSection />

      <StatsBar />

      <GoogleReviewsSection reviewsData={reviewsData} iframeSrc={googleReviewsIframeSrc} />

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
