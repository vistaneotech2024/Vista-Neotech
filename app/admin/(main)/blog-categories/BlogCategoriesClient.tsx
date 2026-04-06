'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { BlogCategoryRow, BlogSubcategoryRow } from '@/lib/blog-category-tree';

type Category = BlogCategoryRow;
type Subcategory = BlogSubcategoryRow;

export function BlogCategoriesClient() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [subSchemaPending, setSubSchemaPending] = useState(false);

  const [createCatOpen, setCreateCatOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatActive, setNewCatActive] = useState(true);

  const [subModalOpen, setSubModalOpen] = useState(false);
  const [subModalMode, setSubModalMode] = useState<'create' | 'edit'>('create');
  const [subEditId, setSubEditId] = useState<string | null>(null);
  const [subFormName, setSubFormName] = useState('');
  const [subFormActive, setSubFormActive] = useState(true);
  const [subFormCategoryIds, setSubFormCategoryIds] = useState<Set<string>>(() => new Set());

  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editCatName, setEditCatName] = useState('');
  const [editCatActive, setEditCatActive] = useState(true);

  const categoriesSorted = useMemo(
    () => [...categories].sort((a, b) => a.name.localeCompare(b.name)),
    [categories],
  );
  const subcategoriesSorted = useMemo(
    () => [...subcategories].sort((a, b) => a.name.localeCompare(b.name)),
    [subcategories],
  );

  const canCreateCat = newCatName.trim().length > 0 && !saving;
  const canSaveSub = subFormName.trim().length > 0 && !saving;

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSubSchemaPending(false);
    try {
      const [catRes, subRes] = await Promise.all([
        fetch('/api/admin/blog-categories', { method: 'GET' }),
        fetch('/api/admin/blog-subcategories', { method: 'GET' }),
      ]);
      const catBody = await catRes.json().catch(() => ({}));
      const subBody = await subRes.json().catch(() => ({}));
      if (!catRes.ok) throw new Error(catBody?.error || 'Failed to load categories');
      if (!subRes.ok) throw new Error(subBody?.error || 'Failed to load subcategories');
      if (subBody?.schemaPending) {
        setSubSchemaPending(true);
      }

      const catList = Array.isArray(catBody?.categories) ? catBody.categories : [];
      setCategories(
        catList.map((r: Record<string, unknown>) => ({
          id: String(r.id),
          name: String(r.name ?? ''),
          is_active: !!r.is_active,
          created_at: r.created_at != null ? String(r.created_at) : null,
          updated_at: r.updated_at != null ? String(r.updated_at) : null,
        })),
      );

      const subList = Array.isArray(subBody?.subcategories) ? subBody.subcategories : [];
      setSubcategories(
        subList.map((r: Record<string, unknown>) => ({
          id: String(r.id),
          name: String(r.name ?? ''),
          is_active: !!r.is_active,
          category_ids: Array.isArray(r.category_ids)
            ? (r.category_ids as unknown[]).map((x) => String(x)).filter(Boolean)
            : [],
          created_at: r.created_at != null ? String(r.created_at) : null,
          updated_at: r.updated_at != null ? String(r.updated_at) : null,
        })),
      );
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  function closeCatModal() {
    setCreateCatOpen(false);
    setNewCatName('');
    setNewCatActive(true);
  }

  function openCreateCategory() {
    setError(null);
    setNewCatName('');
    setNewCatActive(true);
    setCreateCatOpen(true);
  }

  async function createCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!canCreateCat) return;
    setSaving('cat-create');
    setError(null);
    try {
      const res = await fetch('/api/admin/blog-categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCatName.trim(), isActive: newCatActive }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body?.error || 'Failed to create category');
      closeCatModal();
      await refresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to create category');
    } finally {
      setSaving(null);
    }
  }

  function openCreateSubcategory() {
    setError(null);
    setSubModalMode('create');
    setSubEditId(null);
    setSubFormName('');
    setSubFormActive(true);
    setSubFormCategoryIds(new Set());
    setSubModalOpen(true);
  }

  function openEditSubcategory(row: Subcategory) {
    setError(null);
    setSubModalMode('edit');
    setSubEditId(row.id);
    setSubFormName(row.name);
    setSubFormActive(!!row.is_active);
    setSubFormCategoryIds(new Set(row.category_ids));
    setSubModalOpen(true);
  }

  function closeSubModal() {
    setSubModalOpen(false);
    setSubEditId(null);
    setSubFormName('');
    setSubFormActive(true);
    setSubFormCategoryIds(new Set());
  }

  function toggleSubFormCategory(id: string) {
    setSubFormCategoryIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function saveSubcategory(e: React.FormEvent) {
    e.preventDefault();
    if (!canSaveSub) return;
    const categoryIds = Array.from(subFormCategoryIds);
    setSaving('sub-save');
    setError(null);
    try {
      if (subModalMode === 'create') {
        const res = await fetch('/api/admin/blog-subcategories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: subFormName.trim(),
            isActive: subFormActive,
            categoryIds,
          }),
        });
        const body = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(body?.error || 'Failed to create subcategory');
      } else if (subEditId) {
        const res = await fetch(`/api/admin/blog-subcategories/${encodeURIComponent(subEditId)}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: subFormName.trim(),
            isActive: subFormActive,
            categoryIds,
          }),
        });
        const body = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(body?.error || 'Failed to update subcategory');
      }
      closeSubModal();
      await refresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to save subcategory');
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
      const cat = body?.category;
      setCategories((prev) =>
        prev.map((r) =>
          r.id === id
            ? {
                ...r,
                name: typeof cat?.name === 'string' ? cat.name : r.name,
                is_active: typeof cat?.is_active === 'boolean' ? cat.is_active : r.is_active,
              }
            : r,
        ),
      );
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to update category');
    } finally {
      setSaving(null);
    }
  }

  function startEditCategory(row: Category) {
    setEditingCatId(row.id);
    setEditCatName(row.name);
    setEditCatActive(!!row.is_active);
    setError(null);
  }

  function cancelEditCategory() {
    setEditingCatId(null);
    setEditCatName('');
    setEditCatActive(true);
  }

  async function saveEditCategory(id: string) {
    const name = editCatName.trim();
    if (!name) {
      setError('Name is required');
      return;
    }
    await updateCategory(id, { name, isActive: editCatActive });
    cancelEditCategory();
  }

  async function deleteCategory(id: string) {
    const ok = window.confirm('Delete this category? Subcategory links to it will be removed.');
    if (!ok) return;
    setSaving(id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/blog-categories/${encodeURIComponent(id)}`, { method: 'DELETE' });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body?.error || 'Failed to delete category');
      await refresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to delete category');
    } finally {
      setSaving(null);
    }
  }

  async function deleteSubcategory(id: string) {
    const ok = window.confirm('Delete this subcategory?');
    if (!ok) return;
    setSaving(id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/blog-subcategories/${encodeURIComponent(id)}`, { method: 'DELETE' });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body?.error || 'Failed to delete subcategory');
      await refresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to delete subcategory');
    } finally {
      setSaving(null);
    }
  }

  function assignedLabels(categoryIds: string[]) {
    if (!categoryIds.length) return '—';
    const names = categoryIds
      .map((cid) => categories.find((c) => c.id === cid)?.name)
      .filter((n): n is string => !!n)
      .sort();
    return names.length ? names.join(', ') : '—';
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
            Blog categories
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Categories are top-level. Subcategories are created separately and can be assigned to one or more
            categories.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 sm:shrink-0">
          <button
            type="button"
            disabled={editingCatId !== null}
            onClick={openCreateCategory}
            className="inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-semibold transition hover:opacity-90 disabled:opacity-60"
            style={{ backgroundColor: 'var(--color-accent-3)', color: '#fff' }}
          >
            Create category
          </button>
          <button
            type="button"
            disabled={editingCatId !== null || subSchemaPending}
            title={subSchemaPending ? 'Apply the subcategory migration first' : undefined}
            onClick={openCreateSubcategory}
            className="inline-flex items-center justify-center rounded-2xl border px-4 py-2 text-sm font-semibold transition hover:opacity-90 disabled:opacity-50"
            style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
          >
            Create subcategory
          </button>
        </div>
      </div>

      {subSchemaPending ? (
        <p
          className="text-sm rounded-2xl border px-3 py-2"
          style={{
            color: 'var(--color-text)',
            borderColor: 'var(--color-accent-2)',
            backgroundColor: 'var(--color-bg-muted)',
          }}
        >
          Subcategory tables are not in your database yet. Run{' '}
          <code className="rounded bg-black/10 px-1 py-0.5 text-xs dark:bg-white/10">
            supabase db push
          </code>{' '}
          from the project root, or run the SQL file{' '}
          <code className="rounded bg-black/10 px-1 py-0.5 text-xs dark:bg-white/10">
            supabase/migrations/20260404000300_blog_subcategories_many_to_many.sql
          </code>{' '}
          in the Supabase SQL editor. Until then you can still manage categories; subcategory actions will stay
          unavailable.
        </p>
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

      {createCatOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeCatModal();
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
              <div>
                <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>
                  Create category
                </h2>
                <p className="mt-1 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  Top-level category only.
                </p>
              </div>
              <button
                type="button"
                onClick={closeCatModal}
                className="rounded-full border px-3 py-1.5 text-xs font-semibold"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <form onSubmit={createCategory} className="space-y-4 p-4 sm:p-5">
              <label className="block">
                <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                  Name *
                </span>
                <input
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
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
                  checked={newCatActive}
                  onChange={(e) => setNewCatActive(e.target.checked)}
                  className="h-4 w-4 rounded border"
                />
                Active
              </label>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  disabled={saving === 'cat-create'}
                  onClick={closeCatModal}
                  className="rounded-full border px-5 py-2.5 text-sm font-semibold disabled:opacity-50"
                  style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!canCreateCat}
                  className="rounded-full px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
                  style={{ backgroundColor: 'var(--color-accent-1)' }}
                >
                  {saving === 'cat-create' ? 'Creating…' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {subModalOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeSubModal();
          }}
          style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
        >
          <div
            className="max-h-[90vh] w-full max-w-xl overflow-y-auto overflow-x-hidden rounded-3xl border shadow-xl"
            style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-elevated)' }}
          >
            <div
              className="flex items-start justify-between gap-3 border-b p-4 sm:p-5"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <div>
                <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>
                  {subModalMode === 'create' ? 'Create subcategory' : 'Edit subcategory'}
                </h2>
                <p className="mt-1 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  Assign this subcategory to any number of categories (optional).
                </p>
              </div>
              <button
                type="button"
                onClick={closeSubModal}
                className="rounded-full border px-3 py-1.5 text-xs font-semibold"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <form onSubmit={saveSubcategory} className="space-y-4 p-4 sm:p-5">
              <label className="block">
                <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                  Name *
                </span>
                <input
                  value={subFormName}
                  onChange={(e) => setSubFormName(e.target.value)}
                  className="mt-2 w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-2"
                  style={{
                    backgroundColor: 'var(--color-bg)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text)',
                  }}
                  placeholder="e.g. Binary plans"
                  autoFocus
                />
              </label>
              <label className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text)' }}>
                <input
                  type="checkbox"
                  checked={subFormActive}
                  onChange={(e) => setSubFormActive(e.target.checked)}
                  className="h-4 w-4 rounded border"
                />
                Active
              </label>
              <fieldset>
                <legend className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                  Assign to categories
                </legend>
                <p className="mt-1 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                  A subcategory can belong to multiple categories at once.
                </p>
                <div
                  className="mt-3 max-h-48 space-y-2 overflow-y-auto rounded-2xl border p-3"
                  style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg)' }}
                >
                  {categoriesSorted.length === 0 ? (
                    <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                      No categories yet. Create a category first.
                    </p>
                  ) : (
                    categoriesSorted.map((c) => (
                      <label
                        key={c.id}
                        className="flex cursor-pointer items-center gap-2 text-sm"
                        style={{ color: 'var(--color-text)' }}
                      >
                        <input
                          type="checkbox"
                          checked={subFormCategoryIds.has(c.id)}
                          onChange={() => toggleSubFormCategory(c.id)}
                          className="h-4 w-4 rounded border"
                        />
                        {c.name}
                      </label>
                    ))
                  )}
                </div>
              </fieldset>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  disabled={saving === 'sub-save'}
                  onClick={closeSubModal}
                  className="rounded-full border px-5 py-2.5 text-sm font-semibold disabled:opacity-50"
                  style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!canSaveSub}
                  className="rounded-full px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
                  style={{ backgroundColor: 'var(--color-accent-1)' }}
                >
                  {saving === 'sub-save' ? 'Saving…' : subModalMode === 'create' ? 'Create' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      <div className="space-y-10">
        <section>
          <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>
            Categories
          </h2>
          <p className="mt-1 text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Top-level taxonomy only.
          </p>
          <div
            className="mt-4 overflow-hidden rounded-3xl border"
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
                {!loading && categoriesSorted.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-6 text-center" style={{ color: 'var(--color-text-muted)' }}>
                      No categories yet.
                    </td>
                  </tr>
                ) : null}
                {!loading
                  ? categoriesSorted.map((r) => {
                      const busy = saving === r.id;
                      const isEditing = editingCatId === r.id;
                      return (
                        <tr key={r.id} className="border-t" style={{ borderColor: 'var(--color-border)' }}>
                          <td className="px-4 py-3">
                            {isEditing ? (
                              <input
                                value={editCatName}
                                disabled={busy}
                                onChange={(e) => setEditCatName(e.target.value)}
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
                            <label
                              className="inline-flex items-center gap-2 text-sm"
                              style={{ color: 'var(--color-text)' }}
                            >
                              <input
                                type="checkbox"
                                checked={isEditing ? editCatActive : !!r.is_active}
                                disabled={busy || !isEditing}
                                onChange={(e) => setEditCatActive(e.target.checked)}
                                className="h-4 w-4 rounded border"
                              />
                              {isEditing ? (editCatActive ? 'Yes' : 'No') : r.is_active ? 'Yes' : 'No'}
                            </label>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="inline-flex flex-wrap justify-end gap-2">
                              {isEditing ? (
                                <>
                                  <button
                                    type="button"
                                    disabled={busy}
                                    onClick={() => saveEditCategory(r.id)}
                                    className="rounded-full px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
                                    style={{ backgroundColor: 'var(--color-accent-1)' }}
                                  >
                                    Save
                                  </button>
                                  <button
                                    type="button"
                                    disabled={busy}
                                    onClick={cancelEditCategory}
                                    className="rounded-full border px-3 py-1.5 text-xs font-semibold disabled:opacity-50"
                                    style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                                  >
                                    Cancel
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    type="button"
                                    disabled={busy || (editingCatId !== null && editingCatId !== r.id)}
                                    onClick={() => startEditCategory(r)}
                                    className="rounded-full border px-3 py-1.5 text-xs font-semibold disabled:opacity-50"
                                    style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                                  >
                                    Edit
                                  </button>
                                  <button
                                    type="button"
                                    disabled={busy || editingCatId !== null}
                                    onClick={() => deleteCategory(r.id)}
                                    className="rounded-full border px-3 py-1.5 text-xs font-semibold text-red-500 disabled:opacity-50"
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
                    })
                  : null}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>
            Subcategories
          </h2>
          <p className="mt-1 text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Standalone labels; link each to one or more categories.
          </p>
          <div
            className="mt-4 overflow-hidden rounded-3xl border"
            style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-elevated)' }}
          >
            <table className="min-w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: 'var(--color-bg-muted)' }}>
                  <th className="px-4 py-3 text-left font-semibold" style={{ color: 'var(--color-text-subtle)' }}>
                    Name
                  </th>
                  <th className="px-4 py-3 text-left font-semibold" style={{ color: 'var(--color-text-subtle)' }}>
                    Assigned categories
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
                    <td colSpan={4} className="px-4 py-6 text-center" style={{ color: 'var(--color-text-muted)' }}>
                      Loading…
                    </td>
                  </tr>
                ) : null}
                {!loading && subcategoriesSorted.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center" style={{ color: 'var(--color-text-muted)' }}>
                      No subcategories yet.
                    </td>
                  </tr>
                ) : null}
                {!loading
                  ? subcategoriesSorted.map((r) => {
                      const busy = saving === r.id;
                      return (
                        <tr key={r.id} className="border-t" style={{ borderColor: 'var(--color-border)' }}>
                          <td className="px-4 py-3" style={{ color: 'var(--color-text)' }}>
                            {r.name}
                          </td>
                          <td
                            className="max-w-xs px-4 py-3 align-top text-xs leading-relaxed sm:max-w-md sm:text-sm"
                            style={{ color: 'var(--color-text-muted)' }}
                          >
                            {assignedLabels(r.category_ids)}
                          </td>
                          <td className="px-4 py-3" style={{ color: 'var(--color-text-muted)' }}>
                            {r.is_active ? 'Yes' : 'No'}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="inline-flex flex-wrap justify-end gap-2">
                              <button
                                type="button"
                                disabled={busy || editingCatId !== null}
                                onClick={() => openEditSubcategory(r)}
                                className="rounded-full border px-3 py-1.5 text-xs font-semibold disabled:opacity-50"
                                style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                disabled={busy || editingCatId !== null}
                                onClick={() => deleteSubcategory(r.id)}
                                className="rounded-full border px-3 py-1.5 text-xs font-semibold text-red-500 disabled:opacity-50"
                                style={{ borderColor: 'var(--color-border)' }}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  : null}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
