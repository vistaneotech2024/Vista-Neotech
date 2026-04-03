import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { createAdminSupabase } from '@/lib/supabase-admin';
import { submitUrlToBing } from '@/lib/bing-submit';
import { getBingWebmasterApiKey } from '@/lib/indexing-settings';
import { isUuid, pickCategoryIdForUpdate } from '@/lib/parse-blog-category-id';

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
  const focusKeyword = typeof body.focusKeyword === 'string' ? body.focusKeyword.trim() : null;
  const canonicalUrl = typeof body.canonicalUrl === 'string' ? body.canonicalUrl.trim() : null;
  const ogTitle = typeof body.ogTitle === 'string' ? body.ogTitle.trim() : null;
  const ogDescription = typeof body.ogDescription === 'string' ? body.ogDescription.trim() : null;
  const ogImage = typeof body.ogImage === 'string' ? body.ogImage.trim() : null;
  const ogType = typeof body.ogType === 'string' ? body.ogType.trim() : null;
  const twitterCard = typeof body.twitterCard === 'string' ? body.twitterCard.trim() : null;
  const twitterTitle = typeof body.twitterTitle === 'string' ? body.twitterTitle.trim() : null;
  const twitterDescription = typeof body.twitterDescription === 'string' ? body.twitterDescription.trim() : null;
  const twitterImage = typeof body.twitterImage === 'string' ? body.twitterImage.trim() : null;
  const schemaMarkup = body.schemaMarkup ?? null;
  const customFields = body.customFields ?? null;
  const imageUrl = typeof body.imageUrl === 'string' ? body.imageUrl.trim() : null;
  const excerpt = typeof body.excerpt === 'string' ? body.excerpt : '';
  const content = typeof body.content === 'string' ? body.content : '';

  if (!slug) {
    return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
  }

  if (!['draft', 'published', 'archived', 'trash'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  const nowIso = new Date().toISOString();
  const { data: existing } = await supabase
    .from('posts')
    .select('published_at')
    .eq('id', id)
    .maybeSingle();
  const shouldSetPublishedAt = status === 'published' && !existing?.published_at;

  const categoryPatch = pickCategoryIdForUpdate(body);
  let categoryColumn: string | null | undefined;
  if (categoryPatch !== 'omit') {
    if (categoryPatch === null) {
      categoryColumn = null;
    } else if (!isUuid(categoryPatch)) {
      return NextResponse.json({ error: 'Invalid category id' }, { status: 400 });
    } else {
      const { data: categoryRow, error: categoryError } = await supabase
        .from('blog_categories')
        .select('id')
        .eq('id', categoryPatch)
        .maybeSingle();
      if (categoryError || !categoryRow) {
        return NextResponse.json({ error: 'Unknown category' }, { status: 400 });
      }
      categoryColumn = categoryPatch;
    }
  }

  const { error } = await supabase
    .from('posts')
    .update({
      title: title || slug || '(untitled)',
      slug,
      status,
      meta_title: metaTitle,
      meta_description: metaDescription,
      focus_keyword: focusKeyword,
      canonical_url: canonicalUrl,
      og_title: ogTitle,
      og_description: ogDescription,
      og_image: ogImage,
      og_type: ogType,
      twitter_card: twitterCard,
      twitter_title: twitterTitle,
      twitter_description: twitterDescription,
      twitter_image: twitterImage,
      schema_markup: schemaMarkup,
      custom_fields: customFields,
      image_url: imageUrl,
      excerpt,
      content,
      updated_at: nowIso,
      ...(shouldSetPublishedAt ? { published_at: nowIso } : {}),
      ...(categoryColumn !== undefined ? { Category: categoryColumn } : {}),
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

export async function DELETE(_: NextRequest, { params }: Params) {
  await requireAdmin();
  const supabase = createAdminSupabase();
  const { id } = await params;

  if (!supabase) {
    return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
  }

  const { error } = await supabase.from('posts').delete().eq('id', id);
  if (error) {
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

