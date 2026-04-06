import Link from 'next/link';
import { requireAdmin } from '@/lib/admin-auth';

export default async function AdminMainLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--color-bg)' }}>
      <aside className="hidden md:flex md:w-64 flex-col border-r" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-elevated)' }}>
        <div className="px-6 py-5 border-b" style={{ borderColor: 'var(--color-border)' }}>
          <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: 'var(--color-text-subtle)' }}>
            Vista Admin
          </p>
          <p className="mt-1 text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
            {admin.display_name || admin.email}
          </p>
          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            Role: {admin.role}
          </p>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-1 text-sm">
          <Link
            href="/admin"
            className="block rounded-xl px-3 py-2 hover:bg-[var(--color-bg-muted)]"
            style={{ color: 'var(--color-text)' }}
          >
            Dashboard
          </Link>
          <Link
            href="/admin/hero"
            className="block rounded-xl px-3 py-2 hover:bg-[var(--color-bg-muted)]"
            style={{ color: 'var(--color-text)' }}
          >
            Home hero
          </Link>
          <Link
            href="/admin/pages"
            className="block rounded-xl px-3 py-2 hover:bg-[var(--color-bg-muted)]"
            style={{ color: 'var(--color-text)' }}
          >
            Pages
          </Link>
          <Link
            href="/admin/blog"
            className="block rounded-xl px-3 py-2 hover:bg-[var(--color-bg-muted)]"
            style={{ color: 'var(--color-text)' }}
          >
            Blog posts
          </Link>
          <Link
            href="/admin/blog-categories"
            className="block rounded-xl px-3 py-2 hover:bg-[var(--color-bg-muted)]"
            style={{ color: 'var(--color-text)' }}
          >
            Blog categories
          </Link>
          <Link
            href="/admin/menus"
            className="block rounded-xl px-3 py-2 hover:bg-[var(--color-bg-muted)]"
            style={{ color: 'var(--color-text)' }}
          >
            Menus
          </Link>
          <Link
            href="/admin/leads"
            className="block rounded-xl px-3 py-2 hover:bg-[var(--color-bg-muted)]"
            style={{ color: 'var(--color-text)' }}
          >
            Leads
          </Link>
          <Link
            href="/admin/indexing"
            className="block rounded-xl px-3 py-2 hover:bg-[var(--color-bg-muted)]"
            style={{ color: 'var(--color-text)' }}
          >
            Indexing API keys
          </Link>
        </nav>
      </aside>

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 py-6 md:py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
