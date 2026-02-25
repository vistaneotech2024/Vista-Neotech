/**
 * Server-only: read indexing API settings from DB (used when submitting URLs to Bing, etc.).
 * Only call from server context with createAdminSupabase.
 */

import { createAdminSupabase } from '@/lib/supabase-admin';

export type IndexingApiSettings = {
  bing_webmaster_api_key: string | null;
  google_indexing_api_key: string | null;
  updated_at: string | null;
};

const DEFAULTS: IndexingApiSettings = {
  bing_webmaster_api_key: null,
  google_indexing_api_key: null,
  updated_at: null,
};

export async function getIndexingApiSettings(): Promise<IndexingApiSettings> {
  const supabase = createAdminSupabase();
  if (!supabase) return DEFAULTS;
  const { data, error } = await supabase
    .from('indexing_api_settings')
    .select('bing_webmaster_api_key, google_indexing_api_key, updated_at')
    .eq('id', 1)
    .maybeSingle();
  if (error || !data) return DEFAULTS;
  return {
    bing_webmaster_api_key: (data as any).bing_webmaster_api_key ?? null,
    google_indexing_api_key: (data as any).google_indexing_api_key ?? null,
    updated_at: (data as any).updated_at ?? null,
  };
}

/** Returns Bing API key: DB first, then env. */
export async function getBingWebmasterApiKey(): Promise<string | null> {
  const settings = await getIndexingApiSettings();
  if (settings.bing_webmaster_api_key?.trim()) return settings.bing_webmaster_api_key.trim();
  const env = process.env.BING_WEBMASTER_API_KEY;
  return env?.trim() || null;
}
