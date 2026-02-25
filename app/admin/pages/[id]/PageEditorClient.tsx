'use client';

import { useState } from 'react';

type Block = {
  id: string;
  type: 'rich_text';
  content: string;
};

export function PageEditorClient(props: {
  id: string;
  initialTitle: string;
  initialSlug: string;
  initialMetaTitle: string;
  initialMetaDescription: string;
  initialContent: string;
}) {
  const [title, setTitle] = useState(props.initialTitle);
  const [slug, setSlug] = useState(props.initialSlug);
  const [metaTitle, setMetaTitle] = useState(props.initialMetaTitle);
  const [metaDescription, setMetaDescription] = useState(props.initialMetaDescription);

  // Single basic rich-text block using existing pages.content as storage
  const [block, setBlock] = useState<Block>({
    id: 'main',
    type: 'rich_text',
    content: props.initialContent,
  });

  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [error, setError] = useState('');

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setStatus('saving');
    setError('');
    try {
      const res = await fetch(`/api/admin/pages/${props.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug,
          metaTitle,
          metaDescription,
          content: block.content,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || 'Failed to save');
      }
      setStatus('saved');
    } catch (err: any) {
      setStatus('error');
      setError(err?.message || 'Failed to save');
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

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>Meta title</span>
          <input
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
            className="mt-2 w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-2"
            style={{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
          />
        </label>
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
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <p className="text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>Content block</p>
          <p className="text-xs mb-2" style={{ color: 'var(--color-text-muted)' }}>
            Basic rich-text block stored in the page&apos;s content field. HTML allowed.
          </p>
          <textarea
            rows={18}
            value={block.content}
            onChange={(e) => setBlock((b) => ({ ...b, content: e.target.value }))}
            className="w-full rounded-2xl border px-4 py-3 text-sm font-mono outline-none focus:ring-2"
            style={{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
          />
        </div>
        <div>
          <p className="text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>Live preview</p>
          <div className="rounded-2xl border p-4 md:p-6 max-h-[480px] overflow-auto" style={{ backgroundColor: 'var(--color-bg-elevated)', borderColor: 'var(--color-border)' }}>
            <div className="prose prose-sm max-w-none" style={{ color: 'var(--color-text)' }} dangerouslySetInnerHTML={{ __html: block.content }} />
          </div>
        </div>
      </div>

      {status === 'error' && (
        <p className="text-sm rounded-2xl border px-3 py-2" style={{ color: 'var(--color-accent-1)', borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-muted)' }}>
          {error || 'Failed to save.'}
        </p>
      )}
      {status === 'saved' && (
        <p className="text-sm rounded-2xl border px-3 py-2" style={{ color: 'var(--color-accent-3)', borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-muted)' }}>
          Saved.
        </p>
      )}

      <button
        type="submit"
        className="rounded-full px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
        style={{ backgroundColor: 'var(--color-accent-1)' }}
      >
        {status === 'saving' ? 'Saving…' : 'Save changes'}
      </button>
    </form>
  );
}

