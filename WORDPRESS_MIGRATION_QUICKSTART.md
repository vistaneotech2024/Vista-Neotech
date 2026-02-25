# WordPress Migration Quick Start Guide

## 🎯 Overview

This guide will help you migrate your WordPress content (pages, blog posts, images, and SEO data) from the `.wpress` export file into your Supabase database.

## ✅ Prerequisites

1. **WordPress Export File**: `wordpress_file/vistaneotech.com-20260220-105017-140.wpress` ✅ (Found)
2. **Supabase Setup**: Database schema created (`database/schema.sql`)
3. **Environment Variables**: Configured in `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```
4. **Dependencies Installed**: Run `npm install` (adm-zip, xml2js already installed)

## 🚀 Quick Start (3 Steps)

### Step 1: Extract WordPress Data

Extract and parse the `.wpress` file:

```bash
npm run migrate:extract
```

**What this does:**
- Extracts the `.wpress` ZIP archive
- Finds WordPress XML export file
- Parses pages, posts, and SEO metadata
- Saves processed data to `wordpress_file/processed/`

**Output:**
- `wordpress_file/processed/pages.json` - All pages with SEO data
- `wordpress_file/processed/posts.json` - All blog posts with SEO data

### Step 2: Import to Supabase

Import the processed data into your Supabase database:

```bash
npm run migrate:import
```

**What this does:**
- Reads processed JSON files
- Imports pages to `pages` table
- Imports posts to `posts` table
- Preserves all SEO metadata (Yoast SEO compatible)
- Skips duplicates (checks existing slugs)

**Expected Output:**
```
📄 Importing pages...
   ✅ Imported: about-us
   ✅ Imported: contact
   ...
✅ Pages: 45 imported, 0 skipped, 0 errors

📝 Importing posts...
   ✅ Imported: best-marketing-plans-for-mlm
   ✅ Imported: goals-achievement-in-mlm
   ...
✅ Posts: 70 imported, 0 skipped, 0 errors
```

### Step 3: Verify Migration

1. **Check Supabase Dashboard**:
   - Go to your Supabase project
   - Check `pages` table: Should have all imported pages
   - Check `posts` table: Should have all imported posts
   - Verify SEO fields are populated

2. **Test on Your Site**:
   - Visit `/blog` - Should show all blog posts
   - Visit individual pages (e.g., `/about-us`)
   - Check page source for SEO metadata

## 🔄 Full Migration (One Command)

Run both steps at once:

```bash
npm run migrate:full
```

## 📊 What Gets Migrated

### ✅ Content Migrated
- ✅ **Pages**: All published pages with titles, content, slugs
- ✅ **Blog Posts**: All published posts with titles, content, slugs
- ✅ **SEO Metadata**:
  - Meta titles and descriptions
  - Focus keywords
  - Canonical URLs
  - Open Graph tags (title, description, image)
  - Twitter Card data
- ✅ **URLs Preserved**: All WordPress URLs maintained

### ⚠️ Requires Manual Setup
- **Media Files**: Images need to be uploaded to Supabase Storage
- **Categories & Tags**: Taxonomy relationships (if needed)
- **Users**: Author information (migration user created automatically)
- **Custom Fields**: May need manual mapping

## 🖼️ Media Files Migration

Media files are **not automatically migrated**. To migrate images:

### Option 1: Manual Upload (Recommended for now)
1. Extract WordPress uploads folder from `.wpress` file
2. Upload images to Supabase Storage bucket `media`
3. Update `media` table with file references

### Option 2: Automated Script (To be created)
```bash
node scripts/migrate-media.js
```

## 🔍 Troubleshooting

### Issue: "WordPress file not found"
**Solution**: Ensure `.wpress` file is at:
```
wordpress_file/vistaneotech.com-20260220-105017-140.wpress
```

### Issue: "Supabase credentials not found"
**Solution**: Check `.env.local` has:
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

### Issue: "No XML export found"
**Solution**: 
- The `.wpress` file might not contain XML export
- Export WordPress manually: **Tools → Export → All content**
- Save XML file to `wordpress_file/extracted/`

### Issue: "Duplicate key error"
**Solution**: The script skips existing slugs. To re-import:
- Delete existing records in Supabase, or
- The script will skip them automatically

### Issue: "Content not displaying"
**Solution**:
- Check Supabase `pages` and `posts` tables
- Verify content field is populated
- Check Next.js page components are reading from database

## 📋 Post-Migration Checklist

- [ ] All pages imported (check Supabase dashboard)
- [ ] All posts imported (check Supabase dashboard)
- [ ] SEO metadata present (meta_title, meta_description)
- [ ] URLs preserved (check URL_MIGRATION_MAP.json)
- [ ] Pages display correctly on site
- [ ] Blog posts list correctly
- [ ] Individual posts render properly
- [ ] SEO metadata visible in page source
- [ ] Media files migrated (if applicable)
- [ ] Redirects configured (if URLs changed)

## 🎯 Next Steps

After successful migration:

1. **Verify Content**: Check all pages and posts display correctly
2. **Update URL Mapping**: Run `node scripts/audit/process-audit-data.js` if needed
3. **Migrate Media**: Upload images to Supabase Storage
4. **Test SEO**: Verify meta tags in page source
5. **Monitor**: Check Google Search Console for indexing

## 📚 Additional Resources

- **Migration Scripts**: `scripts/extract-wpress.js`, `scripts/migrate-to-supabase.js`
- **Database Schema**: `database/schema.sql`
- **URL Mapping**: `URL_MIGRATION_MAP.json`
- **Detailed Guide**: `scripts/WORDPRESS_MIGRATION_README.md`

## 🆘 Need Help?

If you encounter issues:

1. Check console output for error messages
2. Review Supabase dashboard for database errors
3. Verify database schema matches `database/schema.sql`
4. Check WordPress export file format

---

**Last Updated**: February 20, 2026  
**Status**: Ready for migration ✅
