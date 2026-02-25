import type { Metadata } from 'next';
import { getBaseUrl } from './url-map';

const SITE_NAME = 'Vista Neotech';
const DEFAULT_DESCRIPTION =
  'Vista Neotech – MLM software developers, direct selling consultants, and technology solutions. In pursuit of excellence.';

export function siteMetadata(overrides: Partial<Metadata> = {}): Metadata {
  let base = 'https://vistaneotech.com';
  try {
    base = getBaseUrl();
  } catch {
    // URL map unavailable – use default
  }
  return {
    metadataBase: new URL(base),
    title: {
      default: `${SITE_NAME} | MLM Software & Direct Selling Consultants`,
      template: `%s | ${SITE_NAME}`,
    },
    description: DEFAULT_DESCRIPTION,
    openGraph: {
      type: 'website',
      locale: 'en_IN',
      url: base,
      siteName: SITE_NAME,
    },
    robots: { index: true, follow: true },
    ...overrides,
  };
}

export function organizationSchema() {
  let base = 'https://vistaneotech.com';
  try {
    base = getBaseUrl();
  } catch {
    // URL map unavailable
  }
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: base,
    description: DEFAULT_DESCRIPTION,
    slogan: 'In pursuit of excellence',
  };
}
