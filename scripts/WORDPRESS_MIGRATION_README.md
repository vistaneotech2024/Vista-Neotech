# WordPress to Supabase Migration Guide

## Overview

This guide helps you migrate WordPress content (pages, blog posts, images, and SEO metadata) from a WordPress export file (.wpress) into your Supabase database.

## Prerequisites

1. **WordPress Export File**: `.wpress` file located in `wordpress_file/` directory
2. **Supabase Credentials**: Configured in `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```
3. **Node.js Dependencies**: Install required packages:
   ```bash
   npm install adm-zip xml2js dotenv @supabase/supabase-js
   ```

## Migration Process

### Option 1: Using WordPress XML Export (Recommended)

The easiest way is to export WordPress content as XML:

1. **Export from WordPress**:
   - Login to WordPress admin
   - Go to **Tools → Export**
   - Select **All content**
   - Download XML file
   - Save as `wordpress-export.xml` in `wordpress_file/` directory

2. **Run Migration Script**:
   ```bash
   node scripts/migrate-wordpress.js
   ```

### Option 2: Using .wpress File

1. **Extract .wpress File**:
   The script will automatically extract the `.wpress` file (it's a ZIP archive)

2. **Run Migration**:
   ```bash
   node scripts/migrate-wordpress.js
   ```

### Option 3: Using Database CSV Exports (Most Reliable)

For the most accurate migration with all SEO metadata:

1. **Export WordPress Data** (using SQL queries from `scripts/audit/`):
   - Run `extract-wordpress-urls.sql` to get posts/pages
   - Run `QUERY_2_METADATA_ONLY.sql` to get SEO metadata
   - Export results as CSV files

2. **Process CSV Files**:
   ```bash
   node scripts/audit/process-audit-data.js
   ```

3. **Import to Supabase**:
   Use the migration script with CSV data or manually import via Supabase dashboard

## What Gets Migrated

### ✅ Content
- **Pages**: All published pages with titles, content, slugs
- **Blog Posts**: All published posts with titles, content, slugs
- **SEO Metadata**:
  - Meta titles and descriptions
  - Focus keywords
  - Canonical URLs
  - Open Graph tags (title, description, image)
  - Twitter Card data

### ⚠️ Requires Manual Setup
- **Media Files**: Images need to be uploaded to Supabase Storage
- **Categories & Tags**: Taxonomy relationships
- **Users**: Author information
- **Custom Fields**: May need manual mapping

## Migration Script Features

The `migrate-wordpress.js` script:

1. **Extracts** `.wpress` file (ZIP archive)
2. **Parses** WordPress XML export or SQL dump
3. **Processes** content (removes shortcodes, cleans HTML)
4. **Imports** pages and posts to Supabase
5. **Preserves** SEO metadata (Yoast SEO compatible)
6. **Skips** duplicates (checks existing slugs)

## Post-Migration Steps

### 1. Verify Content

Check Supabase dashboard:
- Review imported pages: `SELECT * FROM pages WHERE status = 'published'`
- Review imported posts: `SELECT * FROM posts WHERE status = 'published'`
- Verify SEO metadata is present

### 2. Update URL Mapping

If needed, update `URL_MIGRATION_MAP.json`:
```bash
node scripts/audit/process-audit-data.js
```

### 3. Migrate Media Files

**Option A: Manual Upload**
- Upload images to Supabase Storage bucket `media`
- Update `media` table with file references

**Option B: Automated Script** (to be created):
```bash
node scripts/migrate-media.js
```

### 4. Test Pages

- Visit imported pages on your site
- Verify content displays correctly
- Check SEO metadata in page source
- Test blog post listing and individual posts

### 5. Set Up Redirects

If URLs changed, create redirects in `redirects` table:
```sql
INSERT INTO redirects (source_url, destination_url, redirect_type)
VALUES ('/old-url', '/new-url', 301);
```

## Troubleshooting

### Issue: "Supabase credentials not found"
**Solution**: Ensure `.env.local` has:
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` (or `NEXT_PUBLIC_SUPABASE_ANON_KEY`)

### Issue: "No SQL dump file found"
**Solution**: 
- Export WordPress as XML instead (Tools → Export)
- Or use CSV exports with `process-audit-data.js`

### Issue: "Duplicate key error"
**Solution**: The script skips existing slugs. To re-import:
- Delete existing records, or
- Update the script to handle updates

### Issue: "Content not displaying correctly"
**Solution**:
- Check content processing in `processContent()` function
- WordPress shortcodes may need custom handlers
- HTML may need sanitization

### Issue: "Media files not migrated"
**Solution**: Media migration requires:
- Supabase Storage bucket setup (`scripts/setup-supabase-storage.sql`)
- Manual upload or custom script for bulk uploads

## SEO Preservation Checklist

- [x] All URLs preserved (check `URL_MIGRATION_MAP.json`)
- [x] Meta titles migrated
- [x] Meta descriptions migrated
- [x] Canonical URLs set
- [x] Open Graph tags preserved
- [x] Focus keywords maintained
- [ ] Images optimized and migrated
- [ ] Internal links updated
- [ ] Sitemap regenerated
- [ ] 301 redirects configured (if URLs changed)

## Advanced: Custom Content Processing

To handle WordPress-specific content:

1. **Shortcodes**: Add handlers in `processContent()`
2. **Gutenberg Blocks**: Parse block JSON if using block editor
3. **Custom Post Types**: Extend import functions
4. **ACF Fields**: Map to `custom_fields` JSONB column

## Support

For issues or questions:
1. Check migration logs in console output
2. Review Supabase dashboard for errors
3. Verify database schema matches `database/schema.sql`
4. Check WordPress export file format

## Next Steps

After successful migration:
1. ✅ Content imported
2. ⏭️ Set up image optimization
3. ⏭️ Configure redirects
4. ⏭️ Update sitemap
5. ⏭️ Test SEO metadata
6. ⏭️ Monitor Google Search Console
