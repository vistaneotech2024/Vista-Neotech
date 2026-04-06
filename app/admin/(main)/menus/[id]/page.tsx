import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/admin-auth';
import { createAdminSupabase } from '@/lib/supabase-admin';
import { MenuEditorClient, type MenuItemInput } from './MenuEditorClient';

type Params = { params: { id: string } };

export default async function AdminMenuEditPage({ params }: Params) {
  await requireAdmin();
  const supabase = createAdminSupabase();

  if (!supabase) {
    notFound();
  }

  const { data: menu } = await supabase
    .from('menus')
    .select('id, name, slug, location')
    .eq('id', params.id)
    .maybeSingle();

  if (!menu) {
    notFound();
  }

  const { data: items } = await supabase
    .from('menu_items')
    .select('id, label, url, custom_link, target, order_index')
    .eq('menu_id', menu.id)
    .order('order_index', { ascending: true });

  const initialItems: MenuItemInput[] = (items || []).map((row: any) => ({
    id: row.id as string,
    label: (row.label as string) || '',
    href: (row.url as string) || (row.custom_link as string) || '/',
    target: (row.target as '_self' | '_blank') || '_self',
    order_index: (row.order_index as number) ?? 0,
  }));

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold" style={{ color: 'var(--color-text)' }}>
          Edit menu
        </h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--color-text-muted)' }}>
          Reorder and update links used by the header and footer.
        </p>
      </div>
      <MenuEditorClient
        menuId={menu.id as string}
        name={menu.name as string}
        slug={menu.slug as string}
        location={(menu.location as string) || null}
        initialItems={initialItems}
      />
    </div>
  );
}

