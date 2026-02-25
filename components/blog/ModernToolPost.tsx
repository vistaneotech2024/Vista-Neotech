import Link from 'next/link';
import type { ReactNode } from 'react';
import {
  IconChart,
  IconRocket,
  IconShield,
  IconGlobe,
  IconSparkles,
  IconHeadset,
  IconCpu,
  IconCode,
  IconBriefcase,
} from '@/components/ui/Icons';

type ToolItem = {
  id: string;
  title: string;
  icon: ReactNode;
  summary: string;
};

function stripTags(input: string) {
  return input.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/&amp;/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function estimateReadingMinutes(html: string) {
  const words = stripTags(html).split(' ').filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

function extractH2(html: string): { raw: string; text: string }[] {
  const out: { raw: string; text: string }[] = [];
  const re = /<h2\b[^>]*>([\s\S]*?)<\/h2>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    const rawInner = m[1] ?? '';
    const text = stripTags(rawInner);
    if (text) out.push({ raw: rawInner, text });
  }
  return out;
}

function injectH2Ids(html: string) {
  const seen = new Map<string, number>();
  return html.replace(/<h2\b([^>]*)>([\s\S]*?)<\/h2>/gi, (full, attrs, inner) => {
    if (/\bid\s*=/.test(String(attrs))) return full;
    const text = stripTags(String(inner));
    if (!text) return full;
    let base = slugify(text);
    if (!base) return full;
    const n = (seen.get(base) ?? 0) + 1;
    seen.set(base, n);
    const id = n === 1 ? base : `${base}-${n}`;
    return `<h2${attrs} id="${id}">${inner}</h2>`;
  });
}

function pickIcon(title: string) {
  const t = title.toLowerCase();
  if (t.includes('crm')) return <IconBriefcase size="md" />;
  if (t.includes('genealogy') || t.includes('downline') || t.includes('tree')) return <IconGlobe size="md" />;
  if (t.includes('commission') || t.includes('payout') || t.includes('wallet')) return <IconChart size="md" />;
  if (t.includes('security') || t.includes('fraud') || t.includes('compliance')) return <IconShield size="md" />;
  if (t.includes('analytics') || t.includes('report')) return <IconChart size="md" />;
  if (t.includes('mobile') || t.includes('app')) return <IconCpu size="md" />;
  if (t.includes('support') || t.includes('help')) return <IconHeadset size="md" />;
  if (t.includes('automation') || t.includes('ai')) return <IconSparkles size="md" />;
  if (t.includes('integration') || t.includes('api')) return <IconCode size="md" />;
  return <IconRocket size="md" />;
}

function summarize(title: string) {
  const t = title.toLowerCase();
  if (t.includes('crm')) return 'Track leads, nurture relationships, and improve retention.';
  if (t.includes('genealogy') || t.includes('downline') || t.includes('tree')) return 'Visualize networks, manage levels, and keep growth transparent.';
  if (t.includes('commission') || t.includes('payout') || t.includes('wallet')) return 'Automate payouts, reduce errors, and build trust at scale.';
  if (t.includes('analytics') || t.includes('report')) return 'Monitor KPIs, spot bottlenecks, and take faster decisions.';
  if (t.includes('security') || t.includes('fraud') || t.includes('compliance')) return 'Protect data, enforce rules, and prevent misuse.';
  if (t.includes('mobile') || t.includes('app')) return 'Enable on-the-go operations for distributors and admins.';
  if (t.includes('training')) return 'Onboard faster with structured learning and progress tracking.';
  if (t.includes('integration') || t.includes('api')) return 'Connect payments, e-commerce, SMS/WhatsApp, and more.';
  return 'A core capability that improves speed, clarity, and scale.';
}

function buildTools(html: string): ToolItem[] {
  return extractH2(html).map((h) => {
    const id = slugify(h.text);
    return {
      id,
      title: h.text,
      icon: pickIcon(h.text),
      summary: summarize(h.text),
    };
  });
}

function ToolEcosystemGraphic({ tools }: { tools: ToolItem[] }) {
  const nodes = tools.slice(0, 8);
  const center = { x: 160, y: 160 };
  const r = 110;
  return (
    <svg viewBox="0 0 320 320" className="w-full h-auto" role="img" aria-label="MLM tool ecosystem diagram">
      <defs>
        <radialGradient id="g" cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="var(--color-accent-1-muted)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <circle cx={center.x} cy={center.y} r="150" fill="url(#g)" />
      {nodes.map((n, i) => {
        const a = (Math.PI * 2 * i) / nodes.length - Math.PI / 2;
        const x = center.x + r * Math.cos(a);
        const y = center.y + r * Math.sin(a);
        return (
          <g key={n.id}>
            <line x1={center.x} y1={center.y} x2={x} y2={y} stroke="var(--color-border)" strokeWidth="2" opacity="0.7" />
            <circle cx={x} cy={y} r="22" fill="var(--color-bg-elevated)" stroke="var(--color-border)" strokeWidth="2" />
          </g>
        );
      })}
      <circle cx={center.x} cy={center.y} r="44" fill="var(--color-bg-elevated)" stroke="var(--color-border)" strokeWidth="2" />
      <text x={center.x} y={center.y - 4} textAnchor="middle" fontSize="12" fill="var(--color-text)" fontWeight="700">
        MLM
      </text>
      <text x={center.x} y={center.y + 14} textAnchor="middle" fontSize="11" fill="var(--color-text-muted)">
        Platform
      </text>
    </svg>
  );
}

export function ModernToolPost({
  title,
  description,
  html,
  canonicalUrl,
  publishedAt,
  focusKeyword,
}: {
  title: string;
  description: string;
  html: string;
  canonicalUrl: string;
  publishedAt?: string | null;
  focusKeyword?: string | null;
}) {
  const contentWithIds = injectH2Ids(html);
  const tools = buildTools(html);
  const minutes = estimateReadingMinutes(html);

  const faqs = [
    {
      q: 'Which MLM tools matter most for growth?',
      a: 'Start with CRM + genealogy + commission engine. Then add analytics, security/compliance, and automation as your network scales.',
    },
    {
      q: 'How do tools improve distributor trust?',
      a: 'Accurate commissions, transparent genealogy, real-time dashboards, and consistent notifications reduce disputes and improve retention.',
    },
    {
      q: 'Do I need separate software for each tool?',
      a: 'Not necessarily. A unified MLM platform can combine these tools into one ecosystem with shared data, roles, and reporting.',
    },
    {
      q: 'How should I choose an MLM software vendor?',
      a: 'Evaluate security, scalability, plan accuracy, reporting depth, integrations (payment/SMS/WhatsApp), and post-launch support.',
    },
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <article className="section-padding pt-24 relative overflow-hidden" style={{ backgroundColor: 'var(--color-hero-bg)' }}>
        <div className="absolute inset-0 overflow-hidden opacity-30">
          <div
            className="absolute -right-40 -top-40 h-96 w-96 rounded-full blur-3xl"
            style={{ backgroundColor: 'var(--color-accent-1-muted)' }}
          />
          <div
            className="absolute -left-40 bottom-0 h-96 w-96 rounded-full blur-3xl"
            style={{ backgroundColor: 'var(--color-accent-2-muted)' }}
          />
        </div>

        <div className="container-tight relative z-10">
          <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm" aria-label="Breadcrumb">
            <Link href="/" className="transition hover:opacity-80" style={{ color: 'var(--color-text-muted)' }}>
              Home
            </Link>
            <span style={{ color: 'var(--color-text-muted)' }}>/</span>
            <Link href="/blog" className="transition hover:opacity-80" style={{ color: 'var(--color-text-muted)' }}>
              Blog
            </Link>
            <span style={{ color: 'var(--color-text-muted)' }}>/</span>
            <span style={{ color: 'var(--color-text)' }}>{title}</span>
          </nav>

          <div className="flex flex-wrap items-center gap-2 mb-5">
            <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold" style={{ backgroundColor: 'var(--color-accent-1-muted)', color: 'var(--color-accent-1)' }}>
              Playbook
            </span>
            <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold" style={{ backgroundColor: 'var(--color-bg-muted)', color: 'var(--color-text-muted)' }}>
              {minutes} min read
            </span>
            {focusKeyword && (
              <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold" style={{ backgroundColor: 'var(--color-accent-3-muted)', color: 'var(--color-accent-3)' }}>
                {focusKeyword}
              </span>
            )}
          </div>

          <h1 className="display-1 mb-4 max-w-4xl" style={{ color: 'var(--color-hero-text)' }}>
            {title}
          </h1>
          <p className="prose-lead max-w-3xl" style={{ color: 'var(--color-hero-text-muted)' }}>
            {description}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full px-7 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              style={{ backgroundColor: 'var(--color-accent-1)' }}
            >
              Get a Free Demo
            </Link>
            <Link
              href="/mlm-software"
              className="inline-flex items-center justify-center rounded-full px-7 py-3 text-sm font-semibold transition hover:opacity-90 border"
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-hero-text)' }}
            >
              Explore MLM Platform
            </Link>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border p-6" style={{ backgroundColor: 'var(--color-bg-elevated)', borderColor: 'var(--color-border)' }}>
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-subtle)' }}>
                Tool ecosystem (visual)
              </p>
              <div className="mt-4">
                <ToolEcosystemGraphic tools={tools} />
              </div>
              <p className="mt-4 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                A single platform works best when these tools share the same data and reporting layer.
              </p>
            </div>

            <div className="rounded-3xl border p-6" style={{ backgroundColor: 'var(--color-bg-elevated)', borderColor: 'var(--color-border)' }}>
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-subtle)' }}>
                At a glance
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {tools.slice(0, 6).map((t) => (
                  <Link
                    key={t.id}
                    href={`#${t.id}`}
                    className="group rounded-2xl border p-4 transition hover:-translate-y-0.5 hover:shadow-lg"
                    style={{ borderColor: 'var(--color-border)' }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5" style={{ color: 'var(--color-accent-1)' }}>
                        {t.icon}
                      </div>
                      <div>
                        <p className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
                          {t.title.replace(/^\d+\.\s*/, '')}
                        </p>
                        <p className="mt-1 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                          {t.summary}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-3 text-xs" style={{ color: 'var(--color-text-subtle)' }}>
                {publishedAt && <span>Published: {new Date(publishedAt).toLocaleDateString()}</span>}
                <span>Canonical: <code className="rounded px-2 py-1" style={{ backgroundColor: 'var(--color-bg-muted)' }}>{canonicalUrl}</code></span>
              </div>
            </div>
          </div>
        </div>
      </article>

      <section className="section-padding" style={{ backgroundColor: 'var(--color-bg)' }}>
        <div className="container-wide">
          <div className="grid gap-10 lg:grid-cols-12">
            {/* Sticky TOC */}
            <aside className="lg:col-span-4 lg:sticky lg:top-24 h-fit">
              <div className="rounded-3xl border p-6" style={{ backgroundColor: 'var(--color-bg-elevated)', borderColor: 'var(--color-border)' }}>
                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-subtle)' }}>
                  Table of contents
                </p>
                <ol className="mt-4 space-y-2">
                  {tools.map((t) => (
                    <li key={t.id}>
                      <Link
                        href={`#${t.id}`}
                        className="block rounded-xl px-3 py-2 text-sm transition hover:opacity-90"
                        style={{ color: 'var(--color-text-muted)' }}
                      >
                        {t.title}
                      </Link>
                    </li>
                  ))}
                </ol>
                <div className="mt-6 rounded-2xl p-4" style={{ backgroundColor: 'var(--color-bg-muted)' }}>
                  <p className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
                    Want this as one platform?
                  </p>
                  <p className="mt-1 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                    We can bundle these tools into a single, scalable MLM ecosystem.
                  </p>
                  <Link
                    href="/contact"
                    className="mt-3 inline-flex w-full items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
                    style={{ backgroundColor: 'var(--color-accent-1)' }}
                  >
                    Talk to an Expert
                  </Link>
                </div>
              </div>
            </aside>

            {/* Main content */}
            <div className="lg:col-span-8">
              <div className="rounded-3xl border p-7 md:p-10" style={{ backgroundColor: 'var(--color-bg-elevated)', borderColor: 'var(--color-border)' }}>
                <div className="prose prose-lg max-w-none" style={{ color: 'var(--color-text)' }}>
                  <div dangerouslySetInnerHTML={{ __html: contentWithIds }} />
                </div>
              </div>

              <section className="mt-10 rounded-3xl border p-7 md:p-10" style={{ backgroundColor: 'var(--color-bg-muted)', borderColor: 'var(--color-border)' }}>
                <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>FAQs</h2>
                <div className="mt-6 grid gap-4">
                  {faqs.map((f) => (
                    <details key={f.q} className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--color-bg-elevated)', borderColor: 'var(--color-border)' }}>
                      <summary className="cursor-pointer text-base font-semibold" style={{ color: 'var(--color-text)' }}>
                        {f.q}
                      </summary>
                      <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                        {f.a}
                      </p>
                    </details>
                  ))}
                </div>
              </section>

              <section className="mt-10 grid gap-4 md:grid-cols-2">
                <div className="rounded-3xl border p-7" style={{ backgroundColor: 'var(--color-bg-elevated)', borderColor: 'var(--color-border)' }}>
                  <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-subtle)' }}>Next step</p>
                  <h3 className="mt-2 text-xl font-bold" style={{ color: 'var(--color-text)' }}>Get a tailored tool-stack</h3>
                  <p className="mt-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                    Tell us your compensation plan + scale, and we’ll recommend the right modules and integrations.
                  </p>
                  <Link href="/contact" className="mt-4 inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-semibold text-white transition hover:opacity-90" style={{ backgroundColor: 'var(--color-accent-1)' }}>
                    Request Recommendation
                  </Link>
                </div>
                <div className="rounded-3xl border p-7" style={{ backgroundColor: 'var(--color-bg-elevated)', borderColor: 'var(--color-border)' }}>
                  <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-subtle)' }}>Explore</p>
                  <h3 className="mt-2 text-xl font-bold" style={{ color: 'var(--color-text)' }}>MLM Software & Consulting</h3>
                  <p className="mt-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                    See our platform capabilities, security posture, and service coverage.
                  </p>
                  <Link href="/mlm-software" className="mt-4 inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-semibold transition hover:opacity-90 border" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}>
                    View MLM Software
                  </Link>
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

