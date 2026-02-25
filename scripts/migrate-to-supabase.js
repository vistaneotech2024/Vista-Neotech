/**
 * Migrate WordPress Data to Supabase
 * Imports pages and posts from processed WordPress data
 * 
 * Usage: node scripts/migrate-to-supabase.js
 * 
 * Prerequisites:
 * - Run scripts/extract-wpress.js first to process WordPress data
 * - Supabase credentials in .env.local
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const PROCESSED_DIR = path.join(__dirname, '..', 'wordpress_file', 'processed');
const PAGES_FILE = path.join(PROCESSED_DIR, 'pages.json');
const POSTS_FILE = path.join(PROCESSED_DIR, 'posts.json');
const URL_MIGRATION_MAP = path.join(__dirname, '..', 'URL_MIGRATION_MAP.json');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Supabase credentials not found');
  console.error('   Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Process WordPress content (clean HTML, remove shortcodes)
 */
function processContent(content) {
  if (!content) return '';
  
  // Basic cleanup - remove WordPress shortcodes
  let processed = content
    .replace(/\[.*?\]/g, '') // Remove shortcodes
    .replace(/<!--.*?-->/gs, '') // Remove HTML comments
    .trim();
  
  return processed;
}

/**
 * Generate excerpt from content
 */
function generateExcerpt(content, maxLength = 160) {
  if (!content) return '';
  
  // Remove HTML tags
  const text = content.replace(/<[^>]*>/g, '').trim();
  
  if (text.length <= maxLength) return text;
  
  return text.substring(0, maxLength).replace(/\s+\S*$/, '') + '...';
}

/**
 * Get or create migration user
 */
async function getOrCreateMigrationUser() {
  // Try to find existing user
  const { data: existing } = await supabase
    .from('users')
    .select('id')
    .eq('email', 'migration@vistaneotech.com')
    .maybeSingle();
  
  if (existing) {
    return existing;
  }
  
  // Create migration user
  const { data, error } = await supabase
    .from('users')
    .insert({
      email: 'migration@vistaneotech.com',
      username: 'migration',
      password_hash: 'migration-placeholder', // Should be changed
      display_name: 'Migration User',
      role: 'admin',
    })
    .select()
    .single();
  
  if (error) {
    console.warn('⚠️  Could not create migration user:', error.message);
    return null;
  }
  
  return data;
}

/**
 * Load pages from processed JSON or fallback to URL_MIGRATION_MAP.json
 */
function loadPagesData() {
  if (fs.existsSync(PAGES_FILE)) {
    return JSON.parse(fs.readFileSync(PAGES_FILE, 'utf-8'));
  }
  if (fs.existsSync(URL_MIGRATION_MAP)) {
    const map = JSON.parse(fs.readFileSync(URL_MIGRATION_MAP, 'utf-8'));
    const preserved = map.preserved || [];
    return preserved
      .filter((p) => p.content_type === 'page')
      .map((p) => ({
        slug: p.slug || (p.old_url || '').replace(/^\//, '').replace(/\/$/, ''),
        title: p.meta_title || p.slug || 'Untitled',
        content: '',
        excerpt: p.meta_description || '',
        wordpress_id: p.post_id,
        meta_title: p.meta_title,
        meta_description: p.meta_description,
        focus_keyword: p.focus_keyword || '',
        canonical_url: p.canonical_url || '',
        og_title: p.og_title || '',
        og_description: p.og_description || '',
        og_image: p.og_image || '',
        published_at: new Date().toISOString(),
      }));
  }
  return [];
}

/**
 * Import pages to Supabase
 */
async function importPages() {
  console.log('\n📄 Importing pages...');
  
  const pages = loadPagesData();
  if (pages.length === 0) {
    console.log('⚠️  No pages to import. Run extract-wpress.js or ensure URL_MIGRATION_MAP.json exists.');
    return { imported: 0, skipped: 0, errors: 0 };
  }
  console.log(`   Loaded ${pages.length} pages from ${fs.existsSync(PAGES_FILE) ? 'processed JSON' : 'URL_MIGRATION_MAP.json'}`);
  const migrationUser = await getOrCreateMigrationUser();
  
  let imported = 0;
  let skipped = 0;
  let errors = 0;
  
  for (const page of pages) {
    try {
      // Check if page already exists
      const { data: existing } = await supabase
        .from('pages')
        .select('id')
        .or(`slug.eq.${page.slug},wordpress_id.eq.${page.wordpress_id}`)
        .maybeSingle();
      
      if (existing) {
        console.log(`   ⏭️  Skipping existing page: ${page.slug}`);
        skipped++;
        continue;
      }
      
      const pageData = {
        slug: page.slug,
        title: page.title || 'Untitled Page',
        content: processContent(page.content),
        excerpt: page.excerpt || generateExcerpt(page.content),
        status: 'published',
        content_type: 'page',
        wordpress_id: page.wordpress_id,
        wordpress_url: `https://vistaneotech.com/${page.slug}`,
        meta_title: page.meta_title || page.title,
        meta_description: page.meta_description || generateExcerpt(page.content),
        focus_keyword: page.focus_keyword || '',
        canonical_url: page.canonical_url || `https://vistaneotech.com/${page.slug}`,
        og_title: page.og_title || page.meta_title || page.title,
        og_description: page.og_description || page.meta_description || '',
        og_image: page.og_image || '',
        twitter_title: page.twitter_title || '',
        twitter_description: page.twitter_description || '',
        twitter_image: page.twitter_image || '',
        published_at: page.published_at || new Date().toISOString(),
        author_id: migrationUser?.id || null,
      };
      
      const { data, error } = await supabase
        .from('pages')
        .insert(pageData)
        .select()
        .single();
      
      if (error) {
        errors++;
        console.log(`   ❌ Error importing ${page.slug}: ${error.message}`);
      } else {
        imported++;
        console.log(`   ✅ Imported: ${page.slug}`);
      }
    } catch (error) {
      errors++;
      console.log(`   ❌ Error importing ${page.slug}: ${error.message}`);
    }
  }
  
  console.log(`\n✅ Pages: ${imported} imported, ${skipped} skipped, ${errors} errors`);
  return { imported, skipped, errors };
}

/**
 * Load posts from processed JSON or fallback to URL_MIGRATION_MAP.json
 */
function loadPostsData() {
  if (fs.existsSync(POSTS_FILE)) {
    return JSON.parse(fs.readFileSync(POSTS_FILE, 'utf-8'));
  }
  if (fs.existsSync(URL_MIGRATION_MAP)) {
    const map = JSON.parse(fs.readFileSync(URL_MIGRATION_MAP, 'utf-8'));
    const preserved = map.preserved || [];
    return preserved
      .filter((p) => p.content_type === 'post')
      .map((p) => ({
        slug: p.slug || (p.old_url || '').replace(/^\//, '').replace(/\/$/, ''),
        title: p.meta_title || p.slug || 'Untitled',
        content: '',
        excerpt: p.meta_description || '',
        wordpress_id: p.post_id,
        meta_title: p.meta_title,
        meta_description: p.meta_description,
        focus_keyword: p.focus_keyword || '',
        canonical_url: p.canonical_url || '',
        og_title: p.og_title || '',
        og_description: p.og_description || '',
        og_image: p.og_image || '',
        published_at: new Date().toISOString(),
      }));
  }
  return [];
}

/**
 * Import posts to Supabase
 */
async function importPosts() {
  console.log('\n📝 Importing posts...');
  
  const posts = loadPostsData();
  if (posts.length === 0) {
    console.log('⚠️  No posts to import. Run extract-wpress.js or ensure URL_MIGRATION_MAP.json exists.');
    return { imported: 0, skipped: 0, errors: 0 };
  }
  console.log(`   Loaded ${posts.length} posts from ${fs.existsSync(POSTS_FILE) ? 'processed JSON' : 'URL_MIGRATION_MAP.json'}`);
  const migrationUser = await getOrCreateMigrationUser();
  
  let imported = 0;
  let skipped = 0;
  let errors = 0;
  
  for (const post of posts) {
    try {
      // Check if post already exists
      const { data: existing } = await supabase
        .from('posts')
        .select('id')
        .or(`slug.eq.${post.slug},wordpress_id.eq.${post.wordpress_id}`)
        .maybeSingle();
      
      if (existing) {
        console.log(`   ⏭️  Skipping existing post: ${post.slug}`);
        skipped++;
        continue;
      }
      
      const postData = {
        slug: post.slug,
        title: post.title || 'Untitled Post',
        content: processContent(post.content),
        excerpt: post.excerpt || generateExcerpt(post.content),
        status: 'published',
        content_type: 'post',
        wordpress_id: post.wordpress_id,
        wordpress_url: `https://vistaneotech.com/${post.slug}`,
        meta_title: post.meta_title || post.title,
        meta_description: post.meta_description || generateExcerpt(post.content),
        focus_keyword: post.focus_keyword || '',
        canonical_url: post.canonical_url || `https://vistaneotech.com/${post.slug}`,
        og_title: post.og_title || post.meta_title || post.title,
        og_description: post.og_description || post.meta_description || '',
        og_image: post.og_image || '',
        twitter_title: post.twitter_title || '',
        twitter_description: post.twitter_description || '',
        twitter_image: post.twitter_image || '',
        published_at: post.published_at || new Date().toISOString(),
        author_id: migrationUser?.id || null,
      };
      
      const { data, error } = await supabase
        .from('posts')
        .insert(postData)
        .select()
        .single();
      
      if (error) {
        errors++;
        console.log(`   ❌ Error importing ${post.slug}: ${error.message}`);
      } else {
        imported++;
        console.log(`   ✅ Imported: ${post.slug}`);
      }
    } catch (error) {
      errors++;
      console.log(`   ❌ Error importing ${post.slug}: ${error.message}`);
    }
  }
  
  console.log(`\n✅ Posts: ${imported} imported, ${skipped} skipped, ${errors} errors`);
  return { imported, skipped, errors };
}

/**
 * Main migration function
 */
async function main() {
  console.log('\n🚀 WordPress to Supabase Migration');
  console.log('=====================================\n');
  
  try {
    const pagesResult = await importPages();
    const postsResult = await importPosts();
    
    console.log('\n✅ Migration completed!');
    console.log('\n📊 Summary:');
    console.log(`   Pages: ${pagesResult.imported} imported, ${pagesResult.skipped} skipped, ${pagesResult.errors} errors`);
    console.log(`   Posts: ${postsResult.imported} imported, ${postsResult.skipped} skipped, ${postsResult.errors} errors`);
    
    console.log('\n📋 Next steps:');
    console.log('   1. Verify imported content in Supabase dashboard');
    console.log('   2. Test pages and blog posts on your site');
    console.log('   3. Migrate media files to Supabase Storage');
    console.log('   4. Update URL_MIGRATION_MAP.json if needed');
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { importPages, importPosts };
