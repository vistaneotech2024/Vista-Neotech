import Link from 'next/link';
import { requireAdmin } from '@/lib/admin-auth';
import { createAdminSupabase } from '@/lib/supabase-admin';

type PageRow = {
  id: string;
  slug: string;
  title: string | null;
  status: string;
  template: string | null;
};

export default async function AdminPagesList() {
  await requireAdmin();
  const supabase = createAdminSupabase();
  let pages: PageRow[] = [];

  if (supabase) {
    const { data } = await supabase
      .from('pages')
      .select('id, slug, title, status, template')
      .order('created_at', { ascending: false })
      .limit(50);
    pages = (data || []) as PageRow[];
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
            Pages
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Manage website pages, including industry pages and static content.
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-elevated)' }}>
        <table className="min-w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: 'var(--color-bg-muted)' }}>
              <th className="px-4 py-3 text-left font-semibold" style={{ color: 'var(--color-text-subtle)' }}>Title</th>
              <th className="px-4 py-3 text-left font-semibold" style={{ color: 'var(--color-text-subtle)' }}>Slug</th>
              <th className="px-4 py-3 text-left font-semibold" style={{ color: 'var(--color-text-subtle)' }}>Status</th>
              <th className="px-4 py-3 text-left font-semibold" style={{ color: 'var(--color-text-subtle)' }}>Template</th>
              <th className="px-4 py-3 text-right font-semibold" style={{ color: 'var(--color-text-subtle)' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pages.map((p) => (
              <tr key={p.id} className="border-t" style={{ borderColor: 'var(--color-border)' }}>
                <td className="px-4 py-3" style={{ color: 'var(--color-text)' }}>
                  {p.title || '(untitled)'}
                </td>
                <td className="px-4 py-3" style={{ color: 'var(--color-text-muted)' }}>
                  /{p.slug}
                </td>
                <td className="px-4 py-3" style={{ color: 'var(--color-text-muted)' }}>
                  {p.status}
                </td>
                <td className="px-4 py-3" style={{ color: 'var(--color-text-muted)' }}>
                  {p.template || 'default'}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/pages/${p.id}`}
                    className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition hover:opacity-90"
                    style={{ backgroundColor: 'var(--color-accent-1-muted)', color: 'var(--color-accent-1)' }}
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {pages.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  No pages found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

