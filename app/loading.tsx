import { DotsLoaderBlock } from '@/components/ui/DotsLoader';

/**
 * Root loading UI – shows a designed loading state (not only plain text)
 * so design is visible while the page/route loads.
 */
export default function Loading() {
  return <DotsLoaderBlock minHeight="60vh" />;
}
