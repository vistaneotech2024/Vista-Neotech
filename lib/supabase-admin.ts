/**
 * Supabase admin client for server-only writes (API routes).
 * Uses SUPABASE_SERVICE_ROLE_KEY when available.
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || null;

/** Use only the service role key; do not fall back to anon (so RLS is bypassed when used). */
export function createAdminSupabase() {
  if (!supabaseUrl || !serviceRoleKey) return null;
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });
}

