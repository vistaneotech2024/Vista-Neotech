# WordPress Audit Scripts
## Phase 0: Data Extraction

**Purpose:** Extract WordPress data for SEO preservation audit.

---

## 📋 Prerequisites

- WordPress database access (MySQL/PostgreSQL)
- Google Search Console admin access
- ~150 pages/posts (as reported)

---

## 🚀 Quick Start

### Step 1: Extract WordPress Data

**Option A: Run SQL Queries (Recommended)**

1. Open your database management tool (phpMyAdmin, MySQL Workbench, etc.)
2. Select your WordPress database
3. Run queries from `extract-wordpress-urls.sql`
4. Export each query result as CSV:
   - `wordpress-urls.csv`
   - `wordpress-metadata.csv`
   - `wordpress-categories.csv`
   - `wordpress-post-categories.csv`
   - `wordpress-internal-links.csv`
   - `wordpress-post-types.csv`
   - `wordpress-redirects.csv` (if applicable)

**Option B: WordPress Admin Export**

1. Login to WordPress admin
2. Go to **Tools → Export**
3. Select **All content**
4. Download XML file
5. Save as: `wordpress-export.xml`

---

### Step 2: Export Google Search Console Data

Follow instructions in `export-gsc-instructions.md`:

1. Export Pages Report → `gsc-pages-report.csv`
2. Export Top Pages by Clicks → `gsc-top-pages-by-clicks.csv`
3. Export Top Pages by Impressions → `gsc-top-pages-by-impressions.csv`

---

### Step 3: Share Data Files

Place all exported files in this directory (`scripts/audit/`) or share via:
- Shared drive
- Email
- Project directory

**Required Files:**
- WordPress URLs/metadata (SQL export or XML)
- GSC Pages Report
- GSC Top Pages by Clicks

---

## 📊 Files Generated

After running scripts, you'll have:

```
scripts/audit/
├── extract-wordpress-urls.sql          # SQL queries
├── export-gsc-instructions.md          # GSC export guide
├── README.md                           # This file
├── wordpress-urls.csv                  # (To be generated)
├── wordpress-metadata.csv              # (To be generated)
├── wordpress-categories.csv            # (To be generated)
├── wordpress-post-categories.csv       # (To be generated)
├── wordpress-internal-links.csv        # (To be generated)
├── wordpress-post-types.csv            # (To be generated)
├── wordpress-redirects.csv             # (To be generated, if applicable)
├── gsc-pages-report.csv                # (To be generated)
├── gsc-top-pages-by-clicks.csv         # (To be generated)
└── gsc-top-pages-by-impressions.csv    # (To be generated)
```

---

## 🔧 SQL Query Notes

### Database Table Prefix

The SQL queries assume default WordPress table prefix `wp_`. If your WordPress uses a different prefix (e.g., `wp123_`), replace `wp_` in all queries.

**To find your prefix:**
- Check `wp-config.php` file
- Look for: `$table_prefix = 'wp_';`

### Custom Post Types

If you have custom post types beyond `post` and `page`, update the queries:
```sql
WHERE p.post_type IN ('post', 'page', 'your_custom_type')
```

### URL Structure

The SQL queries assume:
- Posts: `/blog/{slug}`
- Pages: `/{slug}`

If your WordPress uses different URL structure, adjust the `CONCAT` statements in the queries.

---

## ✅ Validation Checklist

After extraction, verify:

- [ ] All 150 pages/posts are in the export
- [ ] Metadata (titles, descriptions) are present
- [ ] Categories and tags are exported
- [ ] GSC data matches WordPress URLs
- [ ] No missing critical pages

---

## 📞 Next Steps

Once data is extracted:

1. **I'll process the data** and populate `URL_MIGRATION_MAP.json`
2. **Create priority matrix** based on GSC performance
3. **Identify internal link structure**
4. **Map redirects** (if any)
5. **Complete Phase 0** and proceed to Phase 1

---

**Last Updated:** February 5, 2026
