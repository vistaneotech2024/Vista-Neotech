/**
 * PostgREST / Postgres errors when subcategory tables are not migrated or not exposed to the API.
 */
export function isMissingBlogSubcategoryTablesError(
  error: { code?: string; message?: string; details?: string } | null | undefined,
): boolean {
  if (!error) return false;
  const msg = `${error.message || ''} ${error.details || ''}`.toLowerCase();
  const code = String(error.code || '');

  if (code === 'PGRST205') return true;
  if (code === '42P01') return true;

  if (msg.includes('schema cache') && msg.includes('could not find')) return true;
  if (msg.includes('does not exist')) {
    if (msg.includes('blog_subcategories')) return true;
    if (msg.includes('blog_category_subcategories')) return true;
  }
  return false;
}
