import { PHASE_DEVELOPMENT_SERVER } from "next/constants.js";

/** @type {(phase: string) => import('next').NextConfig} */
const nextConfig = (phase) => ({
  // Keep dev and build outputs separate on Windows to avoid file-lock EPERM issues.
  distDir: phase === PHASE_DEVELOPMENT_SERVER ? ".next-dev" : ".next",
  reactStrictMode: true,
  trailingSlash: false,
  // WordPress/origin images: same URLs for SEO, Next optimizes (WebP, quality) without losing detail
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'vistaneotech.com', pathname: '/**' },
      { protocol: 'https', hostname: 'www.vistaneotech.com', pathname: '/**' },
      { protocol: 'http', hostname: 'vistaneotech.com', pathname: '/**' },
      { protocol: 'http', hostname: 'www.vistaneotech.com', pathname: '/**' },
      { protocol: 'https', hostname: 'tbctgfdcjhyoijmvwiku.supabase.co', pathname: '/storage/v1/object/public/**' },
    ],
  },
  experimental: {
    // Fix: avoid "Cannot find module './vendor-chunks/@supabase.js'" – keep Supabase out of server bundle
    serverComponentsExternalPackages: ['@supabase/supabase-js'],
  },
  async redirects() {
    // Redirect /blog/{slug} to /{slug} for blog posts to match WordPress exactly
    // This preserves SEO while allowing both URL patterns to work
    return [
      {
        source: '/blog/goals-achievement-in-mlm',
        destination: '/goals-achievement-in-mlm',
        permanent: true, // 301 redirect for SEO
      },
      {
        source: '/blog/how-training-is-important-in-direct-selling',
        destination: '/how-training-is-important-in-direct-selling',
        permanent: true,
      },
      {
        source: '/blog/tips-for-selecting-unique-products-direct-selling',
        destination: '/tips-for-selecting-unique-products-direct-selling',
        permanent: true,
      },
      {
        source: '/blog/how-to-start-mlm-company-in-india',
        destination: '/how-to-start-mlm-company-in-india',
        permanent: true,
      },
      {
        source: '/blog/direct-selling-landmarks',
        destination: '/direct-selling-landmarks',
        permanent: true,
      },
      {
        source: '/blog/is-direct-selling-a-sunrise-business-concept',
        destination: '/is-direct-selling-a-sunrise-business-concept',
        permanent: true,
      },
      {
        source: '/blog/how-to-choose-right-mlm-product-in-the-times-of-pandemics',
        destination: '/how-to-choose-right-mlm-product-in-the-times-of-pandemics',
        permanent: true,
      },
      {
        source: '/blog/how-direct-selling-mlm-works',
        destination: '/how-direct-selling-mlm-works',
        permanent: true,
      },
      {
        source: '/blog/direct-selling-business-future-after-covid-19-or-corona-pandamic',
        destination: '/direct-selling-business-future-after-covid-19-or-corona-pandamic',
        permanent: true,
      },
      {
        source: '/blog/direct-selling-product-is-the-key-to-the-success-of-network-marketing',
        destination: '/direct-selling-product-is-the-key-to-the-success-of-network-marketing',
        permanent: true,
      },
      {
        source: '/blog/how-to-achieve-success-in-mlm-network-marketing',
        destination: '/how-to-achieve-success-in-mlm-network-marketing',
        permanent: true,
      },
      {
        source: '/blog/how-to-select-mlm-plan-for-direct-selling',
        destination: '/how-to-select-mlm-plan-for-direct-selling',
        permanent: true,
      },
      {
        source: '/blog/why-we-are-the-best-mlm-consultants-for-network-marketing',
        destination: '/why-we-are-the-best-mlm-consultants-for-network-marketing',
        permanent: true,
      },
      {
        source: '/blog/is-service-sector-the-new-big-idea-in-mlm',
        destination: '/is-service-sector-the-new-big-idea-in-mlm',
        permanent: true,
      },
      {
        source: '/blog/mlm-software',
        destination: '/mlm-software-blog',
        permanent: true,
      },
      {
        source: '/blog/how-to-promote-mlm-with-social-media-marketing',
        destination: '/how-to-promote-mlm-with-social-media-marketing',
        permanent: true,
      },
      {
        source: '/blog/direct-selling-future',
        destination: '/direct-selling-future',
        permanent: true,
      },
      {
        source: '/blog/how-to-choose-the-best-mlm-company',
        destination: '/how-to-choose-the-best-mlm-company',
        permanent: true,
      },
      {
        source: '/blog/how-to-choose-best-products-for-mlm-network-marketing',
        destination: '/how-to-choose-best-products-for-mlm-network-marketing',
        permanent: true,
      },
      {
        source: '/blog/how-to-start-mlm-business-in-india',
        destination: '/how-to-start-mlm-business-in-india',
        permanent: true,
      },
      {
        source: '/blog/what-are-the-key-features-of-mlm-software',
        destination: '/what-are-the-key-features-of-mlm-software',
        permanent: true,
      },
      {
        source: '/blog/how-choose-the-best-mlm-software',
        destination: '/how-choose-the-best-mlm-software',
        permanent: true,
      },
      {
        source: '/blog/multi-level-marketing-and-its-future-in-india',
        destination: '/multi-level-marketing-and-its-future-in-india',
        permanent: true,
      },
      {
        source: '/blog/how-can-you-best-lead-your-team-in-multi-level-marketing',
        destination: '/how-can-you-best-lead-your-team-in-multi-level-marketing',
        permanent: true,
      },
      {
        source: '/blog/how-to-choose-the-right-mlm-software-developer',
        destination: '/how-to-choose-the-right-mlm-software-developer',
        permanent: true,
      },
      {
        source: '/blog/top-10-network-marketing-companies-in-india-for-2022',
        destination: '/top-10-network-marketing-companies-in-india-for-2022',
        permanent: true,
      },
      {
        source: '/blog/achieve-financial-freedom-with-network-marketing',
        destination: '/achieve-financial-freedom-with-network-marketing',
        permanent: true,
      },
      {
        source: '/blog/good-network-marketer-here-are-the-5-skills',
        destination: '/good-network-marketer-here-are-the-5-skills',
        permanent: true,
      },
      {
        source: '/blog/affiliate-marketing-vs-mlm',
        destination: '/affiliate-marketing-vs-mlm',
        permanent: true,
      },
      {
        source: '/blog/success-in-network-marketing-with-vista-neotech-private-limited-as-your-trusted-mlm-consultant',
        destination: '/success-in-network-marketing-with-vista-neotech-private-limited-as-your-trusted-mlm-consultant',
        permanent: true,
      },
      {
        source: '/blog/future-of-mlm-software-experience-the-power-of-ai-bi-and-ci',
        destination: '/future-of-mlm-software-experience-the-power-of-ai-bi-and-ci',
        permanent: true,
      },
      {
        source: '/blog/mlm-software-to-grow-10x-faster-by-vista-neotech',
        destination: '/mlm-software-to-grow-10x-faster-by-vista-neotech',
        permanent: true,
      },
      {
        source: '/blog/direct-selling-a-revolution-in-making',
        destination: '/direct-selling-a-revolution-in-making',
        permanent: true,
      },
      {
        source: '/blog/growth-in-direct-selling-a-visionary-outlook-for-2024',
        destination: '/growth-in-direct-selling-a-visionary-outlook-for-2024',
        permanent: true,
      },
      {
        source: '/blog/success-in-direct-selling-through-social-selling-strategies-by-the-year-2024',
        destination: '/success-in-direct-selling-through-social-selling-strategies-by-the-year-2024',
        permanent: true,
      },
      {
        source: '/blog/best-mlm-software-development-by-vista-neotech-in-delhi-ncr',
        destination: '/best-mlm-software-development-by-vista-neotech-in-delhi-ncr',
        permanent: true,
      },
      {
        source: '/blog/success-of-direct-selling-companies-with-value-driven-marketing',
        destination: '/success-of-direct-selling-companies-with-value-driven-marketing',
        permanent: true,
      },
      {
        source: '/blog/mlm-software-with-sales-tracking-tools-by-vista-neotech',
        destination: '/mlm-software-with-sales-tracking-tools-by-vista-neotech',
        permanent: true,
      },
      {
        source: '/blog/multi-level-marketing-mlm-software-a-tool-to-success',
        destination: '/multi-level-marketing-mlm-software-a-tool-to-success',
        permanent: true,
      },
      {
        source: '/blog/direct-selling-software-revolution-with-vista-neotech-2024s-latest-tech-trends',
        destination: '/direct-selling-software-revolution-with-vista-neotech-2024s-latest-tech-trends',
        permanent: true,
      },
      {
        source: '/blog/top-10-mlm-companies-in-2025-your-ultimate-guide',
        destination: '/top-10-mlm-companies-in-2025-your-ultimate-guide',
        permanent: true,
      },
      {
        source: '/blog/network-marketing-in-india-2025-a-brighter-future-with-vista-neotech-pvt-ltd',
        destination: '/network-marketing-in-india-2025-a-brighter-future-with-vista-neotech-pvt-ltd',
        permanent: true,
      },
      {
        source: '/blog/the-benefits-of-ai-powered-mlm-software-for-business-success-in-2025',
        destination: '/the-benefits-of-ai-powered-mlm-software-for-business-success-in-2025',
        permanent: true,
      },
      {
        source: '/blog/direct-selling-in-2025-top-15-mlm-trends',
        destination: '/direct-selling-in-2025-top-15-mlm-trends',
        permanent: true,
      },
      {
        source: '/blog/top-mlm-consulting-ideas-for-2025',
        destination: '/top-mlm-consulting-ideas-for-2025',
        permanent: true,
      },
      {
        source: '/blog/understanding-mlm-plans-a-guide-to-mlm-business',
        destination: '/understanding-mlm-plans-a-guide-to-mlm-business',
        permanent: true,
      },
      {
        source: '/blog/best-mlm-products-for-mlm-business-in-2025',
        destination: '/best-mlm-products-for-mlm-business-in-2025',
        permanent: true,
      },
      {
        source: '/blog/17-smart-tech-tools-for-mlm-business-in-2025',
        destination: '/17-smart-tech-tools-for-mlm-business-in-2025',
        permanent: true,
      },
      {
        source: '/blog/future-proof-your-mlm-business-with-software-tools-for-2025',
        destination: '/future-proof-your-mlm-business-with-software-tools-for-2025',
        permanent: true,
      },
      {
        source: '/blog/how-to-enter-the-direct-selling-market-in-india',
        destination: '/how-to-enter-the-direct-selling-market-in-india',
        permanent: true,
      },
      {
        source: '/blog/why-multi-level-marketing-mlm-consultancy-matters',
        destination: '/why-multi-level-marketing-mlm-consultancy-matters',
        permanent: true,
      },
      {
        source: '/blog/how-to-enter-direct%e2%80%90selling-market-in-india-as-foreign-directors',
        destination: '/how-to-enter-direct-selling-market-in-india-as-foreign-directors',
        permanent: true,
      },
      {
        source: '/blog/low-cost-mlm-software',
        destination: '/low-cost-mlm-software',
        permanent: true,
      },
      {
        source: '/blog/is-mlm-legal-in-india',
        destination: '/is-mlm-legal-in-india',
        permanent: true,
      },
      {
        source: '/blog/why-direct-selling-industry-continues-to-thrive-in-the-21st-century',
        destination: '/why-direct-selling-industry-continues-to-thrive-in-the-21st-century',
        permanent: true,
      },
      {
        source: '/blog/software-development-company',
        destination: '/software-development-company-blog',
        permanent: true,
      },
      {
        source: '/blog/multilevel-marketing-mlm-software-development',
        destination: '/multilevel-marketing-mlm-software-development',
        permanent: true,
      },
      {
        source: '/blog/top-mlm-network-marketing-software-tools',
        destination: '/top-mlm-network-marketing-software-tools',
        permanent: true,
      },
      {
        source: '/blog/best-mlm-software-development-empower-your-mlm-business-with-vista-neotech',
        destination: '/best-mlm-software-development-empower-your-mlm-business-with-vista-neotech',
        permanent: true,
      },
      {
        source: '/blog/next-gen-mlm-software-solutions-empowering-mlm-business-growth',
        destination: '/next-gen-mlm-software-solutions-empowering-mlm-business-growth',
        permanent: true,
      },
      {
        source: '/blog/ultimate-guide-to-mlm-compensation-plans-powered-by-vista-neotech-pvt-ltd',
        destination: '/ultimate-guide-to-mlm-compensation-plans-powered-by-vista-neotech-pvt-ltd',
        permanent: true,
      },
      {
        source: '/blog/top-mlm-business-mistakes-that-stop-growth',
        destination: '/top-mlm-business-mistakes-that-stop-growth',
        permanent: true,
      },
      {
        source: '/blog/top10-questions-you-must-ask-as-an-mlm-business-leader',
        destination: '/top10-questions-you-must-ask-as-an-mlm-business-leader',
        permanent: true,
      },
      {
        source: '/blog/direct-selling-software-the-importance-of-data-security',
        destination: '/direct-selling-software-the-importance-of-data-security',
        permanent: true,
      },
      {
        source: '/blog/how-mlm-genealogy-tree-management-strengthens-your-mlm-software',
        destination: '/how-mlm-genealogy-tree-management-strengthens-your-mlm-software',
        permanent: true,
      },
      {
        source: '/blog/best-marketing-plans-for-mlm',
        destination: '/best-marketing-plans-for-mlm',
        permanent: true,
      },
    ];
  },
});

export default nextConfig;
