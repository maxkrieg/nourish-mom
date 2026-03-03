import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendDeliveryReminder } from '@/lib/resend'

export const dynamic = 'force-dynamic'

// Returns all delivery dates for an order based on startDate, frequency, durationWeeks
function getDeliveryDates(startDate: Date, frequency: string, durationWeeks: number): Date[] {
  const dates: Date[] = []
  const totalDays = durationWeeks * 7

  // How many days between deliveries for each frequency
  const intervalDays: Record<string, number[]> = {
    DAILY: [1],
    THREE_PER_WEEK: [1, 3, 5], // Mon, Wed, Fri offsets relative to start day
    TWICE_PER_WEEK: [1, 4],    // every 3-4 days
    WEEKLY: [7],
  }

  const intervals = intervalDays[frequency]
  if (!intervals) return dates

  if (frequency === 'DAILY') {
    for (let day = 0; day < totalDays; day++) {
      const d = new Date(startDate)
      d.setUTCDate(d.getUTCDate() + day)
      dates.push(d)
    }
  } else if (frequency === 'WEEKLY') {
    for (let week = 0; week < durationWeeks; week++) {
      const d = new Date(startDate)
      d.setUTCDate(d.getUTCDate() + week * 7)
      dates.push(d)
    }
  } else if (frequency === 'THREE_PER_WEEK') {
    // 3 deliveries per week: startDate + 0, +2, +4 days within each week
    for (let week = 0; week < durationWeeks; week++) {
      for (const offset of [0, 2, 4]) {
        const d = new Date(startDate)
        d.setUTCDate(d.getUTCDate() + week * 7 + offset)
        dates.push(d)
      }
    }
  } else if (frequency === 'TWICE_PER_WEEK') {
    // 2 deliveries per week: startDate + 0 and +3 days within each week
    for (let week = 0; week < durationWeeks; week++) {
      for (const offset of [0, 3]) {
        const d = new Date(startDate)
        d.setUTCDate(d.getUTCDate() + week * 7 + offset)
        dates.push(d)
      }
    }
  }

  return dates
}

export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Tomorrow's date (UTC, midnight)
  const tomorrow = new Date()
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1)
  tomorrow.setUTCHours(0, 0, 0, 0)

  const tomorrowEnd = new Date(tomorrow)
  tomorrowEnd.setUTCHours(23, 59, 59, 999)

  // Fetch all non-cancelled orders with user profile and delivery window
  const orders = await prisma.order.findMany({
    where: { status: { not: 'CANCELLED' } },
    include: {
      deliveryWindow: { select: { label: true } },
      user: {
        select: {
          email: true,
          profile: { select: { deliveryAddress: true } },
        },
      },
    },
  })

  let sent = 0
  let errors = 0

  for (const order of orders) {
    const deliveryDates = getDeliveryDates(order.startDate, order.frequency, order.durationWeeks)

    const hasTomorrowDelivery = deliveryDates.some((d) => d >= tomorrow && d <= tomorrowEnd)

    if (!hasTomorrowDelivery) continue

    const email = order.user.email
    const deliveryAddress = order.user.profile?.deliveryAddress ?? ''

    try {
      await sendDeliveryReminder({
        to: email,
        deliveryWindow: order.deliveryWindow,
        deliveryAddress,
      })
      sent++
    } catch (err) {
      console.error(`[cron] Failed reminder for order ${order.id}:`, err)
      errors++
    }
  }

  console.log(`[cron] Delivery reminders: ${sent} sent, ${errors} errors`)
  return NextResponse.json({ data: { sent, errors }, error: null })
}
