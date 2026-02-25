'use client';

import { useState } from 'react';

export type LeadRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  services: string[] | null;
  status: string | null;
  page_path: string | null;
  source: string | null;
  created_at: string;
};

export function LeadsTable({
  leads: initialLeads,
  searchQuery,
}: {
  leads: LeadRow[];
  searchQuery: string;
}) {
  const [leads, setLeads] = useState(initialLeads);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [search, setSearch] = useState(searchQuery);

  const filtered =
    !search.trim()
      ? leads
      : leads.filter((l) => {
          const q = search.toLowerCase();
          return (
            l.email?.toLowerCase().includes(q) ||
            (l.phone || '').toLowerCase().includes(q) ||
            l.name?.toLowerCase().includes(q)
          );
        });

  async function markContacted(id: string) {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'contacted' }),
      });
      if (res.ok) setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status: 'contacted' } : l)));
    } finally {
      setUpdatingId(null);
    }
  }

  function exportCsv() {
    const headers = ['Name', 'Email', 'Mobile', 'Message', 'Page', 'Source', 'Status', 'Created'];
    const rows = filtered.map((l) => [
      `"${(l.name || '').replace(/"/g, '""')}"`,
      `"${(l.email || '').replace(/"/g, '""')}"`,
      `"${(l.phone || '').replace(/"/g, '""')}"`,
      `"${(l.message || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
      `"${(l.page_path || '').replace(/"/g, '""')}"`,
      `"${(l.source || 'contact_form').replace(/"/g, '""')}"`,
      `"${(l.status || 'new').replace(/"/g, '""')}"`,
      new Date(l.created_at).toISOString(),
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <input
          type="search"
          placeholder="Search by email or mobile"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-xl border px-4 py-2 text-sm outline-none focus:ring-2"
          style={{
            backgroundColor: 'var(--color-bg)',
            borderColor: 'var(--color-border)',
            color: 'var(--color-text)',
            minWidth: 220,
          }}
        />
        <button
          type="button"
          onClick={exportCsv}
          className="rounded-xl border px-4 py-2 text-sm font-medium"
          style={{
            backgroundColor: 'var(--color-bg-elevated)',
            borderColor: 'var(--color-border)',
            color: 'var(--color-text)',
          }}
        >
          Export CSV
        </button>
      </div>

      <div
        className="overflow-x-auto rounded-3xl border"
        style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-elevated)' }}
      >
        <table className="min-w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: 'var(--color-bg-muted)' }}>
              <th className="px-4 py-3 text-left font-semibold" style={{ color: 'var(--color-text-subtle)' }}>
                Name
              </th>
              <th className="px-4 py-3 text-left font-semibold" style={{ color: 'var(--color-text-subtle)' }}>
                Email
              </th>
              <th className="px-4 py-3 text-left font-semibold" style={{ color: 'var(--color-text-subtle)' }}>
                Mobile
              </th>
              <th className="px-4 py-3 text-left font-semibold" style={{ color: 'var(--color-text-subtle)' }}>
                Message
              </th>
              <th className="px-4 py-3 text-left font-semibold" style={{ color: 'var(--color-text-subtle)' }}>
                Page
              </th>
              <th className="px-4 py-3 text-left font-semibold" style={{ color: 'var(--color-text-subtle)' }}>
                Source
              </th>
              <th className="px-4 py-3 text-left font-semibold" style={{ color: 'var(--color-text-subtle)' }}>
                Status
              </th>
              <th className="px-4 py-3 text-left font-semibold" style={{ color: 'var(--color-text-subtle)' }}>
                Created
              </th>
              <th className="px-4 py-3 text-left font-semibold" style={{ color: 'var(--color-text-subtle)' }}>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((lead) => (
              <tr key={lead.id} className="border-t" style={{ borderColor: 'var(--color-border)' }}>
                <td className="px-4 py-3" style={{ color: 'var(--color-text)' }}>
                  {lead.name}
                </td>
                <td className="px-4 py-3" style={{ color: 'var(--color-text-muted)' }}>
                  {lead.email}
                </td>
                <td className="px-4 py-3" style={{ color: 'var(--color-text-muted)' }}>
                  {lead.phone || '—'}
                </td>
                <td className="max-w-[200px] truncate px-4 py-3" style={{ color: 'var(--color-text-muted)' }} title={lead.message || ''}>
                  {lead.message || '—'}
                </td>
                <td className="px-4 py-3" style={{ color: 'var(--color-text-muted)' }}>
                  {lead.page_path || '—'}
                </td>
                <td className="px-4 py-3 capitalize" style={{ color: 'var(--color-text-muted)' }}>
                  {(lead.source || 'contact_form').replace('_', ' ')}
                </td>
                <td className="px-4 py-3 capitalize" style={{ color: 'var(--color-text-muted)' }}>
                  {lead.status || 'new'}
                </td>
                <td className="px-4 py-3" style={{ color: 'var(--color-text-muted)' }}>
                  {new Date(lead.created_at).toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  {lead.status === 'contacted' ? (
                    <span className="text-xs font-medium" style={{ color: 'var(--color-accent-2)' }}>
                      Contacted
                    </span>
                  ) : (
                    <button
                      type="button"
                      disabled={updatingId === lead.id}
                      onClick={() => markContacted(lead.id)}
                      className="rounded-lg border px-3 py-1.5 text-xs font-medium hover:opacity-90 disabled:opacity-50"
                      style={{
                        borderColor: 'var(--color-accent-1)',
                        color: 'var(--color-accent-1)',
                      }}
                    >
                      {updatingId === lead.id ? 'Updating…' : 'Mark contacted'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={10}
                  className="px-4 py-6 text-center text-sm"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  No leads match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
