/**
 * Bulk copy blog cover images into local /public and save relative URLs on posts/blog_posts.
 *
 * Expects url.xlsx with columns: "Slug", "Image Name" (optional: "URL Name").
 * Images live in the same folder as the spreadsheet or under --dir.
 *
 * Prerequisites:
 * - .env.local/.env: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 *
 * Usage:
 *   npx tsx scripts/bulk-upload-blog-post-images.ts --dir "C:\path\to\vista_neotech_all_post" --xlsx "C:\path\to\url.xlsx"
 *   npx tsx scripts/bulk-upload-blog-post-images.ts --dry-run --dir "..." --xlsx "..."
 *
 * Env overrides:
 *   BLOG_POSTS_TABLE=blog_posts (default; use posts for your current schema)
 *   LOCAL_IMAGE_PREFIX=/blog/covers (default; URL path under /public)
 *   DB_IMAGE_PREFIX=\public\blog\covers (default; path saved in DB)
 */

import * as fs from 'fs';
import * as path from 'path';
import { createClient } from '@supabase/supabase-js';
import * as XLSX from 'xlsx';
import { config } from 'dotenv';

const root = path.join(__dirname, '..');
// Force override so stale shell env vars (often empty) don't mask .env values.
config({ path: path.join(root, '.env.local'), override: true });
config({ path: path.join(root, '.env'), override: true });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || '';

const TABLE = process.env.BLOG_POSTS_TABLE || 'blog_posts';
const LOCAL_PREFIX = (process.env.LOCAL_IMAGE_PREFIX || '/blog/covers').replace(/\/+$/, '');
const DB_PREFIX_RAW = process.env.DB_IMAGE_PREFIX || '\\public\\blog\\covers';

type Row = {
  Slug?: string;
  'Image Name'?: string;
  'URL Name'?: string;
};

function parseArgs() {
  const argv = process.argv.slice(2);
  const out: { dir?: string; xlsx?: string; dryRun: boolean; table?: string } = { dryRun: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--dry-run') out.dryRun = true;
    else if (a === '--dir' && argv[i + 1]) {
      out.dir = argv[++i];
    } else if (a === '--xlsx' && argv[i + 1]) {
      out.xlsx = argv[++i];
    } else if (a === '--table' && argv[i + 1]) {
      out.table = argv[++i];
    }
  }
  return out;
}

function contentTypeForFile(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  const map: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
  };
  return map[ext] || 'application/octet-stream';
}

/** Match DB slug when Excel has URL-encoded or Unicode hyphen variants. */
function normalizeSlug(raw: string): string {
  let t = raw.trim();
  if (!t) return t;
  try {
    if (t.includes('%')) t = decodeURIComponent(t);
  } catch {
    /* ignore */
  }
  return t.replace(/[\u2010\u2011\u2012\u2013\u2014\u2212]/g, '-');
}

function sanitizePathSegment(slug: string): string {
  return slug
    .trim()
    .replace(/^\/+|\/+$/g, '')
    .replace(/[/\\]+/g, '-')
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Resolve image file: exact path, then case-insensitive match in dir (helps Windows vs Excel casing). */
function resolveImageFile(imagesDir: string, imageName: string): string | null {
  const want = imageName.trim();
  if (!want) return null;
  const direct = path.join(imagesDir, want);
  if (fs.existsSync(direct)) return direct;
  let entries: string[] = [];
  try {
    entries = fs.readdirSync(imagesDir);
  } catch {
    return null;
  }
  const lower = want.toLowerCase();
  const hit = entries.find((e) => e.toLowerCase() === lower);
  if (hit) return path.join(imagesDir, hit);
  return null;
}

function ensureLeadingSlash(p: string): string {
  return p.startsWith('/') ? p : `/${p}`;
}

function toPublicFsPath(relativeUrlPath: string): string {
  const clean = relativeUrlPath.replace(/^\/+/, '');
  return path.join(root, 'public', clean);
}

function toPosixPath(p: string): string {
  return p.replace(/\\/g, '/');
}

function toWindowsPath(p: string): string {
  return p.replace(/\//g, '\\');
}

async function main() {
  const { dir, xlsx: xlsxPath, dryRun, table: tableArg } = parseArgs();
  const tableName = tableArg || TABLE;

  if (!dryRun && (!supabaseUrl || !serviceKey)) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local (or .env)');
    process.exit(1);
  }

  if (!dir || !xlsxPath) {
    console.error(
      'Usage: npx tsx scripts/bulk-upload-blog-post-images.ts --dir <images_folder> --xlsx <url.xlsx> [--dry-run] [--table blog_posts]'
    );
    process.exit(1);
  }

  const imagesDir = path.resolve(dir);
  const excelPath = path.resolve(xlsxPath);

  if (!fs.existsSync(excelPath)) {
    console.error('Excel not found:', excelPath);
    process.exit(1);
  }
  if (!fs.existsSync(imagesDir)) {
    console.error('Images folder not found:', imagesDir);
    process.exit(1);
  }

  const wb = XLSX.readFile(excelPath);
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<Row>(sheet);
  if (rows.length === 0) {
    console.error('No rows in spreadsheet.');
    process.exit(1);
  }

  const supabase = supabaseUrl && serviceKey
    ? createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } })
    : null;

  let ok = 0;
  let skipped = 0;
  const errors: string[] = [];
  const normalizedTable = tableName.toLowerCase();

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const slugRaw = typeof row.Slug === 'string' ? row.Slug : '';
    const imageName = typeof row['Image Name'] === 'string' ? row['Image Name'] : '';
    const slug = normalizeSlug(slugRaw);
    if (!slug || !imageName.trim()) {
      skipped++;
      continue;
    }

    const localPath = resolveImageFile(imagesDir, imageName);
    if (!localPath) {
      errors.push(`Row ${i + 2}: file not found for "${imageName}" (slug ${slug})`);
      skipped++;
      continue;
    }

    const ext = path.extname(localPath) || '.jpg';
    const localFileName = `${sanitizePathSegment(slug)}${ext}`;
    const relativeUrlPath = ensureLeadingSlash(`${LOCAL_PREFIX}/${localFileName}`);
    const publicTargetPath = toPublicFsPath(relativeUrlPath);

    const body = fs.readFileSync(localPath);
    const dbPrefix = toWindowsPath(DB_PREFIX_RAW).replace(/\\+$/, '');
    const relativeDbPath = `${dbPrefix}\\${localFileName}`;
    const contentType = contentTypeForFile(localPath);

    if (dryRun) {
      console.log(`[dry-run] ${slug} -> ${relativeDbPath} (public: ${toPosixPath(relativeUrlPath)}) (${(body.length / 1024).toFixed(1)} KB, ${contentType})`);
      ok++;
      continue;
    }

    if (!supabase) {
      errors.push('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY for DB update');
      break;
    }

    fs.mkdirSync(path.dirname(publicTargetPath), { recursive: true });
    fs.copyFileSync(localPath, publicTargetPath);

    const updatePayload: Record<string, string> = {
      image_url: relativeDbPath,
      updated_at: new Date().toISOString(),
    };
    if (normalizedTable === 'posts') {
      updatePayload.og_image = relativeDbPath;
    } else {
      updatePayload.cover_image = relativeDbPath;
    }

    const { data: updated, error: dbErr } = await supabase
      .from(tableName)
      .update(updatePayload)
      .eq('slug', slug)
      .select('id');

    if (dbErr) {
      errors.push(`Row ${i + 2} DB update failed (${slug}): ${dbErr.message}`);
      skipped++;
      continue;
    }

    if (!updated || updated.length === 0) {
      errors.push(`Row ${i + 2}: no ${tableName} row with slug "${slug}" (copied to ${relativeDbPath})`);
      skipped++;
      continue;
    }

    console.log(`OK ${slug} -> ${relativeDbPath}`);
    ok++;
  }

  console.log('\n---');
  console.log(`Done. Updated rows: ${ok}, skipped/errors: ${skipped}`);
  if (errors.length) {
    console.log('\nIssues:');
    for (const e of errors) console.log(' -', e);
    process.exitCode = 1;
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
