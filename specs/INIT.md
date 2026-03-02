# INIT — Postpartum Food Delivery App

You are helping build **Nourish Mom** — a full-stack web application for a postpartum food delivery service. This file is your starting point. Read it fully before doing anything.

---

## Your Role
You are a senior full-stack engineer. You will scaffold and build this application domain by domain, pausing for confirmation between each one. Do not proceed to the next domain until the user confirms the current one is working.

---

## Spec Files
All detailed specifications live in the `specs/` folder. You must read the relevant spec file before starting each domain. The spec files are:

```
specs/00_project_brief.md    ← Read this first and keep it in mind always
specs/09_design.md           ← Read this second and apply throughout all UI work
specs/01_data_model.md       ← Prisma schema
specs/02_auth.md             ← Authentication
specs/03_customer_profile.md ← Customer profile
specs/04_menu.md             ← Menu browsing
specs/05_ordering.md         ← Order and scheduling flow
specs/06_payments.md         ← Stripe payments
specs/07_notifications.md    ← Email notifications
specs/08_admin.md            ← Admin dashboard
```

---

## Tech Stack
- **Framework:** Next.js 14+ with App Router and TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Database:** PostgreSQL via Supabase
- **ORM:** Prisma
- **Auth:** Supabase Auth via `@supabase/ssr`
- **Payments:** Stripe
- **Email:** Resend
- **Date picker:** react-day-picker
- **Tables:** TanStack Table (via shadcn/ui data table pattern)

---

## Build Order
Work through domains in this exact order. Stop and confirm with the user after each step.

### Step 0 — Project Scaffold
1. Run `npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --no-import-alias`
2. Install dependencies:
```bash
npm install @supabase/ssr @supabase/supabase-js
npm install prisma @prisma/client
npm install stripe
npm install resend
npm install zod
npm install react-day-picker
npm install @tanstack/react-table
npx shadcn@latest init
```
4. Add the following shadcn components:
```bash
npx shadcn@latest add button input label card badge select checkbox toast dialog table dropdown-menu switch
```
5. Extend `tailwind.config.ts` with the custom color tokens and border radius values from `specs/09_design.md`
6. Create a `.env.local` file with placeholder values for all required environment variables (see `specs/00_project_brief.md`)
7. Confirm with user before proceeding

### Step 1 — Data Model
1. Read `specs/01_data_model.md`
2. Initialize Prisma: `npx prisma init`
3. Write the full schema to `prisma/schema.prisma`
4. Run `npx prisma generate`
5. Create `/lib/prisma.ts` as the singleton Prisma client
6. Do NOT run `prisma db push` yet — tell the user to add their `DATABASE_URL` to `.env.local` first, then run it themselves
7. Confirm with user before proceeding

### Step 2 — Auth
1. Read `specs/02_auth.md`
2. Set up Supabase client helpers in `/lib/supabase/`
3. Create middleware at `/middleware.ts`
4. Build `/app/(auth)/register` and `/app/(auth)/login` pages and API logic
5. Confirm with user before proceeding

### Step 3 — Customer Profile
1. Read `specs/03_customer_profile.md`
2. Build `/app/(customer)/account` page
3. Build `PATCH /api/account/profile` route
4. Confirm with user before proceeding

### Step 4 — Menu
1. Read `specs/04_menu.md`
2. Build `/app/(customer)/menu` page and components
3. Build `GET /api/menu` route
4. Confirm with user before proceeding

### Step 5 — Admin Dashboard
1. Read `specs/08_admin.md`
2. Build admin layout and sidebar
3. Build `/admin/menu` with create, edit, availability toggle
4. Build `/admin/schedule` with operating days and delivery windows
5. Build `/admin/orders` with status management
6. Build all `/api/admin/` routes
7. Confirm with user before proceeding

### Step 6 — Ordering & Scheduling
1. Read `specs/05_ordering.md`
2. Build the multi-step order flow at `/app/(customer)/order`
3. Build `GET /api/delivery-windows` and `GET /api/operating-schedule`
4. Build `POST /api/orders` (called from webhook, not directly by customer)
5. Confirm with user before proceeding

### Step 7 — Payments
1. Read `specs/06_payments.md`
2. Build `POST /api/checkout`
3. Build `POST /api/webhooks/stripe` with signature verification
4. Build `/app/(customer)/order/success` page
5. Confirm with user before proceeding

### Step 8 — Notifications
1. Read `specs/07_notifications.md`
2. Create `/lib/resend/index.ts` with email helper functions
3. Wire order confirmation email into the Stripe webhook handler
4. Build `GET /api/cron/delivery-reminders` endpoint
5. Confirm with user before proceeding

---

## General Rules
- Always read the relevant spec file before starting a domain
- Ask the user if anything in the spec is ambiguous before writing code
- Use Server Components for data fetching and Client Components only for interactivity
- Validate all API inputs with Zod
- Return consistent JSON from all API routes: `{ data, error }`
- Never hardcode secrets — use environment variables
- Show a success or error toast for all user-facing mutations
- Do not build anything outside the spec without asking first

---

## How to Start
1. Read `specs/00_project_brief.md` now
2. Read `specs/09_design.md` now — internalize the palette, typography, and component patterns before writing any UI code
3. Confirm you understand the project, stack, and design direction
4. Begin Step 0 — Project Scaffold