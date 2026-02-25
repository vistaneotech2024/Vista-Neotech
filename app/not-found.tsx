import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-4"
      style={{
        background: 'var(--color-bg)',
        color: 'var(--color-text)',
      }}
    >
      <h1 className="text-2xl font-bold md:text-3xl">Page not found</h1>
      <p className="text-center text-sm" style={{ color: 'var(--color-text-muted)' }}>
        The page you’re looking for doesn’t exist or has been moved.
      </p>
      <Link
        href="/"
        className="rounded-full px-6 py-3 text-sm font-semibold text-white"
        style={{ backgroundColor: 'var(--color-accent-1)' }}
      >
        Back to home
      </Link>
    </div>
  );
}
