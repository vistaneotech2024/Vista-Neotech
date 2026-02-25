'use client';

import { StickyCTA } from '@/components/ui/StickyCTA';
import { LeadCapturePopup } from '@/components/lead/LeadCapturePopup';

/** Global conversion UI: sticky CTA + lead popup. Rendered in root layout. */
export function ConversionUI() {
  return (
    <>
      <StickyCTA />
      <LeadCapturePopup />
    </>
  );
}
