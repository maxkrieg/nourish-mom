import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'

const CreateMenuItemSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  tags: z.array(z.string()).default([]),
  price: z.number().int().min(0, 'Price must be a positive integer (cents)'),
  available: z.boolean().default(true),
})

export async function POST(request: Request) {
  const { error } = await requireAdmin()
  if (error) return error

  const body = await request.json()
  const parsed = CreateMenuItemSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ data: null, error: parsed.error.flatten().fieldErrors }, { status: 400 })
  }

  const item = await prisma.menuItem.create({ data: parsed.data })
  return NextResponse.json({ data: item, error: null }, { status: 201 })
}
