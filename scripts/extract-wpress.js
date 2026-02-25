/**
 * WordPress .wpress File Extractor
 * Extracts and processes WordPress export file for migration
 * 
 * Usage: node scripts/extract-wpress.js
 */

const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');
const { parseString } = require('xml2js');
const wpExtract = require('wpress-extract');

const WORDPRESS_FILE = path.join(__dirname, '..', 'wordpress_file', 'vistaneotech.com-20260220-105017-140.wpress');
const EXTRACT_DIR = path.join(__dirname, '..', 'wordpress_file', 'extracted');
const OUTPUT_DIR = path.join(__dirname, '..', 'wordpress_file', 'processed');

/**
 * Extract .wpress file (All-in-One WP Migration format or ZIP)
 */
async function extractWpressFile() {
  console.log('\n📦 Extracting WordPress .wpress file...');
  
  if (!fs.existsSync(WORDPRESS_FILE)) {
    throw new Error(`WordPress file not found: ${WORDPRESS_FILE}`);
  }

  // Create extraction directory
  if (!fs.existsSync(EXTRACT_DIR)) {
    fs.mkdirSync(EXTRACT_DIR, { recursive: true });
  }

  // Try standard ZIP first (some exports are plain ZIP)
  try {
    const zip = new AdmZip(WORDPRESS_FILE);
    zip.extractAllTo(EXTRACT_DIR, true);
    console.log('✅ WordPress file extracted successfully (ZIP format)');
    return EXTRACT_DIR;
  } catch (zipError) {
    if (!zipError.message || !zipError.message.includes('Invalid or unsupported zip')) {
      throw zipError;
    }
  }

  // Use wpress-extract for All-in-One WP Migration format
  console.log('   Using wpress-extract for All-in-One WP Migration format...');
  return new Promise((resolve, reject) => {
    wpExtract({
      inputFile: WORDPRESS_FILE,
      outputDir: EXTRACT_DIR,
      override: true,
      onStart: (totalSize) => {
        console.log(`   Extracting ~${(totalSize / 1024 / 1024).toFixed(1)} MB...`);
      },
      onUpdate: () => {},
      onFinish: (countFiles) => {
        console.log(`✅ Extracted ${countFiles} files successfully`);
        resolve(EXTRACT_DIR);
      },
    }).catch((err) => {
      console.error('❌ Error extracting .wpress file:', err.message);
      reject(err);
    });
  });
}

/**
 * Find WordPress XML export file
 */
function findXMLExport(extractDir) {
  console.log('\n🔍 Searching for WordPress XML export...');
  
  function findXMLFiles(dir, fileList = []) {
    try {
      const files = fs.readdirSync(dir);
      files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
          findXMLFiles(filePath, fileList);
        } else if (file.endsWith('.xml') && (file.includes('wordpress') || file.includes('export') || file.includes('WXR'))) {
          fileList.push(filePath);
        }
      });
    } catch (error) {
      // Skip directories we can't read
    }
    return fileList;
  }

  const xmlFiles = findXMLFiles(extractDir);
  
  if (xmlFiles.length === 0) {
    console.log('⚠️  No XML export file found');
    return null;
  }

  console.log(`✅ Found ${xmlFiles.length} XML file(s)`);
  return xmlFiles[0];
}

/**
 * Parse WordPress XML export
 */
function parseWordPressXML(xmlPath) {
  console.log('\n📄 Parsing WordPress XML export...');
  
  return new Promise((resolve, reject) => {
    const xmlContent = fs.readFileSync(xmlPath, 'utf-8');
    
    parseString(xmlContent, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      
      const items = result.rss?.channel?.[0]?.item || [];
      const pages = [];
      const posts = [];
      
      console.log(`   Found ${items.length} items in XML`);
      
      items.forEach((item, index) => {
        try {
          const postType = item.post_type?.[0] || 'post';
          const postStatus = item.status?.[0] || 'publish';
          
          if (postStatus !== 'publish') return;
          
          const postId = item.post_id?.[0];
          const slug = item.post_name?.[0] || '';
          const title = item.title?.[0] || '';
          const content = item['content:encoded']?.[0] || item.content?.[0]?._ || '';
          const excerpt = item.excerpt?.[0]?._ || item.excerpt?.[0] || '';
          const pubDate = item.pubDate?.[0] || new Date().toISOString();
          
          // Extract Yoast SEO metadata from postmeta
          const metadata = {
            meta_title: '',
            meta_description: '',
            focus_keyword: '',
            canonical_url: '',
            og_title: '',
            og_description: '',
            og_image: '',
            twitter_title: '',
            twitter_description: '',
            twitter_image: '',
          };
          
          if (item.postmeta && Array.isArray(item.postmeta)) {
            item.postmeta.forEach(meta => {
              const key = meta.meta_key?.[0];
              const value = meta.meta_value?.[0] || '';
              
              switch (key) {
                case '_yoast_wpseo_title':
                  metadata.meta_title = value;
                  break;
                case '_yoast_wpseo_metadesc':
                  metadata.meta_description = value;
                  break;
                case '_yoast_wpseo_focuskw':
                  metadata.focus_keyword = value;
                  break;
                case '_yoast_wpseo_canonical':
                  metadata.canonical_url = value;
                  break;
                case '_yoast_wpseo_opengraph-title':
                  metadata.og_title = value;
                  break;
                case '_yoast_wpseo_opengraph-description':
                  metadata.og_description = value;
                  break;
                case '_yoast_wpseo_opengraph-image':
                  metadata.og_image = value;
                  break;
                case '_yoast_wpseo_twitter-title':
                  metadata.twitter_title = value;
                  break;
                case '_yoast_wpseo_twitter-description':
                  metadata.twitter_description = value;
                  break;
                case '_yoast_wpseo_twitter-image':
                  metadata.twitter_image = value;
                  break;
              }
            });
          }
          
          const data = {
            wordpress_id: postId,
            slug: slug,
            title: title,
            content: content,
            excerpt: excerpt,
            published_at: pubDate,
            ...metadata,
          };
          
          if (postType === 'page') {
            pages.push(data);
          } else if (postType === 'post') {
            posts.push(data);
          }
        } catch (error) {
          console.warn(`   ⚠️  Error parsing item ${index}:`, error.message);
        }
      });
      
      console.log(`✅ Parsed ${pages.length} pages and ${posts.length} posts`);
      resolve({ pages, posts });
    });
  });
}

/**
 * Save processed data to JSON files
 */
function saveProcessedData(data) {
  console.log('\n💾 Saving processed data...');
  
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  const pagesFile = path.join(OUTPUT_DIR, 'pages.json');
  const postsFile = path.join(OUTPUT_DIR, 'posts.json');
  
  fs.writeFileSync(pagesFile, JSON.stringify(data.pages, null, 2), 'utf-8');
  fs.writeFileSync(postsFile, JSON.stringify(data.posts, null, 2), 'utf-8');
  
  console.log(`✅ Saved ${data.pages.length} pages to ${pagesFile}`);
  console.log(`✅ Saved ${data.posts.length} posts to ${postsFile}`);
  
  return { pagesFile, postsFile };
}

/**
 * Main extraction function
 */
async function main() {
  console.log('\n🚀 WordPress .wpress File Extractor');
  console.log('=====================================\n');
  
  try {
    // Step 1: Extract .wpress file
    const extractDir = await extractWpressFile();
    
    // Step 2: Find XML export
    const xmlPath = findXMLExport(extractDir);
    
    if (!xmlPath) {
      console.log('\n⚠️  No XML export found. You may need to:');
      console.log('   1. Export WordPress manually via Tools → Export');
      console.log('   2. Or extract database SQL dump manually');
      return;
    }
    
    // Step 3: Parse XML
    const data = await parseWordPressXML(xmlPath);
    
    // Step 4: Save processed data
    const outputFiles = saveProcessedData(data);
    
    console.log('\n✅ Extraction complete!');
    console.log('\n📋 Next steps:');
    console.log('   1. Review processed data in:', OUTPUT_DIR);
    console.log('   2. Run migration script: node scripts/migrate-to-supabase.js');
    
  } catch (error) {
    console.error('\n❌ Extraction failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { extractWpressFile, parseWordPressXML };
