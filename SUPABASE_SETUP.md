# Supabase Setup Instructions
## Quick Start Guide for Vista Neotech CMS

**Last Updated:** February 9, 2026

---

## 🔐 Step 1: Get Your Database Password

1. Go to your Supabase project: https://supabase.com/dashboard/project/tbctgfdcjhyoijmvwiku
2. Navigate to **Settings** → **Database**
3. Find your database password (or reset it if needed)
4. Copy the password

---

## 📝 Step 2: Configure Environment Variables

### Option A: Create .env.local file

Create a `.env.local` file in the project root:

```bash
# Copy the example file
cp .env.example .env.local
```

Then edit `.env.local` and replace `[YOUR-PASSWORD]` with your actual Supabase database password:

```env
DATABASE_URL="postgresql://postgres:YOUR_ACTUAL_PASSWORD@db.tbctgfdcjhyoijmvwiku.supabase.co:5432/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://postgres:YOUR_ACTUAL_PASSWORD@db.tbctgfdcjhyoijmvwiku.supabase.co:5432/postgres"
```

### Option B: Use Supabase Connection Pooler (Recommended)

For better performance, use the connection pooler:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.tbctgfdcjhyoijmvwiku.supabase.co:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:YOUR_PASSWORD@db.tbctgfdcjhyoijmvwiku.supabase.co:5432/postgres"
```

**Note:** Port 6543 is for connection pooling, port 5432 is direct connection.

---

## 🗄️ Step 3: Initialize Database Schema

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to Supabase
npm run db:push

# Verify connection (optional)
npm run db:studio
```

This will create all tables in your Supabase database.

---

## ✅ Step 4: Verify Connection

### Test Database Connection

```bash
# Open Prisma Studio to view your database
npm run db:studio
```

This will open a browser window where you can see all your tables.

### Check Tables in Supabase Dashboard

1. Go to Supabase Dashboard
2. Navigate to **Table Editor**
3. You should see all tables created:
   - pages
   - posts
   - categories
   - tags
   - media
   - users
   - etc.

---

## 🔄 Step 5: Import WordPress Data

Once the database is set up, import your WordPress content:

```bash
npm run migrate:wordpress
```

This will:
- Import all pages from `URL_MIGRATION_MAP.json`
- Import all posts
- Create redirects
- Preserve SEO metadata

---

## 👤 Step 6: Create Admin User

Create your first admin user:

```bash
npm run create:admin
```

Or manually via Prisma Studio:
1. Run `npm run db:studio`
2. Navigate to `users` table
3. Click "Add record"
4. Fill in:
   - email: your-email@example.com
   - passwordHash: (use bcrypt to hash password)
   - role: `super_admin`
   - status: `active`

---

## 🔒 Step 7: Security Checklist

- [ ] Database password is secure and stored in `.env.local`
- [ ] `.env.local` is in `.gitignore` (should be already)
- [ ] JWT_SECRET and SESSION_SECRET are changed from defaults
- [ ] Supabase project has proper access controls

---

## 🚀 Step 8: Start Development

```bash
npm run dev
```

Visit:
- **Public Site:** http://localhost:3000
- **Admin Panel:** http://localhost:3000/admin (once built)

---

## 📊 Supabase Dashboard Access

**Project URL:** https://tbctgfdcjhyoijmvwiku.supabase.co

**Dashboard:** https://supabase.com/dashboard/project/tbctgfdcjhyoijmvwiku

You can:
- View tables in **Table Editor**
- Run SQL queries in **SQL Editor**
- Manage storage in **Storage**
- View API docs in **API**
- Monitor usage in **Settings**

---

## 🐛 Troubleshooting

### Connection Issues

**Error: "Connection refused"**
- Check your database password is correct
- Verify the connection string format
- Check Supabase project is active

**Error: "SSL required"**
- Add `?sslmode=require` to connection string:
  ```
  DATABASE_URL="postgresql://...?sslmode=require"
  ```

### Prisma Issues

**Error: "Can't reach database server"**
- Use DIRECT_URL for migrations (port 5432)
- Use DATABASE_URL with pgbouncer for app (port 6543)

**Error: "Schema not found"**
- Run `npm run db:push` to create schema
- Check Supabase project is active

### Migration Issues

**Error: "Table already exists"**
- Tables might already exist
- Use `npm run db:reset` to reset (WARNING: deletes all data)
- Or manually drop tables in Supabase SQL Editor

---

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Prisma with Supabase](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-supabase)
- [Connection Pooling Guide](https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler)

---

## 🔗 Quick Links

- **Supabase Dashboard:** https://supabase.com/dashboard/project/tbctgfdcjhyoijmvwiku
- **Project URL:** https://tbctgfdcjhyoijmvwiku.supabase.co
- **API Docs:** https://tbctgfdcjhyoijmvwiku.supabase.co/rest/v1/

---

## ⚠️ Important Notes

1. **Never commit `.env.local`** - It contains sensitive credentials
2. **Use connection pooler** for production (port 6543)
3. **Direct connection** for migrations (port 5432)
4. **Keep password secure** - Store in environment variables only

---

**Need Help?** Check the [SETUP_GUIDE.md](./docs/SETUP_GUIDE.md) for more detailed instructions.
