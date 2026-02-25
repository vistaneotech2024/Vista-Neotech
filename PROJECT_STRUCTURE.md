# Vista Neotech - Project Structure
## Digital Transformation Program Documentation

**Project:** WordPress → Next.js Migration  
**Status:** Phase 0 - Discovery & SEO Forensics  
**Last Updated:** February 5, 2026

---

## 📁 Directory Structure

```
vista_neotech_new/
│
├── 📄 Documentation (Phase 0)
│   ├── SEO_PRESERVATION.md          # SEO audit framework & strategy
│   ├── URL_MIGRATION_MAP.json       # URL retention & redirect mapping
│   ├── DESIGN_SYSTEM.md              # Design tokens & component foundation
│   └── PROJECT_STRUCTURE.md          # This file
│
├── 📁 assets/                        # Brand assets
│   ├── images/
│   │   ├── logo-*.png                # Vista Neotech logo
│   │   └── vista_icon-*.png          # Geometric icon
│   └── fonts/                        # Self-hosted fonts (to be added)
│
├── 📁 docs/                          # Phase documentation (to be created)
│   ├── phase0-discovery/             # Phase 0 deliverables
│   ├── phase1-architecture/          # Phase 1 deliverables
│   ├── phase2-tech-stack/            # Phase 2 deliverables
│   ├── phase3-design-system/         # Phase 3 deliverables
│   ├── phase4-seo-engine/            # Phase 4 deliverables
│   ├── phase5-landing-builder/       # Phase 5 deliverables
│   ├── phase6-migration/             # Phase 6 deliverables
│   └── phase7-analytics/             # Phase 7 deliverables
│
├── 📁 src/                           # Next.js application (to be created)
│   ├── app/                          # App Router structure
│   ├── components/                   # React components
│   ├── lib/                          # Utilities & services
│   ├── styles/                       # Global styles & tokens
│   └── types/                        # TypeScript definitions
│
└── 📁 scripts/                       # Migration & utility scripts (to be created)
    ├── audit/                        # SEO audit scripts
    ├── migration/                    # Migration automation
    └── validation/                   # Post-migration validation
```

---

## 🎯 Phase Status

| Phase | Name | Status | Deliverables |
|-------|------|--------|--------------|
| **Phase 0** | Discovery & SEO Forensics | ✅ In Progress | SEO_PRESERVATION.md, URL_MIGRATION_MAP.json |
| **Phase 1** | Information Architecture | ⏳ Pending | SITE_ARCHITECTURE.md, SITEMAP.xml |
| **Phase 2** | Tech Stack & System Design | ⏳ Pending | ARCHITECTURE_DIAGRAM.md, DATA_MODEL.sql |
| **Phase 3** | Design System | ✅ Foundation | DESIGN_SYSTEM.md, COMPONENT_LIBRARY.tsx |
| **Phase 4** | SEO-First Page Engine | ⏳ Pending | SEO_ENGINE.ts, SCHEMA_FACTORY.ts |
| **Phase 5** | Landing Page Builder | ⏳ Pending | LANDING_PAGE_BUILDER.md, LEADS_SCHEMA.sql |
| **Phase 6** | WordPress SEO Migration | ⏳ Pending | REDIRECTS.conf, SEO_VALIDATION_CHECKLIST.md |
| **Phase 7** | Analytics & Monitoring | ⏳ Pending | ANALYTICS_SETUP.md, SEO_MONITORING.md |

---

## 📋 Current Deliverables

### ✅ Completed (Phase 0)

1. **SEO_PRESERVATION.md**
   - Comprehensive SEO audit framework
   - URL retention strategy
   - Content migration priority matrix
   - SEO validation checklist

2. **URL_MIGRATION_MAP.json**
   - URL mapping structure
   - Redirect rules configuration
   - Validation tracking

3. **DESIGN_SYSTEM.md**
   - Color palette extracted from logo/icon
   - Typography system
   - Spacing & layout tokens
   - Component patterns
   - Multi-brand support structure

4. **PROJECT_STRUCTURE.md**
   - Directory organization
   - Phase tracking
   - Documentation framework

---

## 🔄 Next Steps

### Immediate (Week 1)
1. **Complete WordPress Audit**
   - Export all URLs from WordPress
   - Extract metadata (titles, descriptions, OG tags)
   - Map internal link structure
   - Document schema markup
   - Populate `URL_MIGRATION_MAP.json`

2. **Validate Design System**
   - Confirm color values with design team
   - Select primary typeface
   - Create initial component library structure

3. **Set Up Next.js Foundation**
   - Initialize Next.js project (App Router)
   - Configure Tailwind with design tokens
   - Set up TypeScript
   - Create base folder structure

### Short-Term (Week 2-3)
1. **Phase 1: Information Architecture**
   - Design site structure
   - Create sitemap
   - Define navigation schema
   - Plan breadcrumb logic

2. **Phase 2: Tech Stack Setup**
   - Configure Supabase/MS SQL connection
   - Set up environment strategy
   - Create data models
   - Design API architecture

---

## 🛠️ Technology Stack (Planned)

### Frontend
- **Framework:** Next.js 14+ (App Router)
- **Styling:** Tailwind CSS + Custom Design Tokens
- **Language:** TypeScript
- **Fonts:** Self-hosted (Inter/Poppins/custom)

### Backend/Database
- **Database:** Supabase (PostgreSQL) OR MS SQL Server
- **ORM/Query:** Prisma OR Drizzle ORM
- **API:** Next.js API Routes + Server Actions

### SEO & Performance
- **SSR:** Next.js Server Components (default)
- **Image Optimization:** Next.js Image component
- **Metadata:** Dynamic metadata generation
- **Schema:** JSON-LD structured data

### Development Tools
- **Package Manager:** npm/pnpm/yarn
- **Linting:** ESLint
- **Formatting:** Prettier
- **Type Checking:** TypeScript strict mode

---

## 📝 Documentation Standards

### File Naming
- **Markdown:** `UPPERCASE_WITH_UNDERSCORES.md`
- **Code:** `kebab-case.tsx` or `PascalCase.tsx` (components)
- **Config:** `kebab-case.json` or `UPPERCASE.env`

### Documentation Structure
Each phase document should include:
1. **Objectives** - What we're achieving
2. **Tasks** - Specific actions
3. **Deliverables** - Outputs
4. **Validation** - How we verify success
5. **Next Steps** - What comes after

---

## 🔐 Environment Strategy

### Environment Variables (Planned)

```env
# Database
DATABASE_URL=
SUPABASE_URL=
SUPABASE_ANON_KEY=

# Next.js
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_API_URL=

# Analytics
GOOGLE_ANALYTICS_ID=
GOOGLE_SEARCH_CONSOLE_VERIFICATION=

# SEO
NEXT_PUBLIC_SITE_NAME="Vista Neotech"
NEXT_PUBLIC_DEFAULT_OG_IMAGE=

# Features
ENABLE_LANDING_PAGE_BUILDER=true
ENABLE_MULTI_BRAND=true
```

---

## ✅ Quality Gates

### Before Proceeding to Next Phase
- [ ] All Phase 0 deliverables complete
- [ ] WordPress audit completed
- [ ] URL migration map populated
- [ ] Design system validated
- [ ] Stakeholder approval obtained

### Code Quality Standards
- TypeScript strict mode
- ESLint + Prettier configured
- Component documentation
- Accessibility testing (WCAG AA)
- Performance budgets (Core Web Vitals ≥ 95)

---

## 📞 Key Contacts

**Document Owner:** Development Team  
**SEO Lead:** TBD  
**Design Lead:** TBD  
**Stakeholder:** Vista Neotech Management

---

**Last Review:** February 5, 2026  
**Next Review:** After WordPress audit completion
