# Domain: Ordering & Scheduling
_Always read `00_project_brief.md` first._

## User Stories
- As a customer, I want to select a preferred delivery time range so that meals arrive at a time that works for me.
- As a customer, I want to choose how frequently I receive deliveries so that the service fits my weekly routine.
- As a customer, I want to set how long I want the service to run so that I can plan for my full recovery period.
- As a customer, I want to add a special note to my order so that I can communicate specific instructions to the kitchen.
- As a customer, I want to review a summary of my order and schedule before confirming so that I can verify everything is correct.

## Pages to Build
- `/order` — Multi-step order and scheduling flow
- `/order/review` — Order review page before payment

## Order Flow (Multi-Step)

Implement as a stepped form. State can be held in React context or a URL query param approach.

### Step 1 — Select Meals
- Show available `MenuItem` list (available only)
- Customer selects one or more items and quantities
- Show running count/summary in a sticky footer

### Step 2 — Delivery Schedule
- **Start date:** Date picker (only shows operating days based on `OperatingSchedule`)
- **Delivery window:** Radio select from active `DeliveryWindow` records (fetched from API)
- **Frequency:** Radio select — Daily, 3x per week, Twice per week, Weekly
- **Duration:** Dropdown — 1 week, 2 weeks, 3 weeks, 4 weeks

### Step 3 — Special Notes
- Optional free-text field
- "Continue to Review" button

### Step 4 — Review (`/order/review`)
- Display full order summary:
  - Selected meals and quantities
  - Delivery window, frequency, duration, start date
  - Special notes
  - Estimated total (calculated client-side: not final until Stripe confirms)
- "Proceed to Payment" button → initiates Stripe Checkout session

## API Routes

### `GET /api/delivery-windows`
- Auth: not required
- Returns all active `DeliveryWindow` records
- Response: `{ data: DeliveryWindow[] }`

### `GET /api/operating-schedule`
- Auth: not required
- Returns all `OperatingSchedule` records
- Response: `{ data: OperatingSchedule[] }`

### `POST /api/orders`
- Auth: required (customer)
- Called after Stripe payment confirmation (via webhook — see Payments domain)
- Body: `{ menuItems: [{ menuItemId, quantity }], deliveryWindowId, frequency, durationWeeks, startDate, specialNotes }`
- Validate slot capacity: count existing orders for the window on the start date; reject if at or above capacity
- Create `Order` and `OrderItem` records
- Response: `{ data: order }`

## Components to Build
- `<OrderStepper />` — Manages step state and renders the correct step
- `<MealSelector />` — Step 1 meal picker
- `<ScheduleForm />` — Step 2 schedule configuration
- `<NotesForm />` — Step 3 notes input
- `<OrderReview />` — Step 4 summary view

## Notes
- Disable dates in the date picker that correspond to `OperatingSchedule` days where `open: false`
- Use `react-day-picker` for the date picker
- Slot capacity check must happen server-side at order creation — do not rely on client-side checks alone
- Pricing logic is out of scope for MVP; show a placeholder or contact-for-pricing message if needed
