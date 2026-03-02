'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { AuthForm } from '@/components/auth/AuthForm'
import { loginAction, LoginState } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const initialState: LoginState = {}

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, initialState)

  return (
    <AuthForm
      title="Welcome back"
      description="Sign in to manage your orders and account."
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
            autoComplete="current-password"
            placeholder="Your password"
            className="h-12 rounded-xl border-neutral-border focus-visible:ring-teal"
          />
          {state.errors?.password && (
            <p className="text-sm text-error">{state.errors.password[0]}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={pending}
          className="w-full h-12 rounded-xl bg-teal text-white font-semibold hover:bg-teal-dark transition-all duration-150"
        >
          {pending ? 'Signing in…' : 'Sign in'}
        </Button>

        <p className="text-center text-sm text-neutral-muted">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-teal font-medium hover:underline underline-offset-2">
            Create one
          </Link>
        </p>
      </form>
    </AuthForm>
  )
}
