'use client';

import { useState } from 'react';

export type MenuItemInput = {
  id?: string;
  label: string;
  href: string;
  target: '_self' | '_blank';
  order_index: number;
};

export function MenuEditorClient(props: {
  menuId: string;
  name: string;
  slug: string;
  location: string | null;
  initialItems: MenuItemInput[];
}) {
  const [items, setItems] = useState<MenuItemInput[]>(props.initialItems);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        label: 'New item',
        href: '/',
        target: '_self',
        order_index: prev.length ? Math.max(...prev.map((i) => i.order_index)) + 10 : 10,
      },
    ]);
  };

  const updateItem = (index: number, patch: Partial<MenuItemInput>) => {
    setItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], ...patch };
      return next;
    });
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const moveItem = (from: number, to: number) => {
    setItems((prev) => {
      if (to < 0 || to >= prev.length) return prev;
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  };

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);

    try {
      const cleanItems = items
        .map((i, index) => ({
          ...i,
          order_index: i.order_index ?? (index + 1) * 10,
        }))
        .filter((i) => i.label.trim().length > 0 && i.href.trim().length > 0);

      const res = await fetch(`/api/admin/menus/${props.menuId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cleanItems }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || 'Failed to save menu');
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
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <p className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
            {props.name}
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
            Slug: {props.slug}
          </p>
          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            Location: {props.location || '—'}
          </p>
        </div>
        <div className="md:col-span-2 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={addItem}
            className="rounded-full border px-4 py-2 text-xs font-semibold"
            style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
          >
            + Add item
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-full px-6 py-2.5 text-xs font-semibold text-white disabled:opacity-60"
            style={{ backgroundColor: 'var(--color-accent-1)' }}
          >
            {saving ? 'Saving…' : 'Save menu'}
          </button>
        </div>
      </div>

      <div
        className="overflow-x-auto rounded-2xl border"
        style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-elevated)' }}
      >
        <table className="min-w-full text-xs">
          <thead>
            <tr style={{ backgroundColor: 'var(--color-bg-muted)' }}>
              <th className="px-3 py-2 text-left font-semibold" style={{ color: 'var(--color-text-subtle)' }}>
                Label
              </th>
              <th className="px-3 py-2 text-left font-semibold" style={{ color: 'var(--color-text-subtle)' }}>
                URL / slug
              </th>
              <th className="px-3 py-2 text-left font-semibold" style={{ color: 'var(--color-text-subtle)' }}>
                Target
              </th>
              <th className="px-3 py-2 text-left font-semibold" style={{ color: 'var(--color-text-subtle)' }}>
                Order
              </th>
              <th className="px-3 py-2 text-right font-semibold" style={{ color: 'var(--color-text-subtle)' }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.id || `row-${index}`} className="border-t" style={{ borderColor: 'var(--color-border)' }}>
                <td className="px-3 py-2 align-top" style={{ color: 'var(--color-text)' }}>
                  <input
                    value={item.label}
                    onChange={(e) => updateItem(index, { label: e.target.value })}
                    className="w-full rounded-xl border px-2 py-1"
                    style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg)' }}
                  />
                </td>
                <td className="px-3 py-2 align-top" style={{ color: 'var(--color-text)' }}>
                  <input
                    value={item.href}
                    onChange={(e) => updateItem(index, { href: e.target.value })}
                    className="w-full rounded-xl border px-2 py-1"
                    style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg)' }}
                    placeholder="/about or https://example.com"
                  />
                </td>
                <td className="px-3 py-2 align-top" style={{ color: 'var(--color-text)' }}>
                  <select
                    value={item.target}
                    onChange={(e) => updateItem(index, { target: e.target.value as '_self' | '_blank' })}
                    className="w-full rounded-xl border px-2 py-1"
                    style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg)' }}
                  >
                    <option value="_self">Same tab</option>
                    <option value="_blank">New tab</option>
                  </select>
                </td>
                <td className="px-3 py-2 align-top" style={{ color: 'var(--color-text)' }}>
                  <input
                    type="number"
                    value={item.order_index}
                    onChange={(e) => updateItem(index, { order_index: Number(e.target.value) || 0 })}
                    className="w-20 rounded-xl border px-2 py-1"
                    style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg)' }}
                  />
                </td>
                <td className="px-3 py-2 align-top text-right" style={{ color: 'var(--color-text)' }}>
                  <div className="flex justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => moveItem(index, index - 1)}
                      disabled={index === 0}
                      className="rounded-full border px-2 py-1 text-[10px] disabled:opacity-40"
                      style={{ borderColor: 'var(--color-border)' }}
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => moveItem(index, index + 1)}
                      disabled={index === items.length - 1}
                      className="rounded-full border px-2 py-1 text-[10px] disabled:opacity-40"
                      style={{ borderColor: 'var(--color-border)' }}
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="rounded-full border px-2 py-1 text-[10px] text-red-500"
                      style={{ borderColor: 'var(--color-border)' }}
                    >
                      Remove
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-3 py-4 text-center text-xs"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  No items yet. Use &ldquo;Add item&rdquo; to start building this menu.
                </td>
              </tr>
            )}
          </tbody>
        </table>
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
    </form>
  );
}

