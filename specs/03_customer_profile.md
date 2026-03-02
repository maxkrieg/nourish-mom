# Domain: Customer Profile
_Always read `00_project_brief.md` first._

## User Stories
- As a customer, I want to set my dietary restrictions and allergies on my profile so that I can make informed meal choices.
- As a customer, I want to update my delivery address so that orders are sent to the right location.

## Pages to Build
- `/account` — Customer profile and settings page

## Behavior

### Profile Page (`/account`)
1. Load the current user's `Profile` from the database on the server
2. Display a form pre-populated with existing values
3. Fields:
   - **Delivery address** (text input)
   - **Dietary restrictions** (multi-select or checkbox group): options include `gluten-free`, `dairy-free`, `nut-free`, `vegetarian`, `vegan`, `halal`
   - **Allergies** (free text or tag input for custom entries)
   - **Notes** (optional free text)
4. On save, send a `PATCH /api/account/profile` request
5. Show a success toast on save

## API Route

### `PATCH /api/account/profile`
- Auth: required (customer)
- Body: `{ deliveryAddress, dietaryRestrictions, allergies, notes }`
- Validate with Zod
- Upsert the `Profile` record for the authenticated user
- Return: `{ data: profile }`

## Components to Build
- `<ProfileForm />` — Client component with controlled form state
- `<TagInput />` — Reusable input that lets users add/remove string tags (used for allergies)
- `<MultiCheckbox />` — Reusable checkbox group (used for dietary restrictions)

## Notes
- `dietaryRestrictions` is stored as a `String[]` in Prisma
- `allergies` is stored as a `String[]` in Prisma — allow freeform entries
- Profile is created empty at registration; this page is where it is filled in
