import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { sendOrderConfirmation } from '@/lib/resend'

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
      specialNotes?: string
    }

    try {
      payload = JSON.parse(metadata.orderPayload)
    } catch {
      console.error('Failed to parse orderPayload from metadata')
      return NextResponse.json({ received: true })
    }

    // Create order
    const order = await prisma.order.create({
      data: {
        userId: metadata.userId,
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
      include: {
        items: { include: { menuItem: { select: { name: true, price: true } } } },
        user: { select: { email: true, profile: { select: { deliveryAddress: true } } } },
      },
    })

    console.log('Order created for session', session.id)

    // Send confirmation email — failure must not break order creation
    const customerEmail = session.customer_email ?? order.user.email
    if (customerEmail) {
      await sendOrderConfirmation({
        to: process.env.MOCK_EMAIL_FOR_TESTING ?? customerEmail,
        order,
        customerName: null,
      })
    }
  }

  return NextResponse.json({ received: true })
}
