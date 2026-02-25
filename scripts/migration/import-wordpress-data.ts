/**
 * WordPress Data Migration Script
 * Imports WordPress content into the new CMS database
 */

import 'dotenv/config';
import { prisma } from '../../lib/db/prisma';
import * as fs from 'fs/promises';
import * as path from 'path';

interface WordPressPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  status: string;
  meta_title?: string;
  meta_description?: string;
  focus_keyword?: string;
  canonical_url?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  wordpress_url: string;
}

interface WordPressPost extends WordPressPage {
  categories?: string[];
  tags?: string[];
}

/**
 * Load WordPress data from URL_MIGRATION_MAP.json
 */
async function loadWordPressData() {
  const filePath = path.join(process.cwd(), 'URL_MIGRATION_MAP.json');
  const fileContent = await fs.readFile(filePath, 'utf-8');
  const data = JSON.parse(fileContent);
  return data.preserved || [];
}

/**
 * Create or get user for WordPress migration
 */
async function getOrCreateMigrationUser() {
  let user = await prisma.user.findFirst({
    where: { email: 'migration@vistaneotech.com' },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: 'migration@vistaneotech.com',
        username: 'migration',
        passwordHash: 'migration-placeholder', // Should be changed
        displayName: 'Migration User',
        role: 'admin',
      },
    });
  }

  return user;
}

/**
 * Import WordPress pages
 */
async function importWordPressPages() {
  console.log('Importing WordPress pages...');

  const wordpressData = await loadWordPressData();
  const migrationUser = await getOrCreateMigrationUser();

  const pages = wordpressData.filter((item: any) => item.content_type === 'page');

  let imported = 0;
  let skipped = 0;
  let errors = 0;

  for (const wpPage of pages) {
    try {
      // Check if page already exists
      const existing = await prisma.page.findFirst({
        where: {
          OR: [
            { slug: wpPage.slug || wpPage.old_url.replace(/^\//, '').replace(/\/$/, '') },
            { wordpressId: wpPage.post_id },
          ],
        },
      });

      if (existing) {
        console.log(`Skipping existing page: ${wpPage.slug}`);
        skipped++;
        continue;
      }

      const slug = wpPage.slug || wpPage.old_url.replace(/^\//, '').replace(/\/$/, '');

      await prisma.page.create({
        data: {
          slug,
          title: wpPage.meta_title || wpPage.slug?.replace(/-/g, ' ') || 'Untitled Page',
          content: '', // Will be loaded from CMS later
          excerpt: wpPage.meta_description?.substring(0, 200),
          status: 'published',
          contentType: 'page',
          wordpressId: wpPage.post_id,
          wordpressUrl: wpPage.old_url,
          metaTitle: wpPage.meta_title,
          metaDescription: wpPage.meta_description,
          focusKeyword: wpPage.focus_keyword,
          canonicalUrl: wpPage.canonical_url || wpPage.old_url,
          ogTitle: wpPage.og_title || wpPage.meta_title,
          ogDescription: wpPage.og_description || wpPage.meta_description,
          ogImage: wpPage.og_image,
          authorId: migrationUser.id,
          publishedAt: new Date(),
          version: 1,
        },
      });

      imported++;
      console.log(`Imported page: ${slug}`);
    } catch (error) {
      console.error(`Error importing page ${wpPage.slug}:`, error);
      errors++;
    }
  }

  console.log(`\nPages import complete:`);
  console.log(`  Imported: ${imported}`);
  console.log(`  Skipped: ${skipped}`);
  console.log(`  Errors: ${errors}`);
}

/**
 * Import WordPress posts
 */
async function importWordPressPosts() {
  console.log('\nImporting WordPress posts...');

  const wordpressData = await loadWordPressData();
  const migrationUser = await getOrCreateMigrationUser();

  const posts = wordpressData.filter((item: any) => item.content_type === 'post');

  let imported = 0;
  let skipped = 0;
  let errors = 0;

  for (const wpPost of posts) {
    try {
      // Check if post already exists
      const existing = await prisma.post.findFirst({
        where: {
          OR: [
            { slug: wpPost.slug || wpPost.old_url.replace(/^\//, '').replace(/\/$/, '') },
            { wordpressId: wpPost.post_id },
          ],
        },
      });

      if (existing) {
        console.log(`Skipping existing post: ${wpPost.slug}`);
        skipped++;
        continue;
      }

      const slug = wpPost.slug || wpPost.old_url.replace(/^\//, '').replace(/\/$/, '');

      await prisma.post.create({
        data: {
          slug,
          title: wpPost.meta_title || wpPost.slug?.replace(/-/g, ' ') || 'Untitled Post',
          content: '', // Will be loaded from CMS later
          excerpt: wpPost.meta_description?.substring(0, 200),
          status: 'published',
          contentType: 'post',
          wordpressId: wpPost.post_id,
          wordpressUrl: wpPost.old_url,
          metaTitle: wpPost.meta_title,
          metaDescription: wpPost.meta_description,
          focusKeyword: wpPost.focus_keyword,
          canonicalUrl: wpPost.canonical_url || wpPost.old_url,
          ogTitle: wpPost.og_title || wpPost.meta_title,
          ogDescription: wpPost.og_description || wpPost.meta_description,
          ogImage: wpPost.og_image,
          authorId: migrationUser.id,
          publishedAt: new Date(),
          version: 1,
        },
      });

      imported++;
      console.log(`Imported post: ${slug}`);
    } catch (error) {
      console.error(`Error importing post ${wpPost.slug}:`, error);
      errors++;
    }
  }

  console.log(`\nPosts import complete:`);
  console.log(`  Imported: ${imported}`);
  console.log(`  Skipped: ${skipped}`);
  console.log(`  Errors: ${errors}`);
}

/**
 * Create redirects from old WordPress URLs
 */
async function createRedirects() {
  console.log('\nCreating redirects...');

  const wordpressData = await loadWordPressData();
  const migrationUser = await getOrCreateMigrationUser();

  let created = 0;
  let skipped = 0;
  let errors = 0;

  for (const item of wordpressData) {
    try {
      // Check if redirect already exists
      const existing = await prisma.redirect.findUnique({
        where: { sourceUrl: item.old_url },
      });

      if (existing) {
        skipped++;
        continue;
      }

      // Determine destination URL
      let destinationUrl = item.new_url || item.old_url;

      // If it's a blog post with /blog/ prefix, redirect to root level
      if (item.content_type === 'post' && item.old_url.startsWith('/blog/')) {
        destinationUrl = item.old_url.replace('/blog/', '/');
      }

      await prisma.redirect.create({
        data: {
          sourceUrl: item.old_url,
          destinationUrl,
          redirectType: 301,
          status: 'active',
        },
      });

      created++;
    } catch (error) {
      console.error(`Error creating redirect for ${item.old_url}:`, error);
      errors++;
    }
  }

  console.log(`\nRedirects creation complete:`);
  console.log(`  Created: ${created}`);
  console.log(`  Skipped: ${skipped}`);
  console.log(`  Errors: ${errors}`);
}

/**
 * Main migration function
 */
async function main() {
  console.log('Starting WordPress data migration...\n');

  try {
    await importWordPressPages();
    await importWordPressPosts();
    await createRedirects();

    console.log('\n✅ Migration complete!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run migration if executed directly
if (require.main === module) {
  main();
}

export { importWordPressPages, importWordPressPosts, createRedirects };
