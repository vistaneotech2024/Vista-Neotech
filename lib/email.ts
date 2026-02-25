/**
 * Lead notification emails.
 * Uses Resend API (https://resend.com) when RESEND_API_KEY is set.
 * Set ADMIN_EMAIL and LEAD_FROM_EMAIL in env for admin notification and auto-reply from address.
 */

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'Vista Neotech';

export type LeadPayload = {
  name: string;
  email: string;
  phone?: string | null;
  message?: string | null;
  pagePath?: string | null;
  source?: string;
};

async function sendResend(params: {
  to: string;
  subject: string;
  html: string;
  from: string;
}) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { ok: false as const, skip: true };

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      from: params.from,
      to: [params.to],
      subject: params.subject,
      html: params.html,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('[email] Resend error:', res.status, err);
    return { ok: false as const, skip: false };
  }
  return { ok: true as const };
}

/** Admin notification when a new lead is received. */
export async function sendAdminLeadNotification(lead: LeadPayload): Promise<{ ok: boolean; skip?: boolean }> {
  const adminEmail = process.env.ADMIN_EMAIL;
  const fromEmail = process.env.LEAD_FROM_EMAIL || process.env.ADMIN_EMAIL || `noreply@${typeof window === 'undefined' ? process.env.NEXT_PUBLIC_SITE_URL?.replace(/^https?:\/\//, '').replace(/\/$/, '') || 'vistaneotech.com' : 'vistaneotech.com'}`;

  if (!adminEmail) return { ok: false, skip: true };

  const subject = `New Lead Received – ${SITE_NAME}`;
  const html = `
    <div style="font-family: system-ui, sans-serif; max-width: 560px;">
      <h2 style="margin: 0 0 16px;">New lead</h2>
      <table style="border-collapse: collapse; width: 100%;">
        <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Name</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${escapeHtml(lead.name)}</td></tr>
        <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Email</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${escapeHtml(lead.email)}</td></tr>
        <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Mobile</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${escapeHtml(lead.phone || '—')}</td></tr>
        <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Message</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${escapeHtml(lead.message || '—')}</td></tr>
        <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Page URL</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${escapeHtml(lead.pagePath || '—')}</td></tr>
        <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Source</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${escapeHtml(lead.source || 'contact_form')}</td></tr>
        <tr><td style="padding: 8px 0;"><strong>Timestamp</strong></td><td style="padding: 8px 0;">${new Date().toISOString()}</td></tr>
      </table>
      <p style="margin-top: 24px; color: #666; font-size: 14px;">This is an automated notification from ${SITE_NAME}.</p>
    </div>
  `;

  return sendResend({
    from: fromEmail,
    to: adminEmail,
    subject,
    html,
  });
}

/** Auto-reply to the lead. */
export async function sendLeadAutoReply(lead: LeadPayload): Promise<{ ok: boolean; skip?: boolean }> {
  const fromEmail = process.env.LEAD_FROM_EMAIL || process.env.ADMIN_EMAIL;
  if (!fromEmail) return { ok: false, skip: true };

  const subject = `Thank you for reaching out – ${SITE_NAME}`;
  const html = `
    <div style="font-family: system-ui, sans-serif; max-width: 560px;">
      <p>Hi ${escapeHtml(lead.name)},</p>
      <p>Thank you for getting in touch. We've received your message and will respond shortly.</p>
      <p>If your matter is urgent, you can reply to this email or call us.</p>
      <p>Best regards,<br><strong>${SITE_NAME}</strong></p>
    </div>
  `;

  return sendResend({
    from: fromEmail,
    to: lead.email,
    subject,
    html,
  });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
