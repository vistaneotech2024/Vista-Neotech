type StatCardProps = {
  value: string | number;
  label: string;
  accent?: 'orange' | 'cyan' | 'green';
  delay?: number;
};

const accentColors = {
  orange: 'from-primary-orange to-accent-amber',
  cyan: 'from-accent-cyan to-[#0097A7]',
  green: 'from-accent-green to-[#689F38]',
};

export function StatCard({ value, label, accent = 'orange', delay = 0 }: StatCardProps) {
  return (
    <div
      className="group relative overflow-hidden rounded-2xl border border-neutral-light/80 bg-white p-6 shadow-sm transition-all duration-300 hover:border-primary-orange/20 hover:shadow-lg md:p-8"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`inline-flex rounded-xl bg-gradient-to-br ${accentColors[accent]} p-3 text-white shadow-lg`}>
        <span className="text-3xl font-bold tracking-tight md:text-4xl">{value}</span>
      </div>
      <p className="mt-4 text-sm font-medium uppercase tracking-wider text-neutral-grey">{label}</p>
      <div className={`absolute -bottom-4 -right-4 h-24 w-24 rounded-full bg-gradient-to-br ${accentColors[accent]} opacity-5 transition-opacity group-hover:opacity-10`} />
    </div>
  );
}
