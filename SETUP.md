# TutorConnect - Setup Guide

## 1. Supabase Setup

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Once created, go to **Project Settings > API** to get your URL and anon key
3. Go to the **SQL Editor** and paste the entire contents of `supabase/schema.sql`
4. Run the SQL to create all tables and RLS policies
5. Go to **Authentication > Settings** and enable email/password sign-up
6. Go to **Authentication > Providers** and ensure Email is enabled
7. In the SQL editor, run this to create an admin user (replace email/password):
   ```sql
   -- First, sign up via the app, then run:
   UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';
   ```

## 2. Stripe Setup

1. Go to [stripe.com](https://stripe.com) and create an account
2. Get your **Publishable Key** (starts with `pk_`) and **Secret Key** (starts with `sk_`)
3. Go to **Developers > Webhooks** and add an endpoint:
   - URL: `https://your-domain.com/api/webhook`
   - Events: `checkout.session.completed`
   - Get the **Signing Secret** (starts with `whsec_`)

## 3. Environment Variables

Copy `.env.example` to `.env.local` and fill in all values:

```bash
cp .env.example .env.local
```

## 4. Run Locally

```bash
npm run dev
```

## 5. Deploy to Vercel

1. Push to a GitHub repository
2. Go to [vercel.com](https://vercel.com) and import the repo
3. Add all environment variables in Vercel project settings
4. Deploy
