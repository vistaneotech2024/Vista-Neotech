'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function BlogEditorClient(props: {
  id: string;
  initialTitle: string;
  initialSlug: string;
  initialStatus: string;
  initialMetaTitle: string;
  initialMetaDescription: string;
  initialFocusKeyword: string;
  initialCanonicalUrl: string;
  initialOgTitle: string;
  initialOgDescription: string;
  initialOgImage: string;
  initialOgType: string;
  initialTwitterCard: string;
  initialTwitterTitle: string;
  initialTwitterDescription: string;
  initialTwitterImage: string;
  initialSchemaMarkup: string;
  initialCustomFields: string;
  initialImageUrl: string;
  initialExcerpt: string;
  initialContent: string;
}) {
  const router = useRouter();
  const [title, setTitle] = useState(props.initialTitle);
  const [slug, setSlug] = useState(props.initialSlug);
  const [status, setStatus] = useState(props.initialStatus || 'draft');
  const [metaTitle, setMetaTitle] = useState(props.initialMetaTitle);
  const [metaDescription, setMetaDescription] = useState(props.initialMetaDescription);
  const [focusKeyword, setFocusKeyword] = useState(props.initialFocusKeyword);
  const [canonicalUrl, setCanonicalUrl] = useState(props.initialCanonicalUrl);
  const [ogTitle, setOgTitle] = useState(props.initialOgTitle);
  const [ogDescription, setOgDescription] = useState(props.initialOgDescription);
  const [ogImage, setOgImage] = useState(props.initialOgImage);
  const [ogType, setOgType] = useState(props.initialOgType || 'article');
  const [twitterCard, setTwitterCard] = useState(props.initialTwitterCard || 'summary_large_image');
  const [twitterTitle, setTwitterTitle] = useState(props.initialTwitterTitle);
  const [twitterDescription, setTwitterDescription] = useState(props.initialTwitterDescription);
  const [twitterImage, setTwitterImage] = useState(props.initialTwitterImage);
  const [schemaMarkup, setSchemaMarkup] = useState(props.initialSchemaMarkup);
  const [customFields, setCustomFields] = useState(props.initialCustomFields || '{}');
  const [imageUrl, setImageUrl] = useState(props.initialImageUrl);
  const [excerpt, setExcerpt] = useState(props.initialExcerpt);
  const [content, setContent] = useState(props.initialContent);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  function parseJsonOrThrow(label: string, value: string, { allowEmpty }: { allowEmpty: boolean }) {
    const raw = value.trim();
    if (!raw) {
      if (allowEmpty) return null;
      throw new Error(`${label} is required`);
    }
    try {
      return JSON.parse(raw);
    } catch {
      throw new Error(`${label} must be valid JSON`);
    }
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);

    try {
      const isNew = props.id === 'new';
      const parsedSchemaMarkup = schemaMarkup.trim()
        ? parseJsonOrThrow('Schema markup', schemaMarkup, { allowEmpty: true })
        : null;
      const parsedCustomFields = parseJsonOrThrow('Custom fields', customFields, { allowEmpty: false }) ?? {};

      const res = await fetch(isNew ? '/api/admin/blog/new' : `/api/admin/blog/${props.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug,
          status,
          metaTitle,
          metaDescription,
          focusKeyword,
          canonicalUrl,
          ogTitle,
          ogDescription,
          ogImage,
          ogType,
          twitterCard,
          twitterTitle,
          twitterDescription,
          twitterImage,
          schemaMarkup: parsedSchemaMarkup,
          customFields: parsedCustomFields,
          imageUrl,
          excerpt,
          content,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || 'Failed to save');
      }

      if (isNew) {
        const body = await res.json().catch(() => ({}));
        const id = typeof body?.id === 'string' ? body.id : '';
        if (!id) throw new Error('Created, but no id returned');
        router.replace(`/admin/blog/${encodeURIComponent(id)}`);
        return;
      }

      setSaved(true);
    } catch (err: any) {
      setError(err?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSave} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>Title</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-2 w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-2"
            style={{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>Slug</span>
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="mt-2 w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-2"
            style={{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
          />
          <p className="mt-1 text-xs" style={{ color: 'var(--color-text-muted)' }}>
            URL: /{slug}
          </p>
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="block md:col-span-2">
          <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>Meta title</span>
          <input
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
            className="mt-2 w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-2"
            style={{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>Status</span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-2 w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-2"
            style={{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
            <option value="trash">Trash</option>
          </select>
        </label>
      </div>

      <details className="rounded-3xl border p-4 md:p-5" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-elevated)' }}>
        <summary className="cursor-pointer select-none text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
          SEO & canonical
        </summary>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>Focus keyword</span>
            <input
              value={focusKeyword}
              onChange={(e) => setFocusKeyword(e.target.value)}
              className="mt-2 w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-2"
              style={{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>Canonical URL</span>
            <input
              value={canonicalUrl}
              onChange={(e) => setCanonicalUrl(e.target.value)}
              placeholder="https://example.com/your-post"
              className="mt-2 w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-2"
              style={{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            />
          </label>
        </div>
      </details>

      <details className="rounded-3xl border p-4 md:p-5" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-elevated)' }}>
        <summary className="cursor-pointer select-none text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
          Open Graph (social preview)
        </summary>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>OG title</span>
            <input
              value={ogTitle}
              onChange={(e) => setOgTitle(e.target.value)}
              className="mt-2 w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-2"
              style={{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>OG type</span>
            <input
              value={ogType}
              onChange={(e) => setOgType(e.target.value)}
              placeholder="article"
              className="mt-2 w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-2"
              style={{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            />
          </label>
          <label className="block md:col-span-2">
            <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>OG description</span>
            <textarea
              rows={3}
              value={ogDescription}
              onChange={(e) => setOgDescription(e.target.value)}
              className="mt-2 w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-2"
              style={{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            />
          </label>
          <label className="block md:col-span-2">
            <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>OG image URL</span>
            <input
              value={ogImage}
              onChange={(e) => setOgImage(e.target.value)}
              placeholder="https://example.com/og.jpg"
              className="mt-2 w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-2"
              style={{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            />
          </label>
        </div>
      </details>

      <details className="rounded-3xl border p-4 md:p-5" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-elevated)' }}>
        <summary className="cursor-pointer select-none text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
          Twitter card
        </summary>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>Twitter card</span>
            <input
              value={twitterCard}
              onChange={(e) => setTwitterCard(e.target.value)}
              placeholder="summary_large_image"
              className="mt-2 w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-2"
              style={{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>Twitter title</span>
            <input
              value={twitterTitle}
              onChange={(e) => setTwitterTitle(e.target.value)}
              className="mt-2 w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-2"
              style={{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            />
          </label>
          <label className="block md:col-span-2">
            <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>Twitter description</span>
            <textarea
              rows={3}
              value={twitterDescription}
              onChange={(e) => setTwitterDescription(e.target.value)}
              className="mt-2 w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-2"
              style={{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            />
          </label>
          <label className="block md:col-span-2">
            <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>Twitter image URL</span>
            <input
              value={twitterImage}
              onChange={(e) => setTwitterImage(e.target.value)}
              placeholder="https://example.com/twitter.jpg"
              className="mt-2 w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-2"
              style={{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            />
          </label>
        </div>
      </details>

      <label className="block">
        <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>Meta description</span>
        <textarea
          rows={3}
          value={metaDescription}
          onChange={(e) => setMetaDescription(e.target.value)}
          className="mt-2 w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-2"
          style={{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>Excerpt</span>
        <textarea
          rows={3}
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          className="mt-2 w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-2"
          style={{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
        />
      </label>

      <details className="rounded-3xl border p-4 md:p-5" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-elevated)' }}>
        <summary className="cursor-pointer select-none text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
          Advanced (JSON + image URL)
        </summary>
        <div className="mt-4 grid gap-4">
          <label className="block">
            <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>Image URL</span>
            <input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/featured.jpg"
              className="mt-2 w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-2"
              style={{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            />
            <p className="mt-1 text-xs" style={{ color: 'var(--color-text-muted)' }}>
              Stores to `posts.image_url`.
            </p>
          </label>

          <label className="block">
            <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>Schema markup (JSON)</span>
            <textarea
              rows={8}
              value={schemaMarkup}
              onChange={(e) => setSchemaMarkup(e.target.value)}
              placeholder='{"@context":"https://schema.org","@type":"BlogPosting"}'
              className="mt-2 w-full rounded-2xl border px-4 py-3 text-sm font-mono outline-none focus:ring-2"
              style={{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            />
            <p className="mt-1 text-xs" style={{ color: 'var(--color-text-muted)' }}>
              Optional. Leave empty to store NULL.
            </p>
          </label>

          <label className="block">
            <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>Custom fields (JSON)</span>
            <textarea
              rows={8}
              value={customFields}
              onChange={(e) => setCustomFields(e.target.value)}
              className="mt-2 w-full rounded-2xl border px-4 py-3 text-sm font-mono outline-none focus:ring-2"
              style={{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            />
            <p className="mt-1 text-xs" style={{ color: 'var(--color-text-muted)' }}>
              Required JSON (defaults to `{}`).
            </p>
          </label>
        </div>
      </details>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <p className="text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>Content (HTML allowed)</p>
          <textarea
            rows={20}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full rounded-2xl border px-4 py-3 text-sm font-mono outline-none focus:ring-2"
            style={{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
          />
        </div>
        <div>
          <p className="text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>Live preview</p>
          <div
            className="rounded-2xl border p-4 md:p-6 max-h-[520px] overflow-auto"
            style={{ backgroundColor: 'var(--color-bg-elevated)', borderColor: 'var(--color-border)' }}
          >
            <div
              className="prose prose-sm max-w-none"
              style={{ color: 'var(--color-text)' }}
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        </div>
      </div>

      {error && (
        <p
          className="text-sm rounded-2xl border px-3 py-2"
          style={{ color: 'var(--color-accent-1)', borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-muted)' }}
        >
          {error}
        </p>
      )}
      {saved && !error && (
        <p
          className="text-sm rounded-2xl border px-3 py-2"
          style={{ color: 'var(--color-accent-3)', borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-muted)' }}
        >
          Saved.
        </p>
      )}

      <button
        type="submit"
        disabled={saving}
        className="rounded-full px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
        style={{ backgroundColor: 'var(--color-accent-1)' }}
      >
        {saving ? 'Saving…' : (props.id === 'new' ? 'Create post' : 'Save changes')}
      </button>
    </form>
  );
}

