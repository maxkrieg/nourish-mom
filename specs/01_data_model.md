# Domain: Data Model
_Always read `00_project_brief.md` first._

## Prisma Schema

Define the following models in `prisma/schema.prisma`.

```prisma
model User {
  id            String    @id @default(uuid())
  email         String    @unique
  role          Role      @default(CUSTOMER)
  profile       Profile?
  orders        Order[]
  createdAt     DateTime  @default(now())
}

enum Role {
  CUSTOMER
  ADMIN
}

model Profile {
  id                  String   @id @default(uuid())
  userId              String   @unique
  user                User     @relation(fields: [userId], references: [id])
  deliveryAddress     String?
  dietaryRestrictions String[] // e.g. ["gluten-free", "dairy-free"]
  allergies           String[]
  notes               String?
  updatedAt           DateTime @updatedAt
}

model MenuItem {
  id          String      @id @default(uuid())
  name        String
  description String
  tags        String[]    // e.g. ["high-iron", "breastfeeding-friendly"]
  available   Boolean     @default(true)
  orderItems  OrderItem[]
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
}

model DeliveryWindow {
  id        String   @id @default(uuid())
  label     String   // e.g. "Morning (8am–11am)"
  startTime String   // e.g. "08:00"
  endTime   String   // e.g. "11:00"
  capacity  Int      // max orders allowed in this window
  active    Boolean  @default(true)
  orders    Order[]
}

model OperatingSchedule {
  id        String   @id @default(uuid())
  dayOfWeek Int      // 0 = Sunday, 6 = Saturday
  open      Boolean  @default(true)
}

model Order {
  id               String         @id @default(uuid())
  userId           String
  user             User           @relation(fields: [userId], references: [id])
  deliveryWindowId String
  deliveryWindow   DeliveryWindow @relation(fields: [deliveryWindowId], references: [id])
  frequency        Frequency
  durationWeeks    Int
  startDate        DateTime
  status           OrderStatus    @default(PENDING)
  specialNotes     String?
  stripePaymentId  String?
  items            OrderItem[]
  createdAt        DateTime       @default(now())
  updatedAt        DateTime       @updatedAt
}

enum Frequency {
  DAILY
  THREE_PER_WEEK
  TWICE_PER_WEEK
  WEEKLY
}

enum OrderStatus {
  PENDING
  CONFIRMED
  PREPARING
  OUT_FOR_DELIVERY
  DELIVERED
  CANCELLED
}

model OrderItem {
  id         String   @id @default(uuid())
  orderId    String
  order      Order    @relation(fields: [orderId], references: [id])
  menuItemId String
  menuItem   MenuItem @relation(fields: [menuItemId], references: [id])
  quantity   Int      @default(1)
}
```

## Notes
- `User` maps 1:1 with a Supabase Auth user. Sync the Supabase Auth `id` into the `User.id` field on registration.
- `DeliveryWindow.capacity` is checked at order creation time — reject orders if the slot is full.
- `OperatingSchedule` controls which days are shown in the customer scheduler. Seed with all 7 days, all open by default.
- Do not store card details — Stripe handles all payment data.
