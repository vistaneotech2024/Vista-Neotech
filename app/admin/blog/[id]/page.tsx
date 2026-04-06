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
    .select(
      'id, slug, title, status, meta_title, meta_description, excerpt, content, focus_keyword, canonical_url, og_title, og_description, og_image, og_type, twitter_card, twitter_title, twitter_description, twitter_image, schema_markup, custom_fields, image_url'
    )
    .eq('id', params.id)
    .maybeSingle();

  if (!post) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-6xl space-y-4 px-4 py-6 md:px-6 md:py-8">
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
        initialFocusKeyword={(post.focus_keyword as string) || ''}
        initialCanonicalUrl={(post.canonical_url as string) || ''}
        initialOgTitle={(post.og_title as string) || ''}
        initialOgDescription={(post.og_description as string) || ''}
        initialOgImage={(post.og_image as string) || ''}
        initialOgType={(post.og_type as string) || 'article'}
        initialTwitterCard={(post.twitter_card as string) || 'summary_large_image'}
        initialTwitterTitle={(post.twitter_title as string) || ''}
        initialTwitterDescription={(post.twitter_description as string) || ''}
        initialTwitterImage={(post.twitter_image as string) || ''}
        initialSchemaMarkup={post.schema_markup ? JSON.stringify(post.schema_markup, null, 2) : ''}
        initialCustomFields={post.custom_fields ? JSON.stringify(post.custom_fields, null, 2) : '{}'}
        initialImageUrl={(post.image_url as string) || ''}
        initialExcerpt={(post.excerpt as string) || ''}
        initialContent={(post.content as string) || ''}
      />
    </div>
  );
}

