# 🚀 Quick Start: Supabase Setup

## Your Supabase Credentials

**Project URL:** https://tbctgfdcjhyoijmvwiku.supabase.co  
**Project ID:** tbctgfdcjhyoijmvwiku

**Anon Key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRiY3RnZmRjamh5b2lqbXZ3aWt1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2MjExMDUsImV4cCI6MjA4NjE5NzEwNX0.sSW8iM6L2nOb_7BWj3J2yozFGC-bsNpH1BWpP5onHq4`

---

## ⚡ Quick Setup (3 Steps)

### 1. Get Your Database Password

1. Go to: https://supabase.com/dashboard/project/tbctgfdcjhyoijmvwiku/settings/database
2. Find or reset your database password
3. Copy it

### 2. Create `.env.local` File

```bash
cp .env.example .env.local
```

Edit `.env.local` and replace `[YOUR-PASSWORD]` with your actual password:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.tbctgfdcjhyoijmvwiku.supabase.co:5432/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://postgres:YOUR_PASSWORD@db.tbctgfdcjhyoijmvwiku.supabase.co:5432/postgres"
```

### 3. Initialize Database

```bash
# Install dependencies (if not done)
npm install

# Generate Prisma Client
npm run db:generate

# Push schema to Supabase
npm run db:push

# Import WordPress data
npm run migrate:wordpress

# Create admin user
npm run create:admin
```

---

## ✅ Verify Setup

```bash
# Open Prisma Studio to view database
npm run db:studio
```

You should see all tables created!

---

## 📚 Next Steps

1. **Set up Storage Bucket** (Optional):
   - Go to Supabase Dashboard → Storage
   - Create bucket named `media`
   - Or run `scripts/setup-supabase-storage.sql` in SQL Editor

2. **Start Development**:
   ```bash
   npm run dev
   ```

3. **Access Admin Panel**:
   - http://localhost:3000/admin (once built)

---

## 🔗 Useful Links

- **Dashboard:** https://supabase.com/dashboard/project/tbctgfdcjhyoijmvwiku
- **Table Editor:** https://supabase.com/dashboard/project/tbctgfdcjhyoijmvwiku/editor
- **SQL Editor:** https://supabase.com/dashboard/project/tbctgfdcjhyoijmvwiku/sql
- **Storage:** https://supabase.com/dashboard/project/tbctgfdcjhyoijmvwiku/storage

---

## 🆘 Need Help?

See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for detailed instructions.
