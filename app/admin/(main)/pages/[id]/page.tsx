import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/admin-auth';
import { createAdminSupabase } from '@/lib/supabase-admin';
import { PageEditorClient } from './PageEditorClient';

type Params = { params: { id: string } };

export default async function AdminPageEditor({ params }: Params) {
  await requireAdmin();
  const supabase = createAdminSupabase();
  if (!supabase) notFound();

  const { data } = await supabase
    .from('pages')
    .select('id, slug, title, content, meta_title, meta_description')
    .eq('id', params.id)
    .maybeSingle();

  if (!data) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
        Edit page
      </h1>
      <PageEditorClient
        id={data.id}
        initialTitle={data.title || ''}
        initialSlug={data.slug}
        initialMetaTitle={data.meta_title || ''}
        initialMetaDescription={data.meta_description || ''}
        initialContent={data.content || ''}
      />
    </div>
  );
}

