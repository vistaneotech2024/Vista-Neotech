# Vista Neotech CMS Architecture
## Complete Content Management System Design

**Last Updated:** February 9, 2026  
**Status:** Architecture Design Complete

---

## 🎯 Overview

A comprehensive, WordPress-like CMS built on Next.js 14 with PostgreSQL/Supabase, designed for non-technical users to manage all aspects of the website while maintaining SEO excellence.

---

## 📐 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                          │
│  ┌──────────────────┐         ┌──────────────────┐          │
│  │   Public Site    │         │   Admin Panel    │          │
│  │   (Next.js SSR)  │         │   (Next.js CSR)  │          │
│  └──────────────────┘         └──────────────────┘          │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              NEXT.JS API LAYER (Server Actions)              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Content    │  │    Media     │  │     SEO      │     │
│  │     API      │  │     API      │  │     API      │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Navigation  │  │   Settings   │  │   Analytics  │     │
│  │     API      │  │     API      │  │     API      │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              DATABASE LAYER (PostgreSQL/Supabase)           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Content    │  │    Media     │  │   Relations  │     │
│  │   Tables     │  │   Storage    │  │    Tables     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              STORAGE LAYER                                  │
│  ┌──────────────┐  ┌──────────────┐                       │
│  │   Supabase   │  │   CDN        │                       │
│  │   Storage    │  │   (CloudFlare)│                      │
│  └──────────────┘  └──────────────┘                       │
└─────────────────────────────────────────────────────────────┘
```

---

## 🗂️ Directory Structure

```
app/
├── (main)/                    # Public site routes
│   ├── page.tsx              # Homepage
│   ├── [slug]/page.tsx        # Dynamic pages/posts
│   └── blog/page.tsx          # Blog listing
│
├── admin/                     # Admin panel (protected)
│   ├── layout.tsx             # Admin layout with sidebar
│   ├── dashboard/page.tsx     # Dashboard
│   ├── content/
│   │   ├── pages/
│   │   │   ├── page.tsx       # Pages list
│   │   │   ├── new/page.tsx   # New page
│   │   │   └── [id]/page.tsx  # Edit page
│   │   └── posts/
│   │       ├── page.tsx       # Posts list
│   │       ├── new/page.tsx   # New post
│   │       └── [id]/page.tsx  # Edit post
│   ├── media/
│   │   ├── page.tsx           # Media library
│   │   └── upload/page.tsx    # Upload interface
│   ├── navigation/
│   │   └── page.tsx           # Menu management
│   ├── settings/
│   │   ├── page.tsx           # General settings
│   │   └── seo/page.tsx       # SEO settings
│   └── users/
│       └── page.tsx            # User management
│
└── api/                       # API routes (if needed)
    ├── content/
    ├── media/
    └── auth/

lib/
├── db/                        # Database utilities
│   ├── prisma.ts              # Prisma client
│   └── queries/               # Database queries
│       ├── pages.ts
│       ├── posts.ts
│       └── media.ts
│
├── cms/                       # CMS utilities
│   ├── content-blocks.ts      # Content block system
│   ├── media-optimizer.ts     # Image/video optimization
│   └── seo-helper.ts          # SEO utilities
│
└── auth/                      # Authentication
    ├── session.ts
    └── permissions.ts

components/
├── admin/                     # Admin components
│   ├── AdminLayout.tsx
│   ├── AdminSidebar.tsx
│   ├── ContentEditor/
│   │   ├── RichTextEditor.tsx
│   │   ├── BlockEditor.tsx
│   │   └── MediaPicker.tsx
│   ├── MediaLibrary/
│   │   ├── MediaGrid.tsx
│   │   ├── MediaUploader.tsx
│   │   └── MediaOptimizer.tsx
│   └── SEOEditor/
│       ├── MetaTagsEditor.tsx
│       └── SchemaMarkupEditor.tsx
│
└── ui/                        # Shared UI components
```

---

## 🔐 Authentication & Authorization

### User Roles

1. **Super Admin**
   - Full system access
   - User management
   - System settings
   - Database access

2. **Admin**
   - Content management
   - Media management
   - Navigation management
   - SEO settings
   - Cannot manage users

3. **Editor**
   - Create/edit/delete pages and posts
   - Publish content
   - Manage media
   - Cannot change settings

4. **Author**
   - Create/edit own posts
   - Upload media
   - Cannot publish (needs approval)
   - Cannot edit pages

5. **Contributor**
   - Create draft posts
   - Cannot publish
   - Limited media access

### Session Management

- JWT-based sessions stored in database
- Secure HTTP-only cookies
- Session expiration: 7 days (configurable)
- Refresh token rotation

---

## 📝 Content Management

### Page/Post Editor Features

1. **Rich Text Editor**
   - WYSIWYG editor (Tiptap or similar)
   - Markdown support
   - Code blocks with syntax highlighting
   - Media embedding
   - Link management

2. **Block-Based Editor**
   - Drag-and-drop content blocks
   - Reusable components
   - Layout templates
   - Custom block types

3. **SEO Panel**
   - Meta title (with character counter)
   - Meta description (with preview)
   - Focus keyword
   - Canonical URL
   - Open Graph tags
   - Twitter Card tags
   - Schema markup editor
   - SEO score indicator

4. **Content Preview**
   - Live preview
   - Mobile/tablet/desktop views
   - Share preview link

5. **Version Control**
   - Auto-save drafts
   - Revision history
   - Rollback to previous versions
   - Compare versions

### Content Blocks System

**Available Block Types:**

1. **Hero Section**
   - Title, subtitle, CTA buttons
   - Background image/video
   - Overlay options

2. **Feature Cards**
   - Icon/image
   - Title, description
   - Link/CTA

3. **Testimonials**
   - Author info
   - Quote
   - Rating
   - Image

4. **CTA Section**
   - Heading, description
   - Button(s)
   - Background styling

5. **Image Gallery**
   - Grid layout options
   - Lightbox support
   - Captions

6. **Video Embed**
   - YouTube/Vimeo support
   - Custom video upload
   - Autoplay options

7. **Stats/Counters**
   - Number, label, icon
   - Animation options

8. **FAQ Accordion**
   - Question/answer pairs
   - Expand/collapse

9. **Pricing Tables**
   - Multiple tiers
   - Feature lists
   - CTA buttons

10. **Contact Forms**
    - Field builder
    - Validation rules
    - Email notifications

---

## 🖼️ Media Management

### Upload Features

1. **Drag & Drop Upload**
   - Multiple file selection
   - Progress indicators
   - Batch upload

2. **Image Optimization**
   - Automatic compression
   - WebP conversion
   - Responsive variants (thumbnails, medium, large)
   - Lazy loading support
   - Blur placeholder generation

3. **Video Optimization**
   - Automatic transcoding
   - Multiple quality levels
   - Thumbnail generation
   - Subtitles support

4. **Media Library**
   - Grid/List view
   - Search and filter
   - Bulk actions
   - Collections/Galleries
   - Alt text management
   - Caption editing

5. **CDN Integration**
   - Automatic CDN upload
   - Cache invalidation
   - Image transformation API

### Optimization Pipeline

```
Upload → Validation → Optimization Queue → Processing → CDN Upload → Database Update
```

**Image Processing:**
- Format conversion (WebP, AVIF)
- Size optimization
- Responsive variants generation
- Blur placeholder creation

**Video Processing:**
- Transcoding (MP4, WebM)
- Thumbnail extraction
- Multiple quality levels
- Subtitle processing

---

## 🔍 SEO Management

### SEO Features

1. **Global SEO Settings**
   - Site name, description
   - Default meta tags
   - Social media profiles
   - Google Analytics/Tag Manager
   - Robots.txt editor
   - Sitemap configuration

2. **Per-Page SEO**
   - Meta title/description
   - Focus keyword tracking
   - Canonical URL
   - Open Graph tags
   - Twitter Card tags
   - Schema markup
   - SEO score analysis

3. **Schema Markup**
   - Article schema
   - Organization schema
   - Breadcrumb schema
   - FAQ schema
   - Review schema
   - Product schema (if needed)

4. **Redirect Management**
   - 301/302 redirects
   - Bulk import
   - Hit tracking
   - Pattern matching

5. **Sitemap Generation**
   - Automatic XML sitemap
   - Priority/frequency settings
   - Last modified dates
   - Image sitemap
   - Video sitemap

---

## 🧭 Navigation Management

### Menu Builder

1. **Visual Menu Editor**
   - Drag-and-drop ordering
   - Nested menu support
   - Icon selection
   - Custom links
   - Conditional visibility

2. **Menu Locations**
   - Header menu
   - Footer menu
   - Sidebar menu
   - Mobile menu

3. **Menu Items**
   - Link to pages/posts
   - Custom URLs
   - External links
   - Anchor links
   - Dropdown menus

---

## ⚙️ Settings Management

### General Settings

- Site title, tagline
- Logo upload
- Favicon
- Timezone
- Date/time formats
- Language settings

### Content Settings

- Default post category
- Post excerpt length
- Comments settings
- Permalink structure

### Media Settings

- Max upload size
- Allowed file types
- Image quality settings
- CDN configuration

### SEO Settings

- Global meta tags
- Social media profiles
- Analytics codes
- Schema markup defaults

---

## 🔄 WordPress Migration

### Migration Process

1. **Data Import**
   - Pages import
   - Posts import
   - Categories/Tags import
   - Media import
   - Users import
   - Menu import

2. **URL Preservation**
   - Slug mapping
   - Redirect creation
   - Canonical URL preservation

3. **SEO Preservation**
   - Meta tags migration
   - Schema markup migration
   - Internal link updates

4. **Media Migration**
   - Image download
   - Optimization
   - CDN upload
   - URL replacement

### Migration Scripts

Located in `scripts/migration/`:
- `import-wordpress-pages.ts`
- `import-wordpress-posts.ts`
- `import-wordpress-media.ts`
- `import-wordpress-users.ts`
- `create-redirects.ts`

---

## 📊 Analytics & Reporting

### Dashboard Metrics

1. **Content Stats**
   - Total pages/posts
   - Published vs Draft
   - Recent activity
   - Popular content

2. **Media Stats**
   - Total media files
   - Storage usage
   - Optimization status

3. **SEO Stats**
   - Indexed pages
   - Redirect hits
   - SEO scores

4. **User Activity**
   - Recent edits
   - User activity log
   - Login history

---

## 🚀 Performance Optimization

### Frontend

- Server-side rendering (SSR)
- Static generation where possible
- Image optimization
- Code splitting
- Lazy loading

### Backend

- Database query optimization
- Caching layer (Redis)
- CDN for static assets
- API rate limiting

### Media

- Automatic image optimization
- Responsive image variants
- Lazy loading
- WebP/AVIF formats
- Video transcoding

---

## 🔒 Security

### Measures

1. **Authentication**
   - Secure password hashing (bcrypt)
   - Session management
   - CSRF protection
   - Rate limiting

2. **Authorization**
   - Role-based access control
   - Permission checks
   - API authentication

3. **Data Protection**
   - SQL injection prevention (Prisma)
   - XSS protection
   - File upload validation
   - Content sanitization

4. **Monitoring**
   - Error logging
   - Activity logging
   - Security alerts

---

## 📱 Responsive Design

- Mobile-first approach
- Touch-friendly admin interface
- Responsive media library
- Mobile content preview

---

## 🧪 Testing Strategy

1. **Unit Tests**
   - Database queries
   - Utility functions
   - API endpoints

2. **Integration Tests**
   - Content CRUD operations
   - Media upload/optimization
   - SEO features

3. **E2E Tests**
   - Admin workflows
   - Content publishing
   - Media management

---

## 📚 Documentation

- Admin user guide
- Developer documentation
- API documentation
- Migration guide

---

## 🎯 Next Steps

1. Set up database (Supabase/PostgreSQL)
2. Initialize Prisma
3. Create admin authentication
4. Build admin UI components
5. Implement content editor
6. Build media management
7. Create SEO tools
8. Develop migration scripts
