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
5. To grant admin access, edit `set-admin-role.sql` with the user's email and
   run it in the SQL editor. Sign out and sign in again after changing a role.
6. Restart `npm run dev`. `menuService.js` and `orderService.js` switch from
   local mock data to these tables automatically — no frontend code changes.

## Tables

- **categories** — menu section (Ramen, Sides, Drinks, Extras). Public read.
- **menu_items** — each dish, linked to a category. Public read.
- **orders** — placed orders (`items` stored as JSON). Anyone can insert
  (guest checkout is supported); a signed-in user can only read their own
  orders.
- **wallets** — one balance per signed-in user. Balance changes must be made by
   a trusted server or Edge Function.

## Updating the menu

Edit `src/data/menu.js`, then regenerate the seed file and re-run it in the
SQL editor:

```
node scripts/generate-seed.mjs > supabase/seed.sql
```

## Wallet Edge Functions

Wallet balances never change from the client directly — `wallets` only has a
`select` policy. Balance changes go through two Edge Functions
(`supabase/functions/`) that use the service role key and the
`adjust_wallet_balance` SQL function (defined at the end of `schema.sql`,
row-locks the wallet row so concurrent calls can't race each other):

- **wallet-top-up** — admin-only, adds funds to a given user's wallet.
- **wallet-checkout** — the signed-in caller's own checkout. Re-prices the
  cart against `menu_items` server-side (never trusts the client's total),
  deducts the wallet, then inserts the order — refunding the deduction if the
  order insert fails.

Deploy them with the Supabase CLI, from `nami-ramen/`:

```
supabase link --project-ref YOUR-PROJECT-REF
supabase functions deploy wallet-top-up
supabase functions deploy wallet-checkout
```

They read `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY`
from the environment Supabase injects automatically into every Edge
Function — no extra secrets to set.
