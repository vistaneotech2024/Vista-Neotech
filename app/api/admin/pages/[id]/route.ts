import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { createAdminSupabase } from '@/lib/supabase-admin';
import { submitUrlToBing } from '@/lib/bing-submit';
import { getBingWebmasterApiKey } from '@/lib/indexing-settings';

type Params = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Params) {
  await requireAdmin();
  const supabase = createAdminSupabase();
  const { id } = await params;
  if (!supabase) {
    return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const title = String(body.title || '').trim();
  const slug = String(body.slug || '').trim();
  const metaTitle = typeof body.metaTitle === 'string' ? body.metaTitle.trim() : null;
  const metaDescription = typeof body.metaDescription === 'string' ? body.metaDescription.trim() : null;
  const content = typeof body.content === 'string' ? body.content : '';

  if (!slug) {
    return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
  }

  const { error } = await supabase
    .from('pages')
    .update({
      title: title || null,
      slug,
      meta_title: metaTitle,
      meta_description: metaDescription,
      content,
    })
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: 'Failed to save page' }, { status: 500 });
  }

  // Bing Webmaster URL submission on page update (non-blocking; duplicate prevention in lib)
  getBingWebmasterApiKey().then((apiKey) => {
    if (apiKey) submitUrlToBing(`/${slug}`, { supabase, apiKey }).catch(() => {});
  });

  return NextResponse.json({ ok: true });
}

