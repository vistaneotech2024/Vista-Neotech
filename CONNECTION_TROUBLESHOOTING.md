# Database Connection Troubleshooting

## ❌ Current Issue: Can't reach database server

The connection to Supabase is failing. Here's how to fix it:

---

## ✅ Step 1: Check Supabase Project Status

1. **Go to Supabase Dashboard:**
   - https://supabase.com/dashboard/project/tbctgfdcjhyoijmvwiku

2. **Check Project Status:**
   - If you see "Project Paused" → Click "Restore" or "Resume"
   - Free tier projects pause after 1 week of inactivity
   - It takes 1-2 minutes to restore

3. **Verify Database is Running:**
   - Go to **Settings** → **Database**
   - Check connection string matches what we have

---

## ✅ Step 2: Verify Connection String

Your connection string should be:
```
postgresql://postgres:Fo1r7OamRLCUPSXv@db.tbctgfdcjhyoijmvwiku.supabase.co:5432/postgres
```

**Check:**
- ✅ Password is correct: `Fo1r7OamRLCUPSXv`
- ✅ Host is correct: `db.tbctgfdcjhyoijmvwiku.supabase.co`
- ✅ Port is correct: `5432`

---

## ✅ Step 3: Test Connection from Supabase Dashboard

1. Go to **SQL Editor** in Supabase Dashboard
2. Run a simple query:
   ```sql
   SELECT version();
   ```
3. If this works, the database is accessible

---

## ✅ Step 4: Try Alternative Connection Methods

### Option A: Use Connection Pooler (Port 6543)

Update `.env` file:
```env
DATABASE_URL="postgresql://postgres:Fo1r7OamRLCUPSXv@db.tbctgfdcjhyoijmvwiku.supabase.co:6543/postgres?pgbouncer=true&sslmode=require"
DIRECT_URL="postgresql://postgres:Fo1r7OamRLCUPSXv@db.tbctgfdcjhyoijmvwiku.supabase.co:5432/postgres?sslmode=require"
```

### Option B: Get Fresh Connection String

1. Go to Supabase Dashboard → **Settings** → **Database**
2. Copy the **Connection string** (URI format)
3. Update `.env` with the fresh connection string

---

## ✅ Step 5: Check Network/Firewall

If you're behind a corporate firewall:
- ✅ Check if port 5432 is allowed
- ✅ Try from a different network
- ✅ Check VPN settings

---

## ✅ Step 6: Verify Password

1. Go to Supabase Dashboard → **Settings** → **Database**
2. Click **Reset Database Password** if needed
3. Update `.env` with new password

---

## 🔄 After Fixing: Retry Commands

Once the connection is working:

```bash
# Test connection
node test-connection.js

# Push schema
npm run db:push

# Import WordPress data
npm run migrate:wordpress
```

---

## 📞 Still Having Issues?

1. **Check Supabase Status Page:** https://status.supabase.com
2. **Supabase Support:** Check project logs in dashboard
3. **Verify Project Settings:** Ensure project is not paused or deleted

---

## ✅ Quick Checklist

- [ ] Supabase project is active (not paused)
- [ ] Connection string is correct
- [ ] Password is correct
- [ ] Network/firewall allows connection
- [ ] Port 5432 is accessible
- [ ] SSL mode is set to `require`

---

**Most Common Fix:** Resume paused Supabase project in dashboard! 🚀
