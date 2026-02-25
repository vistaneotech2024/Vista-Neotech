# WordPress Audit Requirements
## Phase 0: Data Collection for SEO Preservation

**Purpose:** Complete the SEO audit and populate `URL_MIGRATION_MAP.json` with actual WordPress data.

---

## 🔐 Access Options (Choose One)

### Option 1: Direct WordPress Access (Best)
**What you need:**
- WordPress admin login credentials
- FTP/SSH access to WordPress files (optional, for advanced analysis)

**What I can do with this:**
- Export all URLs via WP-CLI or database queries
- Extract metadata programmatically
- Map internal links automatically
- Document schema markup

---

### Option 2: Database Access (Alternative)
**What you need:**
- MySQL/PostgreSQL database credentials
- Database host, name, username, password
- Read-only access is sufficient

**What I can do with this:**
- Query `wp_posts` table for all posts/pages
- Query `wp_postmeta` for metadata
- Extract URLs, titles, descriptions, OG tags
- Map categories, tags, taxonomies

---

### Option 3: Manual Export + Google Search Console (Most Common)
**What you need:**
- WordPress export file (XML) - via Tools → Export
- Google Search Console access (or exported data)
- Screaming Frog crawl results (optional)

**What I can do with this:**
- Parse WordPress XML export
- Cross-reference with GSC indexed URLs
- Map URLs and metadata
- Identify gaps and priorities

---

### Option 4: Provided Data Files (No Access Needed)
**What you need to provide:**
- List of all WordPress URLs (CSV/Excel)
- Metadata export (titles, descriptions, OG tags)
- Google Search Console "Pages" report export
- Internal link structure (if available)

**What I can do with this:**
- Import and process provided data
- Populate `URL_MIGRATION_MAP.json`
- Create priority matrix
- Build redirect mapping

---

## 📊 Specific Data Needed

### 1. URL Inventory

**Required:**
- [ ] All post URLs (blog posts, custom post types)
- [ ] All page URLs (static pages)
- [ ] Category archive URLs (`/category/{slug}`)
- [ ] Tag archive URLs (`/tag/{slug}`)
- [ ] Date archive URLs (`/2024/`, `/2024/01/`, etc.)
- [ ] Custom post type archive URLs
- [ ] Author archive URLs (if applicable)

**Format:** CSV or JSON with columns:
```
url, type, slug, post_id, status, published_date
```

**Example:**
```csv
url,type,slug,post_id,status,published_date
https://vistaneotech.com/,page,home,1,publish,2020-01-01
https://vistaneotech.com/services/,page,services,2,publish,2020-01-02
https://vistaneotech.com/blog/post-title/,post,post-title,123,publish,2023-05-15
```

---

### 2. Metadata (Titles, Descriptions, OG Tags)

**Required for each URL:**
- [ ] Meta title (title tag)
- [ ] Meta description
- [ ] Open Graph title
- [ ] Open Graph description
- [ ] Open Graph image URL
- [ ] Twitter Card title
- [ ] Twitter Card description
- [ ] Twitter Card image URL
- [ ] Canonical URL
- [ ] Robots meta (index/noindex, follow/nofollow)

**Format:** CSV or JSON with columns:
```
url, meta_title, meta_description, og_title, og_description, og_image, canonical, robots
```

**Example:**
```csv
url,meta_title,meta_description,og_title,og_image,canonical,robots
https://vistaneotech.com/,Vista Neotech - Digital Transformation Experts,Leading technology firm...,Vista Neotech,https://vistaneotech.com/og-image.jpg,https://vistaneotech.com/,index,follow
```

---

### 3. Internal Link Structure

**Required:**
- [ ] Source URL → Target URL mapping
- [ ] Anchor text used
- [ ] Link context (surrounding text)

**Format:** CSV or JSON:
```
source_url, target_url, anchor_text, link_type
```

**Example:**
```csv
source_url,target_url,anchor_text,link_type
https://vistaneotech.com/,https://vistaneotech.com/services/,Our Services,internal
https://vistaneotech.com/blog/post-1/,https://vistaneotech.com/services/digital-transformation/,digital transformation,internal
```

**Tools to generate this:**
- Screaming Frog SEO Spider (crawl site, export internal links)
- WordPress plugin: "Internal Link Checker" or similar
- Manual export if small site

---

### 4. Schema Markup Inventory

**Required:**
- [ ] Which pages have schema markup
- [ ] Schema types used (Organization, Service, Article, FAQ, etc.)
- [ ] Schema content/values

**Format:** JSON or CSV:
```
url, schema_type, schema_data
```

**Example:**
```json
{
  "url": "https://vistaneotech.com/",
  "schema_type": "Organization",
  "schema_data": {
    "@type": "Organization",
    "name": "Vista Neotech",
    "logo": "https://vistaneotech.com/logo.png"
  }
}
```

**How to get this:**
- Use browser extension: "Schema Markup Validator"
- Or provide list of pages you know have schema
- Or I can crawl and extract if you provide site access

---

### 5. Google Search Console Data

**Required:**
- [ ] "Pages" report export (all indexed URLs)
- [ ] Top pages by clicks (last 12 months)
- [ ] Top pages by impressions
- [ ] Pages with backlinks (if available in GSC)

**How to export:**
1. Go to Google Search Console
2. Navigate to "Performance" → "Pages"
3. Click "Export" → Download CSV
4. Share the CSV file

**Alternative:** If you can't export, provide:
- Top 50 URLs by traffic
- Top 50 URLs by impressions
- Any URLs you know rank well

---

### 6. Blog Taxonomy

**Required:**
- [ ] All categories (name, slug, description, parent)
- [ ] All tags (name, slug, usage count)
- [ ] Custom taxonomies (if any)

**Format:** CSV or JSON:
```
taxonomy_type, name, slug, description, parent, count
```

**Example:**
```csv
taxonomy_type,name,slug,description,parent,count
category,Digital Transformation,digital-transformation,Our digital transformation services,,15
category,Cloud Services,cloud-services,Cloud computing solutions,,8
tag,AI,ai,Artificial intelligence topics,,23
```

---

### 7. Existing Redirects

**Required:**
- [ ] Current 301 redirects (from .htaccess or redirect plugin)
- [ ] Redirect source → target mapping

**Format:** CSV or JSON:
```
source_url, target_url, redirect_type, reason
```

**Example:**
```csv
source_url,target_url,redirect_type,reason
https://vistaneotech.com/old-page/,https://vistaneotech.com/new-page/,301,Page renamed
```

**Where to find:**
- `.htaccess` file (if using Apache)
- Redirect plugin settings (if using plugin like "Redirection")
- Server configuration files

---

## 🛠️ Tools & Methods to Collect Data

### Method 1: WordPress Admin Export (Easiest)

**Steps:**
1. Login to WordPress admin
2. Go to **Tools → Export**
3. Select "All content" or specific post types
4. Download XML file
5. Share XML file with me

**What this gives:**
- All posts/pages with content
- Categories and tags
- Authors
- Publication dates
- URLs (slugs)

**Limitations:**
- Doesn't include metadata (SEO plugin data)
- Doesn't include internal links
- May need additional exports for custom post types

---

### Method 2: SEO Plugin Export (If Using Yoast/RankMath)

**For Yoast SEO:**
1. Install "Yoast SEO" plugin (if not already)
2. Go to **SEO → Tools → Export**
3. Export SEO data
4. Share export file

**For Rank Math:**
1. Go to **Rank Math → Tools → Export**
2. Export SEO settings and data
3. Share export file

**What this gives:**
- Meta titles and descriptions
- OG tags
- Schema markup
- Focus keywords
- Internal linking suggestions

---

### Method 3: Database Query (If You Have DB Access)

**I can provide SQL queries to run:**

```sql
-- Get all published posts and pages
SELECT ID, post_title, post_name, post_type, post_status, post_date
FROM wp_posts
WHERE post_status = 'publish'
AND post_type IN ('post', 'page', 'your_custom_post_type');

-- Get meta titles and descriptions (Yoast example)
SELECT p.ID, p.post_name, p.post_type,
       pm1.meta_value as meta_title,
       pm2.meta_value as meta_description
FROM wp_posts p
LEFT JOIN wp_postmeta pm1 ON p.ID = pm1.post_id AND pm1.meta_key = '_yoast_wpseo_title'
LEFT JOIN wp_postmeta pm2 ON p.ID = pm2.post_id AND pm2.meta_key = '_yoast_wpseo_metadesc'
WHERE p.post_status = 'publish';
```

**Export results as CSV and share.**

---

### Method 4: Screaming Frog SEO Spider (Recommended)

**Steps:**
1. Download Screaming Frog SEO Spider (free version works)
2. Enter your WordPress site URL
3. Configure:
   - Set "Mode" to "List" (if you have sitemap) or "Spider"
   - Enable "Extract Schema Markup"
   - Enable "Extract Internal Links"
4. Run crawl
5. Export:
   - **Internal Links** → CSV
   - **All Outlinks** → CSV
   - **Page Titles** → CSV
   - **Meta Descriptions** → CSV
   - **Schema Markup** → CSV
6. Share exported CSV files

**What this gives:**
- Complete URL inventory
- Internal link structure
- Metadata extraction
- Schema markup
- Status codes
- Page titles

---

## 📋 Minimum Required Data (Quick Start)

**If you can only provide one thing, provide this:**

1. **WordPress XML Export** (Tools → Export → All content)
   - This gives me URLs, content, taxonomy

2. **Google Search Console "Pages" export**
   - This gives me what's actually indexed and performing

**With just these two, I can:**
- Create URL inventory
- Identify top-performing pages
- Build priority matrix
- Start migration mapping

**Missing data can be:**
- Extracted during migration
- Added manually
- Inferred from content

---

## 🚀 What I'll Do With The Data

Once you provide the data, I will:

1. **Parse and organize** all URLs
2. **Cross-reference** WordPress URLs with GSC indexed URLs
3. **Create priority matrix** (Tier 1, 2, 3, 4)
4. **Populate `URL_MIGRATION_MAP.json`** with:
   - All preserved URLs
   - Redirect mappings
   - Deprecated URLs (with justification)
5. **Generate reports:**
   - Top 50 pages by traffic
   - Internal link hub pages
   - Schema markup inventory
   - Metadata patterns
6. **Create migration checklist** based on priorities

---

## ❓ Questions to Answer

**To help prioritize, please answer:**

1. **What's your current WordPress site URL?**
   - Example: `https://vistaneotech.com`

2. **What SEO plugin are you using?**
   - Yoast SEO / Rank Math / All in One SEO / Other / None

3. **How many pages/posts approximately?**
   - Rough estimate: 50 / 100 / 500 / 1000+

4. **Do you have Google Search Console access?**
   - Yes / No / Can get access

5. **What's your preferred method?**
   - WordPress admin access
   - Database access
   - Manual export files
   - Screaming Frog crawl

6. **Any custom post types?**
   - Services / Case Studies / Team / Other

7. **Any existing redirects?**
   - Yes (via plugin/.htaccess) / No / Not sure

---

## 📞 Next Steps

**Choose your preferred method and provide:**

1. **Option A:** WordPress admin access → I'll extract everything
2. **Option B:** Database access → I'll query and export
3. **Option C:** Manual exports → You export, I process
4. **Option D:** Screaming Frog crawl → You crawl, I analyze

**Once I have the data, Phase 0 will be complete and we can proceed to Phase 1!**

---

**Last Updated:** February 5, 2026  
**Status:** Awaiting WordPress data
