import './globals.css';
import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { siteMetadata } from '@/lib/seo';
import { organizationSchema } from '@/lib/seo';
import { CRITICAL_CSS } from '@/lib/critical-css';
import { ThemeProvider } from '@/lib/theme-context';
import dynamic from 'next/dynamic';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { getHeaderNavLinks, getFooterMenu } from '@/lib/cms/menus';

const ConversionUI = dynamic(() => import('@/components/ConversionUI').then((m) => ({ default: m.ConversionUI })), {
  ssr: false,
});
import { getIndustryPages } from '@/lib/cms/pages-db';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-primary',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = siteMetadata();

const themeScript = `(function(){var t=localStorage.getItem('vista-theme');var d=window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',t==='dark'||(t!=='light'&&d));})();`;

function RootLayoutShell({
  children,
  headerNavLinks,
  footerMenu,
  industryPages,
  schema,
}: {
  children: React.ReactNode;
  headerNavLinks: Awaited<ReturnType<typeof getHeaderNavLinks>>;
  footerMenu: Awaited<ReturnType<typeof getFooterMenu>>;
  industryPages: Awaited<ReturnType<typeof getIndustryPages>>;
  schema: ReturnType<typeof organizationSchema>;
}) {
  return (
    <html lang="en" className={plusJakarta.variable} suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style dangerouslySetInnerHTML={{ __html: CRITICAL_CSS }} />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen flex flex-col font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
        <ThemeProvider>
          <Header navLinks={headerNavLinks} industries={industryPages} />
          <main className="flex-1" style={{ color: 'var(--color-text)' }}>{children}</main>
          <Footer services={footerMenu.services} company={footerMenu.company} />
          <ConversionUI />
        </ThemeProvider>
      </body>
    </html>
  );
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let headerNavLinks: Awaited<ReturnType<typeof getHeaderNavLinks>> = [];
  let footerMenu: Awaited<ReturnType<typeof getFooterMenu>> = { services: [], company: [] };
  let industryPages: Awaited<ReturnType<typeof getIndustryPages>> = [];
  try {
    const [nav, footer, industries] = await Promise.all([
      getHeaderNavLinks(),
      getFooterMenu(),
      getIndustryPages(),
    ]);
    headerNavLinks = nav;
    footerMenu = footer;
    industryPages = industries;
  } catch (_) {
    // CMS/Supabase unavailable – Header/Footer have built-in fallbacks
  }

  const schema = organizationSchema();

  try {
    return (
      <RootLayoutShell
        headerNavLinks={headerNavLinks}
        footerMenu={footerMenu}
        industryPages={industryPages}
        schema={schema}
      >
        {children}
      </RootLayoutShell>
    );
  } catch {
    return (
      <html lang="en" suppressHydrationWarning>
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Vista Neotech</title>
          <style dangerouslySetInnerHTML={{ __html: CRITICAL_CSS }} />
        </head>
        <body style={{ margin: 0, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: 'system-ui, sans-serif', background: 'var(--color-bg)', color: 'var(--color-text)' }}>
          <p style={{ marginBottom: 16 }}>Something went wrong. Refresh the page to try again.</p>
          <a href="/" style={{ padding: '12px 24px', fontSize: 14, fontWeight: 600, color: '#fff', background: 'var(--color-accent-1)', border: 'none', borderRadius: 9999, cursor: 'pointer', textDecoration: 'none' }}>Go to home</a>
        </body>
      </html>
    );
  }
}
