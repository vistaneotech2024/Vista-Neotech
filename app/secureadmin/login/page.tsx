'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('info@vistaneotech.com');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error'>('idle');
  const [error, setError] = useState('');
  const params = useSearchParams();
  const router = useRouter();
  const next = params.get('next') || '/admin';

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('submitting');
    setError('');
    try {
      const res = await fetch('/api/secureadmin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, next }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || 'Login failed');
      }
      router.push(next);
    } catch (err: any) {
      setStatus('error');
      setError(err?.message || 'Login failed');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="w-full max-w-md rounded-3xl border p-8 shadow-lg" style={{ backgroundColor: 'var(--color-bg-elevated)', borderColor: 'var(--color-border)' }}>
        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
          Secure Admin Login
        </h1>
        <p className="text-sm mb-6" style={{ color: 'var(--color-text-muted)' }}>
          Enter your admin credentials to manage pages, blog, menus, and leads.
        </p>
        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-2"
              style={{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>Password</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-2"
              style={{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            />
          </label>
          {status === 'error' && (
            <p className="text-sm rounded-2xl border px-3 py-2" style={{ color: 'var(--color-accent-1)', borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-muted)' }}>
              {error || 'Login failed. Please check your credentials.'}
            </p>
          )}
          <button
            type="submit"
            className="w-full rounded-full px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            style={{ backgroundColor: 'var(--color-accent-1)' }}
          >
            {status === 'submitting' ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}

