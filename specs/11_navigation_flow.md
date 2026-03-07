# Domain: Navigation & Customer Journey Flow
_Always read `00_project_brief.md` and `09_design.md` first._

## Overview
This spec defines the connected navigation experience across all customer-facing pages. The customer journey is a single continuous flow: land → browse menu + build order → add notes → review → pay. Every page knows where the user came from and where they go next. There are no dead ends.

---

## Customer Navigation Bar
Appears on all customer-facing pages and the landing page.

### Contents
- **Left:** "Nourish Mom" wordmark in teal — links to `/`
- **Center (desktop):** "Menu" → `/menu`
- **Right:**
  - Unauthenticated: "Log In" (ghost button) → `/login` + "Get Started" (primary teal) → `/register`
  - Authenticated: "My Account" → `/account` + `<LogoutButton />`
- **Mobile:** Hamburger menu revealing the same links in a full-width dropdown

### Component
- Create `<CustomerNav />` in `components/customer/CustomerNav.tsx`
- Server Component — reads session server-side to avoid auth flicker
- Add to `app/(customer)/layout.tsx` and the landing page layout

---

## The Customer Journey

```
/ (landing)
  ↓ "See the Menu" or "Get Started"
/menu  ← browse meals + add quantities + see order summary sidebar
  ↓ "Continue to Order" (requires at least 1 item)
/order  ← add optional notes for the kitchen
  ↓ "Review My Order"
/order/review  ← confirm full order summary
  ↓ "Proceed to Payment"
Stripe Checkout
  ↓ on success
/order/success
```

---

## Page-by-Page CTA Map

### `/` — Landing Page
- "See the Menu" → `/menu`
- "Get Started" → `/register`
- CTA banner: "Create Your Account" → `/register`

### `/menu` — Menu + Order Step 1
- Order summary sidebar/bar CTA: "Continue to Order →" → `/order`
- If unauthenticated and clicks "Continue to Order": redirect to `/register?next=/order`
- Button disabled with tooltip if no meals selected

### `/order` — Notes (Step 2)
- Back button → `/menu` (order context preserved)
- "Review My Order" → `/order/review`

### `/order/review` — Review (Step 3)
- Back button → `/order` (all state preserved)
- "Proceed to Payment" → `POST /api/checkout` → Stripe

### `/order/success` — Confirmation
- "Back to Menu" → `/menu`
- "View My Account" → `/account`

### `/account` — Customer Profile
- "Browse Menu" button in header → `/menu`

### `/login`
- Below form: "Don't have an account? Get started" → `/register`
- After login: redirect to `?next` param if present, otherwise `/menu`

### `/register`
- Below form: "Already have an account? Log in" → `/login`
- After register: redirect to `?next` param if present, otherwise `/menu`

---

## `?next` Redirect Parameter
When an unauthenticated user tries to proceed past the menu:
1. Redirect to `/register?next=/order`
2. After successful auth, read the `next` param and redirect there
3. Update both `register/actions.ts` and `login/actions.ts` to handle this param

---

## Order Step Indicator
Show on `/menu` (once items selected), `/order`, and `/order/review`:

```
[1 Meals] → [2 Notes] → [3 Review]
```

- Completed steps: teal filled circle with checkmark
- Current step: teal outline circle with number
- Future steps: neutral grey circle
- Step 1 always links back to `/menu`

### Component
`<OrderStepper currentStep={1 | 2 | 3} />` in `components/customer/OrderStepper.tsx`

---

## Footer
Simple footer on all customer-facing pages:
- `border-t border-neutral-border py-8`
- Left: "© 2024 Nourish Mom"
- Right: links to `/menu`, `/login`, `/register`
- Mobile: centered, stacked

Create `<Footer />` in `components/customer/Footer.tsx` and add to the customer layout.

---

## 404 Page
- Add `app/not-found.tsx` with Nourish Mom branding
- Friendly message + "Back to Home" button → `/`
- Styled consistently with the rest of the app

---

## Notes
- `<CustomerNav />` must be a Server Component to avoid session flicker on load
- Order context (`OrderContext`) must wrap the entire `/(customer)` layout — not just the menu page — so state survives navigation between `/menu`, `/order`, and `/order/review`
- The back button on `/order` must not clear order context — it should feel seamless returning to the menu with selections intact
- Authenticated users visiting `/` should be redirected to `/menu` via middleware
