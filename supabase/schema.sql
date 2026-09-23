-- Nami Ramen — Supabase schema
-- Run this in the Supabase SQL editor (or `supabase db push` with the CLI).
-- Matches the shape src/services/menuService.js and src/services/orderService.js
-- already expect, so the frontend needs no code changes once this is applied.

-- ────────────────────────────────────────────────────────────
-- categories
-- ────────────────────────────────────────────────────────────
create table if not exists categories (
  id text primary key,
  name text not null,
  blurb text
);

alter table categories enable row level security;

drop policy if exists "categories are publicly readable" on categories;
create policy "categories are publicly readable"
  on categories for select
  using (true);

-- ────────────────────────────────────────────────────────────
-- menu_items
-- ────────────────────────────────────────────────────────────
create table if not exists menu_items (
  id text primary key,
  category_id text not null references categories(id) on delete cascade,
  image text,
  name text not null,
  price numeric(10, 2) not null,
  description text,
  tag text,
  spice smallint not null default 0
);

create index if not exists menu_items_category_id_idx on menu_items(category_id);

alter table menu_items enable row level security;

drop policy if exists "menu items are publicly readable" on menu_items;
create policy "menu items are publicly readable"
  on menu_items for select
  using (true);

-- ────────────────────────────────────────────────────────────
-- orders
-- ────────────────────────────────────────────────────────────
create table if not exists orders (
  id text primary key,
  user_id uuid references auth.users(id) on delete set null,
  items jsonb not null,
  total numeric(10, 2) not null,
  fulfillment text not null check (fulfillment in ('pickup', 'delivery')),
  notes text,
  status text not null default 'confirmed',
  placed_at timestamptz not null default now()
);

-- In case `orders` already existed (e.g. created earlier by hand) without
-- these columns, add whatever is missing so the policies below can rely on them.
alter table orders add column if not exists user_id uuid references auth.users(id) on delete set null;
alter table orders add column if not exists items jsonb;
alter table orders add column if not exists total numeric(10, 2);
alter table orders add column if not exists fulfillment text;
alter table orders add column if not exists notes text;
alter table orders add column if not exists status text not null default 'confirmed';
alter table orders add column if not exists placed_at timestamptz not null default now();
alter table orders add column if not exists payment_method text not null default 'cash';

create index if not exists orders_user_id_idx on orders(user_id);

alter table orders enable row level security;

-- Anyone (including guests) can place an order — the app supports checkout
-- without requiring sign-in. If the user is signed in, tie the row to them.
drop policy if exists "anyone can place an order" on orders;
create policy "anyone can place an order"
  on orders for insert
  with check (user_id is null or user_id = auth.uid());

-- Signed-in users can only see their own orders.
drop policy if exists "users can read their own orders" on orders;
create policy "users can read their own orders"
  on orders for select
  using (user_id = auth.uid());

drop policy if exists "admins can read all orders" on orders;
create policy "admins can read all orders"
  on orders for select
  using ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

drop policy if exists "admins can update orders" on orders;
create policy "admins can update orders"
  on orders for update
  using ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

create table if not exists wallets (
  user_id uuid primary key references auth.users(id) on delete cascade,
  balance numeric(10, 2) not null default 0 check (balance >= 0),
  updated_at timestamptz not null default now()
);

alter table wallets enable row level security;

drop policy if exists "users can read their wallet" on wallets;
create policy "users can read their wallet"
  on wallets for select
  using (user_id = auth.uid());

-- ────────────────────────────────────────────────────────────
-- wallet balance changes
-- ────────────────────────────────────────────────────────────
-- No insert/update policy exists on `wallets` for anon/authenticated roles,
-- so clients cannot change a balance directly — only this function can, and
-- only the service_role (i.e. an Edge Function using the service role key)
-- may call it. `for update` row-locks the wallet row for the duration of the
-- transaction so concurrent top-up/checkout calls can't race each other.
create or replace function public.adjust_wallet_balance(target_user uuid, delta numeric)
returns numeric
language plpgsql
security definer
set search_path = public
as $$
declare
  current_balance numeric;
  new_balance numeric;
begin
  insert into wallets (user_id, balance)
  values (target_user, 0)
  on conflict (user_id) do nothing;

  select balance into current_balance
  from wallets
  where user_id = target_user
  for update;

  new_balance := current_balance + delta;

  if new_balance < 0 then
    raise exception 'insufficient_balance';
  end if;

  update wallets
  set balance = new_balance, updated_at = now()
  where user_id = target_user;

  return new_balance;
end;
$$;

revoke all on function public.adjust_wallet_balance(uuid, numeric) from public;
grant execute on function public.adjust_wallet_balance(uuid, numeric) to service_role;
