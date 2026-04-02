'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { BlogPostEditModal } from './BlogPostEditModal';

export function BlogPostRowActions({ id }: { id: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function onDelete() {
    const ok = window.confirm('Delete this post? This cannot be undone.');
    if (!ok) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/blog/${encodeURIComponent(id)}`, { method: 'DELETE' });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body?.error || 'Failed to delete post');
      router.refresh();
    } catch (e: any) {
      window.alert(e?.message || 'Failed to delete post');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="inline-flex items-center gap-2">
      <BlogPostEditModal id={id} />
      <button
        type="button"
        disabled={deleting}
        onClick={onDelete}
        className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold text-red-500 transition hover:opacity-90 disabled:opacity-50"
        style={{ borderColor: 'var(--color-border)' }}
      >
        {deleting ? 'Deleting…' : 'Delete'}
      </button>
    </div>
  );
}

