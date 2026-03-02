import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

const ProfileSchema = z.object({
  deliveryAddress: z.string().optional(),
  dietaryRestrictions: z.array(z.string()).optional().default([]),
  allergies: z.array(z.string()).optional().default([]),
  notes: z.string().optional(),
})

export async function PATCH(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ data: null, error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const parsed = ProfileSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { data: null, error: parsed.error.flatten().fieldErrors },
      { status: 400 }
    )
  }

  const { deliveryAddress, dietaryRestrictions, allergies, notes } = parsed.data

  const profile = await prisma.profile.upsert({
    where: { userId: user.id },
    update: { deliveryAddress, dietaryRestrictions, allergies, notes },
    create: {
      userId: user.id,
      deliveryAddress,
      dietaryRestrictions,
      allergies,
      notes,
    },
  })

  return NextResponse.json({ data: profile, error: null })
}
