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
