import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'

const UpdateMenuItemSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  tags: z.array(z.string()).optional(),
  price: z.number().int().min(0).optional(),
  available: z.boolean().optional(),
})

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin()
  if (error) return error

  const { id } = await params
  const body = await request.json()
  const parsed = UpdateMenuItemSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ data: null, error: parsed.error.flatten().fieldErrors }, { status: 400 })
  }

  const item = await prisma.menuItem.update({
    where: { id },
    data: parsed.data,
  })
  return NextResponse.json({ data: item, error: null })
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin()
  if (error) return error

  const { id } = await params

  // Only delete if no associated orders
  const orderCount = await prisma.orderItem.count({ where: { menuItemId: id } })
  if (orderCount > 0) {
    return NextResponse.json(
      { data: null, error: 'Cannot delete a menu item that has associated orders.' },
      { status: 409 }
    )
  }

  await prisma.menuItem.delete({ where: { id } })
  return NextResponse.json({ data: { id }, error: null })
}
