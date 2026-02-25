# Site Architecture
## Phase 1: Information Architecture (SEO-Led)

**Last Updated:** February 5, 2026  
**Base URL:** https://vistaneotech.com  
**Preserved URLs:** 115 (from Phase 0)

---

## 1. URL Structure (Preserved)

- **Flat depth:** Max 2 levels where possible
- **Patterns:**
  - **Pages:** `/{slug}` (e.g. `/about-us`, `/contact`, `/mlm-software`)
  - **Blog:** `/blog/{slug}` (e.g. `/blog/best-marketing-plans-for-mlm`)
  - **Categories:** `/category/{slug}` (if retained)
  - **Tags:** `/tag/{slug}` (if retained)

---

## 2. Core Brand Pages

| Path | Purpose | Priority |
|------|--------|----------|
| `/` | Home | Tier 1 |
| `/about-us` | About | High |
| `/contact` | Contact / Lead capture | High |
| `/clients` | Social proof | High |
| `/faq` | FAQ / Schema | High |
| `/sitemap` | Sitemap (replace with auto-generated) | Medium |

---

## 3. Service Clusters (Pillar → Sub-services)

**MLM / Direct Selling**
- `/mlm-software-direct-selling-consultant`
- `/mlm-consultant-software-developer-advisor`
- `/mlm-software`
- `/direct-selling-software`
- `/direct-selling-consultant-mlm`
- `/direct-selling-setup`
- `/direct-selling-registration`
- `/direct-selling-association`
- `/direct-selling-plans`
- `/direct-selling-training`
- `/mlm-trainers-direct-selling-experts`
- `/why-training-is-important-in-direct-selling`

**Software & Development**
- `/software-agency`
- `/software-development`
- `/web-development-company`
- `/web-designing-company`
- `/android-app-development`
- `/ios-app-development`
- `/shopping-portal-development`
- `/travel-portal-development`

**Digital Marketing**
- `/seo-services`
- `/sem-services`
- `/smo-services`
- `/sms-marketing`
- `/email-marketing`
- `/whatsapp-marketing`

**Design**
- `/graphic-designing`
- `/logo-designing`
- `/poster-designing-flyers-designers-in-delhi-ncr`
- `/brochure-designing-2`
- `/corporate-identity-designing`
- `/digital-printing-services`

**Content & Other**
- `/best-content-writing-services-delhi-ncr`
- `/app-presentation`
- `/portfolio-home`
- `/gallery`
- `/start-your-project-with-us`
- `/bank-details-vista-testing`

---

## 4. Blog / Resource Hub

- **Index:** `/blog` (list of posts)
- **Post URL:** `/blog/{slug}` (preserved from WordPress)
- **Taxonomy:** Categories/tags optional; URLs in URL_MIGRATION_MAP if used

---

## 5. Navigation Schema (Proposed)

**Primary nav (top):**
- Home | About Us | Services (mega or dropdown) | Blog | Contact

**Services grouping:**
- MLM & Direct Selling
- Software & Development
- Digital Marketing
- Design

**Footer:**
- Key services, Contact, Legal/Policy links, Social

---

## 6. Breadcrumb Logic

- **Home:** Home
- **Page:** Home > Page Title
- **Service:** Home > Services > Service Name
- **Blog post:** Home > Blog > Post Title

---

## 7. Sitemap (Draft)

- **Static pages:** All preserved page URLs
- **Blog:** All preserved `/blog/*` URLs
- **Priorities:** Home 1.0, main services 0.9, sub-services 0.8, blog 0.7
- **Change freq:** Home/pages weekly, blog monthly
- **Output:** `app/sitemap.ts` (Next.js) generating `/sitemap.xml`

---

## 8. Multi-Brand / Landing Pages

- **Shared infra:** One codebase, same design tokens
- **Landing pages:** `/lp/{slug}` or `/campaign/{slug}` (Phase 5)
- **Brand override:** `data-brand` or subdomain later if needed

---

## 9. File System (Next.js App Router)

```
app/
  layout.tsx
  page.tsx                    # Home
  sitemap.ts                  # Dynamic sitemap
  robots.ts                   # robots.txt
  [slug]/page.tsx             # Dynamic pages (about-us, contact, services…)
  blog/
    page.tsx                  # Blog index
    [slug]/page.tsx           # Blog post
  category/[slug]/page.tsx    # Optional
  tag/[slug]/page.tsx         # Optional
```

---

## 10. Data Sources

- **Pages/Posts:** Supabase or MS SQL (migrated from WordPress)
- **URL → metadata:** From URL_MIGRATION_MAP.json or DB
- **Navigation:** Config or CMS (Phase 5)

---

**Next:** Phase 2 (Tech stack, data model, env strategy) and Phase 3 (Design system in code).
