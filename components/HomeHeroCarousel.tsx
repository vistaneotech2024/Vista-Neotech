'use client';

import type { CSSProperties } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { TechHeroBg } from '@/components/TechHeroBg';
import { Button } from '@/components/Button';
import type { HomeHeroConfig } from '@/lib/cms/hero';

const HERO_VIDEO_SRC = '/video/7792455-hd_1920_1080_25fps.mp4';

type Props = {
  config: HomeHeroConfig;
};

export function HomeHeroCarousel({ config }: Props) {
  const slides = useMemo(
    () => (config.slides || []).filter((s) => s.enabled !== false),
    [config.slides],
  );

  const [index, setIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => {
      if (mq.matches) {
        el.pause();
      } else {
        void el.play().catch(() => {});
      }
    };
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    if (!config.autoplay || slides.length <= 1) return;

    const delay = config.autoplayDelayMs > 0 ? config.autoplayDelayMs : 7000;
    const id = window.setInterval(() => {
      setIndex((prev) => ((prev + 1) % slides.length + slides.length) % slides.length);
    }, delay);

    return () => {
      window.clearInterval(id);
    };
  }, [config.autoplay, config.autoplayDelayMs, slides.length]);

  if (!slides.length) return null;

  const safeIndex = Math.min(index, slides.length - 1);
  const slide = slides[safeIndex];

  const alignClass = slide.alignment === 'left' ? 'items-start text-left' : 'items-center text-center';

  const goTo = (next: number) => {
    if (!slides.length) return;
    const normalized = ((next % slides.length) + slides.length) % slides.length;
    setIndex(normalized);
  };

  return (
    <section
      className="relative min-h-[75vh] overflow-hidden pt-20 pb-24 md:min-h-[78vh] md:pt-24 md:pb-28"
      style={
        {
          backgroundColor: '#070708',
          '--color-hero-text': '#f7f7f8',
          '--color-hero-text-muted': 'rgba(247, 247, 248, 0.78)',
        } as CSSProperties
      }
    >
      <div className="absolute inset-0 z-0" aria-hidden>
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          src={HERO_VIDEO_SRC}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden
        />
      </div>
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        aria-hidden
        style={{
          background:
            'linear-gradient(180deg, rgba(6,7,10,0.82) 0%, rgba(6,7,10,0.38) 42%, rgba(6,7,10,0.72) 100%)',
        }}
      />
      <TechHeroBg transparentBase />

      <div
        className={`container-tight relative z-10 flex min-h-[60vh] flex-col justify-center gap-6 md:min-h-[65vh] ${alignClass}`}
      >
        {slide.eyebrow && (
          <span
            className="overline-lg mb-2 inline-flex items-center gap-2 rounded-full border px-4 py-2.5 backdrop-blur-sm animate-fade-in-up"
            style={{
              borderColor: 'var(--color-border)',
              backgroundColor: 'var(--color-accent-1-muted)',
              color: 'var(--color-hero-text)',
              animationDelay: '0.1s',
            }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full animate-pulse"
              style={{ backgroundColor: 'var(--color-accent-1)' }}
            />
            {typeof slide.eyebrow === 'string' ? slide.eyebrow : ''}
          </span>
        )}

        <h1
          className="display-1 max-w-4xl animate-fade-in-up"
          style={{ color: 'var(--color-hero-text)', animationDelay: '0.2s' }}
        >
          {typeof slide.title === 'string' ? slide.title : ''}
        </h1>

        {typeof slide.description === 'string' && slide.description && (
          <p
            className="prose-lead mx-auto mt-4 max-w-2xl animate-fade-in-up"
            style={{ color: 'var(--color-hero-text-muted)', animationDelay: '0.3s' }}
          >
            {slide.description}
          </p>
        )}

        {(typeof slide.ctaLabel === 'string' || typeof slide.secondaryCtaLabel === 'string') && (
          <div
            className="mt-8 flex flex-wrap items-center gap-4 animate-fade-in-up"
            style={{ animationDelay: '0.4s' }}
          >
            {typeof slide.ctaLabel === 'string' && slide.ctaLabel && slide.ctaUrl && (
              <Button
                href={slide.ctaUrl}
                accent="orange"
                className="rounded-full px-8 py-4 text-base font-semibold text-white"
              >
                {slide.ctaLabel}
              </Button>
            )}
            {typeof slide.secondaryCtaLabel === 'string' && slide.secondaryCtaLabel && slide.secondaryCtaUrl && (
              <Button
                href={slide.secondaryCtaUrl}
                variant="outline-hero"
                className="rounded-full px-8 py-4 text-base font-semibold"
              >
                {slide.secondaryCtaLabel}
              </Button>
            )}
          </div>
        )}

        {slide.mediaType !== 'none' && slide.mediaUrl && (
          <div className="mt-10 w-full max-w-3xl animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            {slide.mediaType === 'image' ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={slide.mediaUrl}
                alt={slide.mediaAlt || slide.title}
                className="w-full rounded-3xl border shadow-lg"
                style={{ borderColor: 'var(--color-border)' }}
              />
            ) : (
              <div
                className="relative w-full overflow-hidden rounded-3xl border shadow-lg"
                style={{ borderColor: 'var(--color-border)' }}
              >
                <video src={slide.mediaUrl} controls className="h-full w-full" />
              </div>
            )}
          </div>
        )}
      </div>

      {config.showArrows && slides.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous slide"
            onClick={() => goTo(safeIndex - 1)}
            className="absolute left-4 top-1/2 hidden -translate-y-1/2 rounded-full border bg-black/40 p-2 text-white backdrop-blur md:inline-flex"
            style={{ borderColor: 'var(--color-border)' }}
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={() => goTo(safeIndex + 1)}
            className="absolute right-4 top-1/2 hidden -translate-y-1/2 rounded-full border bg-black/40 p-2 text-white backdrop-blur md:inline-flex"
            style={{ borderColor: 'var(--color-border)' }}
          >
            ›
          </button>
        </>
      )}

      {config.showIndicators && slides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => goTo(i)}
              className={`h-2.5 rounded-full transition-all ${
                i === safeIndex ? 'w-7 bg-white' : 'w-2.5 bg-white/40'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}

