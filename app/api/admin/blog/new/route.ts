import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { createAdminSupabase } from '@/lib/supabase-admin';
import { isUuid, pickCategoryIdInput } from '@/lib/parse-blog-category-id';
import { blogCategoryIdsExist, blogSubcategoryIdsExist } from '@/lib/blog-post-category';
import {
  mergeTaxonomyIntoCustomFields,
  pickTaxonomyIdsFromBody,
  primaryCategoryColumn,
} from '@/lib/blog-post-taxonomy';

export async function POST(req: NextRequest) {
  await requireAdmin();
  const supabase = createAdminSupabase();

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
  const imageUrl = typeof body.imageUrl === 'string' ? body.imageUrl.trim() : null;
  const excerpt = typeof body.excerpt === 'string' ? body.excerpt : '';
  const content = typeof body.content === 'string' ? body.content : '';

  if (!title) {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 });
  }
  if (!slug) {
    return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
  }

  if (!['draft', 'published', 'archived', 'trash'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  const baseCustomFields =
    body.customFields != null && typeof body.customFields === 'object' && !Array.isArray(body.customFields)
      ? ({ ...body.customFields } as Record<string, unknown>)
      : {};

  let { categoryIds, subcategoryIds } = pickTaxonomyIdsFromBody(body);
  if (categoryIds.length === 0 && subcategoryIds.length === 0) {
    const legacy = pickCategoryIdInput(body);
    if (legacy && isUuid(legacy)) {
      categoryIds = [legacy];
    }
  }
  if (categoryIds.length === 0 && subcategoryIds.length === 0) {
    return NextResponse.json(
      { error: 'Select at least one category and/or subcategory' },
      { status: 400 },
    );
  }

  if (!(await blogCategoryIdsExist(supabase, categoryIds))) {
    return NextResponse.json({ error: 'One or more categories were not found' }, { status: 400 });
  }
  if (!(await blogSubcategoryIdsExist(supabase, subcategoryIds))) {
    return NextResponse.json({ error: 'One or more subcategories were not found' }, { status: 400 });
  }

  const categoryDisplay =
    typeof baseCustomFields.category === 'string' && baseCustomFields.category.trim()
      ? baseCustomFields.category.trim()
      : '';

  const customFields = mergeTaxonomyIntoCustomFields(
    baseCustomFields,
    categoryIds,
    subcategoryIds,
    categoryDisplay,
  );

  const categoryColumn = primaryCategoryColumn(categoryIds, subcategoryIds);

  const published_at = status === 'published' ? new Date().toISOString() : null;

  const insertRow: Record<string, unknown> = {
    content_type: 'post',
    title,
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
    published_at,
  };

  if (categoryColumn) {
    insertRow.Category = categoryColumn;
  }

  const { data, error } = await supabase.from('posts').insert(insertRow).select('id').maybeSingle();

  if (error) {
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }

  const id = (data as any)?.id;
  if (!id || typeof id !== 'string') {
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }

  return NextResponse.json({ ok: true, id });
}
