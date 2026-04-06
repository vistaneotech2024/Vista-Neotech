'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { IconArrowRight } from '@/components/ui/Icons';

interface BrandCardProps {
  title: string;
  description: string;
  logo: string;
  href: string;
  externalUrl: string;
  accent: 1 | 2 | 3;
  features: string[];
  index: number;
}

function BrandCard({ title, description, logo, href, externalUrl, accent, features, index }: BrandCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const accentColor = `var(--color-accent-${accent})`;
  const accentMuted = `var(--color-accent-${accent}-muted)`;

  return (
    <div
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="relative block overflow-hidden rounded-3xl border transition-all duration-500 hover:shadow-2xl"
        style={{
          backgroundColor: 'var(--color-bg-elevated)',
          borderColor: 'var(--color-border)',
          transform: `translateY(0) scale(1)`,
          opacity: 1,
          transitionDelay: `${index * 150}ms`,
          borderLeftWidth: '4px',
          borderLeftColor: accentColor,
        }}
      >
        {/* Stretched internal link (avoid nested <a>) */}
        <Link
          href={href}
          aria-label={`Explore ${title}`}
          className="absolute inset-0 z-0"
        />

        {/* Animated gradient background */}
        <div
          className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: `linear-gradient(135deg, ${accentMuted} 0%, transparent 70%)`,
          }}
        />

        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: `${4 + i * 2}px`,
                height: `${4 + i * 2}px`,
                backgroundColor: accentColor,
                left: `${20 + i * 15}%`,
                top: `${10 + i * 12}%`,
                opacity: 0.3,
                animation: `float ${3 + i * 0.5}s ease-in-out infinite`,
                animationDelay: `${i * 0.3}s`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 p-6 md:p-7">
          {/* Logo and Badge */}
          <div className="mb-5 flex items-start justify-between">
            <div
              className="relative flex h-20 w-20 items-center justify-center rounded-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
              style={{
                backgroundColor: `color-mix(in srgb, ${accentMuted} 82%, #000 18%)`,
              }}
            >
              {logo.startsWith('http') ? (
                <img
                  src={logo}
                  alt={`${title} logo`}
                  width={80}
                  height={80}
                  className="object-contain transition-all duration-300"
                  style={{ filter: isHovered ? 'brightness(1.1)' : 'brightness(1)' }}
                />
              ) : (
                <Image
                  src={logo}
                  alt={`${title} logo`}
                  width={80}
                  height={80}
                  className="object-contain transition-all duration-300"
                  style={{ filter: isHovered ? 'brightness(1.1)' : 'brightness(1)' }}
                  unoptimized
                />
              )}
            </div>
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all duration-300 group-hover:scale-105"
              style={{
                backgroundColor: accentMuted,
                color: accentColor,
              }}
            >
              Brand {index + 1}
            </span>
          </div>

          {/* Content */}
          <h3
            className="mb-2 text-xl font-bold tracking-tight transition-colors duration-300 md:text-2xl"
            style={{ color: 'var(--color-text)' }}
          >
            {title}
          </h3>
          <p
            className="mb-5 text-sm leading-relaxed transition-colors duration-300"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {description}
          </p>

          {/* Features List */}
          <ul className="mb-6 space-y-1.5">
            {features.map((feature, i) => (
              <li
                key={i}
                className="flex items-center gap-2 text-xs transition-all duration-300"
                style={{
                  color: 'var(--color-text-muted)',
                  transform: isHovered ? `translateX(${i * 2}px)` : 'translateX(0)',
                  transitionDelay: `${i * 50}ms`,
                }}
              >
                <span className="h-1.5 w-1.5 rounded-full transition-all duration-300 group-hover:scale-150" style={{ backgroundColor: accentColor }} />
                {feature}
              </li>
            ))}
          </ul>

          {/* CTA */}
          <div className="flex items-center justify-between">
            <span
              className="inline-flex items-center gap-2 text-sm font-semibold transition-all duration-300 group-hover:gap-3"
              style={{ color: accentColor }}
            >
              Explore {title}
              <IconArrowRight
                size="sm"
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </span>
            <a
              href={externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.open(externalUrl, '_blank', 'noopener,noreferrer');
              }}
              className="text-xs font-medium opacity-60 transition-opacity hover:opacity-100"
              style={{ color: 'var(--color-text-muted)' }}
            >
              Visit Site →
            </a>
          </div>
        </div>

        {/* Shine effect on hover */}
        <div
          className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-all duration-1000 group-hover:translate-x-full group-hover:opacity-100"
          style={{ transform: isHovered ? 'translateX(100%)' : 'translateX(-100%)' }}
        />
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-20px) translateX(10px);
          }
        }
      `}</style>
    </div>
  );
}

export function BrandsSection() {
  const brands = [
    {
      title: 'AIMLM Software',
      description:
        'AI-powered MLM Software dedicated to the Direct Selling Industry. Combining cutting-edge AI technology with 25 years of Vista\'s experience to revolutionize network marketing.',
      logo: '/images/aimlmsoftware_logo.png?v=20260324',
      href: '/brands/aimlmsoftware',
      externalUrl: 'https://www.aimlmsoftware.com',
      accent: 1 as const,
      features: [
        'AI-powered compensation plans',
        'Advanced genealogy management',
        'Compliance & legal support',
        'Distributor portal & analytics',
      ],
    },
    {
      title: 'Tripgate.in',
      description:
        'Comprehensive Tours and Travels Services for B2B and B2C, MICE solutions, and API providers for Airlines, Hotels, Visas, Bus, and Activities.',
      logo: '/images/tripgate-logo.png?v=20260324',
      href: '/brands/tripgate',
      externalUrl: 'https://tripgate.in',
      accent: 2 as const,
      features: [
        'B2B & B2C travel solutions',
        'MICE event management',
        'API integration for airlines & hotels',
        'Visa & activity booking services',
      ],
    },
    {
      title: 'Verifizy',
      description:
        'KYC, Fintech automation, digital identity verification, and compliance onboarding system. API providers for PAN, Aadhar, Voter Card, Passport, and Bank Account Verification.',
      logo: '/images/verfizy.png?v=20260324',
      href: '/brands/verifizy',
      externalUrl: 'https://www.verifizy.com',
      accent: 3 as const,
      features: [
        'Digital identity verification',
        'KYC & compliance automation',
        'Multi-document verification APIs',
        'Bank account verification',
      ],
    },
    {
      title: 'MLM Union',
      description:
        'Direct selling companies and direct sellers directory platform for discovery, networking, and industry visibility.',
      logo: '/images/mlm_union (2).png?v=20260324',
      href: '/brands/mlmunion',
      externalUrl: 'https://www.mlmunion.in/',
      accent: 1 as const,
      features: [
        'Direct sellers directory',
        'Direct selling companies listing',
        'Industry networking visibility',
        'Business discovery platform',
      ],
    },
  ];

  return (
    <section
      className="section-padding relative overflow-hidden"
      style={{ backgroundColor: 'var(--color-bg)' }}
      aria-labelledby="brands-section-title"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <div
          className="absolute -right-40 -top-40 h-96 w-96 rounded-full blur-3xl"
          style={{ backgroundColor: 'var(--color-accent-1-muted)' }}
        />
        <div
          className="absolute -left-40 bottom-0 h-96 w-96 rounded-full blur-3xl"
          style={{ backgroundColor: 'var(--color-accent-3-muted)' }}
        />
      </div>

      <div className="container-wide relative z-10">
        {/* Section Header */}
        <div className="mb-12 mx-auto max-w-3xl text-center md:mb-14">
          <div className="mb-4 flex justify-center animate-fade-in-up">
            <p className="section-label mb-0">Our Brands</p>
          </div>
          <h2
            id="brands-section-title"
            className="display-3 animate-fade-in-up text-balance leading-tight"
            style={{ color: 'var(--color-text)', animationDelay: '0.08s' }}
          >
            Powering Innovation{' '}
            <span className="block sm:inline">Across Industries</span>
          </h2>
          <p
            className="mx-auto mt-5 max-w-2xl text-base leading-relaxed md:mt-6 md:text-lg"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Vista Neotech&apos;s portfolio of purpose-built brands—each platform engineered to help its industry move
            forward with reliable technology and deep domain expertise.
          </p>
        </div>

        {/* Brands Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {brands.map((brand, index) => (
            <BrandCard key={brand.href} {...brand} index={index} />
          ))}
        </div>

        {/* View All Link */}
        <div className="mt-8 text-center">
          <Link
            href="/brands"
            className="inline-flex items-center gap-2 text-sm font-semibold transition-all hover:gap-3"
            style={{ color: 'var(--color-accent-1)' }}
          >
            View all brands
            <IconArrowRight size="sm" className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
