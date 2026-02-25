/**
 * WordPress Audit Data Processor
 * Supports: (1) Query result CSVs (url, meta_title, ...) or (2) Raw table exports (wp_posts + wp_postmeta)
 * GSC files optional; if missing, all URLs get priority tier4.
 */

const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

const CONFIG = {
  wordpressBase: 'https://vistaneotech.com',
  nextjsBase: 'https://vistaneotech.com',
};

const YOAST_KEYS = {
  '_yoast_wpseo_title': 'meta_title',
  '_yoast_wpseo_metadesc': 'meta_description',
  '_yoast_wpseo_focuskw': 'focus_keyword',
  '_yoast_wpseo_opengraph-title': 'og_title',
  '_yoast_wpseo_opengraph-description': 'og_description',
  '_yoast_wpseo_opengraph-image': 'og_image',
  '_yoast_wpseo_twitter-title': 'twitter_title',
  '_yoast_wpseo_twitter-description': 'twitter_description',
  '_yoast_wpseo_twitter-image': 'twitter_image',
  '_yoast_wpseo_canonical': 'canonical_url',
  '_yoast_wpseo_meta-robots': 'robots_meta',
};

const PRIORITY_THRESHOLDS = {
  tier1: { clicks: 100, impressions: 1000 },
  tier2: { clicks: 50, impressions: 500 },
  tier3: { clicks: 10, impressions: 100 },
  tier4: { clicks: 0, impressions: 0 },
};

function readCSV(filePath, opts = {}) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return parse(content, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      relax_column_count: true,
      bom: true,
      ...opts,
    });
  } catch (e) {
    console.warn(`Warning: Could not read ${filePath}: ${e.message}`);
    return [];
  }
}

function normalizeURL(url) {
  if (!url) return null;
  return url.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '').toLowerCase();
}

function extractPath(url) {
  if (!url) return '/';
  const m = url.match(/https?:\/\/[^/]+(\/.*)?$/);
  return m ? (m[1] || '/') : (url.startsWith('/') ? url : '/' + url);
}

function buildUrl(row) {
  const slug = row.post_name || row.slug || '';
  const type = (row.post_type || '').toLowerCase();
  if (type === 'post') return `${CONFIG.wordpressBase}/blog/${slug}`;
  if (type === 'page') return slug ? `${CONFIG.wordpressBase}/${slug}` : CONFIG.wordpressBase + '/';
  return `${CONFIG.wordpressBase}/${type}/${slug}`;
}

function determinePriority(gscData) {
  if (!gscData) return 'tier4';
  const clicks = parseInt(gscData.clicks || 0, 10);
  const impressions = parseInt(gscData.impressions || 0, 10);
  if (clicks >= PRIORITY_THRESHOLDS.tier1.clicks || impressions >= PRIORITY_THRESHOLDS.tier1.impressions) return 'tier1';
  if (clicks >= PRIORITY_THRESHOLDS.tier2.clicks || impressions >= PRIORITY_THRESHOLDS.tier2.impressions) return 'tier2';
  if (clicks >= PRIORITY_THRESHOLDS.tier3.clicks || impressions >= PRIORITY_THRESHOLDS.tier3.impressions) return 'tier3';
  return 'tier4';
}

// Detect format: query result has "url" and "meta_title"; raw has "post_name" and "post_type"
function isQueryResultFormat(rows) {
  if (!rows.length) return false;
  const first = rows[0];
  return 'url' in first && ('meta_title' in first || 'post_title' in first);
}

// Build Yoast metadata map from raw wp_postmeta CSV
function buildYoastMap(metaPath) {
  const rows = readCSV(metaPath);
  const byPost = {};
  for (const row of rows) {
    const postId = row.post_id || row.post_ID;
    const key = row.meta_key;
    const val = row.meta_value;
    if (!postId || !key || !YOAST_KEYS[key]) continue;
    if (!byPost[postId]) byPost[postId] = {};
    byPost[postId][YOAST_KEYS[key]] = val || '';
  }
  return byPost;
}

// Get WordPress URLs: from query-result CSV or from wp_posts CSV + optional postmeta
function getWordPressData() {
  const metaPath = path.join(__dirname, 'wordpress-metadata.csv');
  const urlsPath = path.join(__dirname, 'wordpress-urls.csv');

  let rows = readCSV(urlsPath);
  if (!rows.length) {
    console.log('No wordpress-urls.csv or empty. Trying wordpress-metadata.csv as query result...');
    const metaRows = readCSV(metaPath);
    if (isQueryResultFormat(metaRows)) {
      rows = metaRows;
    }
  }

  const yoastByPost = {};
  const metaRows = readCSV(metaPath);
  if (metaRows.length && metaRows[0].meta_key !== undefined) {
    Object.assign(yoastByPost, buildYoastMap(metaPath));
  }

  const result = [];
  const baseUrl = CONFIG.wordpressBase.replace(/\/$/, '');

  for (const row of rows) {
    if (isQueryResultFormat(rows)) {
      const url = row.url || '';
      if (!url) continue;
      result.push({
        id: row.ID,
        url,
        path: extractPath(url),
        slug: row.slug || '',
        post_type: row.post_type || 'page',
        post_title: row.post_title || '',
        meta_title: row.meta_title || row.post_title || '',
        meta_description: row.meta_description || '',
        og_title: row.og_title || '',
        og_description: row.og_description || '',
        og_image: row.og_image || '',
        canonical_url: row.canonical_url || url,
        focus_keyword: row.focus_keyword || '',
        published_date: row.post_date || '',
        modified_date: row.post_modified || '',
      });
      continue;
    }

    const postType = (row.post_type || '').toLowerCase();
    const postStatus = (row.post_status || '').toLowerCase();
    if (postStatus !== 'publish') continue;
    if (postType !== 'post' && postType !== 'page') continue;

    const id = row.ID;
    const slug = row.post_name || row.slug || '';
    const postTitle = row.post_title || '';
    const url = buildUrl({ post_name: slug, post_type: postType });
    const meta = yoastByPost[id] || {};

    result.push({
      id,
      url,
      path: extractPath(url),
      slug,
      post_type: postType,
      post_title: postTitle,
      meta_title: meta.meta_title || postTitle,
      meta_description: meta.meta_description || '',
      og_title: meta.og_title || '',
      og_description: meta.og_description || '',
      og_image: meta.og_image || '',
      canonical_url: meta.canonical_url || url,
      focus_keyword: meta.focus_keyword || '',
      published_date: row.post_date || '',
      modified_date: row.post_modified || '',
    });
  }

  return result;
}

function getGSCMap() {
  const pagesPath = path.join(__dirname, 'gsc-pages-report.csv');
  const clicksPath = path.join(__dirname, 'gsc-top-pages-by-clicks.csv');
  const map = new Map();

  if (!fs.existsSync(pagesPath)) {
    console.log('GSC pages report not found; priorities will be tier4.');
    return map;
  }

  const pagesData = readCSV(pagesPath);
  const keyPage = pagesData[0] && (pagesData[0]['Page'] !== undefined || pagesData[0]['Top pages'] !== undefined)
    ? (pagesData[0]['Page'] !== undefined ? 'Page' : 'Top pages')
    : 'Page';
  const keyClicks = pagesData[0] && (pagesData[0]['Clicks'] !== undefined) ? 'Clicks' : 'Clicks';
  const keyImpr = pagesData[0] && (pagesData[0]['Impressions'] !== undefined) ? 'Impressions' : 'Impressions';
  const keyPos = pagesData[0] && (pagesData[0]['Position'] !== undefined) ? 'Position' : (pagesData[0]['Average position'] !== undefined ? 'Average position' : 'Position');

  for (const row of pagesData) {
    const url = row[keyPage] || row['URL'] || '';
    const norm = normalizeURL(url);
    if (!norm) continue;
    map.set(norm, {
      url,
      clicks: row[keyClicks] || 0,
      impressions: row[keyImpr] || 0,
      position: row[keyPos] != null ? row[keyPos] : null,
    });
  }

  if (fs.existsSync(clicksPath)) {
    const clicksData = readCSV(clicksPath);
    const cKey = clicksData[0] && clicksData[0]['Top pages'] !== undefined ? 'Top pages' : 'Page';
    for (const row of clicksData) {
      const url = row[cKey] || row['URL'] || '';
      const norm = normalizeURL(url);
      if (norm && map.has(norm)) {
        const o = map.get(norm);
        o.clicks = row['Clicks'] != null ? row['Clicks'] : o.clicks;
        o.impressions = row['Impressions'] != null ? row['Impressions'] : o.impressions;
      }
    }
  }

  return map;
}

function buildMigrationMap(wpData, gscMap) {
  const preserved = [];
  const redirects = [];
  const deprecated = [];

  for (const wp of wpData) {
    const norm = normalizeURL(wp.url);
    const gsc = gscMap.get(norm);
    const priority = determinePriority(gsc);

    preserved.push({
      old_url: wp.path,
      new_url: wp.path,
      status: 'preserved',
      priority,
      content_type: wp.post_type,
      post_id: wp.id,
      slug: wp.slug,
      meta_title: wp.meta_title,
      meta_description: wp.meta_description,
      og_title: wp.og_title,
      og_description: wp.og_description,
      og_image: wp.og_image,
      canonical_url: wp.canonical_url,
      focus_keyword: wp.focus_keyword,
      gsc_clicks: gsc ? parseInt(gsc.clicks, 10) : 0,
      gsc_impressions: gsc ? parseInt(gsc.impressions, 10) : 0,
      gsc_position: gsc && gsc.position != null ? gsc.position : null,
      notes: `Priority: ${priority.toUpperCase()} - Preserve exactly`,
    });
  }

  gscMap.forEach((gsc, norm) => {
    if (preserved.some((p) => normalizeURL(CONFIG.wordpressBase + p.old_url) === norm)) return;
    if (parseInt(gsc.clicks, 10) > 0 || parseInt(gsc.impressions, 10) > 0) {
      preserved.push({
        old_url: extractPath(gsc.url),
        new_url: extractPath(gsc.url),
        status: 'orphaned_in_gsc',
        priority: determinePriority(gsc),
        content_type: 'unknown',
        gsc_clicks: parseInt(gsc.clicks, 10),
        gsc_impressions: parseInt(gsc.impressions, 10),
        notes: 'Indexed in GSC but not in WordPress - investigate',
      });
    }
  });

  return { preserved, redirects, deprecated };
}

function main() {
  console.log('\n🚀 WordPress Audit Data Processing...\n');

  const wpData = getWordPressData();
  console.log(`📊 WordPress URLs (post/page): ${wpData.length}`);

  const gscMap = getGSCMap();
  console.log(`📊 GSC indexed URLs: ${gscMap.size}`);

  const { preserved, redirects, deprecated } = buildMigrationMap(wpData, gscMap);

  const mapPath = path.join(__dirname, '..', '..', 'URL_MIGRATION_MAP.json');
  const existing = JSON.parse(fs.readFileSync(mapPath, 'utf-8'));

  existing.metadata.last_updated = new Date().toISOString().split('T')[0];
  existing.metadata.total_urls = wpData.length;
  existing.metadata.preserved_count = preserved.length;
  existing.metadata.redirect_count = redirects.length;
  existing.metadata.deprecated_count = deprecated.length;
  existing.preserved = preserved;
  existing.redirects = redirects;
  existing.deprecated = deprecated;

  fs.writeFileSync(mapPath, JSON.stringify(existing, null, 2), 'utf-8');

  const t1 = preserved.filter((p) => p.priority === 'tier1').length;
  const t2 = preserved.filter((p) => p.priority === 'tier2').length;
  const t3 = preserved.filter((p) => p.priority === 'tier3').length;
  const t4 = preserved.filter((p) => p.priority === 'tier4').length;

  console.log('\n✅ Done.\n');
  console.log('   Preserved:', preserved.length);
  console.log('   Tier 1:', t1, '| Tier 2:', t2, '| Tier 3:', t3, '| Tier 4:', t4);
  console.log('\n📄 Updated:', mapPath);
}

if (require.main === module) {
  try {
    main();
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

module.exports = { getWordPressData, getGSCMap, buildMigrationMap };
