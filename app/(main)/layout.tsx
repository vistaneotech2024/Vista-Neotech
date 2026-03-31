import { Suspense } from 'react';
import { DotsLoaderBlock } from '@/components/ui/DotsLoader';

/**
 * Main content layout – wraps pages in Suspense so the shell (header/footer)
 * and critical CSS stay visible while page content loads or streams.
 * Loading fallback uses design tokens from critical CSS so it's always visible.
 */
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<DotsLoaderBlock minHeight="50vh" />}>{children}</Suspense>
  );
}
