import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { createAdminSupabase } from '@/lib/supabase-admin';
import { isUuid } from '@/lib/parse-blog-category-id';
import { isMissingBlogSubcategoryTablesError } from '@/lib/blog-subcategories-schema';

type Params = { params: Promise<{ id: string }> };

async function loadSubcategoriesWithLinks(supabase: NonNullable<ReturnType<typeof createAdminSupabase>>) {
  const [subsRes, linksRes] = await Promise.all([
    supabase
      .from('blog_subcategories')
      .select('id, name, is_active, created_at, updated_at')
      .order('name', { ascending: true }),
    supabase.from('blog_category_subcategories').select('category_id, subcategory_id'),
  ]);

  if (subsRes.error || linksRes.error) {
    return { subcategories: [] as Array<Record<string, unknown>> };
  }

  const bySub = new Map<string, string[]>();
  for (const row of linksRes.data ?? []) {
    const sid = row.subcategory_id as string;
    const cid = row.category_id as string;
    const list = bySub.get(sid) ?? [];
    list.push(cid);
    bySub.set(sid, list);
  }

  return {
    subcategories: (subsRes.data ?? []).map((r) => ({
      id: r.id as string,
      name: r.name as string,
      is_active: r.is_active as boolean,
      created_at: r.created_at,
      updated_at: r.updated_at,
      category_ids: bySub.get(r.id as string) ?? [],
    })),
  };
}

export async function PATCH(req: NextRequest, { params }: Params) {
  await requireAdmin();
  const supabase = createAdminSupabase();
  const { id } = await params;

  if (!supabase) {
    return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
  }
  if (!isUuid(id)) {
    return NextResponse.json({ error: 'Invalid subcategory id' }, { status: 400 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const patch: Record<string, unknown> = {};
  if (typeof body.name === 'string') patch.name = body.name.trim();
  if (typeof body.isActive === 'boolean') patch.is_active = body.isActive;

  if (patch.name !== undefined && !patch.name) {
    return NextResponse.json({ error: 'Name cannot be empty' }, { status: 400 });
  }

  if (Object.keys(patch).length > 0) {
    const { error } = await supabase.from('blog_subcategories').update(patch).eq('id', id);
    if (error) {
      if (isMissingBlogSubcategoryTablesError(error)) {
        return NextResponse.json(
          {
            error:
              'Subcategory tables are not set up. Apply migration `20260404000300_blog_subcategories_many_to_many.sql` (e.g. `supabase db push`).',
          },
          { status: 503 },
        );
      }
      return NextResponse.json({ error: 'Failed to update subcategory' }, { status: 500 });
    }
  }

  if ('categoryIds' in body) {
    const rawIds = body.categoryIds;
    const categoryIds = Array.from(
      new Set(
        Array.isArray(rawIds)
          ? rawIds.map((x) => String(x).trim()).filter((cid) => isUuid(cid))
          : [],
      ),
    );

    if (categoryIds.length > 0) {
      const { data: found, error: cErr } = await supabase
        .from('blog_categories')
        .select('id')
        .in('id', categoryIds);
      if (cErr || !found || found.length !== categoryIds.length) {
        return NextResponse.json({ error: 'One or more categories were not found' }, { status: 400 });
      }
    }

    const { error: delErr } = await supabase.from('blog_category_subcategories').delete().eq('subcategory_id', id);
    if (delErr) {
      if (isMissingBlogSubcategoryTablesError(delErr)) {
        return NextResponse.json(
          {
            error:
              'Subcategory tables are not set up. Apply migration `20260404000300_blog_subcategories_many_to_many.sql`.',
          },
          { status: 503 },
        );
      }
      return NextResponse.json({ error: 'Failed to update category links' }, { status: 500 });
    }

    if (categoryIds.length > 0) {
      const { error: insErr } = await supabase.from('blog_category_subcategories').insert(
        categoryIds.map((category_id) => ({ category_id, subcategory_id: id })),
      );
      if (insErr) {
        if (isMissingBlogSubcategoryTablesError(insErr)) {
          return NextResponse.json(
            {
              error:
                'Subcategory tables are not set up. Apply migration `20260404000300_blog_subcategories_many_to_many.sql`.',
            },
            { status: 503 },
          );
        }
        return NextResponse.json({ error: 'Failed to assign categories' }, { status: 500 });
      }
    }
  }

  if (Object.keys(patch).length === 0 && !('categoryIds' in body)) {
    return NextResponse.json({ error: 'No changes provided' }, { status: 400 });
  }

  const { subcategories } = await loadSubcategoriesWithLinks(supabase);
  const sub = subcategories.find((s) => s.id === id);

  return NextResponse.json({ ok: true, subcategory: sub });
}

export async function DELETE(_: NextRequest, { params }: Params) {
  await requireAdmin();
  const supabase = createAdminSupabase();
  const { id } = await params;

  if (!supabase) {
    return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
  }

  const { error } = await supabase.from('blog_subcategories').delete().eq('id', id);
  if (error) {
    if (isMissingBlogSubcategoryTablesError(error)) {
      return NextResponse.json(
        {
          error:
            'Subcategory tables are not set up. Apply migration `20260404000300_blog_subcategories_many_to_many.sql`.',
        },
        { status: 503 },
      );
    }
    return NextResponse.json({ error: 'Failed to delete subcategory' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
