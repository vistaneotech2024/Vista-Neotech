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
  const status = String(body.status || 'draft').trim();
  const metaTitle = typeof body.metaTitle === 'string' ? body.metaTitle.trim() : null;
  const metaDescription = typeof body.metaDescription === 'string' ? body.metaDescription.trim() : null;
  const excerpt = typeof body.excerpt === 'string' ? body.excerpt : '';
  const content = typeof body.content === 'string' ? body.content : '';

  if (!slug) {
    return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
  }

  if (!['draft', 'published', 'archived', 'trash'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  const { error } = await supabase
    .from('posts')
    .update({
      title: title || null,
      slug,
      status,
      meta_title: metaTitle,
      meta_description: metaDescription,
      excerpt,
      content,
    })
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: 'Failed to save post' }, { status: 500 });
  }

  // Bing Webmaster URL submission when post is published (non-blocking)
  if (status === 'published') {
    getBingWebmasterApiKey().then((apiKey) => {
      if (apiKey) submitUrlToBing(`/${slug}`, { supabase, apiKey }).catch(() => {});
    });
  }

  return NextResponse.json({ ok: true });
}

