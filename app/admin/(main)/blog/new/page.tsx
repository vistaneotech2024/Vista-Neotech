import { requireAdmin } from '@/lib/admin-auth';
import { BlogEditorClient } from '@/app/admin/blog/[id]/BlogEditorClient';

export default async function AdminBlogNewPage() {
  await requireAdmin();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold" style={{ color: 'var(--color-text)' }}>
          Create blog post
        </h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--color-text-muted)' }}>
          Add a new article and publish when ready.
        </p>
      </div>
      <BlogEditorClient
        id="new"
        initialTitle=""
        initialSlug=""
        initialStatus="draft"
        initialMetaTitle=""
        initialMetaDescription=""
        initialFocusKeyword=""
        initialCanonicalUrl=""
        initialOgTitle=""
        initialOgDescription=""
        initialOgImage=""
        initialOgType="article"
        initialTwitterCard="summary_large_image"
        initialTwitterTitle=""
        initialTwitterDescription=""
        initialTwitterImage=""
        initialSchemaMarkup=""
        initialCustomFields="{}"
        initialImageUrl=""
        initialExcerpt=""
        initialContent=""
      />
    </div>
  );
}

