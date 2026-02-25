/**
 * Menu data from Supabase – used by Header and Footer.
 * Fetches menus by location and resolves href from url, custom_link, or linked page slug.
 */

import { createServerSupabase } from '@/lib/supabase-server';

export type NavLink = { href: string; label: string; target?: string };

export type FooterMenuData = {
  services: NavLink[];
  company: NavLink[];
};

function resolveHref(item: { url?: string | null; custom_link?: string | null; page_slug?: string | null }): string {
  const raw = item.url ?? item.custom_link ?? (item.page_slug ? `/${item.page_slug}` : '#');
  return raw.startsWith('http') ? raw : raw.startsWith('/') ? raw : `/${raw}`;
}

/** Ensure label is always a string (DB may return JSON/object by mistake). */
function toLabel(value: unknown): string {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return '';
}

/** Header: top-level nav links only (Home, About, Blog, Contact). Services dropdown and Our Brands stay static. */
export async function getHeaderNavLinks(): Promise<NavLink[]> {
  try {
    const supabase = createServerSupabase();
    if (!supabase) return [];

    const { data: menu } = await supabase
      .from('menus')
      .select('id')
      .eq('location', 'header')
      .single();

    if (!menu) return [];

    const { data: items } = await supabase
      .from('menu_items')
      .select(`
        id,
        label,
        url,
        custom_link,
        target,
        page_id,
        pages(slug)
      `)
      .eq('menu_id', menu.id)
      .order('order_index', { ascending: true });

    if (!items?.length) return [];

    return items.map((row: any) => {
      const pageSlug = row.pages?.slug ?? row.page?.slug ?? null;
      return {
        href: resolveHref({ url: row.url, custom_link: row.custom_link, page_slug: pageSlug }),
        label: toLabel(row.label),
        target: row.target === '_blank' ? '_blank' : undefined,
      };
    });
  } catch {
    return [];
  }
}

/** Footer: items split into services (order_index 0–3) and company (4+). */
export async function getFooterMenu(): Promise<FooterMenuData> {
  try {
    const supabase = createServerSupabase();
    if (!supabase) return { services: [], company: [] };

    const { data: menu } = await supabase
      .from('menus')
      .select('id')
      .eq('location', 'footer')
      .single();

    if (!menu) return { services: [], company: [] };

    const { data: items } = await supabase
      .from('menu_items')
      .select(`
        id,
        label,
        url,
        custom_link,
        target,
        order_index,
        pages(slug)
      `)
      .eq('menu_id', menu.id)
      .order('order_index', { ascending: true });

    if (!items?.length) return { services: [], company: [] };

    const pageSlug = (row: any) => row.pages?.slug ?? row.page?.slug ?? null;
    const links: NavLink[] = items.map((row: any) => ({
      href: resolveHref({ url: row.url, custom_link: row.custom_link, page_slug: pageSlug(row) }),
      label: toLabel(row.label),
      target: row.target === '_blank' ? '_blank' : undefined,
    }));

    const services = links.filter((_, i) => i < 4);
    const company = links.filter((_, i) => i >= 4);
    return { services, company };
  } catch {
    return { services: [], company: [] };
  }
}
