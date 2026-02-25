/**
 * Supabase Client Configuration
 * Optional: Use Supabase client for storage and auth features
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or Anon Key not found in environment variables');
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Get Supabase storage bucket for media
 */
export function getMediaBucket() {
  return supabase?.storage.from('media');
}

/**
 * Upload file to Supabase Storage
 */
export async function uploadToSupabaseStorage(
  file: File | Buffer,
  path: string,
  bucket: string = 'media'
) {
  if (!supabase) {
    throw new Error('Supabase client not initialized');
  }

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Get public URL for Supabase Storage file
 */
export function getSupabaseStorageUrl(path: string, bucket: string = 'media'): string {
  if (!supabase) {
    throw new Error('Supabase client not initialized');
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
