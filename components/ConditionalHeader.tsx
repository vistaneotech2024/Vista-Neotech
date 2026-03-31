'use client';

import { usePathname } from 'next/navigation';
import { Header, type HeaderProps } from '@/components/Header';

export function ConditionalHeader(props: HeaderProps) {
  const pathname = usePathname();

  if (pathname?.startsWith('/admin')) return null;

  return <Header {...props} />;
}

