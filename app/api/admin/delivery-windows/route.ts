import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'

const CreateWindowSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Use HH:MM format'),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, 'Use HH:MM format'),
  capacity: z.number().int().min(1, 'Capacity must be at least 1'),
})

export async function POST(request: Request) {
  const { error } = await requireAdmin()
  if (error) return error

  const body = await request.json()
  const parsed = CreateWindowSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ data: null, error: parsed.error.flatten().fieldErrors }, { status: 400 })
  }

  const window = await prisma.deliveryWindow.create({ data: parsed.data })
  return NextResponse.json({ data: window, error: null }, { status: 201 })
}
