/**
 * Bing Webmaster URL Submission API integration.
 * Called when a post or page is published/updated. Logs to bing_submission_logs.
 * Duplicate prevention: skip if same URL submitted successfully in last 24h.
 */

const BING_API = 'https://ssl.bing.com/webmasters/api.svc/json/SubmitUrlbatch';

export type BingSubmitResult = {
  ok: boolean;
  status: 'success' | 'error' | 'skipped';
  message?: string;
  response?: unknown;
};

/** Get site URL for Bing (must match verified site in Bing Webmaster Tools) */
function getSiteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL;
  if (url) {
    return url.startsWith('http') ? url : `https://${url}`;
  }
  return 'https://vistaneotech.com';
}

/**
 * Submit one or more URLs to Bing. Uses BING_WEBMASTER_API_KEY env var.
 * Logs each URL to bing_submission_logs via supabase.
 */
export async function submitUrlsToBing(
  urls: string[],
  options: {
    /** Supabase client for logging and duplicate check (e.g. createAdminSupabase()) */
    supabase?: { from: (table: string) => { select: (cols?: string) => unknown; insert: (row: unknown) => unknown } };
    skipDuplicateWindowHours?: number;
    /** Override API key (e.g. from admin-stored settings). If not set, uses BING_WEBMASTER_API_KEY env. */
    apiKey?: string | null;
  } = {}
): Promise<BingSubmitResult> {
  const apiKey = options.apiKey?.trim() || process.env.BING_WEBMASTER_API_KEY?.trim();
  if (!apiKey) {
    return { ok: false, status: 'error', message: 'Bing API key not set. Add it in Admin → Indexing API keys or set BING_WEBMASTER_API_KEY.' };
  }

  const siteUrl = getSiteUrl().replace(/\/$/, '');
  const normalized = urls
    .map((u) => (u.startsWith('http') ? u : `${siteUrl}${u.startsWith('/') ? u : '/' + u}`))
    .filter((u) => u.startsWith(siteUrl));

  if (normalized.length === 0) {
    return { ok: false, status: 'error', message: 'No valid URLs to submit' };
  }

  const windowHours = options.skipDuplicateWindowHours ?? 24;
  const supabase = options.supabase;

  if (supabase && windowHours > 0) {
    const cutoff = new Date(Date.now() - windowHours * 60 * 60 * 1000).toISOString();
    const sb = supabase as any;
    for (const url of normalized) {
      const { data: recent } = await sb.from('bing_submission_logs').select('id').eq('url', url).eq('status', 'success').gte('submitted_at', cutoff).limit(1);
      if (Array.isArray(recent) && recent.length > 0) {
        return { ok: true, status: 'skipped', message: 'URL already submitted recently' };
      }
    }
  }

  const payload = { siteUrl, urlList: normalized };
  let res: Response;
  try {
    res = await fetch(`${BING_API}?apikey=${encodeURIComponent(apiKey!)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(payload),
    });
  } catch (err: any) {
    const msg = err?.message || 'Network error';
    for (const url of normalized) {
      await logSubmission(supabase, url, 'error', null, msg);
    }
    return { ok: false, status: 'error', message: msg };
  }

  const text = await res.text();
  let json: unknown = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = { raw: text };
  }

  const status: 'success' | 'error' = res.ok ? 'success' : 'error';
  const errorMessage = res.ok ? null : (typeof (json as any)?.Message === 'string' ? (json as any).Message : text);

  for (const url of normalized) {
    await logSubmission(supabase, url, status, json, errorMessage);
  }

  return {
    ok: res.ok,
    status,
    message: errorMessage || undefined,
    response: json,
  };
}

async function logSubmission(
  supabase: { from: (table: string) => { insert: (row: unknown) => unknown } } | undefined,
  url: string,
  status: string,
  apiResponse: unknown,
  errorMessage: string | null
): Promise<void> {
  if (!supabase) return;
  try {
    const ins = supabase.from('bing_submission_logs').insert({
      url,
      status,
      api_response: apiResponse,
      error_message: errorMessage,
      source: 'admin',
    });
    if (typeof (ins as any).then === 'function') await (ins as Promise<unknown>);
  } catch {
    // non-fatal
  }
}

/**
 * Single-URL helper for admin save flows.
 */
export async function submitUrlToBing(
  pathOrFullUrl: string,
  options: {
    supabase?: { from: (table: string) => { select: (c?: string) => unknown; insert: (row: unknown) => unknown } };
    apiKey?: string | null;
  } = {}
): Promise<BingSubmitResult> {
  const siteUrl = getSiteUrl().replace(/\/$/, '');
  const url = pathOrFullUrl.startsWith('http') ? pathOrFullUrl : `${siteUrl}${pathOrFullUrl.startsWith('/') ? pathOrFullUrl : '/' + pathOrFullUrl}`;
  return submitUrlsToBing([url], options);
}
