# 🌿 Nourish Mom

**Postpartum-friendly meal delivery for new mothers.**

Nourish Mom is a full-stack web application for a food delivery service designed specifically for postpartum mothers and their caregivers. Customers browse a curated menu, build an order, and pay securely — meals are delivered fresh to their door.

---

## ✨ Features

### 👩 Customer-Facing

- Browse a postpartum-friendly menu with dietary tag filtering
- 3-step order flow: select meals → add kitchen notes → review and pay
- Secure checkout via Stripe with email confirmation on payment
- Customer profile for managing delivery address, dietary restrictions, and allergies

### 🔧 Admin Dashboard

- View and manage all incoming orders with inline status updates
- Full menu management — add, edit, and toggle availability of items

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 — App Router |
| Language | TypeScript 5 — strict mode |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Database | PostgreSQL via Supabase |
| ORM | Prisma 7 |
| Auth | Supabase Auth (email/password) |
| Payments | Stripe — Checkout Sessions + webhooks |
| Email | Resend |
| Validation | Zod v4 |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- A Supabase project (PostgreSQL + Auth)
- A Stripe account
- A Resend account

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
RESEND_API_KEY=
```

### 3. Push the database schema

```bash
npx prisma db push
npx prisma generate
```

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### 5. Create an admin user

1. Register via `/register`.
2. In the Supabase Table Editor, set the user's `role` to `ADMIN`.
3. Log in and visit `/admin`.

---

## 🛠️ Development

```bash
npm run dev        # Start dev server (Turbopack)
npm run build      # Production build
npm run lint       # ESLint
npx tsc --noEmit   # Type-check only

# After any schema change:
npx prisma db push && npx prisma generate
```

To test the full payment flow locally, forward Stripe webhook events to your dev server:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copy the printed webhook signing secret into `STRIPE_WEBHOOK_SECRET` in `.env.local`.
