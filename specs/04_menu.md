# Domain: Menu & Discovery
_Always read `00_project_brief.md` first._

## User Stories
- As a customer, I want to browse the full menu so that I can see what meals are offered.
- As a customer, I want to see which items are available or sold out so that I only consider meals I can actually order.
- As a customer, I want to filter meals by dietary tag so that I can quickly find options that suit my needs.
- As a customer, I want to view a description and key details for each meal so that I can make an informed choice.

## Pages to Build
- `/menu` — Main menu browsing page

## Behavior

### Menu Page (`/menu`)
1. Load all `MenuItem` records from the database on the server
2. Display items as a card grid
3. Each card shows:
   - Name
   - Description
   - Tags (rendered as pill badges)
   - Availability status — show "Available" or "Sold Out" badge; grey out sold-out cards
4. Tag filter bar above the grid:
   - Renders all unique tags found across menu items
   - Clicking a tag filters the grid client-side (no page reload)
   - Multiple tags can be active at once (AND logic — item must match all selected tags)
   - An "All" button clears the filter
5. No pagination needed for MVP — render all items

## API Route

### `GET /api/menu`
- Auth: not required
- Returns all `MenuItem` records
- Response: `{ data: MenuItem[] }`

## Components to Build
- `<MenuGrid />` — Client component that handles filter state and renders the card grid
- `<MenuItemCard />` — Displays a single menu item
- `<TagFilter />` — Renders the filter pill bar
- `<AvailabilityBadge />` — Shows available/sold-out status

## Notes
- Fetch menu data in a Server Component and pass it as props to `<MenuGrid />`
- Tag filtering is purely client-side — no extra API calls on filter change
- Sold-out items should still display but be visually dimmed and non-selectable in the order flow
