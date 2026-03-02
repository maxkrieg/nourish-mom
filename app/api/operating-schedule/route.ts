import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const schedule = await prisma.operatingSchedule.findMany({
      orderBy: { dayOfWeek: 'asc' },
    })
    return NextResponse.json({ data: schedule, error: null })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ data: null, error: 'Failed to fetch operating schedule' }, { status: 500 })
  }
}
