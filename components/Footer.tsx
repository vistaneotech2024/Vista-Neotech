import Link from 'next/link';

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
      <div className="container-wide section-padding">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="text-2xl font-bold" style={{ color: 'var(--color-accent-1)' }}>Vista</span>
              <span className="text-2xl font-semibold" style={{ color: 'var(--color-text)' }}>Neotech</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
              Technology and consultancy for MLM and direct selling. In pursuit of excellence.
            </p>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: 'var(--color-accent-2)' }}>
              In pursuit of excellence
            </p>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-subtle)' }}>Services</h4>
            <ul className="mt-4 space-y-3">
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
            <ul className="mt-4 space-y-3">
              {company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} target={link.target} rel={link.target === '_blank' ? 'noopener noreferrer' : undefined} className="text-sm transition hover:opacity-80" style={{ color: 'var(--color-text-muted)' }}>
                    {typeof link.label === 'string' ? link.label : ''}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-[var(--color-border)] pt-8 md:flex-row">
          <p className="text-xs" style={{ color: 'var(--color-text-subtle)' }}>
            © {new Date().getFullYear()} Vista Neotech Private Limited. All rights reserved.
          </p>
          <Link href="/sitemap" className="text-xs transition hover:opacity-80" style={{ color: 'var(--color-text-subtle)' }}>Sitemap</Link>
        </div>
      </div>
    </footer>
  );
}
