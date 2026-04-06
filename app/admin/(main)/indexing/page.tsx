import { requireAdmin } from '@/lib/admin-auth';
import IndexingSettingsClient from './IndexingSettingsClient';
import { getIndexingApiSettings } from '@/lib/indexing-settings';

export default async function AdminIndexingPage() {
  await requireAdmin();
  const settings = await getIndexingApiSettings();

  const initial = {
    bing_configured: !!settings.bing_webmaster_api_key?.trim(),
    google_configured: !!settings.google_indexing_api_key?.trim(),
    updated_at: settings.updated_at,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
          Indexing API keys
        </h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--color-text-muted)' }}>
          Set API keys so new or updated pages and blog posts are automatically submitted to search engines for faster indexing.
        </p>
      </div>
      <IndexingSettingsClient initial={initial} />
    </div>
  );
}
