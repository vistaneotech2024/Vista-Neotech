import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { createAdminSupabase } from '@/lib/supabase-admin';
import { DEFAULT_HOME_HERO_CONFIG, type HomeHeroConfig } from '@/lib/cms/hero';

export async function GET() {
  await requireAdmin();

  const supabase = createAdminSupabase();
  if (!supabase) {
    return NextResponse.json({ config: DEFAULT_HOME_HERO_CONFIG });
  }

  const { data } = await supabase
    .from('content_blocks')
    .select('content')
    .eq('slug', 'home-hero')
    .maybeSingle();

  const config: HomeHeroConfig =
    data && (data as any).content ? ((data as any).content as HomeHeroConfig) : DEFAULT_HOME_HERO_CONFIG;

  return NextResponse.json({ config });
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

  const rawConfig = body?.config;
  if (!rawConfig || !Array.isArray(rawConfig.slides)) {
    return NextResponse.json({ error: 'Invalid hero config' }, { status: 400 });
  }

  const { error } = await supabase
    .from('content_blocks')
    .upsert(
      {
        slug: 'home-hero',
        name: 'Home Hero',
        type: 'hero',
        content: rawConfig,
      },
      { onConflict: 'slug' },
    );

  if (error) {
    return NextResponse.json({ error: 'Failed to save hero config' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

