# 🧁 Sethi Bakery — Online Store

Premium e-commerce platform for **Sethi Bakery**, Near Bus Adda, Patti, Punjab.
Custom cakes, pastries, cream rolls, patties and daily groceries — with pickup
or local delivery, in English, ਪੰਜਾਬੀ and हिंदी.

Built with Next.js 15 + Supabase + Tailwind 4. Runs entirely on free tiers.

## Quick start (demo mode)

```bash
npm install
npm run dev
```

Open http://localhost:3000 — with no configuration the site runs in **demo
mode** with a bundled sample catalog. You can browse, build cakes, and place
test orders (not saved). This is also what deploys to Vercel before the
database is connected.

## Going live — checklist

### 1. Supabase (free tier)
1. Create a project at [supabase.com](https://supabase.com)
2. In the SQL editor, run `supabase/migrations/0001_init.sql`, then `supabase/seed.sql`
3. Copy the project URL + anon key + service-role key into your Vercel
   environment variables (see `.env.example`)

### 2. Storage buckets (for product photos)
In Supabase Dashboard → Storage, create two buckets:
- `product-images` — **public** (product photos served to customers)
- `cake-refs` — **private** (customers' cake reference images)

### 3. Admin login for your brother
1. Supabase Dashboard → Authentication → Add user (email + password)
2. SQL editor:
   ```sql
   insert into shop_members (user_id, shop_id, role)
   select u.id, s.id, 'owner' from auth.users u, shops s
   where u.email = 'BROTHER_EMAIL_HERE';
   ```
3. He signs in at `/admin` — orders arrive there and every order also has a
   one-tap "Send on WhatsApp" button on the customer's confirmation page.
4. Set `NEXT_PUBLIC_SHOP_WHATSAPP` to the shop's WhatsApp number (e.g. `9198xxxxxxxx`).

**Daily admin workflow** (all from a phone at `/admin`):
- **Add an item**: Products → "+ Add item" → take a photo → name → price →
  Save. It's live on the website immediately. The form keeps the category
  selected so a whole shelf can be added in minutes.
- **Out of stock**: one tap on the switch next to any product.
- **Orders**: live list with tap-to-call, cake message/date highlighted, and a
  single button to advance status (received → preparing → ready → delivered).
- **Pause the shop**: Shop tab → "Accepting orders" switch.

Before the database is connected, `/admin` runs as a **demo preview** with
sample data so you can try every screen.

### 4. Razorpay (after KYC — the site works without it)
- Sign up at [razorpay.com](https://razorpay.com); KYC needs the shop/proprietor
  PAN + bank account. **FSSAI registration is legally required for a food
  business** — basic registration is inexpensive for small turnover.
- Add `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` and redeploy — the "Pay online
  (UPI/card)" option appears automatically at checkout.
- Add a webhook in the Razorpay dashboard pointing to
  `https://YOUR-DOMAIN/api/razorpay/webhook` (events: `payment.captured`,
  `order.paid`, `payment.failed`) and set `RAZORPAY_WEBHOOK_SECRET`.
- Until then, customers use Cash on Delivery / pay at pickup.

### 5. Deploy on Vercel (free tier)
1. Import this repo at [vercel.com](https://vercel.com)
2. Add the environment variables from `.env.example`
3. Set `NEXT_PUBLIC_SITE_URL` to your deployed URL

## Architecture notes

- **Money** is integer paise everywhere. Prices are always re-computed
  server-side in `lib/orders.ts` — the client's price is never trusted.
- **Cake pricing** (`lib/pricing.ts`):
  `round5((kg × rate + Σflat + Σ(perKg × kg)) × Πmultiplier)` — unit-tested in
  `lib/pricing.test.ts` (`npm test`).
- **i18n**: UI strings in `messages/{en,pa,hi}.json`; product names are jsonb
  `{"en", "pa", "hi"}` columns that fall back to English, so the admin only
  ever *has* to write English.
- **Multi-shop ready**: every table carries `shop_id` (one row in `shops`
  today). This is the foundation for the future "shop local" platform where
  other Patti shops get their own storefronts.
- **Demo mode**: `lib/demo-data.ts` mirrors `supabase/seed.sql`; the data
  layer (`lib/catalog.ts`) switches automatically based on env vars.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm test` | Pricing engine unit tests (Vitest) |
| `npm run typecheck` | TypeScript check |
