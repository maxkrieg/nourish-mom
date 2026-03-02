import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const windows = await prisma.deliveryWindow.findMany({
      where: { active: true },
      orderBy: { startTime: 'asc' },
    })
    return NextResponse.json({ data: windows, error: null })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ data: null, error: 'Failed to fetch delivery windows' }, { status: 500 })
  }
}
