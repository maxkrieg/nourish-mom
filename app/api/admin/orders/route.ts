import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'

export async function GET() {
  const { error } = await requireAdmin()
  if (error) return error

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { email: true } },
      items: { include: { menuItem: { select: { name: true, price: true } } } },
    },
  })

  return NextResponse.json({ data: orders, error: null })
}
