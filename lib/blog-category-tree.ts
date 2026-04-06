export type BlogCategoryRow = {
  id: string;
  name: string;
  is_active: boolean;
  created_at?: string | null;
  updated_at?: string | null;
};

export type BlogSubcategoryRow = {
  id: string;
  name: string;
  is_active: boolean;
  category_ids: string[];
  created_at?: string | null;
  updated_at?: string | null;
};

export function categorySelectOptions(
  categories: Pick<BlogCategoryRow, 'id' | 'name'>[],
  subcategories: Pick<BlogSubcategoryRow, 'id' | 'name' | 'category_ids'>[],
): { id: string; label: string }[] {
  const nameByCat = new Map(categories.map((c) => [c.id, c.name]));
  const opts: { id: string; label: string }[] = [];
  for (const c of [...categories].sort((a, b) => a.name.localeCompare(b.name))) {
    opts.push({ id: c.id, label: c.name });
  }
  for (const s of [...subcategories].sort((a, b) => a.name.localeCompare(b.name))) {
    const parents = s.category_ids
      .map((id) => nameByCat.get(id))
      .filter((n): n is string => !!n)
      .sort();
    opts.push({
      id: s.id,
      label: parents.length ? `${s.name} (${parents.join(', ')})` : s.name,
    });
  }
  return opts;
}
