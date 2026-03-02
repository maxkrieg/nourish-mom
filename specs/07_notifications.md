# Domain: Notifications (Email)
_Always read `00_project_brief.md` first._

## User Stories
- As a customer, I want to receive a confirmation email when my order is placed so that I know it was received successfully.
- As a customer, I want to receive a reminder email before each delivery so that I'm prepared to receive it.

## Setup
Use **Resend** for transactional email. Install the `resend` npm package. Create a helper at `/lib/resend/index.ts`.

## Emails to Build

### 1. Order Confirmation Email
- **Trigger:** Called from the Stripe webhook handler after the order is created (`checkout.session.completed`)
- **To:** Customer's email address
- **Subject:** "Your order is confirmed — Nourish Mom"
- **Content:**
  - Greeting with customer name (or email if name not set)
  - Order summary: meals selected, delivery window, frequency, duration, start date
  - Special notes if provided
  - Business contact info / support note

### 2. Delivery Reminder Email
- **Trigger:** Needs to fire the day before each scheduled delivery
- **To:** Customer's email address
- **Subject:** "Your delivery is tomorrow — Nourish Mom"
- **Content:**
  - Reminder of what's coming and the delivery window
  - Delivery address on file
  - Instructions for what to do if they need to make changes

## Implementation Notes for Delivery Reminders

For MVP, implement a simple scheduled job using a cron endpoint:

1. Create a route `GET /api/cron/delivery-reminders` protected by a secret header (`Authorization: Bearer CRON_SECRET`)
2. The route queries all orders where a delivery is scheduled for tomorrow, based on `startDate`, `frequency`, and `durationWeeks`
3. For each qualifying delivery, send the reminder email via Resend
4. Set up an external cron service (e.g. [cron-job.org](https://cron-job.org) or Vercel Cron) to call this endpoint daily

## Email Helper Structure

```ts
// /lib/resend/index.ts
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendOrderConfirmation(params: {
  to: string
  order: Order & { items: OrderItem[]; deliveryWindow: DeliveryWindow }
}) { ... }

export async function sendDeliveryReminder(params: {
  to: string
  deliveryWindow: DeliveryWindow
  deliveryAddress: string
}) { ... }
```

## Notes
- Build email content as plain HTML strings for MVP — no need for a templating library yet
- Log email send failures but do not throw — a failed email should not break the order creation flow
- Resend's free tier supports 3,000 emails/month which is sufficient for MVP