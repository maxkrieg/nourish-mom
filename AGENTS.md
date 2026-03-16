# AGENTS.md — Nourish Mom

Guidance for agentic coding assistants working in this repository.

---

## Commands

```bash
npm run dev        # Start dev server (Next.js 16 Turbopack)
npm run build      # Production build (also runs tsc)
npm run lint       # ESLint (flat config, next/core-web-vitals + typescript)
npx tsc --noEmit   # Type-check only (run from project root)
```

**Tests:** No test framework is configured. There are no test files.

**After schema changes:** Always run `npx prisma db push && npx prisma generate` manually.
The database is not reachable from the agent environment — instruct the user to run this in their terminal.

**Build cache:** If `tsc --noEmit` reports errors in files that no longer exist on disk, clear the cache first:
```bash
rm -rf .next && npx tsc --noEmit
```

---

## Project Structure

```
app/
  (admin)/admin/       # Admin dashboard — role-gated layout (AdminSidebar)
  (auth)/              # Login + register — no shared layout
  (customer)/          # Customer-facing app — wrapped in OrderProvider + Footer
    account/           # Customer profile page
    menu/              # Step 1 — meal selection
    order/             # Step 2 (notes) + Step 3 (review) + success page
  api/                 # API route handlers
    admin/menu/        # POST, PATCH menu items (admin)
    admin/orders/      # GET, PATCH orders (admin)
    auth/logout/       # Logout
    account/profile/   # PATCH profile
    checkout/          # POST — create Stripe Checkout Session
    menu/              # GET menu items
    orders/            # POST create order; GET by id
    webhooks/stripe/   # POST — Stripe webhook; creates Order on payment success
  globals.css          # Tailwind v4 @theme inline — all design tokens live here
  layout.tsx           # Root layout — Inter font, Toaster
  page.tsx             # Landing page (Hero, HowItWorks, WhyNourishMom, CTABanner)
components/
  admin/               # Admin-only UI (AdminSidebar, MenuTable, MenuItemForm, OrdersTable)
  auth/                # Auth forms + logout
  customer/            # Customer-facing UI (menu, order summary, profile, landing page sections)
  order/               # Order flow (context, step indicator, notes, review)
  ui/                  # shadcn/ui primitives — do not edit directly
lib/
  generated/prisma/    # Prisma-generated client — do not edit manually
  admin-auth.ts        # requireAdmin() helper
  prisma.ts            # Prisma singleton (globalThis pattern)
  resend/index.ts      # sendOrderConfirmation()
  stripe/index.ts      # Stripe singleton
  supabase/            # server.ts (cookie-based) + client.ts (browser)
  utils.ts             # cn() helper (clsx + tailwind-merge)
prisma/
  schema.prisma
prisma.config.ts       # Loads .env.local, points to schema + PrismaPg adapter
proxy.ts               # Next.js 16 middleware (replaces middleware.ts — never use both)
specs/                 # Markdown spec files — read these before working on a domain
```

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16.1.6 — App Router |
| Language | TypeScript 5 — strict mode |
| Styling | Tailwind CSS v4 — tokens in `globals.css` via `@theme inline` |
| Components | shadcn/ui (new-york style) + Radix UI primitives |
| Database ORM | Prisma 7 + `@prisma/adapter-pg` (driver adapter) |
| Auth | Supabase Auth (`@supabase/ssr`) |
| Payments | Stripe v20 (Checkout Sessions + webhooks) |
| Email | Resend |
| Validation | Zod v4 |
| Toasts | sonner |
| Icons | lucide-react (stroke-width 1.5) |
| Tables | @tanstack/react-table v8 (admin data tables) |
| Dark mode | next-themes |
| Animations | tw-animate-css |

**Important Tailwind note:** There is no `tailwind.config.ts`. All theme tokens (`bg-teal`, `text-neutral-muted`, etc.) are defined in `app/globals.css` using `@theme inline { ... }`. Do not create a `tailwind.config.ts`.

---

## Code Style

### Formatting
- **Single quotes** throughout. (`app/layout.tsx` uses double quotes — that is a generated artifact, leave it.)
- **Semicolons** always.
- No Prettier config — match the surrounding file's style exactly.

### TypeScript
- `strict: true` — no `any` except as a temporary workaround with an `// eslint-disable-next-line` comment explaining why.
- Use `import type` for Prisma models and any pure type-only imports.
- Use `interface` for component props (`interface MenuItemCardProps { ... }`), `type` for data shapes.
- Name props interfaces `[ComponentName]Props`.
- Path alias `@/*` maps to the project root (not `src/`).

### Imports
Order (no blank lines between groups):
1. React / Next.js built-ins
2. Third-party libraries (`zod`, `stripe`, `sonner`, etc.)
3. Internal `@/lib/...`
4. Internal `@/components/...`
5. Icons (`lucide-react`)

### Naming
| Entity | Convention | Example |
|---|---|---|
| Component files | `PascalCase.tsx` | `MenuItemCard.tsx` |
| Route/lib files | `kebab-case.ts` | `admin-auth.ts` |
| React components | Named `function` declaration | `export function MenuItemCard(...)` |
| Page components | Default export, PascalCase | `export default function AdminOrdersPage()` |
| Server actions | `camelCase` + `Action` suffix | `loginAction`, `registerAction` |
| Action state types | `[Domain]State` | `LoginState` |
| Constants / label maps | `SCREAMING_SNAKE_CASE` | `STATUS_LABELS`, `DIETARY_OPTIONS` |
| CSS design tokens | `bg-teal`, `text-neutral-muted` — see `globals.css` |

### React Components
- **Server Components by default.** Add `'use client'` only when hooks or browser APIs are required. Place the directive at the very top, before all imports.
- Use **named function declarations** for all components, never `const Foo = () => {}`.
- Pages are `default export`; everything else is a named export.
- `async` page/layout functions fetch data directly — no `useEffect` for data fetching.

### API Routes (`app/api/**/route.ts`)
Every mutating route follows this three-layer pattern:

```ts
// 1. Auth
const { data: { user } } = await supabase.auth.getUser()
if (!user) return NextResponse.json({ data: null, error: 'Unauthorized' }, { status: 401 })

// 2. Validation
const parsed = Schema.safeParse(body)
if (!parsed.success) return NextResponse.json({ data: null, error: parsed.error.flatten().fieldErrors }, { status: 422 })

// 3. Business logic — return { data, error } always
return NextResponse.json({ data: result, error: null }, { status: 201 })
```

- Response shape is **always** `{ data, error }`.
- Admin routes call `requireAdmin()` from `@/lib/admin-auth` — it returns `{ error: NextResponse }` on failure.
- Validate all inputs with Zod `safeParse` — never trust request bodies.

### Server Actions
- `'use server'` at the top of the file.
- Return a typed state object with an `errors` field (never throw for user-facing errors).
- Use React 19 `useActionState` on the client side.
- Use `redirect()` on success — not a return value.

### Toasts (sonner)
```ts
toast.success('Saved', { style: { borderLeft: '4px solid #4A9B8E' } })
toast.error('Failed', { style: { borderLeft: '4px solid #B85450' } })
```
Every user-facing mutation must show a success or error toast.

### Prisma
- Import the singleton: `import { prisma } from '@/lib/prisma'`
- Import types: `import type { MenuItem } from '@/lib/generated/prisma/client'`
- Use `select` to avoid over-fetching. Use `include` only when related records are needed.
- Serialize `Date` fields to ISO strings before passing to Client Components.

### Supabase Auth
- Server-side: `await createClient()` from `@/lib/supabase/server`, then `supabase.auth.getUser()`.
- Client-side: `createClient()` from `@/lib/supabase/client` (synchronous).
- User role (ADMIN / CUSTOMER) lives in Prisma `User.role`, not Supabase metadata.

---

## Order Flow (simplified — no scheduling)

The order flow is three steps, no delivery windows, no frequency, no start dates:

1. **`/menu`** — Step 1: pick meals (`MenuGrid` + `OrderSummaryPanel`/`OrderSummaryBar`)
2. **`/order`** — Step 2: special notes (`NotesForm`)
3. **`/order/review`** — Step 3: review + Stripe checkout (`OrderReview`)

`OrderContext` (in `components/order/OrderContext.tsx`) holds only `items` and `specialNotes`. It is provided by `app/(customer)/layout.tsx` so state persists across all three steps.

---

## Key Rules

- Read the relevant spec in `specs/` before working on a domain (menu → `04_menu.md`, ordering → `05_ordering.md`, admin → `08_admin.md`, design tokens → `09_design.md`, landing page → `10_landing_page.md`, navigation → `11_navigation_flow.md`).
- Never hardcode secrets — always use environment variables.
- Do not build anything outside the spec without asking the user first.
- `proxy.ts` is the Next.js 16 middleware file. Never create a `middleware.ts` — having both causes a build error.
- The Prisma client is generated to `lib/generated/prisma/` (non-default location). Always import from there.
- Ghost LSP errors referencing deleted files (`MealSelector.tsx`, `ScheduleForm.tsx`, `OrderStepper.tsx`) are stale. Confirm with `ls` before acting on any "file not found" error.
- Order creation happens inside the Stripe webhook handler (`app/api/webhooks/stripe/route.ts`), not at checkout initiation. Do not create orders in `/api/checkout`.
