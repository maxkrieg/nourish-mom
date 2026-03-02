# Domain: Authentication
_Always read `00_project_brief.md` first._

## User Stories
- As a customer, I want to create an account with my email and password so that I can access the service and manage my orders.
- As a customer, I want to log in and out of my account securely so that my information stays protected.

## Pages to Build
- `/register` — Registration form
- `/login` — Login form
- `/logout` — Server action or route that signs the user out

## Behavior

### Registration (`/register`)
1. Form fields: email, password, confirm password
2. On submit, call `supabase.auth.signUp({ email, password })`
3. On success, create a corresponding `User` record in the database via Prisma with `role: CUSTOMER`
4. Create an empty `Profile` record linked to the new user
5. Redirect to `/menu`
6. Show inline validation errors if fields are invalid or email already exists

### Login (`/login`)
1. Form fields: email, password
2. On submit, call `supabase.auth.signInWithPassword({ email, password })`
3. On success:
   - If user role is `ADMIN`, redirect to `/admin`
   - If user role is `CUSTOMER`, redirect to `/menu`
4. Show inline error if credentials are invalid

### Logout
1. Call `supabase.auth.signOut()`
2. Redirect to `/login`

## Route Protection
- Create a Next.js middleware at `/middleware.ts`
- Redirect unauthenticated users away from `/account`, `/order`, and `/admin/*`
- Redirect non-admin users away from `/admin/*`
- Use the Supabase server client to read the session in middleware

## Components to Build
- `<AuthForm />` — Reusable form shell used by both login and register pages
- `<LogoutButton />` — Client component that calls the logout handler

## Notes
- Use the Supabase SSR package (`@supabase/ssr`) for server-side session handling
- Do not use the deprecated `@supabase/auth-helpers-nextjs`
- Store the Supabase session in cookies (handled automatically by `@supabase/ssr`)
