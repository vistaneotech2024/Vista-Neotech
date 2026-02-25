import Link from 'next/link';

type ServiceCardProps = {
  title: string;
  description: string;
  href: string;
  stat?: string;
  accent?: 'orange' | 'cyan' | 'green';
};

const accentStyles = {
  orange: 'bg-primary-orange/10 text-primary-orange group-hover:bg-primary-orange group-hover:text-white',
  cyan: 'bg-accent-cyan/10 text-accent-cyan group-hover:bg-accent-cyan group-hover:text-white',
  green: 'bg-accent-green/10 text-accent-green group-hover:bg-accent-green group-hover:text-white',
};

export function ServiceCard({ title, description, href, stat, accent = 'orange' }: ServiceCardProps) {
  return (
    <Link
      href={href}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-neutral-light/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-xl md:p-8"
    >
      {stat && (
        <div className="absolute right-4 top-4 text-3xl font-bold text-neutral-light md:text-4xl">{stat}</div>
      )}
      <div
        className={`inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-xl transition-colors duration-300 ${accentStyles[accent]}`}
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </div>
      <h3 className="mt-5 text-xl font-bold text-neutral-charcoal">{title}</h3>
      <p className="mt-2 flex-1 text-sm text-neutral-charcoal/80">{description}</p>
      <span className="mt-4 inline-flex items-center text-sm font-medium text-primary-orange group-hover:underline">
        Explore
        <svg className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </span>
    </Link>
  );
}
