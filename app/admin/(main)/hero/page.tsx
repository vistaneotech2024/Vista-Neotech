import HeroEditorClient from './HeroEditorClient';
import { requireAdmin } from '@/lib/admin-auth';
import { getHomeHeroConfig } from '@/lib/cms/hero';

export default async function AdminHeroPage() {
  await requireAdmin();
  const config = await getHomeHeroConfig();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold" style={{ color: 'var(--color-text)' }}>
          Home hero
        </h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--color-text-muted)' }}>
          Manage the main hero section on your homepage, including slides, media, and CTAs.
        </p>
      </div>
      <HeroEditorClient initialConfig={config} />
    </div>
  );
}

