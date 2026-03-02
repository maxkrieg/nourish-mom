# Domain: Payments
_Always read `00_project_brief.md` first._

## User Stories
- As a customer, I want to pay for my order securely using a credit or debit card so that I can complete my purchase with confidence.
- As a customer, I want to receive an order confirmation email after payment so that I have a record of my order.

## Behavior

### Payment Flow
1. Customer clicks "Proceed to Payment" on the order review page
2. Frontend calls `POST /api/checkout` with the order payload
3. Server creates a Stripe Checkout Session and returns the session URL
4. Frontend redirects the customer to Stripe's hosted checkout page
5. On success, Stripe redirects to `/order/success?session_id={CHECKOUT_SESSION_ID}`
6. On cancel, Stripe redirects to `/order/review`
7. The Stripe webhook (`POST /api/webhooks/stripe`) listens for `checkout.session.completed`
8. On webhook receipt, the server creates the `Order` and `OrderItem` records in the database and sends a confirmation email

## API Routes

### `POST /api/checkout`
- Auth: required (customer)
- Body: full order payload (same as `POST /api/orders` shape)
- Creates a Stripe Checkout Session with:
  - Line items derived from selected menu items
  - `success_url`: `/order/success?session_id={CHECKOUT_SESSION_ID}`
  - `cancel_url`: `/order/review`
  - `metadata`: store the full order payload as a JSON string in `session.metadata`
- Returns: `{ url: checkoutSessionUrl }`

### `POST /api/webhooks/stripe`
- Auth: none — validate using `stripe.webhooks.constructEvent` with `STRIPE_WEBHOOK_SECRET`
- Handle event type: `checkout.session.completed`
- Parse order payload from `session.metadata`
- Create `Order` and `OrderItem` records in the database
- Set `order.stripePaymentId` to the session ID
- Trigger confirmation email (see Notifications domain)
- Return `{ received: true }` with status 200

### `GET /api/orders/[id]`
- Auth: required (must be order owner or admin)
- Returns the full order with items and delivery window
- Response: `{ data: order }`

## Pages to Build
- `/order/success` — Confirmation page shown after successful payment

### Success Page (`/order/success`)
- Reads `session_id` from query params
- Fetches the order associated with the session from the database
- Displays a friendly confirmation message with order summary
- Links to `/account` for order history (future phase)

## Notes
- Never create the `Order` record before payment is confirmed — always create in the webhook handler
- The webhook endpoint must use the raw request body for signature verification — do not use `bodyParser` or Next.js's default JSON parsing on this route
- Store prices in Stripe as the source of truth; if pricing is not yet defined, use a fixed placeholder amount for MVP
- Test with Stripe CLI locally: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
