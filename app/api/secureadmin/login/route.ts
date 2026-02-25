import { NextRequest, NextResponse } from 'next/server';
import { authenticateAdmin, createAdminSession } from '@/lib/admin-auth';

export async function POST(req: NextRequest) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const password = typeof body.password === 'string' ? body.password : '';
  const next = typeof body.next === 'string' && body.next.startsWith('/') ? body.next : '/admin';

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
  }

  const user = await authenticateAdmin(email, password);
  if (!user) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  await createAdminSession(user);
  return NextResponse.json({ ok: true, redirectTo: next });
}

