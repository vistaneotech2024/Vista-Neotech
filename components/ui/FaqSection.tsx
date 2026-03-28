import { ProsePageContent } from '@/components/ui/ProsePageContent';

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

interface FaqSectionProps {
  items: FaqItem[];
  title?: string;
  className?: string;
}

export function FaqSection({
  items,
  title = 'Frequently asked questions',
  className = '',
}: FaqSectionProps) {
  if (items.length === 0) return null;

  return (
    <section
      className={`section-padding ${className}`}
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      <div className="container-tight">
        <div className="mb-10 text-center">
          <p className="section-label mb-4">FAQ</p>
          <h2 className="display-3 mb-4" style={{ color: 'var(--color-text)' }}>
            {title}
          </h2>
        </div>
        <div className="mx-auto grid max-w-3xl gap-4">
          {items.map((item) => (
            <details
              key={item.id}
              className="rounded-2xl border p-5"
              style={{
                backgroundColor: 'var(--color-bg-elevated)',
                borderColor: 'var(--color-border)',
              }}
            >
              <summary
                className="cursor-pointer list-none text-base font-semibold [&::-webkit-details-marker]:hidden"
                style={{ color: 'var(--color-text)' }}
              >
                {item.question}
              </summary>
              <div className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                <ProsePageContent html={item.answer} />
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
