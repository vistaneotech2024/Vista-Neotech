import Link from 'next/link';
import { IconFacebook, IconInstagram, IconLinkedIn, IconMail, IconPhone, IconYouTube } from '@/components/ui/Icons';

type FooterLink = { href: string; label: string; target?: string };

const defaultServices: FooterLink[] = [
  { href: '/mlm-software', label: 'MLM Software' },
  { href: '/software-development', label: 'Software Development' },
  { href: '/direct-selling-consultant-mlm', label: 'Consultancy' },
  { href: '/seo-services', label: 'Digital Marketing' },
];

const defaultCompany: FooterLink[] = [
  { href: '/about-us', label: 'About' },
  { href: '/contact', label: 'Contact' },
  { href: '/clients', label: 'Clients' },
  { href: '/blog', label: 'Blog' },
];

export type FooterProps = {
  services?: FooterLink[];
  company?: FooterLink[];
};

export function Footer({ services: servicesProp, company: companyProp }: FooterProps = {}) {
  const services = servicesProp?.length ? servicesProp : defaultServices;
  const company = companyProp?.length ? companyProp : defaultCompany;
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-bg-muted)] tech-grid">
      <div className="container-wide py-4 md:py-6 lg:py-7">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2">
              <img
                src="/images/logo_black.png?v=20260324"
                alt="Vista Neotech"
                width={340}
                height={80}
                className="h-10 w-auto dark:hidden"
              />
              <img
                src="/images/logo_white.png?v=20260324"
                alt="Vista Neotech"
                width={340}
                height={80}
                className="hidden h-10 w-auto dark:block"
              />
            </Link>
            <p className="mt-2 max-w-sm text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
              Technology and consultancy for MLM and direct selling. In pursuit of excellence.
            </p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: 'var(--color-accent-2)' }}>
              In pursuit of excellence
            </p>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-subtle)' }}>Services</h4>
            <ul className="mt-2 space-y-1.5">
              {services.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} target={link.target} rel={link.target === '_blank' ? 'noopener noreferrer' : undefined} className="text-sm transition hover:opacity-80" style={{ color: 'var(--color-text-muted)' }}>
                    {typeof link.label === 'string' ? link.label : ''}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-subtle)' }}>Company</h4>
            <ul className="mt-2 space-y-1.5">
              {company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} target={link.target} rel={link.target === '_blank' ? 'noopener noreferrer' : undefined} className="text-sm transition hover:opacity-80" style={{ color: 'var(--color-text-muted)' }}>
                    {typeof link.label === 'string' ? link.label : ''}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-start-5 lg:text-right">
            <h4 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-subtle)' }}>Contact</h4>
            <p className="mt-2 text-sm font-semibold leading-snug" style={{ color: 'var(--color-text)' }}>
              MLM Software & MLM Consultant | Vista Neotech Pvt Ltd
            </p>
            <p className="mt-1 text-xs leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
              5th Floor, Jaina Tower 1, 517, Janakpuri District Center, Janakpuri, New Delhi, Delhi, 110058
            </p>
            <div className="mt-2 space-y-1.5 text-sm">
              <a href="mailto:info@vistaneotech.com" className="inline-flex items-center gap-2 transition hover:opacity-80" style={{ color: 'var(--color-text-muted)' }}>
                <IconMail size="sm" style={{ color: 'var(--color-accent-2)' }} />
                info@vistaneotech.com
              </a>
              <p className="text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: 'var(--color-accent-1)' }}>
                Let&apos;s talk
              </p>
              <a href="tel:+919811190082" className="inline-flex items-center gap-2 transition hover:opacity-80" style={{ color: 'var(--color-text-muted)' }}>
                <IconPhone size="sm" style={{ color: 'var(--color-accent-3)' }} />
                +91 98111 90082
              </a>
            </div>
            <div className="mt-3 flex items-center gap-2 lg:justify-end">
              <a
                href="https://www.linkedin.com/search/results/all/?keywords=Vista%20Neotech"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Vista Neotech on LinkedIn"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border transition hover:opacity-90"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-accent-2)' }}
              >
                <IconLinkedIn size="sm" />
              </a>
              <a
                href="https://www.instagram.com/explore/search/keyword/?q=Vista%20Neotech"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Vista Neotech on Instagram"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border transition hover:opacity-90"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-accent-1)' }}
              >
                <IconInstagram size="sm" />
              </a>
              <a
                href="https://www.facebook.com/search/top?q=Vista%20Neotech"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Vista Neotech on Facebook"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border transition hover:opacity-90"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-accent-2)' }}
              >
                <IconFacebook size="sm" />
              </a>
              <a
                href="https://www.youtube.com/results?search_query=Vista%20Neotech"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Vista Neotech on YouTube"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border transition hover:opacity-90"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-accent-1)' }}
              >
                <IconYouTube size="sm" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-7 flex flex-col items-center justify-between gap-2 border-t border-[var(--color-border)] pt-4 md:flex-row">
          <p className="text-xs" style={{ color: 'var(--color-text-subtle)' }}>
            © {new Date().getFullYear()} Vista Neotech Private Limited. All rights reserved.
          </p>
          <Link href="/sitemap" className="text-xs transition hover:opacity-80" style={{ color: 'var(--color-text-subtle)' }}>Sitemap</Link>
        </div>
      </div>
    </footer>
  );
}
