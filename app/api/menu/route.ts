import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const items = await prisma.menuItem.findMany({
    orderBy: [{ available: 'desc' }, { createdAt: 'asc' }],
  })

  return NextResponse.json({ data: items, error: null })
}
