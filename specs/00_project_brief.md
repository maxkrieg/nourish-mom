# Project Brief — Nourish Mom (MVP)

## App Name
**Nourish Mom**

## Overview
A full-stack web application for a food delivery service targeting postpartum mothers. The app is called **Nourish Mom**. Use this name consistently across all UI copy, page titles, email subjects, and branded moments. The MVP includes a customer-facing storefront and an admin operations dashboard.

## Tech Stack
- **Framework:** Next.js 14+ (App Router) with TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Database:** PostgreSQL via Supabase
- **ORM:** Prisma
- **Auth:** Supabase Auth (email/password)
- **Payments:** Stripe
- **Email:** Resend
- **Realtime:** Supabase Realtime (messaging, future phase)

## Repository Structure
```
/app
  /(customer)        # Customer-facing routes
  /(admin)           # Admin dashboard routes
  /api               # API route handlers
/components
  /ui                # shadcn/ui primitives
  /customer          # Customer-specific components
  /admin             # Admin-specific components
/lib
  /supabase          # Supabase client setup
  /prisma            # Prisma client
  /stripe            # Stripe helpers
  /resend            # Email helpers
/prisma
  schema.prisma
```

## Auth & Roles
- Customers register and log in via Supabase Auth (email/password)
- Admins are identified by a `role` field (`customer` | `admin`) on the `User` model
- Protect all `/admin` routes with a middleware role check
- Protect all `/api/admin` routes with a server-side role check

## General Conventions
- All data fetching in Server Components where possible; use Client Components only for interactivity
- API routes handle mutations (POST, PATCH, DELETE)
- Return consistent JSON: `{ data, error }`
- Use Prisma for all database access
- Use Zod for all input validation on API routes
- Use environment variables for all secrets — never hardcode

## Environment Variables Required
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
DATABASE_URL
STRIPE_SECRET_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
STRIPE_WEBHOOK_SECRET
RESEND_API_KEY
```

## Out of Scope for MVP
- Messaging / in-app chat
- Caregiver/partner account linking
- Referral codes
- Push notifications
- Nutritional detail beyond basic descriptions