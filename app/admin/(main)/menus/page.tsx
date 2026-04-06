import Link from 'next/link';
import { requireAdmin } from '@/lib/admin-auth';
import { createAdminSupabase } from '@/lib/supabase-admin';

type MenuRow = {
  id: string;
  name: string;
  slug: string;
  location: string | null;
};

type MenuItemCountRow = {
  menu_id: string;
  count: number | null;
};

export default async function AdminMenusPage() {
  await requireAdmin();
  const supabase = createAdminSupabase();

  let menus: MenuRow[] = [];
  const counts = new Map<string, number>();

  if (supabase) {
    const { data: menuData } = await supabase
      .from('menus')
      .select('id, name, slug, location')
      .order('name', { ascending: true });

    menus = (menuData || []) as MenuRow[];

    if (menus.length > 0) {
      const ids = menus.map((m) => m.id);
      const { data: itemCounts } = await supabase
        .from('menu_items')
        .select('menu_id, id', { count: 'exact', head: false })
        .in('menu_id', ids);

      const countByMenu: Record<string, number> = {};
      (itemCounts || []).forEach((row: any) => {
        const key = row.menu_id as string;
        countByMenu[key] = (countByMenu[key] || 0) + 1;
      });
      menus.forEach((m) => counts.set(m.id, countByMenu[m.id] || 0));
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
            Menus
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Header and footer navigation groups.</p>
        </div>
      </div>

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
                Slug
              </th>
              <th className="px-4 py-3 text-left font-semibold" style={{ color: 'var(--color-text-subtle)' }}>
                Location
              </th>
              <th className="px-4 py-3 text-right font-semibold" style={{ color: 'var(--color-text-subtle)' }}>Items</th>
              <th className="px-4 py-3 text-right font-semibold" style={{ color: 'var(--color-text-subtle)' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {menus.map((m) => (
              <tr key={m.id} className="border-t" style={{ borderColor: 'var(--color-border)' }}>
                <td className="px-4 py-3" style={{ color: 'var(--color-text)' }}>
                  {m.name}
                </td>
                <td className="px-4 py-3" style={{ color: 'var(--color-text-muted)' }}>
                  {m.slug}
                </td>
                <td className="px-4 py-3" style={{ color: 'var(--color-text-muted)' }}>
                  {m.location || '—'}
                </td>
                <td className="px-4 py-3 text-right" style={{ color: 'var(--color-text-muted)' }}>{counts.get(m.id) ?? 0}</td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/menus/${m.id}`}
                    className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition hover:opacity-90"
                    style={{ backgroundColor: 'var(--color-accent-1-muted)', color: 'var(--color-accent-1)' }}
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {menus.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-6 text-center text-sm"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  No menus found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

