# Success Enterprise

A small storefront for IT and content-creation accessories — Vite + React on the frontend, Supabase for the database, auth, storage, and payment verification.

## Setup

1. Copy `.env.example` to `.env` and fill in your Supabase project URL, anon (publishable) key, and Paystack public key.
2. Push the schema: `npx supabase link --project-ref <your-project-ref>` then `npx supabase db push`.
3. Load starter categories: paste `supabase/seed.sql` into the Supabase SQL editor and run it (or `npx supabase db query --linked -f supabase/seed.sql`).
4. Create an admin login: Supabase dashboard → Authentication → Users → Add user (email + password). That's the only account that can sign in to `/admin`.
5. Deploy the payment-verification function: `npx supabase functions deploy verify-payment`, then `npx supabase secrets set PAYSTACK_SECRET_KEY=sk_test_...`.
6. `npm install && npm run dev`.

## Scripts

- `npm run dev` — start the local dev server
- `npm run build` — type-check and build for production
- `npm run lint` — lint the codebase
