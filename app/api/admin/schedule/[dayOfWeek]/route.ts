import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'

const UpdateScheduleSchema = z.object({
  open: z.boolean(),
})

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ dayOfWeek: string }> }
) {
  const { error } = await requireAdmin()
  if (error) return error

  const { dayOfWeek } = await params
  const day = parseInt(dayOfWeek, 10)

  if (isNaN(day) || day < 0 || day > 6) {
    return NextResponse.json({ data: null, error: 'Invalid dayOfWeek (0–6)' }, { status: 400 })
  }

  const body = await request.json()
  const parsed = UpdateScheduleSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ data: null, error: parsed.error.flatten().fieldErrors }, { status: 400 })
  }

  const schedule = await prisma.operatingSchedule.upsert({
    where: { id: `day-${day}` },
    update: { open: parsed.data.open },
    create: { id: `day-${day}`, dayOfWeek: day, open: parsed.data.open },
  })

  return NextResponse.json({ data: schedule, error: null })
}
