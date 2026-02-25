# Admin User & WordPress Import – Complete

## Admin user

- **Email:** `info@vistaneotech.com`
- **Password:** `Admin@123`
- **Role:** Super Admin  
- **Change this password** after first login (e.g. in Supabase Dashboard or your admin panel).

## WordPress import

- **Pages:** 49
- **Posts:** 66  
- **Redirects:** 115  

All URLs and SEO fields from `URL_MIGRATION_MAP.json` are in Supabase (tables: `pages`, `posts`, `redirects`).

## Re-run seed (optional)

To re-import or fix data:

```bash
node --env-file=.env scripts/seed-wordpress-supabase.mjs
```

Upserts by `slug` / `source_url`, so it’s safe to run multiple times.

## Create another admin (when DB is reachable)

```bash
npm run create:admin
```

Then enter email, password, and display name when prompted.
