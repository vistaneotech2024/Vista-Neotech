'use client';

import { useState } from 'react';

type Initial = {
  bing_configured: boolean;
  google_configured: boolean;
  updated_at: string | null;
};

export default function IndexingSettingsClient({ initial }: { initial: Initial }) {
  const [bingKey, setBingKey] = useState('');
  const [googleKey, setGoogleKey] = useState('');
  const [clearBing, setClearBing] = useState(false);
  const [bingConfigured, setBingConfigured] = useState(initial.bing_configured);
  const [googleConfigured, setGoogleConfigured] = useState(initial.google_configured);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const body: Record<string, string> = {};
      if (clearBing || bingKey !== '') body.bing_webmaster_api_key = clearBing ? '' : bingKey;
      if (googleKey !== '') body.google_indexing_api_key = googleKey;
      const res = await fetch('/api/admin/indexing-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || 'Failed to save');
      }
      setMessage({ type: 'success', text: 'Settings saved. New/updated pages and posts will use these keys for auto-indexing.' });
      setBingKey('');
      setGoogleKey('');
      setClearBing(false);
      if ('bing_webmaster_api_key' in body) setBingConfigured(!!body.bing_webmaster_api_key?.trim());
      if ('google_indexing_api_key' in body) setGoogleConfigured(!!body.google_indexing_api_key?.trim());
    } catch (err: any) {
      setMessage({ type: 'error', text: err?.message || 'Failed to save' });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="rounded-2xl border p-6 md:p-8" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-elevated)' }}>
        <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text)' }}>
          Bing Webmaster Tools
        </h2>
        <p className="text-sm mb-4" style={{ color: 'var(--color-text-muted)' }}>
          Used to submit URLs when you publish or update a post or page. Get your API key from{' '}
          <a
            href="https://www.bing.com/webmasters"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
            style={{ color: 'var(--color-accent-1)' }}
          >
            Bing Webmaster Tools
          </a>{' '}
          → Settings → API Access.
        </p>
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
            API key
          </label>
          {bingConfigured && !bingKey ? (
            <p className="text-sm mb-2" style={{ color: 'var(--color-text-muted)' }}>
              ✓ Configured. Enter a new key below to replace, or leave blank to keep current.
            </p>
          ) : null}
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="password"
              value={bingKey}
              onChange={(e) => setBingKey(e.target.value)}
              placeholder={bingConfigured ? 'Enter new key to replace' : 'Paste your Bing Webmaster API key'}
              className="w-full max-w-md rounded-xl border px-4 py-3 text-sm font-mono"
              style={{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
              autoComplete="off"
            />
            {bingConfigured && (
              <button
                type="button"
                onClick={() => { setBingKey(''); setClearBing(true); }}
                className="text-sm underline"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Clear (remove key)
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border p-6 md:p-8" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-elevated)' }}>
        <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text)' }}>
          Google Indexing API (optional)
        </h2>
        <p className="text-sm mb-4" style={{ color: 'var(--color-text-muted)' }}>
          For notifying Google when pages or posts are published or updated. Requires a service account and Indexing API setup.
        </p>
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
            API key / credentials
          </label>
          {googleConfigured && !googleKey ? (
            <p className="text-sm mb-2" style={{ color: 'var(--color-text-muted)' }}>
              ✓ Configured. Enter new value to replace, or leave blank to keep current.
            </p>
          ) : null}
          <input
            type="password"
            value={googleKey}
            onChange={(e) => setGoogleKey(e.target.value)}
            placeholder={googleConfigured ? 'Enter new value to replace' : 'Not yet implemented'}
            className="w-full max-w-md rounded-xl border px-4 py-3 text-sm font-mono"
            style={{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            autoComplete="off"
            disabled
          />
          <p className="mt-2 text-xs" style={{ color: 'var(--color-text-muted)' }}>
            Google Indexing API integration can be added in a future update.
          </p>
        </div>
      </div>

      {message && (
        <div
          className="rounded-xl border px-4 py-3 text-sm"
          style={{
            borderColor: message.type === 'success' ? 'var(--color-accent-1)' : 'var(--color-error, #dc2626)',
            color: message.type === 'success' ? 'var(--color-accent-1)' : 'var(--color-error, #dc2626)',
          }}
        >
          {message.text}
        </div>
      )}

      <button
        type="submit"
        disabled={saving}
        className="rounded-xl px-6 py-3 text-sm font-semibold text-white transition disabled:opacity-50"
        style={{ backgroundColor: 'var(--color-accent-1)' }}
      >
        {saving ? 'Saving…' : 'Save API keys'}
      </button>
    </form>
  );
}
