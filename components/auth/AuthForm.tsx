'use client'

import { ReactNode } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

interface AuthFormProps {
  title: string
  description?: string
  children: ReactNode
}

export function AuthForm({ title, description, children }: AuthFormProps) {
  return (
    <div className="min-h-screen bg-neutral-bg flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <span className="text-2xl font-bold tracking-tight text-teal">
            Nourish Mom
          </span>
        </div>

        <Card className="rounded-2xl border border-neutral-border shadow-sm bg-white p-2">
          <CardHeader className="pb-4">
            <CardTitle className="text-[28px] font-bold tracking-tight text-neutral-text">
              {title}
            </CardTitle>
            {description && (
              <CardDescription className="text-sm text-neutral-muted leading-relaxed">
                {description}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>{children}</CardContent>
        </Card>
      </div>
    </div>
  )
}
