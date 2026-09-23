# Supabase backend

This is the whole backend for Nami Ramen: three tables in your Supabase
project, with Row Level Security policies. No separate server needed — the
frontend talks to Supabase directly via `src/api/supabaseClient.js`.

## Setup

1. Create a project at https://supabase.com (or use an existing one).
2. Open the SQL editor in the Supabase dashboard.
3. Run `schema.sql` first, then `seed.sql`.
4. Copy your project's URL and anon/publishable key into `nami-ramen/.env`:
   ```
   VITE_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
   ```
5. Restart `npm run dev`. `menuService.js` and `orderService.js` switch from
   local mock data to these tables automatically — no frontend code changes.

## Tables

- **categories** — menu section (Ramen, Sides, Drinks, Extras). Public read.
- **menu_items** — each dish, linked to a category. Public read.
- **orders** — placed orders (`items` stored as JSON). Anyone can insert
  (guest checkout is supported); a signed-in user can only read their own
  orders.

## Updating the menu

Edit `src/data/menu.js`, then regenerate the seed file and re-run it in the
SQL editor:

```
node scripts/generate-seed.mjs > supabase/seed.sql
```
