import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

// Must use raw body for Stripe signature verification
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const rawBody = await request.text()
  const sig = request.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  let event: ReturnType<typeof stripe.webhooks.constructEvent> extends Promise<infer T> ? T : ReturnType<typeof stripe.webhooks.constructEvent>

  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('Stripe webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object

    const metadata = session.metadata
    if (!metadata?.userId || !metadata?.orderPayload) {
      console.error('Missing metadata on Stripe session', session.id)
      return NextResponse.json({ received: true })
    }

    let payload: {
      menuItems: { menuItemId: string; quantity: number }[]
      deliveryWindowId: string
      frequency: 'DAILY' | 'THREE_PER_WEEK' | 'TWICE_PER_WEEK' | 'WEEKLY'
      durationWeeks: number
      startDate: string
      specialNotes?: string
    }

    try {
      payload = JSON.parse(metadata.orderPayload)
    } catch {
      console.error('Failed to parse orderPayload from metadata')
      return NextResponse.json({ received: true })
    }

    // Capacity check
    const window = await prisma.deliveryWindow.findUnique({
      where: { id: payload.deliveryWindowId },
    })

    if (!window) {
      console.error('Delivery window not found:', payload.deliveryWindowId)
      return NextResponse.json({ received: true })
    }

    const startOfDay = new Date(payload.startDate)
    startOfDay.setUTCHours(0, 0, 0, 0)
    const endOfDay = new Date(payload.startDate)
    endOfDay.setUTCHours(23, 59, 59, 999)

    const existingCount = await prisma.order.count({
      where: {
        deliveryWindowId: payload.deliveryWindowId,
        startDate: { gte: startOfDay, lte: endOfDay },
        status: { not: 'CANCELLED' },
      },
    })

    if (existingCount >= window.capacity) {
      console.warn('Delivery window over capacity for session', session.id)
      // Still acknowledge the webhook — refund logic would go here in production
      return NextResponse.json({ received: true })
    }

    // Create order
    await prisma.order.create({
      data: {
        userId: metadata.userId,
        deliveryWindowId: payload.deliveryWindowId,
        frequency: payload.frequency,
        durationWeeks: payload.durationWeeks,
        startDate: new Date(payload.startDate),
        specialNotes: payload.specialNotes ?? null,
        stripePaymentId: session.id,
        status: 'CONFIRMED',
        items: {
          create: payload.menuItems.map(({ menuItemId, quantity }) => ({
            menuItemId,
            quantity,
          })),
        },
      },
    })

    console.log('Order created for session', session.id)
  }

  return NextResponse.json({ received: true })
}
