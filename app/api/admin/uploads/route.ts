import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

export const runtime = 'nodejs';

const MAX_BYTES = 8 * 1024 * 1024; // 8MB

function safeExt(filename: string) {
  const ext = path.extname(filename || '').toLowerCase();
  // allow common image extensions only
  if (!ext || !['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg'].includes(ext)) return '';
  return ext;
}

export async function POST(req: NextRequest) {
  await requireAdmin();

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 });
  }

  const file = form.get('file');
  const folderRaw = form.get('folder');
  const folder = typeof folderRaw === 'string' && folderRaw.trim() ? folderRaw.trim() : 'uploads';

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'file is required' }, { status: 400 });
  }

  if (typeof file.size === 'number' && file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'File too large (max 8MB)' }, { status: 400 });
  }

  const ext = safeExt(file.name);
  if (!ext) {
    return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const baseName = `${Date.now()}-${crypto.randomUUID()}`;
  const finalName = `${baseName}${ext}`;

  const publicDir = path.join(process.cwd(), 'public');
  const targetDir = path.join(publicDir, folder);
  const targetPath = path.join(targetDir, finalName);

  await mkdir(targetDir, { recursive: true });
  await writeFile(targetPath, bytes);

  const urlPath = `/${folder.replace(/^\/+/, '')}/${finalName}`;
  return NextResponse.json({ ok: true, url: urlPath });
}

