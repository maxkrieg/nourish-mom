import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'

const CheckoutSchema = z.object({
  menuItems: z
    .array(
      z.object({
        menuItemId: z.string().uuid(),
        quantity: z.number().int().min(1),
      })
    )
    .min(1),
  specialNotes: z.string().optional(),
})

export async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ data: null, error: 'Unauthorized' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ data: null, error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = CheckoutSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { data: null, error: parsed.error.flatten().fieldErrors },
      { status: 422 }
    )
  }

  const { menuItems, specialNotes } = parsed.data

  // Fetch menu items to build line items
  const menuItemIds = menuItems.map((i) => i.menuItemId)
  const dbItems = await prisma.menuItem.findMany({
    where: { id: { in: menuItemIds }, available: true },
  })

  if (dbItems.length !== menuItemIds.length) {
    return NextResponse.json(
      { data: null, error: 'One or more menu items are unavailable' },
      { status: 400 }
    )
  }

  // Build Stripe line items
  const lineItems = menuItems.map((selected) => {
    const item = dbItems.find((d) => d.id === selected.menuItemId)!
    return {
      price_data: {
        currency: 'usd',
        product_data: { name: item.name },
        unit_amount: item.price, // already in cents
      },
      quantity: selected.quantity,
    }
  })

  const origin = request.headers.get('origin') ?? process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: lineItems,
    success_url: `${origin}/order/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/order/review`,
    customer_email: user.email,
    metadata: {
      userId: user.id,
      orderPayload: JSON.stringify({
        menuItems,
        specialNotes: specialNotes ?? '',
      }),
    },
  })

  return NextResponse.json({ data: { url: session.url }, error: null })
}
