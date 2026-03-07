'use server'

import { redirect } from 'next/navigation'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

const RegisterSchema = z
  .object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    next: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export type RegisterState = {
  errors?: {
    email?: string[]
    password?: string[]
    confirmPassword?: string[]
    general?: string[]
  }
}

export async function registerAction(
  _prevState: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  const raw = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    confirmPassword: formData.get('confirmPassword') as string,
    next: (formData.get('next') as string) || undefined,
  }

  const parsed = RegisterSchema.safeParse(raw)
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors }
  }

  const { email, password, next } = parsed.data
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signUp({ email, password })

  if (error) {
    return { errors: { general: [error.message] } }
  }

  if (!data.user) {
    return { errors: { general: ['Registration failed. Please try again.'] } }
  }

  // Create User and empty Profile in DB
  await prisma.user.create({
    data: {
      id: data.user.id,
      email,
      role: 'CUSTOMER',
      profile: {
        create: {
          dietaryRestrictions: [],
          allergies: [],
        },
      },
    },
  })

  redirect(next && next.startsWith('/') ? next : '/menu')
}
