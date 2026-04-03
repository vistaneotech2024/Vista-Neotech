import Link from 'next/link';
import { getBaseUrl } from '@/lib/url-map';

type SitemapRow = {
  name: string;
  href: string;
  indent?: number;
};

function FolderIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M10 4a2 2 0 0 1 1.4.6l1.2 1.2H20a2 2 0 0 1 2 2v10.2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h6z" />
    </svg>
  );
}

export default function SitemapHtmlPage() {
  const base = getBaseUrl();

  const rows: SitemapRow[] = [
    // Yoast-style sitemap index (existing in this project)
    { name: 'sitemap_index.xml', href: `${base}/sitemap_index.xml`, indent: 0 },
    { name: 'post-sitemap.xml', href: `${base}/post-sitemap.xml`, indent: 1 },
    { name: 'page-sitemap.xml', href: `${base}/page-sitemap.xml`, indent: 1 },
    { name: 'category-sitemap.xml', href: `${base}/category-sitemap.xml`, indent: 1 },
    { name: 'tag-sitemap.xml', href: `${base}/tag-sitemap.xml`, indent: 1 },

    // Next.js default sitemap endpoint (also present)
    { name: 'sitemap.xml', href: `${base}/sitemap.xml`, indent: 0 },
  ];

  return (
    <div className="section-padding" style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}>
      <div className="container-wide">
        <div
          className="overflow-hidden rounded-2xl border"
          style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-elevated)' }}
        >
          <div className="border-b px-4 py-3" style={{ borderColor: 'var(--color-border)' }}>
            <p className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
              Sitemap
            </p>
          </div>

          <div className="px-4 py-2 text-xs" style={{ color: 'var(--color-text-muted)' }}>
            {rows.length} sitemap(s)
          </div>

          <div className="overflow-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: 'var(--color-bg-muted)' }}>
                  <th className="px-4 py-3 text-left font-semibold" style={{ color: 'var(--color-text-subtle)' }}>
                    Name
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.href} className="border-t" style={{ borderColor: 'var(--color-border)' }}>
                    <td className="px-4 py-3">
                      <div
                        className="flex items-center gap-2"
                        style={{ paddingLeft: `${Math.min(6, Math.max(0, r.indent ?? 0)) * 18}px` }}
                      >
                        <span style={{ color: 'var(--color-text-muted)' }}>
                          <FolderIcon />
                        </span>
                        <Link
                          href={r.href}
                          className="font-medium hover:underline"
                          style={{ color: 'var(--color-accent-1)' }}
                        >
                          {r.name}
                        </Link>
                        <span className="truncate text-xs" style={{ color: 'var(--color-text-muted)' }}>
                          {r.href}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

