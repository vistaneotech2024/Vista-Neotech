import { NextResponse } from 'next/server';
import { z } from 'zod';
import crypto from 'crypto';
import { createAdminSupabase } from '@/lib/supabase-admin';
import { sendAdminLeadNotification, sendLeadAutoReply } from '@/lib/email';

const ContactSchema = z
  .object({
    name: z.string().min(2).max(120),
    email: z.string().email().max(200),
    phone: z.string().max(40).optional().nullable(),
    company: z.string().max(160).optional().nullable(),
    website: z.string().max(300).optional().nullable(),
    message: z.string().max(5000).optional().nullable(),
    services: z.array(z.string().min(2).max(80)).min(0).max(12),
    budgetRange: z.string().max(80).optional().nullable(),
    timeline: z.string().max(80).optional().nullable(),
    consent: z.boolean().optional(),
    source: z.enum(['contact_form', 'popup']).optional().default('contact_form'),
    hp: z.string().max(300).optional().nullable(),
    timeToSubmitMs: z.number().int().min(0).max(60 * 60 * 1000).optional().nullable(),
    pagePath: z.string().max(300).optional().nullable(),
  })
  .refine(
    (data) => {
      if (data.source === 'popup') return true;
      return (data.services?.length ?? 0) >= 1;
    },
    { message: 'Please select at least one service', path: ['services'] }
  )
  .refine(
    (data) => {
      if (data.source === 'popup') return true;
      const msg = (data.message || '').trim();
      return msg.length >= 10;
    },
    { message: 'Message must be at least 10 characters', path: ['message'] }
  );

function getClientIp(req: Request) {
  const xfwd = req.headers.get('x-forwarded-for');
  if (xfwd) return xfwd.split(',')[0]?.trim() || null;
  return req.headers.get('x-real-ip') || null;
}

function sha256(input: string) {
  return crypto.createHash('sha256').update(input).digest('hex');
}

export async function POST(req: Request) {
  const supabase = createAdminSupabase();
  if (!supabase) {
    return NextResponse.json({ ok: false, error: 'Server not configured' }, { status: 500 });
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = ContactSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: 'Validation failed', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const ip = getClientIp(req);
  const ipHash = ip ? sha256(ip) : null;
  const userAgent = req.headers.get('user-agent');
  const referrer = req.headers.get('referer');

  // Anti-bot checks (soft-block with logging, hard-block when obvious)
  const reasons: string[] = [];
  if ((data.hp || '').trim().length > 0) reasons.push('honeypot');
  if ((data.timeToSubmitMs ?? 0) > 0 && (data.timeToSubmitMs ?? 0) < 1200) reasons.push('too_fast');
  const message = (data.message || '').trim();
  if (message) {
    const links = (message.match(/https?:\/\//gi) || []).length;
    if (links >= 4) reasons.push('too_many_links');
  }

  // IP rate limit (max 5 submissions / hour)
  if (ipHash) {
    const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count } = await supabase
      .from('contact_submissions')
      .select('id', { count: 'exact', head: true })
      .eq('ip_hash', ipHash)
      .gte('created_at', since);

    if ((count ?? 0) >= 5) {
      return NextResponse.json({ ok: false, error: 'Too many requests. Try again later.' }, { status: 429 });
    }
  }

  const isBot = reasons.length > 0;
  const botReason = reasons.length ? reasons.join(',') : null;

  const insertRow: Record<string, unknown> = {
    name: data.name.trim(),
    email: data.email.trim().toLowerCase(),
    phone: (data.phone || '').trim() || null,
    company: (data.company || '').trim() || null,
    website: (data.website || '').trim() || null,
    message: message || null,
    services: data.services,
    budget_range: (data.budgetRange || '').trim() || null,
    timeline: (data.timeline || '').trim() || null,
    page_path: (data.pagePath || '').trim() || null,
    referrer: referrer || null,
    user_agent: userAgent || null,
    ip_hash: ipHash,
    time_to_submit_ms: data.timeToSubmitMs ?? null,
    honeypot: (data.hp || '').trim() || null,
    is_bot: isBot,
    bot_reason: botReason,
    status: 'new',
  };
  if (data.source) insertRow.source = data.source;

  const { error } = await supabase.from('contact_submissions').insert(insertRow);

  if (isBot) return NextResponse.json({ ok: true });

  if (error) {
    return NextResponse.json({ ok: false, error: 'Failed to submit' }, { status: 500 });
  }

  // Email notifications (fire-and-forget; do not block response)
  const leadPayload = {
    name: data.name.trim(),
    email: data.email.trim().toLowerCase(),
    phone: (data.phone || '').trim() || null,
    message: message || null,
    pagePath: (data.pagePath || '').trim() || null,
    source: data.source ?? 'contact_form',
  };
  Promise.all([
    sendAdminLeadNotification(leadPayload),
    sendLeadAutoReply(leadPayload),
  ]).catch((err) => console.error('[contact] Email send failed:', err));

  return NextResponse.json({ ok: true });
}

