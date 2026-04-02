'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RichTextEditor } from '@/components/editor/RichTextEditor';

function slugify(input: string) {
  return String(input || '')
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

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
  const [slugTouched, setSlugTouched] = useState(false);
  const [status, setStatus] = useState(props.initialStatus || 'draft');
  const [metaTitle, setMetaTitle] = useState(props.initialMetaTitle);
  const [metaDescription, setMetaDescription] = useState(props.initialMetaDescription);
  const [focusKeyword, setFocusKeyword] = useState(props.initialFocusKeyword);
  const [canonicalUrl, setCanonicalUrl] = useState(props.initialCanonicalUrl);
  const [imageUrl, setImageUrl] = useState(props.initialImageUrl);
  const [excerpt, setExcerpt] = useState(props.initialExcerpt);
  const [content, setContent] = useState(props.initialContent);

  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function uploadFeaturedImage(file: File) {
    setUploadingImage(true);
    setError(null);
    setSaved(false);
    try {
      const form = new FormData();
      form.set('file', file);
      form.set('folder', 'uploads/blog');

      const res = await fetch('/api/admin/uploads', { method: 'POST', body: form });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body?.error || 'Failed to upload image');

      const url = typeof body?.url === 'string' ? body.url : '';
      if (!url) throw new Error('Uploaded, but no URL returned');
      setImageUrl(url);
    } catch (err: any) {
      setError(err?.message || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);

    try {
      const isNew = props.id === 'new';

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
          customFields: {},
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
            onChange={(e) => {
              const nextTitle = e.target.value;
              setTitle(nextTitle);
              if (props.id === 'new' && !slugTouched) {
                setSlug(slugify(nextTitle));
              }
            }}
            className="mt-2 w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-2"
            style={{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>Slug</span>
          <input
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(slugify(e.target.value));
            }}
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
          Advanced (JSON + featured image)
        </summary>
        <div className="mt-4 grid gap-4">
          <label className="block">
            <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>Upload featured image</span>
            <input
              type="file"
              accept="image/*"
              disabled={uploadingImage}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) uploadFeaturedImage(f);
              }}
              className="mt-2 w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-2"
              style={{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            />
            <p className="mt-1 text-xs" style={{ color: 'var(--color-text-muted)' }}>
              Uploads to `public/uploads/blog/`.
            </p>
          </label>

          {imageUrl?.trim() ? (
            <div className="rounded-2xl border p-3 md:p-4" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg)' }}>
              <p className="text-xs mb-2" style={{ color: 'var(--color-text-muted)' }}>
                Preview
              </p>
              <img
                src={imageUrl}
                alt="Featured image preview"
                className="h-48 w-full rounded-xl object-cover"
                onError={() => setError('Image preview failed to load. Please check the Image URL.')}
              />
            </div>
          ) : null}

        </div>
      </details>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <p className="text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>Content</p>
          <RichTextEditor
            value={content}
            onChange={setContent}
            placeholder="Write your post…"
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

