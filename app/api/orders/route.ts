import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

const OrderSchema = z.object({
  menuItems: z
    .array(
      z.object({
        menuItemId: z.string().uuid(),
        quantity: z.number().int().min(1),
      })
    )
    .min(1, 'At least one item is required'),
  deliveryWindowId: z.string().uuid(),
  frequency: z.enum(['DAILY', 'THREE_PER_WEEK', 'TWICE_PER_WEEK', 'WEEKLY']),
  durationWeeks: z.number().int().min(1).max(4),
  startDate: z.string().datetime(),
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

  const parsed = OrderSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { data: null, error: parsed.error.flatten().fieldErrors },
      { status: 422 }
    )
  }

  const { menuItems, deliveryWindowId, frequency, durationWeeks, startDate, specialNotes } =
    parsed.data

  // Capacity check — count existing orders for this window on the start date
  const window = await prisma.deliveryWindow.findUnique({
    where: { id: deliveryWindowId },
  })

  if (!window || !window.active) {
    return NextResponse.json({ data: null, error: 'Delivery window not available' }, { status: 400 })
  }

  const startOfDay = new Date(startDate)
  startOfDay.setUTCHours(0, 0, 0, 0)
  const endOfDay = new Date(startDate)
  endOfDay.setUTCHours(23, 59, 59, 999)

  const existingCount = await prisma.order.count({
    where: {
      deliveryWindowId,
      startDate: { gte: startOfDay, lte: endOfDay },
      status: { not: 'CANCELLED' },
    },
  })

  if (existingCount >= window.capacity) {
    return NextResponse.json(
      { data: null, error: 'This delivery window is fully booked for that date' },
      { status: 409 }
    )
  }

  // Create order + items
  const order = await prisma.order.create({
    data: {
      userId: user.id,
      deliveryWindowId,
      frequency,
      durationWeeks,
      startDate: new Date(startDate),
      specialNotes,
      items: {
        create: menuItems.map(({ menuItemId, quantity }) => ({ menuItemId, quantity })),
      },
    },
    include: {
      items: { include: { menuItem: true } },
      deliveryWindow: true,
    },
  })

  return NextResponse.json({ data: order, error: null }, { status: 201 })
}
