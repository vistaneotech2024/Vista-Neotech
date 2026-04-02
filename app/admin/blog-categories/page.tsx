import { requireAdmin } from '@/lib/admin-auth';
import { BlogCategoriesClient } from './BlogCategoriesClient';

export default async function AdminBlogCategoriesPage() {
  await requireAdmin();
  return <BlogCategoriesClient />;
}

