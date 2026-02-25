/**
 * WordPress to Supabase Migration Script
 * Extracts data from .wpress file and imports into Supabase
 * 
 * Usage: node scripts/migrate-wordpress.js
 * 
 * Prerequisites:
 * - Node.js with required packages installed
 * - Supabase credentials configured in .env
 * - WordPress .wpress file in wordpress_file/ directory
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const AdmZip = require('adm-zip');
const { parse } = require('csv-parse/sync');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const WORDPRESS_FILE = path.join(__dirname, '..', 'wordpress_file', 'vistaneotech.com-20260220-105017-140.wpress');
const EXTRACT_DIR = path.join(__dirname, '..', 'wordpress_file', 'extracted');
const MEDIA_UPLOAD_DIR = path.join(__dirname, '..', 'public', 'media');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Supabase credentials not found in environment variables');
  console.error('   Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// WordPress table prefix (from your SQL queries, it's "npO_")
const WP_PREFIX = 'npO_';

/**
 * Extract .wpress file
 * .wpress files are typically ZIP archives with a specific structure
 */
async function extractWpressFile() {
  console.log('\n📦 Extracting WordPress export file...');
  
  if (!fs.existsSync(WORDPRESS_FILE)) {
    throw new Error(`WordPress file not found: ${WORDPRESS_FILE}`);
  }

  // Create extraction directory
  if (!fs.existsSync(EXTRACT_DIR)) {
    fs.mkdirSync(EXTRACT_DIR, { recursive: true });
  }

  try {
    const zip = new AdmZip(WORDPRESS_FILE);
    zip.extractAllTo(EXTRACT_DIR, true);
    console.log('✅ WordPress file extracted successfully');
    return EXTRACT_DIR;
  } catch (error) {
    // If it's not a ZIP, it might be a different format
    console.warn('⚠️  File might not be a ZIP archive. Trying alternative extraction...');
    throw error;
  }
}

/**
 * Find and parse database SQL dump
 */
function findDatabaseDump(extractDir) {
  console.log('\n🔍 Looking for database dump...');
  
  // Common locations for database dumps in .wpress files
  const possiblePaths = [
    path.join(extractDir, 'database.sql'),
    path.join(extractDir, 'db.sql'),
    path.join(extractDir, 'wordpress', 'database.sql'),
    path.join(extractDir, 'backup', 'database.sql'),
  ];

  // Also search recursively
  function findSQLFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        findSQLFiles(filePath, fileList);
      } else if (file.endsWith('.sql')) {
        fileList.push(filePath);
      }
    });
    return fileList;
  }

  const sqlFiles = findSQLFiles(extractDir);
  
  if (sqlFiles.length === 0) {
    throw new Error('No SQL dump file found in WordPress export');
  }

  console.log(`✅ Found ${sqlFiles.length} SQL file(s)`);
  return sqlFiles[0]; // Use the first one found
}

/**
 * Parse WordPress SQL dump and extract posts/pages data
 */
function parseWordPressDatabase(sqlFilePath) {
  console.log('\n📊 Parsing WordPress database dump...');
  
  const sqlContent = fs.readFileSync(sqlFilePath, 'utf-8');
  
  // Extract INSERT statements for posts table
  const postsRegex = new RegExp(
    `INSERT INTO.*?\\\`?${WP_PREFIX}posts\\\`?.*?VALUES\\s*\\(([^)]+)\\)`,
    'gis'
  );
  
  const posts = [];
  let match;
  
  // Simple parser for INSERT statements (this is a simplified version)
  // For production, consider using a proper SQL parser library
  const insertMatches = sqlContent.matchAll(
    new RegExp(`INSERT INTO.*?\\\`?${WP_PREFIX}posts\\\`?.*?VALUES`, 'gis')
  );
  
  // Extract postmeta for SEO data
  const postmeta = {};
  const postmetaRegex = new RegExp(
    `INSERT INTO.*?\\\`?${WP_PREFIX}postmeta\\\`?.*?VALUES\\s*\\(([^)]+)\\)`,
    'gis'
  );
  
  // Parse postmeta
  for (const metaMatch of sqlContent.matchAll(postmetaRegex)) {
    // This is simplified - actual parsing would need to handle escaped values properly
    // For now, we'll use a different approach
  }
  
  // Alternative: Look for JSON or serialized data sections
  // Many WordPress exports include JSON dumps
  
  console.log('⚠️  Note: Using simplified SQL parser. For production, use a proper SQL parser.');
  console.log('   Consider exporting WordPress data via WP-CLI or XML export for better parsing.');
  
  return { posts, postmeta };
}

/**
 * Alternative: Parse WordPress XML export (if available)
 */
function parseWordPressXML(xmlPath) {
  console.log('\n📄 Parsing WordPress XML export...');
  
  const xmlContent = fs.readFileSync(xmlPath, 'utf-8');
  const { parseString } = require('xml2js');
  
  return new Promise((resolve, reject) => {
    parseString(xmlContent, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      
      const items = result.rss?.channel?.[0]?.item || [];
      const pages = [];
      const posts = [];
      
      items.forEach(item => {
        const postType = item.post_type?.[0] || 'post';
        const postStatus = item.status?.[0] || 'publish';
        
        if (postStatus !== 'publish') return;
        
        const data = {
          wordpress_id: item.post_id?.[0],
          slug: item.post_name?.[0] || '',
          title: item.title?.[0] || '',
          content: item.content?.[0]?._ || item['content:encoded']?.[0] || '',
          excerpt: item.excerpt?.[0]?._ || item.excerpt?.[0] || '',
          published_at: item.pubDate?.[0] || new Date().toISOString(),
          meta_title: '',
          meta_description: '',
          focus_keyword: '',
          canonical_url: '',
          og_title: '',
          og_description: '',
          og_image: '',
        };
        
        // Extract Yoast SEO metadata from postmeta
        if (item.postmeta) {
          item.postmeta.forEach(meta => {
            const key = meta.meta_key?.[0];
            const value = meta.meta_value?.[0] || '';
            
            switch (key) {
              case '_yoast_wpseo_title':
                data.meta_title = value;
                break;
              case '_yoast_wpseo_metadesc':
                data.meta_description = value;
                break;
              case '_yoast_wpseo_focuskw':
                data.focus_keyword = value;
                break;
              case '_yoast_wpseo_canonical':
                data.canonical_url = value;
                break;
              case '_yoast_wpseo_opengraph-title':
                data.og_title = value;
                break;
              case '_yoast_wpseo_opengraph-description':
                data.og_description = value;
                break;
              case '_yoast_wpseo_opengraph-image':
                data.og_image = value;
                break;
            }
          });
        }
        
        if (postType === 'page') {
          pages.push(data);
        } else if (postType === 'post') {
          posts.push(data);
        }
      });
      
      console.log(`✅ Parsed ${pages.length} pages and ${posts.length} posts`);
      resolve({ pages, posts });
    });
  });
}

/**
 * Process and clean WordPress content
 */
function processContent(content) {
  if (!content) return '';
  
  // Remove WordPress shortcodes (basic cleanup)
  let processed = content
    .replace(/\[.*?\]/g, '') // Remove shortcodes
    .replace(/<!--.*?-->/g, '') // Remove HTML comments
    .trim();
  
  return processed;
}

/**
 * Extract featured image URL from content
 */
function extractFeaturedImage(content) {
  const imgRegex = /<img[^>]+src=["']([^"']+)["']/i;
  const match = content.match(imgRegex);
  return match ? match[1] : null;
}

/**
 * Generate excerpt from content if not provided
 */
function generateExcerpt(content, maxLength = 160) {
  if (!content) return '';
  
  // Remove HTML tags
  const text = content.replace(/<[^>]*>/g, '').trim();
  
  if (text.length <= maxLength) return text;
  
  return text.substring(0, maxLength).replace(/\s+\S*$/, '') + '...';
}

/**
 * Import pages into Supabase
 */
async function importPages(pages) {
  console.log(`\n📄 Importing ${pages.length} pages...`);
  
  const imported = [];
  const errors = [];
  
  for (const page of pages) {
    try {
      // Check if page already exists
      const { data: existing } = await supabase
        .from('pages')
        .select('id')
        .eq('slug', page.slug)
        .maybeSingle();
      
      if (existing) {
        console.log(`   ⏭️  Skipping existing page: ${page.slug}`);
        continue;
      }
      
      const pageData = {
        slug: page.slug,
        title: page.title,
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
        og_title: page.og_title || page.title,
        og_description: page.og_description || page.meta_description || '',
        og_image: page.og_image || '',
        published_at: page.published_at || new Date().toISOString(),
      };
      
      const { data, error } = await supabase
        .from('pages')
        .insert(pageData)
        .select()
        .single();
      
      if (error) {
        errors.push({ slug: page.slug, error: error.message });
        console.log(`   ❌ Error importing ${page.slug}: ${error.message}`);
      } else {
        imported.push(data);
        console.log(`   ✅ Imported: ${page.slug}`);
      }
    } catch (error) {
      errors.push({ slug: page.slug, error: error.message });
      console.log(`   ❌ Error importing ${page.slug}: ${error.message}`);
    }
  }
  
  console.log(`\n✅ Imported ${imported.length} pages, ${errors.length} errors`);
  return { imported, errors };
}

/**
 * Import posts into Supabase
 */
async function importPosts(posts) {
  console.log(`\n📝 Importing ${posts.length} posts...`);
  
  const imported = [];
  const errors = [];
  
  for (const post of posts) {
    try {
      // Check if post already exists
      const { data: existing } = await supabase
        .from('posts')
        .select('id')
        .eq('slug', post.slug)
        .maybeSingle();
      
      if (existing) {
        console.log(`   ⏭️  Skipping existing post: ${post.slug}`);
        continue;
      }
      
      const postData = {
        slug: post.slug,
        title: post.title,
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
        og_title: post.og_title || post.title,
        og_description: post.og_description || post.meta_description || '',
        og_image: post.og_image || '',
        published_at: post.published_at || new Date().toISOString(),
      };
      
      const { data, error } = await supabase
        .from('posts')
        .insert(postData)
        .select()
        .single();
      
      if (error) {
        errors.push({ slug: post.slug, error: error.message });
        console.log(`   ❌ Error importing ${post.slug}: ${error.message}`);
      } else {
        imported.push(data);
        console.log(`   ✅ Imported: ${post.slug}`);
      }
    } catch (error) {
      errors.push({ slug: post.slug, error: error.message });
      console.log(`   ❌ Error importing ${post.slug}: ${error.message}`);
    }
  }
  
  console.log(`\n✅ Imported ${imported.length} posts, ${errors.length} errors`);
  return { imported, errors };
}

/**
 * Extract and migrate media files
 */
async function migrateMediaFiles(extractDir) {
  console.log('\n🖼️  Migrating media files...');
  
  // Find WordPress uploads directory
  const uploadsPaths = [
    path.join(extractDir, 'wp-content', 'uploads'),
    path.join(extractDir, 'wordpress', 'wp-content', 'uploads'),
    path.join(extractDir, 'uploads'),
  ];
  
  let uploadsDir = null;
  for (const uploadPath of uploadsPaths) {
    if (fs.existsSync(uploadPath)) {
      uploadsDir = uploadPath;
      break;
    }
  }
  
  if (!uploadsDir) {
    console.log('⚠️  WordPress uploads directory not found. Skipping media migration.');
    return;
  }
  
  console.log(`✅ Found uploads directory: ${uploadsDir}`);
  console.log('⚠️  Media file migration requires manual setup or additional script.');
  console.log('   Consider using Supabase Storage API for bulk uploads.');
  
  // Create media directory in public folder
  if (!fs.existsSync(MEDIA_UPLOAD_DIR)) {
    fs.mkdirSync(MEDIA_UPLOAD_DIR, { recursive: true });
  }
  
  return uploadsDir;
}

/**
 * Main migration function
 */
async function main() {
  console.log('\n🚀 WordPress to Supabase Migration');
  console.log('=====================================\n');
  
  try {
    // Step 1: Extract WordPress file
    const extractDir = await extractWpressFile();
    
    // Step 2: Find database dump or XML export
    let pages = [];
    let posts = [];
    
    // Try XML export first (easier to parse)
    const xmlFiles = [];
    function findXMLFiles(dir, fileList = []) {
      const files = fs.readdirSync(dir);
      files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
          findXMLFiles(filePath, fileList);
        } else if (file.endsWith('.xml') && file.includes('wordpress') || file.includes('export')) {
          fileList.push(filePath);
        }
      });
      return fileList;
    }
    
    const xmlFilesFound = findXMLFiles(extractDir);
    
    if (xmlFilesFound.length > 0) {
      console.log(`\n📄 Found ${xmlFilesFound.length} XML export file(s)`);
      const xmlData = await parseWordPressXML(xmlFilesFound[0]);
      pages = xmlData.pages;
      posts = xmlData.posts;
    } else {
      // Try SQL dump
      const sqlFile = findDatabaseDump(extractDir);
      const sqlData = parseWordPressDatabase(sqlFile);
      // Note: SQL parsing is complex and may need manual CSV export instead
      console.log('⚠️  SQL parsing is limited. Consider exporting WordPress data as XML or CSV.');
      console.log('   You can use the existing scripts/audit/process-audit-data.js with CSV exports.');
    }
    
    // Step 3: Import pages
    if (pages.length > 0) {
      await importPages(pages);
    }
    
    // Step 4: Import posts
    if (posts.length > 0) {
      await importPosts(posts);
    }
    
    // Step 5: Migrate media files
    await migrateMediaFiles(extractDir);
    
    console.log('\n✅ Migration completed!');
    console.log('\n📋 Next steps:');
    console.log('   1. Verify imported content in Supabase dashboard');
    console.log('   2. Update URL_MIGRATION_MAP.json if needed');
    console.log('   3. Test pages and blog posts on the site');
    console.log('   4. Migrate media files to Supabase Storage');
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run migration if called directly
if (require.main === module) {
  main();
}

module.exports = { main, parseWordPressXML, importPages, importPosts };
