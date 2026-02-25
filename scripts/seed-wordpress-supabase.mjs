/**
 * Seed WordPress data into Supabase via REST API
 * Run with: node scripts/seed-wordpress-supabase.mjs
 * Requires: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const raw = readFileSync(join(root, 'URL_MIGRATION_MAP.json'), 'utf-8');
const { preserved } = JSON.parse(raw);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const adminId = 'b6ed5246-29b1-472d-bdf0-e7e9dddf87b5';

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY/NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

function esc(s) {
  if (s == null || s === '') return null;
  return String(s).replace(/%%title%%|%%page%%|%%sep%%|%%sitename%%|%%primary_category%%/g, '').trim() || null;
}

async function seedPages() {
  const pages = preserved.filter((p) => p.content_type === 'page');
  console.log(`Inserting ${pages.length} pages...`);
  let ok = 0,
    err = 0;
  for (const p of pages) {
    const slug = (p.slug || p.old_url.replace(/^\//, '').replace(/\/$/, '')).trim();
    const row = {
      slug,
      title: esc(p.meta_title) || slug.replace(/-/g, ' '),
      content: null,
      excerpt: esc(p.meta_description) ? esc(p.meta_description).substring(0, 500) : null,
      status: 'published',
      content_type: 'page',
      wordpress_id: p.post_id || null,
      wordpress_url: p.old_url || null,
      meta_title: esc(p.meta_title),
      meta_description: esc(p.meta_description),
      focus_keyword: esc(p.focus_keyword),
      canonical_url: esc(p.canonical_url) || (p.old_url ? `https://vistaneotech.com${p.old_url}` : null),
      og_title: esc(p.og_title) || esc(p.meta_title),
      og_description: esc(p.og_description) || esc(p.meta_description),
      og_image: esc(p.og_image),
      author_id: adminId,
      published_at: new Date().toISOString(),
      version: 1,
    };
    const { error } = await supabase.from('pages').upsert(row, { onConflict: 'slug' });
    if (error) {
      err++;
      if (err <= 3) console.error('Page error:', slug, error.message);
    } else ok++;
  }
  console.log(`Pages: ${ok} ok, ${err} errors`);
}

async function seedPosts() {
  const posts = preserved.filter((p) => p.content_type === 'post');
  console.log(`Inserting ${posts.length} posts...`);
  let ok = 0,
    err = 0;
  for (const p of posts) {
    const slug = (p.slug || p.old_url.replace(/^\//, '').replace(/\/$/, '')).trim();
    const row = {
      slug,
      title: esc(p.meta_title) || slug.replace(/-/g, ' '),
      content: null,
      excerpt: esc(p.meta_description) ? esc(p.meta_description).substring(0, 500) : null,
      status: 'published',
      content_type: 'post',
      wordpress_id: p.post_id || null,
      wordpress_url: p.old_url || null,
      meta_title: esc(p.meta_title),
      meta_description: esc(p.meta_description),
      focus_keyword: esc(p.focus_keyword),
      canonical_url: esc(p.canonical_url) || (p.old_url ? `https://vistaneotech.com${p.old_url}` : null),
      og_title: esc(p.og_title) || esc(p.meta_title),
      og_description: esc(p.og_description) || esc(p.meta_description),
      og_image: esc(p.og_image),
      author_id: adminId,
      published_at: new Date().toISOString(),
      version: 1,
    };
    const { error } = await supabase.from('posts').upsert(row, { onConflict: 'slug' });
    if (error) {
      err++;
      if (err <= 3) console.error('Post error:', slug, error.message);
    } else ok++;
  }
  console.log(`Posts: ${ok} ok, ${err} errors`);
}

async function seedRedirects() {
  console.log(`Inserting ${preserved.length} redirects...`);
  let ok = 0,
    err = 0;
  for (const p of preserved) {
    const source = (p.old_url || '').replace(/\/$/, '') || '/';
    const dest = (p.new_url || p.old_url || '').replace(/\/$/, '') || '/';
    const { error } = await supabase.from('redirects').upsert(
      { source_url: source, destination_url: dest, redirect_type: 301, status: 'active' },
      { onConflict: 'source_url' }
    );
    if (error) {
      err++;
      if (err <= 3) console.error('Redirect error:', source, error.message);
    } else ok++;
  }
  console.log(`Redirects: ${ok} ok, ${err} errors`);
}

(async () => {
  console.log('Seeding WordPress data into Supabase...\n');
  await seedPages();
  await seedPosts();
  await seedRedirects();
  console.log('\nDone.');
})();
