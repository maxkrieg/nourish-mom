# Domain: Admin Dashboard
_Always read `00_project_brief.md` and `09_design.md` first._

## Overview
The admin dashboard gives the Nourish Mom team visibility into incoming orders and control over the menu. Since orders are simple one-time purchases with no scheduling, the admin side is straightforward: manage what's on the menu and manage incoming orders.

## User Stories
- As an admin, I want to add a new menu item so that customers can see and order it.
- As an admin, I want to edit an existing menu item so that I can keep its details accurate.
- As an admin, I want to mark a menu item as available or unavailable so that customers can only order items the kitchen can fulfill.
- As an admin, I want to view all incoming orders so that I have a clear picture of what needs to be fulfilled.
- As an admin, I want to update the status of an order so that the team knows where each order stands.

## Route Protection
All `/admin` routes and `/api/admin` routes must verify the authenticated user has `role: ADMIN`. Return 403 if not.

---

## Admin Layout
- Fixed left sidebar, white background, `border-r border-neutral-border`, `w-60`
- "Nourish Mom" wordmark at top of sidebar
- Nav links:
  - Orders → `/admin/orders`
  - Menu → `/admin/menu`
- Active item: `bg-teal-light text-teal rounded-lg mx-2 px-3 py-2`
- `<LogoutButton />` at the bottom of the sidebar

### Component
`<AdminLayout />` in `components/admin/AdminLayout.tsx` — wraps all admin pages via `app/(admin)/layout.tsx`

---

## Pages

### `/admin/orders` — Order Management (default admin page)

**Layout:**
- Page heading: "Orders"
- Full-width table of all orders, sorted by `createdAt` descending

**Table columns:**
- **Date** — formatted `createdAt` (e.g. "Mar 6, 2026")
- **Customer** — user email
- **Items** — comma-separated list of meal names and quantities (e.g. "Chicken Soup ×2, Rice Bowl ×1")
- **Total** — order total in dollars
- **Status** — colored badge + inline dropdown to update
- **Notes** — truncated special notes, full text on hover tooltip

**Status badge colors:**
- Pending: neutral grey
- Confirmed: teal
- Preparing: amber
- Out for Delivery: teal light
- Delivered: green
- Cancelled: red

**Status update:**
- Each row has an inline dropdown showing current status
- Selecting a new status calls `PATCH /api/admin/orders/[id]`
- Show success toast on update

**No pagination for MVP** — load all orders.

---

### `/admin/menu` — Menu Management

**Layout:**
- Page heading: "Menu"
- "Add Item" button top right → navigates to `/admin/menu/new`
- Table of all menu items

**Table columns:**
- **Name**
- **Description** — truncated to one line
- **Tags** — rendered as small pill badges
- **Price** — formatted in dollars
- **Available** — toggle switch, calls `PATCH /api/admin/menu/[id]` on change
- **Actions** — "Edit" link → `/admin/menu/[id]/edit`

---

### `/admin/menu/new` and `/admin/menu/[id]/edit` — Menu Item Form

**Fields:**
- Name (required, text input)
- Description (required, textarea)
- Tags (tag input — type and press enter to add, click × to remove)
- Price (required, number input in dollars — store as cents in DB)
- Available (toggle, default true)

**On save:**
- New: `POST /api/admin/menu`
- Edit: `PATCH /api/admin/menu/[id]`
- Redirect to `/admin/menu` on success
- Show inline validation errors if fields are missing

---

## API Routes

### Orders
- `GET /api/admin/orders` — Returns all orders with user email, items (with meal names), and calculated total. Response: `{ data: orders }`
- `PATCH /api/admin/orders/[id]` — Update order status. Body: `{ status: OrderStatus }`. Response: `{ data: order }`

### Menu
- `POST /api/admin/menu` — Create menu item. Body: `{ name, description, tags, price, available }`. Price sent as dollars, stored as cents (multiply by 100).
- `PATCH /api/admin/menu/[id]` — Update menu item. Body: partial `MenuItem`.
- `DELETE /api/admin/menu/[id]` — Delete item. Only allow if no associated orders exist.

---

## Components to Build
- `<AdminLayout />` — sidebar + content shell
- `<OrdersTable />` — orders table with inline status dropdown
- `<StatusBadge />` — colored pill for order status
- `<MenuTable />` — menu table with availability toggle
- `<MenuItemForm />` — shared form for create and edit
- `<TagInput />` — type-to-add, click-to-remove tag input

---

## Seed Data
Before testing, seed the database with:
1. At least one admin user — register normally then update `role` to `ADMIN` directly in Supabase Table Editor
2. At least 3–5 menu items via the admin UI once it's built

## Notes
- Use TanStack Table via shadcn/ui data table pattern for both tables
- All admin mutations should show a success or error toast
- Price is stored in cents (Int) in the DB — always convert to/from dollars in the UI and API layer
- No delivery windows, operating schedule, or capacity management — those are removed entirely
