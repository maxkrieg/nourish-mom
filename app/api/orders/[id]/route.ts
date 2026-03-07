import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ data: null, error: 'Unauthorized' }, { status: 401 })
  }

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: { include: { menuItem: { select: { name: true, price: true } } } },
    },
  })

  if (!order) {
    return NextResponse.json({ data: null, error: 'Order not found' }, { status: 404 })
  }

  // Must be the order owner or an admin
  if (order.userId !== user.id) {
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    })
    if (!dbUser || dbUser.role !== 'ADMIN') {
      return NextResponse.json({ data: null, error: 'Forbidden' }, { status: 403 })
    }
  }

  return NextResponse.json({ data: order, error: null })
}
