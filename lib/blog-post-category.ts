import type { SupabaseClient } from '@supabase/supabase-js';

/** True if id exists in blog_categories or blog_subcategories. */
export async function blogPostCategoryExists(
  supabase: SupabaseClient,
  categoryId: string,
): Promise<boolean> {
  const { data: c } = await supabase.from('blog_categories').select('id').eq('id', categoryId).maybeSingle();
  if (c) return true;
  const { data: s } = await supabase.from('blog_subcategories').select('id').eq('id', categoryId).maybeSingle();
  return !!s;
}

/** True if every id exists in blog_categories. */
export async function blogCategoryIdsExist(supabase: SupabaseClient, ids: string[]): Promise<boolean> {
  if (ids.length === 0) return true;
  const { data, error } = await supabase.from('blog_categories').select('id').in('id', ids);
  if (error || !data) return false;
  return data.length === ids.length;
}

/** True if every id exists in blog_subcategories. */
export async function blogSubcategoryIdsExist(supabase: SupabaseClient, ids: string[]): Promise<boolean> {
  if (ids.length === 0) return true;
  const { data, error } = await supabase.from('blog_subcategories').select('id').in('id', ids);
  if (error || !data) return false;
  return data.length === ids.length;
}
