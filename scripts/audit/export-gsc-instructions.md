# Google Search Console Export Instructions
## For Vista Neotech SEO Audit

**Purpose:** Export indexed URLs and performance data to identify top-performing pages.

---

## 📊 Required Exports

### 1. Pages Report (Most Important)

**Steps:**
1. Go to [Google Search Console](https://search.google.com/search-console)
2. Select property: `https://vistaneotech.com`
3. Navigate to **Performance** → **Pages** tab
4. Set date range: **Last 12 months** (or maximum available)
5. Click **Export** button (top right)
6. Choose **Google Sheets** or **Download CSV**
7. Save as: `gsc-pages-report.csv`

**What this gives:**
- All indexed URLs
- Clicks per URL
- Impressions per URL
- Average position
- CTR (Click-Through Rate)

---

### 2. Top Pages by Clicks

**Steps:**
1. In **Performance** → **Pages**
2. Sort by **Clicks** (descending)
3. Export top 100 pages
4. Save as: `gsc-top-pages-by-clicks.csv`

**Purpose:** Identify Tier 1 pages (must preserve exactly)

---

### 3. Top Pages by Impressions

**Steps:**
1. In **Performance** → **Pages**
2. Sort by **Impressions** (descending)
3. Export top 100 pages
4. Save as: `gsc-top-pages-by-impressions.csv`

**Purpose:** Identify pages with high visibility (even if low clicks)

---

### 4. Queries Report (Optional but Recommended)

**Steps:**
1. Navigate to **Performance** → **Queries** tab
2. Set date range: **Last 12 months**
3. Click **Export**
4. Save as: `gsc-queries-report.csv`

**What this gives:**
- Top search queries
- Which pages rank for which queries
- Search volume and performance

---

### 5. Coverage Report (Index Status)

**Steps:**
1. Navigate to **Coverage** → **Valid** tab
2. Click **Export** (if available)
3. Or manually note:
   - Total indexed pages
   - Any errors or warnings
   - Excluded pages

**Purpose:** Understand indexing status and issues

---

## 📋 Export Checklist

- [ ] Pages Report (all indexed URLs) - `gsc-pages-report.csv`
- [ ] Top 100 pages by clicks - `gsc-top-pages-by-clicks.csv`
- [ ] Top 100 pages by impressions - `gsc-top-pages-by-impressions.csv`
- [ ] Queries Report (optional) - `gsc-queries-report.csv`
- [ ] Coverage status notes

---

## 🔍 What I'll Do With GSC Data

1. **Cross-reference** WordPress URLs with GSC indexed URLs
2. **Identify gaps:**
   - URLs indexed in GSC but not in WordPress (orphaned)
   - URLs in WordPress but not indexed (low priority)
3. **Create priority matrix:**
   - Tier 1: Top 20 pages by clicks + impressions
   - Tier 2: Pages 21-50
   - Tier 3: All other indexed pages
   - Tier 4: Non-indexed pages
4. **Build traffic-based migration priority**

---

## 📤 After Export

**Share the CSV files:**
- Upload to shared drive, or
- Email the files, or
- Place in project directory

**Files needed:**
- `gsc-pages-report.csv` (required)
- `gsc-top-pages-by-clicks.csv` (required)
- `gsc-top-pages-by-impressions.csv` (recommended)
- `gsc-queries-report.csv` (optional)

---

**Last Updated:** February 5, 2026
