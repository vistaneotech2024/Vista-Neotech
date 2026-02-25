# WordPress Audit - Quick Start Guide
## For Vista Neotech (https://vistaneotech.com)

**Status:** Ready to extract data  
**Site:** https://vistaneotech.com  
**SEO Plugin:** Yoast SEO  
**Pages/Posts:** ~150  
**Access:** Database + Google Search Console ✅

---

## 🚀 Step-by-Step Instructions

### Step 1: Extract WordPress Data (Choose One Method)

#### **Method A: SQL Queries (Recommended - Most Complete)**

1. **Open your database tool:**
   - phpMyAdmin, MySQL Workbench, or your preferred MySQL client
   - Connect to your WordPress database

2. **Run SQL queries:**
   - Open `scripts/audit/extract-wordpress-urls.sql`
   - Run each query section (they're numbered 1-7)
   - Export results as CSV with these names:
     - `wordpress-urls.csv`
     - `wordpress-metadata.csv` ⭐ **Most Important**
     - `wordpress-categories.csv`
     - `wordpress-post-categories.csv`
     - `wordpress-internal-links.csv`
     - `wordpress-post-types.csv`
     - `wordpress-redirects.csv` (if you have redirects)

3. **Save CSV files** in `scripts/audit/` directory

**Note:** If your WordPress table prefix is not `wp_`, replace `wp_` in the SQL queries with your actual prefix (check `wp-config.php`).

---

#### **Method B: WordPress Admin Export (Simpler but Less Complete)**

1. Login to WordPress admin: https://vistaneotech.com/wp-admin
2. Go to **Tools → Export**
3. Select **All content**
4. Click **Download Export File**
5. Save as: `wordpress-export.xml` in `scripts/audit/` directory

**Limitation:** This won't include Yoast SEO metadata. You'll still need to run the SQL query for metadata.

---

### Step 2: Export Google Search Console Data

1. **Go to Google Search Console:**
   - https://search.google.com/search-console
   - Select property: `https://vistaneotech.com`

2. **Export Pages Report:**
   - Navigate to **Performance** → **Pages**
   - Set date range: **Last 12 months**
   - Click **Export** → **Download CSV**
   - Save as: `gsc-pages-report.csv` in `scripts/audit/` directory

3. **Export Top Pages by Clicks:**
   - In **Performance** → **Pages**
   - Sort by **Clicks** (descending)
   - Export top 100
   - Save as: `gsc-top-pages-by-clicks.csv` in `scripts/audit/` directory

4. **Export Top Pages by Impressions (Optional but Recommended):**
   - Sort by **Impressions** (descending)
   - Export top 100
   - Save as: `gsc-top-pages-by-impressions.csv` in `scripts/audit/` directory

---

### Step 3: Process the Data

**Option A: Automated Processing (Recommended)**

1. **Install Node.js dependencies:**
   ```bash
   cd scripts/audit
   npm install
   ```

2. **Run the processor:**
   ```bash
   npm run process
   ```

3. **Review the output:**
   - Check `URL_MIGRATION_MAP.json` (updated automatically)
   - Review the console output for summary statistics

**Option B: Manual Processing**

1. Share the CSV files with me
2. I'll process them and populate `URL_MIGRATION_MAP.json`
3. You'll get a complete migration map with priorities

---

## 📋 Required Files Checklist

### WordPress Data (Choose One)
- [ ] **Option A:** SQL exports (7 CSV files) OR
- [ ] **Option B:** WordPress XML export + SQL metadata query

### Google Search Console Data
- [ ] `gsc-pages-report.csv` ⭐ **Required**
- [ ] `gsc-top-pages-by-clicks.csv` ⭐ **Required**
- [ ] `gsc-top-pages-by-impressions.csv` (Recommended)

---

## 📊 What Happens Next

Once you provide the data (or run the processor), I will:

1. ✅ **Cross-reference** WordPress URLs with GSC indexed URLs
2. ✅ **Create priority matrix:**
   - Tier 1: Top 20 pages (must preserve exactly)
   - Tier 2: Pages 21-50 (high priority)
   - Tier 3: All other indexed pages
   - Tier 4: Low/no traffic pages
3. ✅ **Populate `URL_MIGRATION_MAP.json`** with:
   - All preserved URLs
   - Metadata (titles, descriptions, OG tags)
   - GSC performance data
   - Priority tiers
4. ✅ **Identify gaps:**
   - Orphaned URLs (in GSC but not WordPress)
   - Missing metadata
   - Internal link structure
5. ✅ **Complete Phase 0** and prepare for Phase 1

---

## 🔍 Quick SQL Query (If You Just Want Metadata)

If you only want to run one query, run this (most important):

```sql
-- YOAST SEO METADATA EXTRACTION
SELECT 
    p.ID,
    p.post_title,
    p.post_name AS slug,
    p.post_type,
    CONCAT('https://vistaneotech.com/', 
        CASE 
            WHEN p.post_type = 'post' THEN CONCAT('blog/', p.post_name)
            WHEN p.post_type = 'page' THEN p.post_name
            ELSE CONCAT(p.post_type, '/', p.post_name)
        END
    ) AS url,
    COALESCE(NULLIF(pm_title.meta_value, ''), p.post_title) AS meta_title,
    pm_desc.meta_value AS meta_description,
    pm_og_title.meta_value AS og_title,
    pm_og_desc.meta_value AS og_description,
    pm_og_image.meta_value AS og_image,
    pm_canonical.meta_value AS canonical_url
FROM wp_posts p
LEFT JOIN wp_postmeta pm_title ON p.ID = pm_title.post_id AND pm_title.meta_key = '_yoast_wpseo_title'
LEFT JOIN wp_postmeta pm_desc ON p.ID = pm_desc.post_id AND pm_desc.meta_key = '_yoast_wpseo_metadesc'
LEFT JOIN wp_postmeta pm_og_title ON p.ID = pm_og_title.post_id AND pm_og_title.meta_key = '_yoast_wpseo_opengraph-title'
LEFT JOIN wp_postmeta pm_og_desc ON p.ID = pm_og_desc.post_id AND pm_og_desc.meta_key = '_yoast_wpseo_opengraph-description'
LEFT JOIN wp_postmeta pm_og_image ON p.ID = pm_og_image.post_id AND pm_og_image.meta_key = '_yoast_wpseo_opengraph-image'
LEFT JOIN wp_postmeta pm_canonical ON p.ID = pm_canonical.post_id AND pm_canonical.meta_key = '_yoast_wpseo_canonical'
WHERE p.post_status = 'publish'
    AND p.post_type IN ('post', 'page')
ORDER BY p.post_type, p.post_date DESC;
```

Export as: `wordpress-metadata.csv`

---

## ❓ Troubleshooting

### "Table 'wp_posts' doesn't exist"
- Your WordPress uses a different table prefix
- Check `wp-config.php` for `$table_prefix`
- Replace `wp_` in queries with your prefix

### "No data in GSC export"
- Make sure you're exporting from the correct property
- Check date range (use maximum available)
- Verify you have admin access to GSC

### "CSV files not processing"
- Ensure CSV files are in `scripts/audit/` directory
- Check file names match exactly
- Verify CSV format (UTF-8 encoding)

---

## 📞 Need Help?

If you encounter issues:
1. Check `scripts/audit/README.md` for detailed instructions
2. Review `WORDPRESS_AUDIT_REQUIREMENTS.md` for alternative methods
3. Share the error message and I'll help troubleshoot

---

## ✅ Success Criteria

Phase 0 is complete when:
- [ ] All WordPress URLs extracted
- [ ] All metadata (Yoast) extracted
- [ ] GSC data exported and cross-referenced
- [ ] `URL_MIGRATION_MAP.json` populated with priorities
- [ ] Priority matrix created (Tier 1-4)
- [ ] Ready to proceed to Phase 1: Information Architecture

---

**Last Updated:** February 5, 2026  
**Next:** Complete audit → Phase 1
