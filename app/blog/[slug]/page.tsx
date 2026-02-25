import { redirect, notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPageByPath, buildMetadata, getAllPreservedUrls } from '@/lib/url-map';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  // This route now redirects to root level, but keep for backward compatibility
  const preserved = getAllPreservedUrls();
  return preserved
    .filter((p) => p.content_type === 'post')
    .map((p) => ({ slug: p.old_url.replace(/^\//, '').replace(/\/$/, '') }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  // Try root level first (new structure)
  let path = `/${slug}`;
  let page = getPageByPath(path);
  // Fallback to /blog/ prefix for backward compatibility
  if (!page) {
    path = `/blog/${slug}`;
    page = getPageByPath(path);
  }
  return buildMetadata(
    page,
    'Vista Neotech Blog',
    'Vista Neotech – MLM software and direct selling insights.'
  );
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  // Redirect to root level to match WordPress exactly
  const rootPath = `/${slug}`;
  const page = getPageByPath(rootPath);
  
  if (page && page.content_type === 'post') {
    // Redirect to root level URL (301 for SEO)
    redirect(rootPath);
  }
  
  // If not found, try /blog/ prefix for backward compatibility
  const blogPath = `/blog/${slug}`;
  const blogPage = getPageByPath(blogPath);
  if (blogPage && blogPage.content_type === 'post') {
    // Redirect to root level
    redirect(`/${slug}`);
  }
  
  notFound();
}
