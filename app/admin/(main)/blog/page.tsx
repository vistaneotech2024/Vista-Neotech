import Link from 'next/link';
import { requireAdmin } from '@/lib/admin-auth';
import { createAdminSupabase } from '@/lib/supabase-admin';
import { CreateBlogPostModal } from '@/app/admin/blog/CreateBlogPostModal';
import { BlogPostRowActions } from '@/app/admin/blog/BlogPostRowActions';

type PostRow = {
  id: string;
  slug: string;
  title: string | null;
  status: string;
  published_at: string | null;
};

const PAGE_SIZE = 10;

function buildPaginationItems(currentPage: number, totalPages: number): Array<number | '...'> {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
  if (currentPage <= 4) return [1, 2, 3, 4, 5, '...', totalPages];
  if (currentPage >= totalPages - 3) {
    return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }
  return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
}

export default async function AdminBlogList({
  searchParams,
}: {
  searchParams?: { page?: string; q?: string };
}) {
  await requireAdmin();
  const supabase = createAdminSupabase();

  let posts: PostRow[] = [];
  let total = 0;
  const rawPage = searchParams?.page;
  const rawQ = (searchParams?.q ?? '').trim();
  const q = rawQ.length > 0 ? rawQ.slice(0, 100) : '';
  const parsedPage = Number.parseInt(rawPage ?? '1', 10);
  const page = Number.isNaN(parsedPage) || parsedPage < 1 ? 1 : parsedPage;

  if (supabase) {
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    let query = supabase
      .from('posts')
      .select('id, slug, title, status, published_at', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (q) {
      const escaped = q.replace(/[%_]/g, '\\$&');
      query = query.or(`title.ilike.%${escaped}%,slug.ilike.%${escaped}%`);
    }

    const { data, count } = await query.range(from, to);

    posts = (data || []) as PostRow[];
    total = count ?? 0;
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const hasPrev = page > 1;
  const hasNext = page < totalPages;
  const prevPage = page - 1;
  const nextPage = page + 1;
  const paginationItems = buildPaginationItems(page, totalPages);
  const baseQuery = q ? `?q=${encodeURIComponent(q)}` : '';
  const pageHref = (p: number) => {
    if (p === 1) return baseQuery ? `/admin/blog${baseQuery}` : '/admin/blog';
    const joiner = baseQuery ? '&' : '?';
    return `/admin/blog${baseQuery}${joiner}page=${p}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:grid sm:grid-cols-[1fr_auto] sm:items-start sm:gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
            Blog posts
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Manage blog posts imported from WordPress.</p>
        </div>

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-start sm:justify-end">
          <form action="/admin/blog" method="get" className="w-full sm:w-[420px]">
            <label className="sr-only" htmlFor="q">
              Search posts
            </label>
            <div className="flex items-center gap-2">
              <input
                id="q"
                name="q"
                defaultValue={q}
                placeholder="Search by title or slug…"
                className="w-full rounded-2xl border px-4 py-2 text-sm outline-none"
                style={{
                  borderColor: 'var(--color-border)',
                  backgroundColor: 'var(--color-bg-elevated)',
                  color: 'var(--color-text)',
                }}
              />
              <button
                type="submit"
                className="shrink-0 rounded-2xl px-4 py-2 text-sm font-semibold transition hover:opacity-90"
                style={{ backgroundColor: 'var(--color-accent-1)', color: '#fff' }}
              >
                Search
              </button>
              {q ? (
                <Link
                  href="/admin/blog"
                  className="shrink-0 rounded-2xl border px-4 py-2 text-sm font-semibold transition hover:opacity-90"
                  style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                >
                  Clear
                </Link>
              ) : null}
            </div>
          </form>

          <CreateBlogPostModal triggerLabel="Create blog" />
        </div>
      </div>

      <div className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
        {q ? (
          <span>
            Showing <span style={{ color: 'var(--color-text)' }}>{posts.length}</span> of{' '}
            <span style={{ color: 'var(--color-text)' }}>{total}</span> results for{' '}
            <span style={{ color: 'var(--color-text)' }}>&ldquo;{q}&rdquo;</span>
          </span>
        ) : (
          <span>
            Total posts: <span style={{ color: 'var(--color-text)' }}>{total}</span>
          </span>
        )}
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
                  <BlogPostRowActions id={p.id} />
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

      {totalPages > 1 && (
        <div className="flex flex-col items-center gap-3 pt-2">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {hasPrev ? (
              <Link
                href={pageHref(prevPage)}
                className="rounded-full border px-4 py-2 text-sm font-semibold transition hover:opacity-90"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
              >
                Previous
              </Link>
            ) : (
              <span
                className="rounded-full border px-4 py-2 text-sm font-semibold opacity-50"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
              >
                Previous
              </span>
            )}

            <span className="text-sm font-medium" style={{ color: 'var(--color-text-muted)' }}>
              Page {page} of {totalPages}
            </span>

            {hasNext ? (
              <Link
                href={pageHref(nextPage)}
                className="rounded-full border px-4 py-2 text-sm font-semibold transition hover:opacity-90"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
              >
                Next
              </Link>
            ) : (
              <span
                className="rounded-full border px-4 py-2 text-sm font-semibold opacity-50"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
              >
                Next
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {paginationItems.map((item, index) => {
              if (item === '...') {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className="px-2 py-1 text-sm"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    ...
                  </span>
                );
              }

              const isActive = item === page;
              return isActive ? (
                <span
                  key={`page-${item}`}
                  className="rounded-full border px-3 py-1.5 text-sm font-semibold"
                  style={{
                    borderColor: 'var(--color-accent-1)',
                    backgroundColor: 'var(--color-accent-1-muted)',
                    color: 'var(--color-accent-1)',
                  }}
                >
                  {item}
                </span>
              ) : (
                <Link
                  key={`page-${item}`}
                  href={pageHref(item)}
                  className="rounded-full border px-3 py-1.5 text-sm font-semibold transition hover:opacity-90"
                  style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                >
                  {item}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

