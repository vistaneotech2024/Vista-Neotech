/**
 * Ensure a value is safe to render as a React child (no objects).
 * Use for any value that might come from DB/CMS/API (e.g. meta_title, description, label).
 */

export function safeText(value: unknown): string {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return '';
}

/**
 * Safe React node: only render if value is a valid text child.
 * Returns empty string for objects so we never throw "Objects are not valid as a React child".
 * Use for any variable that might be rendered as {variable} in JSX.
 */
export function safeChild(value: unknown): string {
  return safeText(value);
}
