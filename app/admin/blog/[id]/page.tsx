import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/admin-auth';
import { createAdminSupabase } from '@/lib/supabase-admin';
import { BlogEditorClient } from './BlogEditorClient';

type Params = { params: { id: string } };

export default async function AdminBlogEditPage({ params }: Params) {
  await requireAdmin();
  const supabase = createAdminSupabase();

  if (!supabase) {
    notFound();
  }

  const { data: post } = await supabase
    .from('posts')
    .select('id, slug, title, status, meta_title, meta_description, excerpt, content')
    .eq('id', params.id)
    .maybeSingle();

  if (!post) {
    notFound();
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold" style={{ color: 'var(--color-text)' }}>
          Edit blog post
        </h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--color-text-muted)' }}>
          Update content and SEO for this article.
        </p>
      </div>
      <BlogEditorClient
        id={post.id as string}
        initialTitle={(post.title as string) || ''}
        initialSlug={post.slug as string}
        initialStatus={(post.status as string) || 'draft'}
        initialMetaTitle={(post.meta_title as string) || ''}
        initialMetaDescription={(post.meta_description as string) || ''}
        initialExcerpt={(post.excerpt as string) || ''}
        initialContent={(post.content as string) || ''}
      />
    </div>
  );
}

