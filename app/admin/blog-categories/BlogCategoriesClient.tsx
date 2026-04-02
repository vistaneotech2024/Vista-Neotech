'use client';

import { useEffect, useMemo, useState } from 'react';

type Category = {
  id: string;
  name: string;
  is_active: boolean;
  created_at?: string | null;
  updated_at?: string | null;
};

export function BlogCategoriesClient() {
  const [rows, setRows] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [newName, setNewName] = useState('');
  const [newActive, setNewActive] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);

  const canCreate = useMemo(() => newName.trim().length > 0 && !saving, [newName, saving]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editActive, setEditActive] = useState(true);

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/blog-categories', { method: 'GET' });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body?.error || 'Failed to load categories');
      setRows(Array.isArray(body?.categories) ? body.categories : []);
    } catch (e: any) {
      setError(e?.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function createCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!canCreate) return;
    setSaving('create');
    setError(null);
    try {
      const res = await fetch('/api/admin/blog-categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName.trim(), isActive: newActive }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body?.error || 'Failed to create category');
      setNewName('');
      setNewActive(true);
      setCreateOpen(false);
      await refresh();
    } catch (e: any) {
      setError(e?.message || 'Failed to create category');
    } finally {
      setSaving(null);
    }
  }

  async function updateCategory(id: string, patch: { name?: string; isActive?: boolean }) {
    setSaving(id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/blog-categories/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body?.error || 'Failed to update category');
      setRows((prev) =>
        prev.map((r) => (r.id === id ? { ...r, ...(body?.category ?? {}), id: r.id } : r)),
      );
    } catch (e: any) {
      setError(e?.message || 'Failed to update category');
    } finally {
      setSaving(null);
    }
  }

  function startEdit(row: Category) {
    setEditingId(row.id);
    setEditName(row.name);
    setEditActive(!!row.is_active);
    setError(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditName('');
    setEditActive(true);
  }

  async function saveEdit(id: string) {
    const name = editName.trim();
    if (!name) {
      setError('Name is required');
      return;
    }
    await updateCategory(id, { name, isActive: editActive });
    cancelEdit();
  }

  async function deleteCategory(id: string) {
    const ok = window.confirm('Delete this category?');
    if (!ok) return;
    setSaving(id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/blog-categories/${encodeURIComponent(id)}`, { method: 'DELETE' });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body?.error || 'Failed to delete category');
      setRows((prev) => prev.filter((r) => r.id !== id));
    } catch (e: any) {
      setError(e?.message || 'Failed to delete category');
    } finally {
      setSaving(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
            Blog categories
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Create, update, and delete categories for blog posts.
          </p>
        </div>
        <button
          type="button"
          disabled={editingId !== null}
          onClick={() => {
            setError(null);
            setNewName('');
            setNewActive(true);
            setCreateOpen(true);
          }}
          className="inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-semibold transition hover:opacity-90 disabled:opacity-60"
          style={{ backgroundColor: 'var(--color-accent-3)', color: '#fff' }}
        >
          New category
        </button>
      </div>

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

      {createOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setCreateOpen(false);
          }}
          style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
        >
          <div
            className="w-full max-w-xl overflow-hidden rounded-3xl border shadow-xl"
            style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-elevated)' }}
          >
            <div
              className="flex items-start justify-between gap-3 border-b p-4 sm:p-5"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <div className="min-w-0">
                <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>
                  Create category
                </h2>
                <p className="mt-1 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  Add a new blog category.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCreateOpen(false)}
                className="rounded-full border px-3 py-1.5 text-xs font-semibold transition hover:opacity-90"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <form onSubmit={createCategory} className="p-4 sm:p-5 space-y-4">
              <label className="block">
                <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                  Name *
                </span>
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="mt-2 w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-2"
                  style={{
                    backgroundColor: 'var(--color-bg)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text)',
                  }}
                  placeholder="e.g. Product Updates"
                  autoFocus
                />
              </label>

              <label className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text)' }}>
                <input
                  type="checkbox"
                  checked={newActive}
                  onChange={(e) => setNewActive(e.target.checked)}
                  className="h-4 w-4 rounded border"
                />
                Active
              </label>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  disabled={saving === 'create'}
                  onClick={() => setCreateOpen(false)}
                  className="rounded-full border px-5 py-2.5 text-sm font-semibold transition hover:opacity-90 disabled:opacity-50"
                  style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!canCreate}
                  className="rounded-full px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
                  style={{ backgroundColor: 'var(--color-accent-1)' }}
                >
                  {saving === 'create' ? 'Creating…' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      <div
        className="overflow-hidden rounded-3xl border"
        style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-elevated)' }}
      >
        <table className="min-w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: 'var(--color-bg-muted)' }}>
              <th className="px-4 py-3 text-left font-semibold" style={{ color: 'var(--color-text-subtle)' }}>
                Name
              </th>
              <th className="px-4 py-3 text-left font-semibold" style={{ color: 'var(--color-text-subtle)' }}>
                Active
              </th>
              <th className="px-4 py-3 text-right font-semibold" style={{ color: 'var(--color-text-subtle)' }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center" style={{ color: 'var(--color-text-muted)' }}>
                  Loading…
                </td>
              </tr>
            ) : null}

            {!loading && rows.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center" style={{ color: 'var(--color-text-muted)' }}>
                  No categories yet.
                </td>
              </tr>
            ) : null}

            {rows.map((r) => {
              const busy = saving === r.id;
              const isEditing = editingId === r.id;
              return (
                <tr key={r.id} className="border-t" style={{ borderColor: 'var(--color-border)' }}>
                  <td className="px-4 py-3">
                    {isEditing ? (
                      <input
                        value={editName}
                        disabled={busy}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2"
                        style={{
                          backgroundColor: 'var(--color-bg)',
                          borderColor: 'var(--color-border)',
                          color: 'var(--color-text)',
                        }}
                      />
                    ) : (
                      <span style={{ color: 'var(--color-text)' }}>{r.name}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <label className="inline-flex items-center gap-2 text-sm" style={{ color: 'var(--color-text)' }}>
                      <input
                        type="checkbox"
                        checked={isEditing ? editActive : !!r.is_active}
                        disabled={busy || !isEditing}
                        onChange={(e) => setEditActive(e.target.checked)}
                        className="h-4 w-4 rounded border"
                      />
                      {isEditing ? (editActive ? 'Yes' : 'No') : r.is_active ? 'Yes' : 'No'}
                    </label>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex items-center gap-2">
                      {isEditing ? (
                        <>
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => saveEdit(r.id)}
                            className="rounded-full px-3 py-1.5 text-xs font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
                            style={{ backgroundColor: 'var(--color-accent-1)' }}
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            disabled={busy}
                            onClick={cancelEdit}
                            className="rounded-full border px-3 py-1.5 text-xs font-semibold transition hover:opacity-90 disabled:opacity-50"
                            style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            disabled={busy || (editingId !== null && editingId !== r.id)}
                            onClick={() => startEdit(r)}
                            className="rounded-full border px-3 py-1.5 text-xs font-semibold transition hover:opacity-90 disabled:opacity-50"
                            style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            disabled={busy || editingId !== null}
                            onClick={() => deleteCategory(r.id)}
                            className="rounded-full border px-3 py-1.5 text-xs font-semibold text-red-500 transition hover:opacity-90 disabled:opacity-50"
                            style={{ borderColor: 'var(--color-border)' }}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

