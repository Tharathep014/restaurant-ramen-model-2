# Nami Ramen — ordering site

A responsive, app-like ordering flow for a ramen restaurant: browse
menu → item detail → cart → checkout → confirmation, plus a lightweight
sign-in/profile. Built with React + Vite, wired for Supabase.

## วิธีรันเว็บไซต์

1. เปิด PowerShell หรือ Command Prompt แล้วเข้าโฟลเดอร์โปรเจกต์:
   ```powershell
   cd C:\Users\USER\Downloads\Restaurant-Ramen-Model-4\nami-ramen
   ```
2. ติดตั้งแพ็กเกจครั้งแรก:
   ```powershell
   npm.cmd install --legacy-peer-deps
   ```
   หากเทอร์มินัลใช้งานคำสั่ง `npm` ได้ตามปกติ สามารถใช้ `npm install --legacy-peer-deps` แทนได้
3. เริ่มเซิร์ฟเวอร์สำหรับพัฒนา:
   ```powershell
   npm.cmd run dev
   ```
4. เปิด URL ที่แสดงในเทอร์มินัล โดยปกติคือ `http://localhost:5173/`

กด `Ctrl+C` ในเทอร์มินัลเพื่อหยุดเซิร์ฟเวอร์

## Connecting Supabase

The publishable key you gave me is already wired into
`src/api/supabaseClient.js` as a fallback default — it's a public/anon
key, so it's fine to ship in client code. To fully connect it:

1. Copy `.env.example` to `.env`.
2. Fill in `VITE_SUPABASE_URL` with your actual project URL (find it in
   your Supabase project settings → API).
3. Restart `npm run dev`.

Until `.env` has a real URL, the app runs entirely on the local mock
menu in `src/data/menu.js` — every page works, nothing is blocked on
the backend.

### Tables to create when you're ready

- `categories` — id, name, blurb
- `menu_items` — id, category_id, name, price, description, tag, spice
- `orders` — id, items (jsonb), total, fulfillment, notes, status

`src/services/menuService.js` and `src/services/orderService.js` already
know how to read/write these — no page code needs to change once the
tables exist.

## Folder structure

Follows the architecture you sketched, adjusted to standard Vite
convention (`src/` next to `public/`, not nested inside it):

```
src/
  api/         → supabaseClient.js (backend connection)
  assets/      → fonts, styles/ (static files)
  components/
    layout/    → Header, BottomNav, Layout
    ui/        → Button, Badge, MenuCard, QuantityStepper, BowlMark (reusable components)
  context/     → CartContext, AuthContext (global state)
  data/        → menu.js (static content, used until Supabase tables exist)
  hooks/       → useMenu.js (custom logic)
  pages/       → Home, Categories, MenuDetail, Cart, Checkout, OrderConfirmation, SignIn, Profile
  redux/       → reserved for later — see redux/README.md for why Context is used for now
  services/    → menuService.js, orderService.js (frontend logic / API calls)
  utils/       → formatCurrency.js, constants.js (utility functions)
```

## Design

Light theme with a chili-oil orange accent (`#e4572e`) on a warm white
background, `Fraunces` for headings and `Public Sans` for body/UI text.
No sidebar, no stock icon kit, no kanji/Japanese-symbol iconography —
the brand mark is a simple custom bowl-and-steam SVG
(`src/components/ui/BowlMark.jsx`) used throughout instead. Tokens live
in `src/assets/styles/theme.css` if you want to adjust the palette.
