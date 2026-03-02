import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function requireAdmin(): Promise<
  { userId: string; error: null } | { userId: null; error: NextResponse }
> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return {
      userId: null,
      error: NextResponse.json({ data: null, error: 'Unauthorized' }, { status: 401 }),
    }
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { role: true },
  })

  if (!dbUser || dbUser.role !== 'ADMIN') {
    return {
      userId: null,
      error: NextResponse.json({ data: null, error: 'Forbidden' }, { status: 403 }),
    }
  }

  return { userId: user.id, error: null }
}
