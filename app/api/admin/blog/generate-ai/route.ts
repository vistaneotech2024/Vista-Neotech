import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { getOpenAiApiKey, getOpenAiBlogModel } from '@/lib/openai-server-env';

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';

const MAX_BRIEF_LEN = 2000;

type GeneratedBlog = {
  title: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  focusKeyword: string;
  content: string;
};

function slugify(input: string): string {
  return String(input || '')
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function parseGenerated(raw: unknown): GeneratedBlog | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const title = typeof o.title === 'string' ? o.title.trim() : '';
  const content = typeof o.content === 'string' ? o.content.trim() : '';
  if (!title || !content) return null;

  const slugRaw = typeof o.slug === 'string' ? o.slug.trim() : '';
  const slug = slugify(slugRaw || title);

  return {
    title,
    slug,
    metaTitle: typeof o.metaTitle === 'string' ? o.metaTitle.trim() : '',
    metaDescription: typeof o.metaDescription === 'string' ? o.metaDescription.trim() : '',
    focusKeyword: typeof o.focusKeyword === 'string' ? o.focusKeyword.trim() : '',
    content,
  };
}

export async function POST(req: NextRequest) {
  await requireAdmin();

  const apiKey = getOpenAiApiKey();
  if (!apiKey) {
    return NextResponse.json(
      { error: 'OpenAI is not configured. Set OPENAI_API_KEY in your environment.' },
      { status: 503 }
    );
  }

  const model = getOpenAiBlogModel();

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const b = body as Record<string, unknown>;
  const briefTitle = typeof b.briefTitle === 'string' ? b.briefTitle.trim() : '';
  const briefDescription = typeof b.briefDescription === 'string' ? b.briefDescription.trim() : '';

  if (!briefTitle) {
    return NextResponse.json({ error: 'Brief title is required' }, { status: 400 });
  }
  if (briefTitle.length > MAX_BRIEF_LEN || briefDescription.length > MAX_BRIEF_LEN) {
    return NextResponse.json({ error: 'Brief fields are too long' }, { status: 400 });
  }

  const userPrompt = `Write a full blog post based on this brief.

Topic / working title: ${briefTitle}

Additional direction from the author:
${briefDescription || '(No extra details — infer a sensible angle.)'}

Return a single JSON object with exactly these string keys (no markdown code fences, no extra keys):
- "title": final polished headline for the article
- "slug": URL slug (lowercase, a-z 0-9 and hyphens only, no leading/trailing hyphens)
- "metaTitle": SEO title, roughly 50–60 characters when possible
- "metaDescription": meta description, roughly 150–160 characters when possible
- "focusKeyword": one primary keyword phrase for SEO
- "content": the article body as HTML only (no <!DOCTYPE>, no <html>, no <body>). Use semantic tags: <p>, <h2>, <h3>, <ul>, <li>, <strong>, <em>, <a href="..."> where useful. Aim for thorough, helpful B2B-style content (about 800–1500 words) unless the brief clearly calls for something shorter.`;

  const openaiRes = await fetch(OPENAI_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content:
            'You are an expert B2B content writer for software, MLM, direct selling, and network marketing topics. You output only valid JSON objects as requested, with no markdown wrapping.',
        },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 8192,
    }),
  });

  const openaiJson = await openaiRes.json().catch(() => null);

  if (!openaiRes.ok) {
    const msg =
      openaiJson && typeof openaiJson === 'object' && openaiJson !== null && 'error' in openaiJson
        ? String((openaiJson as { error?: { message?: string } }).error?.message || 'OpenAI request failed')
        : 'OpenAI request failed';
    return NextResponse.json({ error: msg }, { status: 502 });
  }

  const content =
    openaiJson &&
    typeof openaiJson === 'object' &&
    Array.isArray((openaiJson as { choices?: unknown }).choices) &&
    (openaiJson as { choices: { message?: { content?: string } }[] }).choices[0]?.message?.content;

  if (typeof content !== 'string' || !content.trim()) {
    return NextResponse.json({ error: 'Empty response from AI' }, { status: 502 });
  }

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(content.trim());
  } catch {
    return NextResponse.json({ error: 'AI returned invalid JSON' }, { status: 502 });
  }

  const generated = parseGenerated(parsedJson);
  if (!generated) {
    return NextResponse.json({ error: 'AI response missing title or content' }, { status: 502 });
  }

  return NextResponse.json({ ok: true, ...generated });
}
