import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import crypto from 'crypto';
import { createAdminSupabase } from '@/lib/supabase-admin';

const SESSION_COOKIE = 'vista_admin_session';

export type AdminUser = {
  id: string;
  email: string;
  role: string;
  display_name: string | null;
};

export async function authenticateAdmin(email: string, password: string): Promise<AdminUser | null> {
  const supabase = createAdminSupabase();
  if (!supabase) return null;

  const normalizedEmail = email.trim().toLowerCase();

  const { data: user } = await supabase
    .from('users')
    .select('id, email, password, role, status, display_name')
    .eq('email', normalizedEmail)
    .eq('status', 'active')
    .limit(1)
    .maybeSingle();

  if (!user) return null;
  if (!['super_admin', 'admin', 'editor'].includes(user.role)) return null;

  if (user.password !== password) return null;

  // best-effort: do not block login if this fails
  await supabase
    .from('users')
    .update({ last_login_at: new Date().toISOString(), updated_at: new Date().toISOString() })
    .eq('id', user.id);

  return {
    id: user.id,
    email: user.email,
    role: user.role,
    display_name: user.display_name ?? null,
  };
}

export async function createAdminSession(user: AdminUser) {
  const supabase = createAdminSupabase();
  if (!supabase) return;

  const token = crypto.randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24h

  const hdrs = headers();
  const ip = hdrs.get('x-forwarded-for')?.split(',')[0]?.trim() || hdrs.get('x-real-ip') || null;
  const ua = hdrs.get('user-agent');

  await supabase.from('user_sessions').insert({
    user_id: user.id,
    token,
    expires_at: expires.toISOString(),
    ip_address: ip,
    user_agent: ua,
  });

  const cookieStore = cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires,
  });
}

export async function getCurrentAdmin(): Promise<AdminUser | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const supabase = createAdminSupabase();
  if (!supabase) return null;

  const nowIso = new Date().toISOString();
  const { data: session } = await supabase
    .from('user_sessions')
    .select('id, user_id, expires_at')
    .eq('token', token)
    .gt('expires_at', nowIso)
    .maybeSingle();

  if (!session) return null;

  const { data: user } = await supabase
    .from('users')
    .select('id, email, role, display_name')
    .eq('id', session.user_id)
    .maybeSingle();

  if (!user) return null;
  if (!['super_admin', 'admin', 'editor'].includes(user.role)) return null;

  return {
    id: user.id,
    email: user.email,
    role: user.role,
    display_name: user.display_name ?? null,
  };
}

export async function requireAdmin(): Promise<AdminUser> {
  const user = await getCurrentAdmin();
  if (!user) {
    redirect('/secureadmin/login');
  }
  return user;
}

export function logoutAdmin() {
  const cookieStore = cookies();
  cookieStore.set(SESSION_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}

