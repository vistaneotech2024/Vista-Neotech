'use client';

import { usePathname } from 'next/navigation';
import { StickyHelpFooter } from '@/components/StickyHelpFooter';
import { LeadCapturePopup } from '@/components/lead/LeadCapturePopup';

/** Global conversion UI: sticky help bar + lead popup. Rendered in root layout. */
export function ConversionUI() {
  const pathname = usePathname() ?? '';
  if (pathname.startsWith('/admin') || pathname.startsWith('/secureadmin')) {
    return null;
  }

  return (
    <>
      <StickyHelpFooter />
      <LeadCapturePopup />
    </>
  );
}
