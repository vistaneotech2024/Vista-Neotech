const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isUuid(s: string): boolean {
  return UUID_RE.test(s);
}

/** Trimmed category id from top-level `categoryId` or `customFields.categoryId`. */
export function pickCategoryIdInput(body: unknown): string {
  if (!body || typeof body !== 'object') return '';
  const b = body as Record<string, unknown>;
  const top = typeof b.categoryId === 'string' ? b.categoryId.trim() : '';
  if (top) return top;
  const cf = b.customFields;
  if (cf != null && typeof cf === 'object' && !Array.isArray(cf)) {
    const id = (cf as Record<string, unknown>).categoryId;
    if (typeof id === 'string') return id.trim();
  }
  return '';
}

/**
 * Whether to set posts."Category" on update: `omit` = leave DB value unchanged;
 * `null` = clear; non-empty string = new id (must be validated).
 */
export function pickCategoryIdForUpdate(body: unknown): 'omit' | string | null {
  if (!body || typeof body !== 'object') return 'omit';
  const b = body as Record<string, unknown>;
  if ('categoryId' in b) {
    const v = b.categoryId;
    if (v === null || v === undefined) return null;
    if (typeof v === 'string') return v.trim() === '' ? null : v.trim();
    return 'omit';
  }
  const cf = b.customFields;
  if (cf != null && typeof cf === 'object' && !Array.isArray(cf) && 'categoryId' in cf) {
    const v = (cf as Record<string, unknown>).categoryId;
    if (v === null || v === undefined) return null;
    if (typeof v === 'string') return v.trim() === '' ? null : v.trim();
  }
  return 'omit';
}
