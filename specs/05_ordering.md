# Domain: Ordering
_Always read `00_project_brief.md` and `09_design.md` first._

## Overview
The order flow is a simple one-and-done purchase. The customer selects meals on the menu page, adds an optional note, reviews their order, and pays. There are no recurring deliveries, delivery windows, frequency settings, or start dates.

## User Stories
- As a customer, I want to add a special note to my order so that I can communicate specific instructions to the kitchen.
- As a customer, I want to review a summary of my full order before confirming so that I can verify everything is correct before paying.

## Pages
- `/order` — Step 2: Optional notes
- `/order/review` — Step 3: Full order review before payment

## Step Indicator
```
[1 Meals ✓] → [2 Notes] → [3 Review]
```
Step 1 links back to `/menu`. Current step highlighted in teal.

## Guard: Empty Order
- On load of `/order`, check if `OrderContext.items` is empty
- If empty, redirect to `/menu` immediately

---

## Step 2 — Notes (`/order`)
A single, minimal page.

### Fields
- **Special notes:** Optional textarea — "Any instructions for the kitchen? (allergies, preferences, access notes)"
- Character limit: 500

### Navigation
- Back button → `/menu` (order context preserved)
- "Review My Order" button → `/order/review`
- "Skip" link → `/order/review` (if user doesn't want to add notes)

---

## Step 3 — Review (`/order/review`)

### Display
- **Meals:** list of selected items with name, quantity, and per-item price
- **Special notes:** shown if provided, otherwise "None"
- **Order total:** sum of all item prices × quantities
- **Payment note:** "You will be charged [total] upon confirmation"

### Navigation
- Back button → `/order` (preserves notes)
- "Proceed to Payment" button → calls `POST /api/checkout` → redirects to Stripe Checkout

---

## Prisma Schema Changes
Simplify the `Order` model — remove all scheduling fields:

```prisma
model Order {
  id              String      @id @default(uuid())
  userId          String
  user            User        @relation(fields: [userId], references: [id])
  status          OrderStatus @default(PENDING)
  specialNotes    String?
  stripePaymentId String?
  items           OrderItem[]
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
}

enum OrderStatus {
  PENDING
  CONFIRMED
  PREPARING
  OUT_FOR_DELIVERY
  DELIVERED
  CANCELLED
}
```

**Remove entirely from schema:**
- `DeliveryWindow` model
- `OperatingSchedule` model
- `Frequency` enum
- Fields removed from `Order`: `deliveryWindowId`, `frequency`, `durationWeeks`, `startDate`

Run `npx prisma db push` after updating the schema.

---

## OrderContext Simplification
Remove all scheduling fields. The context only needs to track meals and notes:

```ts
type OrderItem = {
  menuItemId: string
  name: string
  price: number
  quantity: number
}

type OrderContextType = {
  items: OrderItem[]
  specialNotes: string
  addItem: (item: OrderItem) => void
  removeItem: (menuItemId: string) => void
  updateQuantity: (menuItemId: string, quantity: number) => void
  setSpecialNotes: (notes: string) => void
  clearOrder: () => void
  totalItems: number
  orderTotal: number
}
```

---

## API Routes

### `POST /api/orders`
- Auth: required (customer)
- Called from Stripe webhook after payment confirmation — not directly by customer
- Body: `{ menuItems: [{ menuItemId, quantity }], specialNotes }`
- Create `Order` and `OrderItem` records
- Set `stripePaymentId` to the Stripe session ID
- Response: `{ data: order }`

### Remove these routes entirely:
- `GET /api/delivery-windows`
- `GET /api/operating-schedule`

---

## Components to Build
- `<NotesForm />` — Step 2, single textarea with character count
- `<OrderReview />` — Step 3 summary with meal list and total
- `<OrderStepper currentStep={1 | 2 | 3} />` — updated 3-step indicator

---

## Notes
- Pricing: calculate `orderTotal` client-side as `sum(item.price × item.quantity)`
- After Stripe webhook confirms payment, call `clearOrder()` on `OrderContext`
- The `/order/success` page should display the order summary pulled from the database using the Stripe session ID
