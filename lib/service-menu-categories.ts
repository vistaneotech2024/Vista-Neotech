/** Same service URLs/labels as the Header “Services” mega menu (single source of truth). */

export type ServiceMenuLink = { href: string; label: string };

export type ServiceMenuCategory = { title: string; links: ServiceMenuLink[] };

export const SERVICE_MENU_CATEGORIES: ServiceMenuCategory[] = [
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

export function getServiceMenuLinksFlat(): ServiceMenuLink[] {
  return SERVICE_MENU_CATEGORIES.flatMap((c) => c.links);
}
