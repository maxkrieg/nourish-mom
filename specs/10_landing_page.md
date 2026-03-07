# Domain: Landing Page
_Always read `00_project_brief.md` and `09_design.md` first._

## Overview
The landing page at `/` is the public front door of Nourish Mom. It should be warm, trustworthy, and conversion-focused — the goal is to get a visitor to either browse the menu or create an account. It is visible to unauthenticated users. Authenticated users who visit `/` should be redirected to `/menu`.

---

## Page: `/` — Home

### Section 1 — Hero
- Full-width section, generous vertical padding (`py-24`)
- Left side: headline, subheadline, and two CTAs
- Right side: a warm illustrated or placeholder image (use a styled div with `bg-teal-light` as placeholder if no image is available)
- **Headline:** "Nourishing meals,\ndelivered to new moms."
- **Subheadline:** "Fresh, postpartum-friendly food delivered on your schedule — so you can focus on what matters most."
- **Primary CTA:** "See the Menu" → links to `/menu`
- **Secondary CTA:** "Get Started" → links to `/register`
- Mobile: stack vertically, image below text

### Section 2 — How It Works
- Three-step horizontal layout (stacked on mobile)
- Each step: numbered icon, short title, one sentence description
- Steps:
  1. **Choose your meals** — Browse our postpartum-friendly menu and pick what sounds good
  2. **Set your schedule** — Tell us how often and how long you'd like deliveries
  3. **We deliver to you** — Fresh meals arrive at your door on your chosen schedule
- Background: `bg-teal-light` to break up the page

### Section 3 — Why Nourish Mom
- Two or three feature highlights in a card grid
- Cards:
  - **Made for recovery** — Every meal is designed with postpartum nutrition in mind, supporting healing and breastfeeding
  - **Flexible delivery** — Daily, a few times a week, or weekly — you choose what fits your life
  - **One less thing to think about** — New parenthood is overwhelming. Let us handle the cooking.
- Cards: white background, `rounded-2xl`, `shadow-sm`, `p-6`

### Section 4 — Call to Action Banner
- Full-width teal background (`bg-teal`)
- Centered text: "Ready to feel nourished?"
- Subtext: "Join Nourish Mom and get meals delivered starting this week."
- Single CTA button: "Create Your Account" → `/register` (white button, teal text)

### Section 5 — Footer
- Simple footer: `border-t border-neutral-border`, `py-8`
- Left: "© 2024 Nourish Mom"
- Right: links to `/menu`, `/login`, `/register`
- Mobile: stack and center

---

## Components to Build
- `<Hero />` — Hero section
- `<HowItWorks />` — Three-step section
- `<WhyNourishMom />` — Feature card grid
- `<CTABanner />` — Full-width teal CTA section
- `<Footer />` — Site footer (reuse across all customer-facing pages)

## Notes
- The landing page is a Server Component — no client-side interactivity needed
- Add the `<Footer />` component to the customer layout so it appears on all customer-facing pages
- Update `middleware.ts` to redirect authenticated users away from `/` to `/menu`
- Page title: "Nourish Mom — Meals for New Moms"
- Meta description: "Postpartum-friendly meal delivery designed for new mothers. Fresh, nourishing food delivered on your schedule."
