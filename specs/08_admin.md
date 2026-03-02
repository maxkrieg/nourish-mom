# Domain: Admin Dashboard
_Always read `00_project_brief.md` first._

## User Stories
- As an admin, I want to add a new menu item with a name, description, and dietary tags so that customers have accurate information.
- As an admin, I want to edit an existing menu item so that I can correct or update its details at any time.
- As an admin, I want to mark a menu item as available or unavailable so that customers can only order items the kitchen can fulfill.
- As an admin, I want to set the days and hours the service operates so that the customer-facing scheduler reflects real availability.
- As an admin, I want to define available delivery time windows so that customers can only book slots we offer.
- As an admin, I want to cap the number of orders per delivery slot so that we don't take on more than the kitchen can handle.
- As an admin, I want to view all incoming orders in a dashboard so that I have a clear picture of what needs to be fulfilled.
- As an admin, I want to update the status of an order so that the team knows where each order stands.

## Route Protection
All `/admin` routes and `/api/admin` routes must verify the authenticated user has `role: ADMIN`. Return 403 if not.

## Pages to Build

### `/admin` — Overview / redirect to `/admin/orders`

### `/admin/menu` — Menu Management
1. Table listing all `MenuItem` records (name, tags, available status)
2. Toggle availability inline with a switch/button — calls `PATCH /api/admin/menu/[id]`
3. "Add Item" button opens a modal or navigates to `/admin/menu/new`
4. "Edit" button per row navigates to `/admin/menu/[id]/edit`

### `/admin/menu/new` and `/admin/menu/[id]/edit` — Menu Item Form
- Fields: name, description, tags (tag input), available (toggle)
- On save: `POST /api/admin/menu` (new) or `PATCH /api/admin/menu/[id]` (edit)
- Redirect back to `/admin/menu` on success

### `/admin/schedule` — Operating Schedule & Delivery Windows

**Operating Schedule section:**
- 7 rows (one per day of week)
- Toggle each day open/closed — calls `PATCH /api/admin/schedule/[dayOfWeek]`

**Delivery Windows section:**
- Table listing all `DeliveryWindow` records (label, time range, capacity, active status)
- Toggle active/inactive inline
- "Add Window" button opens a form (inline or modal)
- Fields: label, start time, end time, capacity

### `/admin/orders` — Order Management
1. Table listing all orders, sorted by `createdAt` descending
2. Columns: customer email, meals (count), delivery window, frequency, duration, start date, status
3. Status column shows a dropdown to update order status — calls `PATCH /api/admin/orders/[id]`
4. No pagination for MVP — load all orders

## API Routes

### Menu
- `POST /api/admin/menu` — Create menu item. Body: `{ name, description, tags, available }`
- `PATCH /api/admin/menu/[id]` — Update menu item. Body: partial `MenuItem`
- `DELETE /api/admin/menu/[id]` — Delete menu item (only if no associated orders)

### Schedule
- `PATCH /api/admin/schedule/[dayOfWeek]` — Toggle open/closed. Body: `{ open: boolean }`
- `POST /api/admin/delivery-windows` — Create window. Body: `{ label, startTime, endTime, capacity }`
- `PATCH /api/admin/delivery-windows/[id]` — Update window. Body: partial `DeliveryWindow`

### Orders
- `GET /api/admin/orders` — Returns all orders with user email, items, and delivery window
- `PATCH /api/admin/orders/[id]` — Update order status. Body: `{ status: OrderStatus }`

## Components to Build
- `<AdminLayout />` — Sidebar navigation with links to Orders, Menu, Schedule
- `<MenuTable />` — Table with inline availability toggle
- `<MenuItemForm />` — Shared form for create and edit
- `<ScheduleToggle />` — Day-of-week open/close toggles
- `<DeliveryWindowTable />` — Table with inline active toggle and add form
- `<OrdersTable />` — Orders table with status dropdown

## Notes
- Use TanStack Table (via shadcn/ui's data table pattern) for the orders and menu tables
- Seed one admin user directly in the database for initial access — no admin registration UI needed for MVP
- All admin mutations should show a success/error toast
