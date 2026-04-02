import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { createAdminSupabase } from '@/lib/supabase-admin';

export async function GET() {
  await requireAdmin();
  const supabase = createAdminSupabase();

  if (!supabase) {
    return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
  }

  const { data, error } = await supabase
    .from('blog_categories')
    .select('id, name, is_active, created_at, updated_at')
    .order('name', { ascending: true });

  if (error) {
    return NextResponse.json({ error: 'Failed to load categories' }, { status: 500 });
  }

  return NextResponse.json({ ok: true, categories: data ?? [] });
}

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

  const name = String(body?.name ?? '').trim();
  const isActive = typeof body?.isActive === 'boolean' ? body.isActive : true;

  if (!name) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('blog_categories')
    .insert({
      name,
      is_active: isActive,
    })
    .select('id, name, is_active, created_at, updated_at')
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }

  return NextResponse.json({ ok: true, category: data });
}

