import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { createAdminSupabase } from '@/lib/supabase-admin';
import { getIndexingApiSettings } from '@/lib/indexing-settings';

/** GET: return whether each key is configured (no raw keys). */
export async function GET() {
  await requireAdmin();
  const settings = await getIndexingApiSettings();
  return NextResponse.json({
    bing_configured: !!settings.bing_webmaster_api_key?.trim(),
    google_configured: !!settings.google_indexing_api_key?.trim(),
    updated_at: settings.updated_at,
  });
}

/** POST: update API keys. Send only keys you want to set; empty string clears. */
export async function POST(req: NextRequest) {
  await requireAdmin();
  const supabase = createAdminSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
  }

  let body: { bing_webmaster_api_key?: string; google_indexing_api_key?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const update: Record<string, string | null> = { updated_at: new Date().toISOString() };
  if (typeof body.bing_webmaster_api_key !== 'undefined') {
    update.bing_webmaster_api_key = body.bing_webmaster_api_key?.trim() || null;
  }
  if (typeof body.google_indexing_api_key !== 'undefined') {
    update.google_indexing_api_key = body.google_indexing_api_key?.trim() || null;
  }

  const { error } = await supabase
    .from('indexing_api_settings')
    .update(update)
    .eq('id', 1);

  if (error) {
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
