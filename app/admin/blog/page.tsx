import Link from 'next/link';
import { requireAdmin } from '@/lib/admin-auth';
import { createAdminSupabase } from '@/lib/supabase-admin';

type PostRow = {
  id: string;
  slug: string;
  title: string | null;
  status: string;
  published_at: string | null;
};

export default async function AdminBlogList() {
  await requireAdmin();
  const supabase = createAdminSupabase();

  let posts: PostRow[] = [];

  if (supabase) {
    const { data } = await supabase
      .from('posts')
      .select('id, slug, title, status, published_at')
      .order('created_at', { ascending: false })
      .limit(50);

    posts = (data || []) as PostRow[];
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
            Blog posts
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Manage blog posts imported from WordPress.</p>
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
                Title
              </th>
              <th className="px-4 py-3 text-left font-semibold" style={{ color: 'var(--color-text-subtle)' }}>
                Slug
              </th>
              <th className="px-4 py-3 text-left font-semibold" style={{ color: 'var(--color-text-subtle)' }}>
                Status
              </th>
              <th className="px-4 py-3 text-left font-semibold" style={{ color: 'var(--color-text-subtle)' }}>Published at</th>
              <th className="px-4 py-3 text-right font-semibold" style={{ color: 'var(--color-text-subtle)' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((p) => (
              <tr key={p.id} className="border-t" style={{ borderColor: 'var(--color-border)' }}>
                <td className="px-4 py-3" style={{ color: 'var(--color-text)' }}>
                  {p.title || '(untitled)'}
                </td>
                <td className="px-4 py-3" style={{ color: 'var(--color-text-muted)' }}>
                  /blog/{p.slug}
                </td>
                <td className="px-4 py-3" style={{ color: 'var(--color-text-muted)' }}>
                  {p.status}
                </td>
                <td className="px-4 py-3" style={{ color: 'var(--color-text-muted)' }}>{p.published_at ? new Date(p.published_at).toLocaleDateString() : '—'}</td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/blog/${p.id}`}
                    className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition hover:opacity-90"
                    style={{ backgroundColor: 'var(--color-accent-1-muted)', color: 'var(--color-accent-1)' }}
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-6 text-center text-sm"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  No posts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

