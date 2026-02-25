'use client';

import { useState } from 'react';

export function BlogEditorClient(props: {
  id: string;
  initialTitle: string;
  initialSlug: string;
  initialStatus: string;
  initialMetaTitle: string;
  initialMetaDescription: string;
  initialExcerpt: string;
  initialContent: string;
}) {
  const [title, setTitle] = useState(props.initialTitle);
  const [slug, setSlug] = useState(props.initialSlug);
  const [status, setStatus] = useState(props.initialStatus || 'draft');
  const [metaTitle, setMetaTitle] = useState(props.initialMetaTitle);
  const [metaDescription, setMetaDescription] = useState(props.initialMetaDescription);
  const [excerpt, setExcerpt] = useState(props.initialExcerpt);
  const [content, setContent] = useState(props.initialContent);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);

    try {
      const res = await fetch(`/api/admin/blog/${props.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug,
          status,
          metaTitle,
          metaDescription,
          excerpt,
          content,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || 'Failed to save');
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
          </select>
        </label>
      </div>

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
        {saving ? 'Saving…' : 'Save changes'}
      </button>
    </form>
  );
}

