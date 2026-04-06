import { isUuid } from '@/lib/parse-blog-category-id';

/** Stored in posts.custom_fields (JSON arrays of UUID strings). */
export const BLOG_CF_CATEGORY_IDS = 'blog_category_ids';
export const BLOG_CF_SUBCATEGORY_IDS = 'blog_subcategory_ids';

export function normalizeUuidList(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return Array.from(new Set(raw.map((x) => String(x).trim()).filter((id) => isUuid(id))));
}

export function readUuidListFromCustomFields(
  cf: Record<string, unknown> | null | undefined,
  key: string,
): string[] {
  if (!cf || typeof cf !== 'object') return [];
  const v = cf[key];
  return normalizeUuidList(v);
}

export function mergeTaxonomyIntoCustomFields(
  base: Record<string, unknown>,
  categoryIds: string[],
  subcategoryIds: string[],
  categoryDisplayLabel: string,
): Record<string, unknown> {
  const out = { ...base };
  out[BLOG_CF_CATEGORY_IDS] = categoryIds;
  out[BLOG_CF_SUBCATEGORY_IDS] = subcategoryIds;
  if (categoryDisplayLabel) {
    out.category = categoryDisplayLabel;
  }
  delete out.categoryId;
  return out;
}

/** Legacy `posts."Category"` single id: prefer first category, then first subcategory. */
export function primaryCategoryColumn(categoryIds: string[], subcategoryIds: string[]): string | null {
  if (categoryIds.length > 0) return categoryIds[0];
  if (subcategoryIds.length > 0) return subcategoryIds[0];
  return null;
}

export function pickTaxonomyIdsFromBody(body: unknown): {
  categoryIds: string[];
  subcategoryIds: string[];
} {
  if (!body || typeof body !== 'object') {
    return { categoryIds: [], subcategoryIds: [] };
  }
  const b = body as Record<string, unknown>;
  let categoryIds = normalizeUuidList(b.categoryIds);
  let subcategoryIds = normalizeUuidList(b.subcategoryIds);

  if (categoryIds.length === 0 && subcategoryIds.length === 0) {
    const legacy = typeof b.categoryId === 'string' ? b.categoryId.trim() : '';
    if (legacy && isUuid(legacy)) {
      categoryIds = [legacy];
    }
  }

  return { categoryIds, subcategoryIds };
}
