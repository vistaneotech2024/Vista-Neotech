import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { createAdminSupabase } from '@/lib/supabase-admin';

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
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

  const patch: Record<string, any> = {};
  if (typeof body?.name === 'string') patch.name = body.name.trim();
  if (typeof body?.isActive === 'boolean') patch.is_active = body.isActive;

  if (patch.name !== undefined && !patch.name) {
    return NextResponse.json({ error: 'Name cannot be empty' }, { status: 400 });
  }

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: 'No changes provided' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('blog_categories')
    .update(patch)
    .eq('id', id)
    .select('id, name, is_active, created_at, updated_at')
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }

  return NextResponse.json({ ok: true, category: data });
}

export async function DELETE(_: NextRequest, { params }: Params) {
  await requireAdmin();
  const supabase = createAdminSupabase();
  const { id } = await params;

  if (!supabase) {
    return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
  }

  const { error } = await supabase.from('blog_categories').delete().eq('id', id);
  if (error) {
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

