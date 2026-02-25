# SEO Preservation Strategy
## Phase 0: Discovery & SEO Forensics

**Last Updated:** February 5, 2026  
**Status:** Discovery Phase - Pre-Migration  
**Objective:** Zero SEO Loss During WordPress → Next.js Migration

---

## 🎯 Strategic Context

Vista Neotech Private Limited is migrating from WordPress to Next.js while preserving:
- **Search engine authority** (existing rankings)
- **Indexed URL equity** (no orphaned pages)
- **Internal link structure** (link juice preservation)
- **Content taxonomy** (blog categories, tags, hierarchies)
- **Schema markup** (structured data continuity)

**Non-Negotiable:** Every indexed URL must either:
1. Be preserved with identical content + metadata
2. Be redirected via 301 (no chains, no 302s)
3. Be documented with justification if deprecated

---

## 📊 SEO Audit Checklist

### 1. URL Inventory & Indexation Status

**Tasks:**
- [ ] Export all WordPress URLs (posts, pages, categories, tags, archives)
- [ ] Cross-reference with Google Search Console (GSC) indexed URLs
- [ ] Identify orphaned URLs (indexed but not in WordPress)
- [ ] Map URL patterns (date-based, category-based, custom post types)
- [ ] Document URL structure depth and hierarchy

**Tools:**
- WordPress: Export via WP-CLI or database query
- GSC: Export "Pages" report
- Screaming Frog: Crawl existing site
- Ahrefs/SEMrush: Historical ranking data

**Output:** `url-inventory.csv`

---

### 2. Top-Performing Pages Analysis

**Metrics to Extract:**
- [ ] Top 50 pages by organic traffic (last 12 months)
- [ ] Top 50 pages by ranking position (target keywords)
- [ ] Pages with backlinks (external authority)
- [ ] Pages with internal link equity (hub pages)
- [ ] Conversion pages (lead generation, contact forms)

**Priority Tiers:**
- **Tier 1 (Critical):** Top 20 pages by traffic + rankings → Must preserve exactly
- **Tier 2 (High):** Pages 21-50 → Preserve with metadata parity
- **Tier 3 (Medium):** All other indexed pages → Preserve or redirect
- **Tier 4 (Low):** Orphaned/low-value pages → Document for deprecation

**Output:** `page-priority-matrix.csv`

---

### 3. Internal Link Structure Mapping

**Analysis Required:**
- [ ] Map all internal links (source → target)
- [ ] Identify hub pages (high in-degree)
- [ ] Document anchor text patterns
- [ ] Map breadcrumb logic
- [ ] Identify link clusters (related content groups)

**Preservation Strategy:**
- Maintain link equity flow
- Preserve anchor text where semantically relevant
- Recreate breadcrumb structure in Next.js
- Implement automated internal linking hooks

**Output:** `internal-link-map.json`

---

### 4. Metadata Patterns & Standards

**WordPress Metadata Audit:**
- [ ] Title tag patterns (length, keyword placement, brand inclusion)
- [ ] Meta description patterns (length, CTA inclusion, keyword density)
- [ ] Open Graph tags (image, title, description)
- [ ] Twitter Card implementation
- [ ] Canonical tag usage
- [ ] Robots meta directives

**Preservation Rules:**
- Maintain title tag length (50-60 chars)
- Preserve meta description patterns (150-160 chars)
- Ensure OG image dimensions match (1200x630px)
- Keep canonical logic identical

**Output:** `metadata-patterns.md`

---

### 5. Schema Markup Inventory

**Schema Types to Audit:**
- [ ] Organization schema (company info, logo, contact)
- [ ] Service schema (service offerings)
- [ ] Article schema (blog posts)
- [ ] FAQ schema (FAQ pages)
- [ ] BreadcrumbList schema
- [ ] LocalBusiness schema (if applicable)
- [ ] Review/Rating schema (if applicable)

**Preservation Strategy:**
- Recreate all existing schema in JSON-LD format
- Validate with Google Rich Results Test
- Ensure schema matches content exactly
- Document schema hierarchy and relationships

**Output:** `schema-inventory.json`

---

### 6. Blog Taxonomy & Content Structure

**WordPress Taxonomy Audit:**
- [ ] Categories (hierarchy, slugs, descriptions)
- [ ] Tags (usage frequency, relationships)
- [ ] Custom taxonomies (if any)
- [ ] Post type structure (blog, case studies, resources)
- [ ] Archive page patterns (date, category, tag archives)

**Migration Strategy:**
- Preserve category slugs exactly
- Maintain tag relationships
- Recreate archive pages with identical URL structure
- Map taxonomy to Next.js dynamic routes

**Output:** `taxonomy-map.json`

---

### 7. Technical SEO Elements

**WordPress Technical Audit:**
- [ ] XML sitemap structure (post types, priorities, frequencies)
- [ ] Robots.txt rules
- [ ] .htaccess redirects (existing 301s)
- [ ] Image alt text patterns
- [ ] Heading structure (H1-H6 hierarchy)
- [ ] URL canonicalization (www vs non-www, trailing slashes)

**Preservation Rules:**
- Maintain sitemap structure (priorities, frequencies)
- Preserve robots.txt logic
- Migrate all existing redirects
- Ensure alt text patterns continue
- Maintain heading hierarchy standards

**Output:** `technical-seo-audit.md`

---

## 🔄 URL Retention Strategy

### URL Mapping Rules

1. **Exact Preservation:**
   - All Tier 1 & Tier 2 pages → Identical URLs
   - Blog posts → Identical slugs
   - Service pages → Identical slugs

2. **Redirect Mapping:**
   - Deprecated pages → 301 to most relevant page
   - Category archives → 301 to new structure (if changed)
   - Date archives → 301 to blog index (if deprecated)

3. **URL Structure Standards:**
   - Flat hierarchy (max 2-3 levels deep)
   - Semantic slugs (keyword-aligned)
   - Lowercase, hyphenated
   - No trailing slashes (consistent)

### Redirect Implementation

**Format:** `URL_MIGRATION_MAP.json`
```json
{
  "preserved": [
    {
      "old_url": "/services/digital-transformation",
      "new_url": "/services/digital-transformation",
      "status": "preserved",
      "priority": "tier1"
    }
  ],
  "redirects": [
    {
      "old_url": "/old-service-page",
      "new_url": "/services/new-service-page",
      "status": "301",
      "reason": "Service renamed",
      "priority": "tier2"
    }
  ],
  "deprecated": [
    {
      "old_url": "/deprecated-page",
      "status": "deprecated",
      "reason": "Low traffic, no backlinks",
      "action": "404_with_redirect_to_parent"
    }
  ]
}
```

---

## 📋 Content Migration Priority

### Priority Matrix

| Priority | Criteria | Action | Timeline |
|----------|----------|--------|----------|
| **P0** | Top 20 pages by traffic + rankings | Migrate first, exact parity | Week 1 |
| **P1** | Pages 21-50, high backlinks | Migrate second, metadata parity | Week 2 |
| **P2** | All other indexed pages | Migrate third, content parity | Week 3-4 |
| **P3** | Orphaned/low-value pages | Document, redirect, or 404 | Week 5 |

---

## ✅ SEO Validation Checklist

### Pre-Launch Validation

- [ ] All Tier 1 & Tier 2 URLs accessible
- [ ] All redirects tested (301 status codes)
- [ ] Metadata parity verified (title, description, OG)
- [ ] Schema markup validated (Rich Results Test)
- [ ] Internal links functional
- [ ] XML sitemap generated and submitted
- [ ] Robots.txt configured
- [ ] Canonical tags implemented
- [ ] Mobile responsiveness verified
- [ ] Core Web Vitals ≥ 95

### Post-Launch Monitoring (First 30 Days)

- [ ] GSC indexing status (no drops)
- [ ] Ranking positions (no significant drops)
- [ ] Organic traffic (maintain or improve)
- [ ] Crawl errors (zero increase)
- [ ] 404 errors (only expected deprecated pages)
- [ ] Internal link equity (preserved)

---

## 🚨 Risk Mitigation

### High-Risk Scenarios

1. **URL Structure Change**
   - Risk: Lost rankings
   - Mitigation: Comprehensive 301 redirects, GSC URL change tool

2. **Metadata Mismatch**
   - Risk: Reduced CTR, ranking drops
   - Mitigation: Automated metadata validation, parity testing

3. **Schema Errors**
   - Risk: Lost rich results
   - Mitigation: Pre-launch validation, monitoring

4. **Internal Link Breakage**
   - Risk: Lost link equity
   - Mitigation: Automated link checking, redirect fallbacks

---

## 📚 Resources & Tools

### Audit Tools
- Google Search Console
- Screaming Frog SEO Spider
- Ahrefs / SEMrush
- Google Rich Results Test
- Schema.org Validator

### Migration Tools
- Redirect mapping spreadsheet
- URL comparison scripts
- Metadata extraction tools
- Schema migration scripts

---

## 📝 Next Steps

1. **Complete WordPress Audit** (Week 1)
   - Export all URLs
   - Extract metadata
   - Map internal links
   - Document schema

2. **Create URL Migration Map** (Week 1)
   - Map preserved URLs
   - Document redirects
   - Identify deprecated pages

3. **Validate with Stakeholders** (Week 1)
   - Review priority matrix
   - Approve redirect strategy
   - Confirm deprecated pages

4. **Proceed to Phase 1** (Week 2)
   - Information Architecture design
   - Sitemap creation
   - Navigation schema

---

**Document Owner:** SEO Strategy Team  
**Review Cycle:** Weekly during migration  
**Last Review:** TBD
