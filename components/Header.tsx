'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';

type HeaderNavLink = { href: string; label: string; target?: string };

// Fallback nav when DB menu is unavailable
const defaultNavLinks: HeaderNavLink[] = [
  { href: '/', label: 'Home' },
  { href: '/about-us', label: 'About' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
];

// Brand links (unchanged – not from DB)
const brandLinks = [
  { href: '/brands/aimlmsoftware', label: 'AIMLM Software', external: 'https://www.aimlmsoftware.com', logo: '/images/aimlmsoftware_logo.png' },
  { href: '/brands/tripgate', label: 'Tripgate.in', external: 'https://tripgate.in', logo: '/images/tripgate-logo.png' },
  { href: '/brands/verifizy', label: 'Verifizy', external: 'https://www.verifizy.com', logo: '/images/verfizy.png' },
  { href: '/brands/mlmunion', label: 'MLM Union', external: 'https://www.mlmunion.in/', logo: '/images/mlm_union (2).png' },
];

// Service categories organized from WordPress data
const serviceCategories = [
  {
    title: 'MLM & Direct Selling',
    links: [
      { href: '/mlm-software', label: 'MLM Software' },
      { href: '/direct-selling-software', label: 'Direct Selling Software' },
      { href: '/direct-selling-consultant-mlm', label: 'Direct Selling Consultant' },
      { href: '/direct-selling-setup', label: 'Direct Selling Setup' },
      { href: '/direct-selling-registration', label: 'Direct Selling Registration' },
      { href: '/direct-selling-plans', label: 'Direct Selling Plans' },
      { href: '/direct-selling-training', label: 'Direct Selling Training' },
      { href: '/mlm-company-registration', label: 'MLM Company Registration' },
      { href: '/mlm-business-plan', label: 'MLM Business Plan' },
      { href: '/mlm-trainers-direct-selling-experts', label: 'MLM Trainers' },
    ],
  },
  {
    title: 'Software Development',
    links: [
      { href: '/software-development', label: 'Software Development' },
      { href: '/web-development-company', label: 'Web Development' },
      { href: '/android-app-development', label: 'Android App Development' },
      { href: '/ios-app-development', label: 'iOS App Development' },
      { href: '/shopping-portal-development', label: 'Shopping Portal Development' },
      { href: '/travel-portal-development', label: 'Travel Portal Development' },
      { href: '/mlm-software-development-company-in-delhi-india', label: 'MLM Software Development' },
    ],
  },
  {
    title: 'Digital Marketing',
    links: [
      { href: '/seo-services', label: 'SEO Services' },
      { href: '/sem-services', label: 'SEM Services' },
      { href: '/smo-services', label: 'SMO Services' },
      { href: '/sms-marketing', label: 'SMS Marketing' },
      { href: '/email-marketing', label: 'Email Marketing' },
      { href: '/whatsapp-marketing', label: 'WhatsApp Marketing' },
      { href: '/best-content-writing-services-delhi-ncr', label: 'Content Writing' },
    ],
  },
  {
    title: 'Design Services',
    links: [
      { href: '/graphic-designing', label: 'Graphic Designing' },
      { href: '/logo-designing', label: 'Logo Designing' },
      { href: '/web-designing-company', label: 'Web Designing' },
      { href: '/poster-designing-flyers-designers-in-delhi-ncr', label: 'Poster & Flyer Design' },
      { href: '/brochure-designing-2', label: 'Brochure Designing' },
      { href: '/corporate-identity-designing', label: 'Corporate Identity' },
      { href: '/digital-printing-services', label: 'Digital Printing' },
    ],
  },
];

export type HeaderProps = {
  /** Nav links from DB (header menu). If not provided, fallback is used. */
  navLinks?: HeaderNavLink[];
  /** Industry pages for Industries tab (DB-managed). */
  industries?: { slug: string; title: string | null }[];
};

export function Header({ navLinks: navLinksProp, industries = [] }: HeaderProps = {}) {
  const navLinks = (navLinksProp?.length ? navLinksProp : defaultNavLinks);
  const [open, setOpen] = useState(false);
  const [brandsOpen, setBrandsOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const brandsRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const [industriesOpen, setIndustriesOpen] = useState(false);
  const industriesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeAll = () => {
      setBrandsOpen(false);
      setServicesOpen(false);
      setIndustriesOpen(false);
    };

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const insideBrands = !!brandsRef.current && brandsRef.current.contains(target);
      const insideServices = !!servicesRef.current && servicesRef.current.contains(target);
      const insideIndustries = !!industriesRef.current && industriesRef.current.contains(target);
      if (!insideBrands && !insideServices && !insideIndustries) closeAll();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeAll();
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <header
      className="fixed left-0 right-0 top-0 z-50 border-b border-[var(--color-border)] backdrop-blur-xl animate-fade-in"
      style={{ backgroundColor: 'var(--color-bg-elevated)' }}
    >
      <div className="container-wide flex h-16 items-center justify-between md:h-18">
        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <img
            src="/images/logo_black.png?v=20260324"
            alt="Vista Neotech"
            width={340}
            height={80}
            className="h-16 w-auto dark:hidden"
          />
          <img
            src="/images/logo_white.png?v=20260324"
            alt="Vista Neotech"
            width={340}
            height={80}
            className="hidden h-16 w-auto dark:block"
          />
        </Link>

        <nav className="hidden md:flex md:items-center md:gap-0.5">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              target={link.target}
              rel={link.target === '_blank' ? 'noopener noreferrer' : undefined}
              className="rounded-lg px-4 py-2.5 text-sm font-medium text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-accent-1)]"
            >
              {typeof link.label === 'string' ? link.label : ''}
            </Link>
          ))}
          
          {/* Services Dropdown */}
          <div ref={servicesRef} className="relative">
            <button
              type="button"
              onClick={() => {
                setServicesOpen((v) => !v);
                setBrandsOpen(false);
                setIndustriesOpen(false);
              }}
              className="flex cursor-pointer items-center gap-1 rounded-lg px-4 py-2.5 text-sm font-medium text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-accent-1)]"
              aria-expanded={servicesOpen}
              aria-haspopup="true"
            >
              Services
              <svg
                className={`ml-1 h-4 w-4 transition-transform duration-200 ${servicesOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {servicesOpen && (
              <div
                className="absolute left-0 top-full mt-2 w-[600px] rounded-xl border shadow-xl transition-all duration-200 overflow-hidden"
                style={{
                  backgroundColor: 'var(--color-bg-elevated)',
                  borderColor: 'var(--color-border)',
                  animation: 'fadeIn 0.2s ease-out',
                }}
              >
                <div className="p-4 grid grid-cols-2 gap-4 max-h-[500px] overflow-y-auto">
                  {serviceCategories.map((category) => (
                    <div key={category.title} className="space-y-2">
                      <h4 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--color-text-subtle)' }}>
                        {typeof category.title === 'string' ? category.title : ''}
                      </h4>
                      {category.links.map((service) => (
                        <Link
                          key={service.href}
                          href={service.href}
                          className="group block rounded-lg px-3 py-2 text-sm text-[var(--color-text)] transition-colors hover:text-[var(--color-accent-1)] hover:opacity-90"
                          style={{
                            backgroundColor: 'transparent',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--color-bg-muted)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                          onClick={() => setServicesOpen(false)}
                        >
                          <div className="flex items-center justify-between">
                            <span>{typeof service.label === 'string' ? service.label : ''}</span>
                            <svg
                              className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
                <div className="border-t p-4" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-muted)' }}>
                  <Link
                    href="/mlm-software-direct-selling-consultant"
                    className="block text-center text-sm font-semibold transition hover:opacity-90"
                    style={{ color: 'var(--color-accent-1)' }}
                    onClick={() => setServicesOpen(false)}
                  >
                    View All Services →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Industries Dropdown (DB pages) */}
          {industries.length > 0 && (
            <div ref={industriesRef} className="relative">
              <button
                type="button"
                onClick={() => {
                  setIndustriesOpen((v) => !v);
                  setBrandsOpen(false);
                  setServicesOpen(false);
                }}
                className="flex cursor-pointer items-center gap-1 rounded-lg px-4 py-2.5 text-sm font-medium text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-accent-1)]"
                aria-expanded={industriesOpen}
                aria-haspopup="true"
              >
                Industries
                <svg
                  className={`ml-1 h-4 w-4 transition-transform duration-200 ${industriesOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {industriesOpen && (
                <div
                  className="absolute left-0 top-full mt-2 w-[520px] rounded-xl border shadow-xl transition-all duration-200 overflow-hidden"
                  style={{
                    backgroundColor: 'var(--color-bg-elevated)',
                    borderColor: 'var(--color-border)',
                    animation: 'fadeIn 0.2s ease-out',
                  }}
                >
                  <div className="p-4 grid gap-3 sm:grid-cols-2">
                    {industries.map((ind) => (
                      <Link
                        key={ind.slug}
                        href={`/${ind.slug}`}
                        className="block rounded-lg px-3 py-2 text-sm text-[var(--color-text)] transition-colors hover:text-[var(--color-accent-1)] hover:opacity-90"
                        style={{
                          backgroundColor: 'transparent',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--color-bg-muted)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                        onClick={() => setIndustriesOpen(false)}
                      >
                        {typeof ind.title === 'string' ? ind.title : ind.slug.replace(/-/g, ' ')}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Our Brands Dropdown */}
          <div ref={brandsRef} className="relative">
            <button
              type="button"
              onClick={() => {
                setBrandsOpen((v) => !v);
                setServicesOpen(false);
                setIndustriesOpen(false);
              }}
              className="flex cursor-pointer items-center gap-1 rounded-lg px-4 py-2.5 text-sm font-medium text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-accent-1)]"
              aria-expanded={brandsOpen}
              aria-haspopup="true"
            >
              Our Brands
              <svg
                className={`ml-1 h-4 w-4 transition-transform duration-200 ${brandsOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {brandsOpen && (
              <div
                className="absolute left-0 top-full mt-2 w-64 rounded-xl border shadow-xl transition-all duration-200"
                style={{
                  backgroundColor: 'var(--color-bg-elevated)',
                  borderColor: 'var(--color-border)',
                  animation: 'fadeIn 0.2s ease-out',
                }}
              >
                <div className="p-2">
                  {brandLinks.map((brand) => (
                    <div key={brand.href} className="group">
                      <Link
                        href={brand.href}
                        className="block rounded-lg px-4 py-3 text-sm text-[var(--color-text)] transition-colors hover:text-[var(--color-accent-1)] hover:opacity-90"
                        style={{
                          backgroundColor: 'transparent',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--color-bg-muted)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                        onClick={() => setBrandsOpen(false)}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            {brand.logo && (
                              <img
                                src={brand.logo}
                                alt={`${brand.label} logo`}
                                width={22}
                                height={22}
                                className="h-5 w-auto object-contain"
                              />
                            )}
                            <span className="font-medium">{typeof brand.label === 'string' ? brand.label : ''}</span>
                          </div>
                          <svg
                            className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </Link>
                      <a
                        href={brand.external}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block rounded-lg px-4 py-1.5 text-xs text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-accent-1)] hover:opacity-90"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Visit Site →
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/contact"
            className="hidden rounded-full px-5 py-2.5 text-sm font-semibold text-white md:inline-flex transition hover:opacity-90"
            style={{ backgroundColor: 'var(--color-accent-1)' }}
          >
            Get in touch
          </Link>
        </div>

        <button
          type="button"
          className="flex flex-col gap-1.5 p-2 md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label="Toggle menu"
          style={{ color: 'var(--color-text)' }}
        >
          <span className={`block h-0.5 w-6 rounded-full bg-current transition ${open ? 'translate-y-2 rotate-45' : ''}`} />
          <span className={`block h-0.5 w-6 rounded-full bg-current transition ${open ? 'opacity-0' : ''}`} />
          <span className={`block h-0.5 w-6 rounded-full bg-current transition ${open ? '-translate-y-2 -rotate-45' : ''}`} />
        </button>
      </div>

      {open && (
        <div
          className="border-t border-[var(--color-border)] px-4 py-6 md:hidden"
          style={{ backgroundColor: 'var(--color-bg-elevated)' }}
        >
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                target={link.target}
                rel={link.target === '_blank' ? 'noopener noreferrer' : undefined}
                className="rounded-xl px-4 py-3 text-base font-medium transition hover:opacity-80"
                style={{ color: 'var(--color-text)' }}
                onClick={() => setOpen(false)}
              >
                {typeof link.label === 'string' ? link.label : ''}
              </Link>
            ))}
            
            {/* Mobile Services Section */}
            <div className="mt-2">
              <button
                type="button"
                onClick={() => {
                  setServicesOpen((v) => !v);
                  setBrandsOpen(false);
                  setIndustriesOpen(false);
                }}
                className="w-full rounded-xl px-4 py-3 text-left text-base font-medium transition hover:opacity-80 flex items-center justify-between"
                style={{ color: 'var(--color-text)' }}
              >
                Services
                <svg
                  className={`h-5 w-5 transition-transform duration-200 ${servicesOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {servicesOpen && (
                <div className="mt-2 ml-4 space-y-2 border-l-2 pl-4 max-h-[400px] overflow-y-auto" style={{ borderColor: 'var(--color-border)' }}>
                  {serviceCategories.map((category) => (
                    <div key={category.title} className="mt-4 first:mt-0">
                      <h5 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-subtle)' }}>
                        {typeof category.title === 'string' ? category.title : ''}
                      </h5>
                      {category.links.map((service) => (
                        <Link
                          key={service.href}
                          href={service.href}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-accent-1)] hover:opacity-80"
                          onClick={() => {
                            setOpen(false);
                            setServicesOpen(false);
                          }}
                        >
                          {typeof service.label === 'string' ? service.label : ''}
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Industries Section */}
            {industries.length > 0 && (
              <div className="mt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIndustriesOpen((v) => !v);
                    setBrandsOpen(false);
                    setServicesOpen(false);
                  }}
                  className="w-full rounded-xl px-4 py-3 text-left text-base font-medium transition hover:opacity-80 flex items-center justify-between"
                  style={{ color: 'var(--color-text)' }}
                >
                  Industries
                  <svg
                    className={`h-5 w-5 transition-transform duration-200 ${industriesOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {industriesOpen && (
                  <div className="mt-2 ml-4 space-y-2 border-l-2 pl-4" style={{ borderColor: 'var(--color-border)' }}>
                    {industries.map((ind) => (
                      <Link
                        key={ind.slug}
                        href={`/${ind.slug}`}
                      className="block rounded-lg px-3 py-2 text-sm font-medium text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-accent-1)] hover:opacity-80"
                        onClick={() => {
                          setOpen(false);
                          setIndustriesOpen(false);
                        }}
                      >
                        {typeof ind.title === 'string' ? ind.title : ind.slug.replace(/-/g, ' ')}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Mobile Brands Section */}
            <div className="mt-2">
              <button
                type="button"
                onClick={() => {
                  setBrandsOpen((v) => !v);
                  setServicesOpen(false);
                  setIndustriesOpen(false);
                }}
                className="w-full rounded-xl px-4 py-3 text-left text-base font-medium transition hover:opacity-80 flex items-center justify-between"
                style={{ color: 'var(--color-text)' }}
              >
                Our Brands
                <svg
                  className={`h-5 w-5 transition-transform duration-200 ${brandsOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {brandsOpen && (
                <div className="mt-2 ml-4 space-y-2 border-l-2 pl-4" style={{ borderColor: 'var(--color-border)' }}>
                  {brandLinks.map((brand) => (
                    <div key={brand.href}>
                      <Link
                        href={brand.href}
                        className="block rounded-lg px-3 py-2 text-sm font-medium text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-accent-1)] hover:opacity-80"
                        onClick={() => {
                          setOpen(false);
                          setBrandsOpen(false);
                        }}
                      >
                        <div className="flex items-center gap-2">
                          {brand.logo && (
                            <img
                              src={brand.logo}
                              alt={`${brand.label} logo`}
                              width={20}
                              height={20}
                              className="h-5 w-auto object-contain"
                            />
                          )}
                          <span>{typeof brand.label === 'string' ? brand.label : ''}</span>
                        </div>
                      </Link>
                      <a
                        href={brand.external}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block rounded-lg px-3 py-1 text-xs text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-accent-1)] hover:opacity-80"
                        onClick={() => {
                          setOpen(false);
                          setBrandsOpen(false);
                        }}
                      >
                        Visit Site →
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/contact"
              className="mt-4 rounded-xl py-3 text-center font-semibold text-white"
              style={{ backgroundColor: 'var(--color-accent-1)' }}
              onClick={() => setOpen(false)}
            >
              Get in touch
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
