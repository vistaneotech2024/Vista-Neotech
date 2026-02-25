/**
 * Backfill post and page content into Supabase from WordPress export.
 * Keeps slugs and SEO unchanged; only updates content (and optionally excerpt).
 *
 * Usage:
 *   node scripts/backfill-post-content.mjs [path-to-json-or-csv]
 *   node scripts/backfill-post-content.mjs scripts/audit/wordpress-urls.csv   # backfill both posts and pages
 *
 * CSV: from WordPress export with post_type, post_name, post_content. Updates both posts and pages tables.
 * JSON format (array of): { "slug": "...", "content": "HTML or text", "excerpt": "optional", "type": "post"|"page" }
 * If type omitted in JSON, only posts table is updated (backward compatible).
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY/NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

function loadFromJson(path) {
  const raw = readFileSync(path, 'utf-8');
  const data = JSON.parse(raw);
  return Array.isArray(data) ? data : [data];
}

async function backfillFromJson(jsonPath) {
  const items = loadFromJson(jsonPath);
  let postOk = 0, postErr = 0, pageOk = 0, pageErr = 0, skip = 0;
  for (const item of items) {
    const slug = item.slug || item.post_name;
    const content = item.content ?? item.post_content ?? null;
    const excerpt = item.excerpt ?? item.post_excerpt ?? null;
    const type = (item.type || item.post_type || 'post').toLowerCase();
    if (!slug || content == null) {
      skip++;
      continue;
    }
    const update = { content: String(content).trim() || null };
    if (excerpt != null) update.excerpt = String(excerpt).trim().substring(0, 500) || null;
    const table = type === 'page' ? 'pages' : 'posts';
    const { error } = await supabase.from(table).update(update).eq('slug', slug).select('id').maybeSingle();
    if (error) {
      if (table === 'posts') postErr++;
      else pageErr++;
      if (postErr + pageErr <= 5) console.error('Update error:', table, slug, error.message);
    } else {
      if (table === 'posts') postOk++;
      else pageOk++;
    }
  }
  console.log(`JSON backfill: posts ${postOk} updated (${postErr} errors), pages ${pageOk} updated (${pageErr} errors), ${skip} skipped.`);
}

async function backfillFromCsv(csvPath) {
  let parseSync;
  try {
    const mod = await import('csv-parse/sync');
    parseSync = mod.parse;
  } catch (e) {
    console.error('To backfill from CSV install csv-parse: npm i -D csv-parse');
    console.error('Or provide a JSON file: node scripts/backfill-post-content.mjs scripts/data/wordpress-posts-content.json');
    process.exit(1);
  }
  const raw = readFileSync(csvPath, 'utf-8');
  const rows = parseSync(raw, { columns: true, relax_column_count: true, bom: true });

  const posts = rows.filter((r) => r.post_type === 'post' && (r.post_status === 'publish' || r.post_status === 'inherit'));
  const pages = rows.filter((r) => r.post_type === 'page' && r.post_status === 'publish');

  let postOk = 0, postErr = 0;
  for (const row of posts) {
    const slug = (row.post_name || '').trim();
    const content = (row.post_content || '').trim();
    if (!slug) continue;
    const update = { content: content || null };
    if (row.post_excerpt) update.excerpt = String(row.post_excerpt).trim().substring(0, 500) || null;
    const { error } = await supabase.from('posts').update(update).eq('slug', slug).select('id').maybeSingle();
    if (error) {
      postErr++;
      if (postErr <= 3) console.error('Post update error:', slug, error.message);
    } else postOk++;
  }

  let pageOk = 0, pageErr = 0;
  for (const row of pages) {
    const slug = (row.post_name || '').trim();
    const content = (row.post_content || '').trim();
    if (!slug) continue;
    const update = { content: content || null };
    if (row.post_excerpt) update.excerpt = String(row.post_excerpt).trim().substring(0, 500) || null;
    const { error } = await supabase.from('pages').update(update).eq('slug', slug).select('id').maybeSingle();
    if (error) {
      pageErr++;
      if (pageErr <= 3) console.error('Page update error:', slug, error.message);
    } else pageOk++;
  }

  console.log(`CSV backfill: posts ${postOk} updated (${postErr} errors), pages ${pageOk} updated (${pageErr} errors).`);
}

(async () => {
  const input = process.argv[2];
  if (input) {
    const path = join(process.cwd(), input);
    if (!existsSync(path)) {
      console.error('File not found:', path);
      process.exit(1);
    }
    if (path.endsWith('.csv')) {
      await backfillFromCsv(path);
    } else {
      await backfillFromJson(path);
    }
  } else {
    const defaultCsv = join(root, 'scripts', 'audit', 'wordpress-urls.csv');
    if (existsSync(defaultCsv)) {
      await backfillFromCsv(defaultCsv);
    } else {
      console.error('Usage: node scripts/backfill-post-content.mjs <path-to-json-or-csv>');
      console.error('  JSON: [{ "slug": "...", "content": "...", "excerpt": "..." }]');
      console.error('  Or place wordpress-urls.csv at scripts/audit/ and run without args.');
      process.exit(1);
    }
  }
})();
