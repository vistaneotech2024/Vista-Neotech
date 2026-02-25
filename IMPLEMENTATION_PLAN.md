# Vista Neotech – Further Implementation Plan

**Status:** Phase 0 complete; Phase 1 documented. Ready for build.  
**Last Updated:** February 5, 2026

---

## What’s Done

### Phase 0 – Discovery & SEO Forensics ✅
- WordPress URLs and Yoast metadata extracted (115 posts/pages).
- **URL_MIGRATION_MAP.json** populated with:
  - `old_url` / `new_url` (preserved)
  - `meta_title`, `meta_description`, `canonical_url`, `focus_keyword`
  - `content_type` (page/post), `post_id`, `slug`
- Processor: `scripts/audit/process-audit-data.js` (supports wp_posts + wp_postmeta CSVs; GSC optional).
- **Docs:** `docs/PHASE_0_COMPLETE.md`, `SEO_PRESERVATION.md`, `WORDPRESS_AUDIT_REQUIREMENTS.md`.

### Phase 1 – Information Architecture ✅ (Documented)
- **SITE_ARCHITECTURE.md:** URL structure, service clusters, nav, breadcrumbs, App Router layout.
- **SITEMAP_DRAFT.xml:** Example static entries; full sitemap to be generated in Next.js.

### Design System (Foundation) ✅
- **DESIGN_SYSTEM.md:** Colors (from logo/icon), typography, spacing, components.
- **URL_MIGRATION_MAP.json:** Ready for redirects and metadata parity.

---

## Further Implementation (In Order)

### 1. Phase 2 – Tech Stack & System Design

**Deliverables:**
- [ ] **ARCHITECTURE_DIAGRAM.md** – Next.js + DB + SEO flow.
- [ ] **DATA_MODEL.sql** – Tables for pages, posts, metadata, leads (Supabase or MS SQL).
- [ ] **ENVIRONMENT_STRATEGY.md** – Env vars, staging/production.

**Actions:**
- Initialize Next.js 14+ (App Router), TypeScript, Tailwind.
- Choose DB: Supabase (PostgreSQL) or MS SQL; add connection and env.
- Define schema: `pages`, `posts`, `metadata`, `redirects`, `leads` (for Phase 5).

---

### 2. Phase 3 – Design System in Code

**Deliverables:**
- [ ] **Design tokens** – CSS variables / Tailwind theme from DESIGN_SYSTEM.md.
- [ ] **COMPONENT_LIBRARY** – Button, Card, Input, Header, Footer, Section.

**Actions:**
- Add `globals.css` (or Tailwind theme) with color, spacing, typography tokens.
- Implement core UI components and use on Home + 1–2 key pages.

---

### 3. Phase 4 – SEO-First Page Engine

**Deliverables:**
- [ ] **SEO_ENGINE.ts** – Dynamic meta (title, description, OG, Twitter).
- [ ] **SCHEMA_FACTORY.ts** – JSON-LD (Organization, Service, Article, FAQ).
- [ ] **Canonicals** – From URL_MIGRATION_MAP or DB.

**Actions:**
- `generateMetadata()` in layout/page using preserved metadata.
- `app/sitemap.ts` – Build sitemap from URL_MIGRATION_MAP or DB.
- `app/robots.ts` – robots.txt.
- Schema components or server-side JSON-LD per page type.

---

### 4. Phase 5 – Landing Page Builder & Leads

**Deliverables:**
- [ ] **LANDING_PAGE_BUILDER.md** – Blocks (hero, proof, offer, CTA), admin flow.
- [ ] **LEADS_SCHEMA.sql** – Leads table (source, campaign, page, brand).

**Actions:**
- DB schema for leads and optional page templates.
- API or Server Actions for form submit; store in DB.
- (Later) Simple admin or CMS for landing pages.

---

### 5. Phase 6 – WordPress SEO Migration

**Deliverables:**
- [ ] **REDIRECTS.conf** (or Next.js redirects) – 301 from old URLs if any change.
- [ ] **SEO_VALIDATION_CHECKLIST.md** – Pre/post-launch checks.

**Actions:**
- Map any URL changes to `next.config` redirects (or middleware).
- Validate: metadata parity, canonicals, sitemap, no orphans.

---

### 6. Phase 7 – Analytics & Monitoring

**Deliverables:**
- [ ] **ANALYTICS_SETUP.md** – GSC, GA4, events.
- [ ] **SEO_MONITORING.md** – Crawl, indexing, errors.

**Actions:**
- GA4 + GSC verification.
- Event tracking for leads and key actions.
- Basic monitoring/alerting for 404s and critical URLs.

---

## Suggested Next Steps (Immediate)

1. **Add GSC data (optional):**  
   Export `gsc-pages-report.csv` → `scripts/audit/gsc-pages-report.csv` → run `node process-audit-data.js` to refresh Tier 1–4 in URL_MIGRATION_MAP.

2. **Scaffold Next.js (Phase 2):**
   - `npx create-next-app@latest` (App Router, TypeScript, Tailwind).
   - Add design tokens from DESIGN_SYSTEM.md.
   - Add `app/[slug]/page.tsx` and `app/blog/[slug]/page.tsx` with data from URL_MIGRATION_MAP or DB.

3. **Implement SEO engine (Phase 4):**
   - `generateMetadata()` + `app/sitemap.ts` + `app/robots.ts`.
   - JSON-LD for Organization and key pages.

4. **Data:**  
   Decide Supabase vs MS SQL; create DATA_MODEL.sql and migrate URL_MIGRATION_MAP + content into DB when ready.

---

## File Reference

| Item | Location |
|------|----------|
| URL map | `URL_MIGRATION_MAP.json` |
| Phase 0 summary | `docs/PHASE_0_COMPLETE.md` |
| Site architecture | `docs/SITE_ARCHITECTURE.md` |
| Sitemap draft | `docs/SITEMAP_DRAFT.xml` |
| Design tokens | `DESIGN_SYSTEM.md` |
| Audit processor | `scripts/audit/process-audit-data.js` |
| Master prompt | `MASTER_PROMPT.md` |

---

**You can start implementation by scaffolding the Next.js app and wiring design tokens + first pages to URL_MIGRATION_MAP (or DB) as above.**
