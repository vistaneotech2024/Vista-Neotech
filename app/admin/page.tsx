import { requireAdmin } from '@/lib/admin-auth';
import { createAdminSupabase } from '@/lib/supabase-admin';

export default async function AdminDashboard() {
  await requireAdmin();
  const supabase = createAdminSupabase();

  let pagesCount = 0;
  let postsCount = 0;
  let leadsCount = 0;

  if (supabase) {
    const [{ count: pc }, { count: bc }, { count: lc }] = await Promise.all([
      supabase.from('pages').select('id', { count: 'exact', head: true }),
      supabase.from('posts').select('id', { count: 'exact', head: true }),
      supabase.from('contact_submissions').select('id', { count: 'exact', head: true }).eq('is_bot', false),
    ]);
    pagesCount = pc ?? 0;
    postsCount = bc ?? 0;
    leadsCount = lc ?? 0;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
        Admin dashboard
      </h1>
      <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
        Quick overview of content and leads for Vista Neotech.
      </p>
      <div className="grid gap-4 md:grid-cols-3">
        <DashboardCard label="Pages" value={pagesCount} href="/admin/pages" />
        <DashboardCard label="Blog posts" value={postsCount} href="/admin/blog" />
        <DashboardCard label="Leads" value={leadsCount} href="/admin/leads" />
      </div>
    </div>
  );
}

function DashboardCard({ label, value, href }: { label: string; value: number; href: string }) {
  return (
    <a
      href={href}
      className="block rounded-3xl border p-5 transition hover:-translate-y-1 hover:shadow-lg"
      style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-elevated)' }}
    >
      <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-subtle)' }}>
        {label}
      </p>
      <p className="mt-2 text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
        {value}
      </p>
      <p className="mt-1 text-xs" style={{ color: 'var(--color-accent-1)' }}>
        Manage {label.toLowerCase()} →
      </p>
    </a>
  );
}

