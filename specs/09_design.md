# Design Spec — Postpartum Food Delivery App
_Always read `00_project_brief.md` first._

## App Name
The app is called **Nourish Mom**. Use this name in the navigation logo, browser tab title, email signatures, and any branded UI moments. The logo treatment should be the wordmark "Nourish Mom" in teal, using Inter font, semibold weight.

## Design Direction
Modern, crisp, and warm. Inspired by Airbnb's design language — generous whitespace, confident typography, and UI that feels premium and trustworthy without being cold or clinical. The palette is muted pinks and teals: sophisticated and calm, never pastel-sweet or overly feminine. The target user is a postpartum mother or her caregiver, so the experience should feel reassuring, easy to navigate, and quietly beautiful.

---

## Color Palette

### Primary — Muted Teal
The primary action color. Used for buttons, links, active states, and key UI elements.
```
Primary:        #4A9B8E   (muted teal)
Primary Dark:   #357A6E   (hover and pressed states)
Primary Light:  #E8F4F2   (backgrounds, subtle highlights)
```

### Secondary — Muted Pink
Used for accents, tags, badges, and supporting UI moments.
```
Secondary:      #C4848A   (muted dusty pink)
Secondary Dark: #A66268   (hover states)
Secondary Light:#F5ECED   (backgrounds, tag pills)
```

### Neutrals
Warm-tinted neutrals. Never pure grey or pure white — always slightly warm.
```
Background:     #FAFAF9   (page background — warm off-white)
Surface:        #FFFFFF   (cards, modals, inputs)
Border:         #E8E8E6   (dividers, input borders)
Text Primary:   #222222   (headings and body — near-black)
Text Secondary: #717171   (captions, labels, helper text)
Text Disabled:  #B0B0B0
```

### Semantic
```
Success:        #4A9B8E   (reuse primary teal)
Warning:        #D4956A   (muted amber-orange)
Error:          #B85450   (muted red — serious but not alarming)
```

---

## Typography

### Font
Use **Inter** via `next/font/google`. Clean, legible, and close in feel to Airbnb's Cereal without requiring a license.

```ts
// app/layout.tsx
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })
```

### Scale
```
Display:    36px / font-bold     / tracking-tight   (hero headings)
H1:         28px / font-bold     / tracking-tight
H2:         22px / font-semibold / tracking-tight
H3:         18px / font-semibold
Body:       16px / font-normal   / leading-relaxed
Small:      14px / font-normal   / text-secondary
Caption:    12px / font-medium   / tracking-widest uppercase
```

### Rules
- Never use more than two font weights on a single screen
- Use `tracking-tight` on all headings — gives the crisp, confident Airbnb feel
- Use `leading-relaxed` on body text — content should breathe
- Use uppercase + wide letter-spacing sparingly for section labels and captions only

---

## Spacing & Layout

### Page Layout
- Max content width: `1120px`, centered with `mx-auto`
- Page horizontal padding: `px-6` on mobile, `px-10` on desktop
- Major section vertical spacing: `py-12`

### Cards
- Padding: `p-6`
- Border radius: `rounded-2xl` (generous, like Airbnb)
- Border: `1px solid #E8E8E6`
- Shadow: `shadow-sm` default, `shadow-md` on hover
- Background: `#FFFFFF` sitting on the warm off-white page background
- Hover: `hover:shadow-md hover:-translate-y-0.5 transition-all duration-150`

### Forms & Inputs
- Input height: `h-12` (taller than shadcn default — feels more premium)
- Border radius: `rounded-xl`
- Border: `1px solid #E8E8E6`
- Focus ring: primary teal
- Label: `text-sm font-semibold text-primary-text mb-1.5`
- Helper/error text: `text-sm` below the input

### Buttons
```
Primary:     bg-teal text-white rounded-xl px-6 py-3 font-semibold hover:bg-teal-dark
Secondary:   bg-white text-teal border border-teal rounded-xl px-6 py-3 font-semibold
Pink Accent: bg-pink text-white rounded-xl px-6 py-3 font-semibold hover:bg-pink-dark
Ghost:       bg-transparent text-secondary hover:underline underline-offset-2
Destructive: bg-error text-white rounded-xl px-6 py-3 font-semibold
```
- All buttons: `transition-all duration-150`
- Always rounded — no sharp corners anywhere
- Icon-only buttons: `rounded-full`

### Badges & Tags
- Teal tags (e.g. breastfeeding-friendly, dietary): `bg-teal-light text-teal rounded-full px-3 py-1 text-sm font-medium`
- Pink tags (e.g. featured, new): `bg-pink-light text-pink rounded-full px-3 py-1 text-sm font-medium`
- Neutral tags: `bg-neutral-100 text-secondary rounded-full px-3 py-1 text-sm font-medium`
- Order status badges: pill-shaped, color by status:
  - Pending: neutral
  - Confirmed: teal
  - Preparing: amber
  - Out for delivery: teal-light
  - Delivered: success green
  - Cancelled: error red

---

## Tailwind Config Extensions

Add these to `tailwind.config.ts` so the palette is available as utility classes:

```ts
extend: {
  colors: {
    teal: {
      DEFAULT: '#4A9B8E',
      dark:    '#357A6E',
      light:   '#E8F4F2',
    },
    pink: {
      DEFAULT: '#C4848A',
      dark:    '#A66268',
      light:   '#F5ECED',
    },
    neutral: {
      bg:      '#FAFAF9',
      border:  '#E8E8E6',
      text:    '#222222',
      muted:   '#717171',
      disabled:'#B0B0B0',
    },
    error:   '#B85450',
    warning: '#D4956A',
  },
  borderRadius: {
    xl:  '12px',
    '2xl': '16px',
    '3xl': '24px',
  },
}
```

---

## Component Patterns

### Navigation — Customer Facing
- Top bar, white background, `border-b border-neutral-border`
- Logo left (teal wordmark), links right, account avatar far right
- Active nav link: teal color, no bold
- Mobile: bottom tab bar with teal active state

### Navigation — Admin
- Fixed left sidebar, white, `border-r border-neutral-border`, `w-60`
- Section labels in uppercase caption style (`text-xs font-medium tracking-widest text-muted uppercase`)
- Active item: `bg-teal-light text-teal rounded-lg mx-2 px-3 py-2`
- Logo or app name at top of sidebar

### Menu Item Cards
- `rounded-2xl` card with `shadow-sm`
- Top area: image or warm illustrated placeholder in `bg-teal-light` or `bg-pink-light`
- Availability badge: top-right corner, pill-shaped
- Name: H3, description: small body, tags: pill badges below
- Sold out: card opacity `opacity-60`, badge says "Sold Out"

### Step Indicators (Order Flow)
- Horizontal step bar at top of order pages
- Completed steps: teal fill
- Current step: teal outline
- Future steps: neutral grey
- Use simple numbered circles with connecting lines

### Empty States
- Centered layout: icon → heading → subtext → CTA button
- Icon in `text-teal-light` or `text-pink-light`
- Never leave a blank page

### Loading / Skeleton States
- Use shadcn/ui `Skeleton` component
- Match shape of expected content
- Skeleton base: `bg-neutral-border` with shimmer animation

### Toasts
- Bottom-right position
- `rounded-xl`, white background, left colored border
- Teal border for success, error red for errors, amber for warnings
- Auto-dismiss after 4 seconds

---

## Iconography

### Library
Use **Lucide React** (included with shadcn/ui).

### Style
- Stroke width: `1.5` — lighter and more refined
- Size: `20px` inline with text, `24px` standalone
- Color: match surrounding text or use `text-teal` for emphasis

---

## General Rules
- **Whitespace is a feature** — when in doubt, add more padding
- **No sharp corners** — use `rounded-xl` or `rounded-2xl` everywhere
- **Subtle over loud** — muted colors, `shadow-sm` not `shadow-lg`
- **Consistency** — use the Tailwind config tokens, never arbitrary hex values in components
- **Accessible contrast** — teal and pink on white must meet WCAG AA; use the dark variants on light backgrounds if needed
- **Mobile first** — design for small screens first, then expand