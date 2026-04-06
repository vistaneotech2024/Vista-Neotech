import { requireAdmin } from '@/lib/admin-auth';
import { createAdminSupabase } from '@/lib/supabase-admin';
import { LeadsTable, type LeadRow } from './LeadsTable';

type SearchParams = { from?: string; to?: string; q?: string };

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  await requireAdmin();
  const supabase = createAdminSupabase();
  const params = await searchParams;
  const from = typeof params.from === 'string' ? params.from : undefined;
  const to = typeof params.to === 'string' ? params.to : undefined;
  const q = typeof params.q === 'string' ? params.q.trim() : '';

  let leads: LeadRow[] = [];

  if (supabase) {
    let query = supabase
      .from('contact_submissions')
      .select('id, name, email, phone, message, services, status, page_path, source, created_at')
      .eq('is_bot', false)
      .order('created_at', { ascending: false })
      .limit(500);

    if (from) {
      const fromDate = new Date(from);
      if (!isNaN(fromDate.getTime())) query = query.gte('created_at', fromDate.toISOString());
    }
    if (to) {
      const toDate = new Date(to);
      if (!isNaN(toDate.getTime())) {
        const end = new Date(toDate);
        end.setHours(23, 59, 59, 999);
        query = query.lte('created_at', end.toISOString());
      }
    }
    if (q) {
      query = query.or(`email.ilike.%${q}%,phone.ilike.%${q}%`);
    }

    const { data } = await query;
    const rows = (data || []) as LeadRow[];
    leads = rows.map((r) => ({ ...r, source: r.source ?? 'contact_form' }));
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
            Leads
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Contact form and popup submissions. Filter by date, search by email or mobile, export CSV, mark as contacted.
          </p>
        </div>
        <form method="get" className="flex flex-wrap items-end gap-3">
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>
              Search (email / mobile)
            </span>
            <input
              type="search"
              name="q"
              defaultValue={q}
              placeholder="Search…"
              className="rounded-xl border px-3 py-2 text-sm"
              style={{
                backgroundColor: 'var(--color-bg)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text)',
                minWidth: 180,
              }}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>
              From
            </span>
            <input
              type="date"
              name="from"
              defaultValue={from}
              className="rounded-xl border px-3 py-2 text-sm"
              style={{
                backgroundColor: 'var(--color-bg)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text)',
              }}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>
              To
            </span>
            <input
              type="date"
              name="to"
              defaultValue={to}
              className="rounded-xl border px-3 py-2 text-sm"
              style={{
                backgroundColor: 'var(--color-bg)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text)',
              }}
            />
          </label>
          <button
            type="submit"
            className="rounded-xl border px-4 py-2 text-sm font-medium"
            style={{
              backgroundColor: 'var(--color-bg-elevated)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text)',
            }}
          >
            Filter
          </button>
        </form>
      </div>

      <LeadsTable leads={leads} searchQuery={q} />
    </div>
  );
}
