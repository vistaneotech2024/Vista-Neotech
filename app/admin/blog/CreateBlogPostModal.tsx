'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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

type Props = {
  triggerLabel?: string;
};

type BlogCategory = {
  id: string;
  name: string;
  is_active: boolean;
};

export function CreateBlogPostModal({ triggerLabel = 'Create blog' }: Props) {
  const router = useRouter();
  const panelRef = useRef<HTMLDivElement | null>(null);

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [slugTouched, setSlugTouched] = useState(false);
  const [status, setStatus] = useState<'draft' | 'published'>('published');
  const [categoryId, setCategoryId] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [focusKeyword, setFocusKeyword] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string>('');

  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  const [aiDialogOpen, setAiDialogOpen] = useState(false);
  const [aiBriefTitle, setAiBriefTitle] = useState('');
  const [aiBriefDescription, setAiBriefDescription] = useState('');
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    return (
      title.trim().length > 0 &&
      slug.trim().length > 0 &&
      categoryId.trim().length > 0 &&
      content.trim().length > 0 &&
      !saving
    );
  }, [title, slug, categoryId, content, saving]);

  const selectedCategoryName = useMemo(() => {
    const c = categories.find((x) => x.id === categoryId);
    return c?.name ?? '';
  }, [categories, categoryId]);

  const reset = useCallback(() => {
    setTitle('');
    setSlug('');
    setSlugTouched(false);
    setStatus('published');
    setCategoryId('');
    setMetaTitle('');
    setMetaDescription('');
    setFocusKeyword('');
    setContent('');
    setImageUrl('');
    setCoverFile(null);
    setCoverPreviewUrl('');
    setSaving(false);
    setUploadingImage(false);
    setError(null);
    setAiDialogOpen(false);
    setAiBriefTitle('');
    setAiBriefDescription('');
    setAiGenerating(false);
    setAiError(null);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    setAiDialogOpen(false);
    setAiError(null);
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (aiDialogOpen) {
        if (!aiGenerating) {
          setAiDialogOpen(false);
          setAiError(null);
        }
        return;
      }
      close();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, close, aiDialogOpen, aiGenerating]);

  useEffect(() => {
    if (!open) return;
    // focus for accessibility & quick typing
    const t = window.setTimeout(() => panelRef.current?.querySelector<HTMLInputElement>('input[name="title"]')?.focus(), 50);
    return () => window.clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    let cancelled = false;
    setLoadingCategories(true);
    fetch('/api/admin/blog-categories', { method: 'GET' })
      .then(async (res) => {
        const body = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(body?.error || 'Failed to load categories');
        const list = Array.isArray(body?.categories) ? (body.categories as BlogCategory[]) : [];
        const active = list.filter((c) => c && c.is_active);
        if (!cancelled) setCategories(active);
      })
      .catch((e: any) => {
        if (!cancelled) setError(e?.message || 'Failed to load categories');
      })
      .finally(() => {
        if (!cancelled) setLoadingCategories(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open]);

  useEffect(() => {
    if (!coverFile) {
      setCoverPreviewUrl('');
      return;
    }
    const url = URL.createObjectURL(coverFile);
    setCoverPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [coverFile]);

  async function uploadCoverImage(file: File) {
    setUploadingImage(true);
    setError(null);
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
      return url;
    } catch (err: any) {
      setError(err?.message || 'Failed to upload image');
      return '';
    } finally {
      setUploadingImage(false);
    }
  }

  function openAiDialog() {
    setAiError(null);
    setAiBriefTitle(title.trim() || '');
    setAiBriefDescription('');
    setAiDialogOpen(true);
  }

  async function runAiGenerate(e: React.FormEvent) {
    e.preventDefault();
    const t = aiBriefTitle.trim();
    if (!t || aiGenerating) return;

    setAiGenerating(true);
    setAiError(null);
    try {
      const res = await fetch('/api/admin/blog/generate-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          briefTitle: t,
          briefDescription: aiBriefDescription.trim(),
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(typeof body?.error === 'string' ? body.error : 'AI generation failed');
      }

      const nextTitle = typeof body.title === 'string' ? body.title.trim() : '';
      const nextSlug = typeof body.slug === 'string' ? body.slug.trim() : '';
      const nextContent = typeof body.content === 'string' ? body.content : '';
      if (!nextTitle || !nextContent) {
        throw new Error('AI returned an incomplete post');
      }

      setTitle(nextTitle);
      setSlugTouched(true);
      setSlug(nextSlug ? slugify(nextSlug) : slugify(nextTitle));
      setMetaTitle(typeof body.metaTitle === 'string' ? body.metaTitle.trim() : '');
      setMetaDescription(typeof body.metaDescription === 'string' ? body.metaDescription.trim() : '');
      setFocusKeyword(typeof body.focusKeyword === 'string' ? body.focusKeyword.trim() : '');
      setContent(nextContent);

      setAiDialogOpen(false);
      setAiBriefDescription('');
      setAiError(null);
    } catch (err: any) {
      setAiError(err?.message || 'AI generation failed');
    } finally {
      setAiGenerating(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setSaving(true);
    setError(null);

    try {
      let finalImageUrl = imageUrl.trim();
      if (!finalImageUrl && coverFile) {
        finalImageUrl = await uploadCoverImage(coverFile);
        if (!finalImageUrl) {
          throw new Error('Cover image upload failed');
        }
      }

      const res = await fetch('/api/admin/blog/new', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          slug: slug.trim(),
          status,
          metaTitle: metaTitle.trim(),
          metaDescription: metaDescription.trim(),
          focusKeyword: focusKeyword.trim(),
          canonicalUrl: '',
          customFields: {
            categoryId: categoryId.trim(),
            category: selectedCategoryName,
          },
          imageUrl: finalImageUrl,
          excerpt: '',
          content,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || 'Failed to create post');
      }

      const body = await res.json().catch(() => ({}));
      const id = typeof body?.id === 'string' ? body.id : '';
      if (!id) throw new Error('Created, but no id returned');

      close();
      reset();
      router.refresh();
    } catch (err: any) {
      setError(err?.message || 'Failed to create post');
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-semibold transition hover:opacity-90 sm:self-start sm:ml-2"
        style={{ backgroundColor: 'var(--color-accent-3)', color: '#fff' }}
      >
        {triggerLabel}
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="create-blog-heading"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !aiDialogOpen) close();
          }}
          style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
        >
          <div
            ref={panelRef}
            className="w-full max-w-4xl overflow-hidden rounded-3xl border shadow-xl"
            style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-elevated)' }}
          >
            <div className="flex items-start justify-between gap-3 border-b p-4 sm:p-5" style={{ borderColor: 'var(--color-border)' }}>
              <div className="min-w-0">
                <h2 id="create-blog-heading" className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>
                  Create New Blog Post
                </h2>
                <p className="mt-1 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  Fill in the details and create a draft.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={openAiDialog}
                  className="rounded-full border px-3 py-1.5 text-xs font-semibold transition hover:opacity-90"
                  style={{
                    borderColor: 'var(--color-accent-2, var(--color-border))',
                    color: 'var(--color-text)',
                    backgroundColor: 'var(--color-bg-muted)',
                  }}
                >
                  Generate with AI
                </button>
                <button
                  type="button"
                  onClick={close}
                  className="rounded-full border px-3 py-1.5 text-xs font-semibold transition hover:opacity-90"
                  style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
            </div>

            <form onSubmit={onSubmit} className="max-h-[80vh] overflow-auto p-4 sm:p-5">
              <div className="grid gap-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                      Title *
                    </span>
                    <input
                      name="title"
                      value={title}
                      onChange={(e) => {
                        const nextTitle = e.target.value;
                        setTitle(nextTitle);
                        if (!slugTouched) setSlug(slugify(nextTitle));
                      }}
                      className="mt-2 w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-2"
                      style={{
                        backgroundColor: 'var(--color-bg)',
                        borderColor: 'var(--color-border)',
                        color: 'var(--color-text)',
                      }}
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                      Category *
                    </span>
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      className="mt-2 w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-2"
                      style={{
                        backgroundColor: 'var(--color-bg)',
                        borderColor: 'var(--color-border)',
                        color: 'var(--color-text)',
                      }}
                    >
                      <option value="">{loadingCategories ? 'Loading categories…' : 'Select Category'}</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                    <p className="mt-1 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                      This list comes from Admin → Blog categories.
                    </p>
                  </label>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block md:col-span-2">
                    <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                      Slug *
                    </span>
                    <input
                      value={slug}
                      onChange={(e) => {
                        setSlugTouched(true);
                        setSlug(slugify(e.target.value));
                      }}
                      className="mt-2 w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-2"
                      style={{
                        backgroundColor: 'var(--color-bg)',
                        borderColor: 'var(--color-border)',
                        color: 'var(--color-text)',
                      }}
                    />
                    <p className="mt-1 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                      URL: /blog/{slug || 'your-slug'}
                    </p>
                  </label>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                      Status
                    </span>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value === 'draft' ? 'draft' : 'published')}
                      className="mt-2 w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-2"
                      style={{
                        backgroundColor: 'var(--color-bg)',
                        borderColor: 'var(--color-border)',
                        color: 'var(--color-text)',
                      }}
                    >
                      <option value="published">Published (shows on /blog)</option>
                      <option value="draft">Draft (hidden from /blog)</option>
                    </select>
                    <p className="mt-1 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                      Only published posts are visible on the public blog page.
                    </p>
                  </label>
                </div>

                <div
                  className="rounded-2xl border p-4 sm:p-5"
                  style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-muted)' }}
                >
                  <p className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
                    SEO & meta
                  </p>
                  <p className="mt-1 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                    Used for search snippets and on-page metadata. All optional.
                  </p>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <label className="block">
                      <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                        Meta title
                      </span>
                      <input
                        name="meta_title"
                        value={metaTitle}
                        onChange={(e) => setMetaTitle(e.target.value)}
                        className="mt-2 w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-2"
                        style={{
                          backgroundColor: 'var(--color-bg)',
                          borderColor: 'var(--color-border)',
                          color: 'var(--color-text)',
                        }}
                        placeholder="Override title in search results…"
                      />
                    </label>
                    <label className="block">
                      <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                        Focus keyword
                      </span>
                      <input
                        name="focus_keyword"
                        value={focusKeyword}
                        onChange={(e) => setFocusKeyword(e.target.value)}
                        className="mt-2 w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-2"
                        style={{
                          backgroundColor: 'var(--color-bg)',
                          borderColor: 'var(--color-border)',
                          color: 'var(--color-text)',
                        }}
                        placeholder="Primary keyword phrase…"
                      />
                    </label>
                    <label className="block md:col-span-2">
                      <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                        Meta description
                      </span>
                      <textarea
                        name="meta_description"
                        rows={3}
                        value={metaDescription}
                        onChange={(e) => setMetaDescription(e.target.value)}
                        className="mt-2 w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-2"
                        style={{
                          backgroundColor: 'var(--color-bg)',
                          borderColor: 'var(--color-border)',
                          color: 'var(--color-text)',
                        }}
                        placeholder="Short summary for search results and social previews…"
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                    Content *
                  </span>
                  <div className="mt-2">
                    <RichTextEditor value={content} onChange={setContent} placeholder="Write your post…" />
                  </div>
                </div>

                <label className="block">
                  <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                    Cover Image
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={saving || uploadingImage}
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      setCoverFile(f ?? null);
                      setImageUrl('');
                    }}
                    className="mt-2 w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-2"
                    style={{
                      backgroundColor: 'var(--color-bg)',
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-text)',
                    }}
                  />
                  <p className="mt-1 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                    Select an image now; it will be uploaded when you click “Create Post”.
                  </p>
                </label>

                {coverPreviewUrl ? (
                  <div className="rounded-2xl border p-3 md:p-4" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg)' }}>
                    <p className="text-xs mb-2" style={{ color: 'var(--color-text-muted)' }}>
                      Cover preview
                    </p>
                    <img
                      src={coverPreviewUrl}
                      alt="Cover image preview"
                      className="h-48 w-full rounded-xl object-cover"
                      onError={() => setError('Image preview failed to load. Please pick another file.')}
                    />
                  </div>
                ) : null}

                {error ? (
                  <p
                    className="text-sm rounded-2xl border px-3 py-2"
                    style={{
                      color: 'var(--color-accent-1)',
                      borderColor: 'var(--color-border)',
                      backgroundColor: 'var(--color-bg-muted)',
                    }}
                  >
                    {error}
                  </p>
                ) : null}

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      close();
                      reset();
                    }}
                    className="rounded-full border px-5 py-2.5 text-sm font-semibold transition hover:opacity-90"
                    style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!canSubmit}
                    className="rounded-full px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
                    style={{ backgroundColor: 'var(--color-accent-1)' }}
                  >
                    {saving ? 'Creating…' : 'Create Post'}
                  </button>
                </div>
              </div>
            </form>

            {aiDialogOpen ? (
              <div
                className="fixed inset-0 z-[60] flex items-start justify-center p-4 sm:p-6 sm:items-center"
                role="dialog"
                aria-modal="true"
                aria-labelledby="ai-generate-heading"
                onMouseDown={(e) => {
                  if (e.target === e.currentTarget && !aiGenerating) {
                    setAiDialogOpen(false);
                    setAiError(null);
                  }
                }}
                style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
              >
                <div
                  className="w-full max-w-lg overflow-hidden rounded-2xl border shadow-xl"
                  style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-elevated)' }}
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <div className="border-b p-4 sm:p-5" style={{ borderColor: 'var(--color-border)' }}>
                    <h3 id="ai-generate-heading" className="text-base font-semibold" style={{ color: 'var(--color-text)' }}>
                      Generate with AI
                    </h3>
                    <p className="mt-1 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                      Describe what you want. We will draft the post and fill the form below for you to review and edit.
                    </p>
                  </div>
                  <form onSubmit={runAiGenerate} className="space-y-4 p-4 sm:p-5">
                    <label className="block">
                      <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                        Topic / title idea *
                      </span>
                      <input
                        value={aiBriefTitle}
                        onChange={(e) => setAiBriefTitle(e.target.value)}
                        disabled={aiGenerating}
                        className="mt-2 w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-2 disabled:opacity-60"
                        style={{
                          backgroundColor: 'var(--color-bg)',
                          borderColor: 'var(--color-border)',
                          color: 'var(--color-text)',
                        }}
                        placeholder="e.g. Benefits of compliance-ready MLM software"
                        autoFocus
                      />
                    </label>
                    <label className="block">
                      <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                        Description / angle
                      </span>
                      <textarea
                        rows={4}
                        value={aiBriefDescription}
                        onChange={(e) => setAiBriefDescription(e.target.value)}
                        disabled={aiGenerating}
                        className="mt-2 w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-2 disabled:opacity-60"
                        style={{
                          backgroundColor: 'var(--color-bg)',
                          borderColor: 'var(--color-border)',
                          color: 'var(--color-text)',
                        }}
                        placeholder="Audience, tone, key points, length, or anything the model should emphasize…"
                      />
                    </label>
                    {aiError ? (
                      <p
                        className="text-sm rounded-2xl border px-3 py-2"
                        style={{
                          color: 'var(--color-accent-1)',
                          borderColor: 'var(--color-border)',
                          backgroundColor: 'var(--color-bg-muted)',
                        }}
                      >
                        {aiError}
                      </p>
                    ) : null}
                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        disabled={aiGenerating}
                        onClick={() => {
                          if (!aiGenerating) {
                            setAiDialogOpen(false);
                            setAiError(null);
                          }
                        }}
                        className="rounded-full border px-4 py-2 text-sm font-semibold transition hover:opacity-90 disabled:opacity-50"
                        style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={aiGenerating || !aiBriefTitle.trim()}
                        className="rounded-full px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
                        style={{ backgroundColor: 'var(--color-accent-1)' }}
                      >
                        {aiGenerating ? 'Generating…' : 'Generate draft'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}

