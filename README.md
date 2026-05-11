# 🌿 Nourish Mom

**Postpartum-friendly meal delivery for new mothers.**

Nourish Mom is a full-stack web application for a food delivery service designed specifically for postpartum mothers and their caregivers. Customers browse a curated menu, build an order, and pay securely — meals are delivered fresh to their door. An admin dashboard gives the Nourish Mom team full control over the menu and incoming orders.

---

## ✨ Features

### 👩 Customer-Facing

- **Public landing page** — Hero section, How It Works walkthrough, feature highlights, and a call-to-action banner, all visible without an account.
- **Account registration & login** — Email/password auth via Supabase. Authenticated users are automatically redirected to the menu.
- **Browsable menu** — Full menu grid with meal cards showing name, description, dietary tags, price, and availability. Sold-out items are visually dimmed and non-orderable.
- **Tag filtering** — Client-side dietary tag filter bar (e.g. "high-iron", "breastfeeding-friendly", "gluten-free"). Multiple tags can be active at once (AND logic). No page reload.
- **3-step order flow:**
  1. **Meals** (`/menu`) — Add items and set quantities with +/− controls. A sticky sidebar (desktop) or fixed bottom bar (mobile) shows a running order summary.
  2. **Notes** (`/order`) — Optional textarea for kitchen instructions, allergies, or access notes (up to 500 characters).
  3. **Review** (`/order/review`) — Full order summary with item list, totals, and a "Proceed to Payment" button that opens a Stripe Checkout session.
- **Stripe Checkout** — Secure, hosted payment page. Orders are created in the database only after Stripe confirms payment via webhook.
- **Order confirmation** — Customers receive a confirmation email via Resend after a successful payment.
- **Customer profile** — Delivery address, dietary restrictions, allergies, and personal notes — all editable from `/account`.
- **Order success page** — Post-payment landing page pulled from the database using the Stripe session ID.

### 🔧 Admin Dashboard (`/admin`)

- **Role-gated access** — Only users with `role: ADMIN` can access `/admin` routes. All others receive a 403.
- **Orders table** — Full list of all orders sorted by date, showing customer email, meal breakdown, order total, status badge, and special notes (with tooltip on hover).
- **Inline status updates** — Admins can update order status (Pending → Confirmed → Preparing → Out for Delivery → Delivered → Cancelled) directly from the orders table row. Status badges are color-coded.
- **Menu management** — Add, edit, and toggle availability for menu items from a dedicated table view.
- **Menu item form** — Create or edit items with name, description, tag input, price (in dollars — stored as cents), and availability toggle.

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.1.6 — App Router |
| Language | TypeScript 5 — strict mode |
| Styling | Tailwind CSS v4 — custom design tokens in `globals.css` |
| Components | shadcn/ui (new-york) + Radix UI primitives |
| Database ORM | Prisma 7 + `@prisma/adapter-pg` |
| Auth | Supabase Auth (`@supabase/ssr`, email/password) |
| Database | PostgreSQL via Supabase |
| Payments | Stripe v20 — Checkout Sessions + webhooks |
| Email | Resend |
| Validation | Zod v4 |
| Tables | TanStack Table v8 (admin data tables) |
| Toasts | sonner |
| Icons | lucide-react (stroke-width 1.5) |
| Dark mode | next-themes |

---

## 📁 Project Structure

```
app/
  (admin)/admin/        # Admin dashboard — role-gated (AdminSidebar)
    orders/             # Order management table + inline status updates
    menu/               # Menu item table, new/edit forms
  (auth)/               # Login + register — no shared layout
  (customer)/           # Customer app — wrapped in OrderProvider + Footer
    account/            # Customer profile page
    menu/               # Step 1 — meal selection
    order/              # Step 2 (notes) + Step 3 (review) + success page
  api/
    admin/menu/         # POST, PATCH menu items (admin)
    admin/orders/       # GET, PATCH orders (admin)
    auth/logout/        # Logout
    account/profile/    # PATCH profile
    checkout/           # POST — create Stripe Checkout Session
    menu/               # GET menu items (public)
    orders/             # POST create order; GET by id
    webhooks/stripe/    # POST — Stripe webhook, creates Order on payment
  globals.css           # Tailwind v4 @theme inline — all design tokens
  layout.tsx            # Root layout — Inter font, Toaster
  page.tsx              # Landing page (Hero, HowItWorks, WhyNourishMom, CTABanner)

components/
  admin/                # AdminSidebar, MenuTable, MenuItemForm, OrdersTable
  auth/                 # Auth forms + logout button
  customer/             # Menu, order summary, profile, landing page sections
  order/                # OrderContext, step indicator, NotesForm, OrderReview
  ui/                   # shadcn/ui primitives — do not edit directly

lib/
  generated/prisma/     # Prisma-generated client — do not edit manually
  admin-auth.ts         # requireAdmin() helper
  prisma.ts             # Prisma singleton (globalThis pattern)
  resend/index.ts       # sendOrderConfirmation()
  stripe/index.ts       # Stripe singleton
  supabase/             # server.ts (cookie-based) + client.ts (browser)
  utils.ts              # cn() helper (clsx + tailwind-merge)

prisma/
  schema.prisma         # Database schema

proxy.ts                # Next.js 16 middleware (replaces middleware.ts)
specs/                  # Domain spec files — read before working on a domain
```

---

## 🔄 Order Flow

The order flow is three steps with no scheduling, recurring deliveries, or delivery windows.

```
/menu  →  /order  →  /order/review  →  Stripe Checkout  →  /order/success
  1           2             3
Meals       Notes         Review
```

State is held in `OrderContext` (React context) and provided by the `/(customer)` layout so selections persist across all three steps. The order record is **only created after Stripe confirms payment** via webhook — not at checkout initiation.

---

## 🗄️ Data Model

```
User
  ├── Profile      (delivery address, dietary restrictions, allergies)
  └── Order[]
        ├── OrderItem[]  (menuItemId, quantity)
        └── MenuItem     (name, description, tags, price in cents, available)
```

**Order statuses:** `PENDING` → `CONFIRMED` → `PREPARING` → `OUT_FOR_DELIVERY` → `DELIVERED` (or `CANCELLED`)

**User roles:** `CUSTOMER` (default) | `ADMIN`

---

## 🎨 Design System

The design is modern, crisp, and warm — generous whitespace, confident typography, and a palette of muted teals and pinks.

**Primary color:** `#4A9B8E` (muted teal) — buttons, active states, key UI elements  
**Secondary color:** `#C4848A` (muted dusty pink) — accents, tag badges  
**Background:** `#FAFAF9` (warm off-white) — never pure white or pure grey  
**Font:** Inter (via `next/font/google`)

All design tokens are defined in `app/globals.css` using Tailwind v4's `@theme inline` — there is no `tailwind.config.ts`.

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- A Supabase project (PostgreSQL database + Auth)
- A Stripe account
- A Resend account

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env.local` file in the project root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Database (Supabase connection string)
DATABASE_URL=

# Stripe
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# Resend
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

### 5. Seed an admin user

1. Register a user via the `/register` page.
2. In the Supabase Table Editor, find the `User` record and set `role` to `ADMIN`.
3. Log in and visit `/admin` to access the dashboard.

---

## 🛠️ Development Commands

```bash
npm run dev        # Start dev server (Next.js 16 + Turbopack)
npm run build      # Production build (also runs tsc)
npm run lint       # ESLint
npx tsc --noEmit   # Type-check only

# After any schema change:
npx prisma db push && npx prisma generate
```

### Stripe webhooks (local dev)

To test the full payment → order creation flow locally, forward Stripe events to your dev server:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copy the printed webhook signing secret into `STRIPE_WEBHOOK_SECRET` in `.env.local`.

---

## 📋 API Overview

| Method | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/api/menu` | Public | List all menu items |
| `POST` | `/api/checkout` | Customer | Create Stripe Checkout Session |
| `POST` | `/api/webhooks/stripe` | Stripe | Handle payment confirmation, create order |
| `GET` | `/api/orders` | Customer | Get order by Stripe session ID |
| `PATCH` | `/api/account/profile` | Customer | Update profile |
| `GET` | `/api/admin/orders` | Admin | List all orders |
| `PATCH` | `/api/admin/orders/[id]` | Admin | Update order status |
| `POST` | `/api/admin/menu` | Admin | Create menu item |
| `PATCH` | `/api/admin/menu/[id]` | Admin | Update menu item |

All responses follow the shape `{ data, error }`.
