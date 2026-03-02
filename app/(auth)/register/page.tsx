'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { AuthForm } from '@/components/auth/AuthForm'
import { registerAction, RegisterState } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const initialState: RegisterState = {}

export default function RegisterPage() {
  const [state, formAction, pending] = useActionState(registerAction, initialState)

  return (
    <AuthForm
      title="Create your account"
      description="Start your postpartum nourishment journey today."
    >
      <form action={formAction} className="space-y-5">
        {state.errors?.general && (
          <div className="rounded-xl bg-pink-light border border-pink px-4 py-3 text-sm text-error">
            {state.errors.general[0]}
          </div>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-sm font-semibold text-neutral-text">
            Email address
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className="h-12 rounded-xl border-neutral-border focus-visible:ring-teal"
          />
          {state.errors?.email && (
            <p className="text-sm text-error">{state.errors.email[0]}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-sm font-semibold text-neutral-text">
            Password
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            className="h-12 rounded-xl border-neutral-border focus-visible:ring-teal"
          />
          {state.errors?.password && (
            <p className="text-sm text-error">{state.errors.password[0]}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword" className="text-sm font-semibold text-neutral-text">
            Confirm password
          </Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            placeholder="Repeat your password"
            className="h-12 rounded-xl border-neutral-border focus-visible:ring-teal"
          />
          {state.errors?.confirmPassword && (
            <p className="text-sm text-error">{state.errors.confirmPassword[0]}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={pending}
          className="w-full h-12 rounded-xl bg-teal text-white font-semibold hover:bg-teal-dark transition-all duration-150"
        >
          {pending ? 'Creating account…' : 'Create account'}
        </Button>

        <p className="text-center text-sm text-neutral-muted">
          Already have an account?{' '}
          <Link href="/login" className="text-teal font-medium hover:underline underline-offset-2">
            Sign in
          </Link>
        </p>
      </form>
    </AuthForm>
  )
}
