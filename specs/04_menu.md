# Domain: Menu & Meal Selection
_Always read `00_project_brief.md` and `09_design.md` first._

## Overview
The `/menu` page serves a dual purpose — it is both the public-facing menu for browsing AND Step 1 of the order flow. There is no separate meal selection step in the order flow. Customers browse, add meals with quantity controls, and proceed directly to scheduling from this page.

## User Stories
- As a customer, I want to browse the full menu so that I can see what meals are offered.
- As a customer, I want to see which items are available or sold out so that I only consider meals I can actually order.
- As a customer, I want to filter meals by dietary tag so that I can quickly find options that suit my needs.
- As a customer, I want to view a description and key details for each meal so that I can make an informed choice.
- As a customer, I want to add meals and set quantities directly from the menu so that I can build my order without leaving the page.
- As a customer, I want to see a running summary of my selections so that I know what I've chosen before proceeding.

## Page: `/menu`

### Layout — Desktop
- **Left/main area (approx 65% width):** meal card grid with filter bar at top
- **Right sidebar (approx 35% width):** sticky order summary panel
  - Sidebar is hidden until at least one meal is added
  - Animates in smoothly when first item is added (`transition-all`)

### Layout — Mobile
- Full width meal card grid
- Fixed bottom bar that appears once at least one meal is added:
  - Left: "{n} item(s) selected"
  - Right: "Continue to Schedule →" button (primary teal)

### Meal Cards
Each card shows:
- Meal name (H3)
- Short description (small body text)
- Dietary tags (pill badges)
- Availability badge — "Sold Out" if `available: false`
- Sold-out cards: `opacity-60`, quantity controls disabled
- **Quantity controls:** minus button, count, plus button
  - Default count: 0
  - Minus button disabled at 0
  - Controls styled: `rounded-full` icon buttons in teal

### Tag Filter Bar
- Renders all unique tags across menu items
- Clicking a tag filters the grid client-side
- Multiple tags active at once (AND logic)
- "All" button clears filters
- No page reload on filter change

### Order Summary Sidebar (Desktop)
- Sticky, appears at top of viewport while scrolling
- Header: "Your Order"
- Lists selected meals with name, quantity, and per-item price
- Subtotal at the bottom
- "Continue to Schedule" button (full width, primary teal)
  - Disabled if no meals selected
  - If unauthenticated: clicking redirects to `/register?next=/order`
  - If authenticated: navigates to `/order`
- "Clear all" ghost link below the button

### Step Indicator
Show the order flow step indicator at the top of the page when the user has at least one item selected:
```
[1 Meals] → [2 Schedule] → [3 Review]
```
Step 1 is always active on this page.

## State Management
- Use React context (`OrderContext`) to hold order state: selected meals and quantities
- `OrderContext` should wrap the entire `/(customer)` layout so state persists as the user navigates from `/menu` to `/order`
- Shape:
```ts
type OrderItem = { menuItemId: string; name: string; price: number; quantity: number }
type OrderContextType = {
  items: OrderItem[]
  addItem: (item: OrderItem) => void
  removeItem: (menuItemId: string) => void
  updateQuantity: (menuItemId: string, quantity: number) => void
  clearOrder: () => void
  totalItems: number
}
```

## API Route

### `GET /api/menu`
- Auth: not required
- Returns all `MenuItem` records
- Response: `{ data: MenuItem[] }`

## Components to Build
- `<MenuPage />` — Server Component shell, fetches menu data, passes to client grid
- `<MenuGrid />` — Client component managing filter state and rendering cards
- `<MenuItemCard />` — Individual meal card with quantity controls
- `<TagFilter />` — Filter pill bar
- `<AvailabilityBadge />` — Available/sold-out pill
- `<QuantityControl />` — Reusable +/- quantity selector
- `<OrderSummaryPanel />` — Desktop sticky sidebar
- `<OrderSummaryBar />` — Mobile fixed bottom bar
- `<OrderContext />` — React context provider in `lib/context/OrderContext.tsx`

## Notes
- Fetch menu data in the Server Component and pass as props to `<MenuGrid />`
- Tag filtering and quantity selection are purely client-side
- Order state in `OrderContext` must be passed into the `/order` scheduling steps so meal selections are not lost on navigation
- After a successful order is placed (Stripe webhook confirmed), call `clearOrder()` on the context
- The `/order` route should redirect to `/menu` if `OrderContext.items` is empty — don't allow scheduling with no meals selected
