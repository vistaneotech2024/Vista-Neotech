import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { createAdminSupabase } from '@/lib/supabase-admin';
import { isUuid } from '@/lib/parse-blog-category-id';
import { isMissingBlogSubcategoryTablesError } from '@/lib/blog-subcategories-schema';

type LoadResult = {
  subcategories: Array<Record<string, unknown>>;
  loadError?: string;
  /** True when tables are missing — UI can prompt to run migrations. */
  schemaPending?: boolean;
};

async function loadSubcategoriesWithLinks(
  supabase: NonNullable<ReturnType<typeof createAdminSupabase>>,
): Promise<LoadResult> {
  const subsRes = await supabase
    .from('blog_subcategories')
    .select('id, name, is_active, created_at, updated_at')
    .order('name', { ascending: true });

  if (subsRes.error) {
    if (isMissingBlogSubcategoryTablesError(subsRes.error)) {
      return { subcategories: [], schemaPending: true };
    }
    return { subcategories: [], loadError: subsRes.error.message };
  }

  const linksRes = await supabase.from('blog_category_subcategories').select('category_id, subcategory_id');

  let linkRows = linksRes.data ?? [];
  if (linksRes.error) {
    if (isMissingBlogSubcategoryTablesError(linksRes.error)) {
      linkRows = [];
    } else {
      return { subcategories: [], loadError: linksRes.error.message };
    }
  }

  const bySub = new Map<string, string[]>();
  for (const row of linkRows) {
    const sid = row.subcategory_id as string;
    const cid = row.category_id as string;
    const list = bySub.get(sid) ?? [];
    list.push(cid);
    bySub.set(sid, list);
  }

  const subcategories = (subsRes.data ?? []).map((r) => ({
    id: r.id as string,
    name: r.name as string,
    is_active: r.is_active as boolean,
    created_at: r.created_at,
    updated_at: r.updated_at,
    category_ids: bySub.get(r.id as string) ?? [],
  }));

  return { subcategories };
}

export async function GET() {
  await requireAdmin();
  const supabase = createAdminSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
  }

  const result = await loadSubcategoriesWithLinks(supabase);
  if (result.loadError) {
    return NextResponse.json({ error: 'Failed to load subcategories' }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    subcategories: result.subcategories,
    ...(result.schemaPending ? { schemaPending: true as const } : {}),
  });
}

export async function POST(req: NextRequest) {
  await requireAdmin();
  const supabase = createAdminSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const name = String(body.name ?? '').trim();
  const isActive = typeof body.isActive === 'boolean' ? body.isActive : true;
  const rawIds = body.categoryIds;
  const categoryIds = Array.from(
    new Set(
      Array.isArray(rawIds)
        ? rawIds.map((x) => String(x).trim()).filter((cid) => isUuid(cid))
        : [],
    ),
  );

  if (!name) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  }

  if (categoryIds.length > 0) {
    const { data: found, error: cErr } = await supabase
      .from('blog_categories')
      .select('id')
      .in('id', categoryIds);
    if (cErr || !found || found.length !== categoryIds.length) {
      return NextResponse.json({ error: 'One or more categories were not found' }, { status: 400 });
    }
  }

  const { data: row, error: insErr } = await supabase
    .from('blog_subcategories')
    .insert({ name, is_active: isActive })
    .select('id, name, is_active, created_at, updated_at')
    .maybeSingle();

  if (insErr || !row) {
    if (insErr && isMissingBlogSubcategoryTablesError(insErr)) {
      return NextResponse.json(
        {
          error:
            'Subcategory tables are not set up. Apply the Supabase migration `20260404000300_blog_subcategories_many_to_many.sql` (e.g. run `supabase db push` or paste the SQL in the SQL editor).',
        },
        { status: 503 },
      );
    }
    return NextResponse.json({ error: 'Failed to create subcategory' }, { status: 500 });
  }

  const subId = row.id as string;

  if (categoryIds.length > 0) {
    const { error: linkErr } = await supabase.from('blog_category_subcategories').insert(
      categoryIds.map((category_id) => ({ category_id, subcategory_id: subId })),
    );
    if (linkErr) {
      await supabase.from('blog_subcategories').delete().eq('id', subId);
      return NextResponse.json({ error: 'Failed to assign categories' }, { status: 500 });
    }
  }

  const refreshed = await loadSubcategoriesWithLinks(supabase);
  const sub = refreshed.subcategories.find((s) => s.id === subId);

  return NextResponse.json({
    ok: true,
    subcategory: sub ?? { ...row, category_ids: categoryIds },
  });
}
