import { existsSync, readFileSync } from 'fs';
import { join, resolve } from 'path';

/**
 * Next.js/webpack can break `process.env.OPENAI_*` in route bundles. Dotenv's `parsed`
 * object is also unreliable here. We read `.env` / `.env.local` from disk with a small
 * parser so OPENAI_API_KEY always resolves in local dev.
 */
const OPENAI_KEY_VAR = 'OPENAI' + '_' + 'API' + '_' + 'KEY';
const OPENAI_MODEL_VAR = 'OPENAI' + '_' + 'BLOG' + '_' + 'MODEL';

function findProjectRoot(start = process.cwd()): string {
  let dir = resolve(start);
  for (let i = 0; i < 10; i++) {
    if (
      existsSync(join(dir, 'next.config.mjs')) ||
      existsSync(join(dir, 'next.config.js')) ||
      existsSync(join(dir, 'next.config.ts'))
    ) {
      return dir;
    }
    const parent = resolve(dir, '..');
    if (parent === dir) break;
    dir = parent;
  }
  return resolve(start);
}

function normalizeKey(raw: string | undefined): string {
  if (typeof raw !== 'string') return '';
  return raw.trim().replace(/^['"]+|['"]+$/g, '');
}

/** Strip UTF-8 BOM and parse KEY=value (first = only). */
function valueFromEnvFile(content: string, keyName: string): string {
  const text = content.replace(/^\uFEFF/, '');
  const lines = text.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq <= 0) continue;
    const k = trimmed.slice(0, eq).trim().replace(/^\uFEFF/, '');
    if (k !== keyName) continue;
    let v = trimmed.slice(eq + 1).trim();
    const unquoted = v.replace(/^['"]|['"]$/g, '');
    return normalizeKey(unquoted);
  }
  return '';
}

function readOpenAiFromDisk(): { key: string; model: string } {
  const root = findProjectRoot();
  let key = '';
  let model = '';

  const envPath = join(root, '.env');
  const localPath = join(root, '.env.local');

  if (existsSync(envPath)) {
    try {
      const raw = readFileSync(envPath, 'utf8');
      key = valueFromEnvFile(raw, OPENAI_KEY_VAR);
      model = valueFromEnvFile(raw, OPENAI_MODEL_VAR);
    } catch {
      /* ignore */
    }
  }

  if (existsSync(localPath)) {
    try {
      const raw = readFileSync(localPath, 'utf8');
      const k = valueFromEnvFile(raw, OPENAI_KEY_VAR);
      const m = valueFromEnvFile(raw, OPENAI_MODEL_VAR);
      if (k) key = k;
      if (m) model = m;
    } catch {
      /* ignore */
    }
  }

  return { key, model };
}

export function getOpenAiApiKey(): string {
  const fromProcess = normalizeKey(process.env[OPENAI_KEY_VAR]);
  if (fromProcess) return fromProcess;

  return readOpenAiFromDisk().key;
}

export function getOpenAiBlogModel(): string {
  const fromProcess = normalizeKey(process.env[OPENAI_MODEL_VAR]);
  if (fromProcess) return fromProcess;

  const { model } = readOpenAiFromDisk();
  return model || 'gpt-4o-mini';
}
