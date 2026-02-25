'use client';

import { useState } from 'react';
import type { HomeHeroConfig, HeroSlide } from '@/lib/cms/hero';
import { HomeHeroCarousel } from '@/components/HomeHeroCarousel';

type Props = {
  initialConfig: HomeHeroConfig;
};

const makeId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return (crypto as Crypto).randomUUID();
  }
  return `slide-${Math.random().toString(36).slice(2, 10)}`;
};

function ensureConfig(config: HomeHeroConfig): HomeHeroConfig {
  const slides = config.slides && config.slides.length > 0 ? config.slides : [
    {
      id: makeId(),
      eyebrow: 'In pursuit of excellence',
      title: 'MLM Software & Direct Selling Consultants',
      subtitle: null,
      description:
        'Expert technology solutions and consultancy for network marketing success. From software to strategy—we scale your direct selling business.',
      mediaType: 'none',
      mediaUrl: null,
      mediaAlt: null,
      ctaLabel: 'Get in touch',
      ctaUrl: '/contact',
      secondaryCtaLabel: 'Our services',
      secondaryCtaUrl: '/mlm-software-direct-selling-consultant',
      alignment: 'center',
      enabled: true,
    } as HeroSlide,
  ];

  return {
    autoplay: typeof config.autoplay === 'boolean' ? config.autoplay : true,
    autoplayDelayMs: typeof config.autoplayDelayMs === 'number' ? config.autoplayDelayMs : 7000,
    showIndicators: typeof config.showIndicators === 'boolean' ? config.showIndicators : true,
    showArrows: typeof config.showArrows === 'boolean' ? config.showArrows : true,
    slides,
  };
}

export default function HeroEditorClient({ initialConfig }: Props) {
  const [config, setConfig] = useState<HomeHeroConfig>(() => ensureConfig(initialConfig));
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const updateSlide = (index: number, patch: Partial<HeroSlide>) => {
    setConfig((prev) => {
      const nextSlides = [...prev.slides];
      const current = nextSlides[index];
      if (!current) return prev;
      nextSlides[index] = { ...current, ...patch };
      return { ...prev, slides: nextSlides };
    });
  };

  const addSlide = () => {
    setConfig((prev) => ({
      ...prev,
      slides: [
        ...prev.slides,
        {
          id: makeId(),
          eyebrow: '',
          title: 'New hero slide',
          subtitle: '',
          description: '',
          mediaType: 'none',
          mediaUrl: '',
          mediaAlt: '',
          ctaLabel: '',
          ctaUrl: '',
          secondaryCtaLabel: '',
          secondaryCtaUrl: '',
          alignment: 'center',
          enabled: true,
        },
      ],
    }));
  };

  const removeSlide = (index: number) => {
    setConfig((prev) => {
      const nextSlides = prev.slides.filter((_, i) => i !== index);
      return { ...prev, slides: nextSlides };
    });
  };

  const moveSlide = (from: number, to: number) => {
    setConfig((prev) => {
      const nextSlides = [...prev.slides];
      if (to < 0 || to >= nextSlides.length) return prev;
      const [moved] = nextSlides.splice(from, 1);
      nextSlides.splice(to, 0, moved);
      return { ...prev, slides: nextSlides };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(null);
    setError(null);

    try {
      const cleanSlides = config.slides.filter((s) => s.title && s.title.trim().length > 0);
      const payload: HomeHeroConfig = {
        ...config,
        slides: cleanSlides,
      };

      const res = await fetch('/api/admin/hero', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ config: payload }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to save hero');
      }

      setSuccess('Hero saved successfully.');
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div
          className="rounded-2xl border p-4 md:p-5"
          style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-elevated)' }}
        >
          <h2 className="text-base font-semibold" style={{ color: 'var(--color-text)' }}>
            Global hero settings
          </h2>
          <p className="mt-1 text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Control carousel behaviour for your homepage hero section.
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <label className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text)' }}>
              <input
                type="checkbox"
                className="h-4 w-4 rounded border"
                checked={config.autoplay}
                onChange={(e) => setConfig((prev) => ({ ...prev, autoplay: e.target.checked }))}
              />
              Autoplay slides
            </label>
            <label className="flex flex-col text-sm" style={{ color: 'var(--color-text)' }}>
              Autoplay delay (ms)
              <input
                type="number"
                min={2000}
                step={500}
                className="mt-1 rounded-lg border px-3 py-2 text-sm"
                style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg)' }}
                value={config.autoplayDelayMs}
                onChange={(e) =>
                  setConfig((prev) => ({ ...prev, autoplayDelayMs: Number(e.target.value) || 7000 }))
                }
              />
            </label>
            <div className="flex flex-col gap-2 text-sm" style={{ color: 'var(--color-text)' }}>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border"
                  checked={config.showIndicators}
                  onChange={(e) => setConfig((prev) => ({ ...prev, showIndicators: e.target.checked }))}
                />
                Show dots (indicators)
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border"
                  checked={config.showArrows}
                  onChange={(e) => setConfig((prev) => ({ ...prev, showArrows: e.target.checked }))}
                />
                Show arrows
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold" style={{ color: 'var(--color-text)' }}>
                Slides
              </h2>
              <p className="mt-1 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                Add multiple slides with images, videos or pure text and CTAs.
              </p>
            </div>
            <button
              type="button"
              onClick={addSlide}
              className="rounded-full border px-4 py-2 text-sm font-medium"
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            >
              + Add slide
            </button>
          </div>

          <div className="space-y-4">
            {config.slides.map((slide, index) => (
              <div
                key={slide.id}
                className="rounded-2xl border p-4 md:p-5"
                style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-elevated)' }}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
                      Slide {index + 1}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                      {slide.title || 'Untitled slide'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-1 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                      <input
                        type="checkbox"
                        className="h-3.5 w-3.5 rounded border"
                        checked={slide.enabled !== false}
                        onChange={(e) => updateSlide(index, { enabled: e.target.checked })}
                      />
                      Active
                    </label>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => moveSlide(index, index - 1)}
                        className="rounded-full border px-2 py-1 text-xs disabled:opacity-40"
                        style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        disabled={index === config.slides.length - 1}
                        onClick={() => moveSlide(index, index + 1)}
                        className="rounded-full border px-2 py-1 text-xs disabled:opacity-40"
                        style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                      >
                        ↓
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeSlide(index)}
                      className="rounded-full border px-2 py-1 text-xs text-red-500"
                      style={{ borderColor: 'var(--color-border)' }}
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div className="space-y-3">
                    <label className="block text-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>
                      Eyebrow / overline
                      <input
                        type="text"
                        className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                        style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg)' }}
                        value={slide.eyebrow ?? ''}
                        onChange={(e) => updateSlide(index, { eyebrow: e.target.value })}
                      />
                    </label>
                    <label className="block text-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>
                      Main title
                      <input
                        type="text"
                        className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                        style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg)' }}
                        value={slide.title}
                        onChange={(e) => updateSlide(index, { title: e.target.value })}
                        required
                      />
                    </label>
                    <label className="block text-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>
                      Description
                      <textarea
                        className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                        rows={3}
                        style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg)' }}
                        value={slide.description ?? ''}
                        onChange={(e) => updateSlide(index, { description: e.target.value })}
                      />
                    </label>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>
                      Alignment
                      <select
                        className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                        style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg)' }}
                        value={slide.alignment || 'center'}
                        onChange={(e) => updateSlide(index, { alignment: e.target.value as HeroSlide['alignment'] })}
                      >
                        <option value="center">Center</option>
                        <option value="left">Left</option>
                      </select>
                    </label>

                    <div className="grid grid-cols-2 gap-3">
                      <label className="block text-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>
                        Primary CTA label
                        <input
                          type="text"
                          className="mt-1 w-full rounded-lg border px-3 py-2 text-xs"
                          style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg)' }}
                          value={slide.ctaLabel ?? ''}
                          onChange={(e) => updateSlide(index, { ctaLabel: e.target.value })}
                        />
                      </label>
                      <label className="block text-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>
                        Primary CTA URL
                        <input
                          type="text"
                          className="mt-1 w-full rounded-lg border px-3 py-2 text-xs"
                          style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg)' }}
                          value={slide.ctaUrl ?? ''}
                          onChange={(e) => updateSlide(index, { ctaUrl: e.target.value })}
                        />
                      </label>
                      <label className="block text-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>
                        Secondary CTA label
                        <input
                          type="text"
                          className="mt-1 w-full rounded-lg border px-3 py-2 text-xs"
                          style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg)' }}
                          value={slide.secondaryCtaLabel ?? ''}
                          onChange={(e) => updateSlide(index, { secondaryCtaLabel: e.target.value })}
                        />
                      </label>
                      <label className="block text-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>
                        Secondary CTA URL
                        <input
                          type="text"
                          className="mt-1 w-full rounded-lg border px-3 py-2 text-xs"
                          style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg)' }}
                          value={slide.secondaryCtaUrl ?? ''}
                          onChange={(e) => updateSlide(index, { secondaryCtaUrl: e.target.value })}
                        />
                      </label>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <label className="block text-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>
                        Media type
                        <select
                          className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                          style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg)' }}
                          value={slide.mediaType}
                          onChange={(e) =>
                            updateSlide(index, { mediaType: e.target.value as HeroSlide['mediaType'] })
                          }
                        >
                          <option value="none">None (text only)</option>
                          <option value="image">Image</option>
                          <option value="video">Video</option>
                        </select>
                      </label>
                      <label className="block text-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>
                        Media URL
                        <input
                          type="text"
                          className="mt-1 w-full rounded-lg border px-3 py-2 text-xs"
                          style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg)' }}
                          value={slide.mediaUrl ?? ''}
                          onChange={(e) => updateSlide(index, { mediaUrl: e.target.value })}
                          placeholder="https://..."
                        />
                      </label>
                    </div>
                    <label className="block text-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>
                      Media alt text
                      <input
                        type="text"
                        className="mt-1 w-full rounded-lg border px-3 py-2 text-xs"
                        style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg)' }}
                        value={slide.mediaAlt ?? ''}
                        onChange={(e) => updateSlide(index, { mediaAlt: e.target.value })}
                      />
                    </label>
                  </div>
                </div>
              </div>
            ))}

            {config.slides.length === 0 && (
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                No slides yet. Click &ldquo;Add slide&rdquo; to get started.
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-full px-5 py-2.5 text-sm font-semibold text-white"
            style={{ backgroundColor: 'var(--color-accent-1)' }}
          >
            {saving ? 'Saving…' : 'Save hero'}
          </button>
          {success && (
            <span className="text-sm" style={{ color: 'var(--color-success, #16a34a)' }}>
              {success}
            </span>
          )}
          {error && (
            <span className="text-sm" style={{ color: 'var(--color-danger, #dc2626)' }}>
              {error}
            </span>
          )}
        </div>
      </form>

      <div
        className="overflow-hidden rounded-3xl border"
        style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-muted)' }}
      >
        <HomeHeroCarousel config={config} />
      </div>
    </div>
  );
}

