import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { createAdminSupabase } from '@/lib/supabase-admin';

type Params = { params: { id: string } };

type MenuItemInput = {
  id?: string;
  label: string;
  href: string;
  target: '_self' | '_blank';
  order_index: number;
};

export async function POST(req: NextRequest, { params }: Params) {
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

  const items = Array.isArray(body.items) ? (body.items as MenuItemInput[]) : [];

  // Load existing items for this menu so we can diff
  const { data: existingRows, error: loadError } = await supabase
    .from('menu_items')
    .select('id')
    .eq('menu_id', params.id);

  if (loadError) {
    return NextResponse.json({ error: 'Failed to load menu items' }, { status: 500 });
  }

  const existingIdsArray = (existingRows || []).map((r: any) => r.id as string);
  const incomingIdsArray = items.filter((i) => i.id).map((i) => i.id as string);
  const existingIds = new Set(existingIdsArray);
  const incomingIds = new Set(incomingIdsArray);

  const toDelete = existingIdsArray.filter((id) => !incomingIds.has(id));

  const updates = items.filter((i) => i.id && existingIds.has(i.id));
  const inserts = items.filter((i) => !i.id);

  // Delete removed items
  if (toDelete.length > 0) {
    const { error: deleteError } = await supabase.from('menu_items').delete().in('id', toDelete);
    if (deleteError) {
      return NextResponse.json({ error: 'Failed to delete menu items' }, { status: 500 });
    }
  }

  // Update existing items
  for (const item of updates) {
    const href = (item.href || '').trim();
    const isExternal = href.startsWith('http://') || href.startsWith('https://');

    const { error } = await supabase
      .from('menu_items')
      .update({
        label: item.label.trim(),
        url: href,
        custom_link: isExternal ? href : null,
        target: item.target || '_self',
        order_index: item.order_index ?? 0,
      })
      .eq('id', item.id);

    if (error) {
      return NextResponse.json({ error: 'Failed to update menu item' }, { status: 500 });
    }
  }

  // Insert new items
  if (inserts.length > 0) {
    const insertRows = inserts.map((item) => {
      const href = (item.href || '').trim();
      const isExternal = href.startsWith('http://') || href.startsWith('https://');
      return {
        menu_id: params.id,
        label: item.label.trim(),
        url: href,
        custom_link: isExternal ? href : null,
        target: item.target || '_self',
        order_index: item.order_index ?? 0,
        parent_id: null,
      };
    });

    const { error: insertError } = await supabase.from('menu_items').insert(insertRows);
    if (insertError) {
      return NextResponse.json({ error: 'Failed to create menu items' }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true });
}

