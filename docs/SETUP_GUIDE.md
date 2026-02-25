# Vista Neotech CMS Setup Guide
## Complete Installation and Configuration

**Last Updated:** February 9, 2026

---

## 📋 Prerequisites

- Node.js 18+ and npm/pnpm/yarn
- PostgreSQL 14+ or Supabase account
- Git

---

## 🚀 Step 1: Install Dependencies

```bash
# Install project dependencies
npm install

# Install Prisma CLI globally (optional)
npm install -g prisma
```

---

## 🗄️ Step 2: Database Setup

### Option A: Supabase (Recommended)

1. Create a Supabase project at https://supabase.com
2. Get your database URL from Project Settings → Database
3. Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

4. Add your Supabase credentials:

```env
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"
DIRECT_URL="postgresql://user:password@host:5432/database?schema=public"
```

### Option B: Local PostgreSQL

1. Install PostgreSQL locally
2. Create a database:

```sql
CREATE DATABASE vista_neotech_cms;
```

3. Update `.env` with local connection:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/vista_neotech_cms?schema=public"
DIRECT_URL="postgresql://postgres:password@localhost:5432/vista_neotech_cms?schema=public"
```

---

## 🔧 Step 3: Initialize Database

```bash
# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma db push

# (Optional) Open Prisma Studio to view database
npx prisma studio
```

---

## 📦 Step 4: Install Additional Dependencies

```bash
# Image optimization
npm install sharp

# Authentication (if using custom auth)
npm install bcryptjs jsonwebtoken
npm install -D @types/bcryptjs @types/jsonwebtoken

# File upload handling
npm install formidable
npm install -D @types/formidable
```

---

## 🔐 Step 5: Configure Environment Variables

Create `.env.local` file:

```env
# Database
DATABASE_URL="your-database-url"
DIRECT_URL="your-direct-database-url"

# Next.js
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
NEXT_PUBLIC_SITE_NAME="Vista Neotech"

# Authentication
JWT_SECRET="your-super-secret-jwt-key-change-this"
SESSION_SECRET="your-session-secret-change-this"

# Media Storage
UPLOAD_DIR="public/uploads"
MAX_FILE_SIZE=10485760  # 10MB
ALLOWED_IMAGE_TYPES="image/jpeg,image/png,image/webp,image/gif"
ALLOWED_VIDEO_TYPES="video/mp4,video/webm"

# CDN (Optional)
CDN_URL=""
CDN_API_KEY=""

# Email (for notifications)
SMTP_HOST=""
SMTP_PORT=587
SMTP_USER=""
SMTP_PASSWORD=""
SMTP_FROM="noreply@vistaneotech.com"

# Analytics
NEXT_PUBLIC_GA_ID=""
NEXT_PUBLIC_GTM_ID=""
```

---

## 🔄 Step 6: Run WordPress Migration

```bash
# Import WordPress data
npm run migrate:wordpress

# Or run manually
npx tsx scripts/migration/import-wordpress-data.ts
```

This will:
- Import all pages from `URL_MIGRATION_MAP.json`
- Import all posts
- Create redirects for old URLs
- Preserve all SEO metadata

---

## 🎨 Step 7: Create Admin User

```bash
# Run user creation script
npx tsx scripts/create-admin-user.ts
```

Or manually via Prisma Studio:
1. Open `npx prisma studio`
2. Navigate to `users` table
3. Create a new user with:
   - Email: your-email@example.com
   - Password hash: (use bcrypt to hash your password)
   - Role: `super_admin`

---

## 🚀 Step 8: Start Development Server

```bash
npm run dev
```

Visit:
- **Public Site:** http://localhost:3000
- **Admin Panel:** http://localhost:3000/admin

---

## 📁 Step 9: Create Upload Directories

```bash
# Create upload directories
mkdir -p public/uploads/images
mkdir -p public/uploads/videos
mkdir -p public/uploads/documents
mkdir -p public/uploads/optimized
```

---

## ✅ Verification Checklist

- [ ] Database connection successful
- [ ] Prisma migrations applied
- [ ] WordPress data imported
- [ ] Admin user created
- [ ] Upload directories created
- [ ] Environment variables configured
- [ ] Development server running
- [ ] Can access admin panel

---

## 🐛 Troubleshooting

### Database Connection Issues

```bash
# Test database connection
npx prisma db pull

# Reset database (WARNING: Deletes all data)
npx prisma migrate reset
```

### Prisma Client Issues

```bash
# Regenerate Prisma Client
npx prisma generate

# Clear Prisma cache
rm -rf node_modules/.prisma
npx prisma generate
```

### Migration Errors

```bash
# Check migration status
npx prisma migrate status

# Reset and reapply migrations
npx prisma migrate reset
npx prisma db push
```

---

## 📚 Next Steps

1. **Configure Admin Panel**
   - Set up authentication
   - Configure permissions
   - Customize admin UI

2. **Import Content**
   - Import WordPress content (if not done)
   - Upload media files
   - Set up navigation menus

3. **Configure SEO**
   - Set global SEO settings
   - Configure sitemap
   - Set up analytics

4. **Customize Design**
   - Update site settings
   - Configure themes
   - Customize components

---

## 🔒 Security Checklist

- [ ] Change default admin password
- [ ] Update JWT_SECRET and SESSION_SECRET
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Enable HTTPS in production
- [ ] Configure file upload limits
- [ ] Set up backup strategy

---

## 📖 Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [CMS Architecture Guide](./CMS_ARCHITECTURE.md)

---

## 🆘 Support

For issues or questions:
1. Check the [CMS Architecture](./CMS_ARCHITECTURE.md) documentation
2. Review database schema in `database/schema.sql`
3. Check Prisma schema in `database/prisma/schema.prisma`
