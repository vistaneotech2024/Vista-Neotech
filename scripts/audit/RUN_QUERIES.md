# How to Run WordPress Database Queries
## Step-by-Step Guide

**Database Access:** ✅ You have it!  
**Tool:** Use phpMyAdmin, MySQL Workbench, or your preferred MySQL client

---

## 🎯 Quick Start (Run These Queries in Order)

### Query 1: All Posts & Pages (Basic URL List)

**Purpose:** Get all published URLs

```sql
SELECT 
    p.ID,
    p.post_title,
    p.post_name AS slug,
    p.post_type,
    p.post_status,
    p.post_date,
    CONCAT('https://vistaneotech.com/', 
        CASE 
            WHEN p.post_type = 'post' THEN CONCAT('blog/', p.post_name)
            WHEN p.post_type = 'page' THEN p.post_name
            ELSE CONCAT(p.post_type, '/', p.post_name)
        END
    ) AS url
FROM npO_posts p
WHERE p.post_status = 'publish'
    AND p.post_type IN ('post', 'page')
ORDER BY p.post_type, p.post_date DESC;
```

**Export as:** `wordpress-urls.csv`

---

### Query 2: Yoast SEO Metadata ⭐ **MOST IMPORTANT**

**Purpose:** Get all SEO metadata (titles, descriptions, OG tags)

```sql
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
    pm_focus.meta_value AS focus_keyword,
    pm_og_title.meta_value AS og_title,
    pm_og_desc.meta_value AS og_description,
    pm_og_image.meta_value AS og_image,
    pm_twitter_title.meta_value AS twitter_title,
    pm_twitter_desc.meta_value AS twitter_description,
    pm_twitter_image.meta_value AS twitter_image,
    pm_canonical.meta_value AS canonical_url,
    pm_robots.meta_value AS robots_meta
FROM npO_posts p
LEFT JOIN npO_postmeta pm_title ON p.ID = pm_title.post_id AND pm_title.meta_key = '_yoast_wpseo_title'
LEFT JOIN npO_postmeta pm_desc ON p.ID = pm_desc.post_id AND pm_desc.meta_key = '_yoast_wpseo_metadesc'
LEFT JOIN npO_postmeta pm_focus ON p.ID = pm_focus.post_id AND pm_focus.meta_key = '_yoast_wpseo_focuskw'
LEFT JOIN npO_postmeta pm_og_title ON p.ID = pm_og_title.post_id AND pm_og_title.meta_key = '_yoast_wpseo_opengraph-title'
LEFT JOIN npO_postmeta pm_og_desc ON p.ID = pm_og_desc.post_id AND pm_og_desc.meta_key = '_yoast_wpseo_opengraph-description'
LEFT JOIN npO_postmeta pm_og_image ON p.ID = pm_og_image.post_id AND pm_og_image.meta_key = '_yoast_wpseo_opengraph-image'
LEFT JOIN npO_postmeta pm_twitter_title ON p.ID = pm_twitter_title.post_id AND pm_twitter_title.meta_key = '_yoast_wpseo_twitter-title'
LEFT JOIN npO_postmeta pm_twitter_desc ON p.ID = pm_twitter_desc.post_id AND pm_twitter_desc.meta_key = '_yoast_wpseo_twitter-description'
LEFT JOIN npO_postmeta pm_twitter_image ON p.ID = pm_twitter_image.post_id AND pm_twitter_image.meta_key = '_yoast_wpseo_twitter-image'
LEFT JOIN npO_postmeta pm_canonical ON p.ID = pm_canonical.post_id AND pm_canonical.meta_key = '_yoast_wpseo_canonical'
LEFT JOIN npO_postmeta pm_robots ON p.ID = pm_robots.post_id AND pm_robots.meta_key = '_yoast_wpseo_meta-robots'
WHERE p.post_status = 'publish'
    AND p.post_type IN ('post', 'page')
ORDER BY p.post_type, p.post_date DESC;
```

**Export as:** `wordpress-metadata.csv` ⭐ **REQUIRED**

---

### Query 3: Categories & Tags

**Purpose:** Get all categories and tags

```sql
SELECT 
    t.term_id,
    t.name AS category_name,
    t.slug AS category_slug,
    tt.taxonomy,
    tt.parent,
    tt.count AS post_count,
    CONCAT('https://vistaneotech.com/category/', t.slug) AS category_url
FROM npO_terms t
INNER JOIN npO_term_taxonomy tt ON t.term_id = tt.term_id
WHERE tt.taxonomy IN ('category', 'post_tag')
ORDER BY tt.taxonomy, tt.count DESC;
```

**Export as:** `wordpress-categories.csv`

---

### Query 4: Post-Category Relationships

**Purpose:** Map which posts belong to which categories/tags

```sql
SELECT 
    p.ID AS post_id,
    p.post_name AS post_slug,
    CONCAT('https://vistaneotech.com/blog/', p.post_name) AS post_url,
    t.name AS category_name,
    t.slug AS category_slug,
    tt.taxonomy
FROM npO_posts p
INNER JOIN npO_term_relationships tr ON p.ID = tr.object_id
INNER JOIN npO_term_taxonomy tt ON tr.term_taxonomy_id = tt.term_taxonomy_id
INNER JOIN npO_terms t ON tt.term_id = t.term_id
WHERE p.post_status = 'publish'
    AND p.post_type = 'post'
    AND tt.taxonomy IN ('category', 'post_tag')
ORDER BY p.ID, tt.taxonomy;
```

**Export as:** `wordpress-post-categories.csv`

---

## 📋 Instructions for phpMyAdmin

### Step 1: Access Database
1. Login to phpMyAdmin
2. Select your WordPress database from left sidebar
3. Click **SQL** tab at the top

### Step 2: Run Query 2 (Most Important)
1. Copy Query 2 (Yoast SEO Metadata) above
2. Paste into SQL query box
3. Click **Go** button
4. Wait for results

### Step 3: Export Results
1. After query runs, you'll see results table
2. Scroll to bottom
3. Click **Export** button
4. Choose format: **CSV**
5. Options:
   - ✅ **Put columns names in the first row**
   - ✅ **Remove CRLF characters**
6. Click **Go**
7. Save file as: `wordpress-metadata.csv`
8. Save in: `scripts/audit/` directory

### Step 4: Repeat for Other Queries
- Run Query 1 → Export as `wordpress-urls.csv`
- Run Query 3 → Export as `wordpress-categories.csv`
- Run Query 4 → Export as `wordpress-post-categories.csv`

---

## 📋 Instructions for MySQL Workbench

### Step 1: Connect to Database
1. Open MySQL Workbench
2. Connect to your WordPress database server
3. Select your WordPress database

### Step 2: Run Query
1. Open new query tab (File → New Query Tab)
2. Copy Query 2 (Yoast SEO Metadata)
3. Paste into query editor
4. Click **Execute** button (lightning bolt icon)

### Step 3: Export Results
1. Right-click on results grid
2. Select **Export Recordset to an External File**
3. Choose:
   - Format: **CSV**
   - File path: `scripts/audit/wordpress-metadata.csv`
   - ✅ **Include column headers**
4. Click **OK**

---

## ⚠️ Important Notes

### Table Prefix
✅ **Your WordPress uses prefix: `npO_`**

All queries have been updated to use `npO_` prefix:
- `npO_posts`
- `npO_postmeta`
- `npO_terms`
- `npO_term_taxonomy`
- `npO_term_relationships`

**No changes needed - queries are ready to run!**

### URL Structure Check
The queries assume:
- **Posts:** `/blog/{slug}`
- **Pages:** `/{slug}`

If your WordPress uses different URLs, let me know and I'll adjust the queries.

---

## ✅ Minimum Required Export

**To get started quickly, you only need:**

1. **Query 2** → `wordpress-metadata.csv` ⭐ **REQUIRED**
   - Contains all URLs + SEO metadata

2. **Google Search Console export** → `gsc-pages-report.csv` ⭐ **REQUIRED**
   - See `export-gsc-instructions.md` for details

With just these two files, I can:
- Build complete URL inventory
- Create priority matrix
- Populate `URL_MIGRATION_MAP.json`
- Complete Phase 0

---

## 🚀 After Exporting

1. **Save all CSV files** in `scripts/audit/` directory
2. **Export GSC data** (see `export-gsc-instructions.md`)
3. **Let me know** when files are ready, or
4. **Run processor:** `cd scripts/audit && npm install && npm run process`

---

## ❓ Troubleshooting

### "Table 'wp_posts' doesn't exist"
- Your WordPress uses different table prefix
- Check `wp-config.php` for `$table_prefix`
- Replace `wp_` with your prefix in queries

### "No results returned"
- Check you're querying the correct database
- Verify `post_status = 'publish'` matches your posts
- Check if `post_type` includes your custom types

### "CSV export has encoding issues"
- Use UTF-8 encoding
- In phpMyAdmin: Choose "UTF-8" in export options
- In MySQL Workbench: Set charset to UTF-8

---

**Ready? Start with Query 2 (Yoast SEO Metadata) - that's the most important one!**
