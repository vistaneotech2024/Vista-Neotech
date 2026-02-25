# 🚀 Quick Start Guide
## Get Your CMS Running in 5 Minutes

**Your Supabase database is now configured!** ✅

---

## ⚡ Step 1: Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Prisma Client
- Supabase JS Client
- Sharp (for image optimization)
- And more...

---

## 🗄️ Step 2: Initialize Database

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to Supabase (creates all tables)
npm run db:push
```

This will create all the database tables in your Supabase project.

**Expected Output:**
- ✅ All tables created successfully
- ✅ You can verify in Supabase Dashboard → Table Editor

---

## 📥 Step 3: Import WordPress Data

```bash
npm run migrate:wordpress
```

This will:
- Import all pages from `URL_MIGRATION_MAP.json`
- Import all posts
- Create redirects
- Preserve all SEO metadata

**Expected Output:**
- ✅ Pages imported: X
- ✅ Posts imported: Y
- ✅ Redirects created: Z

---

## 👤 Step 4: Create Admin User

```bash
npm run create:admin
```

Follow the prompts:
- Email: your-email@example.com
- Password: (choose a secure password)
- Display Name: Your Name

**Expected Output:**
- ✅ Admin user created successfully!

---

## ✅ Step 5: Verify Setup

```bash
# Open Prisma Studio to view your database
npm run db:studio
```

This opens a browser window where you can:
- View all tables
- See imported data
- Verify everything is working

---

## 🎉 Step 6: Start Development Server

```bash
npm run dev
```

Visit:
- **Public Site:** http://localhost:3000
- **Admin Panel:** http://localhost:3000/admin (once built)

---

## 🔍 Verify in Supabase Dashboard

1. Go to: https://supabase.com/dashboard/project/tbctgfdcjhyoijmvwiku
2. Navigate to **Table Editor**
3. You should see:
   - ✅ `pages` table (with imported pages)
   - ✅ `posts` table (with imported posts)
   - ✅ `users` table (with your admin user)
   - ✅ `redirects` table (with WordPress redirects)
   - ✅ And more...

---

## 🐛 Troubleshooting

### "Cannot connect to database"
- ✅ Check `.env.local` file exists
- ✅ Verify password is correct: `Fo1r7OamRLCUPSXv`
- ✅ Check Supabase project is active

### "Prisma Client not generated"
```bash
npm run db:generate
```

### "Tables already exist"
- This is fine! The migration will skip existing data
- Or reset: `npm run db:reset` (⚠️ deletes all data)

### "Module not found"
```bash
npm install
```

---

## 📚 Next Steps

1. **Set up Storage Bucket** (for media uploads):
   - Go to Supabase Dashboard → Storage
   - Create bucket named `media`
   - Or run `scripts/setup-supabase-storage.sql` in SQL Editor

2. **Build Admin Panel**:
   - The database is ready
   - Next: Build the admin UI components

3. **Customize Settings**:
   - Update `JWT_SECRET` and `SESSION_SECRET` in `.env.local`
   - Configure email settings (optional)
   - Add analytics IDs (optional)

---

## ✅ Checklist

- [x] `.env.local` created with database password
- [ ] Dependencies installed (`npm install`)
- [ ] Database initialized (`npm run db:push`)
- [ ] WordPress data imported (`npm run migrate:wordpress`)
- [ ] Admin user created (`npm run create:admin`)
- [ ] Verified in Supabase Dashboard
- [ ] Development server running (`npm run dev`)

---

## 🆘 Need Help?

- **Detailed Setup:** See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
- **Architecture:** See [docs/CMS_ARCHITECTURE.md](./docs/CMS_ARCHITECTURE.md)
- **Database Schema:** See [database/schema.sql](./database/schema.sql)

---

**You're all set!** 🎉 Your database is configured and ready to use.
